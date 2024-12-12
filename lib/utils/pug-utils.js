const path = require('path');
const lex = require('pug-lexer');

const CACHED_TOKEN_PROCESSOR_STATE_CONTAINER_MAP = {};
const CACHED_PUG_CONTENT_RETURN_CONTENT_MAP = new Map();

function processRule(context, tokenProcessor) {
  if (!checkIsVueFile(context)) {
    return {};
  }

  const optionsHash = JSON.stringify(context.options);
  const { tokens, text } = parsePugContent(context);
  const cacheKey = `${optionsHash}\n${text}`;

  if (tokens.length === 0) {
    return {};
  }

  const tokenProcessorReturn = tokenProcessor();

  const tokenProcessors = CACHED_TOKEN_PROCESSOR_STATE_CONTAINER_MAP[cacheKey];
  if (!tokenProcessors) {
    CACHED_TOKEN_PROCESSOR_STATE_CONTAINER_MAP[cacheKey] = {
      tokenProcessors: [],
      alreadyProcessed: false,
    };
  }
  CACHED_TOKEN_PROCESSOR_STATE_CONTAINER_MAP[cacheKey].tokenProcessors.push(
    tokenProcessorReturn
  );

  return {
    'Program:exit'() {
      const tokenProcessorStateContainer =
        CACHED_TOKEN_PROCESSOR_STATE_CONTAINER_MAP[cacheKey] || {
          tokenProcessors: [],
          alreadyProcessed: true,
        };

      if (
        tokenProcessorStateContainer.alreadyProcessed ||
        tokenProcessorStateContainer.tokenProcessors.length === 0
      ) {
        return;
      }

      for (let index = 0; index < tokens.length; index++) {
        const token = tokens[index];
        tokenProcessorStateContainer.tokenProcessors.forEach(
          (tokenProcessor) => {
            if (tokenProcessor[token.type]) {
              tokenProcessor[token.type](token, { index, tokens });
            }
          }
        );
      }

      tokenProcessorStateContainer.alreadyProcessed = true;
    },
  };
}

function checkIsVueFile(context) {
  const parserServices = context.parserServices;
  if (parserServices.defineTemplateBodyVisitor == null) {
    const filename = context.getFilename();
    if (path.extname(filename) === '.vue') {
      context.report({
        loc: { line: 1, column: 0 },
        message:
          'Use the latest vue-eslint-parser. See also https://eslint.vuejs.org/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error.',
      });
    }
    return false;
  }
  return true;
}

function extractPugTemplate(context) {
  const parserServices = context.parserServices;

  const df = parserServices.getDocumentFragment?.();
  if (!df) {
    return {};
  }

  const pugTemplateElement = df.children.find(
    (node) =>
      node.type === 'VElement' &&
      node.name === 'template' &&
      node.startTag.attributes.some(
        (attr) =>
          !attr.directive &&
          attr.key.name === 'lang' &&
          attr.value &&
          attr.value.value === 'pug'
      )
  );

  const rawText = context.getSourceCode().text;

  if (!pugTemplateElement) {
    return { df, rawText };
  }

  const pugText = rawText.slice(
    pugTemplateElement.startTag.range[1],
    pugTemplateElement.endTag?.range[0]
  );

  return { df, pugTemplateElement, rawText, pugText };
}

function parsePugContent(context) {
  const { df, pugTemplateElement, rawText = '', pugText = '' } =
    extractPugTemplate(context);

  const cacheKey = rawText;
  const cachedValue = CACHED_PUG_CONTENT_RETURN_CONTENT_MAP.get(cacheKey);
  if (cachedValue) {
    return cachedValue;
  }

  const result = { text: '', tokens: [] };

  if (!df || !pugTemplateElement) {
    CACHED_PUG_CONTENT_RETURN_CONTENT_MAP.set(cacheKey, result);
    return result;
  }

  const pugTokens = [];
  try {
    pugTokens.push(...lex(pugText));
  } catch (error) {
    CACHED_PUG_CONTENT_RETURN_CONTENT_MAP.set(cacheKey, result);
    return result;
  }

  let start = pugTemplateElement.startTag.range[1];

  if (pugTokens[0]?.type === 'newline') {
    start++;
  }

  let end = start;

  const startLineOffset = pugTemplateElement.startTag.loc.start.line - 1;
  const endLineOffset = pugTemplateElement.startTag.loc.end.line - 1;

  for (let index = 0; index < pugTokens.length; index++) {
    const token = pugTokens[index];
    const previousToken = pugTokens[index - 1];

    if (previousToken) {
      if (token.loc.start.line !== previousToken.loc.end.line) {
        start += token.loc.start.column;
        if (previousToken.type === 'attribute') {
          start++;
        }
      } else {
        const diff = token.loc.start.column - previousToken.loc.end.column;
        start += diff;
      }
    }

    end = start + tokenLength(token, previousToken);
    token.range = [start, end];

    token.loc.start.line += startLineOffset;
    token.loc.end.line += endLineOffset;

    start = end;
  }

  result.text = pugText;
  result.tokens = pugTokens;
  CACHED_PUG_CONTENT_RETURN_CONTENT_MAP.set(cacheKey, result);
  return result;
}

function tokenLength(token, previousToken) {
  if (token.type === 'newline') {
    const length = token.loc.end.column - token.loc.start.column;
    const diff = token.loc.start.line - (previousToken?.loc.end.line ?? 1);
    return length + (diff - 1);
  }

  if (
    token.type === 'end-attributes' &&
    previousToken?.type === 'attribute' &&
    token.loc.start.line - 1 === previousToken.loc.end.line
  ) {
    return 0;
  }

  if (
    token.type === 'outdent' &&
    previousToken &&
    token.loc.start.line - 1 > previousToken.loc.end.line
  ) {
    return token.loc.end.column;
  }

  if (token.loc.start.line === token.loc.end.line) {
    return token.loc.end.column - token.loc.start.column;
  }

  console.debug('Please report token:', JSON.stringify(token));
  return 0;
}

function findIndexFrom(arr, predicate, fromIndex) {
  const index = arr.slice(fromIndex).findIndex(predicate);
  return index === -1 ? -1 : index + fromIndex;
}

module.exports = {
  processRule,
  checkIsVueFile,
  extractPugTemplate,
  parsePugContent,
  tokenLength,
  findIndexFrom,
};

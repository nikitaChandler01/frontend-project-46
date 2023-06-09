import _ from 'lodash';

const createIndent = (depth) => {
  const replacer = '  ';
  const resultIndentCount = depth * 2;
  const indents = {
    openBracket: replacer.repeat(resultIndentCount - 1),
    closeBracket: replacer.repeat(resultIndentCount - 2),
  };
  return indents;
};

const stringify = (data, depth) => {
  if (!_.isObject(data)) return String(data);
  const indents = createIndent(depth);
  const lines = Object.entries(data).map(([key, value]) => {
    if (!_.isObject(value)) return `${indents.openBracket}  ${key}: ${value}`;
    return `${indents.openBracket}  ${key}: ${stringify(value, depth + 1)}`;
  });
  return ['{', ...lines, `${indents.closeBracket}}`].join('\n');
};

const stylish = (tree, depth = 1) => {
  const indents = createIndent(depth);
  const items = tree.map(({
    name, value, value1, value2, type, children,
  }) => {
    const makeValue = stringify(value, depth + 1);
    switch (type) {
      case '+':
        return `${indents.openBracket}+ ${name}: ${makeValue}`;
      case '-':
        return `${indents.openBracket}- ${name}: ${makeValue}`;
      case 'changed':
        return `${indents.openBracket}- ${name}: ${stringify(value1, depth + 1)}\n${indents.openBracket}+ ${name}: ${stringify(value2, depth + 1)}`;
      case 'unchanged':
        return `${indents.openBracket}  ${name}: ${makeValue}`;
      case 'children':
        return `${indents.openBracket}  ${name}: ${stylish(children, depth + 1)}`;
      default:
        throw new Error('Unknown type.');
    }
  });
  return ['{', ...items, `${indents.closeBracket}}`].join('\n');
};

export default stylish;

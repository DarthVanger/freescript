import querySelectors from './querySelectors.js';
import domEvents from './domEvents.js';
import commands from 'commands.js';

const args = process.argv.slice(2);
const [filename] = args;

let text;
fs.readFile(filename, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  text = data;

  const expressions = categorizeExpressions(text);
  console.log('Parsed expressions: ', expressions);

  expressions.forEach(e => e.type === 'command' && executeCommand(e));
});

function executeCommand (expression) {
  console.log('hellloo');
  const commandName = expression.text;
  console.log('Command to execute: ', commandName);

  // finds commands['show text'] = (text) => document.print(text)
  const commandJsFunction = commands[commandName];
  console.log('commandJsFunction: ', commandJsFunction.toString());

  const executeCurrentCommand = () => commandJsFunction(findCommandArguments({ expression }));

  console.log('executeCurrentCommand: ', executeCurrentCommand.toString());

  executeCurrentCommand();
}

function categorizeExpressions(text) {
  const expressions = [];

  addExpressions({
    match: text.match(new RegExp(querySelectors.join('|'))),
    type: 'querySelector'
  });
  addExpressions({
    match: text.match(new RegExp(domEvents.join('|'))),
    type: 'domEvent'
  });
  addExpressions({
    match: text.match(new RegExp(Object.keys(commands).join('|'))),
    type: 'command'
  });

  return expressions.sort((e1, e2) => e1.index - e2.index);

  function addExpressions({ match, type }) {
    expressions.push({
      text: match[0],
      type,
      index: match.index,
    });
  }
}

function findCommandArguments({ expression }) {
  const firstLineEndingAfterCommandIndex = text.indexOf('\n', expression.index);
  const indexOfCommandEndingInText = expression.index + expression.text.length;
  const commandArgument = text.substr(firstLineEndingAfterCommandIndex, indexOfCommandEndingInText);
  return commandArgument;
}

  // return true if word is a dom event name e.g. 'click', 'mousemove', etc
  function isDomEvent(word) {
    for (let i=0; i<eventNames.length; i++) {
      if (fuzzyMatch(eventNames[i], word)) {
        return true;
      }
    }
  }

  // match even if 1 letter is misspelled
  function fuzzyMatch(e, w) {
    // just using equals for now :)
    return e == w;
  }

  function isQuerySelector(word) {
    return word == 'button';
  }

  function isCommand(word) {
    return fuzzyMatch(word, commands);
  }

function old() {
  const lines = code.split('/n')

  lines.forEach(l => {
    // array of words like ['potato', 'sugar', 'milk']
    const words = l.trim().split(/\s+/);

    // map each word to array { potato: [], sugar: [] }
    const wordsCategoriesMap = {};
    words.forEach(w => {
      wordsCategoriesMap[w] = [];
    });

    words.forEach(w => {
      if (isQuerySelector(w)) {
        wordsCategoriesMap[w].push('QuerySelector');
      }

      if (isDomEvent(w)) {
        wordsCategoriesMap[w].push('DomEvent');
      }

      if (isCommand(w)) {
        wordsCategoriesMap[w].push('Command');
      }
    });

  });

    console.log('wordsCategoriesMap: ', wordsCategoriesMap);
export parser;}

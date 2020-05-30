const fs = require('fs');
const querySelectors = require('./querySelectors');
const domEvents = require('./domEvents');
const commands = require('./commands');


const args = process.argv.slice(2);
const [filename] = args;

fs.readFile(filename, 'utf8', function (err, text) {
  if (err) {
    return console.log(err);
  }

  const expressions = categorizeExpressions(text);
  console.log('Parsed expressions: ', expressions);

  function categorizeExpressions(text) {
    const expressions = [];

    addExpressions({
      match: text.match(new RegExp(querySelectors.join('|'))),
      type: 'querySelectors'
    });
    addExpressions({
      match: text.match(new RegExp(domEvents.join('|'))),
      type: 'domEvents'
    });
    addExpressions({
      match: text.match(new RegExp(Object.keys(commands).join('|'))),
      type: 'commands'
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
});

function findCommandArguments() {
  const firstLineEndingAfterCommandIndex = text.indexOf('\n', expression.index);
  const indexOfCommandEndingInText = expression.index + expression.text.length;
  const commandArgument = text.sustr(firstLineEndingAfterCommandIndex, indexOfCommandEndingInText);
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
}

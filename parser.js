import querySelectors from './querySelectors.js';
import domEvents from './domEvents.js';
import commands from './commands.js';
const editor = document.querySelector('#freecode-editor');

let text;
function parse(textToParse) {
  text = textToParse;
  const expressions = categorizeExpressions(text);
  console.log('Parsed expressions: ', expressions);

  let highlightedEditorText = text;
  expressions.forEach(hightlightExpressionInEditor);
  function hightlightExpressionInEditor(e) {
    const expressionIndex = highlightedEditorText.indexOf(e.text);
    const expressionLength = e.text.length;
    const backgroundColors = {
      querySelector: '#007bff',
      domEvent: '#28a745' ,
      command: '#ffc107',
    };

    const bgColor = backgroundColors[e.type];

    highlightedEditorText = `
      ${highlightedEditorText.substring(0, expressionIndex)}
      <span style="background-color: ${bgColor}" class="wrapper"/>
        ${e.text}
        <span class="tooltip" style="background-color: ${bgColor}; border-top-color: ${bgColor}">${e.type}</span>
      </span>
      ${highlightedEditorText.substring(expressionIndex + expressionLength)}
    `;

    highlightedEditorText = highlightedEditorText.split('\n').map(l => l.replace(/\s+[<]/g, '<')).join('');

    editor.innerHTML = highlightedEditorText;
  }

  expressions.forEach(e => e.type === 'command' && executeCommand(e));
    
};

function executeCommand (expression) {
  const commandName = expression.text;
  console.log('Command to execute: ', commandName);

  // finds commands['show text'] = (text) => document.print(text)
  const commandJsFunction = commands[commandName];
  console.log('commandJsFunction: ', commandJsFunction.toString());

  const commandArgument = findCommandArgument({ expression });
  console.log('commandArgument: ', commandArgument);
  const executeCurrentCommand = () => commandJsFunction(commandArgument);

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

function findCommandArgument({ expression }) {
  console.log('expression: ', expression);
  const indexOfCommandEndingInText = expression.index + expression.text.length;
  console.log('indexOfCommandEndingInText: ', indexOfCommandEndingInText);
  const textAfterCommand = text.substring(indexOfCommandEndingInText);
  console.log('textAfterCommand: ', textAfterCommand);
  const firstLineEndingAfterCommandIndex = textAfterCommand.match('<br>').index;
  const commandArgument = textAfterCommand.substring(0, firstLineEndingAfterCommandIndex);
  return commandArgument;
}

export {
  parse,
};

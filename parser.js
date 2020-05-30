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
    //highlightedEditorText = editor.innerText;
    const expressionIndex = highlightedEditorText.indexOf(e.text);
    const expressionLength = e.text.length;
    const backgroundColors = {
      querySelector: '#007bff',
      domEvent: '#28a745' ,
      command: '#ffc107',
    };

    highlightedEditorText = `
      ${highlightedEditorText.substring(0, expressionIndex)}
      <span style="background-color: ${backgroundColors[e.type]}"/>${e.text}</span>
      ${highlightedEditorText.substring(expressionIndex + expressionLength)}
    `;

    editor.innerHTML = highlightedEditorText;
  }

  //expressions.forEach(e => e.type === 'command' && executeCommand(e));
    
};

function executeCommand (expression) {
  console.log('hellloo');
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
  const indexOfCommandEndingInText = expression.index + expression.text.length;
  const textAfterCommand = text.substring(indexOfCommandEndingInText);
  const firstLineEndingAfterCommandIndex = textAfterCommand.match(/\n/).index;
  const commandArgument = textAfterCommand.substring(0, firstLineEndingAfterCommandIndex);
  return commandArgument;
}

export {
  parse,
};

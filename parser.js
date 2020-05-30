import querySelectors from './querySelectors.js';
import domEvents from './domEvents.js';
import commands from './commands.js';
const editor = document.querySelector('#freecode-editor');
const jsOutput = document.querySelector('#js-output');

let text;
let highlightedEditorText;
let expressions;

function parse(textToParse) {
  text = textToParse;
  highlightedEditorText = text;
  jsOutput.innerHTML = '';
  console.log('textToParse: ', textToParse);
  expressions = categorizeExpressions(text);
  console.log('Parsed expressions: ', expressions);

  expressions.forEach(hightlightExpressionInEditor);
  expressions.forEach(e => e.type === 'command' && compileCommand(e));
};

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
    

function compileCommand(expression) {
  const commandName = expression.text;
  console.log('Command to execute: ', commandName);

  // finds commands['show text'] = (text) => document.print(text)
  const commandJsFunctionText = commands[commandName].toString().split('\n').map(l => l.replace('  ', '')).join('\n');
  console.log('commandJsFunction: ', commandJsFunctionText);

  const functionName = commandName.replace(' ', '');
  const commandFunctionCode = `const ${functionName} = ${commandJsFunctionText}\n\n`;
  console.log('commandFunctionCode: ', commandFunctionCode);

  jsOutput.innerText = jsOutput.innerText + commandFunctionCode;

  const commandArgument = findCommandArgument({ expression });
  console.log('commandArgument: ', commandArgument);

  const querySelector = findLastMentionedQuerySelector(expression);
  const domEvent = findLastMentionedDomEvent(expression);

  console.log('querySelector: ', querySelector);
  console.log('domEvent: ', domEvent);

  const callCode = `() => ${functionName}('${commandArgument}')`;

  const code = `
document
  .querySelector('${querySelector}')
  .addEventListener(${callCode});
  `;

  jsOutput.innerText = jsOutput.innerText + code;

  //const executeCurrentCommand = () => commandJsFunction(commandArgument);

  //console.log('executeCurrentCommand: ', executeCurrentCommand.toString());

  //executeCurrentCommand();

}

function findLastMentionedQuerySelector(expression) {
   return expressions.find(e => ( 
    e.type === 'querySelector' &&
    e.index < expression.index
  )).text;
}

function findLastMentionedDomEvent(expression) {
  return expressions.find(e => ( 
    e.type === 'domEvent' &&
    e.index < expression.index
  )).text;
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
  const commandArgument = textAfterCommand.substring(1, firstLineEndingAfterCommandIndex);
  return commandArgument;
}

export {
  parse,
};

import { parse } from './parser.js';


const freeCodeText = `
button on click<br>
show text Hello world :)<br>
`;

const editor = document.querySelector('#freecode-editor');
const jsOutput = document.querySelector('#js-output');


const text = freeCodeText.trim();
editor.innerText = text;

parse(text);

editor.addEventListener('focus', (e) =>{
  editor.innerText = text;
});

editor.addEventListener('input', (e) =>{
  console.log('e: ', e);
  parse(editor.innerText)
});



import { parse } from './parser.js';


const freeCodeText = `
button on click
show text Hello world :)
`;

const editor = document.querySelector('#freecode-editor');
const jsOutput = document.querySelector('#js-output');


const text = freeCodeText.trim();
editor.innerText = text;

parse(text);

editor.addEventListener('input', (e) =>{
  console.log('e: ', e);
  parse(editor.innerText)
});



import { parse } from './parser.js';


const freeCodeText = `
button on click<br>
show text <h1>Hello world :)</h1><br>
sss
`;

const editor = document.querySelector('#freecode-editor');
const jsOutput = document.querySelector('#js-output');


const text = freeCodeText.trim();
editor.innerText = text;

parse(text);
editor.addEventListener('change', () => {
  jsOutput.innerHTML = `<pre>${parse(text)}</pre>`;
});



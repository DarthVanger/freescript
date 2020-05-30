# FreeScript
Compile free speech into JavaScript.

![compilation demo](freescript.png?raw=true)

Try it out in live editor: https://darthvanger.github.io/freescript/

## What can it parse currently :-)
The MVP is very basic: there are 3 types of expressions:
1. `querySelector` (e.g. 'button')
2. `domEvent` (e.g. 'click')
3. `command` (e.g. 'show text')

Parser finds matches, highlighting them in the editor.

Each command has a corresponding hardcoded JS code  (see  [commands.js]( https://github.com/DarthVanger/freescript/blob/master/commands.js), currently there is only one command :)).

For each comamnd parser finds a last mention of `querySelector` (e.g. 'button') and `domEvent` (e.g. 'click')  in the text.

Complier simply generates JS code to execute the predefined command when `domEvent` happens for an element found by `querySelector`.

## How it works

#### There are hardcoded strings to match against
For each type of "expressions" there is a hardcoded array of strings which parser would match.

##### [Query selectors](https://github.com/DarthVanger/freescript/blob/master/querySelectors.js)
```
const querySelectors = [
  'button',
   ...
]
```

#### [Dom Events](https://github.com/DarthVanger/freescript/blob/master/domEvents.js)
```
const domEvents = [
  'click',
  ...
]
```

##### [Commands](https://github.com/DarthVanger/freescript/blob/master/commands.js)
```
const commands = {
  'show text': (text) => window.alert(text)
};
```

#### Matched expressions are categorized by type
For a given FreeScript code:
```
button on click
show text <h1>Hello world :)</h1>
```

Parsed expressions are:
```
[
  { text: 'button', type: 'querySelectors', index: 0 },
  { text: 'click', type: 'domEvents', index: 10 },
  { text: 'show text', type: 'commands', index: 16 }
]
```

#### `querySelector` and `domEvent` get linked to the command

For each comamnd parser finds a last mentioned `querySelector` and `domEvent`.

Compiler assumes the command is to be exectured for the element matching `querySelector` when `domEvent` happens.

Command argument is everything after the command until the line ending. 

#### Compilation: code is simply generated from a template

Having the command's JS code, `querySelector` and `domEvent`, code is simply generated from a template like this:

```
document
  .querySelector(${querySelector})
  .addEventListener(${domEvent}, ${jsFuntionCorrespondingToTheCommand});
```

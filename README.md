The MVP is quite basic: there are 3 types of experssions

#### Query selectors
```
const querySelectors = [
  'button',
   ...
]
```

#### Dom Events
```
const domEvents = [
  'click',
  ...
]
```

#### Commands
```
const commands = {
  'show text': (text) => document.print(text)
};
```

### Text is categorized by expression type
Free script code
```
button on click
show text <h1>Hello world :)</h1>
```

Parsed expressions:
```
const expressions = [
  {
     text: 'button',
     type: 'querySelector'
     index: 0,
  },
  {
     text: 'click',
     type: 'domEvent',
     index 10,
  }
  {
     text: 'show text',
     type: 'command',
     index: 15,
  }
]

Compiler execudes commands one by one.

```
expressions.forEach(e => e.type === 'command' && executeCommand(e));
```

`executeCommand(expr)` finds the command in `command.js`
```
const executeCommand = (expression) => {
  const commandName = expression.text;

  // finds commands['show text'] = (text) => document.print(text)
  const command = commands[commandName];
```

Now we have a function to execute, but we also need to parse arguments.

Arguments is simply everything after the command until a line ending.

```
  // it will be () => document.print('<h1>Hello world :)</h1>');
  const callCommand = () => command(findCommandArguments());
}
```

Now we need to figure out when to call the command.

We find the last mentioned dom event: a dom event with expression index less than command expression index

```
const findLastMentionedDomEvent = expressions.find(e => ( 
  e.type === 'domEvent' &&
  e.index < command.expression.index
)
```

Also find the last mentioned query selector
```
const findLastMentionedQuerySelector = expressions.reverse().find(e => ( 
  e.type === 'querySelector' &&
  e.index < command.expression.index
)
```

Finally, we can make an element matched by `querySelector` react to mentioned event by executing the mentioned command

```
document
  .querySelector(findLastMentionedQuerySelector())
  .addEventListener(findLastMentionedDomEvent, command);
```

### Compiled code

Compiled code:
```
document
  .querySelector('button')
  .addEventListener('click', () => document.print('<h1>Hello world :)</h1>');
```

FreeScript code:
```
button on click
show text <h1>Hello world :)</h1>
```
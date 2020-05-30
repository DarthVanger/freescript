const commands = {
  'show text': (text) => {
    const div = document.createElement('div');
    div.innerHTML = text;
    document.body.appendChild(div);
  }
};

export default commands;

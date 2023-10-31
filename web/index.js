const form = document.getElementById('form');
const input = document.getElementById('prompt-input');

const res = document.getElementById('result');

const generateResponse = (value) => {
  return 'This is a sample response';
};

const responseTemplate = (value) => {
  return `
    <div class="chat-block">
        <div class="display-prompt">${value}</div>
        <div class="display-response"></div>
    </div>
  `;
};
const submitHandler = (event) => {
  event.preventDefault();
  const value = input.value;
  input.value = '';
  res.insertAdjacentHTML('beforeend', responseTemplate(value));
  const out = generateResponse();
  const outEL = res.lastElementChild;
  outEL.querySelector('.display-response').innerText = out;
  outEL.scrollIntoView();
};

form.addEventListener('submit', submitHandler);

const form = document.getElementById('form');
const input = document.getElementById('prompt-input');

const res = document.getElementById('result');

const generateResponse = async (value) => {
  const res = await fetch('/api/v1/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value }),
  });
  const data = await res.json();
  console.log(data);
  return data.output;
};

const responseTemplate = (value) => {
  return `
    <div class="chat-block">
        <div class="display-prompt">${value}</div>
        <div class="display-response loading">........</div>
    </div>
  `;
};
const submitHandler = async (event) => {
  event.preventDefault();
  const value = input.value;
  input.value = '';
  res.insertAdjacentHTML('beforeend', responseTemplate(value));
  const out = await generateResponse(value);
  const outEL = res.lastElementChild;
  outEL.querySelector('.display-response').classList.remove = 'loading';
  outEL.querySelector('.display-response').innerText = out;
  outEL.scrollIntoView();
};

form.addEventListener('submit', submitHandler);

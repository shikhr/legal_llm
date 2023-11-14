const form = document.getElementById('form');
const input = document.getElementById('prompt-input');

const modelsEl = document.getElementById('models');
const allModels = modelsEl.querySelectorAll('.model');
const res = document.getElementById('result');

const state = {
  ipc: [],
  ildc: [],
};

const modelslist = ['ipc', 'ildc'];
const curModel = {
  name: 'ildc',
};

const renderResponses = (responses) => {
  const res = document.getElementById('result');
  const responseHTML = responses.map((response) => {
    return responseTemplate(response.id, response.prompt, response.output);
  });
  res.innerHTML = responseHTML.join('');
  const outEL = res.lastElementChild;
  outEL.scrollIntoView();
};

const generateResponse = async (value, model_name) => {
  try {
    const res = await fetch('/api/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value, model_name }),
    });
    if (!res.ok) {
      throw Error(res.statusText);
    }
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    return { output: 'Something went wrong...', has_error: true };
  }
};

const responseTemplate = (id, prompt, output) => {
  return `
    <div id="${id}" class="chat-block">
        <div class="display-prompt">${prompt}</div>
        <div class="display-response ${!output && 'loading'}">${
    output ? output : '<div class="dot dot-flashing"></div>'
  }</div>
    </div>
  `;
};

const submitHandler = async (event) => {
  event.preventDefault();
  const value = input.value;
  const id = new Date().getTime();
  input.value = '';
  res.insertAdjacentHTML('beforeend', responseTemplate(id, value));
  const data = await generateResponse(value, curModel.name);
  state[curModel.name].push({
    id,
    prompt: value,
    output: data.output,
  });
  const outEL = res.lastElementChild;
  const outElResult = outEL.querySelector('.display-response');
  outElResult.classList.remove('loading');
  if (data.has_error) {
    outElResult.classList.add('error');
  }
  outElResult.innerText = data.output;
  outEL.scrollIntoView();
};

const modelChangeHandler = (e) => {
  if (!e.target.closest('.model')) {
    return;
  }
  const modelEl = e.target.closest('.model');
  if (modelEl.classList.contains('current')) {
    return;
  }
  for (const submodel of allModels) {
    submodel.classList.toggle('current');
  }
  res.innerHTML = '';
  curModel.name = modelEl.id;
  renderResponses(state[curModel.name]);
};

modelsEl.addEventListener('click', modelChangeHandler);
form.addEventListener('submit', submitHandler);

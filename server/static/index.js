const form = document.getElementById('form');
const input = document.getElementById('prompt-input');

const res = document.getElementById('result');

const generateResponse = async (value) => {
  try {
    const res = await fetch('/api/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
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

const responseTemplate = (value) => {
  return `
    <div class="chat-block">
        <div class="display-prompt">${value}</div>
        <div class="display-response loading"><div class="dot dot-flashing"></div></div>
    </div>
  `;
};

const submitHandler = async (event) => {
  event.preventDefault();
  const value = input.value;
  input.value = '';
  res.insertAdjacentHTML('beforeend', responseTemplate(value));
  const data = await generateResponse(value);
  const outEL = res.lastElementChild;
  const outElResult = outEL.querySelector('.display-response');
  outElResult.classList.remove('loading');
  if (data.has_error) {
    outElResult.classList.add('error');
  }
  outElResult.innerText = data.output;
  outEL.scrollIntoView();
};

form.addEventListener('submit', submitHandler);

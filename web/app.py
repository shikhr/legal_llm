from js import document, console
def submit_handler(event = None):
    if event:
        event.preventDefault()
        inp = document.querySelector("#prompt-input")
        res = document.querySelector('#res')
        res.innerText = inp.value


Element("form").element.onsubmit = submit_handler
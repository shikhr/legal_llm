from transformers import (
    PreTrainedTokenizerFast,
    GPT2LMHeadModel,
    GPT2TokenizerFast,
    GPT2Tokenizer,
)

model_path = "model/full_text"

model = GPT2LMHeadModel.from_pretrained(model_path)
tokenizer = GPT2Tokenizer.from_pretrained(model_path)


def generate_text(sequence, max_length):
    ids = tokenizer.encode(f"{sequence}", return_tensors="pt")
    final_outputs = model.generate(
        ids,
        do_sample=True,
        max_length=max_length,
        pad_token_id=model.config.eos_token_id,
        top_k=50,
        top_p=0.95,
    )
    return tokenizer.decode(final_outputs[0], skip_special_tokens=True)


def generate_output(seq):
    max_len = 200
    output = generate_text(seq, max_len)
    print(output)
    return output[len(seq) :]

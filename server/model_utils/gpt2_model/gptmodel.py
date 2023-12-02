from transformers import (
    PreTrainedTokenizerFast,
    GPT2LMHeadModel,
    GPT2TokenizerFast,
    GPT2Tokenizer,
)
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os

model_path = {"ipc": "model/ipc", "ildc": "model/full_text"}


def load_model(model_path):
    model = GPT2LMHeadModel.from_pretrained(model_path)
    return model


def load_tokenizer(tokenizer_path):
    tokenizer = GPT2Tokenizer.from_pretrained(tokenizer_path)
    return tokenizer


def generate_text(model_path, sequence, max_length):
    offset = len(sequence) + 1
    sequence += "<|endoftext|>"
    model = load_model(model_path)
    tokenizer = load_tokenizer(model_path)
    ids = tokenizer.encode(f"{sequence}", return_tensors="pt")
    final_outputs = model.generate(
        ids,
        do_sample=True,
        max_length=max_length,
        pad_token_id=model.config.eos_token_id,
        top_k=50,
        top_p=0.95,
        num_return_sequences=3,
    )
    out = [
        tokenizer.decode(out, skip_special_tokens=True)[offset:]
        for out in final_outputs
    ]
    sentences = [sequence[: offset - 1]] + out

    model_path = os.path.join(os.getcwd(), "model/InLegalBERT")
    model = SentenceTransformer(model_path)
    print("")
    sen_embeddings = model.encode(sentences)
    similarity = cosine_similarity([sen_embeddings[0]], sen_embeddings[1:])[0]
    for sen, sim in zip(sentences[1:], similarity):
        print("\n", sen, "  : ", sim)
    return sentences[np.argmax(similarity) + 1], np.max(similarity)


def generate_output(model_name, seq):
    max_len = 300
    output, similarity = generate_text(model_path[model_name], seq, max_len)
    print("\noutput\n", output)
    print("similarity:", similarity)
    return output

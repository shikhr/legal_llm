import torch
import torch.nn as nn
import torch.optim as optim
import torch.utils.data as data
import torchtext
from torchtext.data import get_tokenizer
from torchtext.vocab import vocab
import numpy as np

device = "cuda" if torch.cuda.is_available() else "cpu"

tokenizer = get_tokenizer("basic_english")

best_model, _, vocab = torch.load(
    "./model/rnn_model/textmodel.pth", map_location=torch.device("cpu")
)
n_vocab = len(vocab)


class TextModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=1, hidden_size=256, num_layers=2, batch_first=True, dropout=0.2
        )
        self.dropout = nn.Dropout(0.2)
        self.linear = nn.Linear(256, n_vocab)

    def forward(self, X):
        x, _ = self.lstm(X)
        x = x[:, -1, :]
        x = self.linear(self.dropout(x))
        return x


model = TextModel()
model.load_state_dict(best_model)
model.to(device)


def generate_output(data):
    tkns = tokenizer(data)
    pattern = vocab.lookup_indices(tkns)
    model.eval()
    out = ""
    with torch.no_grad():
        for i in range(200):
            # format input array of int into PyTorch tensor
            x = np.reshape(pattern, (1, len(pattern), 1)) / float(n_vocab)
            x = torch.tensor(x, dtype=torch.float32)
            # generate logits as output from the model
            prediction = model(x.to(device))
            # convert logits into one character
            index = int(prediction.argmax())
            result = vocab.lookup_tokens([index])[0]
            # print(result, end="")
            out = out + " " + result
            # append the new character into the prompt for the next iteration
            pattern.append(index)
            pattern = pattern[1:]
    return out

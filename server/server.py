from flask import Flask, jsonify, request
from model_utils.gpt2_model.gptmodel import generate_output

app = Flask(__name__, static_folder="static", static_url_path="")


@app.route("/")
def hello_world():
    return app.send_static_file("index.html")


@app.route("/api/v1/generate", methods=["POST"])
def generate():
    data = request.json["value"]
    model_name = request.json["model_name"]
    out = generate_output(model_name, data)
    return jsonify({"output": out})


if __name__ == "__main_":
    app.run(debug=True)

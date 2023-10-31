from flask import Flask, jsonify, request
from .textmodel import generate_output
app = Flask(__name__,static_folder='static', static_url_path='')

@app.route("/")
def hello_world():
  return app.send_static_file('index.html')

@app.route('/api/v1/generate', methods=["POST"])
def generate():
  data = request.json["value"]
  out = generate_output(data)
  return jsonify({"output": out}) 


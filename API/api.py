
from flask import Flask
from flask import request
from flask import jsonify

from flask_cors import CORS

app = Flask(__name__)
app.config["DEBUG"] = True
CORS(app)

queue = [
    {
        "id": "",
        "tipo": "",
        "setor": "",
        "senha": "",
        "caixa": "",
        "data": "",
        "hora": "",
    }
]

@app.route('/', methods=['GET'])
def home():
    return "<h1>Distant Reading Archive</h1><p>This site is a prototype API for distant reading of science fiction novels.</p>"

@app.route('/atendimento', methods=['GET', 'POST'])
def atendimento():
    if request.method == 'GET':
        return jsonify(queue)

    if request.method == 'POST':
        data = request.get_json()
        queue.insert(1, data)
        return jsonify(queue)

app.run()
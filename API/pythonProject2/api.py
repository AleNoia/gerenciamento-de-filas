from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS

app = Flask(__name__)
app.config["DEBUG"] = True
CORS(app)

# Fila
queue = []

# Mesas e Caixa de atendimento
service_desk = {
    "caixa": {
        "desk_1": {
            "nameDesk": "Mesa 01",
            "statusBusy": False,
            "type": "Prioridade"
        },
        "desk_2": {
            "nameDesk": "Mesa 02",
            "statusBusy": False,
            "type": "Convencional"
        }
    },
    "gerencia": {
        "desk_1": {
            "nameDesk": "Mesa 03",
            "statusBusy": False,
            "type": "Prioridade"
        },
        "desk_2": {
            "nameDesk": "Mesa 04",
            "statusBusy": False,
            "type": "Convencional"
        }
    },
    "guiche": {

        "desk_1": {
            "nameDesk": "Caixa 01",
            "statusBusy": False,
            "type": "Prioridade"
        },
        "desk_2": {
            "nameDesk": "Caixa 02",
            "statusBusy": False,
            "type": "Convencional"
        }
    },
}

numero_caixa = 0
numero_guiche = 0
numero_gerencia = 0


def numero_ticket(setor):
    global numero_caixa
    global numero_guiche
    global numero_gerencia

    if setor == 'Caixa':
        numero_caixa += 1
        return numero_caixa

    if setor == 'Guichê':
        numero_guiche += 1
        return numero_guiche

    if setor == 'Gerência':
        numero_gerencia += 1
        return numero_gerencia


def verificar_numero(setor):
    if setor == 'Caixa':
        return numero_caixa
    elif setor == 'Guichê':
        return numero_guiche
    else:
        return numero_gerencia


def zero_left(num):
    if num < 10:
        return '00' + str(num)
    elif num <= 100:
        return '0' + str(num)
    else:
        return str(num)


class Create:
    def __init__(self, setor, tipo, number):
        self.setor = setor
        self.tipo = tipo
        self.number = int(number)

    def ticket(self):
        if self.setor == 'Caixa':
            if self.tipo == 'Prioridade':
                return 'CXP' + zero_left(self.number)
            else:
                return 'CXC' + zero_left(self.number)
        if self.setor == 'Guichê':
            if self.tipo == 'Prioridade':
                return 'GHP' + zero_left(self.number)
            else:
                return 'GHC' + zero_left(self.number)
        if self.setor == 'Gerência':
            if self.tipo == 'Prioridade':
                return 'GEP' + zero_left(self.number)
            else:
                return 'GEC' + zero_left(self.number)


def insert_desk(desk_to_attend, client_id):
    for key in queue:
        if key['id'] == client_id:
            key['mesa'] = desk_to_attend['desk_name']


@app.route('/', methods=['GET'])
def home():
    return "<h1>Distant Reading Archive</h1><p>This site is a prototype API for distant reading of science fiction novels.</p>"


@app.route('/desks', methods=['GET', 'POST'])
def desks():
    if request.method == 'GET':
        return jsonify(service_desk)

    if request.method == 'POST':
        desk_to_attend = request.get_json()
        insert_desk(desk_to_attend, desk_to_attend['client'])
        return jsonify(desk_to_attend)


def delete_client_ticket(client_id):
    for key in queue:
        if key['id'] == client_id:
            queue.remove(key)
            print('[achou:]', key)


@app.route('/service', methods=['GET', 'POST', 'DELETE'])
def service():
    if request.method == 'DELETE':
        client_id = request.get_json()
        delete_client_ticket(client_id)
        return jsonify(client_id)

    if request.method == 'GET':
        return jsonify(list(reversed(queue)))

    if request.method == 'POST':
        data = request.get_json()

        # Adicionando número de ticket de acordo com o setor
        data['number'] = str(numero_ticket(data['setor']))

        # Declarando o atributo na classe
        client = Create(data['setor'], data['tipo'], verificar_numero(data['setor']))

        # Gerando a senha
        data['senha'] = client.ticket()

        queue.insert(0, data)

        return jsonify(queue)


app.run()

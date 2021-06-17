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
        numero_caixa += 1
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
        elif self.setor == 'Acompanhamento':
            return 'Acompanhamento'


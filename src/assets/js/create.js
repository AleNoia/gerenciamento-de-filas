function create() {
    // Gera o ID
    function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    // Insere zeros antes do número
    function zeroLeft(max, zero, num) {
        return num < max ? `${zero}${num}` : num
    }

    // Retorna a data
    function date() {
        let now = new Date();
        return now.toLocaleDateString();
    }

    // Retorna a hora
    function hour() {
        let now = new Date();
        let hr = zeroLeft(10, '0', now.getHours());
        let m = zeroLeft(10, '0', now.getMinutes());
        let localdate = `${hr}:${m}`;
        return localdate;
    }

    // Retorna o caixa (gerado aleatoriamente)
    function setCashier() {
        let min = Math.ceil(0);
        let max = Math.floor(10);
        return zeroLeft(100, '00', Math.floor(Math.random() * (max - min + 1)) + min)
    }

    // Insere as informações na terceira página 
    function informations(arrayFila) {
        // document.querySelector('.uuid').innerHTML = arrayFila.id
        // document.querySelector('.senha').innerHTML = arrayFila.senha
        document.querySelector('.tipo').innerHTML = arrayFila.tipo
        // document.querySelector('.date').innerHTML = arrayFila.data
        // document.querySelector('.hora').innerHTML = arrayFila.hora
        document.querySelector('.setor').innerHTML = arrayFila.setor
    }

    // Obtendo fila
    async function getQueue(url) {
        let response = await fetch(url)
        return await response.json()
    }


    // Inserindo dados da fila nas páginas
    function setDataPages(url, fila, data, thirdPage) {
        setTimeout(async function () {
            fila = await getQueue(url)
            let arrayFila = fila.filter(function (value) {
                if (value.id == data.id) {
                    console.log(value)
                    return value
                }
            })

            if (thirdPage) informations(arrayFila[0]) // gerando as informações na terceira página 
            attendancePanel(fila) // gerando o Painel de Acompanhamento

        }, 1000);
    }

    // Iniciando página com o setor Geral selecionado
    window.onload = function () {
        // document.getElementById('geral').click();
    }

    let newQueueSetor // Fila filtrada pelo setor

    // Filtrando fila para um setor determinado
    async function setQueue(url, setor, toPanel) {

        let fila = await getQueue(url)

        // Função para filtragem
        function checkTicketSetor(value) {

            let l1 = value.senha.split('')[0]
            let l2 = value.senha.split('')[1]
            let letter = l1 + l2

            if (letter == setor) return value
        }


        newQueueSetor = fila.filter(checkTicketSetor) // Filtrando

        if (toPanel) attendancePanel(newQueueSetor) // Para o painel de acompanhamento
    }

    // Filtrando setor Caixa
    async function setGeral(url) {
        newQueueSetor = await getQueue(url)
        attendancePanel(newQueueSetor)
    }

    // Filtrando setor Caixa
    async function setQueueCaixa(url) {
        setQueue(url, 'CX', true)
    }

    // Filtrando setor Guichê
    async function setQueueGuiche(url) {
        setQueue(url, 'GH', true)
    }

    // Filtrando setor Gerencia
    async function setQueueGerencia(url) {
        setQueue(url, 'GE', true)
    }



    // Filtrando fila para um tipo determinado
    function setQueueType(type, toPanel) {

        // Função para filtragem
        function checkTicketType(value) {

            let typeTicket = value.senha.split('')[2]

            if (typeTicket == type) return value
        }


        let newQueueType = newQueueSetor.filter(checkTicketType) // Filtrando

        if (toPanel) attendancePanel(newQueueType, true) // Para o painel de acompanhamento

    }

    // Filtrando para o tipo Convencional
    function setQueueConvencional() {
        setQueueType('C', true)
    }

    // Filtrando para o tipo Prioridade
    function setQueuePrioridade() {
        setQueueType('P', true)
    }


    // Gerando o Painel de Acompanhamento
    function attendancePanel(fila, admin) {
        let groupTickets = document.querySelector('.groupTickets')
        // console.log(fila)
        groupTickets.innerHTML = ''
        for (let client in fila) {
            groupTickets.insertAdjacentHTML('beforeend',
                `<div class="client navItem">
                    <p class="senha">${fila[client].senha}</p>
                    <p class="tit">Senha</p>

                    ${(()=>{
                        if(admin){
                           return `
                           <p class="senha">${fila[client].hora}</p>
                           <p class="tit">Hora</p>
                           <p class="senha">${fila[client].data}</p>
                           <p class="tit">Data</p>
                           <button class="btn btn-secondary btnFinish" value="${fila[client].id}">Finalizar atendimento</button>
                           `                           
                        } else {
                            return ``
                        }
                    })()}

                </div>
                `)
        }
    }

    return {
        uuidv4,
        date,
        hour,
        setCashier,
        zeroLeft,
        informations,
        attendancePanel,
        setDataPages,
        setQueueCaixa,
        setQueueGuiche,
        setQueueGerencia,
        setGeral,
        setQueueConvencional,
        setQueuePrioridade,
    }

}

export default create;
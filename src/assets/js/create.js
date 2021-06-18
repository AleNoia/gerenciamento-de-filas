function create() {

    let url = "http://localhost:5000/service";

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
            console.log(fila)
            let arrayFila = fila.filter(function (value) {
                if (value.id == data.id) {
                    // console.log(value)
                    return value
                }
            })

            if (thirdPage) informations(arrayFila[0]) // gerando as informações na terceira página 
            attendancePanel(fila, false) // gerando o Painel de Acompanhamento

        }, 1000);
    }

    onloadGeral()
    
    // Iniciando página com o setor Geral selecionado
    function onloadGeral() {
        window.onload = function () {
            document.getElementById('geral').click();
        }
    }

    // Iniciando página com o setor Geral selecionado
    window.onload = function () {
        document.getElementById('geral').click();
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
    function setQueueType(type, toPanel, admin) {

        // Função para filtragem
        function checkTicketType(value) {

            let typeTicket = value.senha.split('')[2]

            if (typeTicket == type) return value
        }


        let newQueueType = newQueueSetor.filter(checkTicketType) // Filtrando

        if (toPanel) attendancePanel(newQueueType, admin) // Para o painel de acompanhamento

    }

    function filter(value) {

    }

    // Filtrando para o tipo Convencional
    function setQueueConvencional(admin) {
        setQueueType('C', true, admin)
    }

    // Filtrando para o tipo Prioridade
    function setQueuePrioridade(admin) {
        setQueueType('P', true, admin)
    }

    // Verificando se o cliente é o primeiro
    function checkIsFirst(queue, client) {
        if (queue[0].id == client) return true
        else return false
    }

    // Verificando se o cliente foi chamado para o atendimento
    function checkAttend(client) {
        if (client.mesa) return true
        return false
    }

    // Verificando se é admin para gerar uma fila com dados 
    function isAdmin(client, fila) {
        return `
            <p class="tit mt-1">${client.hora}</p>
            <p class="subTit">Hora</p>
            <p class="tit mt-1">${client.data}</p>
            <p class="subTit">Data</p>
            
            <div class="buttonsGroup mt-3">
            <button class="btn btn-danger btnFinish mr-1" value="${client.id}">Finalizar</button>
                ${(()=>{
                    if(checkIsFirst(fila, client.id)){
                        return `<button class="btn btn-primary btnGetClient" value="${client.id}">Atender cliente</button>`
                    } else {
                        return `
        `
                    }
                })()}
                
            </div>`

    }



    // Inserindo mesa no painel de acompanhamento
    function insertDesk(client) {
        return `
        <h2 class="tit mt-2">${client.mesa}</h2>
        <p class="subTit">Mesa/Caixa</p>
        `
    }

    // Apagando ticket no painel de acompanhamento
    function deleteClientQueue(client) {
        // Deletando ticket no back
        fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(client) // Passando ID do ticket para deletar
        });
    }


    // Gerando o Painel de Acompanhamento
    function attendancePanel(fila, admin) {
        let groupTickets = document.querySelector('.groupTickets')
        groupTickets.innerHTML = ''
        for (let client in fila) {

            // Se na fila tiver alguem com a mesa definida, ele será deletado depois de um tempo
            setTimeout(function () {
                if (fila[client].mesa) deleteClientQueue(fila[client].id)
                attendancePanel(getQueue(url), false)
            }, 30000)

            groupTickets.insertAdjacentHTML('beforeend',
                `<div class="client navItem card">
                    <p class="senha">${fila[client].senha}</p>
                    <p class="subTit">Senha</p>
                    ${(()=>{
                        if(checkAttend(fila[client])) return insertDesk(fila[client])
                        else return ``
                    })()}
                    ${(()=>{
                        if(admin) return isAdmin(fila[client], fila)
                        else return ``
                    })()}
                </div>`
            )
        }
    }

    // Gerando os caixas e mesas
    function setDesks(desks, value) {
        let caixas = document.querySelector('.caixas')
        caixas.innerHTML = ''

        for (let key in desks) {
            if (key == value) {
                let obj = desks[key];
                for (let desk in obj) {
                    caixas.insertAdjacentHTML('beforeend', `
                        <button class="btn btn-secondary btnCaixa" id="${obj[desk].nameDesk}" value=${obj[desk].type}>${obj[desk].nameDesk} - ${obj[desk].type}</button>                   
                        `)
                }
            }
        }
    }

    function insertDataTicket(client) {
        let senhaHtml = document.querySelector('.senhaTicket')
        let setorHtml = document.querySelector('.setorTicket')
        let horaHtml = document.querySelector('.horaTicket')
        let dataHtml = document.querySelector('.dataTicket')
        let idHtml = document.querySelector('.idTicket')
        let typeServiceHtml = document.querySelector('.typeTicket')

        senhaHtml.innerHTML = ''
        setorHtml.innerHTML = ''
        horaHtml.innerHTML = ''
        dataHtml.innerHTML = ''
        idHtml.innerHTML = ''
        typeServiceHtml.innerHTML = ''

        senhaHtml.insertAdjacentHTML('beforeend', client.senha)
        setorHtml.insertAdjacentHTML('beforeend', client.setor)
        horaHtml.insertAdjacentHTML('beforeend', client.hora)
        dataHtml.insertAdjacentHTML('beforeend', client.data)
        idHtml.insertAdjacentHTML('beforeend', client.id)
        typeServiceHtml.insertAdjacentHTML('beforeend', client.tipo)
        console.log(client.setor)
    }

    async function ticket(url, clientId) {
        let fila = await getQueue(url)
        for (let key in fila) {
            if (fila[key].id == clientId) {
                insertDataTicket(fila[key])
                return fila[key]
            }
        }
    }

    return {
        uuidv4,
        date,
        hour,
        // setDeskToAttend,
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
        checkIsFirst,
        setDesks,
        filter,
        getQueue,
        deleteClientQueue,
        ticket,
        onloadGeral,
    }

}

export default create;
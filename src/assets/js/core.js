import generateCreate from './create.js';
const create = generateCreate();

function Core() {

    // Variáveis para o envio de dados para o back
    let data = new Object(); // Array que será enviado para o back
    let number = 0 // Número para ticket
    let queue //Array com a fila
    let url = "http://localhost:5000/service";
    let urlDesks = "http://localhost:5000/desks";

    function start() {
        getClicks();
        listingDesks();
    }


    // Ouvindo os eventos
    function getClicks() {
        document.addEventListener('click', e => {
            const el = e.target

            // Pegando o tipo de atendimento
            if (el.classList.contains('btnServiceType')) getServiceType(el.value)

            // Pegando o setor de atendimento
            if (el.classList.contains('btnService')) getServiceSection(el.value)

            // Enviando dados do ticket o back
            if (el.classList.contains('enviar')) sendData()

            // Filtra o painel de acompanhamento de acordo com o setor
            if (el.classList.contains('btnAcompanhamento')) {
                setSetor(el.value) // Filtra o painel de acompanhamento de acordo com o setor
                getDesks(el.value) // Recebe no painel de acompanhamento as mesas/caixa (prioridade e convencional)
            }

            // Filtra o painel de acompanhamento de acordo com o tipo (sem admin)
            if (el.classList.contains('btnOptionType')) {
                setType(el.value, false) // Filtra o painel de acompanhamento de acordo com o setor
                // getDesks(el.value) // Recebe no painel de acompanhamento as mesas/caixa (prioridade e convencional)
            }

            // Filtrando fila de com o tipo de caixa (com admin)
            if (el.classList.contains('btnCaixa')) {
                setType(el.value, true) // Filtrando queue de com o tipo de Service
                setDesk(el.id, el.value) // Criando o nome da mesa/caixa
            }

            // Atendendo o cliente
            if (el.classList.contains('btnGetClient')) getClient(el.value)

            // Finalizando o atendimeticketto
            if (el.classList.contains('btnFinish')) finishService(el.value)
        })
    }


    // Pengando informações da queue assim que o projeto for inciado
    create.setDataPages(url, queue, data)


    // Pegando o tipo de atendimento
    function getServiceType(value) {
        data.tipo = value

        // Passando para a próxima página
        document.querySelector('.firstPage').style.display = 'none';
        document.querySelector('.secondPage').style.display = 'initial';
    }


    // Pegando o setor do atendimento
    function getServiceSection(value) {
        data.setor = value

        // Passando para a próxima página
        document.querySelector('.secondPage').style.display = 'none';
        document.querySelector('.thirdPage').style.display = 'initial';
        create.informations(data) // Criando informações da última página
    }


    // Filtrando queue de acordo com o setor
    function setSetor(value) {
        if (value === 'geral') create.setGeral(url)
        if (value === 'caixa') create.setQueueCaixa(url, queue)
        if (value === 'guiche') create.setQueueGuiche(url, queue)
        if (value === 'gerencia') create.setQueueGerencia(url, queue)
    }

    // Filtrando queue de com o tipo de Service
    function setType(value, admin) {
        if (value === 'Convencional') create.setQueueConvencional(admin)
        if (value === 'Prioridade') create.setQueuePrioridade(admin)
    }


    // Enviando os dados    
    function sendData() {
        // Inserindo dados no array Data
        number += 1
        data.id = create.uuidv4(); // ID do ticket
        data.data = create.date(); // Data da criação do ticket
        data.hora = create.hour(); // Hora da criação do ticket

        // Enviando dados para o back
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        create.setDataPages(url, queue, data, true) // Atualizando dados da queue


        setTimeout(async function () {
            let dataTicket = await create.ticket(url, data.id)
            console.log(dataTicket)
        }, 1000)


        // Passando para a próxima página de ticket gerado
        document.querySelector('.thirdPage').style.display = 'none';
        document.querySelector('.fourthPage').style.display = 'initial';

        // Voltando para a página inicial
        setTimeout(function () {
            document.querySelector('.fourthPage').style.display = 'none';
            document.querySelector('.firstPage').style.display = 'initial';

            // Iniciando página com o setor Geral selecionado
            create.onloadGeral()

        }, 10000)

    }


    // Recebendo todos as mesas/caixa
    async function getDesks(value) {
        let desks = await listingDesks()
        create.setDesks(desks, value)
    }

    // Listando todas as mesas/caixa
    async function listingDesks() {
        let response = await fetch(urlDesks)
        return await response.json()
    }

    // Mesa/Caixa que o cliente irá  
    let deskToAttend = {
        desk_name: String,
        client: String,
    }

    // Criando o nome da mesa/caixa
    function setDesk(desk, type) {
        deskToAttend.desk_name = `${desk} - ${type}`
    }

    // Atendendo o clinete  
    function getClient(clientId) {
        deskToAttend.client = clientId
        console.log(clientId)

        // Definindo a mesa/caixa que o cliente será atendido (no back)
        fetch(urlDesks, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(deskToAttend)
        });

    }


    // Finalizando Service
    function finishService(clientId) {
        create.deleteClientQueue(clientId)
    }


    return {
        start,
    }

}

export default Core;
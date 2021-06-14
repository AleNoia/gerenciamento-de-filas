import generateCreate from './create.js';
const create = generateCreate();

function Core() {

    function start() {
        getClicks();
        listingDesks();
        getDesks();
    }

    // Array que será enviado para o back
    let data = new Object();


    // Ouvindo os eventos
    function getClicks() {
        document.addEventListener('click', e => {
            const el = e.target
            if (el.classList.contains('btnAtendimentoType')) getAtendimentoType(el.value)
            if (el.classList.contains('btnAtendimento')) getAtendimentoSection(el.value)
            if (el.classList.contains('btnAcompanhamento')) {
                setSetor(el.value)
                getDesks(el.value)
            }
            if (el.classList.contains('btnCaixa')) setType(el.value)
            if (el.classList.contains('btnFinish')) finishService(el.value)
            if (el.classList.contains('enviar')) sendData()
        })
    }


    // Pegando o tipo de atendimento
    function getAtendimentoType(value) {
        data.tipo = value

        // Passando para a próxima página
        document.querySelector('.firstPage').style.display = 'none';
        document.querySelector('.secondPage').style.display = 'initial';
    }


    // Pegando o setor do atendimento
    function getAtendimentoSection(value) {
        data.setor = value

        // Passando para a próxima página
        document.querySelector('.secondPage').style.display = 'none';
        document.querySelector('.thirdPage').style.display = 'initial';
        create.informations(data) // Criando informações da última página
    }


    // Variáveis para o envio de dados para o back
    let number = 0 // Número para ticket
    let fila
    let url = "http://localhost:5000/atendimento";
    let urlDelete = "http://localhost:5000/delete";
    let urlDesks = "http://localhost:5000/desks";


    // Pengando informações da fila assim que o projeto for inciado
    create.setDataPages(url, fila, data)


    // Filtrando fila de acordo com o setor
    function setSetor(value) {
        if (value === 'geral') create.setGeral(url)
        if (value === 'caixa') create.setQueueCaixa(url, fila)
        if (value === 'guiche') create.setQueueGuiche(url, fila)
        if (value === 'gerencia') create.setQueueGerencia(url, fila)
    }

    // Filtrando fila de com o tipo de atendimento
    function setType(value) {
        if (value === 'Convencional') create.setQueueConvencional(url)
        if (value === 'Prioridade') create.setQueuePrioridade(url, fila)
    }


    // Enviando os dados    
    function sendData() {
        // Inserindo dados no array Data
        number += 1
        data.id = create.uuidv4(); // ID do ticket
        data.caixa = create.setCashier(); // Caixa que o cliente irá
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

        create.setDataPages(url, fila, data, true) // Atualizando dados da fila

        // Passando para a próxima página
        document.querySelector('.thirdPage').style.display = 'none';
        document.querySelector('.fourthPage').style.display = 'initial';

        // Voltando para a página inicial
        setTimeout(function () {
            document.querySelector('.fourthPage').style.display = 'none';
            document.querySelector('.firstPage').style.display = 'initial';
        }, 1000)

    }


    async function listingDesks() {
        let response = await fetch(urlDesks)
        return await response.json()
    }

    async function getDesks(value) {
        let desks = await listingDesks()

        let caixas = document.querySelector('.caixas')
        caixas.innerHTML = ''

        for (let key in desks) {
            if (key == value) {
                var obj = desks[key];
                for (let desk in obj) {
                    caixas.insertAdjacentHTML('beforeend', `
                        <button class="btn btn-secondary btnCaixa" value=${obj[desk].type}>${obj[desk].nameDesk} - ${obj[desk].type}</button>                   
                    `)
                }
            }
        }

    }


    // Finalizando atendimento
    function finishService(value) {

        // Deletando atendimento no back
        fetch(urlDelete, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(value)
        });

    }


    return {
        start,
    }

}

export default Core;
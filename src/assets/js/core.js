import generateCreate from './create.js';
const create = generateCreate();

function Core() {

    function start() {
        getClicks();
    }

    let data = new Object();

    // Ouvindo os eventos
    function getClicks() {
        document.addEventListener('click', e => {
            const el = e.target
            if (el.classList.contains('convencional')) setAtendimentoType('Convencional')
            if (el.classList.contains('btnAtendimentoType')) setAtendimentoType(el.value)
            if (el.classList.contains('btnAtendimento')) setAtendimentoSection(el.value)
            if (el.classList.contains('enviar')) enviarDados()
        })
    }

    // Pegando o tipo de atendimento
    function setAtendimentoType(value) {
        data.tipo = value
        document.querySelector('.firstPage').style.display = 'none';
        document.querySelector('.secondPage').style.display = 'initial';
    }

    // Pegando o setor do atendimento
    function setAtendimentoSection(value) {
        data.setor = value

        document.querySelector('.secondPage').style.display = 'none';
        document.querySelector('.thirdPage').style.display = 'initial';
        create.informations(data)
    }

    let number = 0
    let fila
    let url = "http://localhost:5000/atendimento";

    // Pengando informações da fila
    create.getQueue(url, fila, data)

    // Enviando os dados    
    function enviarDados() {
        number += 1
        data.id = create.uuidv4();
        data.caixa = create.setCashier();
        data.data = create.date();
        data.hora = create.hour();
        data.time = new Date();

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        create.getQueue(url, fila, data, true) // Pengando dados da fila

        document.querySelector('.thirdPage').style.display = 'none';
        document.querySelector('.fourthPage').style.display = 'initial';
        
        setTimeout(function (){
            document.querySelector('.fourthPage').style.display = 'none';
            document.querySelector('.firstPage').style.display = 'initial';
        }, 1000)

    }

    return {
        start,
    }

}

export default Core;
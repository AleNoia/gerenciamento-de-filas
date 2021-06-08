import generateCreate from './create.js';

function Core() {
    const create = generateCreate();


    function start() {
        getClicks();
    }

    let data = new Object();

    data.data = create.date();
    data.hora = create.hour();
    data.id = create.uuidv4();

    function getClicks() {
        document.addEventListener('click', e => {
            const el = e.target
            if (el.classList.contains('convencional')) setAtendimentoType('Convencional')
            if (el.classList.contains('btnAtendimentoType')) setAtendimentoType(el.value)
            if (el.classList.contains('btnAtendimento')) setAtendimentoSection(el.value)
            if (el.classList.contains('enviar')) enviarDados()
        })
    }

    function setAtendimentoType(value) {
        data.tipo = value
        // console.log(data)
    }

    function setAtendimentoSection(value) {
        data.setor = value
        // console.log(data)

        // document.getElementById('atendimentoSection').style.display = 'none';
        // document.getElementById('ticketSection').style.display = 'initial';


    }

    function enviarDados() {
        console.log(data)
        let url = "http://localhost:5000/atendimento";

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        document.getElementsByClassName('uuid').innerHTML = data.id
        document.getElementsByClassName('senha').innerText = "TESTE"
        document.getElementsByClassName('tipo').innerText = data.tipo
        document.getElementsByClassName('data').innerText = data.data
        document.getElementsByClassName('hora').innerText = data.hora

        // setTimeout(function () {

        //     document.getElementById('finalScreen').style.display = 'none';
        //     document.getElementById('atendimentoType').style.display = 'initial';

        // }, 3000); //delay is in milliseconds 

    }






    return {
        start,
    }

}

export default Core;
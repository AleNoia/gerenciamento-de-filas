import generateCreate from './create.js';
const create = generateCreate();

function Core() {

    function start() {
        getClicks();
    }

    let data = new Object();

    data.data = create.date();
    data.hora = create.hour();

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
        // document.querySelector('.firstPage').style.display = 'none';
        // document.querySelector('.secondPage').style.display = 'initial';
    }

    function setAtendimentoSection(value) {
        data.setor = value

        // document.querySelector('.secondPage').style.display = 'none';
        // document.querySelector('.thirdPage').style.display = 'initial';

    }

    let number = 0

    function enviarDados() {
        console.log(data)
        number += 1
        data.id = create.uuidv4();
        data.caixa = create.setCashier();
        data.number = create.zeroLeft(100, '00', number)

        let url = "http://localhost:5000/atendimento";

        document.querySelector('.uuid').innerHTML = data.id
        document.querySelector('.senha').innerHTML = data.senha
        document.querySelector('.tipo').innerHTML = data.tipo
        document.querySelector('.date').innerHTML = data.data
        document.querySelector('.hora').innerHTML = data.hora
        document.querySelector('.setor').innerHTML = data.setor

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        (async function getFila() {
            let response = await fetch(url)
            let fila = await response.json()
            fila.forEach(function (el, i) {
                if(el.id === data.id) 
                let element = el.id === data.id
                console.log(el)
            })
            // console.log(fila)
        })();



        setTimeout(function () {

            // document.querySelector('.finalPage').style.display = 'none';
            // document.querySelector('.firstPage').style.display = 'initial';

        }, 3000);

    }


    return {
        start,
    }

}

export default Core;
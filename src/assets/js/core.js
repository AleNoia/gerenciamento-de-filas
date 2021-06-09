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
    let fila = new Array();

    function enviarDados() {
        number += 1
        data.id = create.uuidv4();
        data.caixa = create.setCashier();
        data.number = create.zeroLeft(100, '00', number)

        let url = "http://localhost:5000/atendimento";

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        setTimeout(async function () {
            let response = await fetch(url)
            fila = await response.json()
            let arrayFila = fila.filter(function (value) {
                if (value.id == data.id) {
                    return value
                }
            })

            create.informations(arrayFila[0])
            create.attendancePanel(fila)

        }, 1000);

    }

    function atualizar() {
        setTimeout(function () {
            alert(fila)
            create.attendancePanel(fila)

        }, 2000)
    }


    return {
        start,
    }

}

export default Core;
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

    // Obetendo fila
    async function getQueueGeral(url) {
        let response = await fetch(url)
        return await response.json()
    }
    
    
    // Obtendo dados da fila para as páginas
    function getQueue(url, fila, data, thirdPage) {
        setTimeout(async function () {
            fila = await getQueueGeral(url)
            let arrayFila = fila.filter(function (value) {
                if (value.id == data.id) {
                    console.log(value)
                    return value
                }
            })

            if(thirdPage) informations(arrayFila[0]) // gerando as informações na terceira página 
            attendancePanel(fila) // gerando o Painel de Acompanhamento

        }, 1000);
    }

    // Filtrando o painel de acompanhamento para o setor Caixa
    function getQueueCaixa(url, fila){
        let fila = await getQueueGeral(url)
    }

    // Gera o Painel de Acompanhamento
    function attendancePanel(fila) {
        let groupClients = document.querySelector('.groupClients')
        console.log(fila)
        groupClients.innerHTML = ''
        for (let client in fila) {
            groupClients.insertAdjacentHTML('beforeend',
                `<div class="client navItem"><p class="senha">${fila[client].senha}</p><p class="tit">Senha</p></div>`)
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
        getQueue,
        // getQueueCaixa,
    }

}

export default create;
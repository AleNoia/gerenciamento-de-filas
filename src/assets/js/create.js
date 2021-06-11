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

    function getQueue(url, fila, data, thirdPage) {
        setTimeout(async function () {
            let response = await fetch(url)
            fila = await response.json()
            let arrayFila = fila.filter(function (value) {
                if (value.id == data.id) {
                    return value
                }
            })

            if(thirdPage) informations(arrayFila[0]) // gerando as informações na terceira página 
            attendancePanel(fila) // gerando o Painel de Acompanhamento

        }, 1000);
    }

    // // Ordenar Fila
    // function orderQueue(){

    // }

    // Gera o Painel de Acompanhamento
    function attendancePanel(fila) {
        let groupPessoas = document.querySelector('.groupPessoas')
        console.log(fila)
        groupPessoas.innerHTML = ''
        for (let pessoa in fila) {
            groupPessoas.insertAdjacentHTML('beforeend',
                `<div class="pessoa navItem"><p class="tit">Senha</p><p class="senha mb-2">${fila[pessoa].senha}</p><p class="tit mb-1">Caixa</p><p class="caixa">${fila[pessoa].caixa}</p></div>`)
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
    }

}

export default create;
function create() {

    function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    function zeroLeft(max, zero, num) {
        return num <= max ? `${zero}${num}` : num
    }

    
    function date() {
        let now = new Date();
        return now.toLocaleDateString();
    }
    
    function hour() {
        let now = new Date();
        let hr = zeroLeft(10, '0', now.getHours());
        let m = zeroLeft(10, '0', now.getMinutes());
        let localdate = `${hr}:${m}`;
        return localdate;
    }

    function setCashier() {
        let min = Math.ceil(0);
        let max = Math.floor(10);
        return zeroLeft(100, '00', Math.floor(Math.random() * (max - min + 1)) + min)
    }

    function informations(arrayFila) {
        document.querySelector('.uuid').innerHTML = arrayFila.id
        document.querySelector('.senha').innerHTML = arrayFila.senha
        document.querySelector('.tipo').innerHTML = arrayFila.tipo
        document.querySelector('.date').innerHTML = arrayFila.data
        document.querySelector('.hora').innerHTML = arrayFila.hora
        document.querySelector('.setor').innerHTML = arrayFila.setor
    }
    
    function attendancePanel(fila){
        let groupPessoas = document.querySelector('.groupPessoas')
        console.log(fila)
        groupPessoas.innerHTML = ''   
        for(let pessoa in fila){
            groupPessoas.insertAdjacentHTML('beforeend',
            `<div class="pessoa"><p class="senha">${fila[pessoa].senha}</p><p class="caixa">${fila[pessoa].caixa}</p></div><hr>`)
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
    }

}

export default create;
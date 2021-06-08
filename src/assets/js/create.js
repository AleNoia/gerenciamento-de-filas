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
        let dNow = new Date();
        let dd = zeroLeft(10, '0', dNow.getDate());
        let mm = zeroLeft(10, '0', dNow.getMonth() + 1);
        let yyyy = zeroLeft(10, '0', dNow.getFullYear());
        let localdate = `${dd}/${mm}/${yyyy}`;
        return localdate;
    }

    function hour() {
        let dNow = new Date();
        let hr = zeroLeft(10, '0', dNow.getHours());
        let m = zeroLeft(10, '0', dNow.getMinutes());
        let localdate = `${hr}:${m}`;
        return localdate;
    }

    function ticket(setor, tipo, number) {
        let set
        if (setor === 'Caixa') {
            if (tipo === 'Prioridade') {
                set = 'CXP'
            } else {
                set = 'CXC'
            }
        } else if (setor === 'Guichê') {
            if (tipo === 'Prioridade') {
                set = 'GHP'
            } else {
                set = 'GHC'
            }
        } else if (setor === 'Gerência') {
            if (tipo === 'Prioridade') {
                set = 'GEP'
            } else {
                set = 'GEC'
            }
        } else if (setor === 'Acompanhamento') {
            set = 'Acompanhamento'
            return `${set}`
        }
        return `${set}${zeroLeft(100, '00', number)}`
    }


    return {
        uuidv4,
        date,
        hour,
        ticket,
    }

}

export default create;
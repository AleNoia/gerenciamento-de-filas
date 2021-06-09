function create() {

    function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    function zeroLeft(max, zero, num) {
        return num <= max ? `${zero}${num}` : num
    }

    let now = new Date();

    function date() {
        return now.toLocaleDateString();
    }

    function hour() {
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

    return {
        uuidv4,
        date,
        hour,
        setCashier,
        zeroLeft,
    }

}

export default create;
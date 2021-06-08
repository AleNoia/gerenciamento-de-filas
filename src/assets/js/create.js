function create() {

    function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    function zeroLeft(num){
        return num <= 10 ? `0${num}` : num
    }

    function date() {
        let dNow = new Date();
        let dd = zeroLeft(dNow.getDate());
        let mm = zeroLeft(dNow.getMonth()+1);
        let yyyy = zeroLeft(dNow.getFullYear());
        let localdate = `${dd}/${mm}/${yyyy}`;
        return localdate;
    }
    
    function hour() {
        let dNow = new Date();
        let hr = zeroLeft(dNow.getHours());
        let m = zeroLeft(dNow.getMinutes());
        let localdate = `${hr}:${m}`;
        return localdate;
    }


    return {
        uuidv4,
        date,
        hour,
    }

}

export default create;


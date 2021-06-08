import generateCore from './core.js';
const core = generateCore()

try{
    core.start();

}catch(e){
    console.error("Erro nao capturado:");
    console.error(e);
}

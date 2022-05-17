const fs = require('fs');
const PATH="../OglasiServis/oglasi.json";
const kategorijePATH="../OglasiServis/kategorije.json";
const valutePATH="../OglasiServis/valute.json";

let procitajPodatkeIzFajla=()=>{
    let oglasi=fs.readFileSync(PATH, (err, data) => {
        if (err) throw err;
            return data;
    });
    return JSON.parse(oglasi);
}
let procitajPodatkeIzFajlaKategorije=()=>{
    let oglasi=fs.readFileSync(kategorijePATH, (err, data) => {
        if (err) throw err;
            return data;
    });
    return JSON.parse(oglasi);
}
let procitajPodatkeIzFajlaValute=()=>{
    let oglasi=fs.readFileSync(valutePATH, (err, data) => {
        if (err) throw err;
            return data;
    });
    return JSON.parse(oglasi);
}
let snimiOglase=(data)=>{
    fs.writeFileSync(PATH,JSON.stringify(data));
}
exports.sviOglasi = () => {
    return procitajPodatkeIzFajla();
}
exports.sveKategorije = () => {
    return procitajPodatkeIzFajlaKategorije();
}
exports.sveValute = () => {
    return procitajPodatkeIzFajlaValute();
}
exports.addOglas = (noviOglas) => {
    let id=1;
    let oglasi=this.sviOglasi();
    if(oglasi.length>0){
        id=oglasi[oglasi.length-1].id+1;
    }
    noviOglas.id=id;
    oglasi.push(noviOglas)
    snimiOglase(oglasi);
}
exports.getOglas = (id) => {
    return this.sviOglasi().find(x => x.id == id);
}
exports.deleteOglas = (id) => {
    snimiOglase(this.sviOglasi().filter(oglas=>oglas.id!=id));
}
exports.setKategorija = (id,kategorija) => {
    let oglasi=this.sviOglasi().filter(oglas=>oglas.id==id);
    oglasi.forEach(element => {
        element.kategorija=kategorija;
    });
    getOglas.kategorija=kategorija
    snimiOglase(oglasi);
}
exports.getOglasByKategorija = (kategorija) =>{
    return this.sviOglasi().filter(oglas=>oglas.kategorija==kategorija);
}
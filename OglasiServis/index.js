var express = require('express');
var oglasiServis=require('../radoglasa-modul');
var app = express();
const port = 12345;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/',(request, response)=>{
    response.send("Server radi");
});

app.get('/svioglasi',(request, response)=>{
    response.send(oglasiServis.sviOglasi())
});
app.get('/svekategorije',(request, response)=>{
    response.send(oglasiServis.sveKategorije())
});
app.get('/svevalute',(request, response)=>{
    response.send(oglasiServis.sveValute())
});

app.post('/addoglas',(request, response)=>{
    oglasiServis.addOglas(request.body);
    response.end("OK");
});
app.get('/getoglasbykategorija',(request, response)=>{
    response.send(oglasiServis.getOglasByKategorija(request.query["kategorija"]));
});
app.delete('/deleteoglas/:id',(request, response)=>{
    oglasiServis.deleteOglas(request.params["id"]);
    response.end("OK");
});

app.listen(port,()=>{console.log(`startovan server na portu ${port}`)});
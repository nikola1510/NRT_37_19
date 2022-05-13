var express = require('express');
var oglasiServis=require('../radoglasa-modul');
var app = express();
const port = 12345;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/',(request, response)=>{
    response.send("Server radi");
});


app.listen(port,()=>{console.log(`startovan server na portu ${port}`)});
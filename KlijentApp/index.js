const express = require("express");
const fs=require("fs");
const app = express();
const path = require('path');
const axios = require('axios');
const port = 15432;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let procitajPogledZaNaziv=(naziv)=>{
    return fs.readFileSync(path.join(__dirname+"/view/"+naziv+".html"),"utf-8")
}

app.get("/",(req,res)=>{
    res.send(procitajPogledZaNaziv("index"));
});

app.get("/svioglasi",(req,res)=>{   
    axios.get('http://localhost:12345/svioglasi')
    .then(response => {
        let prikaz="";
        response.data.forEach(element => {
            prikaz+=`<tr>
            <td>${element.id}</td>
            <td>${element.kategorija}</td>
            <td>${element.datumIsteka}</td>
            <td>${element.cena}</td>
            <td>${element.tekstOglasa}</td>
            <td>`
            element.oznake.forEach(element => {
                prikaz+=element+", "
            });
            prikaz+=`</td><td>`
            element.emails.forEach(element => {
                prikaz+=element.tip+": "+element.mejl+", "
            });
            prikaz+=`</td>
            <td><a href="/obrisi/${element.id}">Obrisi</a></td>
            </tr>`;
        });      
        var prikazKategorije="";
        axios.get('http://localhost:12345/svekategorije')
        .then(response => {       
            response.data.forEach(element => {
                prikazKategorije+=`<option value="${element.kategorija}">${element.kategorija.charAt(0).toUpperCase() + element.kategorija.slice(1)}</option>`
            });
        res.send(procitajPogledZaNaziv("svioglasi").replace("#{dataKategorije}",prikazKategorije).replace("#{data}",prikaz));
        })
        .catch(error => {
            console.log(error);
        });
    })
    
    .catch(error => {
        console.log(error);
    });
});

app.get("/obrisi/:id",(req,res)=>{
    axios.delete(`http://localhost:12345/deleteoglas/${req.params["id"]}`)
    res.redirect("/svioglasi");
});

app.get("/dodajoglas",(req,res)=>{
    var prikazKategorije="";
    var prikazValute="";
    axios.get('http://localhost:12345/svekategorije')
    .then(response => {       
        response.data.forEach(element => {
            prikazKategorije+=`<option value="${element.kategorija}">${element.kategorija.charAt(0).toUpperCase() + element.kategorija.slice(1)}</option>`
        });
        axios.get('http://localhost:12345/svevalute')
        .then(response => {
            let index=1
            response.data.forEach(element => {
                if(index++==1){
                    prikazValute+=`<input type="radio" value="${element.valuta}" name="valuta" checked>${element.valuta}`
                }else{
                    prikazValute+=`<input type="radio" value="${element.valuta}" name="valuta">${element.valuta}`
                }
            });
            var danas=new Date().toJSON().slice(0,10)
            var datum=`<input type="date" name="datumIsteka" min="${danas}" value="${danas}">`
            res.send(procitajPogledZaNaziv("formazadodavanje").replace("#{dataKategorije}",prikazKategorije).replace("#{dataValute}",prikazValute).replace("#{dataDatum}",datum));
        })
        .catch(error => {
            console.log(error);
        });
    })
    .catch(error => {
        console.log(error);
    });
});

app.post("/snimioglas",(req,res)=>{
    let emailovi=[]
    if(!Array.isArray(req.body.email)){
        emailovi.push({tip:req.body.tipMejla,mejl:req.body.email})
    }else{
        for (let index = 0; index < req.body.email.length; index++) {
            emailovi.push({tip:req.body.tipMejla[index],mejl:req.body.email[index]})
        }
    }      
    axios.post("http://localhost:12345/addoglas",{
        kategorija:req.body.kategorija,
        datumIsteka:req.body.datumIsteka,
        cena:req.body.cena,
        tekstOglasa:req.body.tekstOglasa,
        oznake:req.body.tags,
        emails:emailovi
        })
    res.redirect("/svioglasi");
});

app.post("/filtrirajoglasezaautora",(req,res)=>{   
    axios.get(`http://localhost:12345/getoglasbykategorija?kategorija=${req.body.kategorija}`)
    .then(response => {
        let prikaz="";
        response.data.forEach(element => {
            prikaz+=`<tr>
            <td>${element.id}</td>
            <td>${element.kategorija}</td>
            <td>${element.datumIsteka}</td>
            <td>${element.cena}</td>
            <td>${element.tekstOglasa}</td>
            <td>`
            element.oznake.forEach(element => {
                prikaz+=element+", "
            });
            prikaz+=`</td><td>`
            element.emails.forEach(element => {
                prikaz+=element.tip+": "+element.mejl+", "
            });
            prikaz+=`</td>
            <td><a href="/obrisi/${element.id}">Obrisi</a></td>
            </tr>`;
        });
        var prikazKategorije="";
        axios.get('http://localhost:12345/svekategorije')
        .then(response => {       
            response.data.forEach(element => {
                if(element.kategorija==req.body.kategorija)
                    prikazKategorije+=`<option value="${element.kategorija}" selected>${element.kategorija.charAt(0).toUpperCase() + element.kategorija.slice(1)}</option>`
                else
                    prikazKategorije+=`<option value="${element.kategorija}">${element.kategorija.charAt(0).toUpperCase() + element.kategorija.slice(1)}</option>`
            });
        res.send(procitajPogledZaNaziv("svioglasi").replace("#{dataKategorije}",prikazKategorije).replace("#{data}",prikaz));
        })
        .catch(error => {
            console.log(error);
        });      
    })
    .catch(error => {
        console.log(error);
    });
});
app.listen(port,()=>{console.log(`klijent na portu ${port}`)});

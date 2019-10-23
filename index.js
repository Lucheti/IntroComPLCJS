const express = require('express');
const Datastore = require('nedb');
const ModbusRTU = require("modbus-serial");

const app = express();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

const database = new Datastore('database.db');
database.loadDatabase();

const client = new ModbusRTU();
client.connectTCP("0.0.0.0", { port: 8502 });
client.setID(1);

app.get('/',(req, res) => {
    client.readHoldingRegisters(0, 10, (err, data) => {
        res.send(data)
    });
});

app.post('/', (req,res) => {
    console.log(req.ip)
    database.insert(req.body)
    client.writeRegisters(5,[2,1,5,7])
    res.send({})
})

app.put('/' ,(req, res) => {
    database.find({ name: "variables" }, (_ , data) => {
            database.update(...data, {$set: {...req.body}})
            database.insert({...req.body})
        }
    );

    res.send({})
    // database.find({name: "variables"} , (_,data) => console.log(data))
})

app.post('/history', (req, res) => {
    database.find({$and : [{[req.body.variable] : { $exists: true}} , {$not :{name: "variables"}} ]}, (_,data) => console.log(data))

})

app.listen(3000,() => {
    console.log('Example app listening on port 3000!');
});

// database.insert({
//         name: "variables",
//         temperature: 0,
//         pressure: 1,
//         humidity: 2,
// });
/*
    en el JSON hay q guardar IP PUERTO MAPA DE ATRIBUTOS
 */


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
client.connectTCP("192.168.1.5", { port: 502 });
client.setID(1);

let list = [];
let newList = [];

app.get('/',(req, res) => {
    client.readCoils(0x1,10).then( data => res.send(data))
    // client.readHoldingRegisters(0,10).then(data => console.log(data))
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

    res.send({message: 'Setted'})
    // database.find({name: "variables"} , (_,data) => console.log(data))
});

app.post('/history', (req, res) => {
    database.find({$and : [{[req.body.variable] : { $exists: true}} , {$not :{name: "variables"}} ]}, (_,data) => res.send(data))

});

app.listen(3000,() => {
    console.log('Example app listening on port 3000!');
});

app.get('/fill', (req,res) => {
    for (let i = 0 ; i <= 100 ;i++) {
        // client.readCoils(i,1).then(res => console.log(res))
        client.readDiscreteInputs(i,1)
          .then( resp => {
              // list = [...list, {id: i, data: resp.data}];
              // if (list.length === 43){
              //   res.send({message: "ok"})
              // }
          })
          .catch(err => console.log(err))
    }
})

app.get('/test', (req,res) => {
  newList = [];
    for (let i = 0 ; i <= 100 ;i++) {
        // client.readCoils(i,1).then(res => console.log(res))
        client.readDiscreteInputs(i,1)
          .then(resp => {
              newList = [...newList, {id: i, data: resp.data}];
              if (newList.length === 43){
                  list.forEach( bool => {
                      if(JSON.stringify(newList[list.indexOf(bool)]) !== JSON.stringify(bool)){
                          console.log(`${i} is different`)
                      }
                  })
                  list = newList;
                  res.send({message: 'tested'})
              }
          })
          .catch(err => console.log(err))
    }
})


setTimeout( () => {

} ,2000)
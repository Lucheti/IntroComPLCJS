const express = require('express')
const Datastore = require('nedb')
const ModbusRTU = require('modbus-serial')
const cors = require('cors')

const app = express()

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded())

// Parse JSON bodies (as sent by API clients)
app.use(express.json())

app.use(cors())


const database = new Datastore('database.db')
database.loadDatabase()

const client = new ModbusRTU()
client.connectTCP('0.0.0.0', { port: 8502 })
client.setID(1)

let list = []
let newList = []

app.get('/', (req, res) => {
  let response = []
  client.readHoldingRegisters(0,20).then( async plcData => {
    database.find({variable: true},  ( _ , databaseData) => {
       databaseData.forEach( variable => {
        response = [...response,{name: variable.name, value: plcData.data[variable.value], position: variable.position, history: variable.history, ip: req.ip}]
      })
      res.json(response)
    })
  })
})

app.post('/setVariable', (req, res) => {
  if (getValueFromObject(req.body) > 20) {
    res.status(400)
    res.send({message: 'invalid index'})
  }
  database.count({variable: true}, (_,count) => {
    database.insert({name: req.body.name, value: count + 1 , history: [], position: req.body.position , variable: true})
  })
  res.send({message: 'saved'})
})

app.post('/changeValue', (req, res) => {
  let index;
  const reqValue = req.body.value
  const reqName = req.body.name
  database.findOne({name: reqName}, (_ , data) => {
    index = data.value
    updateVar(reqName ,reqValue ,data.history)
    client.writeCoil(index, reqValue).then( res.send(client.readHoldingRegisters(index,0)) )
  })
})

app.post('/history', (req, res) => database.findOne({ name: req.body.name}, (_, data) => res.send(data.history)))

app.listen(3002, () => {
  console.log('Example app listening on port 3000!')
})

const updateVar = (name, value, history) => database.update({name: name}, { $set: { history: [...history, {value: value, timeStamp: new Date().getTime()}] } }, { multi: false });
const getValueFromObject = (o) => Object.values(o)[0]
const getKeyFromObject = (o) => Object.keys(o)[0]

const express = require('express')
const Datastore = require('nedb')
const ModbusRTU = require('modbus-serial')

const app = express()

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded())

// Parse JSON bodies (as sent by API clients)
app.use(express.json())

const database = new Datastore('database.db')
database.loadDatabase()

const client = new ModbusRTU()
client.connectTCP('0.0.0.0', { port: 8502 })
client.setID(1)

let list = []
let newList = []

app.get('/', (req, res) => {
  console.log("getting")
  let response = []
  client.readHoldingRegisters(0,20).then(plcData => {
    database.find({variable: true}, async ( _ , databaseData)=>{
      await databaseData.forEach( variable => {
        response = [...response,{name: variable.name, value: plcData.data[variable.value]}]
      })
        await res.json(response)
    })
  })
})

app.post('/setVariable', (req, res) => {
  if (getValueFromObject(req.body) > 20) {
    res.status(400)
    res.send({message: 'invalid index'})
  }
  database.insert({name: getKeyFromObject(req.body), value: getValueFromObject(req.body) , variable: true})
  res.send({message: 'saved'})
})

app.post('/changeValue', (req, res) => {
  let index;
  database.find({name: req.body.name}, (_ , data) => {
    index = data[0].value
    client.writeCoil(data[0].value, req.body.value)
  } )

  res.send(client.readHoldingRegisters(index,0))
  // database.find({name: "variables"} , (_,data) => console.log(data))
})

app.post('/history', (req, res) => {
  database.find({ $and: [{ [req.body.variable]: { $exists: true } }, { $not: { name: 'variables' } }] }, (_, data) => res.send(data))

})

app.listen(3002, () => {
  console.log('Example app listening on port 3000!')
})

let previous = []

app.get('/fill', (req, res) => {
    let current = []
    const start = 0
    for (let i = start; i < start + 100; i++) {

      try {
        client.readCoils(i, 1)
          .then(resp => {
            const newValue = { index: i, value: resp.data }
            current = current.concat(resp.data)
            console.log(resp)
          }).catch(err => {
            console.log(err)
            console.log(i)
        })
      }catch (ignore) {

      }
      res.json()
    }

    // setTimeout(() => {
    //   console.log("after 2 secs...")
    //   let changed = false
    //   for (let i = 0; i < current.length; i++) {
    //     if (JSON.stringify(current[i]) !== JSON.stringify(previous[i])){
    //       console.log("FEDE DIJO CAMBIO: " + i)
    //       changed = true
    //     }
    //     else {
    //       console.log("FEDE DIJO NOOOO CAMBIO: " + i)
    //     }
    //   }
    //   if (changed)console.log("FEDE DIJO ALGO CAMBIOOOOOOOOOOO")
    //   previous = current
    // }, 5000)


    res.json('{"status":200}')
  }
)

app.get('/test', (req, res) => {
  newList = []
  for (let i = 0; i <= 10000; i++) {
    // client.readCoils(i,1).then(res => console.log(res))
    client.readDiscreteInputs(i, 1)
      .then(resp => {
        newList = [...newList, { id: i, data: resp.data }]
        if (newList.length === 43) {
          list.forEach(bool => {
            if (JSON.stringify(newList[list.indexOf(bool)]) !== JSON.stringify(bool)) {
              console.log(`${i} is different`)
            }
          })
          list = newList
          res.send({ message: 'tested' })
        }
      })
      .catch(err => console.log(err))
  }
})

const getValueFromObject = (o) => Object.values(o)[0]
const getKeyFromObject = (o) => Object.keys(o)[0]

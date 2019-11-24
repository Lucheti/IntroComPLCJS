import React from 'react';
import logo from './logo.svg';
import './App.css';
import { History, HistoryItem } from './HistoryItem'

const font = 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;'

const setVar = (name,value) => {
  return fetch('http://localhost:3002/changeValue',{
    method: 'POST',
    headers:{
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      value: !value
    })
  })
}

const createVar = (variable) => {
  return fetch('http://localhost:3002/setVariable',{
    method: 'POST',
    headers:{
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: variable.name,
      position: variable.position,
    })
  })
}



const toggleIndex = (list, i) => list.map((val , index ) => {
  if (index === i) return !val
  else return val
})

const VARIABLE_INITIAL_STATE = {
  name: '',
  position: '',
}

function App() {

  const [info,setInfo] = React.useState([])
  const [newVariable, setNewVariable] = React.useState(VARIABLE_INITIAL_STATE)
  const [historys, setHistorys] = React.useState([])
  const updateData = () => {
    return fetch('http://localhost:3002').then(res => res.json()).then(data => setInfo(data))
  }
  React.useEffect(() => {
    updateData().then(() =>
    setInterval(() =>
    updateData()
    ,2000))
  },[])

  React.useEffect(() => {
    Array(info.length - historys.length).fill(true)
      .forEach(() =>  setHistorys([...historys, false]) )
  },[info])

  const toggleState = (name,value) => {
    setVar(name,value).then( updateData )
  }

  const newVar = () => {
    createVar(newVariable).then( updateData ).then(() => setNewVariable(VARIABLE_INITIAL_STATE))
  }

  return (
    <div className="App">
      <header className="App-header">
        <code>PLC Data</code>
        <ul>
          {info.map( (data, i) =>
            <li style={{listStyle: 'none'}}>
              <div style={{margin: '1rem'}}>
                <code>{data.position}</code>
                <code>{data.name}</code>
                <code>{data.value? 'On': 'Off'}</code>
                <button onClick={() => toggleState(data.name,data.value)}><code>Toggle</code></button>
                <button onClick={ () => setHistorys(toggleIndex(historys,i))}><code>Mostrar Historial</code></button>
              </div>

              <History data={data} visible={historys[i]}/>
            </li>
          )}
        </ul>
        <div style={{display: 'flex'}}>
          <input style={{background: 'none', border: 'none', borderBottom:'2px solid rgba(255,255,255,.5)', marginRight: '1rem', fontSize: '1rem', color: 'rgba(255,255,255,.7)', fontWeight:'bolder', fontFamily: font}}  placeholder={'Nombre'} value={newVariable.name} onChange={evt => setNewVariable({...newVariable , name : evt.target.value})} />
          <input style={{background: 'none', border: 'none', borderBottom:'2px solid rgba(255,255,255,.5)', marginRight: '1rem', fontSize: '1rem', color: 'rgba(255,255,255,.7)', fontWeight:'bolder', fontFamily: font}} placeholder={'Posicion de memoria (en hexadecimal)'} value={newVariable.position} onChange={evt => setNewVariable({...newVariable , position : evt.target.value})} />
          <button onClick={ newVar }><code>Create</code></button>
        </div>
      </header>
    </div>
  );
}

export default App;

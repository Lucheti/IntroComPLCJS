import React from 'react';
import logo from './logo.svg';
import './App.css';

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

const createVar = (name) => {
  return fetch('http://localhost:3002/setVariable',{
    method: 'POST',
    headers:{
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
    })
  })
}
function App() {

  const [info,setInfo] = React.useState([])
  const [newVarName, setNewVarName] = React.useState('')
  const updateData = () => {
    return fetch('http://localhost:3002').then(res => res.json()).then(data => setInfo(data))
  }
  React.useEffect(() => {
    updateData()
  },[])

  const toggleState = (name,value) => {
    setVar(name,value).then( updateData )
  }

  const newVar = (name) => {
    createVar(name).then( updateData ).then(() => setNewVarName(''))
  }

  return (
    <div className="App">
      <header className="App-header">
        <code>PLC Data</code>
        <ul>
          {info.map( data =>
            <li style={{margin: '1rem', listStyle: 'none'}}>
              <code style={{margin: '1rem'}}>{data.name}</code>
              <code style={{margin: '1rem'}}>{data.value? 'True': 'False'}</code>
              <button style={{padding: '.25rem'}} onClick={() => toggleState(data.name,data.value)}><code>Toggle</code></button>
            </li>
          )}
        </ul>
        <div style={{display: 'flex'}}>
          <input style={{background: 'none', border: 'none', borderBottom:'2px solid rgba(255,255,255,.5)', marginRight: '1rem', fontSize: '1rem', color: 'rgba(255,255,255,.7)', fontWeight:'bolder', fontFamily: font}} placeholder={'Var Name'} value={newVarName} onChange={evt => setNewVarName(evt.target.value)} />
          <button style={{padding: '.25rem'}} onClick={() => newVar(newVarName)}><code>Create</code></button>
        </div>
      </header>
    </div>
  );
}

export default App;

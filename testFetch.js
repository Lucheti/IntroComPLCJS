const fetch = require('node-fetch');

getRegisters = () => {
    fetch('http://localhost:3000/')
        .then(res => res.json())
        .then(json=> console.log(json))
        .catch(err => console.log(err))
}

setRegister = () => {
    fetch('http://localhost:3000/', {
        method: 'POST',
        body: JSON.stringify({ temperatura: 150 }),
        headers: {
            'Content-Type': 'application/json',
        }

    }).then(res => res.json())
}

changeVariable = () => {
    fetch('http://localhost:3000/', {
        method: 'PUT',
        body: JSON.stringify({
            pressure: 15
        }),
        headers: {
            'Content-Type': 'application/json',
        }

    }).then(res => res.json())
}

getHistory = () => {
    fetch('http://localhost:3000/history', {
        method: 'POST',
        body: JSON.stringify({
            variable: "pressure"
        }),
        headers: {
            'Content-Type': 'application/json',
        }

    }).then(res => res.json())
        .then(data => console.log(data))
}

fillList = () => {
    fetch('http://localhost:3000/fill')
}

testList = () => {
    fetch('http://localhost:3000/test')
}
// setRegister()

// getRegisters();

// changeVariable()

// getHistory()

// fillList()

testList()
// create an empty modbus client
var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();

//functions
function write() {
    client.setID(1);

    // write the values 0, 0xffff to registers starting at address 5
    // on device number 1.
    client.writeRegisters(5, [1 , 0x00ff])
        .then(read);
}

function read() {
    // read the 2 registers starting at address 5
    // on device number 1.
    client.readHoldingRegisters(5, 3)
        .then(console.log);
}

// open connection to a tcp line
client.connectTCP("0.0.0.0", { port: 8502 });
client.setID(1);

// read the values of 10 registers starting at address 0
// on device number 1. and log the values to the console.

/*

{ data: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ],
  buffer:
   <Buffer 00 00 00 01 00 02 00 03 00 04 00 05 00 06 00 07 00 08 00 09 00 0a 00 0b> }

 */

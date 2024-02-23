/** 
 * @fileoverview RPi <--> ESP32 I2C Communication
 * @version  1.0
 * @author  carjavi <carjavi@hotmail.com>
 * @license copyright www.instintodigital.net, sep 2023 
 * @Library
 * @Commands
 * @see 
 * @Note 
**/

const i2c = require('i2c-bus');
const i2cBus = i2c.openSync(1); // Abre el bus I2C 1 (puede ser 0 o 1 en Raspberry Pi)

const i2cAddress = 0x55; // Dirección I2C del ESP32


/************* verifica si la direccion del dispositivo esta disponible *********************/
function isI2CAddressAvailable(address) {
    try {
      // Intenta abrir una conexión con la dirección especificada
      i2cBus.sendByteSync(address, 0);
      return true; // La dirección está disponible
    } catch (error) {
      return false; // La dirección no está disponible o hay un error
    }
  }
  const isAvailable = isI2CAddressAvailable(i2cAddress);
  if (isAvailable) {
    console.log(`La dirección I2C 0x${i2cAddress.toString(16)} está disponible.`);
  } else {
    console.log(`La dirección I2C 0x${i2cAddress.toString(16)} no está disponible.`);
  }


/************ Función para leer una cadena de caracteres desde el Arduino/ESP32 *******************************/
function readString() {
  const buffer = Buffer.alloc(256); // Buffer para almacenar la cadena recibida (ajusta el tamaño según tus necesidades)  
  const bytesRead = i2cBus.i2cReadSync(i2cAddress, buffer.length, buffer);
  const data = buffer.toString('utf8', 0, bytesRead); // Convierte el buffer en una cadena de caracteres, nota: viene con caracteres vacios
  const cleanedString = data.replace(/[^\x20-\x7E]/g, ''); // elimina caracteres vacios
  
  if (cleanedString.length > 1){
    const FinalString = cleanedString.replace(/@/g, ''); // elimina los caracteres @ del string que se usaron para enmascarar el dato
    console.log('Data desde el ESP32:', FinalString);
  } 
}


/******************* Función para enviar una cadena de caracteres al Arduino **************************************/ 
function writeString(stringToSend) {
    const buffer = Buffer.from(stringToSend, 'utf8'); // Convierte la cadena en un buffer de bytes
    i2cBus.i2cWriteSync(i2cAddress, buffer.length, buffer);
    //console.log("enviado..");
}
  

// Lee una cadena desde el ESP32
setInterval(readString, 100);



/************************** Keyboard *****************************************************************************/ 
console.log('Testing RPi <==> ESP32-i2C');
console.log('Available keys');
console.log('key space');
console.log('key esc');
console.log('key w');
console.log('key a');
console.log('key s');
console.log('key d');
console.log('key z');
console.log('key x');
console.log('key c');
console.log('key v');
console.log('directional keys');
console.log('Ctrl + c ==> Exit');

var keypress = require('keypress');
 
// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);


// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  //console.log('got "keypress"', key);
  if (key.ctrl && key.name == "c") {
    process.exit();
  }

  if (key.name == "right") {
    //console.log("right");
    writeString('=>');
  }

  if (key.name == "left") {
    //console.log("left");
    writeString('<=');
  }

  if (key.name == "up") {
    //console.log("up");
    writeString('up');
  }

  if (key.name == "down") {
    //console.log("down");
    writeString('down');
  }

  if (key.name == "escape") {
    //console.log("escape");
    writeString('esc');
  }

  if (key.name == "space") {
    //console.log("space");
    writeString('space');
  }

  if (key.name == "w" || key.name == "W") {
    writeString('w');
  }

  if (key.name == "s" || key.name == "S") {
    writeString('s');
  }

  if (key.name == "a" || key.name == "A") {
    writeString('a');
  }
  
  if (key.name == "d" || key.name == "D") {
    writeString('d');
  }

  if (key.name == "z" || key.name == "Z") {
    writeString('0');
  }

  if (key.name == "x" || key.name == "X") {
    writeString('ggggg');
  }

  if (key.name == "c" || key.name == "C") {
    writeString('78765');
  }

  if (key.name == "v" || key.name == "V") {
    writeString('12c$r4');
  }

});
 
process.stdin.setRawMode(true);
process.stdin.resume();
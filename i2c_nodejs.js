/** 
 * @fileoverview Raspberry Pi and Arduino/ESP32 I2C Communication
 * @version  1.0
 * @author  carjavi <carjavi@hotmail.com>
 * @license copyright www.instintodigital.net, sep 2023 
 * @Library
 * @Commands
 * @see https://www.npmjs.com/package/i2c-bus#installation
 * @Note el primer dato que recibe el dispositivo siempre es errado
**/


const i2c = require('i2c-bus');
const i2cBus = i2c.openSync(1); // Abre el bus I2C 1 (puede ser 0 o 1 en Raspberry Pi)

const i2cAddress = 0x55; // Dirección I2C del Arduino/ESP32

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


/************ Función para leer una cadena de caracteres desde el Arduino/ESP32 **********/
function readStringFromArduino() {
  const buffer = Buffer.alloc(256); // Buffer para almacenar la cadena recibida (ajusta el tamaño según tus necesidades)
  const bytesRead = i2cBus.i2cReadSync(i2cAddress, buffer.length, buffer);
  const data = buffer.toString('utf8', 0, bytesRead); // Convierte el buffer en una cadena de caracteres
  const cleanedString = removeNonAsciiCharacters(data); // elimina caracteres vacios
  console.log('Data desde el ESP32/Arduino:', cleanedString);
}

/******************* Función para enviar una cadena de caracteres al Arduino ***********/ 
function writeStringToArduino(stringToSend) {
  const buffer = Buffer.from(stringToSend, 'utf8'); // Convierte la cadena en un buffer de bytes
  i2cBus.i2cWriteSync(i2cAddress, buffer.length, buffer);
  //console.log("enviado..");
}


/* Elimina caracteres no ASCII */
function removeNonAsciiCharacters(inputString) {
    // Utiliza una expresión regular para reemplazar los caracteres no ASCII con una cadena vacía
    return inputString.replace(/[^\x20-\x7E]/g, '');
}



setInterval(() => {
  // Envía una cadena al Arduino/ESP32
  const dataToSend = 'Hello ESP32-Arduino'; // Cambia esto por la cadena que quieras enviar
  writeStringToArduino(dataToSend);

  // Lee una cadena desde el Arduino/ESP32
  readStringFromArduino();
}, 1000);

<p align="center"><img src="./img/i2c.png" height="250" alt=" " /></p>
<h1 align="center"> i2c RPi ESP32/Arduino </h1> 
<h4 align="right">Sep 23</h4>
<img src="https://img.shields.io/badge/Hardware-ESP32-red">
<img src="https://img.shields.io/badge/Hardware-Arduino__nano-red">

<br>

## Scan bus i2C RPi (nodejs)
```
/** 
 * @fileoverview Scan bus i2C RPi
 * @version  1.0
 * @author  carjavi <carjavi@hotmail.com>
 * @license copyright www.instintodigital.net, sep 2023 
 * @Library
 * @Commands
 * @see 
 * @Note 
**/

const i2c = require('i2c-bus');

const i2c1 = i2c.openSync(1); // Abre el bus I2C 1 (puede ser 0 o 1 en Raspberry Pi)

console.log('Escaneando el bus I2C...');

for (let address = 0; address <= 127; address++) {
  try {
    // Intenta abrir una conexión con la dirección actual
    i2c1.sendByteSync(address, 0);
    console.log(`Dispositivo detectado en dirección: 0x${address.toString(16)}`);
  } catch (error) {
    // Si hay un error, no se pudo conectar con la dirección actual
  }
}

// Cierra el bus I2C
i2c1.closeSync();
```

## I2C Communication Between Raspberry Pi and ESP32/Arduino on NodeJS

Bidirectional communication.El dato que se envía desde la RPI se imprime en el ESP32/arduino y luego lo devuelve al bus i2c.

## Configuring I2C on ESP32 
I2C pinout ESP32
SDA (default is GPIO 21)
SCL (default is GPIO 22)
GND

```
/** 
 * @fileoverview Raspberry Pi and ESP32 I2C Communication
 * @version  1.0
 * @author  carjavi <carjavi@hotmail.com>
 * @license copyright www.instintodigital.net, sep 2023 
 * @Library
 * @Commands
 * @see 
 * @Note (ONLY FOR ESP32)
**/


#include <Wire.h>

#define SLAVE_ADDRESS 0x55
String receivedData = "";

void setup() {
  //Wire.begin(SLAVE_ADDRESS);
  Wire.begin((uint8_t)SLAVE_ADDRESS);
  Wire.onReceive(receiveData);
  Serial.begin(115200);
  Serial.println("ready...");
}

void loop() {

}

void receiveData(int byteCount) {
 receivedData = "";
  while (Wire.available()) {
    receivedData += (char)Wire.read();
  }
  Serial.println(receivedData);
  ValidateSerialData(receivedData);
}


void ValidateSerialData(String data){
  /*
  if(data == "Hello ESP32-Arduino/n"){
    Serial.println("es el dato");
  }else{
    Serial.println("NO es el dato");
  }
  */ 
  sendData(data);  
}


void sendData(String string_data) {
   String requestResponse = "@" + string_data + "@";
   //convert string to char[]
   int str_len = (requestResponse.length() + 1);
   char char_array[str_len];
   requestResponse.toCharArray(char_array, str_len);
   //Adds the string to Slave buffer, sent on Request
   Wire.slaveWrite((uint8_t *) char_array, str_len);  
}
```

Asignacion i2cAddress port: 0x55


## Configuring I2C on Arduino Nano
SDA -> A4 <br>
SCL -> A5 <br>
GND

> :warning: **Warning:** se necesita un convertidor de nivel lógico bidireccional  3.3V <-> 5V TTL


## Configuring I2C on the Raspberry Pi

Habilitar la interfaz I2C. En el menú, seleccione «5 – Opciones de interfaz» y luego «P5 I2C» y valide.
```
sudo raspi-config 
```

Instala librerias y tools
```
npm install i2c-bus
sudo apt-get install i2c-tools 
```

Para verificar que el dispositivo esta conectado y funcionando
```
i2cdetect -y 1 
```

Script JS
```
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

```








<br>

---
Copyright &copy; 2022 [carjavi](https://github.com/carjavi). <br>
```www.instintodigital.net``` <br>
carjavi@hotmail.com <br>
<p align="center">
    <a href="https://instintodigital.net/" target="_blank"><img src="./img/developer.png" height="100" alt="www.instintodigital.net"></a>
</p>





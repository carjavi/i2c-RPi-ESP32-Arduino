<p align="center"><img src="./img/i2c.png" height="250" alt=" " /></p>
<h1 align="center"> i2c RPi ESP32/Arduino </h1> 
<h4 align="right">Sep 23</h4>
<img src="https://img.shields.io/badge/Hardware-ESP32-red">
<img src="https://img.shields.io/badge/Hardware-Arduino__nano-red">

<br>

## I2C Communication Between Raspberry Pi and ESP32/Arduino on NodeJS

Bidirectional communication.El dato que se envía desde la RPI se imprime en el ESP32/arduino y luego lo devuelve al bus i2c.

## Configuring I2C on ESP32 
I2C pinout ESP32
SDA (default is GPIO 21)
SCL (default is GPIO 22)
GND

```
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


#include <Wire.h>

#define SLAVE_ADDRESS 0x55
String receivedData = "";

void setup() {
  Wire.begin(SLAVE_ADDRESS);
  Wire.onReceive(receiveData);
  Wire.onRequest(sendData);
  Serial.begin(115200);
  Serial.println("ready...");
}

void loop() {
  // Tu código principal aquí
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
}


void sendData() {
  // Envía la cadena de caracteres desde el ESP32/Arduino a la Raspberry Pi
   Wire.write(receivedData.c_str());  // Convierte la cadena a un arreglo de caracteres (char array)
}
```

Asignacion i2cAddress port: 0x55


## Configuring I2C on Arduino Nano
SDA -> A4
SCL -> A5
GND

Asignacion i2cAddress port: 0x8

nota: se necesita un convertidor de nivel lógico bidireccional  3.3V <-> 5V TTL


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

```








<br>

---
Copyright &copy; 2022 [carjavi](https://github.com/carjavi). <br>
```www.instintodigital.net``` <br>
carjavi@hotmail.com <br>
<p align="center">
    <a href="https://instintodigital.net/" target="_blank"><img src="./img/developer.png" height="100" alt="www.instintodigital.net"></a>
</p>





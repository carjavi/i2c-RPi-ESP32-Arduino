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

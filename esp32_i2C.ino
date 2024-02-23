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

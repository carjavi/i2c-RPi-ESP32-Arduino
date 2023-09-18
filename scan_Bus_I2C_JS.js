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

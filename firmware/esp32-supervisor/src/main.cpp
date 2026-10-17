// HISTORICO: demo anterior de switches, NO firmware INA3221/OLED probado de Lilith.
// NO cargar directamente sobre el banco actual ESP32-S3: revisa GPIO19 (USB nativo)
// y el nuevo cableado GPIO8 SDA / GPIO9 SCL. Ver firmware/esp32-supervisor/README.md.

#include <Arduino.h>

// Pinout provisional. Cambiar tras elegir la placa ESP32 definitiva.
constexpr uint8_t PIN_LED = 2;
constexpr uint8_t PIN_SW_SDR = 18;
constexpr uint8_t PIN_SW_GPS = 19;

bool lastSdr = HIGH;
bool lastGps = HIGH;

void sendSwitch(const char* name, bool active) {
  Serial.print("SW ");
  Serial.print(name);
  Serial.print("=");
  Serial.println(active ? "1" : "0");
}

void setup() {
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_SW_SDR, INPUT_PULLUP);
  pinMode(PIN_SW_GPS, INPUT_PULLUP);

  Serial.begin(115200);
  delay(300);
  Serial.println("HELLO ESP32-SUPERVISOR 0.1");
}

void loop() {
  const bool sdr = digitalRead(PIN_SW_SDR);
  const bool gps = digitalRead(PIN_SW_GPS);

  if (sdr != lastSdr) {
    lastSdr = sdr;
    sendSwitch("SDR", sdr == LOW);
  }

  if (gps != lastGps) {
    lastGps = gps;
    sendSwitch("GPS", gps == LOW);
  }

  if (Serial.available()) {
    String line = Serial.readStringUntil('\n');
    line.trim();

    if (line == "PING") {
      Serial.println("PONG");
    } else if (line.startsWith("SYS ") ||
               line.startsWith("NET ") ||
               line.startsWith("TEMP ") ||
               line.startsWith("MODE ")) {
      // En el MVP simplemente confirmamos recepción.
      Serial.print("ACK ");
      Serial.println(line);
    }
  }

  delay(10);
}

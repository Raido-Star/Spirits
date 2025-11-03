/**
 * NexusForge STM32 UART Example
 *
 * Demonstrates UART communication on STM32
 */

#include <Arduino.h>

// LED pin (built-in LED on most Nucleo boards)
#define LED_PIN PC13

// Buffer for incoming data
char rxBuffer[256];
uint8_t rxIndex = 0;

void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  delay(1000);

  // Print welcome message
  Serial.println("\n\n");
  Serial.println("================================");
  Serial.println("NexusForge STM32 UART Example");
  Serial.println("================================");
  Serial.println();
  Serial.println("Commands:");
  Serial.println("  LED ON  - Turn LED on");
  Serial.println("  LED OFF - Turn LED off");
  Serial.println("  STATUS  - Print system status");
  Serial.println("  HELP    - Show this help");
  Serial.println();

  // Initialize LED pin
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  Serial.println("System ready!");
  Serial.print("> ");
}

void processCommand(String cmd) {
  cmd.trim();
  cmd.toUpperCase();

  if (cmd == "LED ON") {
    digitalWrite(LED_PIN, HIGH);
    Serial.println("LED turned ON");
  }
  else if (cmd == "LED OFF") {
    digitalWrite(LED_PIN, LOW);
    Serial.println("LED turned OFF");
  }
  else if (cmd == "STATUS") {
    Serial.println("\n--- System Status ---");
    Serial.print("Core: STM32F4");
    Serial.print("\nClock: ");
    Serial.print(SystemCoreClock / 1000000);
    Serial.println(" MHz");
    Serial.print("LED State: ");
    Serial.println(digitalRead(LED_PIN) ? "ON" : "OFF");
    Serial.println("--------------------");
  }
  else if (cmd == "HELP") {
    Serial.println("\nAvailable commands:");
    Serial.println("  LED ON  - Turn LED on");
    Serial.println("  LED OFF - Turn LED off");
    Serial.println("  STATUS  - Print system status");
    Serial.println("  HELP    - Show this help");
  }
  else if (cmd.length() > 0) {
    Serial.print("Unknown command: ");
    Serial.println(cmd);
  }
}

void loop() {
  // Check for incoming serial data
  while (Serial.available() > 0) {
    char c = Serial.read();

    if (c == '\n' || c == '\r') {
      if (rxIndex > 0) {
        rxBuffer[rxIndex] = '\0';
        Serial.println(); // Echo newline

        // Process command
        processCommand(String(rxBuffer));

        // Reset buffer
        rxIndex = 0;
        Serial.print("> ");
      }
    }
    else if (rxIndex < sizeof(rxBuffer) - 1) {
      rxBuffer[rxIndex++] = c;
      Serial.print(c); // Echo character
    }
  }

  // Heartbeat (blink every 2 seconds)
  static unsigned long lastBlink = 0;
  if (millis() - lastBlink > 2000) {
    lastBlink = millis();
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
  }
}

/**
 * NexusForge Arduino Sensor Example
 *
 * Reads temperature and humidity from DHT sensor
 * and displays on Serial monitor
 */

#include <DHT.h>
#include <Wire.h>

// Pin definitions
#define DHTPIN 2
#define DHTTYPE DHT22

// Create DHT sensor object
DHT dht(DHTPIN, DHTTYPE);

// Variables
float temperature = 0;
float humidity = 0;
unsigned long lastReadTime = 0;
const unsigned long READ_INTERVAL = 2000; // Read every 2 seconds

void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  while (!Serial) {
    ; // Wait for serial port to connect
  }

  Serial.println("NexusForge Arduino Sensor Example");
  Serial.println("==================================");

  // Initialize DHT sensor
  dht.begin();

  Serial.println("Sensor initialized!");
  delay(2000); // Wait for sensor to stabilize
}

void loop() {
  unsigned long currentTime = millis();

  // Read sensor at specified interval
  if (currentTime - lastReadTime >= READ_INTERVAL) {
    lastReadTime = currentTime;

    // Read temperature and humidity
    humidity = dht.readHumidity();
    temperature = dht.readTemperature(); // Celsius

    // Check if readings are valid
    if (isnan(humidity) || isnan(temperature)) {
      Serial.println("Failed to read from DHT sensor!");
      return;
    }

    // Calculate heat index
    float heatIndex = dht.computeHeatIndex(temperature, humidity, false);

    // Print readings
    Serial.println("\n--- Sensor Readings ---");
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" °C");

    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");

    Serial.print("Heat Index: ");
    Serial.print(heatIndex);
    Serial.println(" °C");
    Serial.println("----------------------");
  }
}

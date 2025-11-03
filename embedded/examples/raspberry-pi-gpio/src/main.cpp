/**
 * NexusForge Raspberry Pi GPIO Example
 *
 * Demonstrates GPIO control on Raspberry Pi using WiringPi
 *
 * Compile with: g++ -o gpio_example main.cpp -lwiringPi -lpthread
 * Run with: sudo ./gpio_example
 */

#include <iostream>
#include <wiringPi.h>
#include <signal.h>
#include <unistd.h>

// GPIO pins (BCM numbering)
#define LED_PIN 18
#define BUTTON_PIN 23

volatile bool running = true;

void signalHandler(int signum) {
    std::cout << "\nShutting down..." << std::endl;
    running = false;
}

void buttonInterrupt() {
    static unsigned long lastInterrupt = 0;
    unsigned long interruptTime = millis();

    // Debounce
    if (interruptTime - lastInterrupt > 200) {
        int ledState = digitalRead(LED_PIN);
        digitalWrite(LED_PIN, !ledState);
        std::cout << "Button pressed! LED is now "
                  << (!ledState ? "ON" : "OFF") << std::endl;
    }
    lastInterrupt = interruptTime;
}

int main() {
    std::cout << "================================" << std::endl;
    std::cout << "NexusForge Raspberry Pi GPIO" << std::endl;
    std::cout << "================================" << std::endl;
    std::cout << std::endl;

    // Setup signal handler
    signal(SIGINT, signalHandler);
    signal(SIGTERM, signalHandler);

    // Initialize WiringPi
    if (wiringPiSetupGpio() == -1) {
        std::cerr << "Failed to initialize WiringPi!" << std::endl;
        std::cerr << "Make sure to run with sudo" << std::endl;
        return 1;
    }

    std::cout << "WiringPi initialized successfully" << std::endl;

    // Setup LED pin
    pinMode(LED_PIN, OUTPUT);
    digitalWrite(LED_PIN, LOW);
    std::cout << "LED pin configured: GPIO " << LED_PIN << std::endl;

    // Setup button pin with pull-up resistor
    pinMode(BUTTON_PIN, INPUT);
    pullUpDnControl(BUTTON_PIN, PUD_UP);
    std::cout << "Button pin configured: GPIO " << BUTTON_PIN << std::endl;

    // Setup interrupt for button
    wiringPiISR(BUTTON_PIN, INT_EDGE_FALLING, &buttonInterrupt);
    std::cout << "Interrupt configured for button" << std::endl;

    std::cout << "\nPress button to toggle LED" << std::endl;
    std::cout << "Press Ctrl+C to exit" << std::endl;
    std::cout << std::endl;

    // Main loop - heartbeat blink
    int blinkCount = 0;
    while (running) {
        // Slow blink to show program is running
        digitalWrite(LED_PIN, HIGH);
        delay(100);
        digitalWrite(LED_PIN, LOW);
        delay(1900);

        blinkCount++;
        if (blinkCount % 30 == 0) {
            std::cout << "Running... (uptime: "
                      << (blinkCount * 2) << " seconds)" << std::endl;
        }
    }

    // Cleanup
    digitalWrite(LED_PIN, LOW);
    std::cout << "Cleanup complete. Goodbye!" << std::endl;

    return 0;
}

# Quick Start Guide

Get up and running with NexusForge Embedded Development Environment in 5 minutes!

## ⚡ 5-Minute Setup

### Step 1: Prerequisites Check
```bash
# Verify Docker is installed
docker --version
docker-compose --version

# Should show Docker version 20.10+ and Docker Compose 2.0+
```

### Step 2: Setup Environment
```bash
cd embedded
make setup
```

### Step 3: Configure Settings
```bash
# Copy and edit environment file
nano .env

# Minimum configuration for ESP32:
WIFI_SSID=your_wifi_name
WIFI_PASSWORD=your_wifi_password
```

### Step 4: Start Environment
```bash
make docker-up
```

### Step 5: Enter Shell
```bash
make shell
```

🎉 **You're ready to build!**

## 🎯 Your First Project

### Option A: ESP32 Blink (Easiest)

```bash
# Inside the container shell
cd /workspace/examples/esp32-blink

# Build
idf.py build

# Connect your ESP32 via USB
# Flash (replace /dev/ttyUSB0 with your port)
idf.py -p /dev/ttyUSB0 flash

# Monitor output
idf.py -p /dev/ttyUSB0 monitor

# Exit monitor with Ctrl+]
```

### Option B: Interactive Build Tool

```bash
# Inside container
nexusforge-build

# Follow the menu:
# 1. Select your platform (e.g., ESP32)
# 2. Choose build options
# 3. Build and flash
```

### Option C: Create Your Own Project

```bash
# Inside container
nexusforge-build

# Select "Create new project"
# Follow prompts
# Your project is created in /workspace/projects/
```

## 🔍 Finding Your USB Port

### Linux / macOS
```bash
# List serial devices
ls /dev/tty*

# Common ports:
# /dev/ttyUSB0, /dev/ttyUSB1  (Linux)
# /dev/ttyACM0, /dev/ttyACM1  (Linux)
# /dev/cu.usbserial-*         (macOS)
```

### Inside Container
```bash
ls -la /dev/tty{USB,ACM}*
```

## 🎨 Platform-Specific Quick Start

### ESP32
```bash
# Create project
idf.py create-project my_app

# Configure
cd my_app
idf.py menuconfig

# Build
idf.py build

# Flash
idf.py -p /dev/ttyUSB0 flash monitor
```

### Arduino (PlatformIO)
```bash
# Create project
pio project init -d my_arduino -b uno

# Edit source
cd my_arduino
nano src/main.cpp

# Build and upload
pio run -t upload
pio device monitor
```

### STM32
```bash
# Create project
pio project init -d my_stm32 -b nucleo_f401re

# Edit source
cd my_stm32
nano src/main.cpp

# Build and upload
pio run -t upload
```

### Raspberry Pi
```bash
# Create project
mkdir my_rpi_app && cd my_rpi_app

# Create CMakeLists.txt
cat > CMakeLists.txt << EOF
cmake_minimum_required(VERSION 3.10)
project(my_app)
add_executable(my_app main.cpp)
EOF

# Create source
cat > main.cpp << EOF
#include <iostream>
int main() {
    std::cout << "Hello Raspberry Pi!" << std::endl;
    return 0;
}
EOF

# Cross-compile
mkdir build && cd build
cmake -DCMAKE_C_COMPILER=arm-linux-gnueabihf-gcc \
      -DCMAKE_CXX_COMPILER=arm-linux-gnueabihf-g++ ..
make

# Transfer to Pi
scp my_app pi@raspberrypi.local:~/
```

## 🔧 Essential Commands

```bash
# Build project
make build

# Flash firmware
make flash

# Serial monitor
make monitor

# Check status
make status

# Clean builds
make clean

# View examples
make examples
```

## 📱 Example: ESP32 WiFi + LED

Here's a complete example that connects to WiFi and blinks an LED:

```c
#include <WiFi.h>

const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
const int ledPin = 2;

void setup() {
    Serial.begin(115200);
    pinMode(ledPin, OUTPUT);

    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("\nConnected!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
}

void loop() {
    digitalWrite(ledPin, HIGH);
    delay(1000);
    digitalWrite(ledPin, LOW);
    delay(1000);
    Serial.println("Blink!");
}
```

Save as `wifi_blink.ino` and use Arduino CLI or PlatformIO to build!

## 🎓 Next Steps

1. **Explore Examples**: Check out `/workspace/examples/`
2. **Read Documentation**: See README.md for detailed info
3. **Customize**: Modify examples for your needs
4. **Build Something**: Create your own project!

## ❓ Common Issues

### "Permission denied" on USB port
```bash
# Outside container (on host)
sudo usermod -a -G dialout $USER
# Log out and back in
```

### "Device not found"
```bash
# Check USB connection
lsusb

# Check if device appears
ls /dev/tty*

# Verify container can see device
make shell
ls /dev/tty*
```

### "Build failed"
```bash
# Clean and rebuild
make clean
make docker-build
make docker-up
```

## 🚀 Pro Tips

1. **Use tab completion**: Most commands support tab completion
2. **Keep projects external**: Store in `projects/` directory
3. **Use the interactive tool**: `nexusforge-build` is the easiest way
4. **Monitor during flash**: Add `monitor` to see output immediately
5. **Save port in config**: Set default port in `platformio.ini` or sdkconfig

## 📚 Learn More

- [Full README](README.md) - Complete documentation
- [Examples Directory](examples/) - Sample projects
- [Platform Docs](https://docs.espressif.com/) - ESP-IDF documentation
- [PlatformIO Docs](https://docs.platformio.org/) - PlatformIO guide

## 🎉 You're Ready!

Start building amazing embedded projects with NexusForge!

```bash
# Get help anytime
make help

# Enter the environment
make shell

# Start building!
nexusforge-build
```

Happy coding! 🚀

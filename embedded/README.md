# NexusForge Embedded Development Environment

A comprehensive, Docker-based development environment for building firmware and applications for **microcontrollers** and **Raspberry Pi** with rich features, tools, and code libraries.

## 🚀 Features

### Supported Platforms

- **ESP32 Family**: ESP32, ESP32-S2, ESP32-S3, ESP32-C3, ESP32-C6
- **ESP8266**: All variants
- **Arduino**: AVR, SAMD, and compatible boards
- **STM32**: All STM32 families via PlatformIO
- **Raspberry Pi**: All models (Zero, 1, 2, 3, 4, 5) with cross-compilation support

### Rich Development Tools

- **PlatformIO**: Universal embedded development platform
- **ESP-IDF**: Official Espressif IoT Development Framework
- **Arduino CLI**: Command-line Arduino development
- **ARM GCC**: ARM embedded toolchain
- **Cross-compilers**: For Raspberry Pi (ARMv6, ARMv7, ARMv8/AArch64)
- **OpenOCD**: On-chip debugging
- **ST-Link**: STM32 programming and debugging

### Built-in Features

- **Serial Monitor**: Universal serial debugging tool
- **Flash Tool**: Automated flashing for all supported platforms
- **Interactive Build System**: Menu-driven build tool
- **Code Libraries**: Common libraries and utilities
- **Example Projects**: Ready-to-use examples for each platform
- **Web IDE**: Optional VS Code in browser

## 📦 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- USB access for your development boards
- Linux, macOS, or Windows with WSL2

### Installation

1. **Clone and enter the embedded directory:**
   ```bash
   cd embedded
   ```

2. **Initial setup:**
   ```bash
   make setup
   ```

3. **Configure environment:**
   ```bash
   nano .env
   # Edit WiFi credentials and other settings
   ```

4. **Build and start the environment:**
   ```bash
   make docker-up
   ```

5. **Enter the development shell:**
   ```bash
   make shell
   ```

## 🛠️ Usage

### Building Projects

#### Interactive Build Tool
```bash
nexusforge-build
```

This launches an interactive menu where you can:
- Select target platform
- Configure build options
- Build and flash firmware
- Create new projects

#### Using PlatformIO
```bash
cd projects/my-project
pio run                    # Build
pio run -t upload          # Upload to device
pio device monitor         # Serial monitor
```

#### Using ESP-IDF
```bash
cd projects/esp32-project
source $IDF_PATH/export.sh
idf.py build               # Build
idf.py flash               # Flash
idf.py monitor             # Monitor
```

#### Using Arduino CLI
```bash
arduino-cli compile --fqbn esp32:esp32:esp32 sketch.ino
arduino-cli upload -p /dev/ttyUSB0 --fqbn esp32:esp32:esp32 sketch.ino
```

#### Cross-compiling for Raspberry Pi
```bash
cd projects/rpi-project
mkdir build && cd build
cmake -DCMAKE_C_COMPILER=arm-linux-gnueabihf-gcc ..
make
```

### Flashing Firmware

```bash
# Interactive flash tool
make flash

# Or manually for ESP32
esptool.py --chip esp32 --port /dev/ttyUSB0 write_flash 0x10000 firmware.bin

# For STM32
st-flash write firmware.bin 0x08000000
```

### Serial Monitoring

```bash
# Interactive monitor
make monitor

# Or using picocom directly
picocom -b 115200 /dev/ttyUSB0

# Using PlatformIO
pio device monitor -b 115200
```

## 📁 Project Structure

```
embedded/
├── Dockerfile                 # Main Docker image
├── docker-compose.yml         # Docker Compose configuration
├── Makefile                   # Convenience commands
├── .env.example              # Environment variables template
├── scripts/
│   ├── entrypoint.sh         # Container entrypoint
│   ├── nexusforge-build.sh   # Interactive build tool
│   ├── flash-tool.sh         # Universal flash utility
│   └── monitor.sh            # Serial monitor
├── libraries/
│   └── nexusforge_common.h   # Common library header
├── examples/
│   ├── esp32-blink/          # ESP32 LED blink (ESP-IDF)
│   ├── esp32-wifi/           # ESP32 WiFi connection
│   ├── arduino-sensor/       # Arduino sensor reading
│   ├── stm32-uart/           # STM32 UART example
│   └── raspberry-pi-gpio/    # Raspberry Pi GPIO
├── projects/                 # Your projects go here
└── build/                    # Build artifacts
```

## 🔧 Available Commands

All commands are available via the Makefile:

```bash
make help           # Show all commands
make setup          # Initial setup
make docker-build   # Build Docker image
make docker-up      # Start containers
make docker-down    # Stop containers
make shell          # Enter development shell
make build          # Interactive build tool
make flash          # Flash firmware
make monitor        # Serial monitor
make examples       # List examples
make clean          # Clean build files
make status         # Show environment status
make update         # Update toolchains
```

## 📚 Example Projects

### ESP32 LED Blink
```bash
cd examples/esp32-blink
idf.py build
idf.py -p /dev/ttyUSB0 flash monitor
```

### ESP32 WiFi Connection
```bash
cd examples/esp32-wifi
# Configure WiFi in .env or sdkconfig
idf.py menuconfig
idf.py build flash monitor
```

### Arduino DHT Sensor
```bash
cd examples/arduino-sensor
arduino-cli compile --fqbn arduino:avr:uno arduino_sensor.ino
arduino-cli upload -p /dev/ttyUSB0 --fqbn arduino:avr:uno arduino_sensor.ino
```

### STM32 UART
```bash
cd examples/stm32-uart
pio run -t upload
pio device monitor
```

### Raspberry Pi GPIO
```bash
cd examples/raspberry-pi-gpio
mkdir build && cd build
cmake -DCMAKE_C_COMPILER=arm-linux-gnueabihf-gcc ..
make
# Transfer to Raspberry Pi
scp rpi_gpio_example pi@192.168.1.100:~/
```

## 🌐 Web IDE (Optional)

Access the web-based VS Code IDE:

```bash
# Already running if you used docker-compose up
# Access at: http://localhost:8081
# Default password: nexusforge
```

## 🔌 USB Device Access

### Linux
Add your user to the dialout group:
```bash
sudo usermod -a -G dialout $USER
sudo usermod -a -G plugdev $USER
# Logout and login again
```

### macOS
USB devices should work automatically with Docker Desktop.

### Windows (WSL2)
Use usbipd to forward USB devices to WSL2:
```bash
# In PowerShell (as Administrator)
usbipd list
usbipd bind --busid <BUSID>
usbipd attach --wsl --busid <BUSID>
```

## 🎨 Creating New Projects

### Using the Interactive Tool
```bash
nexusforge-build
# Select "Create new project"
```

### Manual Creation

**ESP32 Project:**
```bash
idf.py create-project my-esp32-app
cd my-esp32-app
idf.py build
```

**PlatformIO Project:**
```bash
pio project init -d my-project -b esp32dev
cd my-project
# Edit platformio.ini and src/main.cpp
pio run
```

**Raspberry Pi Project:**
```bash
mkdir my-rpi-app && cd my-rpi-app
# Create CMakeLists.txt and source files
mkdir build && cd build
cmake ..
make
```

## 🔧 Advanced Configuration

### Custom Toolchains
Add custom toolchains in the Dockerfile and rebuild:
```bash
make docker-build
```

### PlatformIO Configuration
Edit `~/.platformio/platformio.ini` or project-specific `platformio.ini`

### ESP-IDF Configuration
```bash
idf.py menuconfig
```

## 🐛 Troubleshooting

### USB Device Not Found
```bash
# Check if devices are visible
ls -la /dev/tty{USB,ACM}*

# Verify permissions
sudo chmod 666 /dev/ttyUSB0

# Check Docker device passthrough
docker-compose exec embedded-dev ls -la /dev/tty{USB,ACM}*
```

### Build Errors
```bash
# Clean build
make clean

# Update toolchains
make update

# Check environment
make status
```

### ESP32 Flash Errors
```bash
# Try lower baud rate
esptool.py --chip esp32 --port /dev/ttyUSB0 --baud 115200 write_flash ...

# Hold BOOT button while flashing
```

## 📖 Documentation

- **ESP-IDF**: https://docs.espressif.com/projects/esp-idf/
- **PlatformIO**: https://docs.platformio.org/
- **Arduino**: https://www.arduino.cc/reference/
- **Raspberry Pi**: https://www.raspberrypi.org/documentation/

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of NexusForge AI Platform and is licensed under the MIT License.

## 💡 Tips & Best Practices

1. **Always backup your projects** outside the container
2. **Use version control** for your projects (git)
3. **Test on actual hardware** before production
4. **Monitor serial output** during development
5. **Use proper power supply** for your boards
6. **Check pinout diagrams** before wiring
7. **Enable debug logging** during development
8. **Use OTA updates** for ESP32 when possible

## 🆘 Support

For issues and questions:
- Check the troubleshooting section above
- Review example projects
- Consult platform-specific documentation
- Open an issue on GitHub

## 🎯 Roadmap

- [ ] VSCode extensions for embedded development
- [ ] Automated testing framework
- [ ] CI/CD integration examples
- [ ] More example projects
- [ ] GUI configuration tool
- [ ] Remote debugging support
- [ ] Multi-device parallel programming
- [ ] Code generation templates

---

**Built with ❤️ by the NexusForge Team**

*Making embedded development accessible, powerful, and fun!*

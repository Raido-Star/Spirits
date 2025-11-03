#!/bin/bash
# NexusForge Interactive Build Tool
# Simplifies building for microcontrollers and Raspberry Pi

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
PROJECT_DIR="${1:-.}"
BUILD_DIR="./build"
CONFIG_FILE=".nexusforge-build.yml"

# Functions
print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Show main menu
show_menu() {
    print_header "NexusForge Build Tool"
    echo "Select target platform:"
    echo ""
    echo "  1) ESP32 (ESP-IDF)"
    echo "  2) ESP32 (Arduino)"
    echo "  3) ESP8266 (Arduino)"
    echo "  4) Arduino (AVR)"
    echo "  5) Arduino (SAMD)"
    echo "  6) STM32 (PlatformIO)"
    echo "  7) Raspberry Pi (Native)"
    echo "  8) Raspberry Pi (Cross-compile)"
    echo "  9) Custom PlatformIO project"
    echo " 10) Create new project"
    echo "  0) Exit"
    echo ""
    read -p "Enter choice [0-10]: " choice
}

# ESP32 with ESP-IDF
build_esp32_idf() {
    print_header "Building ESP32 Project (ESP-IDF)"

    if [ ! -f "CMakeLists.txt" ]; then
        print_error "No CMakeLists.txt found. Is this an ESP-IDF project?"
        return 1
    fi

    source ${IDF_PATH}/export.sh

    print_info "Setting target to ESP32..."
    idf.py set-target esp32

    print_info "Configuring project..."
    idf.py menuconfig || true

    print_info "Building project..."
    idf.py build

    print_success "Build complete!"

    read -p "Flash to device? (y/n): " flash_choice
    if [ "$flash_choice" = "y" ]; then
        read -p "Enter serial port [/dev/ttyUSB0]: " port
        port=${port:-/dev/ttyUSB0}
        idf.py -p $port flash monitor
    fi
}

# ESP32 with Arduino
build_esp32_arduino() {
    print_header "Building ESP32 Project (Arduino)"

    # Find .ino file
    ino_file=$(find . -maxdepth 1 -name "*.ino" | head -1)

    if [ -z "$ino_file" ]; then
        print_error "No .ino file found in current directory"
        return 1
    fi

    print_info "Found sketch: $ino_file"

    echo "Select ESP32 board:"
    echo "  1) ESP32 Dev Module"
    echo "  2) ESP32-S2"
    echo "  3) ESP32-S3"
    echo "  4) ESP32-C3"
    read -p "Choice [1-4]: " board_choice

    case $board_choice in
        1) FQBN="esp32:esp32:esp32" ;;
        2) FQBN="esp32:esp32:esp32s2" ;;
        3) FQBN="esp32:esp32:esp32s3" ;;
        4) FQBN="esp32:esp32:esp32c3" ;;
        *) FQBN="esp32:esp32:esp32" ;;
    esac

    print_info "Compiling for $FQBN..."
    arduino-cli compile --fqbn $FQBN $ino_file

    print_success "Build complete!"

    read -p "Upload to device? (y/n): " upload_choice
    if [ "$upload_choice" = "y" ]; then
        read -p "Enter serial port [/dev/ttyUSB0]: " port
        port=${port:-/dev/ttyUSB0}
        arduino-cli upload -p $port --fqbn $FQBN $ino_file
    fi
}

# PlatformIO build
build_platformio() {
    print_header "Building PlatformIO Project"

    if [ ! -f "platformio.ini" ]; then
        print_error "No platformio.ini found. Is this a PlatformIO project?"
        return 1
    fi

    # List available environments
    envs=$(pio project config --json-output | jq -r '.[] | select(.section | startswith("env:")) | .section' | sed 's/env://g')

    if [ -z "$envs" ]; then
        print_error "No environments found in platformio.ini"
        return 1
    fi

    echo "Available environments:"
    i=1
    declare -a env_array
    for env in $envs; do
        echo "  $i) $env"
        env_array[$i]=$env
        ((i++))
    done

    read -p "Select environment [1-$((i-1))]: " env_choice
    selected_env=${env_array[$env_choice]}

    if [ -z "$selected_env" ]; then
        print_error "Invalid environment selection"
        return 1
    fi

    print_info "Building environment: $selected_env"
    pio run -e $selected_env

    print_success "Build complete!"

    read -p "Upload to device? (y/n): " upload_choice
    if [ "$upload_choice" = "y" ]; then
        pio run -e $selected_env -t upload
    fi
}

# Raspberry Pi cross-compile
build_rpi_cross() {
    print_header "Cross-compiling for Raspberry Pi"

    echo "Select Raspberry Pi model:"
    echo "  1) Raspberry Pi Zero/1 (ARMv6)"
    echo "  2) Raspberry Pi 2/3 (ARMv7)"
    echo "  3) Raspberry Pi 4/5 (ARMv8 - 64-bit)"
    read -p "Choice [1-3]: " rpi_choice

    case $rpi_choice in
        1)
            CC="arm-linux-gnueabihf-gcc"
            CXX="arm-linux-gnueabihf-g++"
            ARCH="armv6"
            ;;
        2)
            CC="arm-linux-gnueabihf-gcc"
            CXX="arm-linux-gnueabihf-g++"
            ARCH="armv7"
            ;;
        3)
            CC="aarch64-linux-gnu-gcc"
            CXX="aarch64-linux-gnu-g++"
            ARCH="aarch64"
            ;;
        *)
            print_error "Invalid choice"
            return 1
            ;;
    esac

    print_info "Using compiler: $CC"

    if [ -f "CMakeLists.txt" ]; then
        print_info "Building CMake project..."
        mkdir -p build
        cd build
        cmake -DCMAKE_C_COMPILER=$CC -DCMAKE_CXX_COMPILER=$CXX ..
        make -j$(nproc)
        cd ..
    elif [ -f "Makefile" ]; then
        print_info "Building with Makefile..."
        make CC=$CC CXX=$CXX -j$(nproc)
    else
        print_error "No CMakeLists.txt or Makefile found"
        return 1
    fi

    print_success "Build complete!"
    print_info "Binary location: ${BUILD_DIR}/"
}

# Create new project
create_project() {
    print_header "Create New Project"

    echo "Select project type:"
    echo "  1) ESP32 (ESP-IDF)"
    echo "  2) ESP32 (PlatformIO)"
    echo "  3) Arduino (PlatformIO)"
    echo "  4) STM32 (PlatformIO)"
    echo "  5) Raspberry Pi (CMake)"
    read -p "Choice [1-5]: " proj_choice

    read -p "Project name: " proj_name

    if [ -z "$proj_name" ]; then
        print_error "Project name cannot be empty"
        return 1
    fi

    case $proj_choice in
        1)
            print_info "Creating ESP-IDF project..."
            idf.py create-project $proj_name
            ;;
        2)
            print_info "Creating ESP32 PlatformIO project..."
            pio project init -d $proj_name -b esp32dev
            ;;
        3)
            print_info "Creating Arduino PlatformIO project..."
            pio project init -d $proj_name -b uno
            ;;
        4)
            print_info "Creating STM32 PlatformIO project..."
            pio project init -d $proj_name -b nucleo_f401re
            ;;
        5)
            print_info "Creating Raspberry Pi CMake project..."
            mkdir -p $proj_name/src
            cat > $proj_name/CMakeLists.txt << 'EOF'
cmake_minimum_required(VERSION 3.10)
project(MyRPiProject)

set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 17)

add_executable(${PROJECT_NAME} src/main.cpp)
EOF
            cat > $proj_name/src/main.cpp << 'EOF'
#include <iostream>

int main() {
    std::cout << "Hello from Raspberry Pi!" << std::endl;
    return 0;
}
EOF
            ;;
    esac

    print_success "Project created: $proj_name"
}

# Main loop
main() {
    while true; do
        show_menu

        case $choice in
            1) build_esp32_idf ;;
            2) build_esp32_arduino ;;
            3) build_esp32_arduino ;;  # Same as ESP32 Arduino
            4) build_platformio ;;
            5) build_platformio ;;
            6) build_platformio ;;
            7) print_info "Building natively on Raspberry Pi..." ;;
            8) build_rpi_cross ;;
            9) build_platformio ;;
            10) create_project ;;
            0)
                print_info "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid choice"
                ;;
        esac

        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main
main

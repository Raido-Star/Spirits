#!/bin/bash
# NexusForge Flash Tool
# Universal flashing utility for various microcontrollers

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║     NexusForge Flash Tool              ║${NC}"
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}\n"
}

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${YELLOW}ℹ $1${NC}"; }

# Detect serial ports
detect_ports() {
    print_info "Detecting serial ports..."
    ports=$(ls /dev/tty{USB,ACM}* 2>/dev/null || true)

    if [ -z "$ports" ]; then
        print_error "No serial devices found!"
        echo "Please connect your device and try again."
        exit 1
    fi

    echo -e "${GREEN}Found devices:${NC}"
    i=1
    for port in $ports; do
        echo "  $i) $port"
        port_array[$i]=$port
        ((i++))
    done

    read -p "Select port [1-$((i-1))]: " port_choice
    SELECTED_PORT=${port_array[$port_choice]}

    if [ -z "$SELECTED_PORT" ]; then
        print_error "Invalid port selection"
        exit 1
    fi

    print_success "Selected port: $SELECTED_PORT"
}

# Flash ESP32/ESP8266
flash_esp() {
    print_info "Flashing ESP32/ESP8266..."

    if [ ! -f "$1" ]; then
        print_error "Binary file not found: $1"
        exit 1
    fi

    detect_ports

    echo "Select chip type:"
    echo "  1) ESP32"
    echo "  2) ESP32-S2"
    echo "  3) ESP32-S3"
    echo "  4) ESP32-C3"
    echo "  5) ESP8266"
    read -p "Choice [1-5]: " chip_choice

    case $chip_choice in
        1) CHIP="esp32" ;;
        2) CHIP="esp32s2" ;;
        3) CHIP="esp32s3" ;;
        4) CHIP="esp32c3" ;;
        5) CHIP="esp8266" ;;
        *) CHIP="esp32" ;;
    esac

    print_info "Using chip: $CHIP"
    print_info "Flashing firmware..."

    esptool.py --chip $CHIP --port $SELECTED_PORT \
        --baud 921600 --before default_reset --after hard_reset \
        write_flash -z --flash_mode dio --flash_freq 40m --flash_size detect \
        0x1000 bootloader.bin \
        0x8000 partitions.bin \
        0x10000 $1

    print_success "Flash complete!"
}

# Flash STM32
flash_stm32() {
    print_info "Flashing STM32..."

    if [ ! -f "$1" ]; then
        print_error "Binary file not found: $1"
        exit 1
    fi

    print_info "Using ST-Link..."

    st-flash write $1 0x08000000

    print_success "Flash complete!"
}

# Flash via Arduino
flash_arduino() {
    print_info "Flashing via Arduino..."

    detect_ports

    if [ ! -f "$1" ]; then
        print_error "Hex file not found: $1"
        exit 1
    fi

    echo "Select board:"
    echo "  1) Arduino Uno"
    echo "  2) Arduino Mega"
    echo "  3) Arduino Nano"
    read -p "Choice [1-3]: " board_choice

    case $board_choice in
        1) FQBN="arduino:avr:uno" ;;
        2) FQBN="arduino:avr:mega" ;;
        3) FQBN="arduino:avr:nano" ;;
        *) FQBN="arduino:avr:uno" ;;
    esac

    avrdude -p atmega328p -c arduino -P $SELECTED_PORT -b 115200 -U flash:w:$1:i

    print_success "Flash complete!"
}

# Main menu
main() {
    print_header

    echo "Select target:"
    echo "  1) ESP32/ESP8266"
    echo "  2) STM32"
    echo "  3) Arduino"
    echo "  4) Raspberry Pi (SCP transfer)"
    echo "  0) Exit"
    echo ""
    read -p "Enter choice: " choice

    case $choice in
        1)
            read -p "Enter firmware binary path: " firmware
            flash_esp $firmware
            ;;
        2)
            read -p "Enter binary path: " binary
            flash_stm32 $binary
            ;;
        3)
            read -p "Enter hex file path: " hexfile
            flash_arduino $hexfile
            ;;
        4)
            read -p "Enter Raspberry Pi IP: " rpi_ip
            read -p "Enter binary path: " binary
            print_info "Copying to Raspberry Pi..."
            scp $binary pi@$rpi_ip:~/
            print_success "Transfer complete!"
            ;;
        0)
            print_info "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
}

main

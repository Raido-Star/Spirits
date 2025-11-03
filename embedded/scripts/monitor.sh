#!/bin/bash
# NexusForge Serial Monitor
# Universal serial monitor for debugging

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║     NexusForge Serial Monitor          ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"
}

# Detect serial ports
detect_ports() {
    ports=$(ls /dev/tty{USB,ACM}* 2>/dev/null || true)

    if [ -z "$ports" ]; then
        echo -e "${RED}No serial devices found!${NC}"
        exit 1
    fi

    echo -e "${GREEN}Available ports:${NC}"
    i=1
    for port in $ports; do
        echo "  $i) $port"
        port_array[$i]=$port
        ((i++))
    done

    read -p "Select port [1-$((i-1))]: " port_choice
    SELECTED_PORT=${port_array[$port_choice]}
}

# Select baud rate
select_baudrate() {
    echo ""
    echo "Common baud rates:"
    echo "  1) 9600"
    echo "  2) 19200"
    echo "  3) 38400"
    echo "  4) 57600"
    echo "  5) 115200"
    echo "  6) 230400"
    echo "  7) 460800"
    echo "  8) 921600"
    echo "  9) Custom"
    read -p "Select baud rate [1-9]: " baud_choice

    case $baud_choice in
        1) BAUDRATE=9600 ;;
        2) BAUDRATE=19200 ;;
        3) BAUDRATE=38400 ;;
        4) BAUDRATE=57600 ;;
        5) BAUDRATE=115200 ;;
        6) BAUDRATE=230400 ;;
        7) BAUDRATE=460800 ;;
        8) BAUDRATE=921600 ;;
        9)
            read -p "Enter custom baud rate: " BAUDRATE
            ;;
        *) BAUDRATE=115200 ;;
    esac
}

# Main
print_header
detect_ports
select_baudrate

echo ""
echo -e "${GREEN}Connecting to ${CYAN}${SELECTED_PORT}${GREEN} at ${CYAN}${BAUDRATE}${GREEN} baud...${NC}"
echo -e "${YELLOW}Press Ctrl+A then K to exit${NC}"
echo ""

# Use picocom for monitoring
picocom -b $BAUDRATE --imap lfcrlf --echo $SELECTED_PORT

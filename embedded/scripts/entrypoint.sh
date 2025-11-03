#!/bin/bash
# NexusForge Embedded Development Environment Entrypoint

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print banner
echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗                ║
║   ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝                ║
║   ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗                ║
║   ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║                ║
║   ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║                ║
║   ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝                ║
║                                                               ║
║            Embedded Development Environment                  ║
║         Microcontroller & Raspberry Pi Builder               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Setup ESP-IDF environment
echo -e "${GREEN}Setting up ESP-IDF environment...${NC}"
if [ -f "${IDF_PATH}/export.sh" ]; then
    source ${IDF_PATH}/export.sh > /dev/null 2>&1
    echo -e "${GREEN}✓ ESP-IDF ready${NC}"
fi

# Check for USB devices
echo -e "${YELLOW}Checking for connected devices...${NC}"
if ls /dev/ttyUSB* 1> /dev/null 2>&1 || ls /dev/ttyACM* 1> /dev/null 2>&1; then
    echo -e "${GREEN}✓ Serial devices found:${NC}"
    ls -la /dev/tty{USB,ACM}* 2>/dev/null || true
else
    echo -e "${YELLOW}⚠ No serial devices detected${NC}"
fi

# Print environment info
echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Available Tools:${NC}"
echo -e "  • PlatformIO: $(pio --version 2>/dev/null || echo 'Not available')"
echo -e "  • Arduino CLI: $(arduino-cli version 2>/dev/null | head -1 || echo 'Not available')"
echo -e "  • ESP-IDF: $(idf.py --version 2>/dev/null || echo 'Not available')"
echo -e "  • CMake: $(cmake --version 2>/dev/null | head -1 || echo 'Not available')"
echo -e "  • ARM GCC: $(arm-none-eabi-gcc --version 2>/dev/null | head -1 || echo 'Not available')"
echo -e "  • ARM Linux GCC: $(arm-linux-gnueabihf-gcc --version 2>/dev/null | head -1 || echo 'Not available')"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"

# Print quick start guide
echo -e "${YELLOW}Quick Start Commands:${NC}"
echo -e "  ${GREEN}nexusforge-build${NC}        - Interactive build tool"
echo -e "  ${GREEN}platformio${NC} or ${GREEN}pio${NC}     - PlatformIO CLI"
echo -e "  ${GREEN}arduino-cli${NC}            - Arduino CLI"
echo -e "  ${GREEN}idf.py${NC}                - ESP-IDF build tool"
echo -e "  ${GREEN}esptool.py${NC}            - ESP32/ESP8266 flash tool"
echo -e ""
echo -e "${YELLOW}Example Projects:${NC}"
echo -e "  ${GREEN}/workspace/examples${NC}   - Sample projects for various platforms"
echo -e ""

# Execute command or start bash
if [ $# -eq 0 ]; then
    exec /bin/bash
else
    exec "$@"
fi

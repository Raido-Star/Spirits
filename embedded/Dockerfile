# NexusForge Embedded Development Environment
# Comprehensive Docker image for microcontroller and Raspberry Pi development

FROM ubuntu:22.04

# Avoid interactive prompts during build
ENV DEBIAN_FRONTEND=noninteractive

# Set working directory
WORKDIR /workspace

# Install system dependencies
RUN apt-get update && apt-get install -y \
    # Build essentials
    build-essential \
    cmake \
    ninja-build \
    ccache \
    git \
    wget \
    curl \
    unzip \
    pkg-config \
    autoconf \
    automake \
    libtool \
    # Python for build tools
    python3 \
    python3-pip \
    python3-venv \
    python-is-python3 \
    # Cross-compilation tools
    gcc-arm-linux-gnueabihf \
    g++-arm-linux-gnueabihf \
    gcc-aarch64-linux-gnu \
    g++-aarch64-linux-gnu \
    # Serial communication
    minicom \
    screen \
    picocom \
    # USB support
    usbutils \
    libusb-1.0-0-dev \
    # Debugging tools
    gdb-multiarch \
    openocd \
    stlink-tools \
    # Utilities
    nano \
    vim \
    htop \
    tree \
    jq \
    # Networking tools
    net-tools \
    iputils-ping \
    # Clean up
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PlatformIO (for microcontroller development)
RUN pip3 install --upgrade pip setuptools wheel && \
    pip3 install platformio && \
    pio upgrade --dev

# Install ESP-IDF (Espressif IoT Development Framework)
ENV IDF_PATH=/opt/esp-idf
RUN git clone --recursive --depth 1 --branch v5.2 \
    https://github.com/espressif/esp-idf.git ${IDF_PATH} && \
    cd ${IDF_PATH} && \
    ./install.sh esp32,esp32s2,esp32s3,esp32c3,esp32c6 && \
    chmod +x ${IDF_PATH}/export.sh

# Install Arduino CLI
RUN curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh && \
    mv bin/arduino-cli /usr/local/bin/ && \
    arduino-cli config init && \
    arduino-cli core update-index && \
    arduino-cli core install arduino:avr && \
    arduino-cli core install arduino:samd && \
    arduino-cli core install esp32:esp32 --additional-urls https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json && \
    arduino-cli core install esp8266:esp8266 --additional-urls https://arduino.esp8266.com/stable/package_esp8266com_index.json

# Install ARM GCC toolchain for embedded development
RUN wget -q https://developer.arm.com/-/media/Files/downloads/gnu/13.2.rel1/binrel/arm-gnu-toolchain-13.2.rel1-x86_64-arm-none-eabi.tar.xz && \
    tar -xf arm-gnu-toolchain-13.2.rel1-x86_64-arm-none-eabi.tar.xz -C /opt/ && \
    rm arm-gnu-toolchain-13.2.rel1-x86_64-arm-none-eabi.tar.xz && \
    ln -s /opt/arm-gnu-toolchain-13.2.Rel1-x86_64-arm-none-eabi /opt/arm-none-eabi

# Install Raspberry Pi cross-compilation toolchain
RUN git clone --depth=1 https://github.com/raspberrypi/tools /opt/rpi-tools

# Add toolchains to PATH
ENV PATH="${PATH}:/opt/arm-none-eabi/bin:/opt/rpi-tools/arm-bcm2708/arm-linux-gnueabihf/bin:/opt/rpi-tools/arm-bcm2708/gcc-linaro-arm-linux-gnueabihf-raspbian-x64/bin"

# Install additional useful Python packages
RUN pip3 install \
    esptool \
    adafruit-ampy \
    pyserial \
    littlefs-python \
    construct \
    paho-mqtt \
    requests \
    colorama \
    click \
    pyyaml

# Install STM32 tools
RUN wget -q https://github.com/stlink-org/stlink/releases/download/v1.8.0/stlink_1.8.0-1_amd64.deb && \
    dpkg -i stlink_1.8.0-1_amd64.deb || apt-get install -f -y && \
    rm stlink_1.8.0-1_amd64.deb

# Create workspace directory structure
RUN mkdir -p /workspace/projects \
    /workspace/libraries \
    /workspace/tools \
    /workspace/examples \
    /workspace/build

# Set up environment variables
ENV PLATFORMIO_CORE_DIR=/workspace/.platformio
ENV ARDUINO_DIRECTORIES_USER=/workspace/Arduino
ENV ARDUINO_DIRECTORIES_DATA=/workspace/Arduino/data

# Create helper scripts directory
RUN mkdir -p /usr/local/bin/nexusforge

# Copy entrypoint script (will be created separately)
COPY scripts/entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose common ports
# 8080: Web interface
# 9000: Debugging
# 3333: OpenOCD
EXPOSE 8080 9000 3333

# Set entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/bin/bash"]

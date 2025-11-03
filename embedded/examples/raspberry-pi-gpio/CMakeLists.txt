# NexusForge Raspberry Pi GPIO Example

cmake_minimum_required(VERSION 3.10)
project(rpi_gpio_example)

set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 17)

# Find libraries
find_library(WIRINGPI_LIB wiringPi)
find_library(PTHREAD_LIB pthread)

# Source files
set(SOURCES
    src/main.cpp
)

# Create executable
add_executable(${PROJECT_NAME} ${SOURCES})

# Link libraries
target_link_libraries(${PROJECT_NAME}
    ${WIRINGPI_LIB}
    ${PTHREAD_LIB}
)

# Install target
install(TARGETS ${PROJECT_NAME} DESTINATION bin)

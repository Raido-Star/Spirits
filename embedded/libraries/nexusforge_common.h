/**
 * NexusForge Common Library
 *
 * Portable code library for microcontrollers and Raspberry Pi
 * Provides unified API for common tasks
 */

#ifndef NEXUSFORGE_COMMON_H
#define NEXUSFORGE_COMMON_H

#include <stdint.h>
#include <stdbool.h>

// Platform detection
#if defined(ESP32)
    #define PLATFORM_ESP32
    #include "freertos/FreeRTOS.h"
    #include "freertos/task.h"
    #define NF_DELAY_MS(ms) vTaskDelay(ms / portTICK_PERIOD_MS)
#elif defined(ARDUINO)
    #define PLATFORM_ARDUINO
    #include <Arduino.h>
    #define NF_DELAY_MS(ms) delay(ms)
#elif defined(__arm__) || defined(__aarch64__)
    #define PLATFORM_RASPBERRY_PI
    #include <unistd.h>
    #define NF_DELAY_MS(ms) usleep(ms * 1000)
#else
    #define PLATFORM_GENERIC
    #define NF_DELAY_MS(ms) /* Not implemented */
#endif

// Logger levels
typedef enum {
    NF_LOG_NONE = 0,
    NF_LOG_ERROR,
    NF_LOG_WARN,
    NF_LOG_INFO,
    NF_LOG_DEBUG,
    NF_LOG_VERBOSE
} nf_log_level_t;

// Configuration structure
typedef struct {
    nf_log_level_t log_level;
    uint32_t system_clock_mhz;
    char device_name[32];
} nf_config_t;

// Function declarations
void nf_init(nf_config_t *config);
void nf_log(nf_log_level_t level, const char *tag, const char *format, ...);
void nf_delay_ms(uint32_t ms);
uint32_t nf_get_uptime_ms(void);
void nf_reset_device(void);

// GPIO Functions
typedef enum {
    NF_GPIO_MODE_INPUT = 0,
    NF_GPIO_MODE_OUTPUT,
    NF_GPIO_MODE_INPUT_PULLUP,
    NF_GPIO_MODE_INPUT_PULLDOWN
} nf_gpio_mode_t;

void nf_gpio_set_mode(uint8_t pin, nf_gpio_mode_t mode);
void nf_gpio_write(uint8_t pin, bool value);
bool nf_gpio_read(uint8_t pin);

// UART Functions
typedef struct {
    uint32_t baudrate;
    uint8_t data_bits;
    uint8_t stop_bits;
    uint8_t parity;
} nf_uart_config_t;

bool nf_uart_init(uint8_t uart_num, nf_uart_config_t *config);
int nf_uart_write(uint8_t uart_num, const uint8_t *data, size_t len);
int nf_uart_read(uint8_t uart_num, uint8_t *data, size_t len);
bool nf_uart_available(uint8_t uart_num);

// WiFi Functions (for ESP32 and RPi with WiFi)
typedef struct {
    char ssid[32];
    char password[64];
    uint8_t channel;
    bool auto_reconnect;
} nf_wifi_config_t;

bool nf_wifi_init(nf_wifi_config_t *config);
bool nf_wifi_connect(void);
bool nf_wifi_disconnect(void);
bool nf_wifi_is_connected(void);
void nf_wifi_get_ip(char *ip_str, size_t len);

// Sensor helpers
typedef struct {
    float temperature;
    float humidity;
    float pressure;
    uint32_t timestamp;
} nf_sensor_data_t;

// Utility macros
#define NF_MIN(a, b) ((a) < (b) ? (a) : (b))
#define NF_MAX(a, b) ((a) > (b) ? (a) : (b))
#define NF_CLAMP(x, min, max) (NF_MIN(NF_MAX(x, min), max))
#define NF_ARRAY_SIZE(arr) (sizeof(arr) / sizeof((arr)[0]))

// Version info
#define NEXUSFORGE_VERSION_MAJOR 1
#define NEXUSFORGE_VERSION_MINOR 0
#define NEXUSFORGE_VERSION_PATCH 0

const char* nf_get_version(void);
const char* nf_get_platform(void);

#endif // NEXUSFORGE_COMMON_H

/**
 * ESP32 LED Blink Example
 *
 * This example demonstrates basic GPIO control on ESP32
 * using the ESP-IDF framework.
 */

#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "esp_log.h"

#define BLINK_GPIO CONFIG_BLINK_GPIO
#define BLINK_PERIOD_MS 1000

static const char *TAG = "blink";

void app_main(void)
{
    ESP_LOGI(TAG, "NexusForge ESP32 Blink Example");

    // Configure GPIO
    gpio_reset_pin(BLINK_GPIO);
    gpio_set_direction(BLINK_GPIO, GPIO_MODE_OUTPUT);

    uint8_t led_state = 0;

    while (1) {
        ESP_LOGI(TAG, "LED %s", led_state ? "ON" : "OFF");
        gpio_set_level(BLINK_GPIO, led_state);
        led_state = !led_state;
        vTaskDelay(BLINK_PERIOD_MS / portTICK_PERIOD_MS);
    }
}

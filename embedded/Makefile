# NexusForge Embedded Development Makefile

.PHONY: help build clean docker-build docker-up docker-down shell examples test

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m

## help: Display this help message
help:
	@echo "$(BLUE)╔═══════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║        NexusForge Embedded Development Environment           ║$(NC)"
	@echo "$(BLUE)╚═══════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(GREEN)Available commands:$(NC)"
	@echo ""
	@grep -E '^## ' $(MAKEFILE_LIST) | sed 's/## /  $(YELLOW)/' | sed 's/:/ $(NC)-/'
	@echo ""

## docker-build: Build the Docker development environment
docker-build:
	@echo "$(GREEN)Building Docker image...$(NC)"
	docker-compose build

## docker-up: Start the Docker development environment
docker-up:
	@echo "$(GREEN)Starting Docker containers...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Environment is ready!$(NC)"
	@echo "$(YELLOW)Run 'make shell' to enter the container$(NC)"

## docker-down: Stop the Docker development environment
docker-down:
	@echo "$(YELLOW)Stopping Docker containers...$(NC)"
	docker-compose down

## shell: Enter the Docker development shell
shell:
	@echo "$(GREEN)Entering development shell...$(NC)"
	docker-compose exec embedded-dev /bin/bash

## build: Interactive build tool
build:
	@docker-compose exec embedded-dev nexusforge-build

## flash: Flash firmware to device
flash:
	@docker-compose exec embedded-dev /workspace/tools/flash-tool.sh

## monitor: Open serial monitor
monitor:
	@docker-compose exec embedded-dev /workspace/tools/monitor.sh

## examples: List available examples
examples:
	@echo "$(GREEN)Available example projects:$(NC)"
	@ls -1 examples/

## clean: Clean build artifacts
clean:
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	rm -rf build/*
	rm -rf projects/*/build
	@echo "$(GREEN)✓ Clean complete$(NC)"

## test: Run tests
test:
	@echo "$(GREEN)Running tests...$(NC)"
	@echo "$(YELLOW)Test suite not yet implemented$(NC)"

## setup: Initial setup and configuration
setup: docker-build
	@echo "$(GREEN)Running initial setup...$(NC)"
	@mkdir -p projects libraries build examples
	@cp .env.example .env
	@echo "$(GREEN)✓ Setup complete!$(NC)"
	@echo "$(YELLOW)Edit .env file with your configuration$(NC)"
	@echo "$(YELLOW)Then run: make docker-up$(NC)"

## install-tools: Install additional tools and libraries
install-tools:
	@echo "$(GREEN)Installing additional tools...$(NC)"
	docker-compose exec embedded-dev bash -c "pip3 install esptool adafruit-ampy pyserial"
	@echo "$(GREEN)✓ Tools installed$(NC)"

## update: Update toolchains and dependencies
update:
	@echo "$(GREEN)Updating toolchains...$(NC)"
	docker-compose exec embedded-dev bash -c "pio upgrade && arduino-cli core update-index"
	@echo "$(GREEN)✓ Update complete$(NC)"

## status: Show environment status
status:
	@echo "$(BLUE)═══════════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)NexusForge Embedded Environment Status$(NC)"
	@echo "$(BLUE)═══════════════════════════════════════════════════════════════$(NC)"
	@docker-compose ps
	@echo ""
	@echo "$(GREEN)Connected devices:$(NC)"
	@ls /dev/tty{USB,ACM}* 2>/dev/null || echo "  No devices connected"
	@echo ""

## logs: View container logs
logs:
	docker-compose logs -f embedded-dev

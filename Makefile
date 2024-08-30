# Docker commands
all: start
.PHONY: start clean prune

start:
	docker compose -f ./docker-compose.yml up -d --build

clean:
	docker compose -f ./docker-compose.yml down

prune:
	yes | docker system prune --all

# Additional helper targets
bash:
	@echo "Usage: make bash CONTAINER=<container_name_or_id>"
	@docker exec -it $(CONTAINER) /bin/bash
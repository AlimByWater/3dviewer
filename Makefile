.PHONY: build run clean update

NAME=3dviewer
BUILD=docker build --build-arg ENV_FILE=.env.production -t $(NAME) .
RUN=docker run -d -p 3338:3000 --name $(NAME) --log-opt max-size=10m --restart=always $(ARGS) $(NAME)
RM=docker rm -f $(NAME)
RMI=docker rmi $(NAME)
PRUNE=docker image prune -f

NAME=3dviewer-dev
BUILD_DEV=docker build --build-arg ENV_FILE=.env.development -t $(NAME) .
RUN-DEV=docker run -d -p 3339:3000 --name $(NAME) --log-opt max-size=10m --restart=always $(ARGS) $(NAME)

build:
	$(BUILD)
	$(PRUNE)

run:
	$(RUN)

clean:
	$(RM)
	$(RMI)

update:
	$(BUILD)
	$(RM)
	$(RUN)
	$(PRUNE)

update-dev:
	$(BUILD_DEV)
	$(RM)
	$(RUN-DEV)
	$(PRUNE)

.PHONY: build run clean update

NAME_PROD=3dviewer
NAME_DEV=3dviewer-dev

BUILD=docker build --build-arg ENV_FILE=.env.production -t $(NAME_PROD) .
BUILD_DEV=docker build --build-arg ENV_FILE=.env.development -t $(NAME_DEV) .

RUN=docker run -d -p 3338:3000 --name $(NAME_PROD) --log-opt max-size=10m --restart=always $(ARGS) $(NAME_PROD)
RUN-DEV=docker run -d -p 3339:3000 --name $(NAME_DEV) --log-opt max-size=10m --restart=always $(ARGS) $(NAME_DEV)

RM=docker rm -f $(NAME_PROD)
RM_DEV=docker rm -f $(NAME_DEV)

RMI=docker rmi $(NAME_PROD)
RMI_DEV=docker rmi $(NAME_DEV)

PRUNE=docker image prune -f




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
	$(RM_DEV)
	$(RUN-DEV)
	$(PRUNE)

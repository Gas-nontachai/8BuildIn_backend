ARG  repository=imbios/bun-node:latest

FROM imbios/bun-node:latest

WORKDIR /usr/src/app


# FROM ${repository}
WORKDIR /usr/src/app
ENV NODE_ENV=staging


COPY . .

RUN bun install
RUN bun install -g @nestjs/cli
RUN bun run build

CMD ["bun","run", "start:prod"]

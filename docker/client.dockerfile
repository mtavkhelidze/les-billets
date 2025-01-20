FROM oven/bun:1.1-slim AS base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /tmp/_build
COPY ./packages/client/package.json bun.lockb /tmp/_build/
RUN cd /tmp/_build/
RUN bun install --frozen-lockfile

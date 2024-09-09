FROM node:lts-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
ARG REACT_APP_BACKEND_URL
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ENV PUBLIC_URL=/app
RUN pnpm run -r build
RUN pnpm deploy --filter=@vududu/back --prod /prod/back
RUN pnpm deploy --filter=@vududu/front --prod /prod/front

FROM base AS app
COPY --from=build /prod/back/dist /prod/app/back
COPY --from=build /prod/back/node_modules /prod/app/back/node_modules
COPY --from=build /prod/front/build /prod/app/front
WORKDIR /prod/app/back
EXPOSE 8000
CMD [ "node", "app.js" ]


# FROM base AS app2
# COPY --from=build /prod/app2 /prod/app2
# WORKDIR /prod/app2
# EXPOSE 8001
# CMD [ "pnpm", "start" ]

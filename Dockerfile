# build stage
FROM node:22-alpine as build
WORKDIR /app

COPY pnpm-lock.yaml package.json ./

# install pnpm as defined in package.json
RUN npm i -g $(node -p "require('./package.json').packageManager")

COPY . ./
RUN pnpm install --frozen-lockfile

RUN pnpm build

# remove devDependencies to reduce image size
RUN pnpm prune --prod --ignore-scripts

EXPOSE 3000

CMD ["pnpm", "start"]

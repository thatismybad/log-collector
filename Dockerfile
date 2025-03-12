# Use an official Node.js runtime as the base image
FROM node:21-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Build stage
FROM base AS build

# Copy package manager files
COPY package.json pnpm-lock.yaml ./

# Use cache for dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

# Copy entire source code
COPY . .

# Generate Prisma Client
RUN pnpm prisma generate

# Build the NestJS app
RUN pnpm build

# Cleanup unnecessary files to reduce final image size
RUN rm -rf /pnpm/store /root/.cache

# Runtime stage
FROM base

WORKDIR /app

# Copy only necessary files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install only production dependencies (keep @prisma/client)
RUN pnpm install --prod --frozen-lockfile && pnpx prisma generate

# Expose the application port
EXPOSE 4000

# Run migrations and start the app
CMD ["sh", "-c", "pnpx prisma migrate deploy && node dist/main.js"]
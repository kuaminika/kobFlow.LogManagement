FROM node:22-bullseye

# Useful CLI tools inside the container (optional but handy)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Avoids permission issues when npm installs global packages as root
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

WORKDIR /workspace

# Optional: pre-install global tooling you always want available
# RUN npm install -g pnpm

# Don't COPY/npm install here — devcontainer mounts your repo live,
# so installs happen via postCreateCommand instead (see devcontainer.json)
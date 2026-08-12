# Usa uma base do Playwright mais recente (com Node mais atual)
FROM mcr.microsoft.com/playwright:v1.39.0-jammy

# Atualiza o Node.js para a versão 22
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

# Instala as ferramentas necessárias globalmente (incluindo o wrangler)
RUN npm install -g node-jq serve wrangler
# Usa uma base do Playwright mais recente (com Node mais atual)
FROM mcr.microsoft.com/playwright:v1.39.0-jammy

# Instala as ferramentas necessárias globalmente (incluindo o wrangler)
RUN npm install -g node-jq serve wrangler
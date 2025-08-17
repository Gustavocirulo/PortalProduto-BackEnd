# Azure Deployment Guide

## Quick Deploy Commands

### 1. Setup Azure Resources
```bash
# Login and set subscription
az login
az account set --subscription "your-subscription-id"

# Create resource group
az group create --name PortalProduto-RG --location "East US"

# Create PostgreSQL server
az postgres server create \
  --resource-group PortalProduto-RG \
  --name portal-produto-db-$(date +%s) \
  --location "East US" \
  --admin-user pgadmin \
  --admin-password "$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)" \
  --sku-name B_Gen5_1 \
  --storage-size 5120 \
  --version 11

# Create database
az postgres db create \
  --resource-group PortalProduto-RG \
  --server-name portal-produto-db-$(date +%s) \
  --name portal_produto

# Create App Service Plan
az appservice plan create \
  --name PortalProduto-Plan \
  --resource-group PortalProduto-RG \
  --sku F1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group PortalProduto-RG \
  --plan PortalProduto-Plan \
  --name portal-produto-api-$(date +%s) \
  --runtime "NODE|18-lts"
```

### 2. Security Configuration
```bash
# Enable HTTPS only
az webapp update \
  --resource-group PortalProduto-RG \
  --name your-app-name \
  --https-only true

# Configure firewall rules
az postgres server firewall-rule create \
  --resource-group PortalProduto-RG \
  --server your-server-name \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### 3. Environment Variables Template
```bash
az webapp config appsettings set \
  --resource-group PortalProduto-RG \
  --name your-app-name \
  --settings \
    DATABASE_URL="postgresql://user:pass@server.postgres.database.azure.com:5432/db?sslmode=require" \
    JWT_SECRET="your-generated-secret" \
    NODE_ENV="production" \
    WEBSITE_NODE_DEFAULT_VERSION="18.17.0" \
    SCM_DO_BUILD_DURING_DEPLOYMENT="true"
```

## Security Checklist

- [ ] Generated secure JWT secret
- [ ] Created strong database password
- [ ] Enabled HTTPS only
- [ ] Configured firewall rules
- [ ] Set up Application Insights
- [ ] Configured automated backups
- [ ] Reviewed and secured environment variables

## Monitoring URLs

- Application: `https://your-app-name.azurewebsites.net`
- Logs: Azure Portal > App Services > your-app > Log stream
- Metrics: Azure Portal > App Services > your-app > Metrics

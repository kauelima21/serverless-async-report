# API para gerar relatórios de modo assíncrono

Este projeto implementa uma API REST para gerar relatórios a partir de uma base de dados, utilizando arquitetura Serverless e assíncrona baseada em serviços da AWS.

## 🔧 Tecnologias Utilizadas

- AWS Lambda
- AWS SQS
- AWS S3
- Amazon API Gateway
- Amazon DynamoDB
- AWS IAM
- AWS CloudFormation (via Serverless Framework)
- Node.js 20
- Serverless Framework

## 🚀 Funcionalidades

- `POST /populate-dynamo`: Cadastra dados randômicos na tabela
- `GET /generateReport`: Cria a notificação para o SQS acionar o lambda que gera o relatório
- `proccessReport`: Lambda acionado pelo SQS e que vai gerar o relatório em `csv`
- Todos os dados são armazenados em uma tabela do DynamoDB (`LeadsTable`)

## 🔐 Segurança

- A função Lambda possui permissões mínimas via políticas do IAM (principle of least privilege).

## ⚙️ Deploy

Requisitos:
- Node.js
- AWS CLI configurado
- Serverless Framework (`npm i -g serverless`)

### Passos:

```bash
npm install
sls deploy --stage dev

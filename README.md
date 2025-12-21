# Plataforma de Gestão de Eventos

Aplicação full stack para gerenciamento de eventos, desenvolvida com foco em arquitetura limpa, escalabilidade e boas práticas de backend e frontend.

## 🚀 Visão Geral
Sistema completo que permite a criação, gerenciamento e participação em eventos, com autenticação segura, controle de acesso e integração entre frontend e backend.

Projeto desenvolvido do zero como aplicação real, simulando um ambiente de produção.

## 🛠️ Stack Utilizada

### Backend
- Laravel
- API REST
- Autenticação
- Policies & Gates
- Services (camada de negócio)
- Migrations e Seeders

### Frontend
- Next.js
- App Router
- Integração com API REST
- Componentes Client/Server

### Banco de Dados
- MySQL (ou PostgreSQL, se for o caso)

## 🧱 Arquitetura
- Separação de responsabilidades
- Camada de Services para regras de negócio
- Controllers enxutos
- Código organizado e testável

## 🔐 Funcionalidades
- Cadastro e autenticação de usuários
- Criação e gerenciamento de eventos
- Controle de acesso baseado em permissões
- Participação em eventos
- Integração frontend/backend

## 📸 Screenshots
> Em breve

## ⚙️ Como executar o projeto

### Backend
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
npm install
npm run dev
🧪 Testes
Testes automatizados estão em desenvolvimento.

🔄 CI/CD
Pipeline de CI será configurado em breve com GitHub Actions.

📌 Status do Projeto
🚧 Em desenvolvimento

👨‍💻 Autor
Jonathan Henrique
Full Stack Developer — Laravel & Next.js
LinkedIn: https://linkedin.com/in/jonathanhenrique





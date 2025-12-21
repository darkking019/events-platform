Plataforma de Gestão de Eventos

Aplicação full stack para gerenciamento de eventos, desenvolvida com foco em arquitetura limpa, escalabilidade e boas práticas de backend e frontend.

Projeto construído do zero como aplicação real, simulando um ambiente de produção e fluxos comuns do mercado.

🚀 Visão Geral

Sistema que permite a criação, gerenciamento e participação em eventos, com autenticação segura, controle de acesso e comunicação eficiente entre frontend e backend via API REST.

O projeto prioriza organização de código, separação de responsabilidades e testabilidade, servindo também como estudo prático de padrões profissionais.

🛠️ Stack Utilizada
Backend

Laravel

API REST

Autenticação (Laravel Fortify)

Policies & Gates (controle de acesso)

Camada de Services para regras de negócio

Migrações e Seeders

Frontend

Next.js (App Router)

Componentes Client & Server

Integração com API REST

Páginas protegidas por autenticação

Banco de Dados

MySQL
(pode ser adaptado para PostgreSQL)

🧱 Arquitetura

Separação clara de responsabilidades

Controllers enxutos

Regras de negócio centralizadas em Services

Uso de Policies para autorização

Código organizado, legível e preparado para testes

🔐 Funcionalidades

Cadastro e autenticação de usuários

Criação e gerenciamento de eventos

Controle de acesso baseado em permissões

Participação em eventos

Integração completa entre frontend e backend

📸 Capturas de Tela

🚧 Em breve

⚙️ Como Executar o Projeto
Backend (Laravel)
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

Frontend (Next.js)
npm install
npm run dev

🧪 Testes

Testes automatizados estão em desenvolvimento, com foco em:

Services

Regras de autorização

Fluxos críticos da aplicação

🔄 CI/CD

Pipeline de CI será configurado em breve utilizando GitHub Actions, incluindo:

Execução de testes

Validação de build

Padronização de código

📌 Status do Projeto

🚧 Em desenvolvimento ativo

👨‍💻 Autor

Jonathan Henrique
Full Stack Developer — Laravel & Next.js

🔗 LinkedIn: https://linkedin.com/in/jonathanhenrique

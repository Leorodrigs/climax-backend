# ClimaX API

Um backend robusto e escalável para o aplicativo de clima pessoal **ClimaX**.
Desenvolvido com foco em boas práticas de arquitetura, esta API fornece dados meteorológicos em tempo real, gerenciamento de cidades favoritas, sistema de alertas customizados e envio de notificações push.

## Tecnologias e Arquitetura

Este projeto foi construído aplicando conceitos de **Clean Architecture** e **Domain-Driven Design (DDD)**, garantindo baixo acoplamento e alta testabilidade.

- **Framework:** NestJS (Node.js)
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Autenticação:** JWT (JSON Web Tokens)
- **Integrações Externas:** \* [OpenWeather API](https://openweathermap.org/) (Dados climáticos)
  - Firebase Admin SDK (Notificações Push / FCM)
- **Documentação:** Swagger / Scalar

## Funcionalidades Principais

- **Autenticação e Autorização:** Registro de usuários, login seguro com hash de senhas (Bcrypt) e redefinição de senhas.
- **Clima e Previsão:** Busca de clima atual e previsão para 5 dias por coordenadas, além de pesquisa de cidades por texto.
- **Favoritos:** Gerenciamento de cidades favoritas vinculadas ao perfil do usuário.
- **Alertas Inteligentes (Cron Jobs):** Criação de limites de temperatura e condições (chuva, tempestade). Um _Scheduler_ roda em background (a cada 30 min) validando o clima atual contra os limites definidos.
- **Notificações Push:** Envio automático de alertas para os dispositivos móveis dos usuários via Firebase Cloud Messaging (FCM).

## Estrutura do Projeto

A aplicação está dividida em módulos independentes (`src/modules`), cada um possuindo suas próprias camadas de Domínio, Aplicação (Casos de Uso), Infraestrutura e Apresentação (Controllers).

    src/
     ├── modules/
     │   ├── alerts/          # Lógica de gatilhos e verificação de alertas climáticos
     │   ├── auth/            # Gestão de usuários e JWT
     │   ├── favorites/       # Cidades salvas pelo usuário
     │   ├── notifications/   # Integração com Firebase FCM
     │   └── weather/         # Comunicação com a OpenWeather API
     ├── shared/              # Filtros globais, Prisma Service, etc.
     └── main.ts              # Entry point e configuração global

## Variáveis de Ambiente (.env.example)

Para rodar o projeto, crie um arquivo `.env` na raiz baseado nesta estrutura:

    # Servidor
    PORT=3000
    FRONTEND_URL=http://localhost:5173

    # Banco de Dados (Neon / PostgreSQL)
    DATABASE_URL="postgresql://usuario:senha@host.neon.tech/nome_do_banco?sslmode=require"

    # Autenticação (JWT)
    JWT_SECRET="sua_chave_secreta_super_segura"
    JWT_EXPIRES_IN="7d"

    # API de Clima (OpenWeather)
    OPENWEATHER_API_KEY="sua_chave_api_do_openweather"
    OPENWEATHER_BASE_URL="https://api.openweathermap.org"

_Atenção: Você também precisará adicionar o arquivo `firebase-service-account.json` na pasta `src/config/` para que o envio de notificações push funcione corretamente._

## Como rodar localmente

### 1. Clone o repositório

    git clone https://github.com/Leorodrigs/climax-backend.git
    cd climax-backend

### 2. Instale as dependências

    npm install

### 3. Configure o Ambiente

Preencha o arquivo `.env` com suas credenciais e adicione o JSON do Firebase conforme instruído acima.

### 4. Execute as Migrations do Banco de Dados

    npx prisma migrate dev

### 5. Inicie a aplicação

    # Modo desenvolvimento
    npm run start:dev

A API estará rodando em `http://localhost:3000/api/v1`.

## Documentação da API (Swagger)

A documentação interativa com todos os _endpoints_, schemas e métodos de autenticação está disponível via Swagger UI (renderizado com Scalar).
Com a aplicação rodando, acesse: **`http://localhost:3000/api/docs`**

# 💸 Financial Control App

Sistema full stack para gerenciamento financeiro mensal, permitindo ao usuário controlar despesas, acompanhar saldo e tomar decisões financeiras mais inteligentes.

---

## 🚀 Sobre o projeto

Este projeto foi desenvolvido com o objetivo de aprofundar meus conhecimentos em desenvolvimento **back-end** e integração com o **front-end**, criando uma aplicação completa, funcional e com regras de negócio bem definidas.

A aplicação permite que o usuário gerencie seu dinheiro com base no salário mensal, organizando despesas fixas e variáveis, com cálculos automáticos e feedback em tempo real.

---

## 🧪 Casos de uso

- Usuário quer saber quanto pode gastar por dia
- Usuário deseja controlar gastos fixos (aluguel, contas)
- Usuário precisa acompanhar gastos variáveis (alimentação, lazer)
- Usuário quer evitar saldo negativo

---

## ✨ Funcionalidades

- 🔐 Cadastro e login com validação de dados
- 🔑 Autenticação com JWT (JSON Web Token)
- 💰 Definição de salário base
- 📊 Criação de painel financeiro mensal
- 📅 Restrição de apenas 1 painel por mês
- 📌 Controle de despesas:
  - Fixas (com status de pago/pendente)
  - Variáveis (controle progressivo de gastos)
- 📉 Atualização automática do saldo disponível
- 📈 Cálculo de saldo previsto
- 🧠 Sugestão de gasto diário inteligente
- 🗂️ Histórico de meses anteriores
- 🔔 Sistema de notificações em tempo real
- 📱 Interface responsiva (mobile, tablet e desktop)

---

## 🧠 Regras de negócio

- Não é possível criar mais de um painel por mês
- Despesas pagas não podem ser alteradas
- O saldo é atualizado dinamicamente a cada operação
- Exclusão e edição impactam diretamente o saldo
- Validação de dados no front-end e back-end
- Controle de consistência entre valores gastos e saldo restante

---

## 🛠️ Tecnologias utilizadas

### 💻 Front-end

- React.js
- Context API
- React Router DOM
- Tailwind CSS
- Hooks customizados

### ⚙️ Back-end

- Node.js
- Express.js
- Prisma ORM

### 🗄️ Banco de dados

- MongoDB

### 🔐 Autenticação

- JWT (JSON Web Token)

### ✅ Validação

- Zod

---

## 🏗️ Arquitetura

O projeto foi estruturado seguindo boas práticas de separação de responsabilidades:

- **Controllers** → regras de negócio
- **Services** → comunicação com API
- **Hooks** → lógica reutilizável no front-end
- **Context API** → gerenciamento de estado global
- **Middlewares** → autenticação e validações

---

## ⚠️ Desafios enfrentados

- Garantir consistência do saldo ao atualizar despesas
- Evitar duplicação de ações (ex: marcar como pago várias vezes)
- Sincronizar estado entre front-end e back-end
- Implementar regras de negócio sem quebrar o fluxo do usuário

---

## 📦 Como rodar o projeto

### 🔧 Pré-requisitos

- Node.js (v18+)
- npm ou yarn
- MongoDB (local ou Atlas)

---

### 📁 Clonar o repositório

```bash
git clone https://github.com/GabrielPassos-Dev/controlMonthlyExpenses.git
cd controlMonthlyExpenses

⚙️ Back-end
cd backend
npm install

Crie um arquivo .env:

DATABASE_URL="sua_string_do_mongodb"
JWT_SECRET="sua_chave_secreta"
npx prisma generate
npm run dev

Back-end rodando em:
http://localhost:3000

💻 Front-end

Abra outro terminal:

cd frontend
npm install
npm run dev

Front-end rodando em:
http://localhost:5173
```

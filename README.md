# 🚀 task-app-web — Front-end React

> **Microsserviço consumido por uma UI React profissional: Material Design M2, Storybook, TypeScript end-to-end.**

[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF)](https://vitejs.dev/)
[![Material](https://img.shields.io/badge/Material--UI-M2-0081CB)](https://mui.com/)
[![Storybook](https://img.shields.io/badge/Storybook-8-FF4785)](https://storybook.js.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 🎯 O que é

Interface de usuário para consumir o microsserviço **task-app** (backend .NET).

Construído com:

- **React 18** + **TypeScript**
- **Vite** (build tool rápido)
- **Material UI** com tema customizado para **Material Design 2** (M2)
- **Storybook** para documentar componentes visuais
- **TanStack Query** para gerenciar cache de requisições
- **Axios** para chamadas HTTP

A ideia é mostrar domínio de React em produção: arquitetura escalável, componentes reutilizáveis, integração real com API.

---

## 🏗️ Arquitetura

```
src/
├── api/                ← Cliente HTTP + funções que chamam a API
├── components/         ← Componentes visuais reutilizáveis (com Storybook)
├── pages/              ← Páginas da aplicação
├── theme/              ← Tema Material Design M2 customizado
├── types/              ← Tipos TypeScript que espelham o backend
├── stories/            ← Histórias do Storybook
├── App.tsx             ← Layout principal + rotas
└── main.tsx            ← Entry point (providers: tema, query, router)
```

### Stack justificada

| Tecnologia | Por que essa escolha |
|---|---|
| **Vite** | Padrão atual. Build 100× mais rápido que Webpack. |
| **Material UI (MUI)** | Implementa Material Design. A empresa usa M2. |
| **Storybook** | Forma profissional de documentar componentes visuais. |
| **TanStack Query** | Substitui Redux/Context pra cache HTTP. Mais simples. |
| **Axios** | Cliente HTTP. Interceptors, tratamento de erro uniforme. |
| **React Router** | Padrão de mercado pra navegação SPA. |

---

## 🚀 Como rodar

### Pré-requisitos

- **Node.js 20+** (LTS)
- **Backend rodando** — siga o README do [`task-app`](https://github.com/0xknob/task-app) e deixe a API na porta `5000`.

### Instalação

```bash
npm install
```

### Dev (com hot-reload)

```bash
npm run dev
```

Abre em `http://localhost:5173`.

### Build de produção

```bash
npm run build
```

Saída em `dist/`.

### Storybook

```bash
npm run storybook
```

Abre em `http://localhost:6006` — aqui você vê cada componente isolado, com controles pra variar props.

---

## 🧩 Componentes principais

| Componente | O que faz | Onde é usado |
|---|---|---|
| `TaskStatusChip` | Chip colorido por status (Pending/InProgress/Concluded) | Lista + detalhe |
| `TaskPriorityIcon` | Ícone por prioridade | Lista + detalhe |
| `TaskCard` | Card visual completo de uma tarefa | Lista |
| `CommentList` | Lista de comentários com avatar | Detalhe |

Todos têm história no Storybook.

---

## 🔗 Integração com o backend

A URL base da API fica em `src/api/client.ts`. Padrão: `http://localhost:5000` (ASP.NET).

```typescript
// src/api/client.ts
const API_BASE_URL = 'http://localhost:5000';
```

Quando for pra produção (Azure), troca por variável de ambiente:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL;
```

### Endpoints consumidos

| Método | Rota | Função |
|---|---|---|
| GET | `/api/tasks` | `getTasks()` |
| GET | `/api/tasks/{id}` | `getTaskById()` |
| POST | `/api/tasks` | `createTask()` |
| POST | `/api/tasks/{id}/conclude` | `concludeTask()` |
| POST | `/api/tasks/{id}/assign` | `assignTask()` |
| POST | `/api/tasks/{id}/comments` | `addComment()` |

---

## 📡 Endpoints do próprio front (rotas)

| Rota | Componente |
|---|---|
| `/` | `TaskListPage` |
| `/tasks/:id` | `TaskDetailPage` |
| `/create` | `CreateTaskPage` |

---

## 📚 Conceitos aplicados

| Conceito | Onde usar |
|---|---|
| **Hooks** (`useState`, `useEffect`) | Estados locais |
| **TanStack Query** (`useQuery`, `useMutation`) | Cache HTTP |
| **React Router** (`Routes`, `Route`, `Link`) | Navegação |
| **Material UI** (`Box`, `Container`, `AppBar`) | Layout |
| **TypeScript** (`interface`, `type`, genéricos) | Tipagem |
| **Storybook** (`Meta`, `StoryObj`) | Documentação |

---

## 🗺️ Roadmap

- [x] Setup (Vite + React + TS + MUI + Storybook)
- [x] Tema customizado Material Design M2
- [x] Integração com API (tipos + client + endpoints)
- [x] Layout principal + roteamento
- [ ] Componentes: TaskStatusChip, TaskPriorityIcon, TaskCard, CommentList
- [ ] Stories do Storybook pra cada componente
- [ ] Formulário de criação com validação
- [ ] Filtros na listagem
- [ ] Tratamento de erro visual

---

## 🤝 Contribuindo

Projeto de aprendizado. Sugestões via PR.

---

## 📄 Licença

MIT — veja [LICENSE](LICENSE) pra detalhes.

---

## 👤 Autor

**0xknob** — dev em formação fullstack (.NET + React + Azure).

> *"Um microsserviço sem front é só um endpoint. Front sem material design é só código. Os dois juntos são produto."*
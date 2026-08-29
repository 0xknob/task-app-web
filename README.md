# task-app-web — Front-end React

> Interface React para consumir o microsserviço [`task-app`](https://github.com/0xknob/task-app) (backend .NET 10 + DDD + CQRS).
>
> Construído como projeto de aprendizado de portfólio fullstack.

[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF)](https://vite.dev/)
[![Material UI](https://img.shields.io/badge/MUI--M2-0081CB)](https://mui.com/)
[![Storybook](https://img.shields.io/badge/Storybook-10-FF4785)](https://storybook.js.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154)](https://tanstack.com/query)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 |
| Linguagem | TypeScript 6 |
| Build / dev server | Vite 8 |
| UI | Material UI 9 com tema customizado **Material Design 2 (M2)** |
| HTTP client | Axios |
| Server-state | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Componentes visuais | Storybook 10 |
| Roteamento | React Router 7 |

---

## Quick start

### Pré-requisitos

- Node.js 20+ (recomendado 24)
- Backend [`task-app`](https://github.com/0xknob/task-app) rodando na porta `5000`

### Comandos

```bash
npm install
npm run dev          # dev server em http://localhost:5173
npm run build        # build de produção em dist/
npm run storybook    # Storybook em http://localhost:6006
npm run lint         # oxlint
```

---

## Estrutura

```
src/
├── api/           ← Camada HTTP: client axios + funções por endpoint
├── components/    ← Componentes visuais reutilizáveis (cada um com .stories.tsx)
├── pages/         ← Páginas roteadas
├── theme/         ← Tema Material Design M2 customizado
├── types/         ← Tipos TypeScript espelhando o backend
└── App.tsx        ← Layout + rotas
```

---

## Páginas

| Rota | O que faz |
|---|---|
| `/` | Lista de tarefas com filtros de status e prioridade. Cards clicáveis. |
| `/tasks/:id` | Detalhe de uma tarefa. Mutações de concluir e atribuir. |
| `/create` | Formulário de criação com validação Zod. |

## Componentes com Storybook

| Componente | Stories | Estado |
|---|---|---|
| `TaskStatusChip` | 4 (Pending / InProgress / Concluded / AllVariants) | ✅ Maduro |
| `TaskCard` | 6 (PendingMedium / InProgressHigh / ConcludedLow / OverdueHigh / WithComments / AllStates) | ✅ Maduro |

---

## Decisões de arquitetura (curtas)

- **TanStack Query em vez de Redux/Context** — server-state não é state global da app, é cache de rede. TanStack Query lida com refetch, retry, invalidação por chave (`['tasks', filters]`).
- **Filtros server-side** — `useQuery(['tasks', filterParams])` muda a chave quando o filtro muda, TanStack dispara refetch automático. Backend aceita `?status=&priority=`.
- **Validação Zod no client + server** — redundância proposital. Client dá feedback instantâneo; backend é a fonte da verdade.
- **Tema M2 customizado** — empresa usa M2 (não M3). Tema em `src/theme/theme.ts` define tokens (cores, typography Roboto, borderRadius 4px).
- **Storybook por componente** — não Storybook do app inteiro. Cada componente isolado, com controles pra variar props.

---

## Integração com backend

URL base configurada em `src/api/client.ts`. Em dev usa `http://localhost:5000`.
Pra produção, troca por variável `VITE_API_URL` (Azure App Service URL).

| Endpoint do back | Função no front |
|---|---|
| `GET /api/tasks?status=&priority=` | `getTasks(params)` |
| `GET /api/tasks/{id}` | `getTaskById(id)` |
| `POST /api/tasks` | `createTask(payload)` |
| `POST /api/tasks/{id}/conclude` | `concludeTask(id)` |
| `POST /api/tasks/{id}/assign` | `assignTask(id, payload)` |
| `POST /api/tasks/{id}/comments` | `addComment(id, payload)` |

---

## Como rodar Storybook pra revisar componentes isolados

```bash
npm run storybook
```

Abre em `http://localhost:6006`. Você vê cada componente com controles pra
mudar props, ver estados visuais, validar acessibilidade (addon a11y).

---

## Licença

MIT — veja [LICENSE](LICENSE).
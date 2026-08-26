// src/components/TaskCard.stories.tsx

/**
 * Stories do Storybook para o TaskCard.
 *
 * POR QUE 4+ STORIES?
 * - Cada combinação status × prioridade × vencimento merece visualização
 * - Eder/designer/PO conseguem revisar visual sem rodar a app
 * - Acessibilidade: aria-label e foco visível já configurados
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskCard } from './TaskCard';
import type { Task, TaskStatus, Priority } from '../types/task';

const meta = {
  title: 'Components/TaskCard',
  component: TaskCard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TaskCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper pra criar tarefa fake com defaults sobrescrevíveis
function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '00000000-0000-0000-0000-000000000000',
    title: 'Tarefa de exemplo',
    description: 'Descrição da tarefa usada pra demonstração no Storybook.',
    priority: 'Medium' as Priority,
    status: 'Pending' as TaskStatus,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    concludedAt: null,
    assignee: null,
    comments: [],
    ...overrides,
  };
}

export const PendingMedium: Story = {
  args: { task: makeTask({}) },
};

export const InProgressHigh: Story = {
  args: {
    task: makeTask({
      title: 'Estudar React Hook Form',
      status: 'InProgress',
      priority: 'High',
      description: 'Finalizar tutorial e implementar formulário de criação com validação Zod.',
    }),
  },
};

export const ConcludedLow: Story = {
  args: {
    task: makeTask({
      title: 'Configurar ambiente de desenvolvimento',
      status: 'Concluded',
      priority: 'Low',
      concludedAt: new Date().toISOString(),
    }),
  },
};

export const OverdueHigh: Story = {
  args: {
    task: makeTask({
      title: 'Entregar relatório mensal',
      status: 'Pending',
      priority: 'High',
      // 3 dias atrás
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    }),
  },
};

export const WithComments: Story = {
  args: {
    task: makeTask({
      title: 'Tarefa com discussão',
      comments: [
        { id: '1', authorUserId: 'aaaa', content: 'Vou começar hoje', createdAt: new Date().toISOString() },
        { id: '2', authorUserId: 'bbbb', content: 'Boa, qualquer dúvida me chama', createdAt: new Date().toISOString() },
      ],
    }),
  },
};

export const AllStates: Story = {
  args: {
    task: makeTask({ status: 'Pending', priority: 'High', title: 'Pendente • Alta' }),
  },
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 500 }}>
      <TaskCard task={makeTask({ status: 'Pending', priority: 'High', title: 'Pendente • Alta' })} />
      <TaskCard task={makeTask({ status: 'InProgress', priority: 'Medium', title: 'Em progresso • Média' })} />
      <TaskCard task={makeTask({ status: 'Concluded', priority: 'Low', title: 'Concluída • Baixa', concludedAt: new Date().toISOString() })} />
      <TaskCard task={makeTask({
        status: 'Pending',
        priority: 'High',
        title: 'Atrasada • Alta',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      })} />
    </div>
  ),
};
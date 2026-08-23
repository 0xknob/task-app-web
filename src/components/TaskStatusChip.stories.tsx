// src/components/TaskStatusChip.stories.tsx

/**
 * Stories do Storybook para o TaskStatusChip.
 *
 * POR QUE EXISTE?
 * - Storybook é "documentação viva" do componente
 * - Permite ver cada estado visual sem rodar a app
 * - Útil pro designer/PO revisar visual sem ambiente
 *
 * CONVENÇÃO:
 * - Meta: args padrão + quais controles o Storybook expõe
 * - Story: variações concretas (cada status, cada variant)
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskStatusChip } from './TaskStatusChip';
import type { TaskStatus } from '../types/task';

const meta = {
  title: 'Components/TaskStatusChip',
  component: TaskStatusChip,
  parameters: { layout: 'centered' },
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['Pending', 'InProgress', 'Concluded'] satisfies TaskStatus[],
    },
    variant: { control: { type: 'radio' }, options: ['filled', 'outlined'] },
    size: { control: { type: 'radio' }, options: ['small', 'medium'] },
  },
  args: { status: 'Pending', variant: 'filled', size: 'small' },
} satisfies Meta<typeof TaskStatusChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = { args: { status: 'Pending' } };
export const InProgress: Story = { args: { status: 'InProgress' } };
export const Concluded: Story = { args: { status: 'Concluded' } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <TaskStatusChip status="Pending" />
      <TaskStatusChip status="InProgress" />
      <TaskStatusChip status="Concluded" />
    </div>
  ),
};

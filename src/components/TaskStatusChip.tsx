// Single source of truth for task-status color/label mapping.
// Change colors here and every list/detail/filters updates.

import { Chip } from '@mui/material';
import type { TaskStatus } from '../types/task';

type Variant = 'filled' | 'outlined';

interface TaskStatusChipProps {
  status: TaskStatus;
  variant?: Variant;
  size?: 'small' | 'medium';
}

const STATUS_LABEL: Record<TaskStatus, string> = {
  Pending: 'Pendente',
  InProgress: 'Em progresso',
  Concluded: 'Concluída',
};

const STATUS_COLOR: Record<TaskStatus, 'warning' | 'info' | 'success'> = {
  Pending: 'warning',
  InProgress: 'info',
  Concluded: 'success',
};

export function TaskStatusChip({
  status,
  variant = 'filled',
  size = 'small',
}: TaskStatusChipProps) {
  return (
    <Chip
      label={STATUS_LABEL[status]}
      color={STATUS_COLOR[status]}
      variant={variant}
      size={size}
    />
  );
}

// src/components/TaskStatusChip.tsx

/**
 * Chip colorido que representa o status de uma tarefa.
 *
 * POR QUE EXISTE?
 * - Status aparece em vários lugares (lista, detalhe, filtros)
 * - Sem este componente, cada lugar escreveria a lógica de cor
 * - Centralizar = mudar a cor em UM lugar
 *
 * DECISÃO DE DESIGN:
 * - Pending → warning (laranja): "precisa atenção"
 * - InProgress → info (azul claro): "em andamento, sem urgência"
 * - Concluded → success (verde): "feito, fechado"
 *
 * Se você discorda, mexe aqui. É o único lugar.
 */

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

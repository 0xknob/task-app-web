// src/components/TaskCard.tsx

/**
 * Card visual completo de uma tarefa.
 *
 * POR QUE EXISTE?
 * - ListItem do MUI é genérico demais pra mostrar tudo de uma tarefa
 * - Card é a forma padrão do Material Design pra conteúdo agrupado
 * - Reutilizável: lista, dashboard, busca, etc.
 *
 * DECISÕES DE DESIGN:
 * - PrioridadeAlta → borda esquerda vermelha (sinal visual forte)
 * - PrioridadeMédia → borda esquerda azul
 * - PrioridadeBaixa → borda esquerda cinza
 * - Tarefa atrasada → badge vermelho no canto
 * - Clickable: prop opcional pra navegação
 */

import { Box, Card, CardContent, Typography, Stack, Chip, CardActionArea } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { TaskStatusChip } from './TaskStatusChip';
import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const PRIORITY_BORDER_COLOR: Record<string, string> = {
  Low: '#bdbdbd',     // cinza
  Medium: '#0288d1',  // azul info
  High: '#d32f2f',    // vermelho error
};

const PRIORITY_LABEL: Record<string, string> = {
  Low: 'Baixa',
  Medium: 'Média',
  High: 'Alta',
};

/** "Vence em 3 dias" / "Vence hoje" / "Vencida há 2 dias" */
function formatDueDate(isoDate: string): { label: string; overdue: boolean } {
  const due = new Date(isoDate);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { label: 'Vence hoje', overdue: false };
  if (diffDays === 1) return { label: 'Vence amanhã', overdue: false };
  if (diffDays > 1) return { label: `Vence em ${diffDays} dias`, overdue: false };
  if (diffDays === -1) return { label: 'Venceu ontem', overdue: true };
  return { label: `Venceu há ${Math.abs(diffDays)} dias`, overdue: true };
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const due = formatDueDate(task.dueDate);
  const borderColor = PRIORITY_BORDER_COLOR[task.priority];
  const isConcluded = task.status === 'Concluded';

  const cardInner = (
    <Card
      sx={{
        borderLeft: 4,
        borderLeftColor: borderColor,
        opacity: isConcluded ? 0.7 : 1,
        transition: 'opacity 0.2s, transform 0.2s',
        '&:hover': onClick ? { transform: 'translateY(-2px)' } : {},
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, gap: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              textDecoration: isConcluded ? 'line-through' : 'none',
              flex: 1,
            }}
          >
            {task.title}
          </Typography>
          <TaskStatusChip status={task.status} />
        </Box>

        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {task.description.length > 120
              ? `${task.description.slice(0, 120)}...`
              : task.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label={`Prioridade ${PRIORITY_LABEL[task.priority]}`}
            size="small"
            variant="outlined"
          />
          <Chip
            label={due.label}
            size="small"
            variant="outlined"
            color={due.overdue ? 'error' : 'default'}
            icon={due.overdue ? <WarningAmberIcon /> : undefined}
          />
          {task.comments.length > 0 && (
            <Chip
              label={`${task.comments.length} comentário${task.comments.length > 1 ? 's' : ''}`}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );

  if (onClick) {
    return (
      <CardActionArea onClick={onClick} sx={{ borderRadius: 1 }}>
        {cardInner}
      </CardActionArea>
    );
  }

  return cardInner;
}
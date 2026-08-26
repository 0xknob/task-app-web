// Visual card for a task. Bordered on the left by priority,
// faded/strikethrough when concluded, warning icon when overdue.

import { Box, Card, CardContent, Typography, Stack, Chip, CardActionArea } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { TaskStatusChip } from './TaskStatusChip';
import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const PRIORITY_BORDER_COLOR: Record<string, string> = {
  Low: '#bdbdbd',
  Medium: '#0288d1',
  High: '#d32f2f',
};

const PRIORITY_LABEL: Record<string, string> = {
  Low: 'Baixa',
  Medium: 'Média',
  High: 'Alta',
};

// Returns a human label like "Vence em 3 dias" and whether the date is overdue.
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
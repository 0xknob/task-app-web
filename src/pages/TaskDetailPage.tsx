// src/pages/TaskDetailPage.tsx

/**
 * Página de detalhe de uma tarefa.
 *
 * ARQUITETURA:
 * - useParams do react-router captura o {id} da URL
 * - useQuery com queryKey ['task', id] chama getTaskById(id)
 * - Render condicional: loading / erro / não encontrada / sucesso
 *
 * POR QUE queryKey COM ID?
 * - O TanStack Query cacheia por chave. ['task', id] é diferente de ['task', outroId]
 * - Quando você volta pra lista e clica em outro item, é outra query, outro cache
 *
 * MELHORIAS:
 * - Data de vencimento com lógica inteligente (vence em / vencida há)
 * - Lista de comentários com avatar de iniciais + data relativa
 * - Mutação de concluir tarefa (altera status no backend, invalida cache)
 * - Mutação de atribuir a si mesmo (pra demonstrar fluxo de assign)
 * - Skeleton loading mais profissional que CircularProgress
 */

import { useParams, Link as RouterLink } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Skeleton,
  Alert,
  Paper,
  Stack,
  Chip,
  Divider,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Breadcrumbs,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

import { assignTask, concludeTask, getTaskById } from '../api/tasks';
import { TaskStatusChip } from '../components/TaskStatusChip';

const PRIORITY_COLOR: Record<string, 'default' | 'info' | 'warning' | 'error'> = {
  Low: 'default',
  Medium: 'info',
  High: 'error',
};

// ============================================================
// HELPERS DE FORMATAÇÃO (puros, fáceis de testar)
// ============================================================

/** "Vence em 3 dias" / "Vence hoje" / "Vencida há 2 dias" */
function formatDueDate(isoDate: string): { label: string; overdue: boolean } {
  const due = new Date(isoDate);
  const today = new Date();
  // Zera horas pra comparar só o dia
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { label: 'Vence hoje', overdue: false };
  if (diffDays === 1) return { label: 'Vence amanhã', overdue: false };
  if (diffDays > 1) return { label: `Vence em ${diffDays} dias`, overdue: false };
  if (diffDays === -1) return { label: 'Venceu ontem', overdue: true };
  return { label: `Venceu há ${Math.abs(diffDays)} dias`, overdue: true };
}

/** "há 5 minutos" / "há 2 horas" / "há 3 dias" */
function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMin < 1) return 'agora';
  if (diffMin < 60) return `há ${diffMin} min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays < 7) return `há ${diffDays} dias`;
  return date.toLocaleDateString('pt-BR');
}

/** Iniciais do userId pra usar no avatar (já que não temos nome) */
function initials(userId: string): string {
  return userId.slice(0, 2).toUpperCase();
}

// ============================================================
// COMPONENTE
// ============================================================

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: task, isPending, isError, error } = useQuery({
    queryKey: ['task', id],
    queryFn: () => getTaskById(id!),
    enabled: !!id,
  });

  // Mutação pra concluir: muda status no backend e invalida o cache desta task
  // e da lista, pra ela voltar pra lista atualizada.
  const concludeMutation = useMutation({
    mutationFn: () => concludeTask(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Mutação pra atribuir a si mesmo: usa um GUID fixo só pra demonstrar o
  // fluxo. Em produção viria do usuário logado.
  const assignMutation = useMutation({
    mutationFn: () =>
      assignTask(id!, { assigneeUserId: '00000000-0000-0000-0000-000000000001' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
    },
  });

  // ---- ESTADOS DE LOADING / ERRO / VAZIO ----

  if (isPending) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={32} width={120} sx={{ mb: 2 }} />
        <Paper sx={{ p: 3 }}>
          <Skeleton variant="text" height={48} width="60%" />
          <Skeleton variant="rectangular" height={32} width={120} sx={{ my: 2 }} />
          <Skeleton variant="text" height={120} />
        </Paper>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          Falha ao carregar tarefa: {(error as Error).message}
        </Alert>
        <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />}>
          Voltar pra lista
        </Button>
      </Box>
    );
  }

  if (!task) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Tarefa não encontrada.
        </Alert>
        <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />}>
          Voltar pra lista
        </Button>
      </Box>
    );
  }

  // ---- SUCESSO ----

  const due = formatDueDate(task.dueDate);
  const canConclude = task.status !== 'Concluded';
  const isAssigned = task.assignee !== null;

  return (
    <Box>
      <Button
        component={RouterLink}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Voltar pra lista
      </Button>

      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <RouterLink to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          Lista
        </RouterLink>
        <Typography color="text.primary">{task.title}</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 2 }}>
          <Typography variant="h4" component="h1">
            {task.title}
          </Typography>
          <TaskStatusChip status={task.status} />
        </Box>

        {/* Meta chips */}
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label={`Prioridade: ${task.priority}`}
            color={PRIORITY_COLOR[task.priority]}
            size="small"
          />
          <Chip
            icon={<CalendarTodayIcon />}
            label={due.label}
            size="small"
            variant="outlined"
            color={due.overdue ? 'error' : 'default'}
          />
          {isAssigned && task.assignee && (
            <Chip
              icon={<PersonIcon />}
              label={`Atribuída: ${task.assignee.userId.slice(0, 8)}...`}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>

        {/* Ações */}
        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleOutlineIcon />}
            disabled={!canConclude || concludeMutation.isPending}
            onClick={() => concludeMutation.mutate()}
          >
            {concludeMutation.isPending ? 'Concluindo...' : 'Concluir'}
          </Button>
          {!isAssigned && (
            <Button
              variant="outlined"
              startIcon={<AssignmentIndIcon />}
              disabled={assignMutation.isPending}
              onClick={() => assignMutation.mutate()}
            >
              {assignMutation.isPending ? 'Atribuindo...' : 'Atribuir a mim'}
            </Button>
          )}
        </Stack>

        {(concludeMutation.isError || assignMutation.isError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Falha na ação:{' '}
            {((concludeMutation.error || assignMutation.error) as Error)?.message}
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Descrição */}
        <Typography variant="h6" gutterBottom>
          Descrição
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap' }}>
          {task.description || (
            <em style={{ color: '#888' }}>(sem descrição)</em>
          )}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Comentários */}
        <Typography variant="h6" gutterBottom>
          Comentários ({task.comments.length})
        </Typography>

        {task.comments.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            Nenhum comentário ainda.
          </Typography>
        ) : (
          <List>
            {task.comments.map((c) => (
              <ListItem key={c.id} alignItems="flex-start" disableGutters>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {initials(c.authorUserId)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={c.content}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        {initials(c.authorUserId)} • {formatRelativeTime(c.createdAt)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
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
 * SUA TAREFA:
 * - Implementar a formatação de dueDate (linha marcada com TODO)
 * - Implementar a renderização de comments quando vazio vs com itens (TODO)
 * - O resto tá pronto: loading, erro, "não encontrada", layout dos campos
 */

import { useParams, Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  Chip,
  Divider,
  Button,
} from '@mui/material';
// Imports pra renderizar a lista de comentários (TODO):
// Você vai precisar adicionar aqui:
//   Avatar, List, ListItem, ListItemAvatar, ListItemText
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';

import { getTaskById } from '../api/tasks';
import { TaskStatusChip } from '../components/TaskStatusChip';

// Mapeia prioridade pra cor do Chip (consistente com TaskStatusChip)
const PRIORITY_COLOR: Record<string, 'default' | 'info' | 'warning' | 'error'> = {
  Low: 'default',
  Medium: 'info',
  High: 'error',
};

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: task, isPending, isError, error } = useQuery({
    queryKey: ['task', id],
    queryFn: () => getTaskById(id!),
    enabled: !!id, // só dispara se tiver id
  });

  if (isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
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

      <Paper sx={{ p: 3 }}>
        {/* Header: título + status chip */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h4" component="h1">
            {task.title}
          </Typography>
          <TaskStatusChip status={task.status} />
        </Box>

        {/* Meta: prioridade + vencimento */}
        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <Chip
            label={`Prioridade: ${task.priority}`}
            color={PRIORITY_COLOR[task.priority]}
            size="small"
          />
          <Chip
            icon={<CalendarTodayIcon />}
            // TODO: formate a data de vencimento como preferir.
            // Sugestões (escolha UMA):
            //   a) new Date(task.dueDate).toLocaleDateString('pt-BR')
            //   b) "Vence em X dias" (calculando diferença)
            //   c) "Vencida há X dias" se passou
            // Hoje tá só o ISO cru pra você ver o que vem da API.
            label={`Vence: ${task.dueDate}`}
            size="small"
            variant="outlined"
          />
          {task.assignee && (
            <Chip
              icon={<PersonIcon />}
              label={`Atribuída: ${task.assignee.userId.slice(0, 8)}...`}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Descrição */}
        <Typography variant="h6" gutterBottom>
          Descrição
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap' }}>
          {task.description || <em>(sem descrição)</em>}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Comentários */}
        <Typography variant="h6" gutterBottom>
          Comentários ({task.comments.length})
        </Typography>

        {/*
          TODO: renderize a lista de comentários condicionalmente.
          - Se task.comments.length === 0: mostre um Typography dizendo "Nenhum comentário ainda."
          - Senão: use <List> com <ListItem> pra cada comentário mostrando
            autor (avatar com iniciais) + conteúdo + data formatada
          - Os campos disponíveis por comment são:
              comment.id, comment.authorUserId, comment.content, comment.createdAt
        */}
        <Typography variant="body2" color="text.secondary">
          [Implementação da lista de comentários aqui]
        </Typography>
      </Paper>
    </Box>
  );
}
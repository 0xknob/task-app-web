// src/pages/TaskListPage.tsx

/**
 * Página principal: lista de tarefas vindas da API.
 *
 * COMO FUNCIONA:
 * 1. useQuery do TanStack Query chama getTasks()
 * 2. Mostra "Carregando..." enquanto pending
 * 3. Mostra erro se a request falhou
 * 4. Renderiza a lista quando os dados chegam
 *
 * DECISÃO:
 * - TanStack Query cuida de cache, retry, refetch
 * - Não usamos useState/useEffect manual pra chamada HTTP
 *   (esse era o jeito antigo, dá problema com cache)
 */

import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../api/tasks';
import { TaskStatusChip } from '../components/TaskStatusChip';

export function TaskListPage() {
  const navigate = useNavigate();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks(),
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
      <Alert severity="error">
        Falha ao carregar tarefas: {(error as Error).message}
      </Alert>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Nenhuma tarefa ainda</Typography>
          <Typography variant="body2" color="text.secondary">
            Clique no botão ➕ abaixo pra criar a primeira.
          </Typography>
        </Paper>
        <Fab
          color="primary"
          aria-label="criar nova tarefa"
          onClick={() => navigate('/create')}
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
        >
          <AddIcon />
        </Fab>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        📋 Lista de Tarefas
      </Typography>
      <Paper>
        <List>
          {data.map((task, index) => (
            <Box key={task.id}>
              {index > 0 && <Divider />}
              <ListItem
                secondaryAction={<TaskStatusChip status={task.status} />}
              >
                <ListItemText
                  primary={task.title}
                  secondary={`Prioridade: ${task.priority} • Vencimento: ${new Date(task.dueDate).toLocaleDateString('pt-BR')}`}
                />
              </ListItem>
            </Box>
          ))}
        </List>
      </Paper>

      {/* FAB: ação primária visível em qualquer estado */}
      <Fab
        color="primary"
        aria-label="criar nova tarefa"
        onClick={() => navigate('/create')}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}

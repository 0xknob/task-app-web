// Main page: lists tasks from the API with status/priority filters.
// queryKey includes filterParams so changing filters triggers a refetch.
// useMemo keeps filterParams referentially stable to avoid refetch loops.

import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Fab,
  Stack,
  Chip,
  MenuItem,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { getTasks } from '../api/tasks';
import { TaskCard } from '../components/TaskCard';
import type { TaskStatus, Priority } from '../types/task';

type StatusFilter = 'All' | TaskStatus;
type PriorityFilter = 'All' | Priority;

const STATUS_OPTIONS: StatusFilter[] = ['All', 'Pending', 'InProgress', 'Concluded'];
const PRIORITY_OPTIONS: PriorityFilter[] = ['All', 'Low', 'Medium', 'High'];

const STATUS_LABEL: Record<StatusFilter, string> = {
  All: 'Todos',
  Pending: 'Pendente',
  InProgress: 'Em progresso',
  Concluded: 'Concluída',
};

const STATUS_COLOR: Record<StatusFilter, 'default' | 'warning' | 'info' | 'success'> = {
  All: 'default',
  Pending: 'warning',
  InProgress: 'info',
  Concluded: 'success',
};

export function TaskListPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');

  // useMemo: objeto params só muda de identidade quando filtros mudam.
  // Sem isso, queryKey seria um objeto novo a cada render → refetch infinito.
  const filterParams = useMemo(
    () => ({
      status: statusFilter === 'All' ? undefined : statusFilter,
      priority: priorityFilter === 'All' ? undefined : priorityFilter,
    }),
    [statusFilter, priorityFilter],
  );

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['tasks', filterParams],
    queryFn: () => getTasks(filterParams),
  });

  const fab = (
    <Fab
      color="primary"
      aria-label="criar nova tarefa"
      onClick={() => navigate('/create')}
      sx={{ position: 'fixed', bottom: 24, right: 24 }}
    >
      <AddIcon />
    </Fab>
  );

  if (isPending) {
    return (
      <Box>
        <FilterBar
          status={statusFilter}
          priority={priorityFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
        {fab}
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        <FilterBar
          status={statusFilter}
          priority={priorityFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
        />
        <Alert severity="error">
          Falha ao carregar tarefas: {(error as Error).message}
        </Alert>
        {fab}
      </Box>
    );
  }

  if (!data || data.length === 0) {
    const hasFilters = statusFilter !== 'All' || priorityFilter !== 'All';
    return (
      <Box>
        <FilterBar
          status={statusFilter}
          priority={priorityFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
        />
        <Paper sx={{ p: 3, textAlign: 'center', mt: 2 }}>
          <Typography variant="h6">
            {hasFilters ? 'Nenhuma tarefa com esses filtros' : 'Nenhuma tarefa ainda'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hasFilters
              ? 'Tente limpar os filtros ou criar uma nova tarefa.'
              : 'Clique no botão ➕ abaixo pra criar a primeira.'}
          </Typography>
        </Paper>
        {fab}
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        📋 Lista de Tarefas
      </Typography>

      <FilterBar
        status={statusFilter}
        priority={priorityFilter}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
      />

      <Stack spacing={1.5} sx={{ mt: 2 }}>
        {data.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => navigate(`/tasks/${task.id}`)}
          />
        ))}
      </Stack>

      {fab}
    </Box>
  );
}

// ============================================================
// FilterBar (componente auxiliar inline)
// ============================================================
interface FilterBarProps {
  status: StatusFilter;
  priority: PriorityFilter;
  onStatusChange: (s: StatusFilter) => void;
  onPriorityChange: (p: PriorityFilter) => void;
}

function FilterBar({ status, priority, onStatusChange, onPriorityChange }: FilterBarProps) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Status:
        </Typography>
        {STATUS_OPTIONS.map((opt) => (
          <Chip
            key={opt}
            label={STATUS_LABEL[opt]}
            color={STATUS_COLOR[opt]}
            variant={status === opt ? 'filled' : 'outlined'}
            onClick={() => onStatusChange(opt)}
            size="small"
          />
        ))}

        <TextField
          select
          label="Prioridade"
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value as PriorityFilter)}
          size="small"
          sx={{ minWidth: 140 }}
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt === 'All' ? 'Todas' : opt}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Paper>
  );
}
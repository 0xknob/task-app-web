// src/pages/CreateTaskPage.tsx

/**
 * Página de criação de tarefa.
 *
 * ARQUITETURA:
 * - React Hook Form gerencia estado do formulário
 * - Zod valida os campos (schema = contrato)
 * - useMutation do TanStack Query chama a API
 * - onSuccess: invalida a query 'tasks' pra lista recarregar
 *
 * SUA TAREFA:
 * - O esqueleto tá pronto
 * - Falta o mais importante: as REGRAS DE VALIDAÇÃO no schema Zod
 * - Olhe o tipo CreateTaskDto em types/task.ts pra saber os campos
 * - Decida: título mínimo/máximo? descrição obrigatória? dueDate no futuro?
 *
 * DICA:
 * - z.string().min(3, 'mínimo 3 chars')
 * - z.enum(['Low', 'Medium', 'High'])
 * - z.coerce.date() pra converter string ISO em Date
 */

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Stack,
  Alert,
} from '@mui/material';
import { createTask } from '../api/tasks';

// ============================================================
// SCHEMA DE VALIDAÇÃO — VOCÊ PREENCHE AS REGRAS
// ============================================================
const createTaskSchema = z.object({
  title: z.string(), // TODO: adicione .min(3).max(200)
  description: z.string(), // TODO: adicione validação (opcional? tamanho?)
  priority: z.enum(['Low', 'Medium', 'High']),
  dueDate: z.string(), // TODO: use z.coerce.date() e valide se é no futuro
});

type CreateTaskForm = z.infer<typeof createTaskSchema>;

export function CreateTaskPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskForm>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateTaskForm) =>
      createTask({
        ...data,
        // dueDate vem como string do input; a API espera ISO completo
        dueDate: new Date(data.dueDate).toISOString(),
      }),
    onSuccess: () => {
      // Invalida o cache da lista pra forçar refetch
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // Volta pra lista
      navigate('/');
    },
  });

  const onSubmit = (data: CreateTaskForm) => {
    mutation.mutate(data);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        ➕ Criar Tarefa
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Título"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descrição"
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Prioridade"
                  error={!!errors.priority}
                  helperText={errors.priority?.message}
                  fullWidth
                >
                  <MenuItem value="Low">Baixa</MenuItem>
                  <MenuItem value="Medium">Média</MenuItem>
                  <MenuItem value="High">Alta</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Vencimento"
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={!!errors.dueDate}
                  helperText={errors.dueDate?.message}
                  fullWidth
                />
              )}
            />

            {mutation.isError && (
              <Alert severity="error">
                Falha ao criar tarefa: {(mutation.error as Error).message}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate('/')} disabled={mutation.isPending}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Criando...' : 'Criar Tarefa'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

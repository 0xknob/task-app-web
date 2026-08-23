// src/api/tasks.ts

/**
 * Funções que batem na API de tarefas.
 *
 * POR QUE CENTRALIZAR?
 * - Cada arquivo de página fica limpo (não conhece Axios)
 * - Quando a API mudar (ex: novo endpoint), muda em 1 lugar
 * - Quem usa o TanStack Query importa daqui
 */

import type { Task, CreateTaskDto, AssignTaskDto, AddCommentDto } from '../types/task';
import { apiClient } from './client';

const TASKS_ENDPOINT = '/api/tasks';

export async function getTasks(params?: {
  status?: string;
  priority?: string;
  assigneeUserId?: string;
}): Promise<Task[]> {
  const response = await apiClient.get<Task[]>(TASKS_ENDPOINT, { params });
  return response.data;
}

export async function getTaskById(id: string): Promise<Task> {
  const response = await apiClient.get<Task>(`${TASKS_ENDPOINT}/${id}`);
  return response.data;
}

export async function createTask(dto: CreateTaskDto): Promise<{ id: string }> {
  const response = await apiClient.post<{ id: string }>(TASKS_ENDPOINT, dto);
  return response.data;
}

export async function concludeTask(id: string): Promise<void> {
  await apiClient.post(`${TASKS_ENDPOINT}/${id}/conclude`);
}

export async function assignTask(id: string, dto: AssignTaskDto): Promise<void> {
  await apiClient.post(`${TASKS_ENDPOINT}/${id}/assign`, dto);
}

export async function addComment(id: string, dto: AddCommentDto): Promise<void> {
  await apiClient.post(`${TASKS_ENDPOINT}/${id}/comments`, dto);
}

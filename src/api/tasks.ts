// src/api/tasks.ts

/**
 * Funções que chamam a API do backend (.NET).
 *
 * POR QUE EXISTIR ESTA CAMADA?
 * - O apiClient (axios) só configura baseURL/headers
 * - Aqui vive o "como" cada endpoint é chamado
 * - As pages importam DAQUI, não do axios direto
 * - Se a rota mudar, mexe só aqui
 */

import { apiClient } from './client';
import type { Task, CreateTaskDto, AssignTaskDto, AddCommentDto } from '../types/task';

/** GET /api/tasks?status=&priority=&assigneeUserId= */
export async function getTasks(params?: {
  status?: string;
  priority?: string;
  assigneeUserId?: string;
}): Promise<Task[]> {
  const response = await apiClient.get<Task[]>('/api/tasks', { params });
  return response.data;
}

/** GET /api/tasks/{id} */
export async function getTaskById(id: string): Promise<Task> {
  const response = await apiClient.get<Task>(`/api/tasks/${id}`);
  return response.data;
}

/** POST /api/tasks */
export async function createTask(payload: CreateTaskDto): Promise<{ id: string }> {
  const response = await apiClient.post<{ id: string }>('/api/tasks', payload);
  return response.data;
}

/** POST /api/tasks/{id}/conclude */
export async function concludeTask(id: string): Promise<void> {
  await apiClient.post(`/api/tasks/${id}/conclude`);
}

/** POST /api/tasks/{id}/assign */
export async function assignTask(id: string, payload: AssignTaskDto): Promise<void> {
  await apiClient.post(`/api/tasks/${id}/assign`, payload);
}

/** POST /api/tasks/{id}/comments */
export async function addComment(id: string, payload: AddCommentDto): Promise<void> {
  await apiClient.post(`/api/tasks/${id}/comments`, payload);
}

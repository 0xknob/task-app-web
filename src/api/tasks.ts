// src/api/tasks.ts
//
// API layer: wraps axios calls per endpoint. Pages import from here,
// never from axios directly. Route changes only need updates in this file.

import { apiClient } from './client';
import type { Task, CreateTaskDto, AssignTaskDto, AddCommentDto } from '../types/task';

export async function getTasks(params?: {
  status?: string;
  priority?: string;
  assigneeUserId?: string;
}): Promise<Task[]> {
  const response = await apiClient.get<Task[]>('/api/tasks', { params });
  return response.data;
}

export async function getTaskById(id: string): Promise<Task> {
  const response = await apiClient.get<Task>(`/api/tasks/${id}`);
  return response.data;
}

export async function createTask(payload: CreateTaskDto): Promise<{ id: string }> {
  const response = await apiClient.post<{ id: string }>('/api/tasks', payload);
  return response.data;
}

export async function concludeTask(id: string): Promise<void> {
  await apiClient.post(`/api/tasks/${id}/conclude`);
}

export async function assignTask(id: string, payload: AssignTaskDto): Promise<void> {
  await apiClient.post(`/api/tasks/${id}/assign`, payload);
}

export async function addComment(id: string, payload: AddCommentDto): Promise<void> {
  await apiClient.post(`/api/tasks/${id}/comments`, payload);
}

// src/types/task.ts

/**
 * Tipos que espelham a API do backend (.NET).
 *
 * POR QUE REPLICAR?
 * - TypeScript precisa saber o formato exato dos dados que vêm da API
 * - Se mudar a API, mudamos só aqui (em vez de em 10 arquivos)
 * - Serve de documentação viva — quem lê o tipo sabe o shape
 */

export type Priority = 'Low' | 'Medium' | 'High';

export type TaskStatus = 'Pending' | 'InProgress' | 'Concluded';

export interface Assignee {
  userId: string;
  assignedAt: string;
}

export interface Comment {
  id: string;
  authorUserId: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  concludedAt: string | null;
  assignee: Assignee | null;
  comments: Comment[];
}

/** DTO para criar uma tarefa nova */
export interface CreateTaskDto {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}

export interface AssignTaskDto {
  assigneeUserId: string;
}

export interface AddCommentDto {
  authorUserId: string;
  content: string;
}

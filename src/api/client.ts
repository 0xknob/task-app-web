// src/api/client.ts

/**
 * Cliente HTTP (Axios) configurado.
 *
 * POR QUE EXISTE?
 * - Centraliza a URL base da API
 * - Adiciona headers padrão
 * - Facilita trocar de URL (dev/prod) em um lugar só
 *
 * COMO USAR:
 *   import { apiClient } from './client';
 *   const response = await apiClient.get('/api/tasks');
 */

import axios from 'axios';

// URL do backend .NET. Em dev, roda na porta padrão 5000 (ou configurada).
// Quando for pra produção Azure, troca por variável de ambiente.
const API_BASE_URL = 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos — evita esperar eternamente
});

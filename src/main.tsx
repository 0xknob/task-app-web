// src/main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

import { theme } from './theme/theme';
import App from './App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // tenta de novo 1x se falhar
      refetchOnWindowFocus: false, // não recarrega ao focar a janela
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Tema Material Design M2 */}
    <ThemeProvider theme={theme}>
      {/* Reset CSS + estilos globais do MUI */}
      <CssBaseline />

      {/* TanStack Query — gerencia cache de requisições */}
      <QueryClientProvider client={queryClient}>

        {/* Roteamento de páginas */}
        <BrowserRouter>
          <App />
        </BrowserRouter>

      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);

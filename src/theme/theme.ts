// src/theme/theme.ts

/**
 * Tema customizado do Material Design M2.
 *
 * POR QUE EXISTE?
 * - Material UI (MUI) é baseado em Material Design 3 por padrão
 * - A empresa usa Material Design 2 (M2)
 * - Esse tema traz a "personalidade visual" do M2: cores, tipografia, sombras
 * - Componentes ficam com a cara M2 automaticamente
 */

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Azul Material M2
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
    },
    success: {
      main: '#2e7d32', // Verde para "Concluída"
    },
    warning: {
      main: '#ed6c02', // Laranja para "Pendente"
    },
    info: {
      main: '#0288d1', // Azul claro para "Em Progresso"
    },
  },
  typography: {
    // Tipografia M2 usa Roboto, com sistema de escala padrão
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none', // M2 não força CAIXA ALTA em botões
    },
  },
  shape: {
    borderRadius: 4, // Cantos levemente arredondados (M2 usa 4px)
  },
});

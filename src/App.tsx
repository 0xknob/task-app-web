// src/App.tsx

/**
 * Componente raiz da aplicação.
 *
 * O QUE FAZ?
 * - Define o layout principal (AppBar no topo + container)
 * - Configura as rotas (URL → página)
 */

import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

import { TaskListPage } from './pages/TaskListPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { CreateTaskPage } from './pages/CreateTaskPage';

function App() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Cabeçalho fixo */}
      <AppBar position="static">
        <Toolbar>
          <CheckCircleOutlineIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Lista
          </Button>
          <Button color="inherit" component={Link} to="/create">
            Nova Tarefa
          </Button>
        </Toolbar>
      </AppBar>

      {/* Conteúdo das páginas */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<TaskListPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/create" element={<CreateTaskPage />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;

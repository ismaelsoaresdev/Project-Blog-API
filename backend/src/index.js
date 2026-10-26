import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Carrega as variáveis do ficheiro .env
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import commentsRouter from './routes/comments.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Registar as rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts/:postId/comments', commentsRouter);

// Rota de teste inicial (opcional, mas útil para verificar se a API está viva)
app.get('/', (req, res) => {
  res.json({ message: 'API do Blog a funcionar com sucesso!' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});


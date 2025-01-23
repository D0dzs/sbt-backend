import 'dotenv/config';
import express from 'express';
import cors from 'cors';

/***
 * Routers Import
 */
import userRouter from './routers/user.router.js';
import postRouter from './routers/post.router.js';

const app = express();
const PORT = process.env.API_PORT;

app.use(cors());
app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/post', postRouter);

app.get('/api/v1', (req, res) => {
  res.json('OK!');
});

app.listen(PORT, () => console.log(`>> Server is running on http://127.0.0.1:${PORT}`));

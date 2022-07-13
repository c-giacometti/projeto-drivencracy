import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pollRoutes from './Routes/pollRoutes.js';
import choiceRoutes from './Routes/choiceRoutes.js';
import voteRoutes from './Routes/voteRoutes.js';

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.use(pollRoutes);
app.use(choiceRoutes);
app.use(voteRoutes);

app.listen(process.env.PORT);
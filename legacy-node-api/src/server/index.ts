import cors from 'cors';
import express from 'express';
import 'dotenv/config';

import { router } from './routes';

const allowedURLs = process.env.ALLOWED_ORIGINS;

const server = express();

server.use(
  cors({
    origin: allowedURLs?.split(';') || [],
    optionsSuccessStatus: 200,
    exposedHeaders: ['Content-Disposition'],
  }),
);

server.use(express.json());
server.use(router);

export { server };

import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { logger } from "./middlewares/logger.js";
import cors from "cors";
import helmet from "helmet";


const app = express();

// middlewares globaux
app.use(express.json());
app.use(cors());
app.use(helmet());
// ... tes routes ici ...
app.use(notFound);
app.use(errorHandler);
app.use(logger);
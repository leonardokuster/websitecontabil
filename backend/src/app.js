import express from "express";
import routes from './routes/routes.js'; 
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());
app.use(express.json());


app.use(routes);

export default app;
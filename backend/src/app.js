import 'dotenv/config'
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import financialRoutes from "./routes/financial.routes.js";
import panelRoutes from "./routes/panel.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(financialRoutes);
app.use(panelRoutes);
app.use(userRoutes);

export default app;
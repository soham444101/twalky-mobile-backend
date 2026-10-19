import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";

const app = express();

app.use(express.json());

if (env.nodeEnv === "development") {
    // "dev" format logs method, url, status, and timing only — no headers or bodies.
    app.use(morgan("dev"));
}

app.get("/", (_req, res) => {
    res.status(200).json({

        success: true,
        message: "Twalky backend is running",
        data: {},
    });
});

export default app;

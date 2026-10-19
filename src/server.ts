import { createServer } from "node:http";
import app from "./app.js";
import { env } from "./config/env.js";

const SHUTDOWN_TIMEOUT_MS = 10_000;

export function startServer(): void {
    const server = createServer(app);

    server.on("error", (error: NodeJS.ErrnoException) => {
        if (error.code === "EADDRINUSE") {
            console.error(`Port ${env.port} is already in use.`);
        } else {
            console.error("Server failed to start:", error);
        }
        process.exit(1);
    });

    server.listen(env.port, () => {
        console.log(`Server listening on http://localhost:${env.port} (${env.nodeEnv})`);
    });

    let isShuttingDown = false;

    const shutdown = (signal: NodeJS.Signals): void => {
        if (isShuttingDown) {
            return;
        }
        isShuttingDown = true;
        console.log(`${signal} received, shutting down...`);

        const forceExit = setTimeout(() => {
            console.error("Shutdown timed out, forcing exit.");
            process.exit(1);
        }, SHUTDOWN_TIMEOUT_MS);
        forceExit.unref();

        server.close((error) => {
            if (error) {
                console.error("Error during shutdown:", error);
                process.exit(1);
            }
            process.exit(0);
        });
        server.closeIdleConnections();
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}

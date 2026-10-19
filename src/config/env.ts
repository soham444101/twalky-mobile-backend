const DEFAULT_PORT = 5000;

function readPort(): number {
    const rawPort = process.env.PORT?.trim();

    if (!rawPort) {
        return DEFAULT_PORT;
    }

    const port = Number(rawPort);

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error(`Invalid PORT "${rawPort}". Expected an integer between 1 and 65535.`);
    }

    return port;
}

export const env = {
    nodeEnv: process.env.NODE_ENV ?? "production",
    port: readPort(),
};

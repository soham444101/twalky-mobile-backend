import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import ConnectDB from "./database/index.database.js";
import { Session } from "./models/session.model.js";
import webRTCSSignalingSocket from "./controllers/socket.js";
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling']
});


app.get("/create-session", async (req, res) => {
    try {
        console.log("Create session request received");

        const sessionId = Math.random().toString(36).substr(2, 9);
        const session = new Session({
            sessionId: sessionId,
            participants: []
        });

        console.log("Creating session:", sessionId);
        await session.save();

        console.log("Session created successfully");
        res.status(200).json({
            sessionId,
            success: true
        });

    } catch (error) {
        console.error("Error in create-session:", error);
        res.status(500).json({
            error: "Failed to create session",
            message: error.message,
            success: false
        });
    }
});

app.get("/is-alive", async (req, res) => {
    try {
        const { sessionId } = req.query;

        console.log("Checking session:", sessionId);

        if (!sessionId) {
            return res.status(400).json({
                isAlive: false,
                error: "Session ID is required",
                success: false
            });
        }

        const session = await Session.findOne({ sessionId: sessionId });

        console.log("Session found:", !!session);

        res.status(200).json({
            isAlive: session ? true : false,
            success: true
        });

    } catch (error) {
        console.error("Error in is-alive:", error);
        res.status(500).json({
            isAlive: false,
            error: "Failed to check session",
            message: error.message,
            success: false
        });
    }
});

app.get("/",async(req,res)=>{
    try {
        console.log("request come");
        res.status(200).json({
            msg:"succesful  "
        })
    } catch (error){
        
    }
})

webRTCSSignalingSocket(io);

// Database Connection and Server Start
ConnectDB()
    .then(() => {
        const PORT = process.env.PORT || 5000;

        server.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(` WebSocket server ready`);
            console.log(`  Database connected`);
            console.log(` Server URL: http://localhost:${PORT}`);
        });

        server.on('error', (error) => {
            console.error("Server error:", error);
            process.exit(1);
        });

    })
    .catch((error) => {
        console.error("Failed to start server:", error);
        process.exit(1);
    });

process.on('SIGINT', async () => {
    console.log(" Shutting down gracefully...");

    // Close all socket connections
    io.close(() => {
        console.log(" Socket.IO closed");
    });

    // Close server
    server.close(() => {
        console.log("Server closed");
        process.exit(0);
    });

    // Force exit after 10 seconds
    setTimeout(() => {
        console.error(" Forced shutdown");
        process.exit(1);
    }, 10000);
});

export default app;
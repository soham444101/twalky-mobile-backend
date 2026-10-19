# 🛰️ Twalky : Meet App (Backend)

This backend powers the **Twalky Meet** application — a real-time video meeting system built with **WebRTC** and **Socket.IO**.  
It manages **session creation**, **user participation**, and **peer-to-peer signaling** between connected users.

## 🚀 Features

-  Real-time WebSocket signaling using **Socket.IO**
-  Peer-to-peer WebRTC offer/answer handling
-  ICE candidate forwarding between peers
-  Session creation, validation & participant management
-  MongoDB storage for sessions
-  Express with CORS & JSON middleware
-  Graceful shutdown handling

## 🧩 Tech Stack

| Component | Technology |
|------------|-------------|
| **Backend Framework** | Node.js + Express |
| **Real-time Engine** | Socket.IO |
| **Database** | MongoDB + Mongoose |
| **Environment Variables** | dotenv |
| **API Format** | REST + WebSockets |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/twalky-meet-backend.git
cd twalky-meet-backend
````

---

> Requires **Node.js 22 LTS** or newer.

### 2️⃣ Create `.env` file

Copy the example file and adjust values if needed:

```bash
cp .env.example .env
```

`PORT` defaults to `5000` when not set. The current foundation does not need MongoDB.

---

### 3️⃣ Install dependencies

```bash
npm install
```

---

### 4️⃣ Run the development server

```bash
npm run dev
```

> Runs `src/index.ts` with `tsx` through nodemon (`NODE_ENV=development`), restarts on `.ts`/`.json` changes in `src`, and logs requests with Morgan.
> Server will run on `http://localhost:5000` — `GET /` returns a health response.

---

### 5️⃣ Run in production

Build first, then start the compiled output:

```bash
npm run build
npm start
```



## 🌐 API Endpoints

> ⚠️ The endpoints and socket events below describe the previous implementation, kept as reference in `srcPre/`. They are **not active** in the current TypeScript foundation.

| Method   | Endpoint                   | Description                          |
| -------- | -------------------------- | ------------------------------------ |
| **GET**  | `/create-session`          | Create a new meeting session         |
| **GET**  | `/is-alive?sessionId=xxxx` | Check if a session exists            |

## 🔌 WebSocket Events

| Event                | Direction                  | Description                             |
| -------------------- | -------------------------- | --------------------------------------- |
| `prepare-session`    | Client → Server            | User is in Prepareing meet              |
| `session-info`       | Server → All               | Infromation about participant in room   |
| `join-session`       | Client → Server            | Join an existing session                |
| `send-offer`         | Client → Server → Receiver | Send WebRTC offer                       |
| `send-answer`        | Client → Server → Receiver | Send WebRTC answer                      |
| `send-ice-candidate` | Client → Server → Receiver | Send ICE candidates                     |
| `new-participant`    | Server → All               | Notify participants of a new user       |
| `participant-left`   | Server → All               | Notify participants when someone leaves |
| `hang-up`            | Client → Server            | Leave call gracefully                   |
| `disconnect`         | Client → Server            | Leave call gracefully                   |

---

## 🧠 Folder Structure

```
twalky-mobile-backend/
│
├── src/
│   ├── config/
│   │   └── env.ts             # Environment variable reading & validation
│   ├── app.ts                 # Express app (middleware, routes)
│   ├── server.ts              # HTTP server startup & graceful shutdown
│   └── index.ts               # Entry point (loads .env, starts server)
│
├── srcPre/                    # Previous implementation (reference only, not compiled)
├── dist/                      # Build output (git-ignored)
├── .env.example               # Safe environment template
├── nodemon.json               # Dev watcher config
├── tsconfig.json
└── package.json
```

Future features go under `src/modules/<feature-name>/` (routes, controllers, models, services, validation, types — created only when needed). Shared `config`, `utils`, and `middlewares` live directly under `src/`.

---

## 🧪 Example Socket Flow

1. User A joins → `join-session`
2. User B joins → `new-participant` event sent to A
3. A creates offer → sends via `send-offer`
4. B receives offer → creates answer → sends `send-answer`
5. Both exchange ICE candidates via `send-ice-candidate`
6. Connection established 

---

## 🧰 Useful Commands

| Command             | Description                                      |
| ------------------- | ------------------------------------------------ |
| `npm install`       | Install all dependencies                         |
| `npm run dev`       | Start server in development mode (auto-restart)  |
| `npm run typecheck` | Type-check without emitting files                |
| `npm run build`     | Compile TypeScript to `dist/`                    |
| `npm start`         | Run the compiled server (run `build` first)      |

---

## 🧑‍💻 Developer Notes

* Use `.js` extensions in relative TypeScript imports (e.g. `import app from "./app.js"`) — required for Node ESM (`NodeNext`).
* Never commit `.env`; only `.env.example` is tracked.
* WebRTC communication requires the frontend to exchange SDP (offer/answer) correctly.
* Keep the **Socket.IO version** consistent across frontend and backend.
---

## 📬 Contact

**👩‍💻 Author:** Soham Aswar
**📧 Email:** [sohamaswar@gmail.com](mailto:sohamaswar@gmail.com)
**🔗 LinkedIn:** [linkedin.com/in/sohamaswar](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiu_OOsjcyQAxX0YfUHHVMJO7AQFnoECBsQAQ&url=https%3A%2F%2Fin.linkedin.com%2Fin%2Fsoham-aswar-18376b22a%3Ftrk%3Dpublic_profile_browsemap&usg=AOvVaw0ivsKXXKueS298YG0EHdQv&opi=89978449)


⭐ **If you found this project useful, give it a star on GitHub!** [🔼 Back to top](#top)




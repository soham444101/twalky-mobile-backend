import type { Server, Socket } from "socket.io";
import { Session } from "../models/session.model.js";

const webRTCSSignalingSocket = (io: Server) => {
  io.on("connection", async (socket: Socket) => {
    console.log("User Connected", socket.id);

    // Track session and user for this socket
    let currentSessionId = "";
    let currentUserId = "";

    socket.on("prepare-session", async ({ sessionId, userId }) => {
      console.log(`User ${userId} is preparing to join session ${sessionId}`);

      currentSessionId = sessionId;
      currentUserId = userId;

      const session = await Session.findOne({ sessionId });

      if (session) {
        socket.join(sessionId);

        socket.emit("session-info", {
          participant: session?.participants,
        });
        console.log("Participants present in the session", session);
      } else {
        console.log(`Session not found. ID: ${sessionId}`);
        socket.emit("error", { message: "Session is not found" });
      }
    });

    socket.on("join-session", async ({ sessionId, userId, name, photo, micOn, videoOn }) => {
      try {
        currentSessionId = sessionId;
        currentUserId = userId;

        const session = await Session.findOne({ sessionId });

        if (session) {
          const index = session.participants.findIndex(p => p.userId === userId);

          if (index !== -1) {
            session.participants[index] = {
              ...session.participants[index],
              name: name || session.participants[index]?.name,
              photo: photo || session.participants[index]?.photo,
              micOn,
              videoOn,
              socketId: socket.id,
            };
          } else {
            session.participants.push({
              userId,
              name,
              photo,
              micOn,
              videoOn,
              socketId: socket.id,
            });
          }

          await session.save();
          socket.join(sessionId);

          console.log(`User ${userId} joined session ${sessionId}`);

          io.to(sessionId).emit("new-participant", {
            participant: {
              userId: userId,
              name: name,
              photo: photo,
              micOn: micOn,
              videoOn: videoOn,
            }
          });
          console.log("Participants present in the session", session);

          io.to(sessionId).emit("session-info", {
            participant: session.participants,
          });
        } else {
          console.log(`Session not found. ID: ${sessionId}`);
          socket.emit("error", { message: "Session is not found" });
        }
      } catch (error) {
        console.log("Error in join-session:", error);
      }
    });

    socket.on("current-room", async ({ sessionId }) => {
      console.log("Asking for room participants");
      const session = await Session.findOne({ sessionId });
      io.to(sessionId).emit("all-participants", session?.participants);
    });

    socket.on("send-offer", async ({ sessionId, sender, receiver, offer }) => {
      console.log(`User ${sender} is sending an offer to ${receiver} in session ${sessionId}`);
      io.to(sessionId).emit("receive-offer", { sender, receiver, offer });
    });

    socket.on("send-answer", async ({ sessionId, sender, receiver, answer }) => {
      console.log(`User ${sender} is sending an answer to ${receiver} in session ${sessionId}`);
      io.to(sessionId).emit("receive-answer", { sender, receiver, answer });
    });

    socket.on("send-ice-candidate", async ({ sessionId, sender, receiver, candidate }) => {
      console.log(`User ${sender} is sending ICE candidate to ${receiver} in session ${sessionId}`);
      io.to(sessionId).emit("receive-ice-candidate", {
        sender,
        receiver,
        candidate,
      });
    });

    socket.on("toggle-mute", async ({ sessionId, userId }) => {
      console.log(`User ${userId} is toggling mute in session ${sessionId}`);
      const session = await Session.findOne({ sessionId });
      if (!session) return;

      const participant = session.participants.find(p => p.userId === userId);
      if (participant) {
        participant.micOn = !participant.micOn;
        await session.save();

        console.log(`User ${userId} is now ${participant.micOn ? "unmuted" : "muted"}`);
        io.to(sessionId).emit("participant-update", participant);
      }
    });

    socket.on("toggle-video", async ({ sessionId, userId }) => {
      console.log(`User ${userId} is toggling video in session ${sessionId}`);
      const session = await Session.findOne({ sessionId });
      if (!session) return;

      const participant = session.participants.find(p => p.userId === userId);
      if (participant) {
        participant.videoOn = !participant.videoOn;
        await session.save();

        console.log(`User ${userId} has turned their video ${participant.videoOn ? "on" : "off"}`);
        io.to(sessionId).emit("participant-update", participant);
      }
    });

    socket.on("send-emoji", async ({ sessionId, userId, emoji }) => {
      console.log(`User ${userId} is sending emoji "${emoji}" in session ${sessionId}`);
      const session = await Session.findOne({ sessionId });
      if (!session) return;

      const participant = session.participants.find(p => p.userId === userId);
      if (participant) {
        io.to(sessionId).emit("emoji-update", {
          name: participant.name,
          emoji,
        });
        console.log(`Emoji "${emoji}" sent by user ${userId}`);
      }
    });

    socket.on("send-chat", async ({ sessionId, userId, message }) => {
      console.log(`User ${userId} is sending chat "${message}" in session ${sessionId}`);
      const session = await Session.findOne({ sessionId });
      if (!session) return;

      const participant = session.participants.find(p => p.userId === userId);
      if (participant) {
        io.to(sessionId).emit("receive-chat", {
          userId,
          name: participant.name,
          message,
        });
        console.log(`Message "${message}" sent by user ${userId}`);
      }
    });

    // Helper function to handle cleanup (used by both hang-up and disconnect)
    const cleanupParticipant = async () => {
      if (!currentSessionId || !currentUserId) {
        console.log("No session tracked for this socket, skipping cleanup");
        return;
      }

      try {
        const session = await Session.findOne({ sessionId: currentSessionId });

        if (!session) {
          console.log(`Session ${currentSessionId} not found during cleanup`);
          return;
        }

        // Find participant by socketId OR userId (for redundancy)
        const index = session.participants.findIndex(
          p => p.socketId === socket.id || p.userId === currentUserId
        );

        if (index !== -1) {
          const participant = session.participants[index];
          session.participants.splice(index, 1);
          await session.save();

          console.log(` User ${participant?.name} (${participant?.userId}) removed from session ${session.sessionId}`);

          // Notify all remaining participants
          io.to(session.sessionId).emit("session-info", {
            participant: session.participants,
          });
          io.to(session.sessionId).emit("participant-left", participant?.userId);
        } else {
          console.log(` Participant not found in session ${currentSessionId}`);
        }
      } catch (error) {
        console.error("Error during cleanup:", error);
      }
    };

    // HANG-UP EVENT
    // Triggers when: User explicitly clicks "Leave" or "Hang Up" button
    socket.on("hang-up", async () => {
      console.log(" HANG-UP triggered by user:", socket.id);
      await cleanupParticipant();
    });

    // DISCONNECT EVENT
    // Triggers when:
    // 1. Browser/tab closes
    // 2. Network connection lost
    // 3. Page refresh
    // 4. Navigation away from page
    // 5. Socket.io connection timeout
    socket.on("disconnect", async () => {
      console.log(" DISCONNECT triggered:", socket.id);
      await cleanupParticipant();
    });
  });
};

export default webRTCSSignalingSocket;
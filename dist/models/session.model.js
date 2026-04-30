import mongoose from "mongoose";
const sessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    participants: [
        {
            userId: { type: String, default: "" },
            socketId: { type: String, default: "" },
            name: { type: String, default: "" },
            photo: { type: String, default: "" },
            micOn: { type: Boolean, default: false },
            videoOn: { type: Boolean, default: false }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "1d",
    }
});
export const Session = mongoose.model("Session", sessionSchema);
//# sourceMappingURL=session.model.js.map
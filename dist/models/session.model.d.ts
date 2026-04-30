import mongoose from "mongoose";
export declare const Session: mongoose.Model<{
    sessionId: string;
    participants: mongoose.Types.DocumentArray<{
        name: string;
        userId: string;
        socketId: string;
        photo: string;
        micOn: boolean;
        videoOn: boolean;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        userId: string;
        socketId: string;
        photo: string;
        micOn: boolean;
        videoOn: boolean;
    }> & {
        name: string;
        userId: string;
        socketId: string;
        photo: string;
        micOn: boolean;
        videoOn: boolean;
    }>;
    createdAt: NativeDate;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    sessionId: string;
    participants: mongoose.Types.DocumentArray<{
        name: string;
        userId: string;
        socketId: string;
        photo: string;
        micOn: boolean;
        videoOn: boolean;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        userId: string;
        socketId: string;
        photo: string;
        micOn: boolean;
        videoOn: boolean;
    }> & {
        name: string;
        userId: string;
        socketId: string;
        photo: string;
        micOn: boolean;
        videoOn: boolean;
    }>;
    createdAt: NativeDate;
}, {}> & {
    sessionId: string;
    participants: mongoose.Types.DocumentArray<{
        name: string;
        userId: string;
        socketId: string;
        photo: string;
        micOn: boolean;
        videoOn: boolean;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        userId: string;
        socketId: string;
        photo: string;
        micOn: boolean;
        videoOn: boolean;
    }> & {
        name: string;
        userId: string;
        socketId: string;
        photo: string;
        micOn: boolean;
        videoOn: boolean;
    }>;
    createdAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    sessionId: string;
    participants: mongoose.Types.DocumentArray<{
        name: string;
        userId: string;
        socketId: string;
        photo: string;
        micOn: boolean;
        videoOn: boolean;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        userId: string;
        socketId: string;
        photo: string;
        micOn: boolean;
        videoOn: boolean;
    }> & {
        name: string;
        userId: string;
        socketId: string;
        photo: string;
        micOn: boolean;
        videoOn: boolean;
    }>;
    createdAt: NativeDate;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    sessionId: string;
    participants: mongoose.Types.DocumentArray<{
        name: string;
        userId: string;
        socketId: string;
        photo: string;
        micOn: boolean;
        videoOn: boolean;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        userId: string;
        socketId: string;
        photo: string;
        micOn: boolean;
        videoOn: boolean;
    }> & {
        name: string;
        userId: string;
        socketId: string;
        photo: string;
        micOn: boolean;
        videoOn: boolean;
    }>;
    createdAt: NativeDate;
}>, {}> & mongoose.FlatRecord<{
    sessionId: string;
    participants: mongoose.Types.DocumentArray<{
        name: string;
        userId: string;
        socketId: string;
        photo: string;
        micOn: boolean;
        videoOn: boolean;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        userId: string;
        socketId: string;
        photo: string;
        micOn: boolean;
        videoOn: boolean;
    }> & {
        name: string;
        userId: string;
        socketId: string;
        photo: string;
        micOn: boolean;
        videoOn: boolean;
    }>;
    createdAt: NativeDate;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=session.model.d.ts.map
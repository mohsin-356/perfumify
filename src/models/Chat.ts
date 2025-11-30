import mongoose, { Schema } from "mongoose";

export type MessageSender = "client" | "admin";

export interface ChatMessage {
  sender: MessageSender;
  text: string;
  createdAt: Date;
  read?: boolean;
}

const ChatMessageSchema = new Schema<ChatMessage>(
  {
    sender: { type: String, enum: ["client", "admin"], required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  },
  { _id: false }
);

const ChatSchema = new Schema(
  {
    clientId: { type: String, required: true, index: true },
    clientName: { type: String },
    clientEmail: { type: String },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    lastMessageAt: { type: Date, default: Date.now, index: true },
    messages: { type: [ChatMessageSchema], default: [] },
  },
  { timestamps: true }
);

export type ChatDocument = mongoose.InferSchemaType<typeof ChatSchema>;

const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);

export { Chat };

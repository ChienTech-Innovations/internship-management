"use client";

import { Message, SenderRole } from "@/types/chat.type";
import styles from "./MessageBubble.module.css";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === SenderRole.USER;

  return (
    <div
      className={`${styles.bubble} ${isUser ? styles.user : styles.assistant}`}
    >
      <div className={styles.avatar}>{isUser ? "👤" : "🤖"}</div>
      <div className={styles.content}>
        <p className={styles.messageText}>{message.content}</p>
        <span className={styles.time}>
          {new Date(message.createdAt).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </span>
      </div>
    </div>
  );
}

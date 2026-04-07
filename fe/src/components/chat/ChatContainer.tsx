"use client";

import { useState, useRef, useEffect } from "react";
import { Message, SenderRole } from "@/types/chat.type";
import { sendMessage } from "@/services/chat.services";
import MessageBubble from "./MessageBubble";
import styles from "./ChatContainer.module.css";

interface ChatContainerProps {
  sessionId: string;
  initialMessages?: Message[];
  embedded?: boolean;
}

export default function ChatContainer({
  sessionId,
  initialMessages = [],
  embedded = false
}: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll xuống cuối khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const content = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    // Tạo tin nhắn tạm thời cho user
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      sessionId,
      sender: SenderRole.USER,
      content,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const response = await sendMessage(sessionId, content);

      // Thay thế tin nhắn tạm và thêm phản hồi assistant
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempUserMessage.id);
        return [...filtered, response.userMessage, response.assistantMessage];
      });
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
      // Xóa tin nhắn tạm nếu lỗi
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={embedded ? styles.containerEmbedded : styles.container}>
      {!embedded && (
        <div className={styles.header}>
          <h2>💬 Trợ lý AI</h2>
          <p>Hỏi bất cứ điều gì về thực tập</p>
        </div>
      )}

      {/* Messages Area */}
      <div className={styles.messagesArea}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🤖</div>
            <h3>Xin chào!</h3>
            <p>Tôi là trợ lý AI của bạn. Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}

        {isLoading && (
          <div className={styles.typingIndicator}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className={styles.sendButton}
          >
            {isLoading ? "⏳" : "➤"}
          </button>
        </div>
      </div>
    </div>
  );
}

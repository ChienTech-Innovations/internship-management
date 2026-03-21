"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X, RefreshCw } from "lucide-react";
import ChatContainer from "@/components/chat/ChatContainer";
import { useChatSession } from "@/hooks/useChatSession";
import { useAuthStore } from "@/store/useAuthStore";
import styles from "./ChatWidget.module.css";

export default function ChatWidget() {
  const { userDetails } = useAuthStore();
  const userId = userDetails?.id;
  const [open, setOpen] = useState(false);
  const { session, isLoading, error, initializeChat, startNewChat } =
    useChatSession(userId);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!userId) return null;

  return (
    <div className={styles.root}>
      {open && (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Đóng chat"
          onClick={() => setOpen(false)}
        />
      )}

      {open && (
        <div
          id="ai-chat-panel"
          className={styles.panel}
          role="dialog"
          aria-label="Trợ lý AI"
        >
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Trợ lý AI</h2>
              <p className={styles.panelSubtitle}>Hỏi đáp về thực tập</p>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => startNewChat()}
                disabled={isLoading}
                title="Cuộc trò chuyện mới"
                aria-label="Cuộc trò chuyện mới"
              >
                <RefreshCw size={18} />
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setOpen(false)}
                title="Đóng"
                aria-label="Đóng chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className={styles.panelBody}>
            {isLoading && (
              <div className={styles.loadingBox}>
                <div className={styles.loader} />
                <span>Đang tải...</span>
              </div>
            )}
            {!isLoading && error && (
              <div className={styles.errorBox}>
                <p>{error}</p>
                <button
                  type="button"
                  className={styles.retryBtn}
                  onClick={() => initializeChat()}
                >
                  Thử lại
                </button>
              </div>
            )}
            {!isLoading && !error && session && (
              <ChatContainer
                sessionId={session.id}
                initialMessages={session.messages || []}
                embedded
              />
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        className={styles.fab}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="ai-chat-panel"
        aria-label={open ? "Đóng trợ lý AI" : "Mở trợ lý AI"}
      >
        {open ? <X size={26} strokeWidth={2.25} /> : <MessageCircle size={28} strokeWidth={2} />}
      </button>
    </div>
  );
}

"use client";

import { MessageCircle } from "lucide-react";
import styles from "./page.module.css";

export default function ChatPage() {
  return (
    <div className={styles.hintPage}>
      <div className={styles.hintCard}>
        <div className={styles.hintIcon} aria-hidden>
          <MessageCircle size={40} strokeWidth={1.75} />
        </div>
        <h1 className={styles.hintTitle}>Trợ lý AI</h1>
        <p className={styles.hintText}>
          Nhấn vào biểu tượng tròn màu xanh ở góc phải phía dưới màn hình để mở
          cửa sổ chat và hỏi đáp với AI.
        </p>
      </div>
    </div>
  );
}

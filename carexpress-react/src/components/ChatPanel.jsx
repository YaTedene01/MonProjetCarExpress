import { useEffect, useMemo, useState } from "react";
import { useResponsive } from "../hooks/useResponsive";

const S = {
  text: "#181512",
  text2: "#5f5750",
  text3: "#8f877f",
  border: "rgba(24,21,18,0.1)",
  borderStrong: "rgba(24,21,18,0.16)",
};

function formatTime(value) {
  try {
    return new Date(value).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function formatDay(value) {
  try {
    return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  } catch {
    return "";
  }
}

export default function ChatPanel({ threads, accent, currentRole, currentName, emptyTitle, emptySubtitle, listTitle, onSend, initialThreadId }) {
  const { isMobile } = useResponsive();
  const sortedThreads = useMemo(
    () => [...threads].sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)),
    [threads]
  );
  const [selectedId, setSelectedId] = useState(initialThreadId || sortedThreads[0]?.id || null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!sortedThreads.length) {
      setSelectedId(null);
      return;
    }
    if (initialThreadId && sortedThreads.find((thread) => thread.id === initialThreadId)) {
      setSelectedId(initialThreadId);
      return;
    }
    if (!selectedId || !sortedThreads.find((thread) => thread.id === selectedId)) {
      setSelectedId(sortedThreads[0].id);
    }
  }, [sortedThreads, selectedId, initialThreadId]);

  const selectedThread = sortedThreads.find((thread) => thread.id === selectedId) || null;

  const submit = () => {
    if (!selectedThread || !draft.trim()) return;
    onSend({
      threadId: selectedThread.id,
      senderRole: currentRole,
      senderName: currentName,
      text: draft,
    });
    setDraft("");
  };

  if (!sortedThreads.length) {
    return (
      <div style={{ padding: 22, borderRadius: 24, border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.82)" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: S.text }}>{emptyTitle}</div>
        <div style={{ marginTop: 8, fontSize: 14, color: S.text3, lineHeight: 1.7 }}>{emptySubtitle}</div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "320px minmax(0,1fr)", gap: 16 }}>
      <div style={{ borderRadius: 24, border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.86)", overflow: "hidden" }}>
        <div style={{ padding: "16px 18px", borderBottom: `1px solid ${S.border}`, fontSize: 15, fontWeight: 700, color: S.text }}>{listTitle}</div>
        <div style={{ display: "grid", gap: 0 }}>
          {sortedThreads.map((thread) => {
            const active = thread.id === selectedId;
            const lastMessage = thread.messages[thread.messages.length - 1];
            const otherName = currentRole === "client" ? thread.agencyName : thread.clientName;
            return (
              <button
                key={thread.id}
                type="button"
                onClick={() => setSelectedId(thread.id)}
                style={{
                  textAlign: "left",
                  padding: "14px 16px",
                  border: "none",
                  borderBottom: `1px solid ${S.border}`,
                  background: active ? `${accent}12` : "transparent",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: S.text }}>{otherName}</div>
                  <div style={{ fontSize: 11, color: S.text3 }}>{formatDay(thread.lastMessageAt)}</div>
                </div>
                <div style={{ marginTop: 4, fontSize: 12, color: S.text2 }}>{thread.subject}</div>
                <div style={{ marginTop: 6, fontSize: 12, color: S.text3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {lastMessage?.text}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ borderRadius: 24, border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.9)", overflow: "hidden", display: "grid", gridTemplateRows: "auto minmax(320px, 1fr) auto" }}>
        {selectedThread && (
          <>
            <div style={{ padding: "16px 18px", borderBottom: `1px solid ${S.border}`, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: S.text }}>{currentRole === "client" ? selectedThread.agencyName : selectedThread.clientName}</div>
                <div style={{ marginTop: 4, fontSize: 12, color: S.text3 }}>{selectedThread.subject}</div>
              </div>
              <div style={{ padding: "6px 10px", borderRadius: 999, background: `${accent}12`, color: accent, fontSize: 11, fontWeight: 700 }}>
                En ligne
              </div>
            </div>

            <div style={{ padding: 16, display: "grid", gap: 10, background: "linear-gradient(180deg, rgba(250,247,243,0.84) 0%, rgba(255,255,255,0.96) 100%)" }}>
              {selectedThread.messages.map((message) => {
                const mine = message.senderRole === currentRole;
                return (
                  <div key={message.id} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "78%",
                      padding: "10px 12px",
                      borderRadius: mine ? "16px 16px 6px 16px" : "16px 16px 16px 6px",
                      background: mine ? accent : "rgba(255,255,255,0.96)",
                      color: mine ? "#fff" : S.text,
                      border: mine ? "none" : `1px solid ${S.border}`,
                      boxShadow: "0 8px 20px rgba(24,21,18,0.05)",
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 700, opacity: mine ? 0.88 : 1 }}>{message.senderName}</div>
                      <div style={{ marginTop: 5, fontSize: 13, lineHeight: 1.6 }}>{message.text}</div>
                      <div style={{ marginTop: 6, fontSize: 10, opacity: mine ? 0.8 : 0.6, textAlign: "right" }}>{formatTime(message.sentAt)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: 16, borderTop: `1px solid ${S.border}`, background: "rgba(255,255,255,0.96)" }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1fr) auto", gap: 10 }}>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ecrivez votre message..."
                  style={{
                    minHeight: 78,
                    resize: "vertical",
                    borderRadius: 16,
                    border: `1px solid ${S.borderStrong}`,
                    padding: "12px 14px",
                    fontSize: 13,
                    color: S.text,
                    outline: "none",
                    background: "rgba(255,255,255,0.96)",
                  }}
                />
                <button
                  type="button"
                  onClick={submit}
                  style={{
                    minWidth: isMobile ? "100%" : 132,
                    minHeight: 46,
                    alignSelf: isMobile ? "stretch" : "end",
                    border: "none",
                    borderRadius: 16,
                    background: accent,
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: `0 14px 28px ${accent}33`,
                  }}
                >
                  Envoyer
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

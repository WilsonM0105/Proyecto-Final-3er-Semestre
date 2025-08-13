import { createContext, useContext, useState, useCallback, useEffect } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]); // {id, message, type}

  const showToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    // autodestruir
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

// UI del contenedor de toasts (simple y bonito)
function ToastContainer({ toasts }) {
  useEffect(() => {
    // evitar scroll-jumps si se muestran muchos
    document.body.style.scrollBehavior = "smooth";
    return () => { document.body.style.scrollBehavior = ""; };
  }, []);

  return (
    <div style={{
      position: "fixed",
      right: "16px",
      bottom: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      zIndex: 9999,
    }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          aria-live="polite"
          style={{
            minWidth: "260px",
            maxWidth: "360px",
            background: t.type === "error" ? "#fee2e2" : t.type === "info" ? "#dbeafe" : "#dcfce7",
            color: "#111827",
            border: "1px solid rgba(0,0,0,.08)",
            boxShadow: "0 8px 28px rgba(0,0,0,.08)",
            borderRadius: "12px",
            padding: "10px 12px",
          }}
        >
          <strong style={{ display: "block", marginBottom: "4px" }}>
            {t.type === "error" ? "Error" : t.type === "info" ? "Info" : "Éxito"}
          </strong>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

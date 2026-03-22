import { createPortal } from "react-dom";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export default function NotificationContainer({
  notifications,
  removeNotification,
}) {
  return createPortal(
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`pointer-events-auto animate-in fade-in slide-in-from-right-4 duration-300 min-w-[320px] p-4 rounded-xl backdrop-blur-md border shadow-lg flex items-center gap-4 ${
            notif.type === "success"
              ? "bg-slate-900/95 border-emerald-500/50"
              : "bg-slate-900/95 border-red-500/50"
          }`}
        >
          <div
            className={`p-2 rounded-lg ${
              notif.type === "success" ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {notif.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
          </div>

          <div className="flex-1">
            <p className="text-xs font-bold text-slate-400 uppercase">
              {notif.type === "success" ? "Sucesso" : "Erro"}
            </p>
            <p className="text-white text-sm">{notif.message}</p>
          </div>

          <button
            onClick={() => removeNotification(notif.id)}
            className="text-slate-500 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>,
    document.body,
  );
}

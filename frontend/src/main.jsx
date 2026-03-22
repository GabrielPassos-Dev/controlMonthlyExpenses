import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { FinancialProvider } from "./context/FinancialContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <FinancialProvider>
          <App />
        </FinancialProvider>
      </NotificationProvider>
    </BrowserRouter>
  </StrictMode>,
);

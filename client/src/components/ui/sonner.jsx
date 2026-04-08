import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        style: {
          background: "#1a1a2e",
          color: "#e0e0e0",
          border: "1px solid #2a2a3e",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          borderRadius: "12px",
          fontSize: "14px",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

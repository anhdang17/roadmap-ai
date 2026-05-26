"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <AnimatePresence>
      {open && children}
    </AnimatePresence>
  );
};

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

const DialogContent: React.FC<DialogContentProps> = ({
  className,
  children,
  onClose,
}) => {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "relative z-50 w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl shadow-black/40",
          className
        )}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-text-muted hover:text-text-primary hover:bg-elevated transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {children}
      </motion.div>
    </div>
  );
};

const DialogHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => (
  <div className={cn("mb-4", className)}>{children}</div>
);

const DialogTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => (
  <h2 className={cn("text-lg font-semibold text-text-primary", className)}>
    {children}
  </h2>
);

const DialogDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => (
  <p className={cn("mt-1 text-sm text-text-secondary", className)}>{children}</p>
);

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription };

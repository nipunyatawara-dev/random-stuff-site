"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { lockPageScroll } from "@/lib/lenis";

type ModalProps = {
  children: ReactNode;
  label: string;
  onClose: () => void;
  className: string;
};

// Native modal dialogs supply focus containment, an inert background, and
// Escape-to-close without duplicating keyboard handlers in every feature.
export default function Modal({ children, label, onClose, className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const unlock = lockPageScroll();
    dialog.showModal();
    return () => {
      dialog.close();
      unlock();
    };
  }, []);
  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={`studio-modal ${className}`}
    >
      {children}
    </dialog>
  );
}

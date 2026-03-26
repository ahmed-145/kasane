'use client';

import { useEffect, useRef, useState } from 'react';

interface ToastEvent {
  message: string;
  id: number;
}

// Singleton listeners
const listeners: Set<(e: ToastEvent) => void> = new Set();
let counter = 0;

export function showToast(message: string) {
  const event: ToastEvent = { message, id: ++counter };
  listeners.forEach(fn => fn(event));
}

export function Toast() {
  const [toast, setToast] = useState<ToastEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handler(e: ToastEvent) {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (removeTimer.current) clearTimeout(removeTimer.current);
      setToast(e);
      setVisible(true);
      hideTimer.current = setTimeout(() => setVisible(false), 1700);
      removeTimer.current = setTimeout(() => setToast(null), 2000);
    }
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (removeTimer.current) clearTimeout(removeTimer.current);
    };
  }, []);


  if (!toast) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        background: 'var(--text-primary)',
        color: 'var(--background)',
        borderRadius: '3px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 200ms ease',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {toast.message}
    </div>
  );
}

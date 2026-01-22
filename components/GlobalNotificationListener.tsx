







































































































'use client';

import { useEffect, useRef } from 'react';
import { getSocket } from '@/lib/socket';
import { playNotify } from '@/lib/sound-manager';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useRouter } from 'next/navigation';

type FacilityNotification = {
  link?: string;
  message?: string;
  moduleName?: string;
};

const ToastAtTopRight = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  showCloseButton: true,
  timer: 4500,
  timerProgressBar: true,
  background: 'transparent',
  customClass: {
    container: 'tv-toast-container', 
    popup: 'tv-toast tv-toast-coffee tv-toast--full', 
    title: 'tv-toast-title', 
    htmlContainer: 'tv-toast-body', 
    closeButton: 'tv-toast-close',
    timerProgressBar: 'tv-toast-progress'
  },
  showClass: { popup: 'tv-toast-in' },
  hideClass: { popup: 'tv-toast-out' },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

function escapeHtml(s?: string) {
  if (!s) return '';
  return s.replace(
    /[&<>"']/g,
    (m) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        m
      ]!
  );
}

function pickIcon(moduleName?: string) {
  const m = (moduleName || '').toLowerCase();
  if (m.includes('payment') || m.includes('refund') || m.includes('success'))
    return 'success';
  if (m.includes('error') || m.includes('fail') || m.includes('alert'))
    return 'error';
  if (m.includes('warning')) return 'warning';
  return 'info';
}

export default function GlobalNotificationListener() {
  const bound = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const s = getSocket();
    if (!s || bound.current) return;
    bound.current = true;
    // ⬇️ REPLACE THIS WHOLE HANDLER
    const handler = (p: FacilityNotification) => {
      const { link, message, moduleName } = p || {};
      const icon = pickIcon(moduleName);

      void playNotify();

      const safeMsg = escapeHtml(message || 'Notification');
      const mod = escapeHtml(moduleName || '');

      ToastAtTopRight.fire({
        icon: icon as any,
        // title ko clean/bold rakho (CSS me style hoga)
        title: safeMsg,
        // module ko pretty badge me dikhate hain
        html: mod
          ? `
        <div class="tv-modline">
          <span class="tv-mod-label">Module</span>
          <span class="tv-mod-badge">
            <span class="tv-mod-dot"></span>${mod}
          </span>
        </div>`
          : '',
        didOpen: (el) => {
          // clickable toast (agar link mila)
          if (link) {
            el.classList.add('tv-toast--clickable');
            el.addEventListener('click', () => (window.location.href = link));
          }
        }
      });

      // Optional: OS notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(message || 'Notification', {
          body: moduleName ? `Module: ${moduleName}` : undefined,
          icon: '/icon-192x192.png'
        });
      }
    };

    s.off('notification:services', handler);
    s.on('notification:services', handler);

    return () => {
      s.off('notification:services', handler);
      bound.current = false;
    };
  }, [router]);

  return null;
}

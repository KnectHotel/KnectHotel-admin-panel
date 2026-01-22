

































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { AlertModal } from './modal/alert-modal';
import { getSessionStorageItem } from 'utils/localstorage';
import apiCall from '@/lib/axios';


import InvoiceExactA4, { InvoiceExactProps } from 'app/(protected)/invoice';

export interface navProps {
  active?: boolean;
  className?: string;
  search?: boolean;
}

type NotificationItem = {
  _id: string;
  adminId: string;
  HotelId: string;
  title: string;
  message: string;
  moduleName?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
};

const INVOICE_ID = '68c8fba6e1c648fdbb63d281';

export default function Navbar({ active, className }: navProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 7;
  const [hasNextPage, setHasNextPage] = useState(false);

  
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const admin = getSessionStorageItem<any>('admin');

  
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [invoiceProps, setInvoiceProps] = useState<InvoiceExactProps | null>(
    null
  );

  const fmtDateTime = (iso?: string) =>
    iso ? new Date(iso).toLocaleString() : '-';

  
  const mapSubscriptionApiToInvoice = (d: any): InvoiceExactProps => {
    const items = (d.charges ?? []).map((c: any) => ({
      description: c.description,
      rate: Number(c.rate) || 0,
      qty: Number(c.duration) || 1,
      total: Number(c.total) || 0
    }));
    const fmtDateTime = (value?: string | number | Date) => {
      if (value === undefined || value === null || value === '') return '-';
      let dt: Date;
      if (value instanceof Date) dt = value;
      else if (typeof value === 'number')
        dt = new Date(value > 1e12 ? value : value * 1000);
      else {
        const parsed = new Date(value);
        if (isNaN(parsed.getTime())) return String(value);
        dt = parsed;
      }
      return dt.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    };

    return {
      acknowledgementNumber: d.acknowledgementNumber || '-',
      ackDate: fmtDateTime(d.acknowledgementDate),
      irnNo: d.irn || '-',
      invoiceNo: d.invoiceNo || 'INV',

      hotelName: d.hotelName || '-',
      hotelAddress: d.hotelAddress || '-',
      hotelPhone: d.hotelPhone || '—',
      hotelEmail: d.hotelEmail || '—',
      gstin: d.hotelGST || '—',
      pan: d.hotelPAN || '—',

      bookingThrough: d.couponCode || '-',
      mobile: d.hotelPhone || '—',
      arrival: fmtDateTime(d.subsctiptionStart),
      departure: fmtDateTime(d.subscriptionEnd),

      items,
      sgst: Number(d.sgstAmount) || 0,
      cgst: Number(d.cgstAmount) || 0,
      total: Number(d.grandTotal) || 0,
      amountWords: d.inWords || '-'
    };
  };

  const fetchInvoice = useCallback(async () => {
    const res = await apiCall(
      'GET',
      `/api/invoice/subscription/${INVOICE_ID}`,
      {}
    );
    if (!res?.success || !res?.data)
      throw new Error('Failed to fetch invoice.');
    const mapped = mapSubscriptionApiToInvoice(res.data);
    setInvoiceProps(mapped);
    return mapped;
  }, []);

  
  const fetchNotifications = useCallback(
    async (pageToFetch: number = page) => {
      try {
        setLoading(true);
        const response = await apiCall(
          'GET',
          `/api/notification?page=${pageToFetch}&limit=${PAGE_SIZE}`,
          {}
        );
        if (response?.success) {
          const items: NotificationItem[] = response.notifications ?? [];
          setNotifications(items);
          setHasNextPage(items.length === PAGE_SIZE);
        }
      } catch (error: any) {
        
        console.warn(
          'Error fetching notifications (falling back):',
          error?.message || error
        );
        setNotifications([]);
        setHasNextPage(false);
      } finally {
        setLoading(false);
      }
    },
    [PAGE_SIZE, page]
  );

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  useEffect(() => {
    if (notificationsOpen) fetchNotifications(page);
  }, [notificationsOpen, page, fetchNotifications]);

  const handleBellClick = async () => {
    try {
      await fetchNotifications(page);
    } finally {
      setNotificationsOpen(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    document.cookie = 'token=; Max-Age=0; path=/';
    window.location.href = '/';
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id: string) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      await apiCall('GET', `/api/notification/markRead/${id}`, {});
    } catch (err) {
      console.error('Failed to mark as read:', err);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: false } : n))
      );
    }
  };

  const handleNotificationClick = async (n: NotificationItem) => {
    await markAsRead(n._id);
    if (n.link) window.location.href = n.link;
  };

  const goPrev = async () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      await fetchNotifications(newPage);
    }
  };

  const goNext = async () => {
    if (hasNextPage) {
      const newPage = page + 1;
      setPage(newPage);
      await fetchNotifications(newPage);
    }
  };

  
  const handleInvoicePdf = async () => {
    try {
      const current = invoiceProps ?? (await fetchInvoice());
      await new Promise((r) => requestAnimationFrame(() => r(null)));

      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);

      const el = invoiceRef.current;
      if (!el) return;

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight
      });

      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 24;
      const usableW = pageW - margin * 2;

      const imgW = usableW;
      const imgH = (canvas.height * imgW) / canvas.width;

      let remaining = imgH;
      let shift = 0;
      while (remaining > 0) {
        pdf.addImage(
          img,
          'PNG',
          margin,
          margin - shift,
          imgW,
          imgH,
          undefined,
          'FAST'
        );
        remaining -= pageH - margin * 2;
        if (remaining > 0) {
          pdf.addPage();
          shift += pageH - margin * 2;
        }
      }

      pdf.save(
        `${current.invoiceNo || 'Invoice'}_${new Date().toISOString().slice(0, 10)}.pdf`
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {}
      <div
        aria-hidden
        className="fixed -left-[99999px] -top-[99999px] pointer-events-none select-none"
      >
        {invoiceProps && (
          <InvoiceExactA4
            ref={invoiceRef}
            {...invoiceProps}
            logoSrc="/Frame.svg"
          />
        )}
      </div>

      <AlertModal
        isOpen={open}
        onCloseAction={() => setOpen(false)}
        onConfirmAction={handleLogout}
        loading={loading}
        description="You will be logged out"
      />

      {}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end transition-transform duration-300 ease-in-out ${notificationsOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}
      >
        <div
          className="w-[400px] h-full p-6 overflow-y-auto rounded-lg"
          style={{
            backgroundImage: 'url("/sky.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => fetchNotifications(page)}
                className="btn-secondary backdrop-blur-lg hover:scale-105 transition-transform duration-200"
                disabled={loading}
                title="Refresh"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button
                onClick={() => setNotificationsOpen(false)}
                className="btn-secondary backdrop-blur-lg hover:scale-105 transition-transform duration-200"
              >
                Close
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="text-white/80 text-sm">
              Page <span className="font-semibold text-white">{page}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={goPrev}
                disabled={page === 1 || loading}
                className="btn-secondary px-2 py-1"
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={goNext}
                disabled={!hasNextPage || loading}
                className="btn-secondary px-2 py-1"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {loading && notifications.length === 0 ? (
              <p className="text-sm text-white/80">Loading...</p>
            ) : notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer backdrop-blur-sm transition-transform duration-200 hover:scale-[1.02] ${
                    n.isRead
                      ? 'bg-white/10 border-white/20 opacity-80'
                      : 'bg-white/20 border-white/40'
                  }`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <div className="relative">
                    {!n.isRead && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                    )}
                    <div className="bg-yellow-200 p-2 rounded-full">
                      <span className="text-xs text-gray-600">⚠️</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{n.title}</p>
                    <p className="text-xs text-white/90 truncate">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-white/70 mt-0.5">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/80">No notifications</p>
            )}
          </div>
        </div>
      </div>

      {}
      <nav
        className={`flex items-center w-full justify-between bg-[#EFE9DF] p-4 lg:w-[calc(100%-20%)] fixed z-[20] ${className}`}
      >
        <div />
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell
              className="w-7 h-7 text-button-dark cursor-pointer hover:text-button-light"
              onClick={handleBellClick}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full btn-primary text-white">
                    <span suppressHydrationWarning>
                      {(admin?.user?.name || 'H')[0].toUpperCase()}
                    </span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {admin?.user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {admin?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {}
              {}

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setOpen(true)}>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </>
  );
}

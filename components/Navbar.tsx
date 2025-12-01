// // // // // // 'use client';

// // // // // // import { useState, useEffect, useCallback } from 'react';
// // // // // // import { Button } from '@/components/ui/button';
// // // // // // import {
// // // // // //   Bell,
// // // // // //   Filter,
// // // // // //   ChevronLeft,
// // // // // //   ChevronRight,
// // // // // //   RotateCcw
// // // // // // } from 'lucide-react';
// // // // // // import {
// // // // // //   DropdownMenu,
// // // // // //   DropdownMenuContent,
// // // // // //   DropdownMenuItem,
// // // // // //   DropdownMenuLabel,
// // // // // //   DropdownMenuSeparator,
// // // // // //   DropdownMenuShortcut,
// // // // // //   DropdownMenuTrigger
// // // // // // } from './ui/dropdown-menu';
// // // // // // import { AlertModal } from './modal/alert-modal';
// // // // // // import { getSessionStorageItem } from 'utils/localstorage';
// // // // // // import apiCall from '@/lib/axios';
// // // // // // // import { DropdownMenu } from '@radix-ui/react-dropdown-menu';

// // // // // // export type DateRangeKey =
// // // // // //   | 'today'
// // // // // //   | 'lastWeek'
// // // // // //   | 'lastMonth'
// // // // // //   | 'lastQuarter'
// // // // // //   | 'lastYear';

// // // // // // export interface navProps {
// // // // // //   active?: boolean;
// // // // // //   search?: boolean;
// // // // // //   searchKey?: string;
// // // // // //   className?: string;
// // // // // //   onSearch?: (query: string) => void;
// // // // // //   onFilterChange?: (range: string) => void;
// // // // // //   selectedRange?: DateRangeKey;
// // // // // // }

// // // // // // type NotificationItem = {
// // // // // //   _id: string;
// // // // // //   adminId: string;
// // // // // //   HotelId: string;
// // // // // //   title: string;
// // // // // //   message: string;
// // // // // //   moduleName?: string;
// // // // // //   link?: string;
// // // // // //   isRead: boolean;
// // // // // //   createdAt: string;
// // // // // // };

// // // // // // export default function Navbar({
// // // // // //   active,
// // // // // //   className,
// // // // // //   onFilterChange,
// // // // // //   selectedRange = 'today'
// // // // // // }: navProps) {
// // // // // //   const [open, setOpen] = useState(false);
// // // // // //   const [loading, setLoading] = useState(false);

// // // // // //   const [notificationsOpen, setNotificationsOpen] = useState(false);

// // // // // //   // Pagination state
// // // // // //   const [page, setPage] = useState(1);
// // // // // //   const PAGE_SIZE = 7;
// // // // // //   const [hasNextPage, setHasNextPage] = useState(false);

// // // // // //   // Notifications state
// // // // // //   const [notifications, setNotifications] = useState<NotificationItem[]>([]);

// // // // // //   const admin = getSessionStorageItem<any>('admin');

// // // // // //   const ranges: Record<DateRangeKey, string> = {
// // // // // //     today: 'Today',
// // // // // //     lastWeek: 'Last Week',
// // // // // //     lastMonth: 'Last Month',
// // // // // //     lastQuarter: 'Last Quarter',
// // // // // //     lastYear: 'Last Year'
// // // // // //   };

// // // // // //   // ---- Fetch notifications with pagination ----
// // // // // //   const fetchNotifications = useCallback(
// // // // // //     async (pageToFetch: number = page) => {
// // // // // //       try {
// // // // // //         setLoading(true);
// // // // // //         const response = await apiCall(
// // // // // //           'GET',
// // // // // //           `/api/notification?page=${pageToFetch}&limit=${PAGE_SIZE}`,
// // // // // //           {}
// // // // // //         );

// // // // // //         // Expecting shape: { success: boolean, notifications: NotificationItem[] }
// // // // // //         if (response?.success) {
// // // // // //           const items: NotificationItem[] = response.notifications ?? [];
// // // // // //           setNotifications(items);

// // // // // //           // If we got less than PAGE_SIZE, we assume there is no next page
// // // // // //           setHasNextPage(items.length === PAGE_SIZE);
// // // // // //         }
// // // // // //       } catch (error) {
// // // // // //         console.error('Error fetching notifications:', error);
// // // // // //       } finally {
// // // // // //         setLoading(false);
// // // // // //       }
// // // // // //     },
// // // // // //     [PAGE_SIZE, page]
// // // // // //   );

// // // // // //   // Initial fetch on mount (page = 1)
// // // // // //   useEffect(() => {
// // // // // //     fetchNotifications(1);
// // // // // //   }, [fetchNotifications]);

// // // // // //   // Refresh when page changes (only while panel is open or on explicit nav)
// // // // // //   useEffect(() => {
// // // // // //     if (notificationsOpen) fetchNotifications(page);
// // // // // //   }, [notificationsOpen, page, fetchNotifications]);

// // // // // //   const handleBellClick = async () => {
// // // // // //     try {
// // // // // //       await fetchNotifications(page);
// // // // // //     } finally {
// // // // // //       setNotificationsOpen(true);
// // // // // //     }
// // // // // //   };

// // // // // //   const firstLetter = admin?.user?.name
// // // // // //     ? admin.user.name.charAt(0).toUpperCase()
// // // // // //     : 'H';

// // // // // //   const handleLogout = () => {
// // // // // //     sessionStorage.removeItem('token');
// // // // // //     document.cookie = 'token=; Max-Age=0; path=/';
// // // // // //     window.location.href = '/';
// // // // // //   };

// // // // // //   const unreadCount = notifications.filter((n) => !n.isRead).length;

// // // // // //   const markAsRead = async (id: string) => {
// // // // // //     try {
// // // // // //       // Optimistic UI: mark read locally first
// // // // // //       setNotifications((prev) =>
// // // // // //         prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
// // // // // //       );
// // // // // //       await apiCall('GET', `/api/notification/markRead/${id}`, {});
// // // // // //     } catch (err) {
// // // // // //       console.error('Failed to mark as read:', err);
// // // // // //       // rollback if needed
// // // // // //       setNotifications((prev) =>
// // // // // //         prev.map((n) => (n._id === id ? { ...n, isRead: false } : n))
// // // // // //       );
// // // // // //     }
// // // // // //   };

// // // // // //   const handleNotificationClick = async (n: NotificationItem) => {
// // // // // //     await markAsRead(n._id);
// // // // // //     if (n.link) {
// // // // // //       window.location.href = n.link;
// // // // // //     }
// // // // // //   };

// // // // // //   const goPrev = async () => {
// // // // // //     if (page > 1) {
// // // // // //       const newPage = page - 1;
// // // // // //       setPage(newPage);
// // // // // //       await fetchNotifications(newPage);
// // // // // //     }
// // // // // //   };

// // // // // //   const goNext = async () => {
// // // // // //     if (hasNextPage) {
// // // // // //       const newPage = page + 1;
// // // // // //       setPage(newPage);
// // // // // //       await fetchNotifications(newPage);
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <>
// // // // // //       <AlertModal
// // // // // //         isOpen={open}
// // // // // //         onCloseAction={() => setOpen(false)}
// // // // // //         onConfirmAction={handleLogout}
// // // // // //         loading={loading}
// // // // // //         description="You will be logged out"
// // // // // //       />

// // // // // //       {/* Notification Modal / Slider */}
// // // // // //       <div
// // // // // //         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end transition-transform duration-300 ease-in-out ${
// // // // // //           notificationsOpen ? 'translate-x-0' : 'translate-x-full'
// // // // // //         } z-50`}
// // // // // //       >
// // // // // //         <div
// // // // // //           className="w-[400px] h-full p-6 overflow-y-auto rounded-lg"
// // // // // //           style={{
// // // // // //             backgroundImage: 'url("/sky.png")',
// // // // // //             backgroundSize: 'cover',
// // // // // //             backgroundPosition: 'center'
// // // // // //           }}
// // // // // //         >
// // // // // //           {/* Header */}
// // // // // //           <div className="flex items-center justify-between mb-4">
// // // // // //             <h3 className="text-lg font-semibold text-white">Notifications</h3>

// // // // // //             <div className="flex items-center gap-2">
// // // // // //               <Button
// // // // // //                 onClick={() => fetchNotifications(page)}
// // // // // //                 className="btn-secondary backdrop-blur-lg hover:scale-105 transition-transform duration-200"
// // // // // //                 disabled={loading}
// // // // // //                 title="Refresh"
// // // // // //               >
// // // // // //                 <RotateCcw className="w-4 h-4 mr-2" />
// // // // // //                 {loading ? 'Refreshing...' : 'Refresh'}
// // // // // //               </Button>
// // // // // //               <Button
// // // // // //                 onClick={() => setNotificationsOpen(false)}
// // // // // //                 className="btn-secondary backdrop-blur-lg hover:scale-105 transition-transform duration-200"
// // // // // //               >
// // // // // //                 Close
// // // // // //               </Button>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* Pagination Controls */}
// // // // // //           <div className="flex items-center justify-between mb-3">
// // // // // //             <div className="text-white/80 text-sm">
// // // // // //               Page <span className="font-semibold text-white">{page}</span>
// // // // // //             </div>
// // // // // //             <div className="flex items-center gap-2">
// // // // // //               <Button
// // // // // //                 onClick={goPrev}
// // // // // //                 disabled={page === 1 || loading}
// // // // // //                 className="btn-secondary px-2 py-1"
// // // // // //                 title="Previous"
// // // // // //               >
// // // // // //                 <ChevronLeft className="w-4 h-4" />
// // // // // //               </Button>
// // // // // //               <Button
// // // // // //                 onClick={goNext}
// // // // // //                 disabled={!hasNextPage || loading}
// // // // // //                 className="btn-secondary px-2 py-1"
// // // // // //                 title="Next"
// // // // // //               >
// // // // // //                 <ChevronRight className="w-4 h-4" />
// // // // // //               </Button>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* List */}
// // // // // //           <div className="space-y-3">
// // // // // //             {loading && notifications.length === 0 ? (
// // // // // //               <p className="text-sm text-white/80">Loading...</p>
// // // // // //             ) : notifications.length > 0 ? (
// // // // // //               notifications.map((n) => (
// // // // // //                 <div
// // // // // //                   key={n._id}
// // // // // //                   className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer backdrop-blur-sm transition-transform duration-200 hover:scale-[1.02] ${
// // // // // //                     n.isRead
// // // // // //                       ? 'bg-white/10 border-white/20 opacity-80'
// // // // // //                       : 'bg-white/20 border-white/40'
// // // // // //                   }`}
// // // // // //                   onClick={() => handleNotificationClick(n)}
// // // // // //                 >
// // // // // //                   <div className="relative">
// // // // // //                     {/* Unread dot */}
// // // // // //                     {!n.isRead && (
// // // // // //                       <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
// // // // // //                     )}
// // // // // //                     <div className="bg-yellow-200 p-2 rounded-full">
// // // // // //                       <span className="text-xs text-gray-600">⚠️</span>
// // // // // //                     </div>
// // // // // //                   </div>

// // // // // //                   <div className="flex-1 min-w-0">
// // // // // //                     <p className="text-sm text-white truncate">{n.title}</p>
// // // // // //                     <p className="text-xs text-white/90 truncate">
// // // // // //                       {n.message}
// // // // // //                     </p>
// // // // // //                     <p className="text-[10px] text-white/70 mt-0.5">
// // // // // //                       {new Date(n.createdAt).toLocaleString()}
// // // // // //                     </p>
// // // // // //                   </div>
// // // // // //                 </div>
// // // // // //               ))
// // // // // //             ) : (
// // // // // //               <p className="text-sm text-white/80">No notifications</p>
// // // // // //             )}
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {/* Top Nav */}
// // // // // //       <nav
// // // // // //         className={`flex items-center w-full justify-between bg-[#EFE9DF] p-4 lg:w-[calc(100%-20%)] fixed z-[20] ${className}`}
// // // // // //       >
// // // // // //         {/* Left */}
// // // // // //         <div className="flex items-center gap-2 px-2 rounded-lg">
// // // // // //           {active && (
// // // // // //             <div className="border-2 flex gap-3 w-fit rounded-lg border-[#FAF7F2]">
// // // // // //               <Button className="p-0 bg-transparent ml-2 border-none shadow-none focus:ring-0 hover:bg-transparent">
// // // // // //                 <Filter
// // // // // //                   height={20}
// // // // // //                   width={20}
// // // // // //                   className="text-button-dark fill-coffee"
// // // // // //                 />
// // // // // //               </Button>

// // // // // //               <DropdownMenu>
// // // // // //                 <DropdownMenuTrigger asChild>
// // // // // //                   <Button className="bg-[#FAF7F2] rounded-l-none text-[#362913] font-semibold hover:bg-coffee/90 hover:text-[#FAF7F2] duration-150 ease-in-out">
// // // // // //                     {ranges[selectedRange] || 'Today'}
// // // // // //                   </Button>
// // // // // //                 </DropdownMenuTrigger>
// // // // // //                 <DropdownMenuContent
// // // // // //                   className="w-48 bg-[#FAF7F2] text-[#362913]"
// // // // // //                   side="bottom"
// // // // // //                   align="start"
// // // // // //                 >
// // // // // //                   {Object.entries(ranges).map(([key, label]) => (
// // // // // //                     <DropdownMenuItem
// // // // // //                       key={key}
// // // // // //                       onClick={() => onFilterChange?.(key)}
// // // // // //                     >
// // // // // //                       {label}
// // // // // //                     </DropdownMenuItem>
// // // // // //                   ))}
// // // // // //                 </DropdownMenuContent>
// // // // // //               </DropdownMenu>
// // // // // //             </div>
// // // // // //           )}
// // // // // //         </div>

// // // // // //         {/* Right */}
// // // // // //         <div className="flex items-center gap-4">
// // // // // //           <div className="relative">
// // // // // //             <Bell
// // // // // //               className="w-7 h-7 text-button-dark cursor-pointer hover:text-button-light"
// // // // // //               onClick={handleBellClick}
// // // // // //             />
// // // // // //             {unreadCount > 0 && (
// // // // // //               <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
// // // // // //                 {unreadCount}
// // // // // //               </span>
// // // // // //             )}
// // // // // //           </div>

// // // // // //           <DropdownMenu>
// // // // // //             <DropdownMenuTrigger asChild>
// // // // // //               <Button variant="ghost" className="relative h-8 w-8 rounded-full">
// // // // // //                 <div className="flex items-center">
// // // // // //                   <div className="flex items-center justify-center w-8 h-8 rounded-full btn-primary text-white">
// // // // // //                     {/* {firstLetter} */}
// // // // // //                     <span suppressHydrationWarning>{firstLetter}</span>
// // // // // //                   </div>
// // // // // //                 </div>
// // // // // //               </Button>
// // // // // //             </DropdownMenuTrigger>
// // // // // //             <DropdownMenuContent className="w-56" align="end" forceMount>
// // // // // //               <DropdownMenuLabel className="font-normal">
// // // // // //                 <div className="flex flex-col space-y-1">
// // // // // //                   <p className="text-sm font-medium leading-none">
// // // // // //                     {admin?.user?.name}
// // // // // //                   </p>
// // // // // //                   <p className="text-xs leading-none text-muted-foreground">
// // // // // //                     {admin?.user?.email}
// // // // // //                   </p>
// // // // // //                 </div>
// // // // // //               </DropdownMenuLabel>
// // // // // //               <DropdownMenuSeparator />
// // // // // //               <DropdownMenuItem onClick={() => setOpen(true)}>
// // // // // //                 Log out
// // // // // //                 <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
// // // // // //               </DropdownMenuItem>
// // // // // //             </DropdownMenuContent>
// // // // // //           </DropdownMenu>
// // // // // //         </div>
// // // // // //       </nav>
// // // // // //     </>
// // // // // //   );
// // // // // // }

// // // // // 'use client';

// // // // // import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// // // // // import { Button } from '@/components/ui/button';
// // // // // import {
// // // // //   Bell,
// // // // //   Filter,
// // // // //   ChevronLeft,
// // // // //   ChevronRight,
// // // // //   RotateCcw,
// // // // //   Loader2,
// // // // //   Download
// // // // // } from 'lucide-react';
// // // // // import {
// // // // //   DropdownMenu,
// // // // //   DropdownMenuContent,
// // // // //   DropdownMenuItem,
// // // // //   DropdownMenuLabel,
// // // // //   DropdownMenuSeparator,
// // // // //   DropdownMenuShortcut,
// // // // //   DropdownMenuTrigger
// // // // // } from './ui/dropdown-menu';
// // // // // import { AlertModal } from './modal/alert-modal';
// // // // // import { getSessionStorageItem } from 'utils/localstorage';
// // // // // import apiCall from '@/lib/axios';
// // // // // import { DateRange } from 'react-day-picker';
// // // // // import { format, subDays } from 'date-fns';
// // // // // import { Invoice } from 'app/(protected)/invoice';
// // // // // // import { DropdownMenu } from '@radix-ui/react-dropdown-menu';

// // // // // export type DateRangeKey =
// // // // //   | 'today'
// // // // //   | 'lastWeek'
// // // // //   | 'lastMonth'
// // // // //   | 'lastQuarter'
// // // // //   | 'lastYear';

// // // // // export interface navProps {
// // // // //   active?: boolean;
// // // // //   search?: boolean;
// // // // //   searchKey?: string;
// // // // //   className?: string;
// // // // //   onSearch?: (query: string) => void;
// // // // //   onFilterChange?: (range: string) => void;
// // // // //   selectedRange?: DateRangeKey;
// // // // // }

// // // // // type NotificationItem = {
// // // // //   _id: string;
// // // // //   adminId: string;
// // // // //   HotelId: string;
// // // // //   title: string;
// // // // //   message: string;
// // // // //   moduleName?: string;
// // // // //   link?: string;
// // // // //   isRead: boolean;
// // // // //   createdAt: string;
// // // // // };

// // // // // export default function Navbar({
// // // // //   active,
// // // // //   className,
// // // // //   onFilterChange,
// // // // //   selectedRange = 'today'
// // // // // }: navProps) {
// // // // //   const [open, setOpen] = useState(false);
// // // // //   // const [loading, setLoading] = useState(false);

// // // // //   const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');
// // // // //   const invoiceRef = useRef<HTMLDivElement>(null);
// // // // //   const [notificationsOpen, setNotificationsOpen] = useState(false);
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [downloading, setDownloading] = useState(false);
// // // // //   const [pdfGenerating, setPdfGenerating] = useState(false);
// // // // //   const [err, setErr] = useState<string | null>(null);
// // // // //   // Pagination state
// // // // //   const today = new Date();
// // // // //   const [range, setRange] = useState<DateRange | undefined>({
// // // // //     from: subDays(today, 30),
// // // // //     to: today
// // // // //   });
// // // // //   const [page, setPage] = useState(1);
// // // // //   const PAGE_SIZE = 7;
// // // // //   const [hasNextPage, setHasNextPage] = useState(false);
// // // // //   const startDate = useMemo(
// // // // //     () => (range?.from ? toYMD(range.from) : undefined),
// // // // //     [range?.from]
// // // // //   );
// // // // //   const endDate = useMemo(
// // // // //     () => (range?.to ? toYMD(range.to) : undefined),
// // // // //     [range?.to]
// // // // //   );
// // // // //   // Notifications state
// // // // //   const [notifications, setNotifications] = useState<NotificationItem[]>([]);

// // // // //   const admin = getSessionStorageItem<any>('admin');

// // // // //   const ranges: Record<DateRangeKey, string> = {
// // // // //     today: 'Today',
// // // // //     lastWeek: 'Last Week',
// // // // //     lastMonth: 'Last Month',
// // // // //     lastQuarter: 'Last Quarter',
// // // // //     lastYear: 'Last Year'
// // // // //   };

// // // // //   // ---- Fetch notifications with pagination ----
// // // // //   const fetchNotifications = useCallback(
// // // // //     async (pageToFetch: number = page) => {
// // // // //       try {
// // // // //         setLoading(true);
// // // // //         const response = await apiCall(
// // // // //           'GET',
// // // // //           `/api/notification?page=${pageToFetch}&limit=${PAGE_SIZE}`,
// // // // //           {}
// // // // //         );

// // // // //         // Expecting shape: { success: boolean, notifications: NotificationItem[] }
// // // // //         if (response?.success) {
// // // // //           const items: NotificationItem[] = response.notifications ?? [];
// // // // //           setNotifications(items);

// // // // //           // If we got less than PAGE_SIZE, we assume there is no next page
// // // // //           setHasNextPage(items.length === PAGE_SIZE);
// // // // //         }
// // // // //       } catch (error) {
// // // // //         console.error('Error fetching notifications:', error);
// // // // //       } finally {
// // // // //         setLoading(false);
// // // // //       }
// // // // //     },
// // // // //     [PAGE_SIZE, page]
// // // // //   );

// // // // //   // Initial fetch on mount (page = 1)
// // // // //   useEffect(() => {
// // // // //     fetchNotifications(1);
// // // // //   }, [fetchNotifications]);

// // // // //   // Refresh when page changes (only while panel is open or on explicit nav)
// // // // //   useEffect(() => {
// // // // //     if (notificationsOpen) fetchNotifications(page);
// // // // //   }, [notificationsOpen, page, fetchNotifications]);

// // // // //   const handleBellClick = async () => {
// // // // //     try {
// // // // //       await fetchNotifications(page);
// // // // //     } finally {
// // // // //       setNotificationsOpen(true);
// // // // //     }
// // // // //   };

// // // // //   const firstLetter = admin?.user?.name
// // // // //     ? admin.user.name.charAt(0).toUpperCase()
// // // // //     : 'H';

// // // // //   const handleLogout = () => {
// // // // //     sessionStorage.removeItem('token');
// // // // //     document.cookie = 'token=; Max-Age=0; path=/';
// // // // //     window.location.href = '/';
// // // // //   };

// // // // //   const unreadCount = notifications.filter((n) => !n.isRead).length;

// // // // //   const markAsRead = async (id: string) => {
// // // // //     try {
// // // // //       // Optimistic UI: mark read locally first
// // // // //       setNotifications((prev) =>
// // // // //         prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
// // // // //       );
// // // // //       await apiCall('GET', `/api/notification/markRead/${id}`, {});
// // // // //     } catch (err) {
// // // // //       console.error('Failed to mark as read:', err);
// // // // //       // rollback if needed
// // // // //       setNotifications((prev) =>
// // // // //         prev.map((n) => (n._id === id ? { ...n, isRead: false } : n))
// // // // //       );
// // // // //     }
// // // // //   };

// // // // //   const handleNotificationClick = async (n: NotificationItem) => {
// // // // //     await markAsRead(n._id);
// // // // //     if (n.link) {
// // // // //       window.location.href = n.link;
// // // // //     }
// // // // //   };

// // // // //   const goPrev = async () => {
// // // // //     if (page > 1) {
// // // // //       const newPage = page - 1;
// // // // //       setPage(newPage);
// // // // //       await fetchNotifications(newPage);
// // // // //     }
// // // // //   };

// // // // //   const goNext = async () => {
// // // // //     if (hasNextPage) {
// // // // //       const newPage = page + 1;
// // // // //       setPage(newPage);
// // // // //       await fetchNotifications(newPage);
// // // // //     }
// // // // //   };
// // // // //   async function handleInvoicePdf() {
// // // // //     if (!invoiceRef.current) return;
// // // // //     setPdfGenerating(true);
// // // // //     try {
// // // // //       const html2canvas = (await import('html2canvas')).default;
// // // // //       const { jsPDF } = await import('jspdf');

// // // // //       // Make a canvas snapshot
// // // // //       const canvas = await html2canvas(invoiceRef.current, {
// // // // //         scale: 2,
// // // // //         useCORS: true,
// // // // //         windowWidth: 900 // match the Invoice maxWidth for crisp output
// // // // //       });

// // // // //       const imgData = canvas.toDataURL('image/png');
// // // // //       const pdf = new jsPDF('p', 'mm', 'a4');
// // // // //       const pageWidth = pdf.internal.pageSize.getWidth();
// // // // //       const pageHeight = pdf.internal.pageSize.getHeight();

// // // // //       // Scale image to page width
// // // // //       const imgWidth = pageWidth;
// // // // //       const imgHeight = (canvas.height * imgWidth) / canvas.width;

// // // // //       let heightLeft = imgHeight;
// // // // //       let y = 0;

// // // // //       pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
// // // // //       heightLeft -= pageHeight;

// // // // //       while (heightLeft > 0) {
// // // // //         y -= pageHeight;
// // // // //         pdf.addPage();
// // // // //         pdf.addImage(imgData, 'PNG', 0, y, imgWidth, imgHeight);
// // // // //         heightLeft -= pageHeight;
// // // // //       }

// // // // //       pdf.save(`invoice_${startDate ?? ''}_${endDate ?? ''}.pdf`);
// // // // //     } finally {
// // // // //       setPdfGenerating(false);
// // // // //     }
// // // // //   }
// // // // //   return (
// // // // //     <>
// // // // //       <AlertModal
// // // // //         isOpen={open}
// // // // //         onCloseAction={() => setOpen(false)}
// // // // //         onConfirmAction={handleLogout}
// // // // //         loading={loading}
// // // // //         description="You will be logged out"
// // // // //       />

// // // // //       {/* Notification Modal / Slider */}
// // // // //       <div
// // // // //         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end transition-transform duration-300 ease-in-out ${
// // // // //           notificationsOpen ? 'translate-x-0' : 'translate-x-full'
// // // // //         } z-50`}
// // // // //       >
// // // // //         <div
// // // // //           className="w-[400px] h-full p-6 overflow-y-auto rounded-lg"
// // // // //           style={{
// // // // //             backgroundImage: 'url("/sky.png")',
// // // // //             backgroundSize: 'cover',
// // // // //             backgroundPosition: 'center'
// // // // //           }}
// // // // //         >
// // // // //           {/* Header */}
// // // // //           <div className="flex items-center justify-between mb-4">
// // // // //             <h3 className="text-lg font-semibold text-white">Notifications</h3>

// // // // //             <div className="flex items-center gap-2">
// // // // //               <Button
// // // // //                 onClick={() => fetchNotifications(page)}
// // // // //                 className="btn-secondary backdrop-blur-lg hover:scale-105 transition-transform duration-200"
// // // // //                 disabled={loading}
// // // // //                 title="Refresh"
// // // // //               >
// // // // //                 <RotateCcw className="w-4 h-4 mr-2" />
// // // // //                 {loading ? 'Refreshing...' : 'Refresh'}
// // // // //               </Button>
// // // // //               <Button
// // // // //                 onClick={() => setNotificationsOpen(false)}
// // // // //                 className="btn-secondary backdrop-blur-lg hover:scale-105 transition-transform duration-200"
// // // // //               >
// // // // //                 Close
// // // // //               </Button>
// // // // //             </div>
// // // // //           </div>
// // // // //           <Invoice
// // // // //             ref={invoiceRef}
// // // // //             hotelName="Hotel Sunshine"
// // // // //             hotelInfo="42 Palm Street, Goa, India"
// // // // //             gstin="27ABCDE1234F1Z5"
// // // // //             pan="ABCDE1234F"
// // // // //             ackNo="9876543210"
// // // // //             ackDate="2025-03-10"
// // // // //             irnNo="IRN-EXAMPLE-001"
// // // // //             invoiceNo="INV-2025-0001"
// // // // //             guestName="John Doe"
// // // // //             address="221B Baker Street, London"
// // // // //             bookingThrough="Direct"
// // // // //             mobile="+91 98765 43210"
// // // // //             arrival={startDate ?? '2025-03-01'}
// // // // //             departure={endDate ?? '2025-03-05'}
// // // // //             pax={2}
// // // // //             guestGstin="22AAAAA0000A1Z5"
// // // // //             items={[
// // // // //               {
// // // // //                 description: 'Deluxe Room (2 nights)',
// // // // //                 rate: 3500,
// // // // //                 qty: 2,
// // // // //                 total: 7000
// // // // //               },
// // // // //               {
// // // // //                 description: 'Breakfast Package',
// // // // //                 rate: 500,
// // // // //                 qty: 2,
// // // // //                 total: 1000
// // // // //               }
// // // // //             ]}
// // // // //             sgst={100}
// // // // //             cgst={100}
// // // // //             total={8200}
// // // // //             amountWords="Eight Thousand Two Hundred Only"
// // // // //           />
// // // // //           {/* Pagination Controls */}
// // // // //           <div className="flex items-center justify-between mb-3">
// // // // //             <div className="text-white/80 text-sm">
// // // // //               Page <span className="font-semibold text-white">{page}</span>
// // // // //             </div>
// // // // //             <div className="flex items-center gap-2">
// // // // //               <Button
// // // // //                 onClick={goPrev}
// // // // //                 disabled={page === 1 || loading}
// // // // //                 className="btn-secondary px-2 py-1"
// // // // //                 title="Previous"
// // // // //               >
// // // // //                 <ChevronLeft className="w-4 h-4" />
// // // // //               </Button>
// // // // //               <Button
// // // // //                 onClick={goNext}
// // // // //                 disabled={!hasNextPage || loading}
// // // // //                 className="btn-secondary px-2 py-1"
// // // // //                 title="Next"
// // // // //               >
// // // // //                 <ChevronRight className="w-4 h-4" />
// // // // //               </Button>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* List */}
// // // // //           <div className="space-y-3">
// // // // //             {loading && notifications.length === 0 ? (
// // // // //               <p className="text-sm text-white/80">Loading...</p>
// // // // //             ) : notifications.length > 0 ? (
// // // // //               notifications.map((n) => (
// // // // //                 <div
// // // // //                   key={n._id}
// // // // //                   className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer backdrop-blur-sm transition-transform duration-200 hover:scale-[1.02] ${
// // // // //                     n.isRead
// // // // //                       ? 'bg-white/10 border-white/20 opacity-80'
// // // // //                       : 'bg-white/20 border-white/40'
// // // // //                   }`}
// // // // //                   onClick={() => handleNotificationClick(n)}
// // // // //                 >
// // // // //                   <div className="relative">
// // // // //                     {/* Unread dot */}
// // // // //                     {!n.isRead && (
// // // // //                       <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
// // // // //                     )}
// // // // //                     <div className="bg-yellow-200 p-2 rounded-full">
// // // // //                       <span className="text-xs text-gray-600">⚠️</span>
// // // // //                     </div>
// // // // //                   </div>

// // // // //                   <div className="flex-1 min-w-0">
// // // // //                     <p className="text-sm text-white truncate">{n.title}</p>
// // // // //                     <p className="text-xs text-white/90 truncate">
// // // // //                       {n.message}
// // // // //                     </p>
// // // // //                     <p className="text-[10px] text-white/70 mt-0.5">
// // // // //                       {new Date(n.createdAt).toLocaleString()}
// // // // //                     </p>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               ))
// // // // //             ) : (
// // // // //               <p className="text-sm text-white/80">No notifications</p>
// // // // //             )}
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Top Nav */}
// // // // //       <nav
// // // // //         className={`flex items-center w-full justify-between bg-[#EFE9DF] p-4 lg:w-[calc(100%-20%)] fixed z-[20] ${className}`}
// // // // //       >
// // // // //         {/* Left */}
// // // // //         <div className="flex items-center gap-2 px-2 rounded-lg">
// // // // //           {active && (
// // // // //             <div className="border-2 flex gap-3 w-fit rounded-lg border-[#FAF7F2]">
// // // // //               <Button className="p-0 bg-transparent ml-2 border-none shadow-none focus:ring-0 hover:bg-transparent">
// // // // //                 <Filter
// // // // //                   height={20}
// // // // //                   width={20}
// // // // //                   className="text-button-dark fill-coffee"
// // // // //                 />
// // // // //               </Button>

// // // // //               <DropdownMenu>
// // // // //                 <DropdownMenuTrigger asChild>
// // // // //                   <Button className="bg-[#FAF7F2] rounded-l-none text-[#362913] font-semibold hover:bg-coffee/90 hover:text-[#FAF7F2] duration-150 ease-in-out">
// // // // //                     {ranges[selectedRange] || 'Today'}
// // // // //                   </Button>
// // // // //                 </DropdownMenuTrigger>
// // // // //                 <DropdownMenuContent
// // // // //                   className="w-48 bg-[#FAF7F2] text-[#362913]"
// // // // //                   side="bottom"
// // // // //                   align="start"
// // // // //                 >
// // // // //                   {Object.entries(ranges).map(([key, label]) => (
// // // // //                     <DropdownMenuItem
// // // // //                       key={key}
// // // // //                       onClick={() => onFilterChange?.(key)}
// // // // //                     >
// // // // //                       {label}
// // // // //                     </DropdownMenuItem>
// // // // //                   ))}
// // // // //                 </DropdownMenuContent>
// // // // //               </DropdownMenu>
// // // // //             </div>
// // // // //           )}
// // // // //         </div>

// // // // //         {/* Right */}
// // // // //         <div className="flex items-center gap-4">
// // // // //           <div className="relative">
// // // // //             <Bell
// // // // //               className="w-7 h-7 text-button-dark cursor-pointer hover:text-button-light"
// // // // //               onClick={handleBellClick}
// // // // //             />
// // // // //             {unreadCount > 0 && (
// // // // //               <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
// // // // //                 {unreadCount}
// // // // //               </span>
// // // // //             )}
// // // // //           </div>

// // // // //           <DropdownMenu>
// // // // //             <DropdownMenuTrigger asChild>
// // // // //               <Button variant="ghost" className="relative h-8 w-8 rounded-full">
// // // // //                 <div className="flex items-center">
// // // // //                   <div className="flex items-center justify-center w-8 h-8 rounded-full btn-primary text-white">
// // // // //                     {/* {firstLetter} */}
// // // // //                     <span suppressHydrationWarning>{firstLetter}</span>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </Button>
// // // // //             </DropdownMenuTrigger>
// // // // //             <DropdownMenuContent className="w-56" align="end" forceMount>
// // // // //               <DropdownMenuLabel className="font-normal">
// // // // //                 <div className="flex flex-col space-y-1">
// // // // //                   <p className="text-sm font-medium leading-none">
// // // // //                     {admin?.user?.name}
// // // // //                   </p>
// // // // //                   <p className="text-xs leading-none text-muted-foreground">
// // // // //                     {admin?.user?.email}
// // // // //                   </p>
// // // // //                 </div>
// // // // //                 <Button
// // // // //                   variant="secondary"
// // // // //                   onClick={handleInvoicePdf}
// // // // //                   disabled={pdfGenerating}
// // // // //                   className="flex items-center gap-2"
// // // // //                   title="Generate the invoice section below as a PDF"
// // // // //                 >
// // // // //                   {pdfGenerating ? (
// // // // //                     <>
// // // // //                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// // // // //                       Generating…
// // // // //                     </>
// // // // //                   ) : (
// // // // //                     <>
// // // // //                       <Download className="mr-2 h-4 w-4" />
// // // // //                       Download Invoice PDF
// // // // //                     </>
// // // // //                   )}
// // // // //                 </Button>
// // // // //               </DropdownMenuLabel>
// // // // //               <DropdownMenuSeparator />
// // // // //               <DropdownMenuItem onClick={() => setOpen(true)}>
// // // // //                 Log out
// // // // //                 <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
// // // // //               </DropdownMenuItem>
// // // // //             </DropdownMenuContent>
// // // // //           </DropdownMenu>
// // // // //         </div>
// // // // //       </nav>
// // // // //     </>
// // // // //   );
// // // // // }
// // // // 'use client';

// // // // import { useState, useEffect, useCallback, useRef } from 'react';
// // // // import { Button } from '@/components/ui/button';
// // // // import {
// // // //   Bell,
// // // //   Filter,
// // // //   ChevronLeft,
// // // //   ChevronRight,
// // // //   RotateCcw,
// // // //   Download
// // // // } from 'lucide-react';
// // // // import {
// // // //   DropdownMenu,
// // // //   DropdownMenuContent,
// // // //   DropdownMenuItem,
// // // //   DropdownMenuLabel,
// // // //   DropdownMenuSeparator,
// // // //   DropdownMenuShortcut,
// // // //   DropdownMenuTrigger
// // // // } from './ui/dropdown-menu';
// // // // import { AlertModal } from './modal/alert-modal';
// // // // import { getSessionStorageItem } from 'utils/localstorage';
// // // // import apiCall from '@/lib/axios';
// // // // import InvoiceA4, { InvoiceData } from 'app/(protected)/invoice';

// // // // export type DateRangeKey =
// // // //   | 'today'
// // // //   | 'lastWeek'
// // // //   | 'lastMonth'
// // // //   | 'lastQuarter'
// // // //   | 'lastYear';

// // // // export interface navProps {
// // // //   active?: boolean;
// // // //   search?: boolean;
// // // //   searchKey?: string;
// // // //   className?: string;
// // // //   onSearch?: (query: string) => void;
// // // //   onFilterChange?: (range: string) => void;
// // // //   selectedRange?: DateRangeKey;
// // // // }

// // // // type NotificationItem = {
// // // //   _id: string;
// // // //   adminId: string;
// // // //   HotelId: string;
// // // //   title: string;
// // // //   message: string;
// // // //   moduleName?: string;
// // // //   link?: string;
// // // //   isRead: boolean;
// // // //   createdAt: string;
// // // // };

// // // // export default function Navbar({
// // // //   active,
// // // //   className,
// // // //   onFilterChange,
// // // //   selectedRange = 'today'
// // // // }: navProps) {
// // // //   const [open, setOpen] = useState(false);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [notificationsOpen, setNotificationsOpen] = useState(false);

// // // //   // pagination
// // // //   const [page, setPage] = useState(1);
// // // //   const PAGE_SIZE = 7;
// // // //   const [hasNextPage, setHasNextPage] = useState(false);

// // // //   // notifications
// // // //   const [notifications, setNotifications] = useState<NotificationItem[]>([]);

// // // //   const admin = getSessionStorageItem<any>('admin');

// // // //   const ranges: Record<DateRangeKey, string> = {
// // // //     today: 'Today',
// // // //     lastWeek: 'Last Week',
// // // //     lastMonth: 'Last Month',
// // // //     lastQuarter: 'Last Quarter',
// // // //     lastYear: 'Last Year'
// // // //   };

// // // //   // -------- invoice (off-screen) ----------
// // // //   const invoiceRef = useRef<HTMLDivElement>(null);

// // // //   // TODO: replace with your real data
// // // //   const invoiceData: InvoiceData = {
// // // //     hotelName: 'HOTEL COOKWELL',
// // // //     addressTop: 'Ring Road, Agra',
// // // //     mobile: 'Mob.0987654321',
// // // //     email: 'agra343@yopmail.com',
// // // //     gstin: '12aaaaaa67290hhhu7m',
// // // //     pan: 'AAAPL1234C',
// // // //     ackNo: 'BO345563',
// // // //     ackDate: '26-Sep-25',
// // // //     irnNo: '345563',
// // // //     invoiceNo: 'RQ207966',
// // // //     guestName: 'abc22 test333',
// // // //     bookingThrough: 'Oyo',
// // // //     guestAddress: 'Alkapuri, Mount Motors Galli, Bagra, JH.',
// // // //     guestMobile: '1234567890',
// // // //     arrival: '03/10/2025 10:00 AM',
// // // //     departure: '04/10/2025 09:00 AM',
// // // //     pax: 2,
// // // //     guestGstin: '123445ABC55555',
// // // //     items: [
// // // //       {
// // // //         description: 'Toiletries - Delux Spap',
// // // //         rate: 10000,
// // // //         qty: 1,
// // // //         total: 10000
// // // //       }
// // // //     ],
// // // //     subtotal: 10000,
// // // //     sgst: 250,
// // // //     cgst: 250,
// // // //     grandTotal: 10500,
// // // //     amountWords: 'Rupees Ten Thousand Five Hundred Only'
// // // //   };

// // // //   // -------- fetch notifications ----------
// // // //   const fetchNotifications = useCallback(
// // // //     async (pageToFetch: number = page) => {
// // // //       try {
// // // //         setLoading(true);
// // // //         const response = await apiCall(
// // // //           'GET',
// // // //           `/api/notification?page=${pageToFetch}&limit=${PAGE_SIZE}`,
// // // //           {}
// // // //         );
// // // //         if (response?.success) {
// // // //           const items: NotificationItem[] = response.notifications ?? [];
// // // //           setNotifications(items);
// // // //           setHasNextPage(items.length === PAGE_SIZE);
// // // //         }
// // // //       } catch (error) {
// // // //         console.error('Error fetching notifications:', error);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     },
// // // //     [PAGE_SIZE, page]
// // // //   );

// // // //   useEffect(() => {
// // // //     fetchNotifications(1);
// // // //   }, [fetchNotifications]);

// // // //   useEffect(() => {
// // // //     if (notificationsOpen) fetchNotifications(page);
// // // //   }, [notificationsOpen, page, fetchNotifications]);

// // // //   const handleBellClick = async () => {
// // // //     try {
// // // //       await fetchNotifications(page);
// // // //     } finally {
// // // //       setNotificationsOpen(true);
// // // //     }
// // // //   };

// // // //   const firstLetter = admin?.user?.name
// // // //     ? admin.user.name.charAt(0).toUpperCase()
// // // //     : 'H';

// // // //   const handleLogout = () => {
// // // //     sessionStorage.removeItem('token');
// // // //     document.cookie = 'token=; Max-Age=0; path=/';
// // // //     window.location.href = '/';
// // // //   };

// // // //   const unreadCount = notifications.filter((n) => !n.isRead).length;

// // // //   const markAsRead = async (id: string) => {
// // // //     try {
// // // //       setNotifications((prev) =>
// // // //         prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
// // // //       );
// // // //       await apiCall('GET', `/api/notification/markRead/${id}`, {});
// // // //     } catch (err) {
// // // //       console.error('Failed to mark as read:', err);
// // // //       setNotifications((prev) =>
// // // //         prev.map((n) => (n._id === id ? { ...n, isRead: false } : n))
// // // //       );
// // // //     }
// // // //   };

// // // //   const handleNotificationClick = async (n: NotificationItem) => {
// // // //     await markAsRead(n._id);
// // // //     if (n.link) window.location.href = n.link;
// // // //   };

// // // //   const goPrev = async () => {
// // // //     if (page > 1) {
// // // //       const newPage = page - 1;
// // // //       setPage(newPage);
// // // //       await fetchNotifications(newPage);
// // // //     }
// // // //   };

// // // //   const goNext = async () => {
// // // //     if (hasNextPage) {
// // // //       const newPage = page + 1;
// // // //       setPage(newPage);
// // // //       await fetchNotifications(newPage);
// // // //     }
// // // //   };

// // // //   // -------- generate PDF ----------
// // // //   const handleInvoicePdf = async () => {
// // // //     const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
// // // //       import('html2canvas'),
// // // //       import('jspdf')
// // // //     ]);

// // // //     const el = invoiceRef.current;
// // // //     if (!el) return;

// // // //     const canvas = await html2canvas(el, {
// // // //       scale: 2,
// // // //       useCORS: true,
// // // //       backgroundColor: '#ffffff',
// // // //       logging: false,
// // // //       windowWidth: el.scrollWidth,
// // // //       windowHeight: el.scrollHeight
// // // //     });

// // // //     const img = canvas.toDataURL('image/png');
// // // //     const pdf = new jsPDF('p', 'pt', 'a4');

// // // //     const pageW = pdf.internal.pageSize.getWidth(); // 595.28
// // // //     const pageH = pdf.internal.pageSize.getHeight(); // 841.89
// // // //     const margin = 24; // pt
// // // //     const usableW = pageW - margin * 2;

// // // //     const imgW = usableW;
// // // //     const imgH = (canvas.height * imgW) / canvas.width;

// // // //     // If content taller than a page, repeat/clip across pages
// // // //     let remaining = imgH;
// // // //     let yOffset = margin;
// // // //     let shift = 0;

// // // //     while (remaining > 0) {
// // // //       pdf.addImage(
// // // //         img,
// // // //         'PNG',
// // // //         margin,
// // // //         yOffset - shift,
// // // //         imgW,
// // // //         imgH,
// // // //         undefined,
// // // //         'FAST'
// // // //       );
// // // //       remaining -= pageH - margin * 2;
// // // //       if (remaining > 0) {
// // // //         pdf.addPage();
// // // //         shift += pageH - margin * 2;
// // // //         yOffset = margin;
// // // //       }
// // // //     }

// // // //     pdf.save(`Invoice_${new Date().toISOString().slice(0, 10)}.pdf`);
// // // //   };

// // // //   return (
// // // //     <>
// // // //       {/* hidden/off-screen invoice */}
// // // //       <div
// // // //         aria-hidden
// // // //         className="fixed -left-[99999px] -top-[99999px] pointer-events-none select-none"
// // // //       >
// // // //         <InvoiceA4 ref={invoiceRef} data={invoiceData} />
// // // //       </div>

// // // //       <AlertModal
// // // //         isOpen={open}
// // // //         onCloseAction={() => setOpen(false)}
// // // //         onConfirmAction={handleLogout}
// // // //         loading={loading}
// // // //         description="You will be logged out"
// // // //       />

// // // //       {/* Notifications panel */}
// // // //       <div
// // // //         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end transition-transform duration-300 ease-in-out ${
// // // //           notificationsOpen ? 'translate-x-0' : 'translate-x-full'
// // // //         } z-50`}
// // // //       >
// // // //         <div
// // // //           className="w-[400px] h-full p-6 overflow-y-auto rounded-lg"
// // // //           style={{
// // // //             backgroundImage: 'url("/sky.png")',
// // // //             backgroundSize: 'cover',
// // // //             backgroundPosition: 'center'
// // // //           }}
// // // //         >
// // // //           <div className="flex items-center justify-between mb-4">
// // // //             <h3 className="text-lg font-semibold text-white">Notifications</h3>
// // // //             <div className="flex items-center gap-2">
// // // //               <Button
// // // //                 onClick={() => fetchNotifications(page)}
// // // //                 className="btn-secondary backdrop-blur-lg hover:scale-105 transition-transform duration-200"
// // // //                 disabled={loading}
// // // //                 title="Refresh"
// // // //               >
// // // //                 <RotateCcw className="w-4 h-4 mr-2" />
// // // //                 {loading ? 'Refreshing...' : 'Refresh'}
// // // //               </Button>
// // // //               <Button
// // // //                 onClick={() => setNotificationsOpen(false)}
// // // //                 className="btn-secondary backdrop-blur-lg hover:scale-105 transition-transform duration-200"
// // // //               >
// // // //                 Close
// // // //               </Button>
// // // //             </div>
// // // //           </div>

// // // //           <div className="flex items-center justify-between mb-3">
// // // //             <div className="text-white/80 text-sm">
// // // //               Page <span className="font-semibold text-white">{page}</span>
// // // //             </div>
// // // //             <div className="flex items-center gap-2">
// // // //               <Button
// // // //                 onClick={goPrev}
// // // //                 disabled={page === 1 || loading}
// // // //                 className="btn-secondary px-2 py-1"
// // // //                 title="Previous"
// // // //               >
// // // //                 <ChevronLeft className="w-4 h-4" />
// // // //               </Button>
// // // //               <Button
// // // //                 onClick={goNext}
// // // //                 disabled={!hasNextPage || loading}
// // // //                 className="btn-secondary px-2 py-1"
// // // //                 title="Next"
// // // //               >
// // // //                 <ChevronRight className="w-4 h-4" />
// // // //               </Button>
// // // //             </div>
// // // //           </div>

// // // //           <div className="space-y-3">
// // // //             {loading && notifications.length === 0 ? (
// // // //               <p className="text-sm text-white/80">Loading...</p>
// // // //             ) : notifications.length > 0 ? (
// // // //               notifications.map((n) => (
// // // //                 <div
// // // //                   key={n._id}
// // // //                   className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer backdrop-blur-sm transition-transform duration-200 hover:scale-[1.02] ${
// // // //                     n.isRead
// // // //                       ? 'bg-white/10 border-white/20 opacity-80'
// // // //                       : 'bg-white/20 border-white/40'
// // // //                   }`}
// // // //                   onClick={() => handleNotificationClick(n)}
// // // //                 >
// // // //                   <div className="relative">
// // // //                     {!n.isRead && (
// // // //                       <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
// // // //                     )}
// // // //                     <div className="bg-yellow-200 p-2 rounded-full">
// // // //                       <span className="text-xs text-gray-600">⚠️</span>
// // // //                     </div>
// // // //                   </div>

// // // //                   <div className="flex-1 min-w-0">
// // // //                     <p className="text-sm text-white truncate">{n.title}</p>
// // // //                     <p className="text-xs text-white/90 truncate">
// // // //                       {n.message}
// // // //                     </p>
// // // //                     <p className="text-[10px] text-white/70 mt-0.5">
// // // //                       {new Date(n.createdAt).toLocaleString()}
// // // //                     </p>
// // // //                   </div>
// // // //                 </div>
// // // //               ))
// // // //             ) : (
// // // //               <p className="text-sm text-white/80">No notifications</p>
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* Top nav */}
// // // //       <nav
// // // //         className={`flex items-center w-full justify-between bg-[#EFE9DF] p-4 lg:w-[calc(100%-20%)] fixed z-[20] ${className}`}
// // // //       >
// // // //         {/* Left */}
// // // //         <div className="flex items-center gap-2 px-2 rounded-lg">
// // // //           {active && (
// // // //             <div className="border-2 flex gap-3 w-fit rounded-lg border-[#FAF7F2]">
// // // //               <Button className="p-0 bg-transparent ml-2 border-none shadow-none focus:ring-0 hover:bg-transparent">
// // // //                 <Filter
// // // //                   height={20}
// // // //                   width={20}
// // // //                   className="text-button-dark fill-coffee"
// // // //                 />
// // // //               </Button>

// // // //               <DropdownMenu>
// // // //                 <DropdownMenuTrigger asChild>
// // // //                   <Button className="bg-[#FAF7F2] rounded-l-none text-[#362913] font-semibold hover:bg-coffee/90 hover:text-[#FAF7F2] duration-150 ease-in-out">
// // // //                     {ranges[selectedRange] || 'Today'}
// // // //                   </Button>
// // // //                 </DropdownMenuTrigger>
// // // //                 <DropdownMenuContent
// // // //                   className="w-48 bg-[#FAF7F2] text-[#362913]"
// // // //                   side="bottom"
// // // //                   align="start"
// // // //                 >
// // // //                   {Object.entries(ranges).map(([key, label]) => (
// // // //                     <DropdownMenuItem
// // // //                       key={key}
// // // //                       onClick={() => onFilterChange?.(key as DateRangeKey)}
// // // //                     >
// // // //                       {label}
// // // //                     </DropdownMenuItem>
// // // //                   ))}
// // // //                 </DropdownMenuContent>
// // // //               </DropdownMenu>
// // // //             </div>
// // // //           )}
// // // //         </div>

// // // //         {/* Right */}
// // // //         <div className="flex items-center gap-4">
// // // //           <div className="relative">
// // // //             <Bell
// // // //               className="w-7 h-7 text-button-dark cursor-pointer hover:text-button-light"
// // // //               onClick={handleBellClick}
// // // //             />
// // // //             {unreadCount > 0 && (
// // // //               <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
// // // //                 {unreadCount}
// // // //               </span>
// // // //             )}
// // // //           </div>

// // // //           <DropdownMenu>
// // // //             <DropdownMenuTrigger asChild>
// // // //               <Button variant="ghost" className="relative h-8 w-8 rounded-full">
// // // //                 <div className="flex items-center">
// // // //                   <div className="flex items-center justify-center w-8 h-8 rounded-full btn-primary text-white">
// // // //                     <span suppressHydrationWarning>{firstLetter}</span>
// // // //                   </div>
// // // //                 </div>
// // // //               </Button>
// // // //             </DropdownMenuTrigger>

// // // //             <DropdownMenuContent className="w-56" align="end" forceMount>
// // // //               <DropdownMenuLabel className="font-normal">
// // // //                 <div className="flex flex-col space-y-1">
// // // //                   <p className="text-sm font-medium leading-none">
// // // //                     {admin?.user?.name}
// // // //                   </p>
// // // //                   <p className="text-xs leading-none text-muted-foreground">
// // // //                     {admin?.user?.email}
// // // //                   </p>
// // // //                 </div>
// // // //               </DropdownMenuLabel>

// // // //               <DropdownMenuSeparator />

// // // //               {/* New: Download Invoice above logout */}
// // // //               <DropdownMenuItem onClick={handleInvoicePdf}>
// // // //                 <Download className="mr-2 h-4 w-4" />
// // // //                 Download Invoice (PDF)
// // // //                 <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
// // // //               </DropdownMenuItem>

// // // //               <DropdownMenuSeparator />

// // // //               <DropdownMenuItem onClick={() => setOpen(true)}>
// // // //                 Log out
// // // //                 <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
// // // //               </DropdownMenuItem>
// // // //             </DropdownMenuContent>
// // // //           </DropdownMenu>
// // // //         </div>
// // // //       </nav>
// // // //     </>
// // // //   );
// // // // }
// // // 'use client';

// // // import { useState, useEffect, useCallback, useRef } from 'react';
// // // import { Button } from '@/components/ui/button';
// // // import {
// // //   Bell,
// // //   Filter,
// // //   ChevronLeft,
// // //   ChevronRight,
// // //   RotateCcw,
// // //   Download
// // // } from 'lucide-react';
// // // import {
// // //   DropdownMenu,
// // //   DropdownMenuContent,
// // //   DropdownMenuItem,
// // //   DropdownMenuLabel,
// // //   DropdownMenuSeparator,
// // //   DropdownMenuShortcut,
// // //   DropdownMenuTrigger
// // // } from './ui/dropdown-menu';
// // // import { AlertModal } from './modal/alert-modal';
// // // import { getSessionStorageItem } from 'utils/localstorage';
// // // import apiCall from '@/lib/axios';
// // // import SubscriptionInvoice, {
// // //   SubscriptionInvoiceData
// // // } from 'app/(protected)/invoice';

// // // export type DateRangeKey =
// // //   | 'today'
// // //   | 'lastWeek'
// // //   | 'lastMonth'
// // //   | 'lastQuarter'
// // //   | 'lastYear';

// // // export interface navProps {
// // //   active?: boolean;
// // //   search?: boolean;
// // //   searchKey?: string;
// // //   className?: string;
// // //   onSearch?: (query: string) => void;
// // //   onFilterChange?: (range: string) => void;
// // //   selectedRange?: DateRangeKey;
// // // }

// // // type NotificationItem = {
// // //   _id: string;
// // //   adminId: string;
// // //   HotelId: string;
// // //   title: string;
// // //   message: string;
// // //   moduleName?: string;
// // //   link?: string;
// // //   isRead: boolean;
// // //   createdAt: string;
// // // };

// // // export default function Navbar({
// // //   active,
// // //   className,
// // //   onFilterChange,
// // //   selectedRange = 'today'
// // // }: navProps) {
// // //   const [open, setOpen] = useState(false);
// // //   const [loading, setLoading] = useState(false);
// // //   const [notificationsOpen, setNotificationsOpen] = useState(false);

// // //   // pagination
// // //   const [page, setPage] = useState(1);
// // //   const PAGE_SIZE = 7;
// // //   const [hasNextPage, setHasNextPage] = useState(false);

// // //   // notifications
// // //   const [notifications, setNotifications] = useState<NotificationItem[]>([]);

// // //   const admin = getSessionStorageItem<any>('admin');

// // //   const ranges: Record<DateRangeKey, string> = {
// // //     today: 'Today',
// // //     lastWeek: 'Last Week',
// // //     lastMonth: 'Last Month',
// // //     lastQuarter: 'Last Quarter',
// // //     lastYear: 'Last Year'
// // //   };

// // //   // -------- invoice (off-screen) ----------
// // //   const invoiceRef = useRef<HTMLDivElement>(null);
// // //   const [invoiceData, setInvoiceData] =
// // //     useState<SubscriptionInvoiceData | null>(null);

// // //   // Fetch subscription invoice by ID
// // //   const fetchInvoice = useCallback(async (id: string) => {
// // //     const res = await apiCall('GET', `/api/invoice/subscription/${id}`, {});
// // //     if (!res?.success || !res?.data)
// // //       throw new Error('Failed to fetch invoice.');
// // //     const d = res.data;

// // //     // Ensure types line up with component
// // //     const mapped: SubscriptionInvoiceData = {
// // //       irn: d.irn,
// // //       invoiceNo: d.invoiceNo,
// // //       hotelName: d.hotelName,
// // //       hotelAddress: d.hotelAddress,
// // //       hotelPhone: d.hotelPhone,
// // //       hotelEmail: d.hotelEmail,
// // //       hotelGST: d.hotelGST,
// // //       hotelPAN: d.hotelPAN || '',
// // //       subscriptionPlan: d.subscriptionPlan,
// // //       subsctiptionStart: d.subsctiptionStart,
// // //       subscriptionEnd: d.subscriptionEnd,
// // //       couponCode: d.couponCode ?? null,
// // //       charges: (d.charges ?? []).map((c: any) => ({
// // //         description: c.description,
// // //         rate: Number(c.rate) || 0,
// // //         duration: c.duration,
// // //         qty: c.duration, // show “Qty” as months
// // //         total: Number(c.total) || 0,
// // //         amount: Number(c.amount) || Number(c.total) || 0
// // //       })),
// // //       subtotal: Number(d.subtotal) || 0,
// // //       gstAmount: Number(d.gstAmount) || 0,
// // //       gstPercentage: Number(d.gstPercentage) || 0,
// // //       sgstPercentage: Number(d.sgstPercentage) || 0,
// // //       sgstAmount: Number(d.sgstAmount) || 0,
// // //       cgstPercentage: Number(d.cgstPercentage) || 0,
// // //       cgstAmount: Number(d.cgstAmount) || 0,
// // //       grandTotal: Number(d.grandTotal) || 0,
// // //       inWords: d.inWords
// // //     };

// // //     setInvoiceData(mapped);
// // //     return mapped;
// // //   }, []);

// // //   // -------- fetch notifications ----------
// // //   const fetchNotifications = useCallback(
// // //     async (pageToFetch: number = page) => {
// // //       try {
// // //         setLoading(true);
// // //         const response = await apiCall(
// // //           'GET',
// // //           `/api/notification?page=${pageToFetch}&limit=${PAGE_SIZE}`,
// // //           {}
// // //         );
// // //         if (response?.success) {
// // //           const items: NotificationItem[] = response.notifications ?? [];
// // //           setNotifications(items);
// // //           setHasNextPage(items.length === PAGE_SIZE);
// // //         }
// // //       } catch (error) {
// // //         console.error('Error fetching notifications:', error);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     },
// // //     [PAGE_SIZE, page]
// // //   );

// // //   useEffect(() => {
// // //     fetchNotifications(1);
// // //   }, [fetchNotifications]);

// // //   useEffect(() => {
// // //     if (notificationsOpen) fetchNotifications(page);
// // //   }, [notificationsOpen, page, fetchNotifications]);

// // //   const handleBellClick = async () => {
// // //     try {
// // //       await fetchNotifications(page);
// // //     } finally {
// // //       setNotificationsOpen(true);
// // //     }
// // //   };

// // //   const firstLetter = admin?.user?.name
// // //     ? admin.user.name.charAt(0).toUpperCase()
// // //     : 'H';

// // //   const handleLogout = () => {
// // //     sessionStorage.removeItem('token');
// // //     document.cookie = 'token=; Max-Age=0; path=/';
// // //     window.location.href = '/';
// // //   };

// // //   const unreadCount = notifications.filter((n) => !n.isRead).length;

// // //   const markAsRead = async (id: string) => {
// // //     try {
// // //       setNotifications((prev) =>
// // //         prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
// // //       );
// // //       await apiCall('GET', `/api/notification/markRead/${id}`, {});
// // //     } catch (err) {
// // //       console.error('Failed to mark as read:', err);
// // //       setNotifications((prev) =>
// // //         prev.map((n) => (n._id === id ? { ...n, isRead: false } : n))
// // //       );
// // //     }
// // //   };

// // //   const handleNotificationClick = async (n: NotificationItem) => {
// // //     await markAsRead(n._id);
// // //     if (n.link) window.location.href = n.link;
// // //   };

// // //   const goPrev = async () => {
// // //     if (page > 1) {
// // //       const newPage = page - 1;
// // //       setPage(newPage);
// // //       await fetchNotifications(newPage);
// // //     }
// // //   };

// // //   const goNext = async () => {
// // //     if (hasNextPage) {
// // //       const newPage = page + 1;
// // //       setPage(newPage);
// // //       await fetchNotifications(newPage);
// // //     }
// // //   };

// // //   // -------- generate PDF ----------
// // //   const handleInvoicePdf = async () => {
// // //     try {
// // //       // Ensure we have fresh invoice data
// // //       const id = '68c8fba6e1c648fdbb63d281'; // <- your given ID
// // //       const current = invoiceData ?? (await fetchInvoice(id));

// // //       // Wait one frame for the hidden component to render with data
// // //       await new Promise((r) => requestAnimationFrame(() => r(null)));

// // //       const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
// // //         import('html2canvas'),
// // //         import('jspdf')
// // //       ]);

// // //       const el = invoiceRef.current;
// // //       if (!el) return;

// // //       const canvas = await html2canvas(el, {
// // //         scale: 2,
// // //         useCORS: true,
// // //         backgroundColor: '#ffffff',
// // //         logging: false,
// // //         windowWidth: el.scrollWidth,
// // //         windowHeight: el.scrollHeight
// // //       });

// // //       const img = canvas.toDataURL('image/png');
// // //       const pdf = new jsPDF('p', 'pt', 'a4');

// // //       const pageW = pdf.internal.pageSize.getWidth(); // 595.28 pt
// // //       const pageH = pdf.internal.pageSize.getHeight(); // 841.89 pt
// // //       const margin = 24; // pt
// // //       const usableW = pageW - margin * 2;

// // //       const imgW = usableW;
// // //       const imgH = (canvas.height * imgW) / canvas.width;

// // //       // Multi-page if needed
// // //       let remaining = imgH;
// // //       let shift = 0;
// // //       while (remaining > 0) {
// // //         pdf.addImage(
// // //           img,
// // //           'PNG',
// // //           margin,
// // //           margin - shift,
// // //           imgW,
// // //           imgH,
// // //           undefined,
// // //           'FAST'
// // //         );
// // //         remaining -= pageH - margin * 2;
// // //         if (remaining > 0) {
// // //           pdf.addPage();
// // //           shift += pageH - margin * 2;
// // //         }
// // //       }

// // //       pdf.save(
// // //         `${current.invoiceNo || 'Invoice'}_${new Date().toISOString().slice(0, 10)}.pdf`
// // //       );
// // //     } catch (e) {
// // //       console.error(e);
// // //     }
// // //   };

// // //   return (
// // //     <>
// // //       {/* Hidden/off-screen invoice for capture */}
// // //       <div
// // //         aria-hidden
// // //         className="fixed -left-[99999px] -top-[99999px] pointer-events-none select-none"
// // //       >
// // //         {invoiceData && (
// // //           <SubscriptionInvoice ref={invoiceRef} data={invoiceData} />
// // //         )}
// // //       </div>

// // //       <AlertModal
// // //         isOpen={open}
// // //         onCloseAction={() => setOpen(false)}
// // //         onConfirmAction={handleLogout}
// // //         loading={loading}
// // //         description="You will be logged out"
// // //       />

// // //       {/* Notifications panel */}
// // //       <div
// // //         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end transition-transform duration-300 ease-in-out ${
// // //           notificationsOpen ? 'translate-x-0' : 'translate-x-full'
// // //         } z-50`}
// // //       >
// // //         <div
// // //           className="w-[400px] h-full p-6 overflow-y-auto rounded-lg"
// // //           style={{
// // //             backgroundImage: 'url("/sky.png")',
// // //             backgroundSize: 'cover',
// // //             backgroundPosition: 'center'
// // //           }}
// // //         >
// // //           <div className="flex items-center justify-between mb-4">
// // //             <h3 className="text-lg font-semibold text-white">Notifications</h3>
// // //             <div className="flex items-center gap-2">
// // //               <Button
// // //                 onClick={() => fetchNotifications(page)}
// // //                 className="btn-secondary backdrop-blur-lg hover:scale-105 transition-transform duration-200"
// // //                 disabled={loading}
// // //                 title="Refresh"
// // //               >
// // //                 <RotateCcw className="w-4 h-4 mr-2" />
// // //                 {loading ? 'Refreshing...' : 'Refresh'}
// // //               </Button>
// // //               <Button
// // //                 onClick={() => setNotificationsOpen(false)}
// // //                 className="btn-secondary backdrop-blur-lg hover:scale-105 transition-transform duration-200"
// // //               >
// // //                 Close
// // //               </Button>
// // //             </div>
// // //           </div>

// // //           <div className="flex items-center justify-between mb-3">
// // //             <div className="text-white/80 text-sm">
// // //               Page <span className="font-semibold text-white">{page}</span>
// // //             </div>
// // //             <div className="flex items-center gap-2">
// // //               <Button
// // //                 onClick={goPrev}
// // //                 disabled={page === 1 || loading}
// // //                 className="btn-secondary px-2 py-1"
// // //                 title="Previous"
// // //               >
// // //                 <ChevronLeft className="w-4 h-4" />
// // //               </Button>
// // //               <Button
// // //                 onClick={goNext}
// // //                 disabled={!hasNextPage || loading}
// // //                 className="btn-secondary px-2 py-1"
// // //                 title="Next"
// // //               >
// // //                 <ChevronRight className="w-4 h-4" />
// // //               </Button>
// // //             </div>
// // //           </div>

// // //           <div className="space-y-3">
// // //             {loading && notifications.length === 0 ? (
// // //               <p className="text-sm text-white/80">Loading...</p>
// // //             ) : notifications.length > 0 ? (
// // //               notifications.map((n) => (
// // //                 <div
// // //                   key={n._id}
// // //                   className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer backdrop-blur-sm transition-transform duration-200 hover:scale-[1.02] ${
// // //                     n.isRead
// // //                       ? 'bg-white/10 border-white/20 opacity-80'
// // //                       : 'bg-white/20 border-white/40'
// // //                   }`}
// // //                   onClick={() => handleNotificationClick(n)}
// // //                 >
// // //                   <div className="relative">
// // //                     {!n.isRead && (
// // //                       <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
// // //                     )}
// // //                     <div className="bg-yellow-200 p-2 rounded-full">
// // //                       <span className="text-xs text-gray-600">⚠️</span>
// // //                     </div>
// // //                   </div>

// // //                   <div className="flex-1 min-w-0">
// // //                     <p className="text-sm text-white truncate">{n.title}</p>
// // //                     <p className="text-xs text-white/90 truncate">
// // //                       {n.message}
// // //                     </p>
// // //                     <p className="text-[10px] text-white/70 mt-0.5">
// // //                       {new Date(n.createdAt).toLocaleString()}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               ))
// // //             ) : (
// // //               <p className="text-sm text-white/80">No notifications</p>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Top nav */}
// // //       <nav
// // //         className={`flex items-center w-full justify-between bg-[#EFE9DF] p-4 lg:w-[calc(100%-20%)] fixed z-[20] ${className}`}
// // //       >
// // //         {/* Left */}
// // //         <div className="flex items-center gap-2 px-2 rounded-lg">
// // //           {active && (
// // //             <div className="border-2 flex gap-3 w-fit rounded-lg border-[#FAF7F2]">
// // //               <Button className="p-0 bg-transparent ml-2 border-none shadow-none focus:ring-0 hover:bg-transparent">
// // //                 <Filter
// // //                   height={20}
// // //                   width={20}
// // //                   className="text-button-dark fill-coffee"
// // //                 />
// // //               </Button>

// // //               <DropdownMenu>
// // //                 <DropdownMenuTrigger asChild>
// // //                   <Button className="bg-[#FAF7F2] rounded-l-none text-[#362913] font-semibold hover:bg-coffee/90 hover:text-[#FAF7F2] duration-150 ease-in-out">
// // //                     {ranges[selectedRange] || 'Today'}
// // //                   </Button>
// // //                 </DropdownMenuTrigger>
// // //                 <DropdownMenuContent
// // //                   className="w-48 bg-[#FAF7F2] text-[#362913]"
// // //                   side="bottom"
// // //                   align="start"
// // //                 >
// // //                   {Object.entries(ranges).map(([key, label]) => (
// // //                     <DropdownMenuItem
// // //                       key={key}
// // //                       onClick={() => onFilterChange?.(key as DateRangeKey)}
// // //                     >
// // //                       {label}
// // //                     </DropdownMenuItem>
// // //                   ))}
// // //                 </DropdownMenuContent>
// // //               </DropdownMenu>
// // //             </div>
// // //           )}
// // //         </div>

// // //         {/* Right */}
// // //         <div className="flex items-center gap-4">
// // //           <div className="relative">
// // //             <Bell
// // //               className="w-7 h-7 text-button-dark cursor-pointer hover:text-button-light"
// // //               onClick={handleBellClick}
// // //             />
// // //             {unreadCount > 0 && (
// // //               <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
// // //                 {unreadCount}
// // //               </span>
// // //             )}
// // //           </div>

// // //           <DropdownMenu>
// // //             <DropdownMenuTrigger asChild>
// // //               <Button variant="ghost" className="relative h-8 w-8 rounded-full">
// // //                 <div className="flex items-center">
// // //                   <div className="flex items-center justify-center w-8 h-8 rounded-full btn-primary text-white">
// // //                     <span suppressHydrationWarning>
// // //                       {(admin?.user?.name || 'H')[0].toUpperCase()}
// // //                     </span>
// // //                   </div>
// // //                 </div>
// // //               </Button>
// // //             </DropdownMenuTrigger>

// // //             <DropdownMenuContent className="w-56" align="end" forceMount>
// // //               <DropdownMenuLabel className="font-normal">
// // //                 <div className="flex flex-col space-y-1">
// // //                   <p className="text-sm font-medium leading-none">
// // //                     {admin?.user?.name}
// // //                   </p>
// // //                   <p className="text-xs leading-none text-muted-foreground">
// // //                     {admin?.user?.email}
// // //                   </p>
// // //                 </div>
// // //               </DropdownMenuLabel>

// // //               <DropdownMenuSeparator />

// // //               {/* Download invoice above Logout */}
// // //               <DropdownMenuItem onClick={handleInvoicePdf}>
// // //                 <Download className="mr-2 h-4 w-4" />
// // //                 Download Invoice (PDF)
// // //                 <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
// // //               </DropdownMenuItem>

// // //               <DropdownMenuSeparator />

// // //               <DropdownMenuItem onClick={() => setOpen(true)}>
// // //                 Log out
// // //                 <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
// // //               </DropdownMenuItem>
// // //             </DropdownMenuContent>
// // //           </DropdownMenu>
// // //         </div>
// // //       </nav>
// // //     </>
// // //   );
// // // }
// // 'use client';

// // import { useState, useEffect, useCallback, useRef } from 'react';
// // import { Button } from '@/components/ui/button';
// // import {
// //   Bell,
// //   Filter,
// //   ChevronLeft,
// //   ChevronRight,
// //   RotateCcw,
// //   Download
// // } from 'lucide-react';
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuLabel,
// //   DropdownMenuSeparator,
// //   DropdownMenuShortcut,
// //   DropdownMenuTrigger
// // } from './ui/dropdown-menu';
// // import { AlertModal } from './modal/alert-modal';
// // import { getSessionStorageItem } from 'utils/localstorage';
// // import apiCall from '@/lib/axios';
// // import InvoiceExactA4, { InvoiceExactProps } from 'app/(protected)/invoice';

// // export type DateRangeKey =
// //   | 'today'
// //   | 'lastWeek'
// //   | 'lastMonth'
// //   | 'lastQuarter'
// //   | 'lastYear';

// // export interface navProps {
// //   active?: boolean;
// //   search?: boolean;
// //   searchKey?: string;
// //   className?: string;
// //   onSearch?: (query: string) => void;
// //   onFilterChange?: (range: string) => void;
// //   selectedRange?: DateRangeKey;
// // }

// // type NotificationItem = {
// //   _id: string;
// //   adminId: string;
// //   HotelId: string;
// //   title: string;
// //   message: string;
// //   moduleName?: string;
// //   link?: string;
// //   isRead: boolean;
// //   createdAt: string;
// // };

// // const INVOICE_ID = '68c8fba6e1c648fdbb63d281';

// // export default function Navbar({
// //   active,
// //   className,
// //   onFilterChange,
// //   selectedRange = 'today'
// // }: navProps) {
// //   const [open, setOpen] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [notificationsOpen, setNotificationsOpen] = useState(false);

// //   // Pagination state
// //   const [page, setPage] = useState(1);
// //   const PAGE_SIZE = 7;
// //   const [hasNextPage, setHasNextPage] = useState(false);

// //   // Notifications
// //   const [notifications, setNotifications] = useState<NotificationItem[]>([]);

// //   const admin = getSessionStorageItem<any>('admin');

// //   const ranges: Record<DateRangeKey, string> = {
// //     today: 'Today',
// //     lastWeek: 'Last Week',
// //     lastMonth: 'Last Month',
// //     lastQuarter: 'Last Quarter',
// //     lastYear: 'Last Year'
// //   };

// //   // -------- Invoice render target --------
// //   const invoiceRef = useRef<HTMLDivElement>(null);
// //   const [invoiceProps, setInvoiceProps] = useState<InvoiceExactProps | null>(
// //     null
// //   );

// //   const fmtDateTime = (iso?: string) =>
// //     iso ? new Date(iso).toLocaleString() : '-';

// //   const mapSubscriptionApiToInvoice = (d: any): InvoiceExactProps => {
// //     const firstCharge = (d.charges ?? [])[0] || {};
// //     const months = Number(firstCharge.duration) || 0;

// //     // Build the rows for the table
// //     const items = (d.charges ?? []).map((c: any) => ({
// //       description: c.description,
// //       rate: Number(c.rate) || 0,
// //       qty: Number(c.duration) || 1,
// //       total: Number(c.total) || 0
// //     }));

// //     return {
// //       // Hotel header
// //       hotelName: d.hotelName || '-',
// //       hotelAddress: d.hotelAddress || '-',
// //       hotelPhone: d.hotelPhone || '-',
// //       hotelEmail: d.hotelEmail || '-',
// //       gstin: d.hotelGST || '-',
// //       pan: d.hotelPAN || '-',

// //       // Ack / Invoice
// //       ackNo: d.irn || '-', // API doesn’t include separate ack — using IRN as identifier
// //       ackDate: '', // not provided
// //       irnNo: d.irn || '-',
// //       invoiceNo: d.invoiceNo || 'INV',

// //       // Map to the exact layout fields
// //       guestName: d.subscriptionPlan || '-', // shown where “Guest Name” appears
// //       address: d.hotelAddress || '-', // shown under Address
// //       bookingThrough: d.couponCode || '-', // shown where “Booking through”
// //       mobile: d.hotelPhone || '-',

// //       arrival: fmtDateTime(d.subsctiptionStart), // shown where “Arrival Date”
// //       departure: fmtDateTime(d.subscriptionEnd), // shown where “Departure Date”
// //       pax: months || 1, // shown where “No. of Pax”
// //       guestGstin: d.hotelGST || '-', // shown under Mobile

// //       items,
// //       sgst: Number(d.sgstAmount) || 0,
// //       cgst: Number(d.cgstAmount) || 0,
// //       total: Number(d.grandTotal) || 0,
// //       amountWords: d.inWords || '-'
// //     };
// //   };

// //   const fetchInvoice = useCallback(async () => {
// //     const res = await apiCall(
// //       'GET',
// //       `/api/invoice/subscription/${INVOICE_ID}`,
// //       {}
// //     );
// //     if (!res?.success || !res?.data)
// //       throw new Error('Failed to fetch invoice.');
// //     const mapped = mapSubscriptionApiToInvoice(res.data);
// //     setInvoiceProps(mapped);
// //     return mapped;
// //   }, []);

// //   // -------- Notifications ----------
// //   const fetchNotifications = useCallback(
// //     async (pageToFetch: number = page) => {
// //       try {
// //         setLoading(true);
// //         const response = await apiCall(
// //           'GET',
// //           `/api/notification?page=${pageToFetch}&limit=${PAGE_SIZE}`,
// //           {}
// //         );
// //         if (response?.success) {
// //           const items: NotificationItem[] = response.notifications ?? [];
// //           setNotifications(items);
// //           setHasNextPage(items.length === PAGE_SIZE);
// //         }
// //       } catch (error) {
// //         console.error('Error fetching notifications:', error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     },
// //     [PAGE_SIZE, page]
// //   );

// //   useEffect(() => {
// //     fetchNotifications(1);
// //   }, [fetchNotifications]);

// //   useEffect(() => {
// //     if (notificationsOpen) fetchNotifications(page);
// //   }, [notificationsOpen, page, fetchNotifications]);

// //   const handleBellClick = async () => {
// //     try {
// //       await fetchNotifications(page);
// //     } finally {
// //       setNotificationsOpen(true);
// //     }
// //   };

// //   const firstLetter = admin?.user?.name
// //     ? admin.user.name.charAt(0).toUpperCase()
// //     : 'H';

// //   const handleLogout = () => {
// //     sessionStorage.removeItem('token');
// //     document.cookie = 'token=; Max-Age=0; path=/';
// //     window.location.href = '/';
// //   };

// //   const unreadCount = notifications.filter((n) => !n.isRead).length;

// //   const markAsRead = async (id: string) => {
// //     try {
// //       setNotifications((prev) =>
// //         prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
// //       );
// //       await apiCall('GET', `/api/notification/markRead/${id}`, {});
// //     } catch (err) {
// //       console.error('Failed to mark as read:', err);
// //       setNotifications((prev) =>
// //         prev.map((n) => (n._id === id ? { ...n, isRead: false } : n))
// //       );
// //     }
// //   };

// //   const handleNotificationClick = async (n: NotificationItem) => {
// //     await markAsRead(n._id);
// //     if (n.link) window.location.href = n.link;
// //   };

// //   const goPrev = async () => {
// //     if (page > 1) {
// //       const newPage = page - 1;
// //       setPage(newPage);
// //       await fetchNotifications(newPage);
// //     }
// //   };

// //   const goNext = async () => {
// //     if (hasNextPage) {
// //       const newPage = page + 1;
// //       setPage(newPage);
// //       await fetchNotifications(newPage);
// //     }
// //   };

// //   // -------- PDF export ----------
// //   const handleInvoicePdf = async () => {
// //     try {
// //       const current = invoiceProps ?? (await fetchInvoice());
// //       // wait a frame for the hidden component to render with data
// //       await new Promise((r) => requestAnimationFrame(() => r(null)));

// //       const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
// //         import('html2canvas'),
// //         import('jspdf')
// //       ]);

// //       const el = invoiceRef.current;
// //       if (!el) return;

// //       const canvas = await html2canvas(el, {
// //         scale: 2,
// //         useCORS: true,
// //         backgroundColor: '#ffffff',
// //         logging: false,
// //         windowWidth: el.scrollWidth,
// //         windowHeight: el.scrollHeight
// //       });

// //       const img = canvas.toDataURL('image/png');
// //       const pdf = new jsPDF('p', 'pt', 'a4');

// //       const pageW = pdf.internal.pageSize.getWidth(); // 595.28pt
// //       const pageH = pdf.internal.pageSize.getHeight(); // 841.89pt
// //       const margin = 24; // pt
// //       const usableW = pageW - margin * 2;

// //       const imgW = usableW;
// //       const imgH = (canvas.height * imgW) / canvas.width;

// //       // Multi-page clip
// //       let remaining = imgH;
// //       let shift = 0;
// //       while (remaining > 0) {
// //         pdf.addImage(
// //           img,
// //           'PNG',
// //           margin,
// //           margin - shift,
// //           imgW,
// //           imgH,
// //           undefined,
// //           'FAST'
// //         );
// //         remaining -= pageH - margin * 2;
// //         if (remaining > 0) {
// //           pdf.addPage();
// //           shift += pageH - margin * 2;
// //         }
// //       }

// //       pdf.save(
// //         `${current.invoiceNo || 'Invoice'}_${new Date().toISOString().slice(0, 10)}.pdf`
// //       );
// //     } catch (e) {
// //       console.error(e);
// //     }
// //   };

// //   return (
// //     <>
// //       {/* Hidden/off-screen invoice to capture */}
// //       <div
// //         aria-hidden
// //         className="fixed -left-[99999px] -top-[99999px] pointer-events-none select-none"
// //       >
// //         {invoiceProps && (
// //           <InvoiceExactA4
// //             ref={invoiceRef}
// //             {...invoiceProps}
// //             logoSrc="/Frame.svg"
// //           />
// //         )}
// //       </div>

// //       <AlertModal
// //         isOpen={open}
// //         onCloseAction={() => setOpen(false)}
// //         onConfirmAction={handleLogout}
// //         loading={loading}
// //         description="You will be logged out"
// //       />

// //       {/* Notifications panel */}
// //       <div
// //         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end transition-transform duration-300 ease-in-out ${
// //           notificationsOpen ? 'translate-x-0' : 'translate-x-full'
// //         } z-50`}
// //       >
// //         <div
// //           className="w-[400px] h-full p-6 overflow-y-auto rounded-lg"
// //           style={{
// //             backgroundImage: 'url("/sky.png")',
// //             backgroundSize: 'cover',
// //             backgroundPosition: 'center'
// //           }}
// //         >
// //           <div className="flex items-center justify-between mb-4">
// //             <h3 className="text-lg font-semibold text-white">Notifications</h3>
// //             <div className="flex items-center gap-2">
// //               <Button
// //                 onClick={() => fetchNotifications(page)}
// //                 className="btn-secondary backdrop-blur-lg hover:scale-105 transition-transform duration-200"
// //                 disabled={loading}
// //                 title="Refresh"
// //               >
// //                 <RotateCcw className="w-4 h-4 mr-2" />
// //                 {loading ? 'Refreshing...' : 'Refresh'}
// //               </Button>
// //               <Button
// //                 onClick={() => setNotificationsOpen(false)}
// //                 className="btn-secondary backdrop-blur-lg hover:scale-105 transition-transform duration-200"
// //               >
// //                 Close
// //               </Button>
// //             </div>
// //           </div>

// //           <div className="flex items-center justify-between mb-3">
// //             <div className="text-white/80 text-sm">
// //               Page <span className="font-semibold text-white">{page}</span>
// //             </div>
// //             <div className="flex items-center gap-2">
// //               <Button
// //                 onClick={goPrev}
// //                 disabled={page === 1 || loading}
// //                 className="btn-secondary px-2 py-1"
// //                 title="Previous"
// //               >
// //                 <ChevronLeft className="w-4 h-4" />
// //               </Button>
// //               <Button
// //                 onClick={goNext}
// //                 disabled={!hasNextPage || loading}
// //                 className="btn-secondary px-2 py-1"
// //                 title="Next"
// //               >
// //                 <ChevronRight className="w-4 h-4" />
// //               </Button>
// //             </div>
// //           </div>

// //           <div className="space-y-3">
// //             {loading && notifications.length === 0 ? (
// //               <p className="text-sm text-white/80">Loading...</p>
// //             ) : notifications.length > 0 ? (
// //               notifications.map((n) => (
// //                 <div
// //                   key={n._id}
// //                   className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer backdrop-blur-sm transition-transform duration-200 hover:scale-[1.02] ${
// //                     n.isRead
// //                       ? 'bg-white/10 border-white/20 opacity-80'
// //                       : 'bg-white/20 border-white/40'
// //                   }`}
// //                   onClick={() => handleNotificationClick(n)}
// //                 >
// //                   <div className="relative">
// //                     {!n.isRead && (
// //                       <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
// //                     )}
// //                     <div className="bg-yellow-200 p-2 rounded-full">
// //                       <span className="text-xs text-gray-600">⚠️</span>
// //                     </div>
// //                   </div>

// //                   <div className="flex-1 min-w-0">
// //                     <p className="text-sm text-white truncate">{n.title}</p>
// //                     <p className="text-xs text-white/90 truncate">
// //                       {n.message}
// //                     </p>
// //                     <p className="text-[10px] text-white/70 mt-0.5">
// //                       {new Date(n.createdAt).toLocaleString()}
// //                     </p>
// //                   </div>
// //                 </div>
// //               ))
// //             ) : (
// //               <p className="text-sm text-white/80">No notifications</p>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Top Nav */}
// //       <nav
// //         className={`flex items-center w-full justify-between bg-[#EFE9DF] p-4 lg:w-[calc(100%-20%)] fixed z-[20] ${className}`}
// //       >
// //         {/* Left */}
// //         <div className="flex items-center gap-2 px-2 rounded-lg">
// //           {active && (
// //             <div className="border-2 flex gap-3 w-fit rounded-lg border-[#FAF7F2]">
// //               <Button className="p-0 bg-transparent ml-2 border-none shadow-none focus:ring-0 hover:bg-transparent">
// //                 <Filter
// //                   height={20}
// //                   width={20}
// //                   className="text-button-dark fill-coffee"
// //                 />
// //               </Button>

// //               <DropdownMenu>
// //                 <DropdownMenuTrigger asChild>
// //                   <Button className="bg-[#FAF7F2] rounded-l-none text-[#362913] font-semibold hover:bg-coffee/90 hover:text-[#FAF7F2] duration-150 ease-in-out">
// //                     {ranges[selectedRange] || 'Today'}
// //                   </Button>
// //                 </DropdownMenuTrigger>
// //                 <DropdownMenuContent
// //                   className="w-48 bg-[#FAF7F2] text-[#362913]"
// //                   side="bottom"
// //                   align="start"
// //                 >
// //                   {Object.entries(ranges).map(([key, label]) => (
// //                     <DropdownMenuItem
// //                       key={key}
// //                       onClick={() => onFilterChange?.(key as DateRangeKey)}
// //                     >
// //                       {label}
// //                     </DropdownMenuItem>
// //                   ))}
// //                 </DropdownMenuContent>
// //               </DropdownMenu>
// //             </div>
// //           )}
// //         </div>

// //         {/* Right */}
// //         <div className="flex items-center gap-4">
// //           <div className="relative">
// //             <Bell
// //               className="w-7 h-7 text-button-dark cursor-pointer hover:text-button-light"
// //               onClick={handleBellClick}
// //             />
// //             {unreadCount > 0 && (
// //               <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
// //                 {unreadCount}
// //               </span>
// //             )}
// //           </div>

// //           <DropdownMenu>
// //             <DropdownMenuTrigger asChild>
// //               <Button variant="ghost" className="relative h-8 w-8 rounded-full">
// //                 <div className="flex items-center">
// //                   <div className="flex items-center justify-center w-8 h-8 rounded-full btn-primary text-white">
// //                     <span suppressHydrationWarning>
// //                       {(admin?.user?.name || 'H')[0].toUpperCase()}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </Button>
// //             </DropdownMenuTrigger>

// //             <DropdownMenuContent className="w-56" align="end" forceMount>
// //               <DropdownMenuLabel className="font-normal">
// //                 <div className="flex flex-col space-y-1">
// //                   <p className="text-sm font-medium leading-none">
// //                     {admin?.user?.name}
// //                   </p>
// //                   <p className="text-xs leading-none text-muted-foreground">
// //                     {admin?.user?.email}
// //                   </p>
// //                 </div>
// //               </DropdownMenuLabel>

// //               <DropdownMenuSeparator />

// //               {/* Download Subscription Invoice above Logout */}
// //               <DropdownMenuItem
// //                 onClick={async () => {
// //                   if (!invoiceProps) await fetchInvoice();
// //                   handleInvoicePdf();
// //                 }}
// //               >
// //                 <Download className="mr-2 h-4 w-4" />
// //                 Download Invoice (PDF)
// //                 <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
// //               </DropdownMenuItem>

// //               <DropdownMenuSeparator />

// //               <DropdownMenuItem onClick={() => setOpen(true)}>
// //                 Log out
// //                 <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
// //               </DropdownMenuItem>
// //             </DropdownMenuContent>
// //           </DropdownMenu>
// //         </div>
// //       </nav>
// //     </>
// //   );
// // }
// 'use client';

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { Button } from '@/components/ui/button';
// import {
//   Bell,
//   Filter,
//   ChevronLeft,
//   ChevronRight,
//   RotateCcw,
//   Download
// } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuTrigger
// } from './ui/dropdown-menu';
// import { AlertModal } from './modal/alert-modal';
// import { getSessionStorageItem } from 'utils/localstorage';
// import apiCall from '@/lib/axios';
// import InvoiceExactA4, { InvoiceExactProps } from 'app/(protected)/invoice';

// export type DateRangeKey =
//   | 'today'
//   | 'lastWeek'
//   | 'lastMonth'
//   | 'lastQuarter'
//   | 'lastYear';

// export interface navProps {
//   active?: boolean;
//   search?: boolean;
//   searchKey?: string;
//   className?: string;
//   onSearch?: (query: string) => void;
//   onFilterChange?: (range: string) => void;
//   selectedRange?: DateRangeKey;
// }

// type NotificationItem = {
//   _id: string;
//   adminId: string;
//   HotelId: string;
//   title: string;
//   message: string;
//   moduleName?: string;
//   link?: string;
//   isRead: boolean;
//   createdAt: string;
// };

// const INVOICE_ID = '68c8fba6e1c648fdbb63d281';

// export default function Navbar({
//   active,
//   className,
//   onFilterChange,
//   selectedRange = 'today'
// }: navProps) {
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [notificationsOpen, setNotificationsOpen] = useState(false);

//   // Pagination state
//   const [page, setPage] = useState(1);
//   const PAGE_SIZE = 7;
//   const [hasNextPage, setHasNextPage] = useState(false);

//   // Notifications
//   const [notifications, setNotifications] = useState<NotificationItem[]>([]);

//   const admin = getSessionStorageItem<any>('admin');

//   const ranges: Record<DateRangeKey, string> = {
//     today: 'Today',
//     lastWeek: 'Last Week',
//     lastMonth: 'Last Month',
//     lastQuarter: 'Last Quarter',
//     lastYear: 'Last Year'
//   };

//   // -------- Invoice render target --------
//   const invoiceRef = useRef<HTMLDivElement>(null);
//   const [invoiceProps, setInvoiceProps] = useState<InvoiceExactProps | null>(
//     null
//   );

//   const fmtDateTime = (iso?: string) =>
//     iso ? new Date(iso).toLocaleString() : '-';

//   // Map Subscription API -> NEW InvoiceExactProps (KNECT details are hardcoded in component)
//   const mapSubscriptionApiToInvoice = (d: any): InvoiceExactProps => {
//     const items = (d.charges ?? []).map((c: any) => ({
//       description: c.description,
//       rate: Number(c.rate) || 0,
//       qty: Number(c.duration) || 1,
//       total: Number(c.total) || 0
//     }));

//     return {
//       ackNo: d.irn || '-',
//       ackDate: '', // not provided by API
//       irnNo: d.irn || '-',
//       invoiceNo: d.invoiceNo || 'INV',

//       bookingThrough: d.couponCode || '-', // shown in right column
//       mobile: d.hotelPhone || '—', // left column under "Mobile No."

//       arrival: fmtDateTime(d.subsctiptionStart), // Subscription Start Date
//       departure: fmtDateTime(d.subscriptionEnd), // Subscription End Date

//       items,
//       sgst: Number(d.sgstAmount) || 0,
//       cgst: Number(d.cgstAmount) || 0,
//       total: Number(d.grandTotal) || 0,
//       amountWords: d.inWords || '-'
//       // logoSrc can be passed when rendering (we do that below)
//     };
//   };

//   const fetchInvoice = useCallback(async () => {
//     const res = await apiCall(
//       'GET',
//       `/api/invoice/subscription/${INVOICE_ID}`,
//       {}
//     );
//     if (!res?.success || !res?.data)
//       throw new Error('Failed to fetch invoice.');
//     const mapped = mapSubscriptionApiToInvoice(res.data);
//     setInvoiceProps(mapped);
//     return mapped;
//   }, []);

//   // -------- Notifications ----------
//   const fetchNotifications = useCallback(
//     async (pageToFetch: number = page) => {
//       try {
//         setLoading(true);
//         const response = await apiCall(
//           'GET',
//           `/api/notification?page=${pageToFetch}&limit=${PAGE_SIZE}`,
//           {}
//         );
//         if (response?.success) {
//           const items: NotificationItem[] = response.notifications ?? [];
//           setNotifications(items);
//           setHasNextPage(items.length === PAGE_SIZE);
//         }
//       } catch (error) {
//         console.error('Error fetching notifications:', error);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [PAGE_SIZE, page]
//   );

//   useEffect(() => {
//     fetchNotifications(1);
//   }, [fetchNotifications]);

//   useEffect(() => {
//     if (notificationsOpen) fetchNotifications(page);
//   }, [notificationsOpen, page, fetchNotifications]);

//   const handleBellClick = async () => {
//     try {
//       await fetchNotifications(page);
//     } finally {
//       setNotificationsOpen(true);
//     }
//   };

//   const firstLetter = admin?.user?.name
//     ? admin.user.name.charAt(0).toUpperCase()
//     : 'H';

//   const handleLogout = () => {
//     sessionStorage.removeItem('token');
//     document.cookie = 'token=; Max-Age=0; path=/';
//     window.location.href = '/';
//   };

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   const markAsRead = async (id: string) => {
//     try {
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
//       );
//       await apiCall('GET', `/api/notification/markRead/${id}`, {});
//     } catch (err) {
//       console.error('Failed to mark as read:', err);
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === id ? { ...n, isRead: false } : n))
//       );
//     }
//   };

//   const handleNotificationClick = async (n: NotificationItem) => {
//     await markAsRead(n._id);
//     if (n.link) window.location.href = n.link;
//   };

//   const goPrev = async () => {
//     if (page > 1) {
//       const newPage = page - 1;
//       setPage(newPage);
//       await fetchNotifications(newPage);
//     }
//   };

//   const goNext = async () => {
//     if (hasNextPage) {
//       const newPage = page + 1;
//       setPage(newPage);
//       await fetchNotifications(newPage);
//     }
//   };

//   // -------- PDF export ----------
//   const handleInvoicePdf = async () => {
//     try {
//       const current = invoiceProps ?? (await fetchInvoice());
//       // wait a frame for the hidden component to render with data
//       await new Promise((r) => requestAnimationFrame(() => r(null)));

//       const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
//         import('html2canvas'),
//         import('jspdf')
//       ]);

//       const el = invoiceRef.current;
//       if (!el) return;

//       const canvas = await html2canvas(el, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: '#ffffff',
//         logging: false,
//         windowWidth: el.scrollWidth,
//         windowHeight: el.scrollHeight
//       });

//       const img = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'pt', 'a4');

//       const pageW = pdf.internal.pageSize.getWidth(); // 595.28pt
//       const pageH = pdf.internal.pageSize.getHeight(); // 841.89pt
//       const margin = 24; // pt
//       const usableW = pageW - margin * 2;

//       const imgW = usableW;
//       const imgH = (canvas.height * imgW) / canvas.width;

//       // Multi-page clip
//       let remaining = imgH;
//       let shift = 0;
//       while (remaining > 0) {
//         pdf.addImage(
//           img,
//           'PNG',
//           margin,
//           margin - shift,
//           imgW,
//           imgH,
//           undefined,
//           'FAST'
//         );
//         remaining -= pageH - margin * 2;
//         if (remaining > 0) {
//           pdf.addPage();
//           shift += pageH - margin * 2;
//         }
//       }

//       pdf.save(
//         `${current.invoiceNo || 'Invoice'}_${new Date().toISOString().slice(0, 10)}.pdf`
//       );
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <>
//       {/* Hidden/off-screen invoice to capture */}
//       <div
//         aria-hidden
//         className="fixed -left-[99999px] -top-[99999px] pointer-events-none select-none"
//       >
//         {invoiceProps && (
//           <InvoiceExactA4
//             ref={invoiceRef}
//             {...invoiceProps}
//             logoSrc="/Frame.svg"
//           />
//         )}
//       </div>

//       <AlertModal
//         isOpen={open}
//         onCloseAction={() => setOpen(false)}
//         onConfirmAction={handleLogout}
//         loading={loading}
//         description="You will be logged out"
//       />

//       {/* Notifications panel */}
//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end transition-transform duration-300 ease-in-out ${
//           notificationsOpen ? 'translate-x-0' : 'translate-x-full'
//         } z-50`}
//       >
//         <div
//           className="w-[400px] h-full p-6 overflow-y-auto rounded-lg"
//           style={{
//             backgroundImage: 'url("/sky.png")',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center'
//           }}
//         >
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-white">Notifications</h3>
//             <div className="flex items-center gap-2">
//               <Button
//                 onClick={() => fetchNotifications(page)}
//                 className="btn-secondary backdrop-blur-lg hover:scale-105 transition-transform duration-200"
//                 disabled={loading}
//                 title="Refresh"
//               >
//                 <RotateCcw className="w-4 h-4 mr-2" />
//                 {loading ? 'Refreshing...' : 'Refresh'}
//               </Button>
//               <Button
//                 onClick={() => setNotificationsOpen(false)}
//                 className="btn-secondary backdrop-blur-lg hover:scale-105 transition-transform duration-200"
//               >
//                 Close
//               </Button>
//             </div>
//           </div>

//           <div className="flex items-center justify-between mb-3">
//             <div className="text-white/80 text-sm">
//               Page <span className="font-semibold text-white">{page}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 onClick={goPrev}
//                 disabled={page === 1 || loading}
//                 className="btn-secondary px-2 py-1"
//                 title="Previous"
//               >
//                 <ChevronLeft className="w-4 h-4" />
//               </Button>
//               <Button
//                 onClick={goNext}
//                 disabled={!hasNextPage || loading}
//                 className="btn-secondary px-2 py-1"
//                 title="Next"
//               >
//                 <ChevronRight className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>

//           <div className="space-y-3">
//             {loading && notifications.length === 0 ? (
//               <p className="text-sm text-white/80">Loading...</p>
//             ) : notifications.length > 0 ? (
//               notifications.map((n) => (
//                 <div
//                   key={n._id}
//                   className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer backdrop-blur-sm transition-transform duration-200 hover:scale-[1.02] ${
//                     n.isRead
//                       ? 'bg-white/10 border-white/20 opacity-80'
//                       : 'bg-white/20 border-white/40'
//                   }`}
//                   onClick={() => handleNotificationClick(n)}
//                 >
//                   <div className="relative">
//                     {!n.isRead && (
//                       <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
//                     )}
//                     <div className="bg-yellow-200 p-2 rounded-full">
//                       <span className="text-xs text-gray-600">⚠️</span>
//                     </div>
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm text-white truncate">{n.title}</p>
//                     <p className="text-xs text-white/90 truncate">
//                       {n.message}
//                     </p>
//                     <p className="text-[10px] text-white/70 mt-0.5">
//                       {new Date(n.createdAt).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-sm text-white/80">No notifications</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Top Nav */}
//       <nav
//         className={`flex items-center w-full justify-between bg-[#EFE9DF] p-4 lg:w-[calc(100%-20%)] fixed z-[20] ${className}`}
//       >
//         {/* Left */}
//         <div className="flex items-center gap-2 px-2 rounded-lg">
//           {active && (
//             <div className="border-2 flex gap-3 w-fit rounded-lg border-[#FAF7F2]">
//               <Button className="p-0 bg-transparent ml-2 border-none shadow-none focus:ring-0 hover:bg-transparent">
//                 <Filter
//                   height={20}
//                   width={20}
//                   className="text-button-dark fill-coffee"
//                 />
//               </Button>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button className="bg-[#FAF7F2] rounded-l-none text-[#362913] font-semibold hover:bg-coffee/90 hover:text-[#FAF7F2] duration-150 ease-in-out">
//                     {ranges[selectedRange] || 'Today'}
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent
//                   className="w-48 bg-[#FAF7F2] text-[#362913]"
//                   side="bottom"
//                   align="start"
//                 >
//                   {Object.entries(ranges).map(([key, label]) => (
//                     <DropdownMenuItem
//                       key={key}
//                       onClick={() => onFilterChange?.(key as DateRangeKey)}
//                     >
//                       {label}
//                     </DropdownMenuItem>
//                   ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           )}
//         </div>

//         {/* Right */}
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <Bell
//               className="w-7 h-7 text-button-dark cursor-pointer hover:text-button-light"
//               onClick={handleBellClick}
//             />
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
//                 {unreadCount}
//               </span>
//             )}
//           </div>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                 <div className="flex items-center">
//                   <div className="flex items-center justify-center w-8 h-8 rounded-full btn-primary text-white">
//                     <span suppressHydrationWarning>
//                       {(admin?.user?.name || 'H')[0].toUpperCase()}
//                     </span>
//                   </div>
//                 </div>
//               </Button>
//             </DropdownMenuTrigger>

//             <DropdownMenuContent className="w-56" align="end" forceMount>
//               <DropdownMenuLabel className="font-normal">
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium leading-none">
//                     {admin?.user?.name}
//                   </p>
//                   <p className="text-xs leading-none text-muted-foreground">
//                     {admin?.user?.email}
//                   </p>
//                 </div>
//               </DropdownMenuLabel>

//               <DropdownMenuSeparator />

//               {/* Download Subscription Invoice above Logout */}
//               <DropdownMenuItem
//                 onClick={async () => {
//                   if (!invoiceProps) await fetchInvoice();
//                   handleInvoicePdf();
//                 }}
//               >
//                 <Download className="mr-2 h-4 w-4" />
//                 Download Invoice (PDF)
//                 <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
//               </DropdownMenuItem>

//               <DropdownMenuSeparator />

//               <DropdownMenuItem onClick={() => setOpen(true)}>
//                 Log out
//                 <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </nav>
//     </>
//   );
// }
// 'use client';

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { Button } from '@/components/ui/button';
// import {
//   Bell,
//   Filter,
//   ChevronLeft,
//   ChevronRight,
//   RotateCcw,
//   Download
// } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuTrigger
// } from './ui/dropdown-menu';
// import { AlertModal } from './modal/alert-modal';
// import { getSessionStorageItem } from 'utils/localstorage';
// import apiCall from '@/lib/axios';

// // IMPORTANT: your invoice component with KNECT header hardcoded under logo
// import InvoiceExactA4, { InvoiceExactProps } from 'app/(protected)/invoice';

// export type DateRangeKey =
//   | 'today'
//   | 'lastWeek'
//   | 'lastMonth'
//   | 'lastQuarter'
//   | 'lastYear';

// export interface navProps {
//   active?: boolean;
//   search?: boolean;
//   searchKey?: string;
//   className?: string;
//   onSearch?: (query: string) => void;
//   onFilterChange?: (range: string) => void;
//   selectedRange?: DateRangeKey;
// }

// type NotificationItem = {
//   _id: string;
//   adminId: string;
//   HotelId: string;
//   title: string;
//   message: string;
//   moduleName?: string;
//   link?: string;
//   isRead: boolean;
//   createdAt: string;
// };

// const INVOICE_ID = '68c8fba6e1c648fdbb63d281';

// export default function Navbar({
//   active,
//   className,
//   onFilterChange,
//   selectedRange = 'today'
// }: navProps) {
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [notificationsOpen, setNotificationsOpen] = useState(false);

//   // Pagination state
//   const [page, setPage] = useState(1);
//   const PAGE_SIZE = 7;
//   const [hasNextPage, setHasNextPage] = useState(false);

//   // Notifications
//   const [notifications, setNotifications] = useState<NotificationItem[]>([]);

//   const admin = getSessionStorageItem<any>('admin');

//   const ranges: Record<DateRangeKey, string> = {
//     today: 'Today',
//     lastWeek: 'Last Week',
//     lastMonth: 'Last Month',
//     lastQuarter: 'Last Quarter',
//     lastYear: 'Last Year'
//   };

//   // -------- Invoice render target --------
//   const invoiceRef = useRef<HTMLDivElement>(null);
//   const [invoiceProps, setInvoiceProps] = useState<InvoiceExactProps | null>(
//     null
//   );

//   const fmtDateTime = (iso?: string) =>
//     iso ? new Date(iso).toLocaleString() : '-';

//   // Map Subscription API -> InvoiceExactProps
//   const mapSubscriptionApiToInvoice = (d: any): InvoiceExactProps => {
//     const items = (d.charges ?? []).map((c: any) => ({
//       description: c.description,
//       rate: Number(c.rate) || 0,
//       qty: Number(c.duration) || 1,
//       total: Number(c.total) || 0
//     }));
//     // ✅ Consistent date-time formatter (used for ackDate, arrival, departure, createdAt, etc.)
//     const fmtDateTime = (value?: string | number | Date) => {
//       if (value === undefined || value === null || value === '') return '-';

//       // Normalize to Date (supports ISO string, epoch (ms/sec), or Date)
//       let dt: Date;
//       if (value instanceof Date) {
//         dt = value;
//       } else if (typeof value === 'number') {
//         // Handle seconds vs milliseconds
//         dt = new Date(value > 1e12 ? value : value * 1000);
//       } else {
//         const parsed = new Date(value);
//         if (isNaN(parsed.getTime())) return String(value);
//         dt = parsed;
//       }

//       // Format like "08 Oct 2025, 02:15 PM" (India time)
//       return dt.toLocaleString('en-IN', {
//         timeZone: 'Asia/Kolkata',
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true
//       });
//     };

//     return {
//       // Ack / invoice
//       acknowledgementNumber: d.acknowledgementNumber || '-',
//       ackDate: fmtDateTime(d.acknowledgementDate),
//       irnNo: d.irn || '-',
//       invoiceNo: d.invoiceNo || 'INV',

//       // FROM API for the “Hotel Name / Address & Details” section
//       hotelName: d.hotelName || '-',
//       hotelAddress: d.hotelAddress || '-',
//       hotelPhone: d.hotelPhone || '—',
//       hotelEmail: d.hotelEmail || '—',
//       gstin: d.hotelGST || '—',
//       pan: d.hotelPAN || '—',

//       // other dynamic fields
//       bookingThrough: d.couponCode || '-',
//       mobile: d.hotelPhone || '—',
//       arrival: fmtDateTime(d.subsctiptionStart),
//       departure: fmtDateTime(d.subscriptionEnd),

//       items,
//       sgst: Number(d.sgstAmount) || 0,
//       cgst: Number(d.cgstAmount) || 0,
//       total: Number(d.grandTotal) || 0,
//       amountWords: d.inWords || '-'
//     };
//   };

//   const fetchInvoice = useCallback(async () => {
//     const res = await apiCall(
//       'GET',
//       `/api/invoice/subscription/${INVOICE_ID}`,
//       {}
//     );
//     if (!res?.success || !res?.data)
//       throw new Error('Failed to fetch invoice.');
//     const mapped = mapSubscriptionApiToInvoice(res.data);
//     setInvoiceProps(mapped);
//     return mapped;
//   }, []);

//   // -------- Notifications ----------
//   const fetchNotifications = useCallback(
//     async (pageToFetch: number = page) => {
//       try {
//         setLoading(true);
//         const response = await apiCall(
//           'GET',
//           `/api/notification?page=${pageToFetch}&limit=${PAGE_SIZE}`,
//           {}
//         );
//         if (response?.success) {
//           const items: NotificationItem[] = response.notifications ?? [];
//           setNotifications(items);
//           setHasNextPage(items.length === PAGE_SIZE);
//         }
//       } catch (error) {
//         console.error('Error fetching notifications:', error);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [PAGE_SIZE, page]
//   );

//   useEffect(() => {
//     fetchNotifications(1);
//   }, [fetchNotifications]);

//   useEffect(() => {
//     if (notificationsOpen) fetchNotifications(page);
//   }, [notificationsOpen, page, fetchNotifications]);

//   const handleBellClick = async () => {
//     try {
//       await fetchNotifications(page);
//     } finally {
//       setNotificationsOpen(true);
//     }
//   };

//   const firstLetter = admin?.user?.name
//     ? admin.user.name.charAt(0).toUpperCase()
//     : 'H';

//   const handleLogout = () => {
//     sessionStorage.removeItem('token');
//     document.cookie = 'token=; Max-Age=0; path=/';
//     window.location.href = '/';
//   };

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   const markAsRead = async (id: string) => {
//     try {
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
//       );
//       await apiCall('GET', `/api/notification/markRead/${id}`, {});
//     } catch (err) {
//       console.error('Failed to mark as read:', err);
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === id ? { ...n, isRead: false } : n))
//       );
//     }
//   };

//   const handleNotificationClick = async (n: NotificationItem) => {
//     await markAsRead(n._id);
//     if (n.link) window.location.href = n.link;
//   };

//   const goPrev = async () => {
//     if (page > 1) {
//       const newPage = page - 1;
//       setPage(newPage);
//       await fetchNotifications(newPage);
//     }
//   };

//   const goNext = async () => {
//     if (hasNextPage) {
//       const newPage = page + 1;
//       setPage(newPage);
//       await fetchNotifications(newPage);
//     }
//   };

//   // -------- PDF export ----------
//   const handleInvoicePdf = async () => {
//     try {
//       const current = invoiceProps ?? (await fetchInvoice());
//       // wait a frame for the hidden component to render with data
//       await new Promise((r) => requestAnimationFrame(() => r(null)));

//       const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
//         import('html2canvas'),
//         import('jspdf')
//       ]);

//       const el = invoiceRef.current;
//       if (!el) return;

//       const canvas = await html2canvas(el, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: '#ffffff',
//         logging: false,
//         windowWidth: el.scrollWidth,
//         windowHeight: el.scrollHeight
//       });

//       const img = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'pt', 'a4');

//       const pageW = pdf.internal.pageSize.getWidth(); // 595.28pt
//       const pageH = pdf.internal.pageSize.getHeight(); // 841.89pt
//       const margin = 24; // pt
//       const usableW = pageW - margin * 2;

//       const imgW = usableW;
//       const imgH = (canvas.height * imgW) / canvas.width;

//       // Multi-page clip
//       let remaining = imgH;
//       let shift = 0;
//       while (remaining > 0) {
//         pdf.addImage(
//           img,
//           'PNG',
//           margin,
//           margin - shift,
//           imgW,
//           imgH,
//           undefined,
//           'FAST'
//         );
//         remaining -= pageH - margin * 2;
//         if (remaining > 0) {
//           pdf.addPage();
//           shift += pageH - margin * 2;
//         }
//       }

//       pdf.save(
//         `${current.invoiceNo || 'Invoice'}_${new Date().toISOString().slice(0, 10)}.pdf`
//       );
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <>
//       {/* Hidden/off-screen invoice to capture */}
//       <div
//         aria-hidden
//         className="fixed -left-[99999px] -top-[99999px] pointer-events-none select-none"
//       >
//         {invoiceProps && (
//           <InvoiceExactA4
//             ref={invoiceRef}
//             {...invoiceProps}
//             logoSrc="/Frame.svg"
//           />
//         )}
//       </div>

//       <AlertModal
//         isOpen={open}
//         onCloseAction={() => setOpen(false)}
//         onConfirmAction={handleLogout}
//         loading={loading}
//         description="You will be logged out"
//       />

//       {/* Notifications panel */}
//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end transition-transform duration-300 ease-in-out ${
//           notificationsOpen ? 'translate-x-0' : 'translate-x-full'
//         } z-50`}
//       >
//         <div
//           className="w-[400px] h-full p-6 overflow-y-auto rounded-lg"
//           style={{
//             backgroundImage: 'url("/sky.png")',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center'
//           }}
//         >
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-white">Notifications</h3>
//             <div className="flex items-center gap-2">
//               <Button
//                 onClick={() => fetchNotifications(page)}
//                 className="btn-secondary backdrop-blur-lg hover:scale-105 transition-transform duration-200"
//                 disabled={loading}
//                 title="Refresh"
//               >
//                 <RotateCcw className="w-4 h-4 mr-2" />
//                 {loading ? 'Refreshing...' : 'Refresh'}
//               </Button>
//               <Button
//                 onClick={() => setNotificationsOpen(false)}
//                 className="btn-secondary backdrop-blur-lg hover:scale-105 transition-transform duration-200"
//               >
//                 Close
//               </Button>
//             </div>
//           </div>

//           <div className="flex items-center justify-between mb-3">
//             <div className="text-white/80 text-sm">
//               Page <span className="font-semibold text-white">{page}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 onClick={goPrev}
//                 disabled={page === 1 || loading}
//                 className="btn-secondary px-2 py-1"
//                 title="Previous"
//               >
//                 <ChevronLeft className="w-4 h-4" />
//               </Button>
//               <Button
//                 onClick={goNext}
//                 disabled={!hasNextPage || loading}
//                 className="btn-secondary px-2 py-1"
//                 title="Next"
//               >
//                 <ChevronRight className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>

//           <div className="space-y-3">
//             {loading && notifications.length === 0 ? (
//               <p className="text-sm text-white/80">Loading...</p>
//             ) : notifications.length > 0 ? (
//               notifications.map((n) => (
//                 <div
//                   key={n._id}
//                   className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer backdrop-blur-sm transition-transform duration-200 hover:scale-[1.02] ${
//                     n.isRead
//                       ? 'bg-white/10 border-white/20 opacity-80'
//                       : 'bg-white/20 border-white/40'
//                   }`}
//                   onClick={() => handleNotificationClick(n)}
//                 >
//                   <div className="relative">
//                     {!n.isRead && (
//                       <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
//                     )}
//                     <div className="bg-yellow-200 p-2 rounded-full">
//                       <span className="text-xs text-gray-600">⚠️</span>
//                     </div>
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm text-white truncate">{n.title}</p>
//                     <p className="text-xs text-white/90 truncate">
//                       {n.message}
//                     </p>
//                     <p className="text-[10px] text-white/70 mt-0.5">
//                       {new Date(n.createdAt).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-sm text-white/80">No notifications</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Top Nav */}
//       <nav
//         className={`flex items-center w-full justify-between bg-[#EFE9DF] p-4 lg:w-[calc(100%-20%)] fixed z-[20] ${className}`}
//       >
//         {/* Left */}
//         <div className="flex items-center gap-2 px-2 rounded-lg">
//           {active && (
//             <div className="border-2 flex gap-3 w-fit rounded-lg border-[#FAF7F2]">
//               <Button className="p-0 bg-transparent ml-2 border-none shadow-none focus:ring-0 hover:bg-transparent">
//                 <Filter
//                   height={20}
//                   width={20}
//                   className="text-button-dark fill-coffee"
//                 />
//               </Button>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button className="bg-[#FAF7F2] rounded-l-none text-[#362913] font-semibold hover:bg-coffee/90 hover:text-[#FAF7F2] duration-150 ease-in-out">
//                     {ranges[selectedRange] || 'Today'}
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent
//                   className="w-48 bg-[#FAF7F2] text-[#362913]"
//                   side="bottom"
//                   align="start"
//                 >
//                   {Object.entries(ranges).map(([key, label]) => (
//                     <DropdownMenuItem
//                       key={key}
//                       onClick={() => onFilterChange?.(key as DateRangeKey)}
//                     >
//                       {label}
//                     </DropdownMenuItem>
//                   ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           )}
//         </div>

//         {/* Right */}
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <Bell
//               className="w-7 h-7 text-button-dark cursor-pointer hover:text-button-light"
//               onClick={handleBellClick}
//             />
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
//                 {unreadCount}
//               </span>
//             )}
//           </div>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                 <div className="flex items-center">
//                   <div className="flex items-center justify-center w-8 h-8 rounded-full btn-primary text-white">
//                     <span suppressHydrationWarning>
//                       {(admin?.user?.name || 'H')[0].toUpperCase()}
//                     </span>
//                   </div>
//                 </div>
//               </Button>
//             </DropdownMenuTrigger>

//             <DropdownMenuContent className="w-56" align="end" forceMount>
//               <DropdownMenuLabel className="font-normal">
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium leading-none">
//                     {admin?.user?.name}
//                   </p>
//                   <p className="text-xs leading-none text-muted-foreground">
//                     {admin?.user?.email}
//                   </p>
//                 </div>
//               </DropdownMenuLabel>

//               <DropdownMenuSeparator />

//               {/* Download Subscription Invoice above Logout */}
//               {/* <DropdownMenuItem
//                 onClick={async () => {
//                   if (!invoiceProps) await fetchInvoice();
//                   handleInvoicePdf();
//                 }}
//               >
//                 <Download className="mr-2 h-4 w-4" />
//                 Download Invoice (PDF)
//                 <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
//               </DropdownMenuItem> */}

//               <DropdownMenuSeparator />

//               <DropdownMenuItem onClick={() => setOpen(true)}>
//                 Log out
//                 <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </nav>
//     </>
//   );
// }
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

// IMPORTANT: your invoice component with KNECT header hardcoded under logo
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

  // Pagination state
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 7;
  const [hasNextPage, setHasNextPage] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const admin = getSessionStorageItem<any>('admin');

  // -------- Invoice render target --------
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [invoiceProps, setInvoiceProps] = useState<InvoiceExactProps | null>(
    null
  );

  const fmtDateTime = (iso?: string) =>
    iso ? new Date(iso).toLocaleString() : '-';

  // Map Subscription API -> InvoiceExactProps
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

  // -------- Notifications ----------
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
        // Provide clearer, non-throwing handling so the UI stays usable
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

  // -------- PDF export ----------
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
      {/* Hidden/off-screen invoice to capture */}
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

      {/* Notifications panel */}
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

      {/* Top Nav (no date filter here) */}
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

              {/* Download invoice (optional - keep commented if not needed) */}
              {/* <DropdownMenuItem
                onClick={async () => {
                  if (!invoiceProps) await fetchInvoice();
                  handleInvoicePdf();
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Invoice (PDF)
                <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
              </DropdownMenuItem> */}

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

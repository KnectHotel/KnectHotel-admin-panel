// // // 'use client';
// // // import '../globals.css';
// // // import Link from 'next/link';
// // // import { LogOut, Users, Landmark, Component, Ticket } from 'lucide-react';
// // // import Providers from '../providers';
// // // import { NavItem } from '../nav-item';
// // // import logo from '../../public/assets/logo.svg';
// // // import Image from 'next/image';
// // // import { useState, useEffect } from 'react';
// // // import { usePathname } from 'next/navigation';
// // // import { RiAdminLine } from 'react-icons/ri';
// // // import { BsPersonWorkspace } from 'react-icons/bs';
// // // import { RiMoneyRupeeCircleLine } from 'react-icons/ri';
// // // import { VscSettings } from 'react-icons/vsc';
// // // import { TbPasswordUser } from 'react-icons/tb';
// // // import { MdDashboardCustomize } from 'react-icons/md';
// // // import { IoIosPeople } from 'react-icons/io';
// // // import { ImManWoman } from 'react-icons/im';
// // // import { MdManageAccounts } from 'react-icons/md';
// // // import { IoMdNotificationsOutline } from 'react-icons/io';
// // // import { Menu, X } from 'lucide-react';
// // // import { MdAnalytics } from 'react-icons/md';
// // // import { MdOutlineSubscriptions } from 'react-icons/md';
// // // import { getSessionStorageItem, setSessionStorageItem } from 'utils/localstorage';

// // // export default function RootLayout({
// // //   children
// // // }: {
// // //   children: React.ReactNode;
// // // }) {
// // //   const pathname = usePathname();
// // //   const isSuperAdminRoute = pathname.startsWith('/super-admin');
// // //   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar

// // //   const toggleSidebar = () => {
// // //     setIsSidebarOpen((prev) => !prev);
// // //   };

// // //   return (
// // //     <Providers>
// // //       <div className="flex w-full overflow-hidden min-h-screen">
// // //         {/* Sidebar: Hidden on lg and below, shown when toggled */}
// // //         <div
// // //           className={`lg:w-[20%] fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out transform ${
// // //             isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
// // //           } lg:translate-x-0 lg:static z-50`}
// // //         >
// // //           {isSuperAdminRoute ? (
// // //             <SuperAdminPanelSideNav />
// // //           ) : (
// // //             <HotelPanelSideNav />
// // //           )}
// // //         </div>

// // //         {/* Main Content */}
// // //         <div
// // //           className={`w-full lg:w-[80%] flex flex-col h-screen overflow-hidden transition-all duration-300`}
// // //         >
// // //           {/* Header with Toggle Button */}
// // //           <header className="lg:hidden flex items-center justify-between p-4 bg-coffeeLight">
// // //             <Link
// // //               href={isSuperAdminRoute ? '/super-admin/dashboard' : '/dashboard'}
// // //             >
// // //               <Image loading="lazy" src={logo} alt="Logo" className="h-8" />
// // //             </Link>
// // //             <button onClick={toggleSidebar} aria-label="Toggle Sidebar">
// // //               {isSidebarOpen ? (
// // //                 <X className="h-6 w-6 text-goldenYellow/80" />
// // //               ) : (
// // //                 <Menu className="h-6 w-6 text-goldenYellow/80" />
// // //               )}
// // //             </button>
// // //           </header>

// // //           <main className="overflow-y-auto flex items-start w-full md:gap-4 hide-scrollbar">
// // //             {children}
// // //           </main>
// // //         </div>

// // //         {/* Overlay for mobile when sidebar is open */}
// // //         {isSidebarOpen && (
// // //           <div
// // //             className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
// // //             onClick={toggleSidebar}
// // //           ></div>
// // //         )}
// // //       </div>
// // //     </Providers>
// // //   );
// // // }

// // // function SuperAdminPanelSideNav() {
// // //   const [adminData, setAdminData] = useState<any>(null);
// // //   const [openHotelSubMenu, setOpenHotelSubMenu] = useState(false);

// // //   useEffect(() => {
// // //     // This runs only on the client
// // //     setAdminData(getSessionStorageItem<any>('admin'));
// // //   }, []);

// // //   // Until adminData is loaded, render nothing or a loading state
// // //   if (!adminData) return null;

// // //   const allowedModules: string[] = adminData?.allowedModules || [];
// // //   const isSuperAdmin = adminData?.isSuperAdmin === true;
// // //   const permissions: string[] = adminData?.permissions || [];
// // //   const hasAllAccess = permissions.includes('all');

// // //   const hasAccess = (moduleName: string) => {
// // //     return isSuperAdmin || hasAllAccess || allowedModules.includes(moduleName);
// // //   };

// // //   return (
// // //     <aside className="flex flex-col py-14 lg:py-2 2xl:py-4 h-screen p-4 pb-0 bg-coffeeLight z-40">
// // //       <nav className="flex flex-col gap-4 items-center overflow-y-auto hide-scrollbar">
// // //         <Link
// // //           href="/super-admin/dashboard"
// // //           className="flex items-center gap-4 p-2 text-lg lg:text-xl font-semibold"
// // //         >
// // //           <Image loading="lazy" src={logo} alt="HandyMan" />
// // //         </Link>

// // //         <div className="sidebar-menu h-screen w-full p-4 mb-2 rounded-2xl flex flex-col gap-3">
// // //           <NavItem
// // //             href="/super-admin/dashboard"
// // //             label="Dashboard"
// // //             disabled={!hasAccess('dashboard')}
// // //           >
// // //             <MdDashboardCustomize className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>

// // //           <NavItem
// // //             href="/super-admin/roles-and-permissions"
// // //             label="Roles & Permission"
// // //             disabled={!hasAccess('roles-and-permissions')}
// // //           >
// // //             <BsPersonWorkspace className="h-4 w-4 lg:h-5 lg:w-5" />
// // //           </NavItem>

// // //           <NavItem
// // //             href="/super-admin/admin-management"
// // //             label="Admin Management"
// // //             disabled={!hasAccess('admin-management')}
// // //           >
// // //             <RiAdminLine className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>

// // //           <NavItem
// // //             href="/super-admin/guest-management"
// // //             label="Guest Management"
// // //             disabled={!hasAccess('guest-management')}
// // //           >
// // //             <Users className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>

// // //           <NavItem
// // //             href="/super-admin/subscription-management"
// // //             label="Manage Subscription"
// // //             disabled={!hasAccess('subscription-management')}
// // //           >
// // //             <MdOutlineSubscriptions className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>

// // //           <NavItem
// // //             href="/super-admin/complaint-management"
// // //             label="Complaint Management"
// // //             disabled={!hasAccess('complaint-management')}
// // //           >
// // //             <VscSettings className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>

// // //           <NavItem
// // //             href="/super-admin/coupon-management"
// // //             label="Coupon Management"
// // //             disabled={!hasAccess('coupons-management')}
// // //           >
// // //             <Ticket className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>

// // //           <NavItem
// // //             href="/super-admin/refund-management"
// // //             label="Refunds Management"
// // //             disabled={!hasAccess('refund-management')}
// // //           >
// // //             <RiMoneyRupeeCircleLine className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>

// // //           <NavItem href="/super-admin/change-password" label="Change Password">
// // //             <TbPasswordUser className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>

// // //           <div className="rounded-lg">
// // //             <div onClick={() => setOpenHotelSubMenu((prev) => !prev)}>
// // //               <NavItem
// // //                 href="/super-admin/hotel-management"
// // //                 label="Hotel Management"
// // //                 disabled={!hasAccess('hotel-management')}
// // //               >
// // //                 <Landmark className="h-5 w-5 lg:h-6 lg:w-6" />
// // //               </NavItem>
// // //             </div>
// // //             <div
// // //               className={`pl-4 mt-1 overflow-hidden transition-all duration-300 ease-in-out ${
// // //                 openHotelSubMenu ? 'max-h-screen' : 'max-h-0'
// // //               }`}
// // //             >
// // //               <NavItem
// // //                 href="/super-admin/sub_hotel-management"
// // //                 label="Sub-Hotel Management"
// // //               >
// // //                 <div className="h-2 w-2 lg:h-3 lg:w-3 bg-brown rounded-full" />
// // //               </NavItem>
// // //             </div>
// // //           </div>

// // //           <NavItem
// // //             href="/super-admin/analytics-reports"
// // //             label="Analytics & Reports"
// // //             disabled={!hasAccess('analytics-reports')}
// // //           >
// // //             <MdAnalytics className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>

// // //           <NavItem href="/logout" label="Logout">
// // //             <LogOut className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>
// // //         </div>
// // //       </nav>
// // //     </aside>
// // //   );
// // // }

// // // function HotelPanelSideNav() {
// // //   const [adminData, setAdminData] = useState<any>(null);

// // //   useEffect(() => {
// // //     setAdminData(getSessionStorageItem<any>('admin'));
// // //   }, []);

// // //   if (!adminData) return null;

// // //   const allowedModules: string[] = adminData?.allowedModules || [];
// // //   const isSuperAdmin = adminData?.isSuperAdmin === true;
// // //   const permissions: string[] = adminData?.permissions || [];
// // //   const hasAllAccess = permissions.includes('all');

// // //   const hasAccess = (moduleName: string) => {
// // //     return isSuperAdmin || hasAllAccess || allowedModules.includes(moduleName);
// // //   };

// // //   return (
// // //     <aside className="flex flex-col py-14 lg:py-2 2xl:py-4 h-screen p-4 pb-0 bg-coffeeLight z-40">
// // //       <nav className="flex flex-col gap-4 items-center overflow-y-auto hide-scrollbar">
// // //         <Link
// // //           href="/hotel-panel/dashboard"
// // //           className="flex items-center gap-4 p-2 text-lg lg:text-xl font-semibold"
// // //         >
// // //           <Image loading="lazy" src={logo} alt="KNECTHOTEL" />
// // //         </Link>

// // //         <div className="sidebar-menu h-screen w-full p-4 mb-2 rounded-2xl flex flex-col gap-3">
// // //           <NavItem
// // //             href="/hotel-panel/dashboard"
// // //             label="Dashboard"
// // //             disabled={!hasAccess('dashboard')}
// // //           >
// // //             <MdDashboardCustomize className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>

// // //           <NavItem
// // //             href="/hotel-panel/roles-permission"
// // //             label="Roles & Permission"
// // //             disabled={!hasAccess('roles-and-permissions')}
// // //           >
// // //             <BsPersonWorkspace className="h-4 w-4 lg:h-5 lg:w-5" />
// // //           </NavItem>

// // //           <NavItem
// // //             href="/hotel-panel/employee-management"
// // //             label="Employee Management"
// // //             disabled={!hasAccess('admin-management')}
// // //           >
// // //             <IoIosPeople className="h-6 w-6 lg:h-7 lg:w-7" />
// // //           </NavItem>

// // //           <NavItem
// // //             href="/hotel-panel/guest-management"
// // //             label="Guest Management"
// // //             disabled={!hasAccess('guest-management')}
// // //           >
// // //             <ImManWoman className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>

// // //           <NavItem
// // //             href="/hotel-panel/service-management"
// // //             label="Service Management"
// // //             // disabled={!hasAccess('service-management')}
// // //           >
// // //             <MdManageAccounts className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>

// // //           <NavItem
// // //             href="/hotel-panel/complaint-management"
// // //             label="Complaint Management"
// // //             disabled={!hasAccess('complaint-management')}
// // //           >
// // //             <VscSettings className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>

// // //           <NavItem
// // //             href="/hotel-panel/payment-management"
// // //             label="Payment Management"
// // //             disabled={!hasAccess('payment-management')}
// // //           >
// // //             <RiMoneyRupeeCircleLine className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>
// // //           <NavItem
// // //             href="/hotel-panel/coupon-management"
// // //             label="Coupon Management"
// // //             disabled={!hasAccess('coupons-management')}
// // //           >
// // //             <Ticket className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>
// // //           <NavItem
// // //             href="/hotel-panel/refund-management"
// // //             label="Refunds Management"
// // //             disabled={!hasAccess('refund-management')}
// // //           >
// // //             <RiMoneyRupeeCircleLine className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>

// // //           <NavItem
// // //             href="/hotel-panel/change-password"
// // //             label="Change Password"
// // //           >
// // //             <TbPasswordUser className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>

// // //           <NavItem
// // //             href="/hotel-panel/hotel-profile"
// // //             label="Hotel Profile"
// // //             disabled={!hasAccess('hotel-management')}
// // //           >
// // //             <Landmark className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>

// // //           <NavItem
// // //             href="/hotel-panel/analytics-reports"
// // //             label="Analytics & Reports"
// // //             disabled={!hasAccess('analytics-reports')}
// // //           >
// // //             <MdAnalytics className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>

// // //           <NavItem href="/logout" label="Logout">
// // //             <LogOut className="h-5 w-5 lg:h-6 lg:w-6" />
// // //           </NavItem>
// // //         </div>
// // //       </nav>
// // //     </aside>
// // //   );
// // // }

// // 'use client';
// // import '../globals.css';
// // import Link from 'next/link';
// // import { LogOut, Users, Landmark, Component, Ticket } from 'lucide-react';
// // import Providers from '../providers';
// // import { NavItem } from '../nav-item';
// // import logo from '../../public/assets/logo.svg';
// // import Image from 'next/image';
// // import { useState, useEffect } from 'react';
// // import { usePathname } from 'next/navigation';
// // import { RiAdminLine } from 'react-icons/ri';
// // import { BsPersonWorkspace } from 'react-icons/bs';
// // import { RiMoneyRupeeCircleLine } from 'react-icons/ri';
// // import { VscSettings } from 'react-icons/vsc';
// // import { TbPasswordUser } from 'react-icons/tb';
// // import { MdDashboardCustomize } from 'react-icons/md';
// // import { IoIosPeople } from 'react-icons/io';
// // import { ImManWoman } from 'react-icons/im';
// // import { MdManageAccounts } from 'react-icons/md';
// // import { IoMdNotificationsOutline } from 'react-icons/io';
// // import { Menu, X } from 'lucide-react';
// // import { MdAnalytics } from 'react-icons/md';
// // import { MdOutlineSubscriptions } from 'react-icons/md';
// // import {
// //   getSessionStorageItem,
// //   setSessionStorageItem
// // } from 'utils/localstorage';

// // export default function RootLayout({
// //   children
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   const pathname = usePathname();
// //   const isSuperAdminRoute = pathname.startsWith('/super-admin');
// //   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar

// //   const toggleSidebar = () => {
// //     setIsSidebarOpen((prev) => !prev);
// //   };

// //   return (
// //     <Providers>
// //       <div className="flex w-full overflow-hidden min-h-screen">
// //         {/* Sidebar: Hidden on lg and below, shown when toggled */}
// //         <div
// //           className={`lg:w-[20%] fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
// //             } lg:translate-x-0 lg:static z-50`}
// //         >
// //           {isSuperAdminRoute ? (
// //             <SuperAdminPanelSideNav />
// //           ) : (
// //             <HotelPanelSideNav />
// //           )}
// //         </div>

// //         {/* Main Content */}
// //         <div
// //           className={`w-full lg:w-[80%] flex flex-col h-screen overflow-hidden transition-all duration-300`}
// //         >
// //           {/* Header with Toggle Button */}
// //           <header className="lg:hidden flex items-center justify-between p-4 bg-coffeeLight">
// //             <Link
// //               href={isSuperAdminRoute ? '/super-admin/dashboard' : '/dashboard'}
// //             >
// //               <Image loading="lazy" src={logo} alt="Logo" className="h-8" />
// //             </Link>
// //             <button onClick={toggleSidebar} aria-label="Toggle Sidebar">
// //               {isSidebarOpen ? (
// //                 <X className="h-6 w-6 text-goldenYellow/80" />
// //               ) : (
// //                 <Menu className="h-6 w-6 text-goldenYellow/80" />
// //               )}
// //             </button>
// //           </header>

// //           <main className="overflow-y-auto flex items-start w-full md:gap-4 hide-scrollbar">
// //             {children}
// //           </main>
// //         </div>

// //         {/* Overlay for mobile when sidebar is open */}
// //         {isSidebarOpen && (
// //           <div
// //             className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
// //             onClick={toggleSidebar}
// //           ></div>
// //         )}
// //       </div>
// //     </Providers>
// //   );
// // }

// // function SuperAdminPanelSideNav() {
// //   const [adminData, setAdminData] = useState<any>(null);
// //   const [openHotelSubMenu, setOpenHotelSubMenu] = useState(false);

// //   useEffect(() => {
// //     // This runs only on the client
// //     setAdminData(getSessionStorageItem<any>('admin'));
// //   }, []);

// //   // Until adminData is loaded, render nothing or a loading state
// //   if (!adminData) return null;

// //   const allowedModules: string[] = adminData?.allowedModules || [];
// //   const isSuperAdmin = adminData?.isSuperAdmin === true;
// //   const permissions: string[] = adminData?.permissions || [];
// //   const hasAllAccess = permissions.includes('all');

// //   const hasAccess = (moduleName: string) => {
// //     return isSuperAdmin || hasAllAccess || allowedModules.includes(moduleName);
// //   };

// //   return (
// //     <aside className="flex flex-col py-14 lg:py-2 2xl:py-4 h-screen p-4 pb-0 bg-coffeeLight z-40">
// //       <nav className="flex flex-col gap-4 items-center overflow-y-auto hide-scrollbar">
// //         <Link
// //           href="/super-admin/dashboard"
// //           className="flex items-center gap-4 p-2 text-lg lg:text-xl font-semibold"
// //         >
// //           <Image loading="lazy" src={logo} alt="HandyMan" />
// //         </Link>

// //         <div className="sidebar-menu h-screen w-full p-4 mb-2 rounded-2xl flex flex-col gap-3">
// //           {hasAccess('dashboard') && (
// //             <NavItem href="/super-admin/dashboard" label="Dashboard">
// //               <MdDashboardCustomize className="h-5 w-5 lg:h-6 lg:w-6" />
// //             </NavItem>
// //           )}

// //           {hasAccess('roles-and-permissions') && (
// //             <NavItem
// //               href="/super-admin/roles-and-permissions"
// //               label="Roles & Permission"
// //             >
// //               <BsPersonWorkspace className="h-4 w-4 lg:h-5 lg:w-5" />
// //             </NavItem>
// //           )}

// //           {hasAccess('admin-management') && (
// //             <NavItem
// //               href="/super-admin/admin-management"
// //               label="Admin Management"
// //             >
// //               <RiAdminLine className="h-5 w-5 lg:h-6 lg:w-6" />
// //             </NavItem>
// //           )}

// //           {hasAccess('guest-management') && (
// //             <NavItem
// //               href="/super-admin/guest-management"
// //               label="Guest Management"
// //             >
// //               <Users className="h-5 w-5 lg:h-6 lg:w-6" />
// //             </NavItem>
// //           )}

// //           {hasAccess('subscription-management') && (
// //             <NavItem
// //               href="/super-admin/subscription-management"
// //               label="Manage Subscription"
// //             >
// //               <MdOutlineSubscriptions className="h-5 w-5 lg:h-6 lg:w-6" />
// //             </NavItem>
// //           )}

// //           {hasAccess('complaint-management') && (
// //             <NavItem
// //               href="/super-admin/complaint-management"
// //               label="Complaint Management"
// //             >
// //               <VscSettings className="h-5 w-5 lg:h-6 lg:w-6" />
// //             </NavItem>
// //           )}

// //           {hasAccess('coupons-management') && (
// //             <NavItem
// //               href="/super-admin/coupon-management"
// //               label="Coupon Management"
// //             >
// //               <Ticket className="h-5 w-5 lg:h-6 lg:w-6" />
// //             </NavItem>
// //           )}

// //           {hasAccess('refund-management') && (
// //             <NavItem
// //               href="/super-admin/refund-management"
// //               label="Refunds Management"
// //             >
// //               <RiMoneyRupeeCircleLine className="h-5 w-5 lg:h-6 lg:w-6" />
// //             </NavItem>
// //           )}

// //           <NavItem href="/super-admin/change-password" label="Change Password">
// //             <TbPasswordUser className="h-5 w-5 lg:h-6 lg:w-6" />
// //           </NavItem>

// //           {hasAccess('hotel-management') && (
// //             <div className="rounded-lg">
// //               <div onClick={() => setOpenHotelSubMenu((prev) => !prev)}>
// //                 <NavItem
// //                   href="/super-admin/hotel-management"
// //                   label="Hotel Management"
// //                 >
// //                   <Landmark className="h-5 w-5 lg:h-6 lg:w-6" />
// //                 </NavItem>
// //               </div>
// //               <div
// //                 className={`pl-4 mt-1 overflow-hidden transition-all duration-300 ease-in-out ${openHotelSubMenu ? 'max-h-screen' : 'max-h-0'
// //                   }`}
// //               >
// //                 <NavItem
// //                   href="/super-admin/sub_hotel-management"
// //                   label="Sub-Hotel Management"
// //                 >
// //                   <div className="h-2 w-2 lg:h-3 lg:w-3 bg-brown rounded-full" />
// //                 </NavItem>
// //               </div>
// //             </div>
// //           )}

// //           {hasAccess('analytics-reports') && (
// //             <NavItem
// //               href="/super-admin/analytics-reports"
// //               label="Analytics & Reports"
// //             >
// //               <MdAnalytics className="h-5 w-5 lg:h-6 lg:w-6" />
// //             </NavItem>
// //           )}

// //           <NavItem href="/logout" label="Logout">
// //             <LogOut className="h-5 w-5 lg:h-6 lg:w-6" />
// //           </NavItem>
// //         </div>
// //       </nav>
// //     </aside>
// //   );
// // }

// // function HotelPanelSideNav() {
// //   const [adminData, setAdminData] = useState<any>(null);

// //   useEffect(() => {
// //     setAdminData(getSessionStorageItem<any>('admin'));
// //   }, []);

// //   if (!adminData) return null;

// //   const allowedModules: string[] = adminData?.allowedModules || [];
// //   const isSuperAdmin = adminData?.isSuperAdmin === true;
// //   const permissions: string[] = adminData?.permissions || [];
// //   const hasAllAccess = permissions.includes('all');

// //   const hasAccess = (moduleName: string) => {
// //     return isSuperAdmin || hasAllAccess || allowedModules.includes(moduleName);
// //   };

// //   return (
// //     <aside className="flex flex-col py-14 lg:py-2 2xl:py-4 h-screen p-4 pb-0 bg-coffeeLight z-40">
// //       <nav className="flex flex-col gap-4 items-center overflow-y-auto hide-scrollbar">
// //         <Link
// //           href="/hotel-panel/dashboard"
// //           className="flex items-center gap-4 p-2 text-lg lg:text-xl font-semibold"
// //         >
// //           <Image loading="lazy" src={logo} alt="KNECTHOTEL" />
// //         </Link>

// //         <div className="sidebar-menu h-screen w-full p-4 mb-2 rounded-2xl flex flex-col gap-3">
// //           <NavItem
// //             href="/hotel-panel/dashboard"
// //             label="Dashboard"
// //             disabled={!hasAccess('dashboard')}
// //           >
// //             <MdDashboardCustomize className="h-5 w-5 lg:h-6 lg:w-6" />
// //           </NavItem>

// //           <NavItem
// //             href="/hotel-panel/roles-permission"
// //             label="Roles & Permission"
// //             disabled={!hasAccess('roles-and-permissions')}
// //           >
// //             <BsPersonWorkspace className="h-4 w-4 lg:h-5 lg:w-5" />
// //           </NavItem>

// //           <NavItem
// //             href="/hotel-panel/employee-management"
// //             label="Employee Management"
// //             disabled={!hasAccess('admin-management')}
// //           >
// //             <IoIosPeople className="h-6 w-6 lg:h-7 lg:w-7" />
// //           </NavItem>

// //           <NavItem
// //             href="/hotel-panel/guest-management"
// //             label="Guest Management"
// //             disabled={!hasAccess('guest-management')}
// //           >
// //             <ImManWoman className="h-5 w-5 lg:h-6 lg:w-6" />
// //           </NavItem>

// //           <NavItem
// //             href="/hotel-panel/service-management"
// //             label="Service Management"
// //           // disabled={!hasAccess('service-management')}
// //           >
// //             <MdManageAccounts className="h-5 w-5 lg:h-6 lg:w-6" />
// //           </NavItem>

// //           <NavItem
// //             href="/hotel-panel/complaint-management"
// //             label="Complaint Management"
// //             disabled={!hasAccess('complaint-management')}
// //           >
// //             <VscSettings className="h-5 w-5 lg:h-6 lg:w-6" />
// //           </NavItem>

// //           <NavItem
// //             href="/hotel-panel/payment-management"
// //             label="Payment Management"
// //             disabled={!hasAccess('payment-management')}
// //           >
// //             <RiMoneyRupeeCircleLine className="h-5 w-5 lg:h-6 lg:w-6" />
// //           </NavItem>
// //           <NavItem
// //             href="/hotel-panel/coupon-management"
// //             label="Coupon Management"
// //             disabled={!hasAccess('coupons-management')}
// //           >
// //             <Ticket className="h-5 w-5 lg:h-6 lg:w-6" />
// //           </NavItem>
// //           <NavItem
// //             href="/hotel-panel/refund-management"
// //             label="Refunds Management"
// //             disabled={!hasAccess('refund-management')}
// //           >
// //             <RiMoneyRupeeCircleLine className="h-5 w-5 lg:h-6 lg:w-6" />
// //           </NavItem>

// //           <NavItem href="/hotel-panel/change-password" label="Change Password">
// //             <TbPasswordUser className="h-5 w-5 lg:h-6 lg:w-6" />
// //           </NavItem>

// //           <NavItem
// //             href="/hotel-panel/hotel-profile"
// //             label="Hotel Profile"
// //             disabled={!hasAccess('hotel-management')}
// //           >
// //             <Landmark className="h-5 w-5 lg:h-6 lg:w-6" />
// //           </NavItem>

// //           <NavItem
// //             href="/hotel-panel/analytics-reports"
// //             label="Analytics & Reports"
// //             disabled={!hasAccess('analytics-reports')}
// //           >
// //             <MdAnalytics className="h-5 w-5 lg:h-6 lg:w-6" />
// //           </NavItem>

// //           <NavItem href="/logout" label="Logout">
// //             <LogOut className="h-5 w-5 lg:h-6 lg:w-6" />
// //           </NavItem>
// //         </div>
// //       </nav>
// //     </aside>
// //   );
// // }

// 'use client';
// import '../globals.css';
// import Link from 'next/link';
// import { LogOut, Users, Landmark, Ticket } from 'lucide-react';
// import Providers from '../providers';
// import { NavItem } from '../nav-item';
// import logo from '../../public/assets/logo.svg';
// import Image from 'next/image';
// import { useState, useEffect } from 'react';
// import { usePathname } from 'next/navigation';
// import { RiAdminLine, RiMoneyRupeeCircleLine } from 'react-icons/ri';
// import { BsPersonWorkspace } from 'react-icons/bs';
// import { VscSettings } from 'react-icons/vsc';
// import { TbPasswordUser } from 'react-icons/tb';
// import {
//   MdDashboardCustomize,
//   MdManageAccounts,
//   MdAnalytics,
//   MdOutlineSubscriptions
// } from 'react-icons/md';
// import { IoIosPeople } from 'react-icons/io';
// import { ImManWoman } from 'react-icons/im';
// import { Menu, X } from 'lucide-react';
// import { getSessionStorageItem } from 'utils/localstorage';
// import { allServices } from 'utils/allservices';

// export default function RootLayout({
//   children
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const isSuperAdminRoute = pathname.startsWith('/super-admin');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [showHotelSidebar, setShowHotelSidebar] = useState(false);

//   useEffect(() => {
//     const adminData = getSessionStorageItem<any>('admin');
//     if (!adminData) return;

//     const allowedModules = adminData.allowedModules || [];
//     const permissions = adminData.permissions || [];
//     const isSuperAdmin = adminData.isSuperAdmin === true;
//     const hasAllAccess = permissions.includes('all');

//     const hasAccess = (module: string) =>
//       isSuperAdmin || hasAllAccess || allowedModules.includes(module);

//     const hotelModules = [
//       'dashboard',
//       'roles-and-permissions',
//       'admin-management',
//       'guest-management',
//       'service-management',
//       'complaint-management',
//       'payment-management',
//       'coupons-management',
//       'refund-management',
//       'hotel-management',
//       'analytics-reports'
//     ];

//     const accessExists = hotelModules.some(hasAccess);
//     setShowHotelSidebar(accessExists);
//   }, []);

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   const shouldShowSidebar = isSuperAdminRoute || showHotelSidebar;

//   return (
//     <Providers>
//       <div className="flex w-full overflow-hidden min-h-screen">
//         {/* Sidebar */}
//         {shouldShowSidebar && (
//           <div
//             className={`lg:w-[20%] fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//               } lg:translate-x-0 lg:static z-50`}
//           >
//             {isSuperAdminRoute ? (
//               <SuperAdminPanelSideNav />
//             ) : (
//               <HotelPanelSideNav />
//             )}
//           </div>
//         )}

//         {/* Main Content */}
//         <div
//           className={`w-full ${shouldShowSidebar ? 'lg:w-[80%]' : 'lg:w-full'
//             } flex flex-col h-screen overflow-hidden transition-all duration-300`}
//         >
//           {/* Header */}
//           <header className="lg:hidden flex items-center justify-between p-4 bg-coffeeLight">
//             <Link
//               href={isSuperAdminRoute ? '/super-admin/dashboard' : '/dashboard'}
//             >
//               <Image loading="lazy" src={logo} alt="Logo" className="h-8" />
//             </Link>
//             <button onClick={toggleSidebar} aria-label="Toggle Sidebar">
//               {isSidebarOpen ? (
//                 <X className="h-6 w-6 text-goldenYellow/80" />
//               ) : (
//                 <Menu className="h-6 w-6 text-goldenYellow/80" />
//               )}
//             </button>
//           </header>

//           <main className="overflow-y-auto flex items-start w-full md:gap-4 hide-scrollbar">
//             {children}
//           </main>
//         </div>

//         {/* Overlay */}
//         {isSidebarOpen && shouldShowSidebar && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
//             onClick={toggleSidebar}
//           />
//         )}
//       </div>
//     </Providers>
//   );
// }

// function SuperAdminPanelSideNav() {
//   const [adminData, setAdminData] = useState<any>(null);
//   const [openHotelSubMenu, setOpenHotelSubMenu] = useState(false);

//   useEffect(() => {
//     setAdminData(getSessionStorageItem<any>('admin'));
//   }, []);

//   if (!adminData) return null;

//   const allowedModules: string[] = adminData?.allowedModules || [];
//   const isSuperAdmin = adminData?.isSuperAdmin === true;
//   const permissions: string[] = adminData?.permissions || [];
//   const hasAllAccess = permissions.includes('all');

//   const hasAccess = (module: string) =>
//     isSuperAdmin || hasAllAccess || allowedModules.includes(module);

//   return (
//     <aside className="flex flex-col py-14 lg:py-2 2xl:py-4 h-screen p-4 pb-0 bg-coffeeLight z-40">
//       <nav className="flex flex-col gap-4 items-center overflow-y-auto hide-scrollbar">
//         <Link
//           href="/super-admin/dashboard"
//           className="flex items-center gap-4 p-2 text-lg lg:text-xl font-semibold"
//         >
//           <Image loading="lazy" src={logo} alt="HandyMan" />
//         </Link>

//         <div className="sidebar-menu h-screen w-full p-4 mb-2 rounded-2xl flex flex-col gap-3">
//           {hasAccess('dashboard') && (
//             <NavItem href="/super-admin/dashboard" label="Dashboard">
//               <MdDashboardCustomize className="h-5 w-5 lg:h-6 lg:w-6" />
//             </NavItem>
//           )}
//           {hasAccess('roles-and-permissions') && (
//             <NavItem
//               href="/super-admin/roles-and-permissions"
//               label="Roles & Permission"
//             >
//               <BsPersonWorkspace className="h-4 w-4 lg:h-5 lg:w-5" />
//             </NavItem>
//           )}
//           {hasAccess('admin-management') && (
//             <NavItem
//               href="/super-admin/admin-management"
//               label="Admin Management"
//             >
//               <RiAdminLine className="h-5 w-5 lg:h-6 lg:w-6" />
//             </NavItem>
//           )}
//           {hasAccess('guest-management') && (
//             <NavItem
//               href="/super-admin/guest-management"
//               label="Booking Management"
//             >
//               <Users className="h-5 w-5 lg:h-6 lg:w-6" />
//             </NavItem>
//           )}
//           {hasAccess('subscription-management') && (
//             <NavItem
//               href="/super-admin/subscription-management"
//               label="Manage Subscription"
//             >
//               <MdOutlineSubscriptions className="h-5 w-5 lg:h-6 lg:w-6" />
//             </NavItem>
//           )}
//           {hasAccess('complaint-management') && (
//             <NavItem
//               href="/super-admin/complaint-management"
//               label="Complaint Management"
//             >
//               <VscSettings className="h-5 w-5 lg:h-6 lg:w-6" />
//             </NavItem>
//           )}
//           {hasAccess('coupons-management') && (
//             <NavItem
//               href="/super-admin/coupon-management"
//               label="Coupon Management"
//             >
//               <Ticket className="h-5 w-5 lg:h-6 lg:w-6" />
//             </NavItem>
//           )}
//           {hasAccess('payment-management') && (
//             <NavItem
//               href="/super-admin/payment-management"
//               label="Payment Management"
//             >
//               <RiMoneyRupeeCircleLine className="h-5 w-5 lg:h-6 lg:w-6" />
//             </NavItem>
//           )}
//           {hasAccess('refund-management') && (
//             <NavItem
//               href="/super-admin/refund-management"
//               label="Refunds Management"
//             >
//               <RiMoneyRupeeCircleLine className="h-5 w-5 lg:h-6 lg:w-6" />
//             </NavItem>
//           )}
//           <NavItem href="/super-admin/change-password" label="Change Password">
//             <TbPasswordUser className="h-5 w-5 lg:h-6 lg:w-6" />
//           </NavItem>
//           {hasAccess('hotel-management') && (
//             <div className="rounded-lg">
//               <div onClick={() => setOpenHotelSubMenu((prev) => !prev)}>
//                 <NavItem
//                   href="/super-admin/hotel-management"
//                   label="Hotel Management"
//                 >
//                   <Landmark className="h-5 w-5 lg:h-6 lg:w-6" />
//                 </NavItem>
//               </div>
//               <div
//                 className={`pl-4 mt-1 overflow-hidden transition-all duration-300 ease-in-out ${openHotelSubMenu ? 'max-h-screen' : 'max-h-0'
//                   }`}
//               >
//                 <NavItem
//                   href="/super-admin/sub_hotel-management"
//                   label="Sub-Hotel Management"
//                 >
//                   <div className="h-2 w-2 lg:h-3 lg:w-3 bg-brown rounded-full" />
//                 </NavItem>
//               </div>
//             </div>
//           )}
//           {hasAccess('analytics-reports') && (
//             <NavItem
//               href="/super-admin/analytics-reports"
//               label="Analytics & Reports"
//             >
//               <MdAnalytics className="h-5 w-5 lg:h-6 lg:w-6" />
//             </NavItem>
//           )}
//           <NavItem href="/logout" label="Logout">
//             <LogOut className="h-5 w-5 lg:h-6 lg:w-6" />
//           </NavItem>
//         </div>
//       </nav>
//     </aside>
//   );
// }

// function HotelPanelSideNav() {
//   const [adminData, setAdminData] = useState<any>(null);

//   useEffect(() => {
//     setAdminData(getSessionStorageItem<any>('admin'));
//   }, []);

//   if (!adminData) return null;

//   const allowedModules: string[] = adminData?.allowedModules || [];
//   const serviceManagementModules = allServices.filter(service => allowedModules.includes(service.name));
//   const isSuperAdmin = adminData?.isSuperAdmin === true;
//   const permissions: string[] = adminData?.permissions || [];
//   const hasAllAccess = permissions.includes('all');

//   const hasAccess = (module: string) =>
//     isSuperAdmin || hasAllAccess || allowedModules.includes(module);

//   const hasServiceAccess = () =>
//     isSuperAdmin || hasAllAccess || serviceManagementModules.length > 0;

//   // Check if at least one module is accessible before rendering the sidebar
//   const isAnyModuleAccessible = [
//     'dashboard',
//     'roles-and-permissions',
//     'admin-management',
//     'guest-management',
//     'service-management',
//     'complaint-management',
//     'payment-management',
//     'coupons-management',
//     'refund-management',
//     'hotel-management',
//     'analytics-reports'
//   ].some(hasAccess);

//   if (!isAnyModuleAccessible) return null;

//   return (
//     <aside className="flex flex-col py-14 lg:py-2 2xl:py-4 h-screen p-4 pb-0 bg-coffeeLight z-40">
//       <nav className="flex flex-col gap-4 items-center overflow-y-auto hide-scrollbar">
//         <Link
//           href="/hotel-panel/dashboard"
//           className="flex items-center gap-4 p-2 text-lg lg:text-xl font-semibold"
//         >
//           <Image loading="lazy" src={logo} alt="KNECTHOTEL" />
//         </Link>

//         <div className="sidebar-menu h-screen w-full p-4 mb-2 rounded-2xl flex flex-col gap-3">
//           {hasAccess('dashboard') && (
//             <NavItem href="/hotel-panel/dashboard" label="Dashboard">
//               <MdDashboardCustomize className="h-5 w-5 lg:h-6 lg:w-6" />
//             </NavItem>
//           )}
//           {hasAccess('roles-and-permissions') && (
//             <NavItem
//               href="/hotel-panel/roles-permission"
//               label="Roles & Permission"
//             >
//               <BsPersonWorkspace className="h-4 w-4 lg:h-5 lg:w-5" />
//             </NavItem>
//           )}
//           {hasAccess('admin-management') && (
//             <NavItem
//               href="/hotel-panel/employee-management"
//               label="Employee Management"
//             >
//               <IoIosPeople className="h-6 w-6 lg:h-7 lg:w-7" />
//             </NavItem>
//           )}
//           {hasAccess('guest-management') && (
//             <NavItem
//               href="/hotel-panel/guest-management"
//               label="Booking Management"
//             >
//               <ImManWoman className="h-5 w-5 lg:h-6 lg:w-6" />
//             </NavItem>
//           )}
//           {hasServiceAccess() && (
//             <NavItem
//               href="/hotel-panel/service-management"
//               label="Service Management"
//             >
//               <MdManageAccounts className="h-5 w-5 lg:h-6 lg:w-6" />
//             </NavItem>
//           )}
//           {hasAccess('complaint-management') && (
//             <NavItem
//               href="/hotel-panel/complaint-management"
//               label="Complaint Management"
//             >
//               <VscSettings className="h-5 w-5 lg:h-6 lg:w-6" />
//             </NavItem>
//           )}
//           {hasAccess('payment-management') && (
//             <NavItem
//               href="/hotel-panel/payment-management"
//               label="Payment Management"
//             >
//               <RiMoneyRupeeCircleLine className="h-5 w-5 lg:h-6 lg:w-6" />
//             </NavItem>
//           )}
//           {hasAccess('coupons-management') && (
//             <NavItem
//               href="/hotel-panel/coupon-management"
//               label="Coupon Management"
//             >
//               <Ticket className="h-5 w-5 lg:h-6 lg:w-6" />
//             </NavItem>
//           )}
//           {hasAccess('refund-management') && (
//             <NavItem
//               href="/hotel-panel/refund-management"
//               label="Refunds Management"
//             >
//               <RiMoneyRupeeCircleLine className="h-5 w-5 lg:h-6 lg:w-6" />
//             </NavItem>
//           )}
//           <NavItem href="/hotel-panel/change-password" label="Change Password">
//             <TbPasswordUser className="h-5 w-5 lg:h-6 lg:w-6" />
//           </NavItem>
//           {hasAccess('hotel-management') && (
//             <NavItem href="/hotel-panel/hotel-profile" label="Hotel Profile">
//               <Landmark className="h-5 w-5 lg:h-6 lg:w-6" />
//             </NavItem>
//           )}
//           {hasAccess('analytics-reports') && (
//             <NavItem
//               href="/hotel-panel/analytics-reports"
//               label="Analytics & Reports"
//             >
//               <MdAnalytics className="h-5 w-5 lg:h-6 lg:w-6" />
//             </NavItem>
//           )}
//           <NavItem href="/logout" label="Logout">
//             <LogOut className="h-5 w-5 lg:h-6 lg:w-6" />
//           </NavItem>
//         </div>
//       </nav>
//     </aside>
//   );
// }
'use client';
import Link from 'next/link';
import { LogOut, Users, Landmark, Ticket, BedDouble } from 'lucide-react';
import Providers from '../providers';
import { NavItem } from '../nav-item';
import logo from '../../public/assets/logo.svg';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { RiAdminLine, RiMoneyRupeeCircleLine } from 'react-icons/ri';
import { BsPersonWorkspace } from 'react-icons/bs';
import { VscSettings } from 'react-icons/vsc';
import { TbPasswordUser } from 'react-icons/tb';
import {
  MdDashboardCustomize,
  MdManageAccounts,
  MdAnalytics,
  MdOutlineSubscriptions,
  MdSettings
} from 'react-icons/md';
import { IoIosPeople } from 'react-icons/io';
import { ImManWoman } from 'react-icons/im';
import { Menu, X } from 'lucide-react';
import { getSessionStorageItem } from 'utils/localstorage';
import { allServices } from 'utils/allservices';
import AnimatedSelect from '@/components/ui/AnimatedSelect';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSuperAdminRoute = pathname.startsWith('/super-admin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showHotelSidebar, setShowHotelSidebar] = useState(false);

  // useEffect(() => {
  //   const adminData = getSessionStorageItem<any>('admin');
  //   if (!adminData) return;

  //   const allowedModules = adminData.allowedModules || [];
  //   const permissions = adminData.permissions || [];
  //   const isSuperAdmin = adminData.isSuperAdmin === true;
  //   const hasAllAccess = permissions.includes('all');

  //   const hasAccess = (module: string) =>
  //     isSuperAdmin || hasAllAccess || allowedModules.includes(module);

  //   const hotelModules = [
  //     'dashboard',
  //     'roles-and-permissions',
  //     'admin-management',
  //     'guest-management',
  //     'service-management',
  //     'complaint-management',
  //     'payment-management',
  //     'coupons-management',
  //     'refund-management',
  //     'hotel-management',
  //     'analytics-reports',
  //   ];

  //   const accessExists = hotelModules.some(hasAccess);
  //   setShowHotelSidebar(accessExists);
  // }, []);

  useEffect(() => {
    const adminData = getSessionStorageItem<any>('admin');
    if (!adminData) return;

    const allowedModules: string[] = Array.isArray(adminData.allowedModules)
      ? adminData.allowedModules
      : [];
    const allowedServices: string[] = Array.isArray(adminData.allowedServices)
      ? adminData.allowedServices
      : [];
    const permissions: string[] = Array.isArray(adminData.permissions)
      ? adminData.permissions
      : [];
    const isSuperAdmin = adminData.isSuperAdmin === true;
    const hasAllAccess = permissions.includes('all');

    const hasAccess = (module: string) =>
      isSuperAdmin || hasAllAccess || allowedModules.includes(module);

    const serviceNames = Array.isArray(allServices)
      ? allServices.map((s) => s?.name).filter(Boolean)
      : [];

    const servicesFromModules = serviceNames.filter((n) =>
      allowedModules.includes(n)
    );

    const hasServiceAccess =
      isSuperAdmin ||
      hasAllAccess ||
      allowedServices.length > 0 ||
      servicesFromModules.length > 0;

    const hotelModules = [
      'dashboard',
      'roles-and-permissions',
      'admin-management',
      'guest-management',
      'service-management',
      'complaint-management',
      'payment-management',
      'coupons-management',
      'refund-management',
      'hotel-management',
      'analytics-reports'
    ];

    const accessExists = hasServiceAccess || hotelModules.some(hasAccess);

    setShowHotelSidebar(accessExists);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const shouldShowSidebar = isSuperAdminRoute || showHotelSidebar;

  return (
    <Providers>
      <div className="flex w-full overflow-hidden min-h-screen">
        {/* Sidebar */}
        {shouldShowSidebar && (
          <div
            className={`lg:w-[20%] fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out transform ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 lg:static z-50`}
          >
            {isSuperAdminRoute ? (
              <SuperAdminPanelSideNav />
            ) : (
              <HotelPanelSideNav />
            )}
          </div>
        )}

        {/* Main Content */}
        <div
          className={`w-full ${
            shouldShowSidebar ? 'lg:w-[80%]' : 'lg:w-full'
          } flex flex-col h-screen overflow-hidden transition-all duration-300`}
        >
          {/* Header */}
          <header className="lg:hidden flex items-center justify-between p-4 bg-coffeeLight">
            <Link
              href={isSuperAdminRoute ? '/super-admin/dashboard' : '/dashboard'}
            >
              <Image loading="lazy" src={logo} alt="Logo" className="h-8" />
            </Link>
            <button onClick={toggleSidebar} aria-label="Toggle Sidebar">
              {isSidebarOpen ? (
                <X className="h-6 w-6 text-goldenYellow/80" />
              ) : (
                <Menu className="h-6 w-6 text-goldenYellow/80" />
              )}
            </button>
          </header>

          <main className="overflow-y-auto flex items-start w-full md:gap-4 hide-scrollbar">
            {children}
          </main>
        </div>

        {/* Overlay */}
        {isSidebarOpen && shouldShowSidebar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </Providers>
  );
}

function SuperAdminPanelSideNav() {
  const [adminData, setAdminData] = useState<any>(null);
  const [openHotelSubMenu, setOpenHotelSubMenu] = useState(false);

  useEffect(() => {
    setAdminData(getSessionStorageItem<any>('admin'));
  }, []);

  if (!adminData) return null;

  const allowedModules: string[] = adminData?.allowedModules || [];
  const isSuperAdmin = adminData?.isSuperAdmin === true;
  const permissions: string[] = adminData?.permissions || [];
  const hasAllAccess = permissions.includes('all');

  const hasAccess = (module: string) =>
    isSuperAdmin || hasAllAccess || allowedModules.includes(module);

  return (
    <aside className="flex flex-col py-14 lg:py-2 2xl:py-4 h-screen p-4 pb-0 bg-coffeeLight z-40">
      <nav className="flex flex-col gap-4 items-center overflow-y-auto hide-scrollbar">
        <Link
          href="/super-admin/dashboard"
          className="flex items-center gap-4 p-2 text-lg lg:text-xl font-semibold"
        >
          <Image loading="lazy" src={logo} alt="HandyMan" />
        </Link>

        <div className="sidebar-menu h-screen w-full p-4 mb-2 rounded-2xl flex flex-col gap-3">
          {hasAccess('dashboard') && (
            <NavItem href="/super-admin/dashboard" label="Dashboard">
              <MdDashboardCustomize className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          {hasAccess('roles-and-permissions') && (
            <NavItem
              href="/super-admin/roles-and-permissions"
              label="Roles & Permission"
            >
              <BsPersonWorkspace className="h-4 w-4 lg:h-5 lg:w-5" />
            </NavItem>
          )}
          {hasAccess('admin-management') && (
            <NavItem
              href="/super-admin/admin-management"
              label="Admin Management"
            >
              <RiAdminLine className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          {hasAccess('guest-management') && (
            <NavItem
              href="/super-admin/guest-management"
              label="Booking Management"
            >
              <Users className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          {hasAccess('subscription-management') && (
            <NavItem
              href="/super-admin/subscription-management"
              label="Manage Subscription"
            >
              <MdOutlineSubscriptions className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          {hasAccess('complaint-management') && (
            <NavItem
              href="/super-admin/complaint-management"
              label="Complaint Management"
            >
              <VscSettings className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          {hasAccess('coupons-management') && (
            <NavItem
              href="/super-admin/coupon-management"
              label="Coupon Management"
            >
              <Ticket className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          {hasAccess('payment-management') && (
            <NavItem
              href="/super-admin/payment-management"
              label="Payment Management"
            >
              <RiMoneyRupeeCircleLine className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          {hasAccess('refund-management') && (
            <NavItem
              href="/super-admin/refund-management"
              label="Refunds Management"
            >
              <RiMoneyRupeeCircleLine className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          <NavItem href="/super-admin/change-password" label="Change Password">
            <TbPasswordUser className="h-5 w-5 lg:h-6 lg:w-6" />
          </NavItem>
          {hasAccess('hotel-management') && (
            <div className="rounded-lg">
              <div onClick={() => setOpenHotelSubMenu((prev) => !prev)}>
                <NavItem
                  href="/super-admin/hotel-management"
                  label="Hotel Management"
                >
                  <Landmark className="h-5 w-5 lg:h-6 lg:w-6" />
                </NavItem>
              </div>
              <div
                className={`pl-4 mt-1 overflow-hidden transition-all duration-300 ease-in-out ${
                  openHotelSubMenu ? 'max-h-screen' : 'max-h-0'
                }`}
              >
                <NavItem
                  href="/super-admin/hotel-management/sub_hotel-management"
                  label="Sub-Hotel Management"
                >
                  <div className="h-2 w-2 lg:h-3 lg:w-3 bg-brown rounded-full" />
                </NavItem>
                <NavItem
                  href="/super-admin/hotel-management/rooms"
                  label="Room Management"
                >
                   {/* <div className="h-2 w-2 lg:h-3 lg:w-3 bg-brown rounded-full" />
                </NavItem>
                <NavItem
                  href="/super-admin/hotel-management/room-upgrade"
                  label="Room Upgrade"
                > */}
                  <div className="h-2 w-2 lg:h-3 lg:w-3 bg-brown rounded-full" />
                </NavItem>
                <NavItem
                  href="/super-admin/hotel-management/food-plans"
                  label="Food Plans"
                >
                  {/* <div className="h-2 w-2 lg:h-3 lg:w-3 bg-brown rounded-full" />
                </NavItem>
                <NavItem
                  href="/super-admin/hotel-management/coupons"
                  label="Coupons"
                > */}
                  {/* <div className="h-2 w-2 lg:h-3 lg:w-3 bg-brown rounded-full" />
                </NavItem>
                <NavItem
                  href="/super-admin/hotel-management/room-categories"
                  label="Room Categories"
                > */}
                  {/* <div className="h-2 w-2 lg:h-3 lg:w-3 bg-brown rounded-full" />
                </NavItem>
                <NavItem
                  href="/super-admin/hotel-management/floors"
                  label="Floors"
                > */}
                  {/* <div className="h-2 w-2 lg:h-3 lg:w-3 bg-brown rounded-full" />
                </NavItem>
                <NavItem
                  href="/super-admin/hotel-management/services"
                  label="Services"
                > */}
             
                  <div className="h-2 w-2 lg:h-3 lg:w-3 bg-brown rounded-full" />
                </NavItem>
              </div>
            </div>
          )}
          {hasAccess('analytics-reports') && (
            <NavItem
              href="/super-admin/analytics-reports"
              label="Analytics & Reports"
            >
              <MdAnalytics className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          {hasAccess('site-settings') && (
            <NavItem href="/super-admin/site-settings" label="Site-Settings">
              <MdSettings className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          <NavItem href="/logout" label="Logout">
            <LogOut className="h-5 w-5 lg:h-6 lg:w-6" />
          </NavItem>
        </div>
      </nav>
    </aside>
  );
}

function HotelPanelSideNav() {
  const [adminData, setAdminData] = useState<any>(null);
  const [openGuestSubMenu, setOpenGuestSubMenu] = useState(false);

  useEffect(() => {
    setAdminData(getSessionStorageItem<any>('admin'));
  }, []);
  // console.log('admin data', allServices);

  if (!adminData) return null;

  const allowedModules: string[] = adminData?.allowedModules || [];
  const serviceManagementModules = allServices.filter((service) =>
    allowedModules.includes(service.name)
  );
  const isSuperAdmin = adminData?.isSuperAdmin === true;
  const permissions: string[] = adminData?.permissions || [];
  const hasAllAccess = permissions.includes('all');

  const hasAccess = (module: string) =>
    isSuperAdmin || hasAllAccess || allowedModules.includes(module);

  const hasServiceAccess = () =>
    isSuperAdmin || hasAllAccess || serviceManagementModules.length > 0;

  // Check if at least one module is accessible before rendering the sidebar
  const isAnyModuleAccessible =
    hasServiceAccess() ||
    [
      'dashboard',
      'roles-and-permissions',
      'admin-management',
      'guest-management',
      'service-management',
      'complaint-management',
      'payment-management',
      'coupons-management',
      'refund-management',
      'hotel-management',
      'analytics-reports'
    ].some(hasAccess);
  // console.log('isAnyModuleAccessible', isAnyModuleAccessible);

  if (!isAnyModuleAccessible) return null;

  return (
    <aside className="flex flex-col py-14 lg:py-2 2xl:py-4 h-screen p-4 pb-0 bg-coffeeLight z-40">
      <nav className="flex flex-col gap-4 items-center overflow-y-auto hide-scrollbar">
        <Link
          href="/hotel-panel/dashboard"
          className="flex items-center gap-4 p-2 text-lg lg:text-xl font-semibold"
        >
          <Image loading="lazy" src={logo} alt="KNECTHOTEL" />
        </Link>

        <div className="sidebar-menu h-screen w-full p-4 mb-2 rounded-2xl flex flex-col gap-3">
          {hasAccess('dashboard') && (
            <NavItem href="/hotel-panel/dashboard" label="Dashboard">
              <MdDashboardCustomize className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          {hasAccess('roles-and-permissions') && (
            <NavItem
              href="/hotel-panel/roles-permission"
              label="Roles & Permission"
            >
              <BsPersonWorkspace className="h-4 w-4 lg:h-5 lg:w-5" />
            </NavItem>
          )}
          {hasAccess('admin-management') && (
            <NavItem
              href="/hotel-panel/employee-management"
              label="Employee Management"
            >
              <IoIosPeople className="h-6 w-6 lg:h-7 lg:w-7" />
            </NavItem>
          )}
          {hasAccess('guest-management') && (
            <div className="rounded-lg">
              <div onClick={() => setOpenGuestSubMenu((prev) => !prev)}>
                <NavItem
                  href="/hotel-panel/guest-management"
                  label="Booking Management"
                >
                  <Users className="h-5 w-5 lg:h-6 lg:w-6" />
                </NavItem>
              </div>

              <div
                className={`pl-4 mt-1 overflow-hidden transition-all duration-300 ease-in-out ${
                  openGuestSubMenu ? 'max-h-screen' : 'max-h-0'
                }`}
              >
                {/* <NavItem
                  href="/hotel-panel/guest-management/room-upgrade"
                  label="Room Upgrade"
                >
                  <div className="h-2 w-2 lg:h-3 lg:w-3 bg-brown rounded-full" />
                </NavItem>

                <NavItem
                  href="/hotel-panel/guest-management/room-categories"
                  label="Room Categories"
                >
                  <div className="h-2 w-2 lg:h-3 lg:w-3 bg-brown rounded-full" />
                </NavItem> */}

                <NavItem
                  href="/hotel-panel/guest-management/food-plans"
                  label="Food Plans"
                >
                  <div className="h-2 w-2 lg:h-3 lg:w-3 bg-brown rounded-full" />
                </NavItem>

                {/* <NavItem
                  href="/hotel-panel/guest-management/services"
                  label="Services"
                >
                  <div className="h-2 w-2 lg:h-3 lg:w-3 bg-brown rounded-full" />
                </NavItem> */}
              </div>
            </div>
          )}
          
          {hasAccess('hotel-management') && (
            <NavItem
              href="/hotel-panel/room-management"
              label="Room Management"
            >
              <BedDouble className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}

          {hasServiceAccess() && (
            <NavItem
              href="/hotel-panel/service-management"
              label="Service Management"
            >
              <MdManageAccounts className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          {hasAccess('complaint-management') && (
            <NavItem
              href="/hotel-panel/complaint-management"
              label="Complaint Management"
            >
              <VscSettings className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          {hasAccess('payment-management') && (
            <NavItem
              href="/hotel-panel/payment-management"
              label="Payment Management"
            >
              <RiMoneyRupeeCircleLine className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          {hasAccess('coupons-management') && (
            <NavItem
              href="/hotel-panel/coupon-management"
              label="Coupon Management"
            >
              <Ticket className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          {hasAccess('refund-management') && (
            <NavItem
              href="/hotel-panel/refund-management"
              label="Refunds Management"
            >
              <RiMoneyRupeeCircleLine className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          <NavItem href="/hotel-panel/change-password" label="Change Password">
            <TbPasswordUser className="h-5 w-5 lg:h-6 lg:w-6" />
          </NavItem>
          {hasAccess('hotel-management') && (
            <NavItem href="/hotel-panel/hotel-profile" label="Hotel Profile">
              <Landmark className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          {hasAccess('analytics-reports') && (
            <NavItem
              href="/hotel-panel/analytics-reports"
              label="Analytics & Reports"
            >
              <MdAnalytics className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          {hasAccess('site-settings') && (
            <NavItem href="/hotel-panel/site-settings" label="Site Settings">
              <MdSettings className="h-5 w-5 lg:h-6 lg:w-6" />
            </NavItem>
          )}
          <NavItem href="/logout" label="Logout">
            <LogOut className="h-5 w-5 lg:h-6 lg:w-6" />
          </NavItem>
        </div>
      </nav>
    </aside>
  );
}

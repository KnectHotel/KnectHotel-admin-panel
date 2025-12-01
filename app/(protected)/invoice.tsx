// // 'use client';

// // import React, {
// //   forwardRef,
// //   useEffect,
// //   useLayoutEffect,
// //   useMemo,
// //   useRef,
// //   useState
// // } from 'react';

// // type Item = { description: string; rate: number; qty: number; total: number };

// // export type InvoiceExactProps = {
// //   acknowledgementNumber: string;
// //   ackDate?: string;
// //   irnNo: string;
// //   invoiceNo: string;

// //   hotelName: string;
// //   hotelAddress: string;
// //   hotelPhone: string;
// //   hotelEmail: string;
// //   gstin: string;
// //   pan: string;

// //   bookingThrough: string; // coupon code
// //   couponDiscount?: number; // positive number
// //   mobile: string;
// //   arrival: string;
// //   departure: string;

// //   items: Item[];
// //   sgst: number;
// //   cgst: number;
// //   total: number;
// //   amountWords: string;

// //   logoSrc?: string; // default: '/Frame.svg'

// //   /** If true (default), scales content so the whole thing fits into one A4 page */
// //   autoScaleToA4?: boolean;
// // };

// // const A4_WIDTH_PX = 794; // ~8.27in at 96dpi
// // const A4_HEIGHT_PX = 1123; // ~11.69in at 96dpi

// // const fmt = (n: number) =>
// //   (isFinite(n) ? n : 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

// // const InvoiceExactA4 = forwardRef<HTMLDivElement, InvoiceExactProps>(
// //   (
// //     {
// //       acknowledgementNumber,
// //       ackDate,
// //       irnNo,
// //       invoiceNo,

// //       hotelName,
// //       hotelAddress,
// //       hotelPhone,
// //       hotelEmail,
// //       gstin,
// //       pan,

// //       bookingThrough,
// //       couponDiscount = 0,
// //       mobile,
// //       arrival,
// //       departure,

// //       items,
// //       sgst,
// //       cgst,
// //       total,
// //       amountWords,
// //       logoSrc = '/Frame.svg',
// //       autoScaleToA4 = true
// //     },
// //     ref
// //   ) => {
// //     // HARD-CODED header beneath logo
// //     const KNECT = {
// //       name: 'KNECTNGHOTEL SERVICES LLP',
// //       gstin: '09ABDFK5666Q1ZG',
// //       addressLines: [
// //         'Address: A-116 Urbtech Trade Centre',
// //         'Sector 132',
// //         'Noida, Gautam Buddha Nagar',
// //         'Uttar Pradesh 201304',
// //         'INDIA'
// //       ],
// //       pan: 'MRTK08622F',
// //       email: 'info@knecthotel.com',
// //       phone: '+91 9718041991'
// //     };

// //     // Numbers
// //     const rawItemsTotal = Math.max(
// //       0,
// //       items.reduce((s, it) => s + (Number(it.total) || 0), 0)
// //     );
// //     const expectedSubtotal = Math.max(
// //       0,
// //       Number(total) - Number(sgst) - Number(cgst)
// //     );
// //     const discount = Math.max(
// //       0,
// //       Number(couponDiscount) || Math.max(0, rawItemsTotal - expectedSubtotal)
// //     );
// //     const subTotal = expectedSubtotal;

// //     const pct = (amt: number, base: number) =>
// //       base > 0 ? (amt / base) * 100 : 0;
// //     const sgstPct = pct(sgst, subTotal);
// //     const cgstPct = pct(cgst, subTotal);
// //     // Render a date without any time.
// //     // Accepts already-formatted strings like "16 Sept 2025, 05:30 am" and strips the time.
// //     // Also handles ISO strings / epoch by formatting to "DD MMM YYYY" in IST.
// //     const dateOnly = (value?: string | number | Date) => {
// //       if (value === undefined || value === null || value === '') return '-';

// //       // 1) If it's a string with a trailing ", 05:30 am" (or PM), strip that part.
// //       if (typeof value === 'string') {
// //         const stripped = value.replace(/,\s*\d{1,2}:\d{2}\s*(am|pm)$/i, '');
// //         // If we actually removed time, return the stripped string as-is.
// //         if (stripped !== value) return stripped;
// //       }

// //       // 2) Try to parse as a Date (covers ISO / epoch).
// //       const d =
// //         value instanceof Date
// //           ? value
// //           : typeof value === 'number'
// //             ? new Date(value > 1e12 ? value : value * 1000)
// //             : new Date(value);

// //       if (!isNaN(d.getTime())) {
// //         return new Intl.DateTimeFormat('en-IN', {
// //           timeZone: 'Asia/Kolkata',
// //           day: '2-digit',
// //           month: 'short',
// //           year: 'numeric'
// //         }).format(d);
// //       }

// //       // 3) Fallback: return the original string (maybe it was already date-only).
// //       return String(value);
// //     };

// //     // SHARED SIZES (kept compact; actual fit is handled by scale)
// //     const FS = 12; // body font
// //     const FS_H = 16; // small heading font
// //     const PAD_Y = 6; // row y padding
// //     const PAD_X = 10;

// //     // --- Fit-to-A4 logic ---
// //     const frameRef = useRef<HTMLDivElement>(null);
// //     const contentRef = useRef<HTMLDivElement>(null);
// //     const [scale, setScale] = useState(1);

// //     // expose the outer frame via forwarded ref (for parent to print)
// //     useEffect(() => {
// //       if (!ref) return;
// //       if (typeof ref === 'function') ref(frameRef.current as HTMLDivElement);
// //       else
// //         (ref as React.MutableRefObject<HTMLDivElement | null>).current =
// //           frameRef.current;
// //     }, [ref]);

// //     // Measure and scale to fit once mounted/updated
// //     useLayoutEffect(() => {
// //       if (!autoScaleToA4) {
// //         setScale(1);
// //         return;
// //       }
// //       const frame = frameRef.current;
// //       const content = contentRef.current;
// //       if (!frame || !content) return;

// //       // Reset scale to 1 to measure the true natural height
// //       content.style.transform = 'scale(1)';
// //       content.style.transformOrigin = 'top left';

// //       // Wait a microtask for layout
// //       requestAnimationFrame(() => {
// //         const contentRect = content.getBoundingClientRect();
// //         // Available inner height in the frame (we use full A4 height)
// //         const maxW = A4_WIDTH_PX;
// //         const maxH = A4_HEIGHT_PX;

// //         // We must fit both width and height; width is already bounded by styles,
// //         // but we include it in case someone inflates widths in content.
// //         const scaleW = maxW / Math.max(1, contentRect.width);
// //         const scaleH = maxH / Math.max(1, contentRect.height);
// //         const nextScale = Math.min(1, scaleW, scaleH);

// //         setScale(nextScale);
// //       });
// //     }, [
// //       autoScaleToA4,
// //       items,
// //       acknowledgementNumber,
// //       ackDate,
// //       irnNo,
// //       invoiceNo,
// //       hotelName,
// //       hotelAddress,
// //       hotelPhone,
// //       hotelEmail,
// //       gstin,
// //       pan,
// //       bookingThrough,
// //       couponDiscount,
// //       mobile,
// //       arrival,
// //       departure,
// //       sgst,
// //       cgst,
// //       total,
// //       amountWords
// //     ]);

// //     // Compute scaled content container size so it visually fits exactly in A4 frame
// //     const contentStyle = useMemo<React.CSSProperties>(() => {
// //       return {
// //         width: A4_WIDTH_PX,
// //         // let natural height grow; the outer frame clips if needed but we scale to avoid clipping
// //         transform: `scale(${scale})`,
// //         transformOrigin: 'top left'
// //       };
// //     }, [scale]);

// //     return (
// //       <>
// //         {/* Print rules to force single A4 page without page breaks */}
// //         <style
// //           // eslint-disable-next-line react/no-danger
// //           dangerouslySetInnerHTML={{
// //             __html: `
// // @media print {
// //   @page {
// //     size: A4 portrait;
// //     margin: 0;
// //   }
// //   #invoice-a4-frame {
// //     width: ${A4_WIDTH_PX}px !important;
// //     height: ${A4_HEIGHT_PX}px !important;
// //     overflow: hidden !important;
// //     border: none !important;
// //     box-shadow: none !important;
// //     -webkit-print-color-adjust: exact;
// //     print-color-adjust: exact;
// //   }
// // }
// // `
// //           }}
// //         />
// //         {/* A4 FRAME (fixed size) */}
// //         <div
// //           id="invoice-a4-frame"
// //           ref={frameRef}
// //           style={{
// //             position: 'relative',
// //             width: A4_WIDTH_PX,
// //             height: A4_HEIGHT_PX,
// //             overflow: 'hidden', // ensure one page visually
// //             margin: '16px auto',
// //             background: '#fff',
// //             border: '1px solid #222',
// //             boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
// //           }}
// //         >
// //           {/* CONTENT (auto scales down to fit frame) */}
// //           <div ref={contentRef} style={contentStyle}>
// //             {/* Logo */}
// //             <div
// //               style={{
// //                 textAlign: 'center',
// //                 padding: '16px 0',
// //                 borderBottom: '1px solid #e8e8e8',
// //                 background: '#fff'
// //               }}
// //             >
// //               <img
// //                 src={logoSrc}
// //                 alt="Logo"
// //                 crossOrigin="anonymous"
// //                 style={{
// //                   display: 'inline-block',
// //                   height: 80,
// //                   maxWidth: '75%',
// //                   objectFit: 'contain'
// //                 }}
// //               />
// //             </div>

// //             {/* HARD-CODED header under logo */}
// //             <div style={{ padding: '12px 16px 6px' }}>
// //               <div style={{ textAlign: 'center', lineHeight: 1.3 }}>
// //                 <div
// //                   style={{
// //                     fontWeight: 800,
// //                     color: 'black',
// //                     marginTop: 2,
// //                     fontSize: FS_H
// //                   }}
// //                 >
// //                   {KNECT.name}
// //                 </div>
// //                 <div style={{ fontSize: FS }}>GSTIN NO. :{KNECT.gstin}</div>
// //                 <div style={{ fontSize: FS }}>TAN NO. {KNECT.pan}</div>
// //                 {KNECT.addressLines.map((line, i) => (
// //                   <div key={i} style={{ fontSize: FS }}>
// //                     {line}
// //                   </div>
// //                 ))}
// //                 <div style={{ fontSize: FS }}>EMAIL: {KNECT.email}</div>
// //                 <div style={{ fontSize: FS }}>Phone Number: {KNECT.phone}</div>
// //               </div>

// //               {/* Ack left / Invoice right — full-bleed line */}
// //               <div
// //                 style={{
// //                   marginTop: 8,
// //                   marginLeft: -16,
// //                   marginRight: -16,
// //                   borderTop: '1.5px solid #222',
// //                   borderBottom: '1.5px solid #222',
// //                   display: 'grid',
// //                   gridTemplateColumns: '2fr 1fr',
// //                   paddingLeft: 16,
// //                   paddingRight: 16
// //                 }}
// //               >
// //                 <div
// //                   style={{
// //                     borderRight: '1.5px solid #222',
// //                     padding: '6px 10px',
// //                     fontSize: 12
// //                   }}
// //                 >
// //                   <div>
// //                     Acknowledgement Number:{' '}
// //                     <span style={{ color: 'black' }}>
// //                       {acknowledgementNumber || '-'}
// //                     </span>
// //                   </div>
// //                   <div>
// //                     Acknowledgement Date:{' '}
// //                     <span style={{ color: 'black' }}>
// //                       {dateOnly(ackDate || '-')}
// //                     </span>
// //                   </div>
// //                   <div>
// //                     IRN No.:{' '}
// //                     <span style={{ color: 'black' }}>{irnNo || '-'}</span>
// //                   </div>
// //                 </div>
// //                 <div style={{ padding: '6px 10px', textAlign: 'right' }}>
// //                   <div style={{ fontSize: 12 }}>Invoice No.</div>
// //                   <div
// //                     style={{
// //                       fontSize: 18,
// //                       fontWeight: 800,
// //                       letterSpacing: 0.5
// //                     }}
// //                   >
// //                     {invoiceNo || '-'}
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* FROM API: Hotel Name / Address & Details (NO vertical divider) */}
// //             <div
// //               style={{
// //                 borderBottom: '1.5px solid #222',
// //                 display: 'grid',
// //                 gridTemplateColumns: '2fr 1fr'
// //               }}
// //             >
// //               <div style={{ padding: `${PAD_Y}px ${PAD_X}px` }}>
// //                 <div
// //                   style={{
// //                     display: 'grid',
// //                     gridTemplateColumns: '130px 1fr',
// //                     gap: 6,
// //                     fontSize: FS
// //                   }}
// //                 >
// //                   <div style={{ fontWeight: 700 }}>Hotel Name</div>
// //                   <div style={{ fontWeight: 700 }}>{hotelName || '-'}</div>

// //                   <div style={{ fontWeight: 700, marginTop: 4 }}>Address:</div>
// //                   <div style={{ marginTop: 4, whiteSpace: 'pre-line' }}>
// //                     {hotelAddress || '-'}
// //                   </div>

// //                   <div style={{ fontWeight: 700, marginTop: 4 }}>Email:</div>
// //                   <div>{hotelEmail || '—'}</div>

// //                   <div style={{ fontWeight: 700, marginTop: 4 }}>Phone:</div>
// //                   <div>{hotelPhone || '—'}</div>

// //                   <div style={{ fontWeight: 700, marginTop: 4 }}>
// //                     GSTIN NO.:
// //                   </div>
// //                   <div>{gstin || '—'}</div>

// //                   <div style={{ fontWeight: 700, marginTop: 4 }}>TAN NO.:</div>
// //                   <div>{pan || '-'}</div>
// //                 </div>
// //               </div>
// //               {/* Right column left blank (kept) */}
// //               <div style={{ padding: `${PAD_Y}px ${PAD_X}px` }} />
// //             </div>

// //             {/* Mobile/GST & Dates */}
// //             <div
// //               style={{
// //                 borderBottom: '1.5px solid #222',
// //                 display: 'grid',
// //                 gridTemplateColumns: '1.3fr 2.7fr'
// //               }}
// //             >
// //               <div
// //                 style={{
// //                   borderRight: '1.5px solid #222',
// //                   padding: `${PAD_Y}px ${PAD_X}px`,
// //                   fontSize: FS
// //                 }}
// //               >
// //                 <div>
// //                   <b>Mobile No.</b> {mobile || '—'}
// //                 </div>
// //                 <div style={{ marginTop: 4 }}>
// //                   <b>GSTIN:</b> {gstin || '—'}
// //                 </div>
// //               </div>

// //               <div style={{ padding: '0 12px' }}>
// //                 <div
// //                   style={{
// //                     display: 'grid',
// //                     gridTemplateColumns: '1fr 1fr',
// //                     alignItems: 'stretch',
// //                     height: '100%',
// //                     fontSize: FS
// //                   }}
// //                 >
// //                   <div
// //                     style={{
// //                       borderRight: '1.5px solid #222',
// //                       display: 'flex',
// //                       flexDirection: 'column',
// //                       justifyContent: 'center',
// //                       padding: `${PAD_Y}px 12px ${PAD_Y}px 0`
// //                     }}
// //                   >
// //                     <b>Subscription Start Date</b>
// //                     <div>{dateOnly(arrival)}</div>
// //                   </div>
// //                   <div
// //                     style={{
// //                       display: 'flex',
// //                       flexDirection: 'column',
// //                       justifyContent: 'center',
// //                       padding: `${PAD_Y}px 0 ${PAD_Y}px 12px`
// //                     }}
// //                   >
// //                     <b>Subscription End Date</b>
// //                     <div>{dateOnly(departure)}</div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Table headings */}
// //             <div
// //               style={{
// //                 borderBottom: '1.5px solid #222',
// //                 display: 'grid',
// //                 gridTemplateColumns: '6fr 4fr 2fr'
// //               }}
// //             >
// //               <div
// //                 style={{
// //                   borderRight: '1.5px solid #222',
// //                   padding: `${PAD_Y}px ${PAD_X}px`,
// //                   fontWeight: 700,
// //                   fontSize: FS
// //                 }}
// //               >
// //                 PARTICULAR
// //               </div>
// //               <div
// //                 style={{
// //                   borderRight: '1.5px solid #222',
// //                   padding: `${PAD_Y}px ${PAD_X}px`,
// //                   fontWeight: 700,
// //                   textAlign: 'center',
// //                   fontSize: FS
// //                 }}
// //               >
// //                 Items
// //               </div>
// //               <div
// //                 style={{
// //                   padding: `${PAD_Y}px ${PAD_X}px`,
// //                   fontWeight: 700,
// //                   textAlign: 'right',
// //                   fontSize: FS
// //                 }}
// //               >
// //                 Amount
// //               </div>
// //             </div>

// //             {/* Subheader row */}
// //             <div
// //               style={{
// //                 borderBottom: '1.5px solid #222',
// //                 display: 'grid',
// //                 gridTemplateColumns: '6fr 4fr 2fr'
// //               }}
// //             >
// //               <div
// //                 style={{
// //                   borderRight: '1.5px solid #222',
// //                   padding: `${PAD_Y}px ${PAD_X}px`,
// //                   fontSize: FS
// //                 }}
// //               >
// //                 SUBSCRIPTION CHARGES
// //               </div>
// //               <div
// //                 style={{
// //                   borderRight: '1.5px solid #222',
// //                   padding: `${PAD_Y}px ${PAD_X}px`,
// //                   display: 'grid',
// //                   gridTemplateColumns: '1fr 1fr 1fr',
// //                   textAlign: 'center',
// //                   fontSize: FS
// //                 }}
// //               >
// //                 <div>Rate</div>
// //                 <div>Duration</div>
// //                 <div>Total</div>
// //               </div>
// //               <div style={{ padding: `${PAD_Y}px ${PAD_X}px` }} />
// //             </div>

// //             {/* Item rows */}
// //             {items.map((it, i) => (
// //               <div
// //                 key={i}
// //                 style={{
// //                   borderBottom: '1.5px solid #222',
// //                   display: 'grid',
// //                   gridTemplateColumns: '6fr 4fr 2fr'
// //                 }}
// //               >
// //                 <div
// //                   style={{
// //                     borderRight: '1.5px solid #222',
// //                     padding: `${PAD_Y}px ${PAD_X}px`,
// //                     fontSize: FS,
// //                     fontWeight: 500
// //                   }}
// //                 >
// //                   {it.description}
// //                 </div>
// //                 <div
// //                   style={{
// //                     borderRight: '1.5px solid #222',
// //                     padding: `${PAD_Y}px ${PAD_X}px`,
// //                     display: 'grid',
// //                     gridTemplateColumns: '1fr 1fr 1fr',
// //                     textAlign: 'center',
// //                     fontSize: FS
// //                   }}
// //                 >
// //                   <div>{fmt(it.rate)}</div>
// //                   <div>{it.qty}</div>
// //                   <div>{fmt(it.total)}</div>
// //                 </div>
// //                 <div
// //                   style={{
// //                     padding: `${PAD_Y}px ${PAD_X}px`,
// //                     textAlign: 'right',
// //                     fontSize: FS
// //                   }}
// //                 >
// //                   {fmt(it.total)}
// //                 </div>
// //               </div>
// //             ))}

// //             {/* Coupon row INSIDE table (below items) */}
// //             {(bookingThrough || discount > 0) && (
// //               <div
// //                 style={{
// //                   borderBottom: '1.5px solid #222',
// //                   display: 'grid',
// //                   gridTemplateColumns: '6fr 4fr 2fr'
// //                 }}
// //               >
// //                 <div
// //                   style={{
// //                     borderRight: '1.5px solid #222',
// //                     padding: `${PAD_Y}px ${PAD_X}px`,
// //                     fontSize: FS
// //                   }}
// //                 >
// //                   Coupon Code — {bookingThrough || '-'}
// //                 </div>
// //                 <div
// //                   style={{
// //                     borderRight: '1.5px solid #222',
// //                     padding: `${PAD_Y}px ${PAD_X}px`,
// //                     display: 'grid',
// //                     gridTemplateColumns: '1fr 1fr 1fr',
// //                     textAlign: 'center',
// //                     fontSize: FS
// //                   }}
// //                 >
// //                   <div>—</div>
// //                   <div>—</div>
// //                   <div>—</div>
// //                 </div>
// //                 <div
// //                   style={{
// //                     padding: `${PAD_Y}px ${PAD_X}px`,
// //                     textAlign: 'right',
// //                     fontSize: FS
// //                   }}
// //                 >
// //                   -{fmt(discount)}
// //                 </div>
// //               </div>
// //             )}

// //             {/* Totals */}
// //             <div
// //               style={{
// //                 borderBottom: '1.5px solid #222',
// //                 display: 'grid',
// //                 gridTemplateColumns: '10fr 2fr'
// //               }}
// //             >
// //               <div
// //                 style={{
// //                   borderRight: '1.5px solid #222',
// //                   padding: `${PAD_Y}px ${PAD_X}px`,
// //                   textAlign: 'right',
// //                   fontSize: FS
// //                 }}
// //               >
// //                 Sub Total
// //               </div>
// //               <div
// //                 style={{
// //                   padding: `${PAD_Y}px ${PAD_X}px`,
// //                   textAlign: 'right',
// //                   fontSize: FS
// //                 }}
// //               >
// //                 {fmt(subTotal)}
// //               </div>
// //             </div>

// //             <div
// //               style={{
// //                 borderBottom: '1.5px solid #222',
// //                 display: 'grid',
// //                 gridTemplateColumns: '10fr 2fr'
// //               }}
// //             >
// //               <div
// //                 style={{
// //                   borderRight: '1.5px solid #222',
// //                   padding: `${PAD_Y}px ${PAD_X}px`,
// //                   textAlign: 'right',
// //                   fontSize: FS
// //                 }}
// //               >
// //                 SGST @ {sgstPct.toFixed(2)}%
// //               </div>
// //               <div
// //                 style={{
// //                   padding: `${PAD_Y}px ${PAD_X}px`,
// //                   textAlign: 'right',
// //                   fontSize: FS
// //                 }}
// //               >
// //                 {fmt(sgst)}
// //               </div>
// //             </div>

// //             <div
// //               style={{
// //                 borderBottom: '1.5px solid #222',
// //                 display: 'grid',
// //                 gridTemplateColumns: '10fr 2fr'
// //               }}
// //             >
// //               <div
// //                 style={{
// //                   borderRight: '1.5px solid #222',
// //                   padding: `${PAD_Y}px ${PAD_X}px`,
// //                   textAlign: 'right',
// //                   fontSize: FS
// //                 }}
// //               >
// //                 CGST @ {cgstPct.toFixed(2)}%
// //               </div>
// //               <div
// //                 style={{
// //                   padding: `${PAD_Y}px ${PAD_X}px`,
// //                   textAlign: 'right',
// //                   fontSize: FS
// //                 }}
// //               >
// //                 {fmt(cgst)}
// //               </div>
// //             </div>

// //             <div
// //               style={{
// //                 borderBottom: '1.5px solid #222',
// //                 display: 'grid',
// //                 gridTemplateColumns: '10fr 2fr',
// //                 fontWeight: 800
// //               }}
// //             >
// //               <div
// //                 style={{
// //                   borderRight: '1.5px solid #222',
// //                   padding: `${PAD_Y}px ${PAD_X}px`,
// //                   textAlign: 'right',
// //                   fontSize: FS
// //                 }}
// //               >
// //                 Grand Total
// //               </div>
// //               <div
// //                 style={{
// //                   padding: `${PAD_Y}px ${PAD_X}px`,
// //                   textAlign: 'right',
// //                   fontSize: FS
// //                 }}
// //               >
// //                 {fmt(total)}
// //               </div>
// //             </div>

// //             {/* Words */}
// //             <div
// //               style={{
// //                 borderBottom: '1.5px solid #222',
// //                 display: 'grid',
// //                 gridTemplateColumns: '3fr 9fr',
// //                 fontSize: FS
// //               }}
// //             >
// //               <div
// //                 style={{
// //                   borderRight: '1.5px solid #222',
// //                   padding: `${PAD_Y}px ${PAD_X}px`,
// //                   fontWeight: 700
// //                 }}
// //               >
// //                 Rupees in Word:
// //               </div>
// //               <div style={{ padding: `${PAD_Y}px ${PAD_X}px` }}>
// //                 {amountWords}
// //               </div>
// //             </div>

// //             {/* Notes / Declarations (replaces Signatures) */}
// //             <div
// //               style={{
// //                 borderTop: '1.5px solid #222',
// //                 padding: '14px 12px',
// //                 fontSize: FS,
// //                 lineHeight: 1.5
// //               }}
// //             >
// //               <div>
// //                 1. No Signature Required As It Is A System Generated Invoice.
// //               </div>
// //               <div>
// //                 2. Please Contact Us At {hotelPhone || '—'} For Any Query.
// //               </div>
// //               {/* <div>
// //                 3. Quotation Generated Are Valid For 10 days From The Date Of
// //                 Issue.
// //               </div> */}
// //             </div>
// //           </div>
// //         </div>
// //       </>
// //     );
// //   }
// // );

// // InvoiceExactA4.displayName = 'InvoiceExactA4';
// // export default InvoiceExactA4;
// 'use client';

// import React, {
//   forwardRef,
//   useEffect,
//   useLayoutEffect,
//   useMemo,
//   useRef,
//   useState
// } from 'react';

// type Item = { description: string; rate: number; qty: number; total: number };

// export type InvoiceExactProps = {
//   acknowledgementNumber: string;
//   ackDate?: string;
//   irnNo: string;
//   invoiceNo: string;

//   hotelName: string;
//   hotelAddress: string;
//   hotelPhone: string;
//   hotelEmail: string;
//   gstin: string;
//   pan: string;

//   bookingThrough: string; // coupon code
//   couponDiscount?: number; // positive number
//   mobile: string;
//   arrival: string;
//   departure: string;

//   items: Item[];
//   sgst: number;
//   cgst: number;
//   total: number;
//   amountWords: string;

//   logoSrc?: string; // default: '/Frame.svg'

//   /** If true (default), scales content so the whole thing fits into one A4 page */
//   autoScaleToA4?: boolean;
// };

// const A4_WIDTH_PX = 794; // ~8.27in @ 96dpi
// const A4_HEIGHT_PX = 1123; // ~11.69in @ 96dpi

// const fmt = (n: number) =>
//   (isFinite(n) ? n : 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

// const InvoiceExactA4 = forwardRef<HTMLDivElement, InvoiceExactProps>(
//   (
//     {
//       acknowledgementNumber,
//       ackDate,
//       irnNo,
//       invoiceNo,

//       hotelName,
//       hotelAddress,
//       hotelPhone,
//       hotelEmail,
//       gstin,
//       pan,

//       bookingThrough,
//       couponDiscount = 0,
//       mobile,
//       arrival,
//       departure,

//       items,
//       sgst,
//       cgst,
//       total,
//       amountWords,
//       logoSrc = '/Frame.svg',
//       autoScaleToA4 = true
//     },
//     ref
//   ) => {
//     // HARD-CODED header beneath logo
//     const KNECT = {
//       name: 'KNECTNGHOTEL SERVICES LLP',
//       gstin: '09ABDFK5666Q1ZG',
//       addressLines: [
//         'Address: A-116 Urbtech Trade Centre',
//         'Sector 132',
//         'Noida, Gautam Buddha Nagar',
//         'Uttar Pradesh 201304',
//         'INDIA'
//       ],
//       pan: 'MRTK08622F',
//       email: 'info@knecthotel.com',
//       phone: '+91 9718041991'
//     };

//     // Derived numbers
//     const rawItemsTotal = Math.max(
//       0,
//       items.reduce((s, it) => s + (Number(it.total) || 0), 0)
//     );
//     const expectedSubtotal = Math.max(
//       0,
//       Number(total) - Number(sgst) - Number(cgst)
//     );
//     const discount = Math.max(
//       0,
//       Number(couponDiscount) || Math.max(0, rawItemsTotal - expectedSubtotal)
//     );
//     const subTotal = expectedSubtotal;

//     const pct = (amt: number, base: number) =>
//       base > 0 ? (amt / base) * 100 : 0;
//     const sgstPct = pct(sgst, subTotal);
//     const cgstPct = pct(cgst, subTotal);

//     // Date formatter (kept as-is)
//     const dateOnly = (value?: string | number | Date) => {
//       if (value === undefined || value === null || value === '') return '-';
//       if (typeof value === 'string') {
//         const stripped = value.replace(/,\s*\d{1,2}:\d{2}\s*(am|pm)$/i, '');
//         if (stripped !== value) return stripped;
//       }
//       const d =
//         value instanceof Date
//           ? value
//           : typeof value === 'number'
//             ? new Date(value > 1e12 ? value : value * 1000)
//             : new Date(value);

//       if (!isNaN(d.getTime())) {
//         return new Intl.DateTimeFormat('en-IN', {
//           timeZone: 'Asia/Kolkata',
//           day: '2-digit',
//           month: 'short',
//           year: 'numeric'
//         }).format(d);
//       }
//       return String(value);
//     };

//     // Shared sizes
//     const FS = 12;
//     const FS_H = 16;
//     const PAD_Y = 6;
//     const PAD_X = 10;

//     // --- Responsive fit logic ---
//     const frameRef = useRef<HTMLDivElement>(null); // outer frame (A4 aspect)
//     const contentRef = useRef<HTMLDivElement>(null); // inner content (natural size A4 px)
//     const [scale, setScale] = useState(1);

//     // Expose the outer frame via forwarded ref (for parent to print)
//     useEffect(() => {
//       if (!ref) return;
//       if (typeof ref === 'function') ref(frameRef.current as HTMLDivElement);
//       else
//         (ref as React.MutableRefObject<HTMLDivElement | null>).current =
//           frameRef.current;
//     }, [ref]);

//     // Recompute scale when frame size or content changes
//     useLayoutEffect(() => {
//       if (!autoScaleToA4) {
//         setScale(1);
//         return;
//       }

//       const frame = frameRef.current;
//       const content = contentRef.current;
//       if (!frame || !content) return;

//       const compute = () => {
//         // Reset to natural size for measurement
//         content.style.transform = 'scale(1)';
//         content.style.transformOrigin = 'top left';

//         // Next frame so layout is up to date
//         requestAnimationFrame(() => {
//           const frameRect = frame.getBoundingClientRect();
//           const contentRect = content.getBoundingClientRect();

//           // Desired: fit BOTH width & height inside frame
//           // frame keeps A4 aspect; content natural size is A4 width but may grow taller (items)
//           const scaleW = frameRect.width / Math.max(1, A4_WIDTH_PX);
//           const scaleH = frameRect.height / Math.max(1, contentRect.height);
//           const nextScale = Math.min(1, scaleW, scaleH);

//           setScale(nextScale);
//         });
//       };

//       // Run once now
//       compute();

//       // Observe frame size changes
//       const ro = new ResizeObserver(() => compute());
//       ro.observe(frame);

//       // Resize images/content could change height => also listen to window resize
//       window.addEventListener('resize', compute);

//       return () => {
//         ro.disconnect();
//         window.removeEventListener('resize', compute);
//       };
//     }, [
//       autoScaleToA4,
//       items,
//       acknowledgementNumber,
//       ackDate,
//       irnNo,
//       invoiceNo,
//       hotelName,
//       hotelAddress,
//       hotelPhone,
//       hotelEmail,
//       gstin,
//       pan,
//       bookingThrough,
//       couponDiscount,
//       mobile,
//       arrival,
//       departure,
//       sgst,
//       cgst,
//       total,
//       amountWords
//     ]);

//     // Frame uses A4 aspect and fluid width; content scales to fit frame
//     const frameStyle = useMemo<React.CSSProperties>(() => {
//       return {
//         position: 'relative',
//         width: '100%',
//         maxWidth: A4_WIDTH_PX, // don’t upscale beyond your designed px width
//         aspectRatio: `${A4_WIDTH_PX} / ${A4_HEIGHT_PX}`,
//         overflow: 'hidden',
//         margin: '16px auto',
//         background: '#fff',
//         border: '1px solid #222',
//         boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
//       };
//     }, []);

//     const contentStyle = useMemo<React.CSSProperties>(() => {
//       return {
//         width: A4_WIDTH_PX,
//         transform: `scale(${scale})`,
//         transformOrigin: 'top left'
//       };
//     }, [scale]);

//     return (
//       <>
//         {/* Print rules: force true A4 with no transform for crisp output */}
//         <style
//           dangerouslySetInnerHTML={{
//             __html: `
// @media print {
//   @page { size: A4 portrait; margin: 0; }
//   #invoice-a4-frame {
//     width: ${A4_WIDTH_PX}px !important;
//     height: ${A4_HEIGHT_PX}px !important;
//     overflow: hidden !important;
//     border: none !important;
//     box-shadow: none !important;
//     -webkit-print-color-adjust: exact;
//     print-color-adjust: exact;
//   }
//   #invoice-a4-content {
//     transform: none !important;
//     width: ${A4_WIDTH_PX}px !important;
//   }
// }
// `
//           }}
//         />

//         {/* Responsive A4 FRAME */}
//         <div id="invoice-a4-frame" ref={frameRef} style={frameStyle}>
//           {/* CONTENT (scales to fit frame; resets at print) */}
//           <div id="invoice-a4-content" ref={contentRef} style={contentStyle}>
//             {/* Logo */}
//             <div
//               style={{
//                 textAlign: 'center',
//                 padding: '16px 0',
//                 borderBottom: '1px solid #e8e8e8',
//                 background: '#fff'
//               }}
//             >
//               <img
//                 src={logoSrc}
//                 alt="Logo"
//                 crossOrigin="anonymous"
//                 style={{
//                   display: 'inline-block',
//                   height: 80,
//                   maxWidth: '75%',
//                   objectFit: 'contain'
//                 }}
//               />
//             </div>

//             {/* HARD-CODED header under logo */}
//             <div style={{ padding: '12px 16px 6px' }}>
//               <div style={{ textAlign: 'center', lineHeight: 1.3 }}>
//                 <div
//                   style={{
//                     fontWeight: 800,
//                     color: 'black',
//                     marginTop: 2,
//                     fontSize: FS_H
//                   }}
//                 >
//                   {KNECT.name}
//                 </div>
//                 <div style={{ fontSize: FS }}>GSTIN NO. :{KNECT.gstin}</div>
//                 <div style={{ fontSize: FS }}>TAN NO. {KNECT.pan}</div>
//                 {KNECT.addressLines.map((line, i) => (
//                   <div key={i} style={{ fontSize: FS }}>
//                     {line}
//                   </div>
//                 ))}
//                 <div style={{ fontSize: FS }}>EMAIL: {KNECT.email}</div>
//                 <div style={{ fontSize: FS }}>Phone Number: {KNECT.phone}</div>
//               </div>

//               {/* Ack left / Invoice right — full-bleed line */}
//               <div
//                 style={{
//                   marginTop: 8,
//                   marginLeft: -16,
//                   marginRight: -16,
//                   borderTop: '1.5px solid #222',
//                   borderBottom: '1.5px solid #222',
//                   display: 'grid',
//                   gridTemplateColumns: '2fr 1fr',
//                   paddingLeft: 16,
//                   paddingRight: 16
//                 }}
//               >
//                 <div
//                   style={{
//                     borderRight: '1.5px solid #222',
//                     padding: '6px 10px',
//                     fontSize: 12
//                   }}
//                 >
//                   <div>
//                     Acknowledgement Number:{' '}
//                     <span style={{ color: 'black' }}>
//                       {acknowledgementNumber || '-'}
//                     </span>
//                   </div>
//                   <div>
//                     Acknowledgement Date:{' '}
//                     <span style={{ color: 'black' }}>
//                       {dateOnly(ackDate || '-')}
//                     </span>
//                   </div>
//                   <div>
//                     IRN No.:{' '}
//                     <span style={{ color: 'black' }}>{irnNo || '-'}</span>
//                   </div>
//                 </div>
//                 <div style={{ padding: '6px 10px', textAlign: 'right' }}>
//                   <div style={{ fontSize: 12 }}>Invoice No.</div>
//                   <div
//                     style={{
//                       fontSize: 18,
//                       fontWeight: 800,
//                       letterSpacing: 0.5
//                     }}
//                   >
//                     {invoiceNo || '-'}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* FROM API: Hotel Name / Address & Details */}
//             <div
//               style={{
//                 borderBottom: '1.5px solid #222',
//                 display: 'grid',
//                 gridTemplateColumns: '2fr 1fr'
//               }}
//             >
//               <div style={{ padding: `${PAD_Y}px ${PAD_X}px` }}>
//                 <div
//                   style={{
//                     display: 'grid',
//                     gridTemplateColumns: '130px 1fr',
//                     gap: 6,
//                     fontSize: FS
//                   }}
//                 >
//                   <div style={{ fontWeight: 700 }}>Hotel Name</div>
//                   <div style={{ fontWeight: 700 }}>{hotelName || '-'}</div>

//                   <div style={{ fontWeight: 700, marginTop: 4 }}>Address:</div>
//                   <div style={{ marginTop: 4, whiteSpace: 'pre-line' }}>
//                     {hotelAddress || '-'}
//                   </div>

//                   <div style={{ fontWeight: 700, marginTop: 4 }}>Email:</div>
//                   <div>{hotelEmail || '—'}</div>

//                   <div style={{ fontWeight: 700, marginTop: 4 }}>Phone:</div>
//                   <div>{hotelPhone || '—'}</div>

//                   <div style={{ fontWeight: 700, marginTop: 4 }}>
//                     GSTIN NO.:
//                   </div>
//                   <div>{gstin || '—'}</div>

//                   <div style={{ fontWeight: 700, marginTop: 4 }}>TAN NO.:</div>
//                   <div>{pan || '-'}</div>
//                 </div>
//               </div>
//               <div style={{ padding: `${PAD_Y}px ${PAD_X}px` }} />
//             </div>

//             {/* Mobile/GST & Dates */}
//             <div
//               style={{
//                 borderBottom: '1.5px solid #222',
//                 display: 'grid',
//                 gridTemplateColumns: '1.3fr 2.7fr'
//               }}
//             >
//               <div
//                 style={{
//                   borderRight: '1.5px solid #222',
//                   padding: `${PAD_Y}px ${PAD_X}px`,
//                   fontSize: FS
//                 }}
//               >
//                 <div>
//                   <b>Mobile No.</b> {mobile || '—'}
//                 </div>
//                 <div style={{ marginTop: 4 }}>
//                   <b>GSTIN:</b> {gstin || '—'}
//                 </div>
//               </div>

//               <div style={{ padding: '0 12px' }}>
//                 <div
//                   style={{
//                     display: 'grid',
//                     gridTemplateColumns: '1fr 1fr',
//                     alignItems: 'stretch',
//                     height: '100%',
//                     fontSize: FS
//                   }}
//                 >
//                   <div
//                     style={{
//                       borderRight: '1.5px solid #222',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       justifyContent: 'center',
//                       padding: `${PAD_Y}px 12px ${PAD_Y}px 0`
//                     }}
//                   >
//                     <b>Subscription Start Date</b>
//                     <div>{dateOnly(arrival)}</div>
//                   </div>
//                   <div
//                     style={{
//                       display: 'flex',
//                       flexDirection: 'column',
//                       justifyContent: 'center',
//                       padding: `${PAD_Y}px 0 ${PAD_Y}px 12px`
//                     }}
//                   >
//                     <b>Subscription End Date</b>
//                     <div>{dateOnly(departure)}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Table headings */}
//             <div
//               style={{
//                 borderBottom: '1.5px solid #222',
//                 display: 'grid',
//                 gridTemplateColumns: '6fr 4fr 2fr'
//               }}
//             >
//               <div
//                 style={{
//                   borderRight: '1.5px solid #222',
//                   padding: `${PAD_Y}px ${PAD_X}px`,
//                   fontWeight: 700,
//                   fontSize: FS
//                 }}
//               >
//                 PARTICULAR
//               </div>
//               <div
//                 style={{
//                   borderRight: '1.5px solid #222',
//                   padding: `${PAD_Y}px ${PAD_X}px`,
//                   display: 'grid',
//                   gridTemplateColumns: '1fr 1fr 1fr',
//                   textAlign: 'center',
//                   fontSize: FS
//                 }}
//               >
//                 <div>Rate</div>
//                 <div>Duration</div>
//                 <div>Total</div>
//               </div>
//               <div
//                 style={{
//                   padding: `${PAD_Y}px ${PAD_X}px`,
//                   fontWeight: 700,
//                   textAlign: 'right',
//                   fontSize: FS
//                 }}
//               >
//                 Amount
//               </div>
//             </div>

//             {/* Subheader row */}
//             <div
//               style={{
//                 borderBottom: '1.5px solid #222',
//                 display: 'grid',
//                 gridTemplateColumns: '6fr 4fr 2fr'
//               }}
//             >
//               <div
//                 style={{
//                   borderRight: '1.5px solid #222',
//                   padding: `${PAD_Y}px ${PAD_X}px`,
//                   fontSize: FS
//                 }}
//               >
//                 SUBSCRIPTION CHARGES
//               </div>
//               <div
//                 style={{
//                   borderRight: '1.5px solid #222',
//                   padding: `${PAD_Y}px ${PAD_X}px`,
//                   display: 'grid',
//                   gridTemplateColumns: '1fr 1fr 1fr',
//                   textAlign: 'center',
//                   fontSize: FS
//                 }}
//               >
//                 <div>Rate</div>
//                 <div>Duration</div>
//                 <div>Total</div>
//               </div>
//               <div style={{ padding: `${PAD_Y}px ${PAD_X}px` }} />
//             </div>

//             {/* Item rows */}
//             {items.map((it, i) => (
//               <div
//                 key={i}
//                 style={{
//                   borderBottom: '1.5px solid #222',
//                   display: 'grid',
//                   gridTemplateColumns: '6fr 4fr 2fr'
//                 }}
//               >
//                 <div
//                   style={{
//                     borderRight: '1.5px solid #222',
//                     padding: `${PAD_Y}px ${PAD_X}px`,
//                     fontSize: FS,
//                     fontWeight: 500
//                   }}
//                 >
//                   {it.description}
//                 </div>
//                 <div
//                   style={{
//                     borderRight: '1.5px solid #222',
//                     padding: `${PAD_Y}px ${PAD_X}px`,
//                     display: 'grid',
//                     gridTemplateColumns: '1fr 1fr 1fr',
//                     textAlign: 'center',
//                     fontSize: FS
//                   }}
//                 >
//                   <div>{fmt(it.rate)}</div>
//                   <div>{it.qty}</div>
//                   <div>{fmt(it.total)}</div>
//                 </div>
//                 <div
//                   style={{
//                     padding: `${PAD_Y}px ${PAD_X}px`,
//                     textAlign: 'right',
//                     fontSize: FS
//                   }}
//                 >
//                   {fmt(it.total)}
//                 </div>
//               </div>
//             ))}

//             {/* Coupon row */}
//             {(bookingThrough || discount > 0) && (
//               <div
//                 style={{
//                   borderBottom: '1.5px solid #222',
//                   display: 'grid',
//                   gridTemplateColumns: '6fr 4fr 2fr'
//                 }}
//               >
//                 <div
//                   style={{
//                     borderRight: '1.5px solid #222',
//                     padding: `${PAD_Y}px ${PAD_X}px`,
//                     fontSize: FS
//                   }}
//                 >
//                   Coupon Code — {bookingThrough || '-'}
//                 </div>
//                 <div
//                   style={{
//                     borderRight: '1.5px solid #222',
//                     padding: `${PAD_Y}px ${PAD_X}px`,
//                     display: 'grid',
//                     gridTemplateColumns: '1fr 1fr 1fr',
//                     textAlign: 'center',
//                     fontSize: FS
//                   }}
//                 >
//                   <div>—</div>
//                   <div>—</div>
//                   <div>—</div>
//                 </div>
//                 <div
//                   style={{
//                     padding: `${PAD_Y}px ${PAD_X}px`,
//                     textAlign: 'right',
//                     fontSize: FS
//                   }}
//                 >
//                   -{fmt(discount)}
//                 </div>
//               </div>
//             )}

//             {/* Totals */}
//             <div
//               style={{
//                 borderBottom: '1.5px solid #222',
//                 display: 'grid',
//                 gridTemplateColumns: '10fr 2fr'
//               }}
//             >
//               <div
//                 style={{
//                   borderRight: '1.5px solid #222',
//                   padding: `${PAD_Y}px ${PAD_X}px`,
//                   textAlign: 'right',
//                   fontSize: FS
//                 }}
//               >
//                 Sub Total
//               </div>
//               <div
//                 style={{
//                   padding: `${PAD_Y}px ${PAD_X}px`,
//                   textAlign: 'right',
//                   fontSize: FS
//                 }}
//               >
//                 {fmt(subTotal)}
//               </div>
//             </div>

//             <div
//               style={{
//                 borderBottom: '1.5px solid #222',
//                 display: 'grid',
//                 gridTemplateColumns: '10fr 2fr'
//               }}
//             >
//               <div
//                 style={{
//                   borderRight: '1.5px solid #222',
//                   padding: `${PAD_Y}px ${PAD_X}px`,
//                   textAlign: 'right',
//                   fontSize: FS
//                 }}
//               >
//                 SGST @ {sgstPct.toFixed(2)}%
//               </div>
//               <div
//                 style={{
//                   padding: `${PAD_Y}px ${PAD_X}px`,
//                   textAlign: 'right',
//                   fontSize: FS
//                 }}
//               >
//                 {fmt(sgst)}
//               </div>
//             </div>

//             <div
//               style={{
//                 borderBottom: '1.5px solid #222',
//                 display: 'grid',
//                 gridTemplateColumns: '10fr 2fr'
//               }}
//             >
//               <div
//                 style={{
//                   borderRight: '1.5px solid #222',
//                   padding: `${PAD_Y}px ${PAD_X}px`,
//                   textAlign: 'right',
//                   fontSize: FS
//                 }}
//               >
//                 CGST @ {cgstPct.toFixed(2)}%
//               </div>
//               <div
//                 style={{
//                   padding: `${PAD_Y}px ${PAD_X}px`,
//                   textAlign: 'right',
//                   fontSize: FS
//                 }}
//               >
//                 {fmt(cgst)}
//               </div>
//             </div>

//             <div
//               style={{
//                 borderBottom: '1.5px solid #222',
//                 display: 'grid',
//                 gridTemplateColumns: '10fr 2fr',
//                 fontWeight: 800
//               }}
//             >
//               <div
//                 style={{
//                   borderRight: '1.5px solid #222',
//                   padding: `${PAD_Y}px ${PAD_X}px`,
//                   textAlign: 'right',
//                   fontSize: FS
//                 }}
//               >
//                 Grand Total
//               </div>
//               <div
//                 style={{
//                   padding: `${PAD_Y}px ${PAD_X}px`,
//                   textAlign: 'right',
//                   fontSize: FS
//                 }}
//               >
//                 {fmt(total)}
//               </div>
//             </div>

//             {/* Words */}
//             <div
//               style={{
//                 borderBottom: '1.5px solid #222',
//                 display: 'grid',
//                 gridTemplateColumns: '3fr 9fr',
//                 fontSize: FS
//               }}
//             >
//               <div
//                 style={{
//                   borderRight: '1.5px solid #222',
//                   padding: `${PAD_Y}px ${PAD_X}px`,
//                   fontWeight: 700
//                 }}
//               >
//                 Rupees in Word:
//               </div>
//               <div style={{ padding: `${PAD_Y}px ${PAD_X}px` }}>
//                 {amountWords}
//               </div>
//             </div>

//             {/* Notes */}
//             <div
//               style={{
//                 borderTop: '1.5px solid #222',
//                 padding: '14px 12px',
//                 fontSize: FS,
//                 lineHeight: 1.5
//               }}
//             >
//               <div>
//                 1. No Signature Required As It Is A System Generated Invoice.
//               </div>
//               <div>
//                 2. Please Contact Us At {hotelPhone || '—'} For Any Query.
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }
// );

// InvoiceExactA4.displayName = 'InvoiceExactA4';
// export default InvoiceExactA4;
'use client';

import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';

type Item = { description: string; rate: number; qty: number; total: number };

export type InvoiceExactProps = {
  acknowledgementNumber: string;
  ackDate?: string;
  irnNo: string;
  invoiceNo: string;

  hotelName: string;
  hotelAddress: string;
  hotelPhone: string;
  hotelEmail: string;
  gstin: string;
  pan: string;

  bookingThrough: string; // coupon code
  couponDiscount?: number; // positive number
  mobile: string;
  arrival: string;
  departure: string;

  items: Item[];
  sgst: number;
  cgst: number;
  total: number;
  amountWords: string;

  logoSrc?: string; // default: '/Frame.svg'
  autoScaleToA4?: boolean; // default true
};

const A4_WIDTH_PX = 794; // ~8.27in @ 96dpi
const A4_HEIGHT_PX = 1123; // ~11.69in @ 96dpi

const fmt = (n: number) =>
  (isFinite(n) ? n : 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

const InvoiceExactA4 = forwardRef<HTMLDivElement, InvoiceExactProps>(
  (
    {
      acknowledgementNumber,
      ackDate,
      irnNo,
      invoiceNo,

      hotelName,
      hotelAddress,
      hotelPhone,
      hotelEmail,
      gstin,
      pan,

      bookingThrough,
      couponDiscount = 0,
      mobile,
      arrival,
      departure,

      items,
      sgst,
      cgst,
      total,
      amountWords,
      logoSrc = '/Frame.svg',
      autoScaleToA4 = true
    },
    ref
  ) => {
    // ---- Firm header (fixed) ----
    const KNECT = {
      name: 'KNECTHOTEL SERVICES LLP', // ✅ fixed spelling
      gstin: '09ABDFK5666Q1ZG',
      addressLines: [
        'Address: A-116 Urbtech Trade Centre',
        'Sector 132',
        'Noida, Gautam Buddha Nagar',
        'Uttar Pradesh 201304',
        'INDIA'
      ],
      tan: 'MRTK08622F',
      email: 'info@knecthotel.com',
      phone: '+91 9718041991'
    };

    // ---- Numbers / derived ----
    const rawItemsTotal = Math.max(
      0,
      items.reduce((s, it) => s + (Number(it.total) || 0), 0)
    );
    const expectedSubtotal = Math.max(
      0,
      Number(total) - Number(sgst) - Number(cgst)
    );
    const discount = Math.max(
      0,
      Number(couponDiscount) || Math.max(0, rawItemsTotal - expectedSubtotal)
    );
    const subTotal = expectedSubtotal;

    const pct = (amt: number, base: number) =>
      base > 0 ? (amt / base) * 100 : 0;
    const sgstPct = pct(sgst, subTotal);
    const cgstPct = pct(cgst, subTotal);

    // ---- Date formatter: date-only, tolerant ----
    const dateOnly = (value?: string | number | Date) => {
      if (value === undefined || value === null || value === '') return '-';
      if (typeof value === 'string') {
        const stripped = value.replace(/,\s*\d{1,2}:\d{2}\s*(am|pm)$/i, '');
        if (stripped !== value) return stripped;
      }
      const d =
        value instanceof Date
          ? value
          : typeof value === 'number'
            ? new Date(value > 1e12 ? value : value * 1000)
            : new Date(value);
      if (!isNaN(d.getTime())) {
        return new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }).format(d);
      }
      return String(value);
    };

    // ---- Typography / spacing ----
    const FS = 12; // body
    const FS_H = 16; // small heading
    const PAD_Y = 6;
    const PAD_X = 10;

    // ---- Fit-to-A4 (height-first to avoid width squish) ----
    const frameRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    // forward outer frame
    useEffect(() => {
      if (!ref) return;
      if (typeof ref === 'function') ref(frameRef.current as HTMLDivElement);
      else
        (ref as React.MutableRefObject<HTMLDivElement | null>).current =
          frameRef.current;
    }, [ref]);

    useLayoutEffect(() => {
      if (!autoScaleToA4) {
        setScale(1);
        return;
      }
      const frame = frameRef.current;
      const content = contentRef.current;
      if (!frame || !content) return;

      content.style.transform = 'scale(1)';
      content.style.transformOrigin = 'top left';

      requestAnimationFrame(() => {
        const r = content.getBoundingClientRect();
        const maxH = A4_HEIGHT_PX;
        // Only height-fit (width is already fixed to A4)
        const needed = maxH / Math.max(1, r.height);
        // Round to 2 decimals (stops subpixel fuzz on fonts)
        const next = Math.min(1, Math.max(0.1, Math.round(needed * 100) / 100));
        setScale(next);
      });
    }, [
      autoScaleToA4,
      items,
      acknowledgementNumber,
      ackDate,
      irnNo,
      invoiceNo,
      hotelName,
      hotelAddress,
      hotelPhone,
      hotelEmail,
      gstin,
      pan,
      bookingThrough,
      couponDiscount,
      mobile,
      arrival,
      departure,
      sgst,
      cgst,
      total,
      amountWords
    ]);

    const contentStyle = useMemo<React.CSSProperties>(
      () => ({
        width: A4_WIDTH_PX,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        // ✅ Better text rendering when scaled
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }),
      [scale]
    );

    const monoRowBorder = '1.5px solid #222';

    return (
      <>
        <style
          dangerouslySetInnerHTML={{
            __html: `
@media print {
  @page { size: A4 portrait; margin: 0; }
  #invoice-a4-frame {
    width: ${A4_WIDTH_PX}px !important;
    height: ${A4_HEIGHT_PX}px !important;
    overflow: hidden !important;
    border: none !important;
    box-shadow: none !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
`
          }}
        />
        <div
          id="invoice-a4-frame"
          ref={frameRef}
          style={{
            position: 'relative',
            width: A4_WIDTH_PX,
            height: A4_HEIGHT_PX,
            overflow: 'hidden',
            margin: '16px auto',
            background: '#fff',
            border: '1px solid #222',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            // ✅ Global type hygiene
            fontFamily:
              "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,Helvetica,sans-serif",
            color: '#222',
            lineHeight: 1.35
          }}
        >
          <div ref={contentRef} style={contentStyle}>
            {/* Logo */}
            <div
              style={{
                textAlign: 'center',
                padding: '16px 0 12px',
                borderBottom: '1px solid #e8e8e8',
                background: '#fff'
              }}
            >
              <img
                src={logoSrc}
                alt="Logo"
                crossOrigin="anonymous"
                style={{
                  display: 'inline-block',
                  height: 80,
                  maxWidth: '75%',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Firm header */}
            <div style={{ padding: '12px 16px 6px' }}>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontWeight: 800,
                    color: '#000',
                    marginTop: 2,
                    fontSize: FS_H,
                    letterSpacing: 0.3 // ✅ crisper heading
                  }}
                >
                  {KNECT.name}
                </div>
                <div style={{ fontSize: FS, marginTop: 2 }}>
                  <b>GSTIN No.</b>&nbsp;{KNECT.gstin}
                </div>
                <div style={{ fontSize: FS }}>
                  <b>TAN No.</b>&nbsp;{KNECT.tan}
                </div>
                {KNECT.addressLines.map((line, i) => (
                  <div key={i} style={{ fontSize: FS }}>
                    {line}
                  </div>
                ))}
                <div style={{ fontSize: FS, marginTop: 2 }}>
                  <b>Email:</b>&nbsp;{KNECT.email}
                </div>
                <div style={{ fontSize: FS }}>
                  <b>Phone:</b>&nbsp;{KNECT.phone}
                </div>
              </div>

              {/* Ack / Invoice */}
              <div
                style={{
                  marginTop: 10,
                  marginLeft: -16,
                  marginRight: -16,
                  borderTop: monoRowBorder,
                  borderBottom: monoRowBorder,
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  paddingLeft: 16,
                  paddingRight: 16
                }}
              >
                <div
                  style={{
                    borderRight: monoRowBorder,
                    padding: '6px 10px',
                    fontSize: 12
                  }}
                >
                  <div>
                    <b>Acknowledgement Number:</b>{' '}
                    <span>{acknowledgementNumber || '-'}</span>
                  </div>
                  <div>
                    <b>Acknowledgement Date:</b>{' '}
                    <span>{dateOnly(ackDate || '-')}</span>
                  </div>
                  <div>
                    <b>IRN No.:</b> <span>{irnNo || '-'}</span>
                  </div>
                </div>
                <div style={{ padding: '6px 10px', textAlign: 'right' }}>
                  <div style={{ fontSize: 12, opacity: 0.9 }}>Invoice No.</div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      letterSpacing: 0.4
                    }}
                  >
                    {invoiceNo || '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Hotel / Client block */}
            <div
              style={{
                borderBottom: monoRowBorder,
                display: 'grid',
                gridTemplateColumns: '2fr 1fr'
              }}
            >
              <div style={{ padding: `${PAD_Y}px ${PAD_X}px` }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '130px 1fr',
                    gap: 6,
                    fontSize: FS
                  }}
                >
                  <div style={{ fontWeight: 700 }}>Hotel Name</div>
                  <div style={{ fontWeight: 700 }}>{hotelName || '-'}</div>

                  <div style={{ fontWeight: 700, marginTop: 4 }}>Address:</div>
                  <div style={{ marginTop: 4, whiteSpace: 'pre-line' }}>
                    {hotelAddress || '-'}
                  </div>

                  <div style={{ fontWeight: 700, marginTop: 4 }}>Email:</div>
                  <div>{hotelEmail || '—'}</div>

                  <div style={{ fontWeight: 700, marginTop: 4 }}>Phone:</div>
                  <div>{hotelPhone || '—'}</div>

                  <div style={{ fontWeight: 700, marginTop: 4 }}>
                    GSTIN No.:
                  </div>
                  <div>{gstin || '—'}</div>

                  <div style={{ fontWeight: 700, marginTop: 4 }}>TAN No.:</div>
                  <div>{pan || '-'}</div>
                </div>
              </div>
              <div style={{ padding: `${PAD_Y}px ${PAD_X}px` }} />
            </div>

            {/* Contacts & Dates */}
            <div
              style={{
                borderBottom: monoRowBorder,
                display: 'grid',
                gridTemplateColumns: '1.3fr 2.7fr'
              }}
            >
              <div
                style={{
                  borderRight: monoRowBorder,
                  padding: `${PAD_Y}px ${PAD_X}px`,
                  fontSize: FS
                }}
              >
                <div>
                  <b>Mobile No.</b>&nbsp;{mobile || '—'}
                </div>
                <div style={{ marginTop: 4 }}>
                  <b>GSTIN:</b>&nbsp;{gstin || '—'}
                </div>
              </div>

              <div style={{ padding: '0 12px' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    alignItems: 'stretch',
                    height: '100%',
                    fontSize: FS
                  }}
                >
                  <div
                    style={{
                      borderRight: monoRowBorder,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: `${PAD_Y}px 12px ${PAD_Y}px 0`
                    }}
                  >
                    <b>Subscription Start Date</b>
                    <div>{dateOnly(arrival)}</div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: `${PAD_Y}px 0 ${PAD_Y}px 12px`
                    }}
                  >
                    <b>Subscription End Date</b>
                    <div>{dateOnly(departure)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table header */}
            <div
              style={{
                borderBottom: monoRowBorder,
                display: 'grid',
                gridTemplateColumns: '6fr 4fr 2fr'
              }}
            >
              <div
                style={{
                  borderRight: monoRowBorder,
                  padding: `${PAD_Y}px ${PAD_X}px`,
                  fontWeight: 700,
                  fontSize: FS
                }}
              >
                PARTICULAR
              </div>
              <div
                style={{
                  borderRight: monoRowBorder,
                  padding: `${PAD_Y}px ${PAD_X}px`,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  textAlign: 'center',
                  fontSize: FS,
                  fontWeight: 700
                }}
              >
                <div>Rate</div>
                <div>Duration</div>
                <div>Total</div>
              </div>
              <div
                style={{
                  padding: `${PAD_Y}px ${PAD_X}px`,
                  fontWeight: 700,
                  textAlign: 'right',
                  fontSize: FS
                }}
              >
                Amount
              </div>
            </div>

            {/* Items */}
            {items.map((it, i) => (
              <div
                key={i}
                style={{
                  borderBottom: monoRowBorder,
                  display: 'grid',
                  gridTemplateColumns: '6fr 4fr 2fr'
                }}
              >
                <div
                  style={{
                    borderRight: monoRowBorder,
                    padding: `${PAD_Y}px ${PAD_X}px`,
                    fontSize: FS,
                    fontWeight: 500
                  }}
                >
                  {it.description}
                </div>
                <div
                  style={{
                    borderRight: monoRowBorder,
                    padding: `${PAD_Y}px ${PAD_X}px`,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    textAlign: 'center',
                    fontSize: FS
                  }}
                >
                  <div>{fmt(it.rate)}</div>
                  <div>{it.qty}</div>
                  <div>{fmt(it.total)}</div>
                </div>
                <div
                  style={{
                    padding: `${PAD_Y}px ${PAD_X}px`,
                    textAlign: 'right',
                    fontSize: FS
                  }}
                >
                  {fmt(it.total)}
                </div>
              </div>
            ))}

            {/* Coupon row */}
            {(bookingThrough || discount > 0) && (
              <div
                style={{
                  borderBottom: monoRowBorder,
                  display: 'grid',
                  gridTemplateColumns: '6fr 4fr 2fr'
                }}
              >
                <div
                  style={{
                    borderRight: monoRowBorder,
                    padding: `${PAD_Y}px ${PAD_X}px`,
                    fontSize: FS
                  }}
                >
                  Coupon Code — {bookingThrough || '-'}
                </div>
                <div
                  style={{
                    borderRight: monoRowBorder,
                    padding: `${PAD_Y}px ${PAD_X}px`,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    textAlign: 'center',
                    fontSize: FS
                  }}
                >
                  <div>—</div>
                  <div>—</div>
                  <div>—</div>
                </div>
                <div
                  style={{
                    padding: `${PAD_Y}px ${PAD_X}px`,
                    textAlign: 'right',
                    fontSize: FS
                  }}
                >
                  -{fmt(discount)}
                </div>
              </div>
            )}

            {/* Totals */}
            <div
              style={{
                borderBottom: monoRowBorder,
                display: 'grid',
                gridTemplateColumns: '10fr 2fr'
              }}
            >
              <div
                style={{
                  borderRight: monoRowBorder,
                  padding: `${PAD_Y}px ${PAD_X}px`,
                  textAlign: 'right',
                  fontSize: FS
                }}
              >
                Sub Total
              </div>
              <div
                style={{
                  padding: `${PAD_Y}px ${PAD_X}px`,
                  textAlign: 'right',
                  fontSize: FS
                }}
              >
                {fmt(subTotal)}
              </div>
            </div>

            <div
              style={{
                borderBottom: monoRowBorder,
                display: 'grid',
                gridTemplateColumns: '10fr 2fr'
              }}
            >
              <div
                style={{
                  borderRight: monoRowBorder,
                  padding: `${PAD_Y}px ${PAD_X}px`,
                  textAlign: 'right',
                  fontSize: FS
                }}
              >
                SGST @ {sgstPct.toFixed(2)}%
              </div>
              <div
                style={{
                  padding: `${PAD_Y}px ${PAD_X}px`,
                  textAlign: 'right',
                  fontSize: FS
                }}
              >
                {fmt(sgst)}
              </div>
            </div>

            <div
              style={{
                borderBottom: monoRowBorder,
                display: 'grid',
                gridTemplateColumns: '10fr 2fr'
              }}
            >
              <div
                style={{
                  borderRight: monoRowBorder,
                  padding: `${PAD_Y}px ${PAD_X}px`,
                  textAlign: 'right',
                  fontSize: FS
                }}
              >
                CGST @ {cgstPct.toFixed(2)}%
              </div>
              <div
                style={{
                  padding: `${PAD_Y}px ${PAD_X}px`,
                  textAlign: 'right',
                  fontSize: FS
                }}
              >
                {fmt(cgst)}
              </div>
            </div>

            <div
              style={{
                borderBottom: monoRowBorder,
                display: 'grid',
                gridTemplateColumns: '10fr 2fr',
                fontWeight: 800
              }}
            >
              <div
                style={{
                  borderRight: monoRowBorder,
                  padding: `${PAD_Y}px ${PAD_X}px`,
                  textAlign: 'right',
                  fontSize: FS
                }}
              >
                Grand Total
              </div>
              <div
                style={{
                  padding: `${PAD_Y}px ${PAD_X}px`,
                  textAlign: 'right',
                  fontSize: FS
                }}
              >
                {fmt(total)}
              </div>
            </div>

            {/* Rupees in words */}
            <div
              style={{
                borderBottom: monoRowBorder,
                display: 'grid',
                gridTemplateColumns: '3fr 9fr',
                fontSize: FS
              }}
            >
              <div
                style={{
                  borderRight: monoRowBorder,
                  padding: `${PAD_Y}px ${PAD_X}px`,
                  fontWeight: 700
                }}
              >
                Rupees in Word:
              </div>
              <div style={{ padding: `${PAD_Y}px ${PAD_X}px` }}>
                {amountWords}
              </div>
            </div>

            {/* Notes */}
            <div
              style={{
                borderTop: monoRowBorder,
                padding: '14px 12px',
                fontSize: FS,
                lineHeight: 1.45
              }}
            >
              <div>
                1. No Signature Required as it is a system generated invoice.
              </div>
              <div>
                2. For any query, please contact us at {hotelPhone || '—'}.
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);

InvoiceExactA4.displayName = 'InvoiceExactA4';
export default InvoiceExactA4;

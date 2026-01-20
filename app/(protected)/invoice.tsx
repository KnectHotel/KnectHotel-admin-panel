
























































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































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

  bookingThrough: string; 
  couponDiscount?: number; 
  mobile: string;
  arrival: string;
  departure: string;

  items: Item[];
  sgst: number;
  cgst: number;
  total: number;
  amountWords: string;

  logoSrc?: string; 
  autoScaleToA4?: boolean; 
};

const A4_WIDTH_PX = 794; 
const A4_HEIGHT_PX = 1123; 

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
    
    const KNECT = {
      name: 'KNECTHOTEL SERVICES LLP', 
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

    
    const FS = 12; 
    const FS_H = 16; 
    const PAD_Y = 6;
    const PAD_X = 10;

    
    const frameRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    
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
        
        const needed = maxH / Math.max(1, r.height);
        
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
            
            fontFamily:
              "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,Helvetica,sans-serif",
            color: '#222',
            lineHeight: 1.35
          }}
        >
          <div ref={contentRef} style={contentStyle}>
            {}
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

            {}
            <div style={{ padding: '12px 16px 6px' }}>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontWeight: 800,
                    color: '#000',
                    marginTop: 2,
                    fontSize: FS_H,
                    letterSpacing: 0.3 
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

              {}
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

            {}
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

            {}
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

            {}
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

            {}
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

            {}
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

            {}
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

            {}
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

            {}
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

// 'use client';
// import React, { useEffect, useState } from 'react';
// import apiCall from '@/lib/axios';
// import Image from 'next/image';
// import { Switch } from '@/components/ui/switch';

// interface ConciergeItem {
//   _id: string;
//   name: string;
//   description: string;
//   category: string;
//   serviceType: string;
//   distance: number;
//   imageUrl?: string;
// }

// const ProductDetailsPage = () => {
//   const [items, setItems] = useState<Record<string, ConciergeItem[]>>({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchConciergeItems = async () => {
//       try {
//         const res = await apiCall('GET', '/api/services/concierge/items/admin');
//         if (res.success) {
//           setItems(res.data || {});
//         }
//       } catch (error) {
//         console.error('Failed to fetch concierge items:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchConciergeItems();
//   }, []);

//   if (loading) {
//     return <div className="text-center py-12">Loading concierge items...</div>;
//   }

//   return (
//     <div className="mt-20 w-full px-4">
//       {Object.entries(items).map(([serviceType, products]) => (
//         <div key={serviceType} className="mb-12 space-y-6">
//           <h2 className="text-xl text-coffee font-semibold border-b pb-1 border-coffee/40">
//             {serviceType}
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {products.map((product) => (
//               <div
//                 key={product._id}
//                 className="bg-[#FAF6EF] border border-[#E6D6C2] rounded-xl shadow-sm p-4 flex flex-col gap-4 hover:shadow-md transition duration-200"
//               >
//                 <div className="w-full h-40 overflow-hidden rounded-md">
//                   <Image
//                     src={product.imageUrl || '/fallback.png'}
//                     alt={product.name}
//                     width={400}
//                     height={160}
//                     className="w-full h-full object-cover transition-transform hover:scale-105"
//                   />
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <h3 className="text-lg font-bold text-[#4B3F2F]">{product.name}</h3>
//                   <Switch className="h-4 w-11" />
//                 </div>

//                 <p className="text-sm text-gray-600">{product.description}</p>

//                 <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
//                   <div>
//                     <span className="font-semibold text-[#4B3F2F]">Category:</span> {product.category}
//                   </div>
//                   <div>
//                     <span className="font-semibold text-[#4B3F2F]">Distance:</span> {product.distance} km
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ProductDetailsPage;



'use client';
import React, { useEffect, useState } from 'react';
import apiCall from '@/lib/axios';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';

/* ---------- Image helpers (URL or S3 Key) ---------- */
const S3_BASE = 'https://dibstestbucket0403.s3.ap-south-1.amazonaws.com';
const FALLBACK = '/fallback.png';

const keyToUrl = (value?: string | null) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `${S3_BASE}/${value.replace(/^\/+/, '')}`;
};

const resolveImage = (value?: string | null) => keyToUrl(value) || FALLBACK;
/* --------------------------------------------------- */

interface ConciergeItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  serviceType: string;
  distance: number;
  imageUrl?: string | null; // may be URL or S3 key
}

/* Small card component so each image can manage its own fallback state */
function ConciergeCard({ item, priority = false }: { item: ConciergeItem; priority?: boolean }) {
  const [imgErr, setImgErr] = useState(false);
  const src = imgErr ? FALLBACK : resolveImage(item.imageUrl);

  return (
    <article
      className="group overflow-hidden rounded-2xl border border-[#E6D6C2] bg-[#FAF6EF]
                 shadow-[0_1px_0_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                 transition-all duration-300"
    >
      {/* Image (taller + consistent aspect) */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/10] bg-white/40">
        <Image
          src={src}
          alt={item.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
          onError={() => setImgErr(true)}
        />
        {/* Category badge */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#4B3F2F] shadow">
          {item.category || 'General'}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base md:text-lg font-semibold text-[#3E3428] leading-tight line-clamp-2">
            {item.name}
          </h3>
          {/* <Switch className="mt-[2px] h-4 w-11" /> */}
        </div>

        <p className="text-sm text-gray-700/90 leading-relaxed line-clamp-3">
          {item.description}
        </p>

        <div className="mt-1 flex items-center justify-between">
          {/* Distance pill */}
          <span className="inline-flex items-center gap-1 rounded-full border border-[#E6D6C2] bg-white px-3 py-1 text-xs font-medium text-[#4B3F2F]">
            <svg width="14" height="14" viewBox="0 0 24 24" className="opacity-80">
              <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
            </svg>
            {item.distance} km
          </span>

          {/* Service chip */}
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#7A5C3E]">
            {item.serviceType}
          </span>
        </div>
      </div>
    </article>
  );
}

const ProductDetailsPage = () => {
  const [items, setItems] = useState<Record<string, ConciergeItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiCall('GET', '/api/services/concierge/items/admin');
        if (res.success) setItems(res.data || {});
      } catch (error) {
        console.error('Failed to fetch concierge items:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="mt-24 text-center text-gray-600">
        Loading concierge items…
      </div>
    );
  }

  return (
    <div className="mt-20 w-full px-4 md:px-6 lg:px-8">
      {Object.entries(items).map(([serviceType, products]) => (
        <section key={serviceType} className="mb-14 space-y-6">
          <header className="flex items-center gap-3">
            <div className="h-7 w-1 rounded bg-[#7A5C3E]" />
            <h2 className="text-2xl font-semibold text-[#4B3F2F] tracking-tight">
              {serviceType}
            </h2>
          </header>

          {/* EXACTLY TWO CARDS PER ROW (mobile: 1) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((p, idx) => (
              <ConciergeCard key={p._id} item={p} priority={idx < 2} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ProductDetailsPage;

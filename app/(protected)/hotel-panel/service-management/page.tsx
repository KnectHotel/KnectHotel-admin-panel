// 'use client';

// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import ToggleButton from '@/components/ui/toggleButton';
// import { useRouter } from 'next/navigation';
// import Navbar from '@/components/Navbar';
// import { Heading } from '@/components/ui/heading';
// import apiCall from '@/lib/axios';
// import { getSessionStorageItem } from 'utils/localstorage';
// import { all } from 'axios';
// import { allServices } from 'utils/allservices';



// // static list of all services

// const ServiceManagementPage = () => {
//   const router = useRouter();
//   const [highlightedKey, setHighlightedKey] = useState<string | null>(null);
//   const [enabledServices, setEnabledServices] = useState<
//     Record<string, boolean>
//   >({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [allowedModules, setAllowedModules] = useState<any>(null);

//   useEffect(() => {
//     setAllowedModules(getSessionStorageItem<any>('admin').allowedModules);
//   }, []);


//   const handleNavigation = (href: string, isEnabled: boolean) => {
//     if (!isEnabled) return;
//     const key = href.split('/').pop();
//     if (key) {
//       localStorage.setItem('lastClickedService', key);
//       setHighlightedKey(key);
//       router.push(href);
//     }
//   };

//   const handleToggleService = (key: string, newState: boolean) => {
//     setEnabledServices((prev) => ({
//       ...prev,
//       [key]: newState
//     }));
//   };

//   useEffect(() => {
//     const lastClicked = localStorage.getItem('lastClickedService');
//     if (lastClicked) {
//       setHighlightedKey(lastClicked);
//       setTimeout(() => {
//         setHighlightedKey(null);
//         localStorage.removeItem('lastClickedService');
//       }, 10000);
//     }
//   }, []);

//   useEffect(() => {
//     if (getSessionStorageItem<any>('admin')?.allowedModules?.[0] === null) {
//       const initialStatus: Record<string, boolean> = {};
//       allServices.forEach((service) => {
//         initialStatus[service.name] = true
//       });
//       setEnabledServices(initialStatus);
//       setLoading(false);
//     } else {
//       const initialStatus: Record<string, boolean> = {};
//       allServices.forEach((service: any) => {
//         initialStatus[service.name] = allServices
//           .filter(service => getSessionStorageItem<any>('admin').allowedModules?.includes(service.name))
//           .map(service => service.name).includes(
//             service.name
//           );
//       });
//       setEnabledServices(initialStatus);
//       setLoading(false);
//     }

//   }, []);

//   return (
//     <div className="flex flex-col w-full">
//       <Navbar />
//       <div className="overflow-hidden flex flex-col justify-evenly py-4 gap-6 mt-14">
//         <Heading title="Service Management" className="px-6 mb-0 md:mb-0" />

//         {loading ? (
//           <p className="text-center text-gray-500">Loading services...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : (
//           <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
//             {allServices.map((service) => {
//               const isEnabled = enabledServices[service.name] ?? false;
//               const isHighlighted = highlightedKey === service.name;

//               return (
//                 <div
//                   key={service.id}
//                   className={`flex flex-col gap-2 group ${isEnabled ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'} ${isHighlighted ? 'shadow-sm bg-gray-100 rounded-md' : ''
//                     }`}
//                 >
//                   <div
//                     onClick={() => handleNavigation(service.href, isEnabled)}
//                   >
//                     <Image
//                       src={service.imgSrc}
//                       alt={service.displayName}
//                       width={1000}
//                       height={1000}
//                       className="rounded"
//                     />
//                   </div>

//                   <div className="w-full flex justify-between items-center">
//                     <h2
//                       onClick={() => handleNavigation(service.href, isEnabled)}
//                       className={`px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300 ${isHighlighted
//                         ? 'bg-[#453519] text-white'
//                         : 'bg-[#EFE9DF]'
//                         }`}
//                     >
//                       {service.displayName}
//                     </h2>
//                     <ToggleButton
//                       serviceName={service.name}
//                       enabled={isEnabled}
//                       onCheckedChange={(newState) =>
//                         handleToggleService(service.name, newState)
//                       }
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ServiceManagementPage;



'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import ToggleButton from '@/components/ui/toggleButton';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Heading } from '@/components/ui/heading';
import apiCall from '@/lib/axios';
import { getSessionStorageItem } from 'utils/localstorage';
import { allServices } from 'utils/allservices';

type GstItem = { serviceName: string; gstPercentage: number; _id: string };
type GstDoc = { _id: string; gstPercentageForServices: GstItem[] };

const DEFAULT_GST = 18;
const GST_WHITELIST = new Set(['housekeeping', 'inroomdining', 'gym', 'swimmingpool', 'spa']);

const normalize = (s: string) => s?.toLowerCase().replace(/\s+|_/g, '') || '';
const ALIASES: Record<string, string> = { inroomdining: 'inroomdining' };

// GET shape helpers
function pickDocs(res: any): GstDoc[] {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

// POST shape helpers (aapke sample ke hisaab se)
function pickUpdatedListFromPost(res: any): GstItem[] | null {
  // sample: { success, message, data: { gstPercentageForServices: [...] } }
  const list =
    res?.data?.gstPercentageForServices ??
    res?.data?.data?.gstPercentageForServices ??
    res?.gstPercentageForServices ??
    null;
  return Array.isArray(list) ? list : null;
}

const ServiceManagementPage = () => {
  const router = useRouter();

  const [highlightedKey, setHighlightedKey] = useState<string | null>(null);
  const [enabledServices, setEnabledServices] = useState<Record<string, boolean>>({});
  const [allowedModules, setAllowedModules] = useState<string[] | null>(null);

  const [gstMap, setGstMap] = useState<Record<string, number>>({});
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingGst, setLoadingGst] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editServiceKey, setEditServiceKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('18');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // --- Load allowedModules + initialize enabled map
  useEffect(() => {
    try {
      const admin = getSessionStorageItem<any>('admin');
      const modules: string[] | null = admin?.allowedModules ?? null;
      setAllowedModules(modules ?? null);

      const initial: Record<string, boolean> = {};
      const enableAll = !modules || modules[0] === null;

      allServices.forEach((svc: any) => {
        initial[svc.name] = enableAll ? true : !!modules?.includes(svc.name);
      });

      setEnabledServices(initial);
      setLoadingServices(false);
    } catch (e) {
      setError('Failed to read allowed modules.');
      setLoadingServices(false);
    }
  }, []);

  // --- GET GST
  useEffect(() => {
    const fetchGst = async () => {
      setLoadingGst(true);
      setError('');
      try {
        const res = await apiCall<any>('GET', 'api/services/gstPercentage');
        const docs = pickDocs(res);
        const list: GstItem[] = docs?.[0]?.gstPercentageForServices ?? [];

        const map: Record<string, number> = {};
        list.forEach(({ serviceName, gstPercentage }) => {
          const k = ALIASES[normalize(serviceName)] || normalize(serviceName);
          if (k) map[k] = gstPercentage;
        });

        setGstMap(map);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to fetch GST percentages.');
      } finally {
        setLoadingGst(false);
      }
    };
    fetchGst();
  }, []);

  // --- Remember last clicked service for highlight
  useEffect(() => {
    const lastClicked = localStorage.getItem('lastClickedService');
    if (lastClicked) {
      setHighlightedKey(lastClicked);
      const t = setTimeout(() => {
        setHighlightedKey(null);
        localStorage.removeItem('lastClickedService');
      }, 10000);
      return () => clearTimeout(t);
    }
  }, []);

  const handleNavigation = (href: string, isEnabled: boolean) => {
    if (!isEnabled) return;
    const key = href.split('/').pop();
    if (key) {
      localStorage.setItem('lastClickedService', key);
      setHighlightedKey(key);
      router.push(href);
    }
  };

  const handleToggleService = (key: string, newState: boolean) => {
    setEnabledServices((prev) => ({ ...prev, [key]: newState }));
  };

  const isLoading = loadingServices || loadingGst;

  // GST map for UI (hide for non-whitelist)
  const serviceGstMap = useMemo(() => {
    const out: Record<string, { value: number | null; isDefault: boolean }> = {};
    allServices.forEach((svc: any) => {
      const key = normalize(svc.name);
      if (GST_WHITELIST.has(key)) {
        const value = gstMap[key] ?? DEFAULT_GST;
        out[svc.name] = { value, isDefault: gstMap[key] === undefined };
      } else {
        out[svc.name] = { value: null, isDefault: false };
      }
    });
    return out;
  }, [gstMap]);

  // --- Modal open
  const openEditModal = (serviceName: string) => {
    const canon = ALIASES[normalize(serviceName)] || normalize(serviceName);
    if (!GST_WHITELIST.has(canon)) return; // safety
    const current = gstMap[canon] ?? DEFAULT_GST;
    setEditServiceKey(canon);
    setEditValue(String(current));
    setSaveError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditServiceKey(null);
    setEditValue('18');
    setSaving(false);
    setSaveError('');
  };

  // --- POST save
  const saveGst = async () => {
    if (!editServiceKey) return;
    const num = parseFloat(editValue);
    if (Number.isNaN(num) || num < 0 || num > 100) {
      setSaveError('Please enter a valid GST between 0 and 100.');
      return;
    }

    setSaving(true);
    setSaveError('');

    try {
      // POST to api/services/gstPercentage/<service>
      const url = `api/services/gstPercentage/${editServiceKey}`;
      const payload = { gstPercentage: num };
      const res = await apiCall<any>('POST', url, payload);

      // Try to rebuild gstMap from response if provided
      const updatedList = pickUpdatedListFromPost(res);
      if (updatedList) {
        const newMap: Record<string, number> = {};
        updatedList.forEach(({ serviceName, gstPercentage }) => {
          const k = ALIASES[normalize(serviceName)] || normalize(serviceName);
          if (k) newMap[k] = gstPercentage;
        });

        setGstMap((prev) => ({ ...prev, ...newMap }));
      } else {

        setGstMap((prev) => ({ ...prev, [editServiceKey]: num }));
      }

      closeModal();
    } catch (e: any) {
      setSaveError(e?.response?.data?.message || 'Failed to save GST.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="overflow-hidden flex flex-col justify-evenly py-4 gap-6 mt-14">
        <Heading title="Service Management" className="px-6 mb-0 md:mb-0" />

        {isLoading ? (
          <p className="text-center text-gray-500">Loading services…</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
            {allServices.map((service: any) => {
              const isEnabled = enabledServices[service.name] ?? false;
              const isHighlighted = highlightedKey === service.name;
              const gstInfo = serviceGstMap[service.name];

              return (
                <div
                  key={service.id}
                  className={`relative flex flex-col gap-2 group ${isEnabled ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
                    } ${isHighlighted ? 'shadow-sm bg-gray-100 rounded-md' : ''}`}
                >
                  <div
                    className="relative"
                    onClick={() => handleNavigation(service.href, isEnabled)}
                  >
                    {/* GST badge (only for whitelist) */}
                    {gstInfo?.value !== null && (
                      <button
                        type="button"
                        className="absolute top-2 right-2 z-10 rounded-md px-2 py-1 text-[11px] leading-none bg-black/70 text-white"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent navigation
                          openEditModal(service.name);
                        }}
                        title="Edit GST"
                      >
                        GST {gstInfo.value}%{gstInfo.isDefault ? ' (default)' : ''}
                      </button>
                    )}

                    <Image
                      src={service.imgSrc}
                      alt={service.displayName}
                      width={1000}
                      height={1000}
                      className="rounded"
                    />
                  </div>

                  <div className="w-full flex justify-between items-center">
                    <h2
                      onClick={() => handleNavigation(service.href, isEnabled)}
                      className={`px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300 ${isHighlighted ? 'bg-[#453519] text-white' : 'bg-[#EFE9DF]'
                        }`}
                    >
                      {service.displayName}
                    </h2>

                    <ToggleButton
                      serviceName={service.name}
                      enabled={isEnabled}
                      onCheckedChange={(newState) => handleToggleService(service.name, newState)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit GST Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
          />
          {/* Dialog */}
          <div className="relative z-10 w-[92%] max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold mb-3">
              Edit GST {editServiceKey ? `for ${editServiceKey}` : ''}
            </h3>

            <label className="text-sm text-gray-700 mb-1 block">GST Percentage</label>
            <input
              type="number"
              step="0.1"
              min={0}
              max={100}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring"
              placeholder="e.g. 18"
            />

            {saveError && <p className="text-red-600 text-sm mt-2">{saveError}</p>}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="px-3 py-2 rounded-md border"
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-3 py-2 rounded-md bg-[#453519] text-white disabled:opacity-60"
                onClick={saveGst}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagementPage;

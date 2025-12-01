// 'use client';
// import { zodResolver } from '@hookform/resolvers/zod';
// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useRouter } from 'next/navigation';
// import { PiCameraThin } from 'react-icons/pi';
// import {
//   laundryCategories,
//   laundryItems,
//   toiletriesCategories,
//   toiletriesItems
// } from 'app/static/services-management/Housekeeping';
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage
// } from '../../ui/form';
// import { Input } from '../../ui/input';
// import { Button } from '../../ui/button';
// import { X } from 'lucide-react';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select';
// import { ToastAtTopRight } from '@/lib/sweetalert';
// import apiCall from '@/lib/axios';

// type Product = {
//   _id: string;
//   serviceType: string;
//   name: string;
//   visibility?: boolean;
//   category: string;
//   price: number;
//   image?: string | null;
//   onEdit?: (updatedProduct: Product) => void;
// };

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   product?: Product | null;
// }

// // create here type for the form
// type FormData = {
//   selectService: string;
//   productCategory: string;
//   productName: string;
//   visibility: boolean;
//   productPrice: number;
//   productImage: File | null;
// };

// const AddItemModal: React.FC<ModalProps> = ({ isOpen, onClose, product }) => {
//   const router = useRouter();
//   const [preview, setPreview] = useState<string | null>(null);
//   console.log(product)

//   const form = useForm<FormData>({
//     defaultValues: {
//       selectService: undefined,
//       productCategory: undefined,
//       productName: '',
//       productImage: undefined,
//       visibility: false,
//       productPrice: 0
//     }
//   });

//   const selectedService = form.watch('selectService');
//   const selectedCategory = form.watch('productCategory');

//   useEffect(() => {
//     if (product) {
//       form.reset({
//         selectService: product.serviceType,
//         productCategory: product.category,
//         productName: product.name,
//         visibility: Boolean(product.visibility),
//         productPrice: product.price,
//         productImage: null,
//       });
//       setPreview(product.image ?? null);
//     }
//   }, [product]);

//   useEffect(() => {
//     if (!isOpen) {
//       form.reset();
//       setPreview(null);
//     }
//   }, [isOpen]);

//   // const onSubmit = async (data: FormData) => {
//   //   const payload = {
//   //     serviceType: data.selectService,
//   //     category: data.productCategory,
//   //     name: data.productName,
//   //     price: Number(data.productPrice)
//   //   };

//   //   try {
//   //     if (product) {
//   //       await apiCall('PUT', `api/services/housekeeping/items/${product._id}`, payload);
//   //       console.log('Product', product)
//   //       console.log('Product Payload', payload)
//   //       console.log('ProductId', product._id)
//   //       ToastAtTopRight.fire('Service item updated successfully', 'success');
//   //     } else {
//   //       // Create: Call the create API
//   //       await apiCall('POST', 'api/services/housekeeping/items', payload);
//   //       console.log('Product Payload', payload)
//   //       ToastAtTopRight.fire('Service item added successfully', 'success');
//   //     }
//   //     form.reset();
//   //     setPreview(null);
//   //     onClose();
//   //   } catch (err: any) {
//   //     ToastAtTopRight.fire(err?.message || 'Failed to save', 'error');
//   //   }
//   // };
//   const onSubmit = async (data: FormData) => {
//     const payload = {
//       serviceType: data.selectService,
//       category: data.productCategory,
//       name: data.productName,
//       visibility: data.visibility,
//       price: Number(data.productPrice),
//     };

//     try {
//       if (product) {
//         await apiCall('PUT', `api/services/housekeeping/items/${product._id}`, payload);
//         console.log('Product updated successfully');

//         // Show success message
//         ToastAtTopRight.fire('Service item updated successfully', 'success');
//         onClose();
//       } else {
//         // Create: Call the create API
//         await apiCall('POST', 'api/services/housekeeping/items', payload);
//         console.log('Product added successfully');
//         ToastAtTopRight.fire('Service item added successfully', 'success');
//         onClose();
//       }
//       form.reset();
//       setPreview(null);
//     } catch (err: any) {
//       ToastAtTopRight.fire(err?.message || 'Failed to save', 'error');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
//       <div className="bg-[#FAF6EF] rounded-lg shadow-lg pt-4 pb-8 w-full max-w-5xl relative animate-fadeIn">
//         <X
//           onClick={onClose}
//           className="absolute top-6 right-6 text-gray-600 hover:text-black"
//         />

//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="flex flex-col gap-6 text-sm"
//           >
//             <div className="w-full h-[1px] bg-black opacity-20 mt-12" />

//             <div className="flex justify-between items-start px-10">
//               <div className="w-[60%] flex flex-col gap-6">
//                 {/* Select Service */}
//                 <FormField
//                   control={form.control}
//                   name="selectService"
//                   render={({ field }) => (
//                     <FormItem className="flex items-center gap-1">
//                       <FormLabel> Select Service </FormLabel>
//                       <FormControl>
//                         <Select
//                           value={field.value ?? undefined}  // or defaultValue={field.value}
//                           onValueChange={field.onChange}
//                         >
//                           <SelectTrigger className="w-64 bg-lightbrown text-gray-700">
//                             <SelectValue placeholder="Select type" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {['Laundry', 'Toiletries'].map((value) => (
//                               <SelectItem key={value} value={value}>
//                                 {value}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="productCategory"
//                   render={({ field }) => (
//                     <FormItem className="flex items-center gap-4">
//                       <FormLabel> Product Category </FormLabel>
//                       <FormControl>
//                         <Select
//                           value={field.value ?? undefined}  // again avoid empty string
//                           onValueChange={field.onChange}
//                         >
//                           <SelectTrigger className="w-64 bg-[#F6EEE0] text-gray-700">
//                             <SelectValue placeholder="Select Category" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {(selectedService === 'Laundry'
//                               ? laundryCategories
//                               : toiletriesCategories
//                             ).map((value) => (
//                               <SelectItem key={value} value={value}>
//                                 {value}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />

//                 {/* Product Name */}
//                 <FormField
//                   control={form.control}
//                   name="productName"
//                   render={({ field }) => (
//                     <FormItem className="flex items-center gap-4">
//                       <FormLabel className="text-sm w-40 font-medium text-gray-700">
//                         Product Name
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="text"
//                           placeholder="Enter Product Name"
//                           {...field}
//                           className="bg-[#F6EEE0] w-64 text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />


//                 <FormField
//                   control={form.control}
//                   name="visibility"
//                   render={({ field }) => (
//                     <FormItem className="flex items-center gap-[87px]">
//                       <FormLabel>Visibility</FormLabel>
//                       <FormControl>
//                         <div className="flex gap-2">
//                           <button
//                             type="button"
//                             onClick={() => field.onChange(true)}
//                             className={`px-4 py-1 rounded-md text-sm font-medium border 
//                               ${field.value ? 'bg-green-500 text-white border-green-500' : 'bg-[#F6EEE0] text-gray-700 border-gray-300'}`}
//                           >
//                             ON
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => field.onChange(false)}
//                             className={`px-4 py-1 rounded-md text-sm font-medium border 
//                               ${!field.value ? 'bg-red-500 text-white border-red-500' : 'bg-[#F6EEE0] text-gray-700 border-gray-300'}`}
//                           >
//                             OFF
//                           </button>
//                         </div>
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="productPrice"
//                   render={({ field }) => (
//                     <FormItem className="flex items-center gap-4">
//                       <FormLabel className="text-sm w-40 text-nowrap font-medium text-gray-700">
//                         Price (Excluding GST)
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="text"
//                           placeholder="INR 100/-"
//                           {...field}
//                           className="bg-[#F6EEE0] w-64 text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Product Image Upload */}
//               <div className="w-[30%]">
//                 <FormField
//                   control={form.control}
//                   name="productImage"
//                   render={({ field }) => (
//                     <FormItem className="flex flex-col gap-2">
//                       <FormLabel className="text-sm w-40 font-medium text-gray-700">
//                         Product image
//                       </FormLabel>
//                       <FormControl>
//                         <div
//                           className="relative h-44 w-44 rounded-lg bg-[#F6EEE0]"
//                           onDrop={(e) => {
//                             e.preventDefault();
//                             const file = e.dataTransfer.files?.[0];
//                             if (file) {
//                               if (!file.type.startsWith('image/')) {
//                                 alert('Please upload an image file.');
//                                 return;
//                               }
//                               if (file.size > 5 * 1024 * 1024) {
//                                 alert('File size exceeds 5MB.');
//                                 return;
//                               }
//                               if (preview) URL.revokeObjectURL(preview);
//                               const imageUrl = URL.createObjectURL(file);
//                               setPreview(imageUrl);
//                               field.onChange(file);
//                             }
//                           }}
//                           onDragOver={(e) => e.preventDefault()}
//                         >
//                           <div className="h-full w-full flex items-center justify-center relative">
//                             {preview ? (
//                               <>
//                                 <img
//                                   src={preview}
//                                   alt="Product preview"
//                                   className="h-full w-full object-cover rounded-lg"
//                                 />
//                                 {/* Overlay to make the image clickable for reupload */}
//                                 <label
//                                   htmlFor="fileUpload"
//                                   className="absolute inset-0 flex justify-center items-center cursor-pointer bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity rounded-lg"
//                                   aria-label="Reupload product image"
//                                 >
//                                   <PiCameraThin className="text-white w-12 h-12 opacity-70" />
//                                 </label>
//                               </>
//                             ) : (
//                               <label
//                                 htmlFor="fileUpload"
//                                 className="absolute inset-0 flex justify-center items-center cursor-pointer"
//                                 aria-label="Upload product image"
//                               >
//                                 <PiCameraThin className="text-black w-12 h-44 opacity-30" />
//                               </label>
//                             )}
//                           </div>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => {
//                               const file = e.target.files?.[0];
//                               if (file) {
//                                 if (!file.type.startsWith('image/')) {
//                                   alert('Please upload an image file.');
//                                   return;
//                                 }
//                                 if (file.size > 5 * 1024 * 1024) {
//                                   alert('File size exceeds 5MB.');
//                                   return;
//                                 }
//                                 if (preview) URL.revokeObjectURL(preview);
//                                 const imageUrl = URL.createObjectURL(file);
//                                 setPreview(imageUrl);
//                                 field.onChange(file);
//                               } else {
//                                 setPreview(null);
//                                 field.onChange(undefined);
//                               }
//                             }}
//                             className="hidden"
//                             id="fileUpload"
//                           />
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>

//             <div className="w-full h-[1px] bg-black opacity-15" />

//             {/* Submit Button */}
//             <div className="flex items-center gap-4 px-10">
//               <Button type="submit" className="btn-primary">
//                 Save
//               </Button>
//               <Button
//                 type="button"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   router.push(
//                     '/hotel-panel/service-management/housekeeping/products'
//                   );
//                 }}
//                 className="btn-primary"
//               >
//                 View Products
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default AddItemModal;

'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { PiCameraThin } from 'react-icons/pi';
import {
  laundryCategories,
  toiletriesCategories,
} from 'app/static/services-management/Housekeeping';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToastAtTopRight } from '@/lib/sweetalert';
import apiCall from '@/lib/axios';

type Product = {
  _id: string;
  serviceType: string;
  name: string;
  visibility?: boolean;
  category: string;
  price: number;
  imageUrl?: string | null; // may be a URL or a Key
  onEdit?: (updatedProduct: Product) => void;
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

type FormData = {
  selectService: string;
  productCategory: string;
  productName: string;
  visibility: boolean;
  productPrice: number | string;
  productImage: File | null;
};

// ================= Image helpers =================
// Update this if your bucket host differs
const S3_BASE = 'https://dibstestbucket0403.s3.ap-south-1.amazonaws.com';

const keyToUrl = (value?: string | null) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `${S3_BASE}/${value.replace(/^\/+/, '')}`;
};

// derive Key from a full S3 URL
const deriveKeyFromUrl = (u?: string | null) => {
  if (!u) return null;
  try {
    const { host, pathname } = new URL(u);
    if (host.includes('s3.') && pathname) {
      return pathname.replace(/^\/+/, '');
    }
    if (u.startsWith(S3_BASE)) {
      return u.slice(S3_BASE.length).replace(/^\/+/, '');
    }
  } catch { }
  return null;
};

// defensive extractor for many possible response shapes
const extractUploadFields = (res: any) => {
  const raw = res && (res.data ?? res);

  const candidates: any[] = [
    raw,
    raw?.data,
    raw?.data?.data,
    raw?.result,
    raw?.file,
    Array.isArray(raw?.files) ? raw.files[0] : undefined,
    raw?.payload,
  ].filter(Boolean);

  let url: string | null = null;
  let key: string | null = null;

  for (const c of candidates) {
    if (!c || typeof c !== 'object') continue;

    // try many possible url fields
    url =
      c.url ??
      c.URL ??
      c.Location ??
      c.location ??
      c.link ??
      c.href ??
      url;

    // try many possible key fields
    key =
      c.Key ??
      c.key ??
      c.objectKey ??
      c.fileKey ??
      key;

    if (url && key) break;
  }

  const deriveKeyFromUrl = (u?: string | null) => {
    if (!u) return null;
    try {
      const parsed = new URL(u);
      if (parsed.pathname) return parsed.pathname.replace(/^\/+/, '');
    } catch { }
    return null;
  };
  if (!key && url) key = deriveKeyFromUrl(url);

  return { url: url || null, key: key || null, raw };
};

const AddItemModal: React.FC<ModalProps> = ({ isOpen, onClose, product }) => {
  const router = useRouter();

  // Image UI + uploaded info
  const [preview, setPreview] = useState<string | null>(null); // display via Key->URL
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null); // send in payload
  const [uploadedKey, setUploadedKey] = useState<string | null>(null); // keep for preview
  const [uploading, setUploading] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      selectService: undefined as any,
      productCategory: undefined as any,
      productName: '',
      productImage: null,
      visibility: false,
      productPrice: '' as any,
    },
  });

  const selectedService = form.watch('selectService');

  /** Prefill on edit */
  useEffect(() => {
    if (product) {
      form.reset({
        selectService: product.serviceType,
        productCategory: product.category,
        productName: product.name,
        visibility: Boolean(product.visibility),
        productPrice: product.price,
        productImage: null,
      });

      const display = keyToUrl(product.imageUrl);
      setPreview(display);

      if (product.imageUrl) {
        if (/^https?:\/\//i.test(product.imageUrl)) {
          setUploadedUrl(product.imageUrl);
          setUploadedKey(null);
        } else {
          setUploadedKey(product.imageUrl);
          setUploadedUrl(null);
        }
      }
    }
  }, [product]);

  /** Reset on close */
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setPreview(null);
      setUploadedKey(null);
      setUploadedUrl(null);
      setUploading(false);
    }
  }, [isOpen]);

  /** ------- File -> upload to /api/upload/admin ------- */
  const doUpload = async (file: File) => {
    // ---- validations ----
    if (!file.type.startsWith('image/')) {
      ToastAtTopRight.fire('Please upload an image file.', 'error');
      return;
    }
    // max 200 KB
    if (file.size > 100 * 1024) {
      ToastAtTopRight.fire('File size exceeds 100KB.', 'error');
      return;
    }

    const tryWithField = async (fieldName: string) => {
      const fd = new FormData();
      fd.append(fieldName, file, file.name);
      // ❗ apiCall has only 3 args
      return await apiCall('POST', 'api/upload/admin', fd);
    };

    // Common multer field names (most backends use one of these)
    const fieldCandidates = ['file', 'document', 'image', 'photo', 'avatar', 'upload', 'picture', 'files', 'documents'];

    setUploading(true);
    try {
      let res: any | null = null;
      let lastErr: any = null;

      for (let i = 0; i < fieldCandidates.length; i++) {
        const name = fieldCandidates[i];
        try {
          res = await tryWithField(name);
          // success with this field name
          break;
        } catch (err: any) {
          lastErr = err;
          const msg = err?.response?.data?.message || err?.message || '';
          // keep trying on "Unexpected field"; otherwise bail out
          if (!/Unexpected field/i.test(msg)) {
            throw err;
          }
        }
      }

      if (!res) {
        // all attempts failed with "Unexpected field"
        const msg = lastErr?.response?.data?.message || lastErr?.message || 'Upload failed';
        ToastAtTopRight.fire(msg, 'error');
        return;
      }

      // ---- parse response defensively ----
      const raw = res?.data ?? res;

      // helpers you already have in the file:
      // keyToUrl, deriveKeyFromUrl, extractUploadFields
      const { url, key } = extractUploadFields(raw);

      if (!url && !key) {
        ToastAtTopRight.fire('Upload succeeded but url/Key missing in response.', 'error');
        return;
      }

      const previewUrl = url || keyToUrl(key)!;

      setUploadedUrl(url || keyToUrl(key));  // URL to send in payload
      setUploadedKey(key);                   // Key to show/retain
      setPreview(previewUrl);

      ToastAtTopRight.fire('Image uploaded successfully', 'success');

      // optional: keep file in RHF
      form.setValue('productImage', file);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Upload failed';
      ToastAtTopRight.fire(msg, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) void doUpload(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void doUpload(file);
    } else {
      setPreview(null);
      setUploadedKey(null);
      setUploadedUrl(null);
      form.setValue('productImage', null);
    }
  };

  /** ------- Submit (send image URL in payload) ------- */
  const onSubmit = async (data: FormData) => {
    const priceNumber =
      typeof data.productPrice === 'number'
        ? data.productPrice
        : Number(String(data.productPrice).replace(/[^\d.]/g, '')) || 0;

    // Send URL in payload (your requirement). If only Key exists, convert to URL.
    const imageUrlForPayload = uploadedUrl || keyToUrl(uploadedKey) || null;

    const payload: any = {
      serviceType: data.selectService,
      category: data.productCategory,
      name: data.productName,
      visibility: data.visibility,
      price: priceNumber,
      imageUrl: imageUrlForPayload,
    };

    try {
      if (product) {
        await apiCall('PUT', `api/services/housekeeping/items/${product._id}`, payload);
        console.log(payload)
        ToastAtTopRight.fire('Service item updated successfully', 'success');
        onClose();
      } else {
        await apiCall('POST', 'api/services/housekeeping/items', payload);
        ToastAtTopRight.fire('Service item added successfully', 'success');
        onClose();
      }

      form.reset();
      setPreview(null);
      setUploadedKey(null);
      setUploadedUrl(null);
    } catch (err: any) {
      ToastAtTopRight.fire(err?.message || 'Failed to save', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-[#FAF6EF] rounded-lg shadow-lg pt-4 pb-8 w-full max-w-5xl relative animate-fadeIn">
        <X
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-600 hover:text-black cursor-pointer"
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 text-sm">
            <div className="w-full h-[1px] bg-black opacity-20 mt-12" />

            <div className="flex justify-between items-start px-10">
              {/* Left: Fields */}
              <div className="w-[60%] flex flex-col gap-6">
                {/* Select Service */}
                <FormField
                  control={form.control}
                  name="selectService"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-1">
                      <FormLabel>Select Service</FormLabel>
                      <FormControl>
                        <Select
                          value={(field.value as any) ?? undefined}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-64 bg-lightbrown text-gray-700">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {['Laundry', 'Toiletries'].map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="productCategory"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel>Product Category</FormLabel>
                      <FormControl>
                        <Select
                          value={(field.value as any) ?? undefined}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-64 bg-[#F6EEE0] text-gray-700">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {(selectedService === 'Laundry'
                              ? laundryCategories
                              : toiletriesCategories
                            ).map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="text-sm w-40 font-medium text-gray-700">
                        Product Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Product Name"
                          {...field}
                          className="bg-[#F6EEE0] w-64 text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Visibility */}
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-[87px]">
                      <FormLabel>Visibility</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => field.onChange(true)}
                            className={`px-4 py-1 rounded-md text-sm font-medium border 
                              ${field.value ? 'bg-green-500 text-white border-green-500' : 'bg-[#F6EEE0] text-gray-700 border-gray-300'}`}
                          >
                            ON
                          </button>
                          <button
                            type="button"
                            onClick={() => field.onChange(false)}
                            className={`px-4 py-1 rounded-md text-sm font-medium border 
                              ${!field.value ? 'bg-red-500 text-white border-red-500' : 'bg-[#F6EEE0] text-gray-700 border-gray-300'}`}
                          >
                            OFF
                          </button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Price */}
                <FormField
                  control={form.control}
                  name="productPrice"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="text-sm w-40 text-nowrap font-medium text-gray-700">
                        Price (Excluding GST)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="INR 100/-"
                          {...field}
                          className="bg-[#F6EEE0] w-64 text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right: Image upload */}
              <div className="w-[30%]">
                <FormField
                  control={form.control}
                  name="productImage"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="text-sm w-40 font-medium text-gray-700">
                        Product image
                      </FormLabel>
                      <FormControl>
                        <div
                          className="relative h-44 w-44 rounded-lg bg-[#F6EEE0] overflow-hidden"
                          onDrop={handleDrop}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          <div className="h-full w-full flex items-center justify-center relative">
                            {preview ? (
                              <>
                                <img
                                  src={preview}
                                  alt="Product preview"
                                  className="h-full w-full object-cover rounded-lg"
                                />
                                {/* Reupload overlay */}
                                <label
                                  htmlFor="fileUpload"
                                  className="absolute inset-0 flex justify-center items-center cursor-pointer bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity rounded-lg"
                                  aria-label="Reupload product image"
                                >
                                  <PiCameraThin className="text-white w-12 h-12 opacity-70" />
                                </label>
                                {uploading && (
                                  <div className="absolute bottom-1 right-1 text-[11px] bg-black/60 text-white px-2 py-0.5 rounded">
                                    Uploading…
                                  </div>
                                )}
                              </>
                            ) : (
                              <label
                                htmlFor="fileUpload"
                                className="absolute inset-0 flex justify-center items-center cursor-pointer"
                                aria-label="Upload product image"
                              >
                                <PiCameraThin className="text-black w-12 h-44 opacity-30" />
                              </label>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileInput}
                            className="hidden"
                            id="fileUpload"
                          />
                        </div>
                      </FormControl>
                      {/* Helper text */}
                      <div className="text-xs text-gray-500">
                        {uploadedKey ? (
                          <>Stored as Key: <span className="font-mono">{uploadedKey}</span></>
                        ) : uploadedUrl ? (
                          <>Using URL: <span className="font-mono break-all">{uploadedUrl}</span></>
                        ) : (
                          <>PNG/JPG ≤ 100KB</>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="w-full h-[1px] bg-black opacity-15" />

            {/* Submit */}
            <div className="flex items-center gap-4 px-10">
              <Button type="submit" className="btn-primary" disabled={uploading}>
                Save
              </Button>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/hotel-panel/service-management/housekeeping/products');
                }}
                className="btn-primary"
              >
                View Products
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddItemModal;

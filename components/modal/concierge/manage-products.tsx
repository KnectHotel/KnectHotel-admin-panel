// 'use client';
// import { zodResolver } from '@hookform/resolvers/zod';
// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useRouter } from 'next/navigation';
// import {
//   ConciergeManageProductsModalFormSchema,
//   ConciergeManageProductsModalFormSchemaType
// } from 'schema';
// import { PiCameraThin } from 'react-icons/pi';
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
// import { ChevronDown, X } from 'lucide-react';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select';
// import apiCall from '@/lib/axios';
// import { ToastAtTopRight } from '@/lib/sweetalert';

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const ManageProducts: React.FC<ModalProps> = ({ isOpen, onClose }) => {
//   const router = useRouter();
//   const [preview, setPreview] = useState<string | null>(null);

//   useEffect(() => {
//     return () => {
//       if (preview) URL.revokeObjectURL(preview);
//     };
//   }, [preview]);

//   const form = useForm<ConciergeManageProductsModalFormSchemaType>({
//     resolver: zodResolver(ConciergeManageProductsModalFormSchema),
//     defaultValues: {
//       productCategory: '',
//       selectService: 'Nearby Attractions',
//       name: '',
//       description: '',
//       distance: '',
//       productImage: undefined
//     }
//   });

//   const onSubmit = async (data: ConciergeManageProductsModalFormSchemaType) => {
//     try {
//       const payload = {
//         name: data.name,
//         description: data.description,
//         category: data.productCategory,
//         serviceType: data.selectService === 'Nearby Attractions'
//           ? 'Nearby Attraction'
//           : 'Nearby Cafe & Restaurant',
//         distance: parseFloat(data.distance as string),
//         // imageUrl: uploadedImageUrl, 
//         // HotelId: hotelId,

//       };

//       const response = await apiCall('POST', 'api/services/concierge/items', payload);

//       if (response?.success) {
//         ToastAtTopRight.fire({
//           icon: 'success',
//           title: 'Concierge item added successfully',
//         });

//         form.reset();
//         setPreview(null);
//         onClose();
//       } else {
//         ToastAtTopRight.fire({
//           icon: 'error',
//           title: response?.message || 'Something went wrong',
//         });
//       }
//     } catch (error) {
//       console.error('Error submitting concierge item:', error);
//       ToastAtTopRight.fire({
//         icon: 'error',
//         title: 'Submission failed. Please try again.',
//       });
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
//             className="flex flex-col gap-4 text-sm"
//           >
//             <div className="flex flex-col lg:flex-row justify-center lg:justify-start items-start lg:items-center ml-9">
//               <FormField
//                 control={form.control}
//                 name="productCategory"
//                 render={({ field }) => (
//                   <FormItem className="flex items-center gap-4">
//                     <FormLabel className="text-sm w-40 text-nowrap font-medium text-gray-700">
//                       Product category
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter Description"
//                         {...field}
//                         className="bg-[#F6EEE0] w-64 text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="selectService"
//                 render={({ field }) => (
//                   <FormItem className="flex items-center gap-4 relative">
//                     <FormLabel className="text-sm w-fit text-nowrap font-medium text-gray-700">
//                       Select Service
//                     </FormLabel>
//                     <FormControl>
//                       <Select
//                         onValueChange={field.onChange}
//                         value={field.value}
//                       >
//                         <SelectTrigger className="w-56 bg-lightbrown text-gray-700 py-4 px-2 rounded-md border-none flex justify-between items-center">
//                           <SelectValue placeholder="Select type" />
//                           <ChevronDown className="ml-2 mt-1 h-5 w-5 text-black" />
//                         </SelectTrigger>

//                         <SelectContent className="bg-[#362913] text-nowrap rounded-2xl text-white border-2 shadow-md border-white">
//                           {[
//                             'Nearby Attractions',
//                             'Nearby Cafe & Restaurants'
//                           ].map((value) => (
//                             <SelectItem
//                               key={value}
//                               value={value}
//                               className="text-nowrap"
//                             >
//                               {value}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             {/* Line */}
//             <div className="w-full h-[1px] bg-black opacity-20 mt-4" />
//             {/* Lower part of the form */}
//             <div className="flex justify-between items-start px-10">
//               <div className="w-[60%] flex flex-col gap-6">
//                 {/* Product Category */}
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem className="flex items-center gap-4">
//                       <FormLabel className="text-sm w-40 text-nowrap font-medium text-gray-700">
//                         Name
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Enter Product Name"
//                           {...field}
//                           className="bg-[#F6EEE0] w-64 text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Product Name */}
//                 <FormField
//                   control={form.control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem className="flex items-center gap-4">
//                       <FormLabel className="text-sm w-40 text-nowrap font-medium text-gray-700">
//                         Descripton
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="text"
//                           placeholder="Enter Product Description"
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
//                   name="distance"
//                   render={({ field }) => (
//                     <FormItem className="flex items-center gap-4">
//                       <FormLabel className="text-sm w-40 font-medium text-gray-700">
//                         Distance (km)
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           step="0.1"
//                           min="0"
//                           placeholder="Enter distance"
//                           {...field}
//                           className="bg-[#F6EEE0] w-64 text-gray-700 p-2 rounded-md"
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
//                   router.push('/hotel-panel/service-management/conciergeservice/products');
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

// export default ManageProducts;



'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  ConciergeManageProductsModalFormSchema,
  ConciergeManageProductsModalFormSchemaType
} from 'schema';
import { PiCameraThin } from 'react-icons/pi';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { ChevronDown, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import apiCall from '@/lib/axios';
import { ToastAtTopRight } from '@/lib/sweetalert';

/* ================= Image helpers (same pattern) ================= */
const S3_BASE = 'https://dibstestbucket0403.s3.ap-south-1.amazonaws.com';

const keyToUrl = (value?: string | null) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `${S3_BASE}/${value.replace(/^\/+/, '')}`;
};

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
    url = c.url ?? c.URL ?? c.Location ?? c.location ?? c.link ?? c.href ?? url;
    key = c.Key ?? c.key ?? c.objectKey ?? c.fileKey ?? key;
    if (url && key) break;
  }

  if (!key && url) {
    try {
      const parsed = new URL(url);
      if (parsed.pathname) key = parsed.pathname.replace(/^\/+/, '');
    } catch { }
  }
  return { url: url || null, key: key || null, raw };
};
/* ================================================================ */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageProducts: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null); // send in payload
  const [uploadedKey, setUploadedKey] = useState<string | null>(null); // for preview (if only key)
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const form = useForm<ConciergeManageProductsModalFormSchemaType>({
    resolver: zodResolver(ConciergeManageProductsModalFormSchema),
    defaultValues: {
      productCategory: '',
      selectService: 'Nearby Attractions',
      name: '',
      description: '',
      distance: '',
      productImage: undefined
    }
  });

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setPreview(null);
      setUploadedKey(null);
      setUploadedUrl(null);
      setUploading(false);
    }
  }, [isOpen, form]);

  /* ---------------- Upload (same behavior) ---------------- */
  const uploadImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      ToastAtTopRight.fire('Please upload an image file.', 'error');
      return null;
    }
    if (file.size > 200 * 1024) {
      ToastAtTopRight.fire('File size exceeds 100KB.', 'error');
      return null;
    }

    const tryWithField = async (fieldName: string) => {
      const fd = new FormData();
      fd.append(fieldName, file, file.name);
      return await apiCall('POST', 'api/upload/admin', fd);
    };

    const candidates = ['file', 'document', 'image', 'photo', 'avatar', 'upload', 'picture', 'files', 'documents'];

    setUploading(true);
    try {
      let res: any | null = null;
      let lastErr: any = null;

      for (const name of candidates) {
        try {
          res = await tryWithField(name);
          break;
        } catch (err: any) {
          lastErr = err;
          const msg = err?.response?.data?.message || err?.message || '';
          if (!/Unexpected field/i.test(msg)) throw err;
        }
      }

      if (!res) {
        const msg = lastErr?.response?.data?.message || lastErr?.message || 'Upload failed';
        ToastAtTopRight.fire(msg, 'error');
        return null;
      }

      const { url, key } = extractUploadFields(res?.data ?? res);
      if (!url && !key) {
        ToastAtTopRight.fire('Upload succeeded but url/Key missing in response.', 'error');
        return null;
      }

      const previewUrl = url || keyToUrl(key)!;
      setPreview(previewUrl);
      setUploadedUrl(url || keyToUrl(key));
      setUploadedKey(key);

      ToastAtTopRight.fire('Image uploaded successfully', 'success');
      return { url, key, previewUrl };
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Upload failed';
      ToastAtTopRight.fire(msg, 'error');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, onChange: (f: File | undefined) => void) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const result = await uploadImage(file);
    if (result) onChange(file);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>, onChange: (f: File | undefined) => void) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      setUploadedKey(null);
      setUploadedUrl(null);
      onChange(undefined);
      return;
    }
    const result = await uploadImage(file);
    if (result) onChange(file);
  };

  /* ---------------- Submit with imageUrl ---------------- */
  const onSubmit = async (data: ConciergeManageProductsModalFormSchemaType) => {
    try {
      const imageUrlForPayload = uploadedUrl || keyToUrl(uploadedKey) || null;

      const payload = {
        name: data.name,
        description: data.description,
        category: data.productCategory,
        serviceType: data.selectService === 'Nearby Attractions'
          ? 'Nearby Attraction'
          : 'Nearby Cafe & Restaurant',
        distance: parseFloat(String(data.distance || '0')),
        imageUrl: imageUrlForPayload,
        // HotelId: hotelId, // add when available
      };

      const response = await apiCall('POST', 'api/services/concierge/items', payload);

      if (response?.success) {
        ToastAtTopRight.fire({ icon: 'success', title: 'Concierge item added successfully' });
        form.reset();
        setPreview(null);
        setUploadedKey(null);
        setUploadedUrl(null);
        onClose();
      } else {
        ToastAtTopRight.fire({ icon: 'error', title: response?.message || 'Something went wrong' });
      }
    } catch (error) {
      console.error('Error submitting concierge item:', error);
      ToastAtTopRight.fire({ icon: 'error', title: 'Submission failed. Please try again.' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-[#FAF6EF] rounded-lg shadow-lg pt-4 pb-8 w-full max-w-5xl relative animate-fadeIn">
        <X onClick={onClose} className="absolute top-6 right-6 text-gray-600 hover:text-black" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 text-sm">
            <div className="flex flex-col lg:flex-row justify-center lg:justify-start items-start lg:items-center ml-9">
              <FormField
                control={form.control}
                name="productCategory"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="text-sm w-40 text-nowrap font-medium text-gray-700">
                      Product category
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Description"
                        {...field}
                        className="bg-[#F6EEE0] w-64 text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selectService"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4 relative">
                    <FormLabel className="text-sm w-fit text-nowrap font-medium text-gray-700">
                      Select Service
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-56 bg-lightbrown text-gray-700 py-4 px-2 rounded-md border-none flex justify-between items-center">
                          <SelectValue placeholder="Select type" />
                          <ChevronDown className="ml-2 mt-1 h-5 w-5 text-black" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#362913] text-nowrap rounded-2xl text-white border-2 shadow-md border-white">
                          {['Nearby Attractions', 'Nearby Cafe & Restaurants'].map((value) => (
                            <SelectItem key={value} value={value} className="text-nowrap">
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full h-[1px] bg-black opacity-20 mt-4" />

            {/* Lower part of the form */}
            <div className="flex justify-between items-start px-10">
              <div className="w-[60%] flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="text-sm w-40 text-nowrap font-medium text-gray-700">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Product Name"
                          {...field}
                          className="bg-[#F6EEE0] w-64 text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="text-sm w-40 text-nowrap font-medium text-gray-700">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Product Description"
                          {...field}
                          className="bg-[#F6EEE0] w-64 text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="distance"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="text-sm w-40 font-medium text-gray-700">
                        Distance (km)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="Enter distance"
                          {...field}
                          className="bg-[#F6EEE0] w-64 text-gray-700 p-2 rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Product Image Upload (with URL/Key logic) */}
              <div className="w-[30%]">
                <FormField
                  control={form.control}
                  name="productImage"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="text-sm w-40 font-medium text-gray-700">
                        Image
                      </FormLabel>
                      <FormControl>
                        <div
                          className="relative h-44 w-44 rounded-lg bg-[#F6EEE0] overflow-hidden"
                          onDrop={(e) => handleDrop(e, field.onChange)}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          <div className="h-full w-full flex items-center justify-center relative">
                            {preview ? (
                              <>
                                <img
                                  src={preview}
                                  alt="Preview"
                                  className="h-full w-full object-cover rounded-lg"
                                />
                                <label
                                  htmlFor="fileUpload"
                                  className="absolute inset-0 flex justify-center items-center cursor-pointer bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity rounded-lg"
                                  aria-label="Reupload"
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
                                aria-label="Upload"
                              >
                                <PiCameraThin className="text-black w-12 h-44 opacity-30" />
                              </label>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileInput(e, field.onChange)}
                            className="hidden"
                            id="fileUpload"
                          />
                        </div>
                      </FormControl>
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

            {/* Submit Button */}
            <div className="flex items-center gap-4 px-10">
              <Button type="submit" className="btn-primary" disabled={uploading}>
                Save
              </Button>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/hotel-panel/service-management/conciergeservice/products');
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

export default ManageProducts;

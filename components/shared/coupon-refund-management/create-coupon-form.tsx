// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useForm } from 'react-hook-form';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import FormWrapper from './form-wrapper';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectValue
// } from '@/components/ui/select';
// import { SelectTrigger } from '@radix-ui/react-select';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger
// } from '@/components/ui/popover';
// import { Calendar } from '@/components/ui/calendar';
// import { format } from 'date-fns';
// import { PiCameraThin } from 'react-icons/pi';
// import apiCall from '@/lib/axios';
// import { ToastAtTopRight } from '@/lib/sweetalert';
// import * as z from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { ChevronDown } from 'lucide-react';

// interface CreateCouponFormProps {
//   mode?: 'create' | 'view' | 'edit';
//   couponId?: string;
// }

// const defaultValues = {
//   category: 'Percentage Coupons',
//   validityFrom: '',
//   validityTo: '',
//   usageLimit: '',
//   discountPercentage: '',
//   discountAmount: '',
//   minimumSpent: '',
//   couponStatus: 'active',
//   createCode: '',
//   termsAndConditions: '',
//   couponImage: undefined as File | undefined,
//   discountType: '',
//   perUserLimit: ''
// };

// export const couponSchema = z.object({
//   category: z.string().nonempty('Category is required'),
//   validityFrom: z.string().nonempty('Start date is required'),
//   validityTo: z.string().nonempty('End date is required'),
//   usageLimit: z.string().nonempty('Usage limit is required'),
//   discountPercentage: z.string().optional(),
//   discountAmount: z.string().optional(),
//   minimumSpent: z.string().nonempty('Minimum spent is required'),
//   couponStatus: z.string().nonempty('Status is required'),
//   createCode: z.string().nonempty('Coupon code is required'),
//   termsAndConditions: z.string().nonempty('Terms and conditions are required'),
//   couponImage: z
//     .union([z.any(), z.string().url()])
//     .optional()
//     .refine((file) => file !== '', {
//       message: 'Coupon image must not be an empty value'
//     }),
//   discountType: z.string().nonempty('Discount type is required'),
//   perUserLimit: z
//     .string()
//     .nonempty('Per user limit is required')
//     .refine((v) => /^\d+$/.test(v) && Number(v) > 0, { message: 'Enter a positive number' })
// });

// const CreateCouponForm: React.FC<CreateCouponFormProps> = ({
//   mode = 'create',
//   couponId
// }) => {
//   const [preview, setPreview] = useState<string | null>(null);
//   const isViewMode = mode === 'view';
//   const isEditMode = mode === 'edit';
//   const router = useRouter();
//   const form = useForm({
//     resolver: zodResolver(couponSchema),
//     defaultValues
//   });
//   const selectedCouponCategory = form.watch('category');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     return () => {
//       if (preview) URL.revokeObjectURL(preview);
//     };
//   }, [preview]);

//   useEffect(() => {
//     if (form.watch('category') === 'Percentage Coupons') {
//       form.setValue('discountType', 'percentage');
//     } else {
//       form.setValue('discountType', 'fixed');
//     }
//   }, [form.watch('category')]);

//   // Fetch coupon data for edit mode
//   useEffect(() => {
//     if ((isEditMode || isViewMode) && couponId) {
//       (async () => {
//         try {
//           const res = await apiCall('GET', `api/coupon/${couponId}`);
//           const data = res.coupon;

//           form.reset({
//             category:
//               data.discountType === 'percentage'
//                 ? 'Percentage Coupons'
//                 : 'Fixed Amount Coupons',
//             discountType: data.discountType,
//             validityFrom: data.validFrom ? new Date(data.validFrom).toISOString().split('T')[0] : '',
//             validityTo: data.validUntil ? new Date(data.validUntil).toISOString().split('T')[0] : '',
//             usageLimit: data.usageLimit?.toString() || 'N/A',
//             discountPercentage:
//               data.discountType === 'percentage'
//                 ? data.value?.toString()
//                 : 'N/A',
//             discountAmount:
//               data.discountType === 'fixed' ? data.value?.toString() : '',
//             minimumSpent: data.minimumSpend?.toString() || 'N/A',
//             couponStatus: data.status?.toLowerCase() || 'active',
//             createCode: data.code || 'N/A',
//             termsAndConditions: data.termsAndConditions || 'N/A',
//             couponImage: undefined,
//             perUserLimit: (data.perUserLimit ?? 1).toString(),
//           });

//           if (data.imageUrl) {
//             setPreview(data.imageUrl);
//           }
//         } catch (error) {
//           ToastAtTopRight.fire('Failed to fetch coupon data', 'error');
//         }
//       })();
//     }
//   }, [couponId, isEditMode, isViewMode, form]);

//   const handleImageUpload = async (file: File) => {
//     if (!file.type.startsWith('image/')) {
//       ToastAtTopRight.fire('Please upload an image file.', 'error');
//       return;
//     }

//     if (file.size > 100 * 1024) {
//       ToastAtTopRight.fire('File size exceeds 5MB.', 'error');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file, file.name);

//     setLoading(true);
//     try {
//       const res = await apiCall('POST', 'api/upload/admin', formData);
//       const { url } = res.data;

//       if (url) {
//         setPreview(url);
//         form.setValue('couponImage', file);
//         ToastAtTopRight.fire('Image uploaded successfully', 'success');
//       }
//     } catch (err: any) {
//       ToastAtTopRight.fire('Failed to upload image', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onSubmit = async (data: any) => {
//     setLoading(true);
//     try {
//       const payload = {
//         code: data.createCode,
//         discountType:
//           data.category === 'Percentage Coupons' ? 'percentage' : 'fixed',
//         value:
//           data.category === 'Percentage Coupons'
//             ? data.discountPercentage
//             : String(data.discountAmount),
//         minimumSpend: Number(data.minimumSpent),
//         validFrom: data.validityFrom,
//         validUntil: data.validityTo,
//         usageLimit: Number(data.usageLimit),
//         perUserLimit: Number(data.perUserLimit),
//         stockable: false,
//         imageUrl: preview || '',
//         termsAndConditions: data.termsAndConditions,
//         status:
//           data.couponStatus.charAt(0).toUpperCase() +
//           data.couponStatus.slice(1).toLowerCase()
//       };
//       if (isEditMode && couponId) {
//         await apiCall('PUT', `api/coupon/${couponId}`, payload);
//         console.log(payload)
//         ToastAtTopRight.fire('Coupon updated successfully!', 'success');
//       } else {
//         await apiCall('POST', 'api/coupon', payload);
//         ToastAtTopRight.fire('Coupon created successfully!', 'success');
//       }
//       form.reset();
//       setPreview(null);
//       router.back();
//     } catch (error: any) {
//       ToastAtTopRight.fire(error?.message || 'Something went wrong', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <FormWrapper title="">
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit, (errors) => {

//             console.log('Validation Errors:', errors);
//             ToastAtTopRight.fire('Please fix the errors in the form.', 'error');

//           })}
//           className="w-full relative h-full max-w-4xl mx-auto rounded-lg"
//         >
//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
//             {/* Left Side */}
//             <div className="flex flex-col gap-3">
//               {/* Category */}
//               <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
//                 <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
//                   Select Category
//                 </FormLabel>
//                 <div className="w-full">
//                   <FormField
//                     control={form.control}
//                     name="category"
//                     render={({ field }) => (
//                       <>
//                         <Select
//                           onValueChange={field.onChange}
//                           value={field.value}
//                           disabled={isViewMode}
//                         >
//                           <FormControl>
//                             <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 py-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm relative pr-8">
//                               <SelectValue />
//                               <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent className="">
//                             {['Percentage Coupons', 'Fixed Amount Coupons'].map(
//                               (value) => (
//                                 <SelectItem key={value} value={value}>
//                                   {value}
//                                 </SelectItem>
//                               )
//                             )}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage className="text-red-500 text-xs mt-1" />
//                       </>
//                     )}
//                   />
//                 </div>
//               </FormItem>

//               {/* Validity */}
//               <div className="space-y-4">
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//                   <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
//                     Validity
//                   </FormLabel>
//                   <div className="flex flex-col sm:flex-row gap-3 w-full">
//                     <FormField
//                       control={form.control}
//                       name="validityFrom"
//                       render={({ field }) => (
//                         <FormItem className="flex-1">
//                           <FormControl>
//                             <Popover>
//                               <PopoverTrigger asChild>
//                                 <Input
//                                   type="text"
//                                   disabled={isViewMode}
//                                   value={field.value}
//                                   placeholder="From (YYYY-MM-DD)"
//                                   className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 cursor-pointer text-xs 2xl:text-sm"
//                                   readOnly
//                                 />
//                               </PopoverTrigger>
//                               <PopoverContent className="w-auto p-0">
//                                 <Calendar
//                                   mode="single"
//                                   selected={field.value ? new Date(field.value) : undefined}
//                                   onSelect={(date) => {
//                                     if (date) {
//                                       const formattedDate = date.toLocaleDateString('en-CA');
//                                       field.onChange(formattedDate);
//                                     }
//                                   }}
//                                   disabled={{ before: new Date() }}
//                                   initialFocus
//                                 />

//                               </PopoverContent>
//                             </Popover>
//                           </FormControl>
//                           <FormMessage className="text-red-500 text-xs mt-1" />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="validityTo"
//                       render={({ field }) => (
//                         <FormItem className="flex-1">
//                           <FormControl>
//                             <Popover>
//                               <PopoverTrigger asChild>
//                                 <Input
//                                   type="text"
//                                   disabled={isViewMode}
//                                   value={field.value}
//                                   placeholder="To (YYYY-MM-DD)"
//                                   className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 cursor-pointer text-xs 2xl:text-sm"
//                                   readOnly
//                                 />
//                               </PopoverTrigger>
//                               <PopoverContent className="w-auto p-0">
//                                 <Calendar
//                                   mode="single"
//                                   selected={field.value ? new Date(field.value) : undefined}
//                                   onSelect={(date) => {
//                                     if (date) {
//                                       const formattedDate = date.toLocaleDateString('en-CA');
//                                       field.onChange(formattedDate);
//                                     }
//                                   }}
//                                   disabled={{ before: new Date() }}
//                                   initialFocus
//                                 />
//                               </PopoverContent>
//                             </Popover>
//                           </FormControl>
//                           <FormMessage className="text-red-500 text-xs mt-1" />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Limits */}
//               <div className="space-y-4">
//                 <FormField
//                   control={form.control}
//                   name="usageLimit"
//                   render={({ field }) => (
//                     <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
//                       <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
//                         Usage Limit
//                       </FormLabel>
//                       <div className="w-full">
//                         <FormControl>
//                           <Input
//                             type="text"
//                             disabled={isViewMode}
//                             {...field}
//                             className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
//                           />
//                         </FormControl>
//                         <FormMessage className="text-red-500 text-xs mt-1" />
//                       </div>
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="perUserLimit"
//                   render={({ field }) => (
//                     <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
//                       <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
//                         Per User Limit
//                       </FormLabel>
//                       <div className="w-full">
//                         <FormControl>
//                           <Input
//                             type="number"
//                             min={1}
//                             disabled={isViewMode}
//                             {...field}
//                             value={field.value ?? ''}
//                             onChange={(e) => field.onChange(e.target.value.replace(/[^\d]/g, ''))}
//                             className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
//                           />
//                         </FormControl>
//                         <FormMessage className="text-red-500 text-xs mt-1" />
//                       </div>
//                     </FormItem>
//                   )}
//                 />
//                 {selectedCouponCategory === 'Percentage Coupons' && (
//                   <FormField
//                     control={form.control}
//                     name="discountPercentage"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
//                         <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
//                           Discount (%)
//                         </FormLabel>
//                         <div className="w-full">
//                           <FormControl>
//                             <Input
//                               type="text"
//                               disabled={isViewMode}
//                               {...field}
//                               className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
//                             />
//                           </FormControl>
//                           <FormMessage className="text-red-500 text-xs mt-1" />
//                         </div>
//                       </FormItem>
//                     )}
//                   />
//                 )}
//                 {selectedCouponCategory === 'Fixed Amount Coupons' && (
//                   <FormField
//                     control={form.control}
//                     name="discountAmount"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
//                         <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
//                           Discount in Amount
//                         </FormLabel>
//                         <div className="w-full">
//                           <FormControl>
//                             <Input
//                               type="number"
//                               disabled={isViewMode}
//                               {...field}
//                               value={field.value ?? ''}
//                               onChange={(e) =>
//                                 field.onChange((e.target.value))
//                               }
//                               className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
//                             />
//                           </FormControl>
//                           <FormMessage className="text-red-500 text-xs mt-1" />
//                         </div>
//                       </FormItem>
//                     )}
//                   />
//                 )}
//                 <FormField
//                   control={form.control}
//                   name="minimumSpent"
//                   render={({ field }) => (
//                     <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
//                       <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
//                         Minimum Spent
//                       </FormLabel>
//                       <div className="w-full">
//                         <FormControl>
//                           <Input
//                             type="text"
//                             disabled={isViewMode}
//                             {...field}
//                             className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
//                           />
//                         </FormControl>
//                         <FormMessage className="text-red-500 text-xs mt-1" />
//                       </div>
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Coupon Status */}
//               <FormField
//                 control={form.control}
//                 name="couponStatus"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col sm:flex-row gap-2">
//                     <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 pt-1 shrink-0">
//                       Coupon Status
//                     </FormLabel>
//                     <div className="w-full">
//                       <FormControl>
//                         <RadioGroup
//                           onValueChange={field.onChange}
//                           value={field.value}
//                           className="flex flex-col space-y-2"
//                           disabled={isViewMode}
//                         >
//                           {['active', 'expired', 'disabled'].map((value) => (
//                             <div
//                               key={value}
//                               className="flex items-center space-x-2"
//                             >
//                               <RadioGroupItem
//                                 value={value}
//                                 id={value}
//                                 disabled={isViewMode}
//                               />
//                               <label
//                                 htmlFor={value}
//                                 className="text-xs 2xl:text-sm text-gray-700 capitalize"
//                               >
//                                 {value}
//                               </label>
//                             </div>
//                           ))}
//                         </RadioGroup>
//                       </FormControl>
//                       <FormMessage className="text-red-500 text-xs mt-1" />
//                     </div>
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Right Side */}
//             <div className="flex flex-col items-center md:items-start space-y-8">
//               {/* Create Code */}
//               <FormField
//                 control={form.control}
//                 name="createCode"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
//                     <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
//                       Create Code
//                     </FormLabel>
//                     <div className="w-full">
//                       <FormControl>
//                         <Input
//                           type="text"
//                           disabled={isViewMode}
//                           {...field}
//                           onChange={(e) => field.onChange(e.target.value.toUpperCase())}
//                           className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-500 text-xs mt-1" />
//                     </div>
//                   </FormItem>
//                 )}
//               />

//               {/* Coupon Image (optional, not sent to API) */}
//               <FormField
//                 control={form.control}
//                 name="couponImage"
//                 render={() => (
//                   <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
//                     <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
//                       Coupon Image
//                     </FormLabel>
//                     <div className="flex items-center w-full">
//                       <FormControl>
//                         <div
//                           className="relative h-36 w-36 2xl:h-40 2xl:w-40 rounded-lg bg-[#F6EEE0]"
//                           onDrop={(e) => {
//                             e.preventDefault();
//                             const file = e.dataTransfer.files?.[0];
//                             if (file) {
//                               handleImageUpload(file);
//                             }
//                           }}
//                           onDragOver={(e) => e.preventDefault()}
//                         >
//                           <div className="h-full w-full flex items-center justify-center relative">
//                             {preview ? (
//                               <>
//                                 <img
//                                   src={preview}
//                                   alt="Coupon preview"
//                                   className="h-full w-full object-cover rounded-lg"
//                                 />
//                                 <label
//                                   htmlFor="fileUpload"
//                                   className="absolute inset-0 flex justify-center items-center cursor-pointer bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity rounded-lg"
//                                   aria-label="Reupload coupon image"
//                                 >
//                                   <PiCameraThin className="text-white w-12 h-12 opacity-70" />
//                                 </label>
//                               </>
//                             ) : (
//                               <label
//                                 htmlFor="fileUpload"
//                                 className="absolute inset-0 flex justify-center items-center cursor-pointer"
//                                 aria-label="Upload coupon image"
//                               >
//                                 <PiCameraThin className="text-black w-12 h-44 opacity-30" />
//                               </label>
//                             )}
//                           </div>
//                           <input
//                             type="file"
//                             disabled={isViewMode}
//                             accept="image/*"
//                             onChange={(e) => {
//                               const file = e.target.files?.[0];
//                               if (file) {
//                                 handleImageUpload(file);
//                               } else {
//                                 setPreview(null);
//                                 form.setValue('couponImage', undefined);
//                               }
//                             }}
//                             className="hidden"
//                             id="fileUpload"
//                           />
//                         </div>
//                       </FormControl>
//                       <FormMessage className="text-red-500 text-xs mt-1" />
//                     </div>
//                   </FormItem>
//                 )}
//               />

//               {/* Terms and Conditions */}
//               <FormField
//                 control={form.control}
//                 name="termsAndConditions"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col sm:flex-row gap-2">
//                     <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 pt-1 shrink-0">
//                       Terms and Conditions
//                     </FormLabel>
//                     <div className="w-full">
//                       <FormControl>
//                         <textarea
//                           disabled={isViewMode}
//                           {...field}
//                           className="w-64 h-32 bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 resize-y text-xs 2xl:text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-500 text-xs mt-1" />
//                     </div>
//                   </FormItem>
//                 )}
//               />
//               <div className="flex gap-4 w-full justify-end">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => router.back()}
//                   className="btn-secondary"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   className="btn-primary"
//                   disabled={mode === 'view' || loading}
//                 >
//                   {loading
//                     ? isEditMode
//                       ? 'Saving...'
//                       : 'Creating...'
//                     : isEditMode
//                       ? 'Save'
//                       : 'Create'}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </form>
//       </Form>
//     </FormWrapper>
//   );
// };

// export default CreateCouponForm;

'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FormWrapper from './form-wrapper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';
import { SelectTrigger } from '@radix-ui/react-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { PiCameraThin } from 'react-icons/pi';
import apiCall from '@/lib/axios';
import { ToastAtTopRight } from '@/lib/sweetalert';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown } from 'lucide-react';
import { Calendar as ShadCalendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import AnimatedSelect from '@/components/ui/AnimatedSelect';
import { allServices } from '@/utils/allservices';

interface CreateCouponFormProps {
  mode?: 'create' | 'view' | 'edit';
  couponId?: string;
}

const defaultValues = {
  category: 'Percentage Coupons',
  validityFrom: '',
  validityTo: '',
  usageLimit: '',
  discountPercentage: '',
  discountAmount: '',
  minimumSpent: '',
  couponStatus: 'active',
  createCode: '',
  termsAndConditions: '',
  couponImage: undefined as File | undefined,
  discountType: '',
  perUserLimit: '',
  services: [] as string[]
};

export const couponSchema = z.object({
  category: z.string().nonempty('Category is required'),
  validityFrom: z.string().nonempty('Start date is required'),
  validityTo: z.string().nonempty('End date is required'),
  usageLimit: z.string().nonempty('Usage limit is required'),
  discountPercentage: z.string().optional(),
  discountAmount: z.string().optional(),
  minimumSpent: z.string().nonempty('Minimum spent is required'),
  couponStatus: z.string().nonempty('Status is required'),
  createCode: z.string().nonempty('Coupon code is required'),
  termsAndConditions: z.string().nonempty('Terms and conditions are required'),
  couponImage: z
    .union([z.any(), z.string().url()])
    .optional()
    .refine((file) => file !== '', {
      message: 'Coupon image must not be an empty value'
    }),
  discountType: z.string().nonempty('Discount type is required'),
  perUserLimit: z
    .string()
    .nonempty('Per user limit is required')
    .refine((v) => /^\d+$/.test(v) && Number(v) > 0, {
      message: 'Enter a positive number'
    }),
  services: z.array(z.string()).optional()
});

const CreateCouponForm: React.FC<CreateCouponFormProps> = ({
  mode = 'create',
  couponId
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues
  });
  const selectedCouponCategory = form.watch('category');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    if (form.watch('category') === 'Percentage Coupons') {
      form.setValue('discountType', 'percentage');
    } else {
      form.setValue('discountType', 'fixed');
    }
  }, [form.watch('category')]);

  // Fetch coupon data for edit mode
  useEffect(() => {
    if ((isEditMode || isViewMode) && couponId) {
      (async () => {
        try {
          const res = await apiCall('GET', `api/coupon/${couponId}`);
          const data = res.coupon;

          form.reset({
            category:
              data.discountType === 'percentage'
                ? 'Percentage Coupons'
                : 'Fixed Amount Coupons',
            discountType: data.discountType,
            validityFrom: data.validFrom
              ? new Date(data.validFrom).toISOString().split('T')[0]
              : '',
            validityTo: data.validUntil
              ? new Date(data.validUntil).toISOString().split('T')[0]
              : '',
            usageLimit: data.usageLimit?.toString() || 'N/A',
            discountPercentage:
              data.discountType === 'percentage'
                ? data.value?.toString()
                : 'N/A',
            discountAmount:
              data.discountType === 'fixed' ? data.value?.toString() : '',
            minimumSpent: data.minimumSpend?.toString() || 'N/A',
            couponStatus: data.status?.toLowerCase() || 'active',
            createCode: data.code || 'N/A',
            termsAndConditions: data.termsAndConditions || 'N/A',
            couponImage: undefined,
            perUserLimit: (data.perUserLimit ?? 1).toString(),
            services: data.services || []
          });

          if (data.imageUrl) {
            setPreview(data.imageUrl);
          }
        } catch (error) {
          ToastAtTopRight.fire('Failed to fetch coupon data', 'error');
        }
      })();
    }
  }, [couponId, isEditMode, isViewMode, form]);

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      ToastAtTopRight.fire('Please upload an image file.', 'error');
      return;
    }

    if (file.size > 100 * 1024) {
      ToastAtTopRight.fire('File size exceeds 5MB.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file, file.name);

    setLoading(true);
    try {
      const res = await apiCall('POST', 'api/upload/admin', formData);
      const { url } = res.data;

      if (url) {
        setPreview(url);
        form.setValue('couponImage', file);
        ToastAtTopRight.fire('Image uploaded successfully', 'success');
      }
    } catch (err: any) {
      ToastAtTopRight.fire('Failed to upload image', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        code: data.createCode,
        discountType:
          data.category === 'Percentage Coupons' ? 'percentage' : 'fixed',
        value:
          data.category === 'Percentage Coupons'
            ? data.discountPercentage
            : String(data.discountAmount),
        minimumSpend: Number(data.minimumSpent),
        validFrom: data.validityFrom,
        validUntil: data.validityTo,
        usageLimit: Number(data.usageLimit),
        perUserLimit: Number(data.perUserLimit),
        stockable: false,
        imageUrl: preview || '',
        termsAndConditions: data.termsAndConditions,
        status:
          data.couponStatus.charAt(0).toUpperCase() +
          data.couponStatus.slice(1).toLowerCase(),
        services: data.services || []
      };
      if (isEditMode && couponId) {
        await apiCall('PUT', `api/coupon/${couponId}`, payload);
        console.log(payload);
        ToastAtTopRight.fire('Coupon updated successfully!', 'success');
      } else {
        await apiCall('POST', 'api/coupon', payload);
        ToastAtTopRight.fire('Coupon created successfully!', 'success');
      }
      form.reset();
      setPreview(null);
      router.back();
    } catch (error: any) {
      ToastAtTopRight.fire(error?.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  const stripTime = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  const ymdToLocalDate = (s?: string) => {
    if (!s) return undefined;
    const [y, m, d] = s.split('-').map(Number);
    if (!y || !m || !d) return undefined;
    return new Date(y, m - 1, d);
  };

  const formatYMD = (d: Date) => d.toLocaleDateString('en-CA'); // => YYYY-MM-DD

  /* -------------------------------------------------------
     Brown theme calendar classNames (reuse anywhere)
  ------------------------------------------------------- */
  const brownCalendarClassNames = {
    months: 'space-y-2',
    month: 'space-y-2',
    caption: 'flex justify-between items-center px-2 pt-2',
    caption_label: 'text-[#8B4513] font-semibold text-sm',
    nav: 'flex items-center gap-1',
    nav_button: 'h-8 w-8 rounded-md hover:bg-[#8B4513]/10',

    head_row: 'grid grid-cols-7',
    head_cell:
      'text-[11px] font-semibold text-[#8B4513]/80 h-8 w-8 grid place-items-center',

    table: 'w-full border-collapse',
    row: 'grid grid-cols-7 gap-0',
    cell: 'h-10 w-10 text-center p-0',

    day: [
      'h-9 w-9 rounded-full p-0 grid place-items-center',
      'text-[13px] font-medium',
      'hover:bg-[#8B4513]/10 hover:text-[#2a1a0d]',
      'focus:outline-none focus:ring-2 focus:ring-[#8B4513]/40'
    ].join(' '),

    day_selected: 'bg-[#8B4513] text-white hover:bg-[#7a3e10] hover:text-white',

    day_today:
      "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-[#8B4513]",

    day_outside: 'hidden',
    day_disabled: 'text-gray-300 opacity-70 cursor-not-allowed'
  } as const;

  return (
    <FormWrapper title="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log('Validation Errors:', errors);
            ToastAtTopRight.fire('Please fix the errors in the form.', 'error');
          })}
          className="w-full relative h-full max-w-4xl mx-auto rounded-lg"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Left Side */}
            <div className="flex flex-col gap-3">
              {/* Category */}
              <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
                  Select Category
                </FormLabel>
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isViewMode}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 py-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm relative pr-8">
                              <SelectValue />
                              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="">
                            {['Percentage Coupons', 'Fixed Amount Coupons'].map(
                              (value) => (
                                <SelectItem key={value} value={value}>
                                  {value}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </>
                    )}
                  />
                </div>
              </FormItem>

              {/* Validity */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
                    Validity
                  </FormLabel>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <FormField
                      control={form.control}
                      name="validityFrom"
                      render={({ field }) => {
                        const [open, setOpen] = React.useState(false);

                        const today = stripTime(new Date());
                        const valueAsDate = field.value
                          ? ymdToLocalDate(field.value)
                          : undefined;
                        const [tempDate, setTempDate] = React.useState<
                          Date | undefined
                        >(valueAsDate);

                        const commit = () => {
                          if (!tempDate) return;
                          field.onChange(formatYMD(tempDate));
                          setOpen(false);
                        };

                        return (
                          <FormItem className="flex-1">
                            <FormLabel className="text-black text-[0.8rem]">
                              Validity From{' '}
                              <span className="text-red-600">*</span>
                            </FormLabel>

                            <FormControl>
                              <Popover
                                open={isViewMode ? false : open}
                                onOpenChange={(o) => {
                                  if (isViewMode) return;
                                  setOpen(o);
                                  if (o) setTempDate(valueAsDate);
                                }}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isViewMode}
                                    className={`w-full justify-between bg-[#F6EEE0] text-gray-700 border-none text-xs 2xl:text-sm ${
                                      !valueAsDate
                                        ? 'text-muted-foreground'
                                        : ''
                                    }`}
                                  >
                                    <span>
                                      {valueAsDate
                                        ? valueAsDate.toLocaleDateString(
                                            undefined,
                                            {
                                              day: '2-digit',
                                              month: 'short',
                                              year: 'numeric'
                                            }
                                          )
                                        : 'From (YYYY-MM-DD)'}
                                    </span>
                                    <CalendarIcon className="h-4 w-4 opacity-70" />
                                  </Button>
                                </PopoverTrigger>

                                {/* Wider popover so buttons calendar ke andar proper dikhen */}
                                <PopoverContent
                                  align="start"
                                  sideOffset={6}
                                  className="p-0 w-[360px] sm:w-[420px] rounded-xl border border-[#8B4513]/20 shadow-xl"
                                >
                                  <div className="p-3">
                                    <ShadCalendar
                                      mode="single"
                                      selected={tempDate}
                                      onSelect={(d?: Date) =>
                                        setTempDate(
                                          d ? stripTime(d) : undefined
                                        )
                                      }
                                      showOutsideDays={false}
                                      weekStartsOn={0}
                                      disabled={(date: Date) =>
                                        stripTime(date) < today
                                      }
                                      className="w-full p-2"
                                      classNames={brownCalendarClassNames}
                                      modifiers={{
                                        weekend: (d: Date) =>
                                          d.getDay() === 0 || d.getDay() === 6
                                      }}
                                      modifiersClassNames={{
                                        weekend: 'text-[#8B4513]/70'
                                      }}
                                    />

                                    {/* Actions */}
                                    <div className="mt-3 flex items-center justify-end gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-[#F6EEE0] text-[#8B4513] border border-[#8B4513]/30"
                                        onClick={() => setOpen(false)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        type="button"
                                        className="bg-[#8B4513] text-white hover:bg-[#7a3e10]"
                                        onClick={commit}
                                        disabled={!tempDate}
                                      >
                                        Set
                                      </Button>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </FormControl>

                            <FormMessage className="text-red-500 text-xs mt-1" />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="validityTo"
                      render={({ field }) => {
                        const [open, setOpen] = React.useState(false);

                        const today = stripTime(new Date());

                        // current value
                        const valueAsDate = field.value
                          ? ymdToLocalDate(field.value)
                          : undefined;

                        // min should not be before validityFrom (if present)
                        const fromRaw: string | undefined =
                          form.getValues?.('validityFrom');
                        const fromDate = fromRaw
                          ? ymdToLocalDate(fromRaw)
                          : undefined;
                        const minSelectable = stripTime(
                          fromDate && fromDate > today ? fromDate : today
                        );

                        // temp date inside popover
                        const [tempDate, setTempDate] = React.useState<
                          Date | undefined
                        >(valueAsDate);

                        const commit = () => {
                          if (!tempDate) return;
                          field.onChange(formatYMD(tempDate));
                          setOpen(false);
                        };

                        return (
                          <FormItem className="flex-1">
                            <FormLabel className="text-black text-[0.8rem]">
                              Validity To{' '}
                              <span className="text-red-600">*</span>
                            </FormLabel>

                            <FormControl>
                              <Popover
                                open={isViewMode ? false : open}
                                onOpenChange={(o) => {
                                  if (isViewMode) return;
                                  setOpen(o);
                                  if (o) setTempDate(valueAsDate);
                                }}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isViewMode}
                                    className={`w-full justify-between bg-[#F6EEE0] text-gray-700 border-none text-xs 2xl:text-sm ${
                                      !valueAsDate
                                        ? 'text-muted-foreground'
                                        : ''
                                    }`}
                                  >
                                    <span>
                                      {valueAsDate
                                        ? valueAsDate.toLocaleDateString(
                                            undefined,
                                            {
                                              day: '2-digit',
                                              month: 'short',
                                              year: 'numeric'
                                            }
                                          )
                                        : 'To (YYYY-MM-DD)'}
                                    </span>
                                    <CalendarIcon className="h-4 w-4 opacity-70" />
                                  </Button>
                                </PopoverTrigger>

                                {/* Wider content so actions calendar ke andar rahen */}
                                <PopoverContent
                                  align="start"
                                  sideOffset={6}
                                  className="p-0 w-[360px] sm:w-[420px] rounded-xl border border-[#8B4513]/20 shadow-xl"
                                >
                                  <div className="p-3">
                                    <ShadCalendar
                                      mode="single"
                                      selected={tempDate}
                                      onSelect={(d?: Date) =>
                                        setTempDate(
                                          d ? stripTime(d) : undefined
                                        )
                                      }
                                      showOutsideDays={false}
                                      weekStartsOn={0}
                                      disabled={(date: Date) =>
                                        stripTime(date) < minSelectable
                                      }
                                      className="w-full p-2"
                                      classNames={brownCalendarClassNames}
                                      modifiers={{
                                        weekend: (d: Date) =>
                                          d.getDay() === 0 || d.getDay() === 6
                                      }}
                                      modifiersClassNames={{
                                        weekend: 'text-[#8B4513]/70'
                                      }}
                                    />

                                    <div className="mt-3 flex items-center justify-end gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-[#F6EEE0] text-[#8B4513] border border-[#8B4513]/30"
                                        onClick={() => setOpen(false)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        type="button"
                                        className="bg-[#8B4513] text-white hover:bg-[#7a3e10]"
                                        onClick={commit}
                                        disabled={!tempDate}
                                      >
                                        Set
                                      </Button>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </FormControl>

                            <FormMessage className="text-red-500 text-xs mt-1" />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Limits */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="usageLimit"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
                        Usage Limit
                      </FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <Input
                            type="text"
                            disabled={isViewMode}
                            {...field}
                            className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="perUserLimit"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
                        Per User Limit
                      </FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            disabled={isViewMode}
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value.replace(/[^\d]/g, '')
                              )
                            }
                            className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </div>
                    </FormItem>
                  )}
                />
                {selectedCouponCategory === 'Percentage Coupons' && (
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
                          Discount (%)
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              type="text"
                              disabled={isViewMode}
                              {...field}
                              className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </div>
                      </FormItem>
                    )}
                  />
                )}
                {selectedCouponCategory === 'Fixed Amount Coupons' && (
                  <FormField
                    control={form.control}
                    name="discountAmount"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
                          Discount in Amount
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              type="number"
                              disabled={isViewMode}
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </div>
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="minimumSpent"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
                        Minimum Spent
                      </FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <Input
                            type="text"
                            disabled={isViewMode}
                            {...field}
                            className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Coupon Status */}
              <FormField
                control={form.control}
                name="couponStatus"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row gap-2">
                    <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 pt-1 shrink-0">
                      Coupon Status
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-2"
                          disabled={isViewMode}
                        >
                          {['active', 'expired', 'disabled'].map((value) => (
                            <div
                              key={value}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={value}
                                id={value}
                                disabled={isViewMode}
                              />
                              <label
                                htmlFor={value}
                                className="text-xs 2xl:text-sm text-gray-700 capitalize"
                              >
                                {value}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Services Selection */}
              <FormField
                control={form.control}
                name="services"
                render={({ field }) => {
                  const selectedServices = field.value || [];
                  const serviceOptions = allServices.map((s) => s.displayName);
                  const availableServices = serviceOptions.filter(
                    (s) => !selectedServices.includes(s)
                  );

                  const handleServiceAdd = (e: any) => {
                    const newService = e?.target?.value || e;
                    if (newService && newService !== '' && !selectedServices.includes(newService)) {
                      field.onChange([...selectedServices, newService]);
                    }
                  };

                  const handleServiceRemove = (serviceToRemove: string) => {
                    field.onChange(
                      selectedServices.filter((s) => s !== serviceToRemove)
                    );
                  };

                  return (
                    <FormItem className="flex flex-col sm:flex-row gap-2">
                      <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 pt-1 shrink-0">
                        Applicable Services
                      </FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <div className="space-y-3">
                            {/* AnimatedSelect for adding services */}
                            {!isViewMode && (
                              <div className="relative z-50">
                                <AnimatedSelect
                                  label=""
                                  name="serviceSelect"
                                  options={availableServices}
                                  value=""
                                  onChange={handleServiceAdd}
                                  searchable={true}
                                  dropdownPosition="top"
                                />
                              </div>
                            )}
                            
                            {/* Display selected services as chips */}
                            {selectedServices.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {selectedServices.map((service) => (
                                  <div
                                    key={service}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6EEE0] text-gray-700 text-xs"
                                  >
                                    <span>{service}</span>
                                    {!isViewMode && (
                                      <button
                                        type="button"
                                        onClick={() => handleServiceRemove(service)}
                                        className="text-red-600 hover:text-red-800 font-bold"
                                        aria-label={`Remove ${service}`}
                                      >
                                        ×
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {selectedServices.length === 0 && (
                              <p className="text-xs text-gray-500 mt-2">
                                No services selected. Coupon will apply to all services.
                              </p>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </div>
                    </FormItem>
                  );
                }}
              />
            </div>

            {/* Right Side */}
            <div className="flex flex-col items-center md:items-start space-y-8">
              {/* Create Code */}
              <FormField
                control={form.control}
                name="createCode"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
                      Create Code
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          type="text"
                          disabled={isViewMode}
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Coupon Image (optional, not sent to API) */}
              <FormField
                control={form.control}
                name="couponImage"
                render={() => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
                      Coupon Image
                    </FormLabel>
                    <div className="flex items-center w-full">
                      <FormControl>
                        <div
                          className="relative h-36 w-36 2xl:h-40 2xl:w-40 rounded-lg bg-[#F6EEE0]"
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files?.[0];
                            if (file) {
                              handleImageUpload(file);
                            }
                          }}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          <div className="h-full w-full flex items-center justify-center relative">
                            {preview ? (
                              <>
                                <img
                                  src={preview}
                                  alt="Coupon preview"
                                  className="h-full w-full object-cover rounded-lg"
                                />
                                <label
                                  htmlFor="fileUpload"
                                  className="absolute inset-0 flex justify-center items-center cursor-pointer bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity rounded-lg"
                                  aria-label="Reupload coupon image"
                                >
                                  <PiCameraThin className="text-white w-12 h-12 opacity-70" />
                                </label>
                              </>
                            ) : (
                              <label
                                htmlFor="fileUpload"
                                className="absolute inset-0 flex justify-center items-center cursor-pointer"
                                aria-label="Upload coupon image"
                              >
                                <PiCameraThin className="text-black w-12 h-44 opacity-30" />
                              </label>
                            )}
                          </div>
                          <input
                            type="file"
                            disabled={isViewMode}
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file);
                              } else {
                                setPreview(null);
                                form.setValue('couponImage', undefined);
                              }
                            }}
                            className="hidden"
                            id="fileUpload"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Terms and Conditions */}
              <FormField
                control={form.control}
                name="termsAndConditions"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row gap-2">
                    <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 pt-1 shrink-0">
                      Terms and Conditions
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <textarea
                          disabled={isViewMode}
                          {...field}
                          className="w-64 h-32 bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 resize-y text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex gap-4 w-full justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="btn-secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="btn-primary"
                  disabled={mode === 'view' || loading}
                >
                  {loading
                    ? isEditMode
                      ? 'Saving...'
                      : 'Creating...'
                    : isEditMode
                      ? 'Save'
                      : 'Create'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </FormWrapper>
  );
};

export default CreateCouponForm;

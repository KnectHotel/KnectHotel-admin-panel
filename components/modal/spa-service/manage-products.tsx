



















































































































































































































































































































































































































































































































'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  SpaManageProductsModalFormSchema,
  SpaManageProductsModalFormSchemaType
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
import { Textarea } from '@/components/ui/textarea';
import apiCall from '@/lib/axios';
import { ToastAtTopRight } from '@/lib/sweetalert';


const S3_BASE = 'https://dibstestbucket0403.s3.ap-south-1.amazonaws.com';

const keyToUrl = (value?: string | null) => {
  if (!value) return null;
  if (/^https?:\/\
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

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editMode?: boolean;
  productId?: string;
};

const ManageProducts: React.FC<ModalProps> = ({ isOpen, onClose, editMode = false, productId }) => {
  const router = useRouter();

  
  const [productPreview, setProductPreview] = useState<string | null>(null);
  const [productUploadedUrl, setProductUploadedUrl] = useState<string | null>(null);
  const [productUploadedKey, setProductUploadedKey] = useState<string | null>(null);

  
  const [addSvcPreview, setAddSvcPreview] = useState<string | null>(null);
  const [addSvcUploadedUrl, setAddSvcUploadedUrl] = useState<string | null>(null);
  const [addSvcUploadedKey, setAddSvcUploadedKey] = useState<string | null>(null);

  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingAdd, setUploadingAdd] = useState(false);

  const form = useForm<SpaManageProductsModalFormSchemaType>({
    resolver: zodResolver(SpaManageProductsModalFormSchema),
    defaultValues: {
      productCategory: '',
      selectService: 'SPA SERVICE',
      name: '',
      description: '',
      productImage: undefined,
      visibility: true,
      additionalService: '',
      additionalServicePrice: 0,
      additionalServiceImage: undefined
    }
  });

  
  useEffect(() => {
    return () => {
      if (productPreview?.startsWith('blob:')) URL.revokeObjectURL(productPreview);
      if (addSvcPreview?.startsWith('blob:')) URL.revokeObjectURL(addSvcPreview);
    };
  }, [productPreview, addSvcPreview]);

  
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setProductPreview(null);
      setProductUploadedKey(null);
      setProductUploadedUrl(null);

      setAddSvcPreview(null);
      setAddSvcUploadedKey(null);
      setAddSvcUploadedUrl(null);

      setUploadingMain(false);
      setUploadingAdd(false);
    }
  }, [isOpen, form]);

  
  useEffect(() => {
    if (editMode && productId) {
      (async () => {
        try {
          const res = await apiCall('PUT', `/api/services/spasalon/products/${productId}`);
          const product = res?.data;
          if (product) {
            form.reset({
              productCategory: product.productCategory,
              selectService: product.serviceType === 'Spa' ? 'SPA SERVICE' : 'SALON SERVICE',
              name: product.productName,
              description: product.description,
              visibility: product.visibility,
              productImage: product.imageUrl,
              additionalService: product.additionalServices?.[0]?.name || '',
              additionalServicePrice: product.additionalServices?.[0]?.price || 0,
              additionalServiceImage: undefined
            });

            
            if (product.imageUrl) {
              const display = keyToUrl(product.imageUrl);
              setProductPreview(display);
              if (/^https?:\/\
                setProductUploadedUrl(product.imageUrl);
                setProductUploadedKey(null);
              } else {
                setProductUploadedKey(product.imageUrl);
                setProductUploadedUrl(null);
              }
            }

            
            const asImg = product.additionalServices?.[0]?.imageUrl;
            if (asImg) {
              const display = keyToUrl(asImg);
              setAddSvcPreview(display);
              if (/^https?:\/\
                setAddSvcUploadedUrl(asImg);
                setAddSvcUploadedKey(null);
              } else {
                setAddSvcUploadedKey(asImg);
                setAddSvcUploadedUrl(null);
              }
            }
          }
        } catch (error) {
          console.error('❌ Failed to fetch product data:', error);
        }
      })();
    }
  }, [editMode, productId, form]);

  
  const uploadImage = async (file: File, setBusy: (b: boolean) => void) => {
    if (!file.type.startsWith('image/')) {
      ToastAtTopRight.fire('Please upload an image file.', 'error');
      return null;
    }
    if (file.size > 100 * 1024) {
      ToastAtTopRight.fire('File size exceeds 100KB.', 'error');
      return null;
    }

    const tryWithField = async (fieldName: string) => {
      const fd = new FormData();
      fd.append(fieldName, file, file.name);
      return await apiCall('POST', 'api/upload/admin', fd);
    };

    const fieldCandidates = ['file', 'document', 'image', 'photo', 'avatar', 'upload', 'picture', 'files', 'documents'];

    setBusy(true);
    try {
      let res: any | null = null;
      let lastErr: any = null;

      for (const name of fieldCandidates) {
        try {
          res = await tryWithField(name);
          break;
        } catch (err: any) {
          lastErr = err;
          const msg = err?.response?.data?.message || err?.message || '';
          if (!/Unexpected field/i.test(msg)) {
            throw err;
          }
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
      return { url: url || null, key: key || null, previewUrl: url || keyToUrl(key)! };
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Upload failed';
      ToastAtTopRight.fire(msg, 'error');
      return null;
    } finally {
      setBusy(false);
    }
  };

  
  const handleProductDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const result = await uploadImage(file, setUploadingMain);
    if (!result) return;
    setProductUploadedUrl(result.url);
    setProductUploadedKey(result.key);
    setProductPreview(result.previewUrl);
    form.setValue('productImage', file);
    ToastAtTopRight.fire('Image uploaded successfully', 'success');
  };

  const handleProductInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setProductPreview(null);
      setProductUploadedKey(null);
      setProductUploadedUrl(null);
      form.setValue('productImage', undefined);
      return;
    }
    const result = await uploadImage(file, setUploadingMain);
    if (!result) return;
    setProductUploadedUrl(result.url);
    setProductUploadedKey(result.key);
    setProductPreview(result.previewUrl);
    form.setValue('productImage', file);
    ToastAtTopRight.fire('Image uploaded successfully', 'success');
  };

  
  const handleAddSvcDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const result = await uploadImage(file, setUploadingAdd);
    if (!result) return;
    setAddSvcUploadedUrl(result.url);
    setAddSvcUploadedKey(result.key);
    setAddSvcPreview(result.previewUrl);
    form.setValue('additionalServiceImage', file);
    ToastAtTopRight.fire('Image uploaded successfully', 'success');
  };

  const handleAddSvcInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAddSvcPreview(null);
      setAddSvcUploadedKey(null);
      setAddSvcUploadedUrl(null);
      form.setValue('additionalServiceImage', undefined);
      return;
    }
    const result = await uploadImage(file, setUploadingAdd);
    if (!result) return;
    setAddSvcUploadedUrl(result.url);
    setAddSvcUploadedKey(result.key);
    setAddSvcPreview(result.previewUrl);
    form.setValue('additionalServiceImage', file);
    ToastAtTopRight.fire('Image uploaded successfully', 'success');
  };

  
  const onSubmit = async (data: SpaManageProductsModalFormSchemaType) => {
    try {
      const mainImageUrlForPayload = productUploadedUrl || keyToUrl(productUploadedKey) || null;
      const addSvcImageUrlForPayload = addSvcUploadedUrl || keyToUrl(addSvcUploadedKey) || null;

      const payload: any = {
        serviceType: data.selectService === 'SPA SERVICE' ? 'Spa' : 'Salon',
        productCategory: data.productCategory,
        productName: data.name,
        description: data.description,
        visibility: data.visibility,
        price: data.additionalServicePrice,
        imageUrl: mainImageUrlForPayload,
        additionalServices: data.additionalService
          ? [{ name: data.additionalService, price: data.additionalServicePrice, imageUrl: addSvcImageUrlForPayload }]
          : []
      };

      const endpoint = editMode
        ? `/api/services/spasalon/products/${productId}`
        : 'api/services/spasalon/products';
      const method = editMode ? 'PUT' : 'POST';

      const response = await apiCall(method, endpoint, payload);

      if (response?.success) {
        ToastAtTopRight.fire({
          icon: 'success',
          title: `Product ${editMode ? 'updated' : 'added'} successfully`
        });
        form.reset();
        setProductPreview(null);
        setProductUploadedKey(null);
        setProductUploadedUrl(null);
        setAddSvcPreview(null);
        setAddSvcUploadedKey(null);
        setAddSvcUploadedUrl(null);
        onClose();
      } else {
        ToastAtTopRight.fire({
          icon: 'error',
          title: response?.message || 'Something went wrong'
        });
      }
    } catch (error) {
      console.error('❌ Error submitting product:', error);
      ToastAtTopRight.fire({
        icon: 'error',
        title: 'Submission failed. Please try again.'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-[#FAF6EF] rounded-lg shadow-lg pt-4 pb-8 w-full max-w-5xl relative animate-fadeIn">
        <X
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-600 hover:text-black"
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 text-sm">
            {}
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
                        placeholder="Enter Product Category"
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
                        <SelectTrigger className="w-44 bg-lightbrown text-gray-700 py-4 px-2 rounded-md border-none">
                          <SelectValue placeholder="Select type" />
                          <ChevronDown className="ml-2 mt-1 h-5 w-5 text-black" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#362913] text-nowrap rounded-2xl text-white border-2 shadow-md border-white">
                          {['SPA SERVICE', 'SALON SERVICE'].map((value) => (
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

            {}
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
                      <FormLabel className="text-sm w-[125px] text-nowrap font-medium text-gray-700">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Product Description"
                          {...field}
                          className="bg-[#F6EEE0] w-64 text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm resize-y min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {}
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
                          onDrop={handleProductDrop}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          <div className="h-full w-full flex items-center justify-center relative">
                            {productPreview ? (
                              <>
                                <img
                                  src={productPreview}
                                  alt="Product preview"
                                  className="h-full w-full object-cover rounded-lg"
                                />
                                <label
                                  htmlFor="productImageUpload"
                                  className="absolute inset-0 flex justify-center items-center cursor-pointer bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity rounded-lg"
                                  aria-label="Reupload product image"
                                >
                                  <PiCameraThin className="text-white w-12 h-12 opacity-70" />
                                </label>
                                {uploadingMain && (
                                  <div className="absolute bottom-1 right-1 text-[11px] bg-black/60 text-white px-2 py-0.5 rounded">
                                    Uploading…
                                  </div>
                                )}
                              </>
                            ) : (
                              <label
                                htmlFor="productImageUpload"
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
                            onChange={handleProductInput}
                            className="hidden"
                            id="productImageUpload"
                          />
                        </div>
                      </FormControl>
                      <div className="text-xs text-gray-500">
                        {productUploadedKey ? (
                          <>Stored as Key: <span className="font-mono">{productUploadedKey}</span></>
                        ) : productUploadedUrl ? (
                          <>Using URL: <span className="font-mono break-all">{productUploadedUrl}</span></>
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

            {}
            <div className="flex justify-between items-start px-10">
              <div className="w-[60%] flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="additionalService"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="text-sm w-40 text-nowrap font-medium text-gray-700">
                        Additional Service
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Service Name"
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
                  name="additionalServicePrice"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="text-sm w-40 text-nowrap font-medium text-gray-700">
                        Price (Excluding GST)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Price(₹)"
                          {...field}
                          className="bg-[#F6EEE0] w-40 text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
              </div>

              {}
              {}
            </div>

            <div className="w-full h-[1px] bg-black opacity-15" />

            {}
            <div className="flex items-center gap-4 px-10">
              <Button type="submit" className="btn-primary" disabled={uploadingMain || uploadingAdd}>
                Save
              </Button>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/hotel-panel/service-management/spa/products');
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

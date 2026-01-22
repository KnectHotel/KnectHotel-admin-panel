'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AddItemsSchema, AddItemsSchemaType } from 'schema';
import { PiCameraThin } from 'react-icons/pi';
import { ToastAtTopRight } from '@/lib/sweetalert';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X } from 'lucide-react';
import ToggleButton from '@/components/ui/toggleButton';
import apiCall from '@/lib/axios';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMode?: boolean;
  productId?: string;
}


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

    url =
      c.url ??
      c.URL ??
      c.Location ??
      c.location ??
      c.link ??
      c.href ??
      url;

    key =
      c.Key ??
      c.key ??
      c.objectKey ??
      c.fileKey ??
      key;

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


const AddItemModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  editMode = false,
  productId,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedKey, setUploadedKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);


  const doUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      ToastAtTopRight.fire('Please upload an image file.', 'error');
      return;
    }

    if (file.size > 100 * 1024) {
      ToastAtTopRight.fire('File size exceeds 100KB.', 'error');
      return;
    }

    const tryWithField = async (fieldName: string) => {
      const fd = new FormData();
      fd.append(fieldName, file, file.name);
      return await apiCall('POST', 'api/upload/admin', fd);
    };

    const fieldCandidates = [
      'file',
      'document',
      'image',
      'photo',
      'avatar',
      'upload',
      'picture',
      'files',
      'documents',
    ];

    setUploading(true);
    try {
      let res: any | null = null;
      let lastErr: any = null;

      for (let i = 0; i < fieldCandidates.length; i++) {
        try {
          res = await tryWithField(fieldCandidates[i]);
          break;
        } catch (err: any) {
          lastErr = err;
          const msg =
            err?.response?.data?.message || err?.message || '';
          if (!/Unexpected field/i.test(msg)) throw err;
        }
      }

      if (!res) {
        const msg =
          lastErr?.response?.data?.message ||
          lastErr?.message ||
          'Upload failed';
        ToastAtTopRight.fire(msg, 'error');
        return;
      }

      const { url, key } = extractUploadFields(res?.data ?? res);

      if (!url && !key) {
        ToastAtTopRight.fire(
          'Upload succeeded but url/Key missing.',
          'error'
        );
        return;
      }

      const previewUrl = url || keyToUrl(key)!;

      setUploadedUrl(url || keyToUrl(key));
      setUploadedKey(key);
      setPreview(previewUrl);

      ToastAtTopRight.fire('Image uploaded successfully', 'success');

      addItemForm.setValue('itemImage', file);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || 'Upload failed';
      ToastAtTopRight.fire(msg, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void doUpload(file);
  };



  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const addItemForm = useForm<AddItemsSchemaType>({
    resolver: zodResolver(AddItemsSchema),
    defaultValues: {
      productType: '',
      productName: '',
      description: '',
      cost: 0,
      foodType: 'vegetarian',
      visibility: false,
      itemImage: undefined
    }
  });

  useEffect(() => {
    if (editMode && productId) {
      (async () => {
        try {
          console.log('Fetching product ID:', productId);
          const res = await apiCall(
            'PUT',
            `api/services/inroomdining/products/${productId}`
          );
          console.log('Product fetch response:', res);
          const product = res?.data;

          if (product) {
            addItemForm.reset({
              productType: product.productType || '',
              productName: product.productName || '',
              description: product.description || '',
              cost: product.cost || 0,
              foodType: product.foodType || 'vegetarian',
              visibility: product.visibility || false,
              itemImage: product.imageUrl || undefined,
            });
            if (product.imageUrl) {
              setPreview(product.imageUrl);
            }
          }
        } catch (error) {
          console.error('Failed to fetch product details:', error);
        }
      })();
    }
  }, [editMode, productId]);

  const imageUrlForPayload = uploadedUrl || keyToUrl(uploadedKey) || null;
  const onSubmit = async (data: AddItemsSchemaType) => {
    try {
      const payload = {
        productType: data.productType,
        productName: data.productName,
        description: data.description,
        cost: data.cost,
        foodType: data.foodType,
        visibility: data.visibility,
        imageUrl: imageUrlForPayload,
      };

      const endpoint = editMode
        ? `/api/services/inroomdining/products/${productId}`
        : '/api/services/inroomdining/products';

      const method = editMode ? 'PUT' : 'POST';

      const response = await apiCall(method, endpoint, payload);
      console.log(payload)

      if (response?.success) {
        
        ToastAtTopRight.fire({
          icon: 'success',
          title: `Product ${editMode ? 'updated' : 'added'} successfully!`
        });
        addItemForm.reset();
        setPreview(null);
        onClose();
      } else {
        
        ToastAtTopRight.fire({
          icon: 'error',
          title: `Failed: ${response?.message || 'Something went wrong'}`
        });
      }
    } catch (error: any) {
      console.error(
        'Error submitting product:',
        error?.response?.data || error.message || error
      );
      alert(error?.response?.data?.message || 'Failed to submit product');
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

        <Form {...addItemForm}>
          <form
            onSubmit={addItemForm.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 text-sm"
          >
            {}
            <div className="flex w-full md:w-[80%] lg:w-[75%] 2xl:w-[70%] gap-6 px-10">
              <FormField
                control={addItemForm.control}
                name="productType"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-start">
                    <div className="flex items-center gap-4">
                      <FormLabel className="w-56">New Product Type</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product type"
                          {...field}
                          className="bg-[#F6EEE0] w-64 h-8 text-gray-700 placeholder:opacity-55 rounded-lg border-none outline-none focus:ring-0 text-sm"
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="mt-1 text-xs 2xl:text-sm ml-56" />
                  </FormItem>
                )}
              />
            </div>
            {}
            <div className="w-full h-[1px] bg-black opacity-20" />
            {}
            <div className="flex justify-between items-start px-10">
              <div className="w-[60%] flex flex-col gap-6">
                {}
                <FormField
                  control={addItemForm.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex items-center gap-4">
                        <FormLabel className="text-sm w-40 font-medium text-gray-700">
                          Product Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Product Name"
                            {...field}
                            className="bg-[#F6EEE0] w-64 text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm"
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="mt-1 text-xs 2xl:text-sm ml-40" />
                    </FormItem>
                  )}
                />

                {}
                <FormField
                  control={addItemForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex items-center gap-4">
                        <FormLabel className="text-sm w-40 font-medium text-gray-700">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Description"
                            {...field}
                            className="bg-[#F6EEE0] w-64 text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm"
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="mt-1 text-xs 2xl:text-sm ml-40" />
                    </FormItem>
                  )}
                />

                {}
                <FormField
                  control={addItemForm.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex items-center gap-4">
                        <FormLabel className="text-sm w-40 font-medium text-gray-700">
                          Cost (Excluding GST)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter Cost"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                            className="bg-[#F6EEE0] w-64 text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm"
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="mt-1 text-xs 2xl:text-sm ml-40" />
                    </FormItem>
                  )}
                />

                {}
                <FormField
                  control={addItemForm.control}
                  name="foodType"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex items-start gap-4">
                        <FormLabel className="w-32 text-xs 2xl:text-sm font-medium text-gray-700 pt-1">
                          Type
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {['vegetarian', 'non-vegetarian'].map((val) => (
                              <div
                                key={val}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem value={val} id={val} />
                                <label
                                  htmlFor={val}
                                  className="text-xs 2xl:text-sm text-gray-700 capitalize"
                                >
                                  {val === 'vegetarian'
                                    ? 'vegetarian'
                                    : 'non-vegetarian'}
                                </label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </div>
                      <FormMessage className="mt-1 text-xs 2xl:text-sm ml-32" />
                    </FormItem>
                  )}
                />

                {}
                {}
                <FormField
                  control={addItemForm.control}
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
              <div className="w-[30%] pt-7">
                <FormField
                  control={addItemForm.control}
                  name="itemImage"
                  render={() => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="text-sm w-40 font-medium text-gray-700">
                        Product Image
                      </FormLabel>
                      <FormControl>
                        <div className="relative h-44 w-44 rounded-lg bg-[#F6EEE0] overflow-hidden">
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
                      <div className="text-xs text-gray-500">
                        {uploadedKey
                          ? <>Stored as Key: <span className="font-mono">{uploadedKey}</span></>
                          : uploadedUrl
                            ? <>Using URL: <span className="font-mono break-all">{uploadedUrl}</span></>
                            : <>PNG/JPG ≤ 100KB</>}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
            </div>
            <div className="w-full h-[1px] bg-black opacity-15" />
            {}
            <div className="flex items-center gap-4 px-10">
              <Button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </Button>
              <Button type="submit" className="btn-primary">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddItemModal;
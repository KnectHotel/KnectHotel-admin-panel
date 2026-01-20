'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  GymManageProductsModalFormSchema,
  GymManageProductsModalFormSchemaType
} from 'schema';
import { PiCameraThin } from 'react-icons/pi';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel
} from '../../ui/form';
import { Button } from '../../ui/button';
import { X } from 'lucide-react';
import { ToastAtTopRight } from '@/lib/sweetalert';
import { Input } from '@/components/ui/input';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageProductsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const form = useForm<GymManageProductsModalFormSchemaType>({
    resolver: zodResolver(GymManageProductsModalFormSchema),
    defaultValues: {
      equipmentName: '',
      equipmentImage: undefined
    }
  });

  const onSubmit = (data: GymManageProductsModalFormSchemaType) => {
    console.log('Submitted Data:', data);
    form.reset();
    setPreview(null);
    ToastAtTopRight.fire({
      icon: 'success',
      title: 'Image Added Successfully'
    });
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 text-sm"
          >
            {}
            <div className="w-full h-[1px] bg-black opacity-20 mt-12" />

            {}
            <div className="flex flex-col gap-2 justify-center items-center px-10">
              {}
              <FormField
                control={form.control}
                name="equipmentImage"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormControl>
                      <div
                        className="relative h-44 w-44 rounded-lg bg-[#F6EEE0]"
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            if (!file.type.startsWith('image/')) {
                              alert('Please upload an image file.');
                              return;
                            }
                            if (file.size > 5 * 1024 * 1024) {
                              alert('File size exceeds 5MB.');
                              return;
                            }
                            if (preview) URL.revokeObjectURL(preview);
                            const imageUrl = URL.createObjectURL(file);
                            setPreview(imageUrl);
                            field.onChange(file);
                          }
                        }}
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
                              {}
                              <label
                                htmlFor="fileUpload"
                                className="absolute inset-0 flex justify-center items-center cursor-pointer bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity rounded-lg"
                                aria-label="Reupload product image"
                              >
                                <PiCameraThin className="text-white w-12 h-12 opacity-70" />
                              </label>
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
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (!file.type.startsWith('image/')) {
                                alert('Please upload an image file.');
                                return;
                              }
                              if (file.size > 5 * 1024 * 1024) {
                                alert('File size exceeds 5MB.');
                                return;
                              }
                              if (preview) URL.revokeObjectURL(preview);
                              const imageUrl = URL.createObjectURL(file);
                              setPreview(imageUrl);
                              field.onChange(file);
                            } else {
                              setPreview(null);
                              field.onChange(undefined);
                            }
                          }}
                          className="hidden"
                          id="fileUpload"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="equipmentName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Equipment Name"
                        {...field}
                        className="bg-[#F6EEE0] placeholder:text-center w-64 text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full h-[1px] bg-black opacity-15" />

            {}
            <div className="flex items-center gap-4 px-10">
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

export default ManageProductsModal;

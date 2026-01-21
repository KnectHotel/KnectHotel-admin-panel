'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { AddMenuSchema, AddMenuSchemaType } from 'schema';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../ui/select';
import { ChevronDown, X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMenuModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const addMenuForm = useForm<AddMenuSchemaType>({
    resolver: zodResolver(AddMenuSchema),
    defaultValues: {
      newProductType: '',
      selectType: undefined, 
      productName: '',
      description: '',
      barcode: '',
      salesPrice: 0,
      salesTaxes: 0,
      productImage: undefined
    }
  });

  const onSubmit = (data: AddMenuSchemaType) => {
    addMenuForm.reset();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-[#FAF6EF] rounded-lg shadow-lg pt-4 pb-8 w-full max-w-5xl relative animate-fadeIn">
        <X
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-600 hover:text-black"
        ></X>

        <Form {...addMenuForm}>
          <form
            onSubmit={addMenuForm.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 text-sm"
          >
            {}
            <div className="flex justify-between w-full md:w-[80%] lg:w-[75%] 2xl:w-[70%] gap-6 px-10">
              <FormField
                control={addMenuForm.control}
                name="productName"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="pt-2 w-4/5">
                      New Product Type
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product name"
                        {...field}
                        className="bg-[#F6EEE0] h-8 text-gray-700 placeholder:opacity-55 p-2 rounded-lg border-none outline-none focus:ring-0 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="min-h-[16px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={addMenuForm.control}
                name="selectType"
                render={({ field }) => (
                  <FormItem className="relative flex items-center gap-4">
                    <FormLabel className="pt-2">Select Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-[#F6EEE0] h-8 text-gray-700 placeholder:opacity-55 p-2 rounded-lg w-44 border-none outline-none focus:ring-0 text-sm">
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#453519] text-white border-2 border-white rounded-lg shadow-lg">
                          <SelectItem value="American">American</SelectItem>
                          <SelectItem value="Starter">Starter</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                    <ChevronDown className="text-black absolute w-4 h-4 right-2 top-2" />
                  </FormItem>
                )}
              />
            </div>
            {}
            <div className="w-full h-[1px] bg-black opacity-20"></div>
            {}
            <div className="flex justify-between items-start px-10">
              <div className="w-[60%]">
                {}
                <FormField
                  control={addMenuForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter description"
                          {...field}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {}
                <FormField
                  control={addMenuForm.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Barcode
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter barcode"
                          {...field}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {}
                <FormField
                  control={addMenuForm.control}
                  name="salesPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Sales Price
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter sales price"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {}
                <FormField
                  control={addMenuForm.control}
                  name="salesTaxes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Sales Taxes
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter sales tax"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {}
              <div className="w-[30%] pt-7">
                <FormField
                  control={addMenuForm.control}
                  name="productImage"
                  render={({ field }) => (
                    <FormItem className="w-44">
                      <FormControl>
                        <div className="relative flex items-center">
                          <Input
                            placeholder=""
                            value={field.value?.name || ''}
                            readOnly
                            className="h-44 rounded-lg text-gray-700 bg-[#F6EEE0] p-2 border-none outline-none focus:ring-0 text-sm cursor-default"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                            className="hidden"
                            id="fileUpload"
                          />
                          <label
                            htmlFor="fileUpload"
                            className="absolute inset-0 right-2 rounded-lg h-24 top-1/2 -translate-y-1/2 bg-[#F6EEE0] w-full px-3 py-1 cursor-pointer"
                          >
                            <PiCameraThin className="text-black w-full h-full opacity-30" />
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="w-full h-[1px] bg-black opacity-5"></div>
            {}
            <div className="flex items-center gap-4 px-10">
              <Button type="submit" className="btn-secondary">
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

export default AddMenuModal;

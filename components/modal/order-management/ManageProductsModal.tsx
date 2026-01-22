'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ManageProductsSchema, ManageProductsSchemaType } from 'schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageProductsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [productList, setProductList] = useState<string[]>([]);

  const manageProductsForm = useForm<ManageProductsSchemaType>({
    resolver: zodResolver(ManageProductsSchema),
    defaultValues: {
      productType: ''
    }
  });

  const onSubmit = (data: ManageProductsSchemaType) => {
    if (data.productType.trim()) {
      setProductList([...productList, data.productType.trim()]);
      manageProductsForm.reset();
    }
  };

  const handleDelete = (index: number) => {
    setProductList(productList.filter((_, i) => i !== index));
  };

  
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-[#FAF6EF] rounded-lg shadow-lg flex flex-col gap-6 p-6 w-full max-w-xl relative animate-fadeIn">
        <div>
          <h5 className="font-medium absolute top-4 left-6">Manage Products</h5>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
          >
            ✖
          </button>
          <p className="absolute top-10 left-6 opacity-50 text-sm">
            Add or Delete product category
          </p>
        </div>
        <Form {...manageProductsForm}>
          <form
            onSubmit={manageProductsForm.handleSubmit(onSubmit)}
            className="w-full flex justify-between gap-8 pt-7 items-center"
          >
            <div className="flex items-center gap-2">
              <FormField
                control={manageProductsForm.control}
                name="productType"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel className="w-full">Product Type</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter type"
                        {...field}
                        className="w-32 bg-[#F6EEE0] text-gray-700 rounded-md border-none"
                      />
                    </FormControl>
                    <div className="h-4">
                      <FormMessage className="text-[10px] text-red-500" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="">
              <Button type="submit" className="btn-primary bg-coffeeLight">
                ADD
              </Button>
            </div>
          </form>
        </Form>
        {}
        {productList.length > 0 && (
          <div className="border-t pt-4">
            <h6 className="font-medium mb-2">Product List</h6>
            <ul className="space-y-2">
              {productList.map((product, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-sm font-medium rounded-md"
                >
                  <span className="text-gray-700">{product}</span>
                  <span className="text-gray-700">50</span>
                  <Button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 text-white hover:bg-red-600 px-2 h-7 rounded-lg text-xs 2xl:text-sm"
                  >
                    DELETE
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProductsModal;

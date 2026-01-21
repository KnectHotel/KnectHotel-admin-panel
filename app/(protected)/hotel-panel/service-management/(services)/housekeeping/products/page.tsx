'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Send } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import apiCall from '@/lib/axios';
import PlaceholderImg from '../../../../../../../public/assets/shirtPic.png';
import AddItemModal from '@/components/modal/housekeeping/manage-products';
import { FiEdit } from 'react-icons/fi';

interface Product {
  _id: string;
  serviceType: string;
  name: string;
  category: string;
  visibility?: boolean;
  price: number;
  imageUrl?: string;
}

interface ServiceData {
  [serviceType: string]: Product[];
}

const ProductDetailsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [housekeepingData, setHousekeepingData] = useState<ServiceData>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await apiCall<{ data: ServiceData }>('GET', 'api/services/housekeeping/items');
        setHousekeepingData(response.data || {});
      } catch (err) {
        console.error('Failed to fetch housekeeping items:', err);
      }
    })();
  }, []);

  const handleEdit = (product: Product) => {
    const fallbackProduct = {
      ...product,
      visibility: product.visibility ?? true
    };
    setSelectedProduct(product);
    setIsOpen(true);
  };

  return (
    <div className="mt-20 w-full">
      <AddItemModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        product={selectedProduct}
      />
      <div className="h-auto w-full pt-8 px-8 space-y-12">
        {Object.entries(housekeepingData).map(([serviceType, products], index) => {
          const categoryMap: Record<string, Product[]> = {};
          products.forEach((product) => {
            if (!categoryMap[product.category]) categoryMap[product.category] = [];
            categoryMap[product.category].push(product);
          });

          return (
            <div key={index} className="flex flex-col gap-8 items-start">
              <h2 className="border border-coffee border-opacity-60 rounded-md text-lg 2xl:text-xl text-coffee/90 font-semibold px-2 py-1">
                {serviceType}
              </h2>
              {Object.entries(categoryMap).map(([category, items], catIdx) => (
                <div key={catIdx} className="flex flex-col items-start w-full">
                  <h3 className="text-lg font-medium underline underline-offset-4 text-coffeeLight">{category}</h3>
                  {items.map((product) => (
                    <div key={product._id} className="flex w-full flex-col gap-2 items-center justify-center">
                      <div className="w-full flex justify-between py-4 items-center">
                        <div className="flex flex-col gap-2 max-w-44 w-80 text-xs 2xl:text-sm">
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-sm 2xl:text-base font-bold">Visibility</span>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={async () => {
                                  if (product.visibility) return;
                                  await apiCall('PUT', `api/services/housekeeping/items/${product._id}/toggle-visibility`, {
                                    visibility: true,
                                  });
                                  setHousekeepingData((prev) => {
                                    const updated = { ...prev };
                                    updated[serviceType] = updated[serviceType].map((p) =>
                                      p._id === product._id ? { ...p, visibility: true } : p
                                    );
                                    return updated;
                                  });
                                }}
                                className={`px-3 py-1 rounded-md text-xs 2xl:text-sm font-medium border 
        ${product.visibility ? 'bg-green-500 text-white border-green-500' : 'bg-[#F6EEE0] text-gray-700 border-gray-300'}`}
                              >
                                ON
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  if (!product.visibility) return;
                                  await apiCall('patch', `api/services/housekeeping/items/${product._id}/toggle-visibility`, {
                                    visibility: false,
                                  });
                                  setHousekeepingData((prev) => {
                                    const updated = { ...prev };
                                    updated[serviceType] = updated[serviceType].map((p) =>
                                      p._id === product._id ? { ...p, visibility: false } : p
                                    );
                                    return updated;
                                  });
                                }}
                                className={`px-3 py-1 rounded-md text-xs 2xl:text-sm font-medium border 
        ${!product.visibility ? 'bg-red-500 text-white border-red-500' : 'bg-[#F6EEE0] text-gray-700 border-gray-300'}`}
                              >
                                OFF
                              </button>
                            </div>
                          </div>

                          <p className="text-sm 2xl:text-base font-medium">{product.name}</p>
                          <span className="text-xs 2xl:text-sm opacity-70">₹{product.price}</span>
                          <div
                            onClick={() => handleEdit(product)}
                            className="cursor-pointer text-coffeeLight hover:text-coffeeLight"
                          >
                            <FiEdit size={20} />
                          </div>
                        </div>
                        <div>
                          <Image
                            src={product.imageUrl || PlaceholderImg}
                            height={180}
                            width={150}
                            className="rounded-lg object-cover hover:scale-105 duration-200 ease-in-out"
                            alt="Product image"
                          />
                        </div>
                      </div>
                      <div className="h-[0.5px] bg-black opacity-30 w-full"></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductDetailsPage;

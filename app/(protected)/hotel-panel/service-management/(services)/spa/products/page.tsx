
































































































































































































































































'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FiEdit } from 'react-icons/fi';
import apiCall from '@/lib/axios';
import ManageProductsModal from '@/components/modal/spa-service/manage-products';
import PlaceholderImg from '../../../../../../../public/assets/shirtPic.png';


const S3_BASE = 'https://dibstestbucket0403.s3.ap-south-1.amazonaws.com';
const keyToUrl = (value?: string | null) => {
  if (!value) return null;
  if (/^https?:\/\
  return `${S3_BASE}/${value.replace(/^\/+/, '')}`; 
};


type ProductType = {
  _id: string;
  hotelId: string;
  serviceType: string;
  productCategory: string;
  productName: string;
  price: number;
  description: string;
  imageUrl?: string | null; 
  additionalServices: any[];
  visibility: boolean;
};

type GroupedProducts = {
  serviceType: string;
  categories: {
    productCategory: string;
    products: ProductType[];
  }[];
};

const ProductDetailsPage = () => {
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [isManageProductsModalOpen, setIsManageProductsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await apiCall('GET', 'api/services/spasalon/products');
      if (res.success && Array.isArray(res.data)) {
        const grouped: Record<string, Record<string, ProductType[]>> = {};
        res.data.forEach((product: ProductType) => {
          const { serviceType, productCategory } = product;
          if (!grouped[serviceType]) grouped[serviceType] = {};
          if (!grouped[serviceType][productCategory]) grouped[serviceType][productCategory] = [];
          grouped[serviceType][productCategory].push(product);
        });

        const finalData: GroupedProducts[] = Object.entries(grouped).map(
          ([serviceType, categoriesObj]) => ({
            serviceType,
            categories: Object.entries(categoriesObj).map(([productCategory, products]) => ({
              productCategory,
              products,
            })),
          })
        );

        setGroupedProducts(finalData);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div className="mt-24 text-center text-gray-600">Loading...</div>;

  const handleEdit = (product: ProductType) => {
    setSelectedProduct(product);
    setIsManageProductsModalOpen(true);
  };

  return (
    <div className="mt-20 w-full">
      <div className="container h-auto w-full pt-8 px-4 space-y-12">
        {groupedProducts.map((service, index) => (
          <div key={index} className="flex flex-col gap-8 items-start">
            <h2 className="border border-coffee border-opacity-60 rounded-md text-lg 2xl:text-xl text-coffee/90 font-semibold px-2 py-1">
              {service.serviceType}
            </h2>

            {service.categories.map((category, catIndex) => (
              <div key={catIndex} className="flex flex-col items-start w-full">
                <h3 className="text-xl font-bold underline underline-offset-4 text-coffeeLight capitalize">
                  {category.productCategory}
                </h3>

                {category.products.map((product) => {
                  
                  const displaySrc = keyToUrl(product.imageUrl) || PlaceholderImg;

                  return (
                    <div key={product._id} className="flex w-full flex-col gap-2 items-center justify-center">
                      <div className="w-full flex justify-between py-4 items-center">
                        {}
                        <div className="flex flex-col gap-2 w-full text-xs 2xl:text-sm">
                          <p className="text-sm 2xl:text-base font-semibold text-coffee">
                            <span className="font-bold">Product Name: </span>
                            {product.productName}
                          </p>

                          <span className="text-xs 2xl:text-sm opacity-70 font-medium">
                            <span className="font-bold">Price: </span>₹{product.price}
                          </span>

                          <p className="text-xs 2xl:text-sm text-gray-700">
                            <span className="font-bold">Description: </span>
                            {product.description}
                          </p>

                          {product.additionalServices?.length > 0 && (
                            <div className="mt-2">
                              <span className="font-bold">Additional Services: </span>
                              {product.additionalServices.map((svc: any, i: number) => (
                                <span key={i} className="text-sm text-gray-700">
                                  {svc.name}
                                  {i < product.additionalServices.length - 1 && ', '}
                                </span>
                              ))}
                            </div>
                          )}

                          {}
                          <div className="flex flex-col items-start gap-1">
                            <div className="flex gap-0 ml-2">
                              <button
                                type="button"
                                onClick={async () => {
                                  if (product.visibility) return;
                                  await apiCall('PUT', `api/services/spasalon/products/${product._id}/toggle-visibility`, {
                                    visibility: true,
                                  });
                                  setGroupedProducts((prev) =>
                                    prev.map((s) => ({
                                      ...s,
                                      categories: s.categories.map((cat) => ({
                                        ...cat,
                                        products: cat.products.map((p) =>
                                          p._id === product._id ? { ...p, visibility: true } : p
                                        ),
                                      })),
                                    }))
                                  );
                                }}
                                className={`px-3 py-1 rounded-l-md text-xs 2xl:text-sm font-medium border 
                                  ${product.visibility ? 'bg-green-500 text-white border-green-500' : 'bg-[#F6EEE0] text-gray-700 border-gray-300'}`}
                              >
                                ON
                              </button>

                              <button
                                type="button"
                                onClick={async () => {
                                  if (!product.visibility) return;
                                  await apiCall('PATCH', `api/services/spasalon/products/${product._id}/toggle-visibility`, {
                                    visibility: false,
                                  });
                                  setGroupedProducts((prev) =>
                                    prev.map((s) => ({
                                      ...s,
                                      categories: s.categories.map((cat) => ({
                                        ...cat,
                                        products: cat.products.map((p) =>
                                          p._id === product._id ? { ...p, visibility: false } : p
                                        ),
                                      })),
                                    }))
                                  );
                                }}
                                className={`px-3 py-1 rounded-r-md text-xs 2xl:text-sm font-medium border 
                                  ${!product.visibility ? 'bg-red-500 text-white border-red-500' : 'bg-[#F6EEE0] text-gray-700 border-gray-300'}`}
                              >
                                OFF
                              </button>
                            </div>
                          </div>

                          <span className="flex gap-4 pt-2 justify-start">
                            <div
                              onClick={() => handleEdit(product)}
                              className="cursor-pointer text-coffeeLight hover:text-coffeeLight"
                            >
                              <FiEdit size={20} />
                            </div>
                          </span>
                        </div>

                        {}
                        <div>
                          <Image
                            src={displaySrc as any} 
                            height={200}
                            width={180}
                            className="rounded-lg object-cover hover:scale-105 duration-200 ease-in-out"
                            alt={product.productName || 'Product image'}
                          />
                        </div>
                      </div>
                      <div className="h-[0.5px] bg-black opacity-30 w-full"></div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      <ManageProductsModal
        isOpen={isManageProductsModalOpen}
        onClose={() => {
          setIsManageProductsModalOpen(false);
          setSelectedProduct(null);
        }}
        editMode={!!selectedProduct}
        productId={selectedProduct?._id}
      />
    </div>
  );
};

export default ProductDetailsPage;

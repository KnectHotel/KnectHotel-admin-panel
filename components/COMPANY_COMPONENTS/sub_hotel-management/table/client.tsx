

























































































'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { Heading } from '@/components/ui/heading';
import apiCall from '@/lib/axios';
import { ToastAtTopRight } from '@/lib/sweetalert';
import { columns } from './columns';

export interface SubHotelDataType {
  _id: string;
  HotelId: string;
  parentHotel?: {
    _id: string;
    name: string;
    email: string;
    phoneNo: string;
    HotelId: string;
  };
  hotelName: string;
  mobileNo: string;
  email: string;
  subscriptionDetails: {
    planName: string;
    cost: number;
  };
  status: 'ACTIVE' | 'INACTIVE' | string;
}

export const SubHotelManagementHome: React.FC = () => {
  const router = useRouter();

  const [data, setData] = useState<SubHotelDataType[]>([]);
  const [filteredData, setFilteredData] = useState<SubHotelDataType[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const fetchSubHotels = async () => {
      try {
        setLoading(true);
        const response = await apiCall(
          'GET',
          `api/hotel/sub-hotels?limit=${limit}&page=${pageNo}`
        );

        if (response?.status) {
          const hotels: SubHotelDataType[] = response.hotels.map(
            (hotel: any) => ({
              subHotelID: hotel._id,
              HotelId: hotel.HotelId,
              parentHotel: hotel.parentHotel || 'N/A',
              hotelName: hotel.name || 'N/A',
              mobileNo: hotel.phoneNo || 'N/A',
              email: hotel.email || 'N/A',
              subscriptionDetails: {
                planName: hotel.subscriptionPlan || 'No Plan',
                cost: hotel.subscriptionPrice || 0
              },
              status:
                hotel.status?.toUpperCase() === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'
            })
          );

          setData(hotels);
          setFilteredData(hotels);
          setTotalRecords(response.totalHotels || hotels.length);
        } else {
          ToastAtTopRight.fire('Failed to fetch sub-hotels', 'error');
        }
      } catch (error) {
        ToastAtTopRight.fire('Error fetching sub-hotels', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSubHotels();
  }, [pageNo, limit]);

  const handleSearchChange = (searchValue: string) => {
    const lower = searchValue.trim().toLowerCase();
    if (!lower) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        item.hotelName.toLowerCase().includes(lower)
      );
      setFilteredData(filtered);
      setPageNo(1);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalRecords / limit)) {
      setPageNo(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPageNo(1);
  };

  return (
    <>
      <div className="w-full flex justify-between items-start px-3 mb-4">
        <Heading title="Sub-Hotels" className="my-0" />
        {}
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <DataTable
          searchKey="hotelName"
          columns={columns}
          data={filteredData.slice((pageNo - 1) * limit, pageNo * limit)}
          onSearch={handleSearchChange}
        />
      )}

      <PaginationControls
        pageNo={pageNo}
        totalRecords={filteredData.length}
        limit={limit}
        totalPages={totalPages}
        filteredCount={filteredData.length}
        onPageChange={handlePageChange}
      />
    </>
  );
};

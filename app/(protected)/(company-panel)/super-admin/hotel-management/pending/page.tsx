








































































































































'use client';

import { Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { Heading } from '@/components/ui/heading';
import { useCallback, useEffect, useMemo, useState } from 'react';
import apiCall from '@/lib/axios';
import { Button } from '@/components/ui/button';

type PendingRequest = {
  id: string;
  hotelName: string;
  mobileNumber: string;
  email: string;
  address: string;
  status: string;
};

type ApiResponse = {
  status: 'success' | 'error';
  count: number;       
  currentPage: number; 
  totalPages: number;  
  requests: any[];
};

const LIMIT_OPTIONS = [5, 10, 20, 50];

export default function HotelManagementPendingPage() {
  const router = useRouter();

  const [pendingData, setPendingData] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchPendingRequests = useCallback(
    async (pageArg = page, limitArg = limit) => {
      setLoading(true);
      setError(null);
      try {
        const url = `api/hotel/pending-requests?page=${pageArg}&limit=${limitArg}`;
        const response = await apiCall<ApiResponse>('GET', url);

        if (response.status === 'success' && Array.isArray(response.requests)) {
          const formatted: PendingRequest[] = response.requests.map((req: any) => ({
            id: req._id,
            status: req.status,
            hotelName: req.hotelData?.name || 'N/A',
            mobileNumber: req.hotelData?.phoneNo || 'N/A',
            email: req.hotelData?.email || 'N/A',
            address: req.hotelData?.address || 'N/A',
          }));

          setPendingData(formatted);
          setTotalPages(response.totalPages ?? 1);
          setTotalCount(response.count ?? formatted.length);

          if (
            typeof response.currentPage === 'number' &&
            response.currentPage !== pageArg
          ) {
            setPage(response.currentPage);
          }
        } else {
          setPendingData([]);
          setTotalPages(1);
          setTotalCount(0);
          setError('No pending requests found.');
        }
      } catch (err) {
        console.error('API fetch error:', err);
        setError('Failed to load pending requests.');
        setPendingData([]);
        setTotalPages(1);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [page, limit]
  );

  useEffect(() => {
    fetchPendingRequests(page, limit);
  }, [page, limit, fetchPendingRequests]);

  const pendingColumns: ColumnDef<PendingRequest>[] = useMemo(
    () => [
      {
        accessorKey: 'hotelName',
        header: 'Hotel name',
        cell: ({ row }) => <span>{row.getValue('hotelName')}</span>,
      },
      {
        accessorKey: 'mobileNumber',
        header: 'Mobile Number',
        cell: ({ row }) => <span>{row.getValue('mobileNumber')}</span>,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <span className="text-gray-600">{row.getValue('email')}</span>
        ),
      },
      {
        accessorKey: 'address',
        header: 'Address',
        cell: ({ row }) => (
          <span className="uppercase">{row.getValue('address')}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <span className="text-red-600">{row.getValue('status')}</span>
        ),
      },
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <div className="flex justify-center">
            <button
              className="p-2 rounded-md hover:bg-[#e6dcc4]"
              onClick={() =>
                router.push(
                  `/super-admin/hotel-management/pending/view/${row.original.id}`
                )
              }
              aria-label="View"
              title="View"
            >
              <Eye className="h-4 w-4 text-black" />
            </button>
          </div>
        ),
      },
    ],
    [router]
  );

  
  const getPageWindow = (current: number, total: number, size = 5) => {
    if (total <= size) return Array.from({ length: total }, (_, i) => i + 1);
    const half = Math.floor(size / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, start + size - 1);
    if (end - start + 1 < size) start = Math.max(1, end - size + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageWindow = getPageWindow(page, totalPages, 5);

  const startIndex = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalCount);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    setPage(p);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="flex flex-col w-full">
      <Navbar active search />
      <div className="w-full min-h-screen pt-8 mt-14 px-0 md:px-6">
        <div className="flex items-center justify-between">
          <Heading title="Pending Hotel Requests" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchPendingRequests(1, limit)}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>

        <div className="mt-4">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <>
              <DataTable
                columns={pendingColumns}
                data={pendingData}
                searchKey="hotelName"
              />

              {}
              <div className="mt-4 w-full">
                <div className="flex flex-col gap-3 rounded-xl border bg-white/70 p-3 shadow-sm md:flex-row md:items-center md:justify-between">
                  {}
                  <div className="flex items-center gap-2 text-sm">
                    <label
                      htmlFor="limit"
                      className="text-gray-700 whitespace-nowrap"
                    >
                      Rows per page
                    </label>
                    <select
                      id="limit"
                      className="h-8 rounded-md border px-2 text-sm outline-none focus:ring-2 focus:ring-[#c8b799] focus:border-[#c8b799]"
                      value={limit}
                      onChange={handleLimitChange}
                      disabled={loading}
                    >
                      {LIMIT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    {}
                  </div>

                  {}
                  <div className="flex items-center gap-1">
                    {}
                    <button
                      className="h-8 rounded-md border px-2 text-sm disabled:opacity-40"
                      onClick={() => goToPage(1)}
                      disabled={loading || page === 1}
                      aria-label="First page"
                      title="First page"
                    >
                      « First
                    </button>

                    {}
                    <button
                      className="h-8 rounded-md border px-2 text-sm disabled:opacity-40"
                      onClick={() => goToPage(page - 1)}
                      disabled={loading || page <= 1}
                      aria-label="Previous page"
                      title="Previous page"
                    >
                      ‹ Prev
                    </button>

                    {}
                    {pageWindow[0] > 1 && (
                      <>
                        <button
                          className="h-8 w-8 rounded-md border text-sm"
                          onClick={() => goToPage(1)}
                          aria-label={`Page 1`}
                          title="Page 1"
                        >
                          1
                        </button>
                        <span className="px-2 text-gray-500">…</span>
                      </>
                    )}

                    {}
                    {pageWindow.map((p) => (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        aria-current={p === page ? 'page' : undefined}
                        className={[
                          'h-8 w-8 rounded-md border text-sm transition',
                          p === page
                            ? 'bg-[#e6dcc4] border-[#d7c8a8] font-medium'
                            : 'hover:bg-gray-50',
                        ].join(' ')}
                        title={`Page ${p}`}
                      >
                        {p}
                      </button>
                    ))}

                    {}
                    {pageWindow[pageWindow.length - 1] < totalPages && (
                      <>
                        <span className="px-2 text-gray-500">…</span>
                        <button
                          className="h-8 w-8 rounded-md border text-sm"
                          onClick={() => goToPage(totalPages)}
                          aria-label={`Page ${totalPages}`}
                          title={`Page ${totalPages}`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    {}
                    <button
                      className="h-8 rounded-md border px-2 text-sm disabled:opacity-40"
                      onClick={() => goToPage(page + 1)}
                      disabled={loading || page >= totalPages}
                      aria-label="Next page"
                      title="Next page"
                    >
                      Next ›
                    </button>

                    {}
                    <button
                      className="h-8 rounded-md border px-2 text-sm disabled:opacity-40"
                      onClick={() => goToPage(totalPages)}
                      disabled={loading || page === totalPages}
                      aria-label="Last page"
                      title="Last page"
                    >
                      Last »
                    </button>
                  </div>
                </div>

                {}
                <div className="mt-2 text-center text-xs text-gray-500 md:hidden">
                  {totalCount > 0
                    ? `Showing ${startIndex}–${endIndex} of ${totalCount}`
                    : 'No records'}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

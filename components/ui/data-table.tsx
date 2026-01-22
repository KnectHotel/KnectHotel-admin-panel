import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel
} from '@tanstack/react-table';

import {
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from './input';
import { Button } from './button';
import { ScrollArea, ScrollBar } from './scroll-area';
import { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp, Triangle } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from './dropdown-menu';



interface FilterOption {
  label: string;
  key: string;
  subOptions: string[];
  filteredOptions?: string[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  onSearch?: (value: string) => void;
  filters?: FilterOption[];
  rowNo?: number; 
  getRowClassName?: (row: TData) => string;
  meta?: {
    updateData: (rowIndex: number, columnId: string, value: any) => void;
    updateColumnData: (columnId: string, value: any) => void;
  };
  onFilterChange?: (
    filterCategory: string | string[],
    filterValue?: string
  ) => void;
  sorting?: any;
  onSortingChange?: (sorting: any) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onSearch,
  filters,
  meta,
  rowNo,
  onFilterChange,
  sorting,
  onSortingChange
}: DataTableProps<TData, TValue>) {
  const [filterInput, setFilterInput] = useState('');
  const [updatedFilters, setUpdatedFilters] = useState(filters || []);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const table = useReactTable({
    data,
    columns: [
      {
        id: 'sn',
        header: 'SN',
        cell: ({ row }) => <span>{row.index + 1}</span> 
      },
      ...columns 
    ],
    state: {
      sorting,
      globalFilter: filterInput
    },
    onSortingChange,
    onGlobalFilterChange: setFilterInput,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: false,
    meta
  });

  const [searcterm, setSearchterm]: any = useState();
  const handleCitySearchChange = (searchTerm: string, filterLabel: string) => {
    setSearchterm(searchTerm); 

    setUpdatedFilters((prevFilters) =>
      prevFilters.map((filter) =>
        filter.label === filterLabel
          ? {
              ...filter,
              filteredOptions: filter.subOptions.filter((option) =>
                option.toLowerCase().includes(searchTerm.toLowerCase())
              )
            }
          : filter
      )
    );
    
    
    
  };

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, [updatedFilters]);

  const handleClearFilters = () => {
    setFilterInput('');
    table.setGlobalFilter('');
    if (onSearch) {
      onSearch('');
    }

    if (onFilterChange) {
      const filterKeys = filters?.map((filter) => filter.label) || []; 
      onFilterChange(filterKeys, ''); 
    }
  };

  const getSortIcon = (column: any) => {
    if (!column.getCanSort()) return null;

    return (
      <div className="flex flex-col gap-[2px] ml-2">
        {}
        <Triangle
          className={`h-[10px] w-[10px] ${column.getIsSorted() === 'asc' ? ' text-gray-400 fill-black ' : 'text-black'}`}
        />
        {}
        <Triangle
          className={`h-[10px] w-[10px] rotate-180 ${column.getIsSorted() === 'desc' ? ' text-gray-400 fill-black' : 'text-black'}`}
        />
      </div>
    );
  };

  const customToggleSorting = (column: any) => {
    if (!column.getCanSort()) return;
    const isAscending = column.getIsSorted() === 'asc';
    onSortingChange?.([{ id: column.id, desc: isAscending }]);
  };

  const getRowClassName = (row: TData) => {
    
    if ((row as any).preCheckInRejectionMessage) {
      return 'bg-red-200';
    }
    return '';
  };

  return (
    <>
      {}
      {}

      {filters && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="text-xs 2xl:text-sm md:text-sm ms-4">
                Filter <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-50">
              {updatedFilters.map((filter) => (
                <DropdownMenuSub key={filter.label}>
                  <DropdownMenuSubTrigger>
                    {filter.label}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-48">
                    {filter.label === 'City' ? (
                      <div className="p-2">
                        <Input
                          ref={searchRef}
                          value={searcterm}
                          onChange={(e) =>
                            handleCitySearchChange(e.target.value, filter.label)
                          }
                          placeholder="Search city..."
                          className="w-full px-2 py-1 mb-2 border border-gray-300 rounded"
                        />
                        <div className="max-h-40 overflow-y-scroll overflow-x-hidden border border-gray-200 rounded">
                          {(filter.filteredOptions || filter.subOptions).map(
                            (subOption) => (
                              <DropdownMenuItem
                                key={subOption}
                                onClick={() => {
                                  if (onFilterChange)
                                    onFilterChange(filter.label, subOption);
                                }}
                              >
                                {subOption}
                              </DropdownMenuItem>
                            )
                          )}
                        </div>
                      </div>
                    ) : (
                      filter.subOptions.map((subOption) => (
                        <DropdownMenuItem
                          key={subOption}
                          onClick={() => {
                            if (onFilterChange)
                              onFilterChange(filter.label, subOption);
                          }}
                        >
                          {subOption}
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {}
        </>
      )}
      {}

      {table.getRowModel().rows.length ? (
        <ScrollArea className="rounded-md  max-h-full ">
          <UiTable className="relative">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} highlightedRow={rowNo}>
                  {headerGroup.headers.map((header, index) => (
                    <TableHead
                      key={header.id}
                      className=" py-4 bg-white"
                      style={
                        index === table.getHeaderGroups()[0].headers.length - 1
                          ? { zIndex: 15 }
                          : {}
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center justify-center">
                          <span>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              customToggleSorting(header.column);
                            }}
                          >
                            {getSortIcon(header.column)}
                          </button>
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="">
              {table.getRowModel().rows.map((row, index) => {
                const rowClass = getRowClassName(row.original); 
                return (
                  <TableRow
                    key={row.id}
                    className={rowClass} 
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <TableCell
                        key={cell.id}
                        className={`py-4 bg-[#FAF6EF] ${cellIndex === 0 ? 'rounded-tl-xl rounded-bl-xl' : ''} ${cellIndex === table.getHeaderGroups()[0].headers.length - 1 ? 'rounded-tr-xl rounded-br-xl' : ''} `}
                        style={
                          cellIndex ===
                          table.getHeaderGroups()[0].headers.length - 1
                            ? {
                                right: '0px',
                                zIndex: 15,
                                paddingRight: '1rem'
                              }
                            : {}
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </UiTable>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center justify-center h-[55vh]">
          {}
          {}
        </div>
      )}

      {}
    </>
  );
}

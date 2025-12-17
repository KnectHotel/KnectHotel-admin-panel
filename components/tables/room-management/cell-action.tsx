'use client';

import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RoomDataType } from './columns';

interface CellActionProps {
  data: RoomDataType;
  basePath?: string; // Optional prop to override the base path
}

export const CellAction: React.FC<CellActionProps> = ({ data, basePath }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Determine the base path based on current route or prop
  const getBasePath = () => {
    if (basePath) {
      return basePath;
    }
    
    // Check if we're in hotel-panel or super-admin context
    if (pathname?.startsWith('/hotel-panel')) {
      // Use hotel-panel room-management route
      return '/hotel-panel/room-management';
    }
    
    // Default to super-admin
    return '/super-admin/hotel-management/rooms';
  };

  const handleUpdate = () => {
    router.push(`${getBasePath()}/${data.id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleUpdate}>
          <Edit className="mr-2 h-4 w-4" /> Update
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => alert('Delete functionality not implemented in demo')}>
          <Trash className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

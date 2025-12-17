'use client';

import * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';
import { ToastAtTopRight } from '@/lib/sweetalert';
import { saveRoomSyncData } from '@/utils/roomSync';
import { usePathname } from 'next/navigation';

const formSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  roomType: z.string().min(1, 'Room type is required'),
  roomCategory: z.string().min(1, 'Room category is required'),
  floorNumber: z.string().min(1, 'Floor number is required'),
  tower: z.string().optional(),
  bedType: z.string().min(1, 'Bed type is required'),
  maxOccupancy: z.coerce.number().min(1, 'Max occupancy must be at least 1'),
  roomSize: z.string().optional(),
  baseRate: z.coerce.number().min(0, 'Base rate must be positive'),
  amenities: z.string().optional(), // Simplified for demo as comma separated string
});

type RoomFormValues = z.infer<typeof formSchema>;

interface RoomFormProps {
  initialData?: RoomFormValues | null;
}

export const RoomForm: React.FC<RoomFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Room' : 'Create Room';
  const description = initialData ? 'Edit a room.' : 'Add a new room';
  const toastMessage = initialData ? 'Room updated.' : 'Room created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData || {
    roomNumber: '',
    roomType: '',
    roomCategory: '',
    floorNumber: '',
    tower: '',
    bedType: '',
    maxOccupancy: 2,
    roomSize: '',
    baseRate: 0,
    amenities: '',
  };

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: RoomFormValues) => {
    try {
      setLoading(true);
      // Save room data for syncing with hotel management form
      saveRoomSyncData({
        roomType: data.roomType,
        roomCategory: data.roomCategory,
        floorNumber: data.floorNumber,
        tower: data.tower,
        bedType: data.bedType,
        maxOccupancy: data.maxOccupancy,
        roomSize: data.roomSize,
        baseRate: data.baseRate,
        amenities: data.amenities,
      });
      // Simulate API call
      console.log('Room Data Submitted:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      ToastAtTopRight.fire({
          icon: 'success',
          title: toastMessage,
      });
      router.refresh();
      // Determine redirect path based on current route
      const redirectPath = pathname?.startsWith('/hotel-panel')
        ? '/hotel-panel/room-management'
        : '/super-admin/hotel-management/rooms';
      router.push(redirectPath);
    } catch (error: any) {
        ToastAtTopRight.fire({
            icon: 'error',
            title: 'Something went wrong.',
        });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      // Simulate API call
       await new Promise((resolve) => setTimeout(resolve, 1000));
       ToastAtTopRight.fire({
        icon: 'success',
        title: 'Room deleted.',
    });
      router.refresh();
      // Determine redirect path based on current route
      const redirectPath = pathname?.startsWith('/hotel-panel')
        ? '/hotel-panel/room-management'
        : '/super-admin/hotel-management/rooms';
      router.push(redirectPath);
    } catch (error: any) {
        ToastAtTopRight.fire({
            icon: 'error',
            title: 'Make sure you removed all dependencies first.',
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={onDelete}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="roomNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Number</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="e.g. 101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="roomType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a room type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Deluxe">Deluxe</SelectItem>
                      <SelectItem value="Suite">Suite</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roomCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Smoking">Smoking</SelectItem>
                      <SelectItem value="Non-Smoking">Non-Smoking</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="floorNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor Number</FormLabel>
                   <FormControl>
                    <Input disabled={loading} placeholder="e.g. 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="tower"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tower / Building</FormLabel>
                   <FormControl>
                    <Input disabled={loading} placeholder="e.g. Tower A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="bedType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bed Type</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select bed type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="King">King</SelectItem>
                      <SelectItem value="Queen">Queen</SelectItem>
                      <SelectItem value="Twin">Twin</SelectItem>
                      <SelectItem value="Extra Bed">Extra Bed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="maxOccupancy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Occupancy</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="roomSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Size (sq. ft)</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="e.g. 350" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Amenities (Comma separated)</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="e.g. WiFi, AC, TV" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="baseRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Charges</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto bg-[#9e793b] hover:bg-[#4a391b] text-white" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

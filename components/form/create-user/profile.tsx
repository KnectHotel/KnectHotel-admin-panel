'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Edit, Trash } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';



interface ProfileFormType {
  initialData: any | null;
  isEnabled?: boolean;
  mode?: null | string;
}

const FormSchema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  contact: z.string().min(1, 'Contact is required'),
  email: z.string().min(1, 'Email is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  roleAssignmentDate: z
    .union([
      z.date({
        required_error: 'Role Assignment Date is required'
      }),
      z.string().transform((str) => new Date(str)) 
    ])
    .nullable(),
  verificationStatus: z.string().min(1, 'Verification Status is required'),
  lastLogin: z
    .date({
      required_error: 'Last Login is required'
    })
    .optional(),
  activityStatus: z.string().min(1, 'Activity Status is required'),
  paymentStatus: z.string().min(1, 'Payment Status is required'),
  rewardsPoints: z.number().min(0, 'Rewards Points must be a positive number'),
  accountStatus: z.string().min(1, 'Account Status is required')
});

export const CreateProfileOne: React.FC<ProfileFormType> = ({
  initialData,
  isEnabled,
  mode
}) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title =
    initialData && mode === 'view'
      ? 'View User'
      : initialData
        ? 'Edit User'
        : 'Create User';
  const description =
    initialData && mode === 'view'
      ? 'View the user profile.'
      : initialData
        ? 'Edit the user profile.'
        : 'To create a new user, we first need some basic information.';
  const textMessage = initialData ? 'User updated.' : 'User created.';
  const action = initialData ? 'Save changes' : 'Create';

  console.log('initialData', initialData);

  const id: any = params.id; 

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      contact: '',
      address: '',
      city: '',
      roleAssignmentDate: undefined,
      verificationStatus: '',
      activityStatus: '',
      paymentStatus: '',
      lastLogin: undefined,
      rewardsPoints: 0,
      accountStatus: ''
    }
  });

  
  useEffect(() => {
    if (initialData) {
      form.reset({
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        email: initialData?.email || '',
        contact: initialData?.contact || '',
        address: initialData?.address || '',
        city: initialData?.city || '',
        roleAssignmentDate: initialData?.roleAssignmentDate
          ? new Date(initialData.roleAssignmentDate)
          : new Date(),
        verificationStatus: initialData?.verificationStatus || '',
        activityStatus: initialData?.activityStatus || '',
        paymentStatus: initialData?.paymentStatus || '',
        lastLogin: initialData?.lastLogin
          ? new Date(initialData.lastLogin)
          : new Date(),
        rewardsPoints: initialData?.rewardsPoints || 0,
        accountStatus: initialData?.accountStatus || ''
      });
    }
  }, [initialData, form.reset]);

  const {
    control,
    formState: { errors },
    setValue,
    watch
  } = form;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        
        
        try {
          
          
          
          
          
          router.push('/user-management/approver');
        } catch (err: any) {
          const errorMessage = err?.message || 'Failed to update Approver User';
          
          
          
          
        }
      } else {
        
        
        
        try {
          
          
          
          
          
          router.push('/user-management/approver');
        } catch (err: any) {
          const errorMessage = err?.message || 'Failed to create Approver User';
          
          
          
          
        }
      }
    } catch (error: any) {
      
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      
      
      router.refresh();
      router.push(`/dashboard/users`);
    } catch (error: any) {
      
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const processForm = (data: z.infer<typeof FormSchema>) => {
    
    
  };

  const cities = [
    { id: 'Gurgaon', name: 'Gurgaon' },
    { id: 'Delhi', name: 'Delhi' },
    { id: 'Noida', name: 'Noida' },
    { id: 'Faridabad', name: 'Faridabad' },
    { id: 'Ghaziabad', name: 'Ghaziabad' },
    { id: 'Sahibabad', name: 'Sahibabad' }
  ];

  const [cityOptions, setCityOptions] = useState(cities);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [newCity, setNewCity] = useState('');

  const openCityModal = () => {
    setIsCityModalOpen(true);
  };

  const closeCityModal = () => {
    setIsCityModalOpen(false);
  };

  const addCity = () => {
    if (newCity) {
      setCityOptions([
        ...cityOptions,
        { id: newCity.toLowerCase(), name: newCity }
      ]);
      setNewCity('');
    }
  };

  const deleteCity = (index: number) => {
    setCityOptions(cityOptions.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={mode === 'view' || loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Dialog
        open={isCityModalOpen}
        onOpenChange={(open) => !open && closeCityModal()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Cities</DialogTitle>
            <DialogDescription>You can manage cities here.</DialogDescription>
          </DialogHeader>
          <div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-red-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs 2xl:text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    City
                  </th>
                  <th className="px-6 py-3 text-right text-xs 2xl:text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {cityOptions.map((city, cityIndex) => (
                  <tr key={cityIndex}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {city.name}
                    </td>
                    <td className="px-6 flex justify-end py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Trash
                        onClick={() => deleteCity(cityIndex)}
                        className="cursor-pointer text-red-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex mt-4">
              <Input
                type="text"
                placeholder="Add new city"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
              />
              <Button onClick={addCity} className="ml-2">
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(processForm)}
          className="w-full space-y-8"
        >
          <div className="relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name{' '}
                    {!(mode === 'view') && (
                      <span className="text-red-500">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={mode === 'view' || loading}
                      placeholder="Enter your first name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.firstName?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name{' '}
                    {!(mode === 'view') && (
                      <span className="text-red-500">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={mode === 'view' || loading}
                      placeholder="Enter your last name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.lastName?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contact{' '}
                    {!(mode === 'view') && (
                      <span className="text-red-500">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={mode === 'view' || loading}
                      placeholder="858xxxxxxx"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.contact?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email{' '}
                    {!(mode === 'view') && (
                      <span className="text-red-500">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={mode === 'view' || loading}
                      placeholder="abc@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.contact?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Address{' '}
                    {!(mode === 'view') && (
                      <span className="text-red-500">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={mode === 'view' || loading}
                      placeholder="Enter your address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.address?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    City{' '}
                    {!(mode === 'view') && (
                      <span className="text-red-500">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={mode === 'view' || loading}
                      placeholder="Enter your city"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.city?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleAssignmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Role Assignment Date{' '}
                    {!(mode === 'view') && (
                      <span className="text-red-500">*</span>
                    )}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Input
                          disabled={mode === 'view' || loading}
                          placeholder="Select Date"
                          value={
                            field.value
                              ? format(new Date(field.value), 'yyyy-MM-dd')
                              : ''
                          }
                        />
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Controller
                        name="roleAssignmentDate"
                        control={control}
                        render={({ field }) => (
                          <Calendar
                            mode="single"
                            
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(format(date, 'yyyy-MM-dd'));
                              }
                            }}
                          />
                        )}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage>
                    {errors.roleAssignmentDate?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="verificationStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Verification Status{' '}
                    {!(mode === 'view') && (
                      <span className="text-red-500">*</span>
                    )}
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    disabled={mode === 'view' || loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Verification Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Verified">Verified</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage>
                    {errors.verificationStatus?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Payment Status{' '}
                    {!(mode === 'view') && (
                      <span className="text-red-500">*</span>
                    )}
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    disabled={mode === 'view' || loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Payment Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Under Process">
                        Under Process
                      </SelectItem>
                      <SelectItem value="Not Elligible">
                        Not Elligible
                      </SelectItem>
                      <SelectItem value="Unsuccessful">Unsuccessful</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage>{errors.paymentStatus?.message}</FormMessage>
                </FormItem>
              )}
            />

            {initialData && (
              <FormField
                control={form.control}
                name="lastLogin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last Login{' '}
                      {!(mode === 'view') && (
                        <span className="text-red-500">*</span>
                      )}
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Input
                            disabled
                            placeholder="Select Date"
                            value={
                              field.value
                                ? format(new Date(field.value), 'yyyy-MM-dd')
                                : ''
                            }
                          />
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Controller
                          name="lastLogin"
                          control={control}
                          render={({ field }) => (
                            <Calendar
                              mode="single"
                              
                              onSelect={(date) => {
                                if (date) {
                                  field.onChange(format(date, 'yyyy-MM-dd'));
                                }
                              }}
                            />
                          )}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage>{errors.lastLogin?.message}</FormMessage>
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="activityStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Activity Status{' '}
                    {!(mode === 'view') && (
                      <span className="text-red-500">*</span>
                    )}
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    disabled={mode === 'view' || loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Activity Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage>{errors.activityStatus?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rewardsPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Rewards Points{' '}
                    {!(mode === 'view') && (
                      <span className="text-red-500">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={mode === 'view' || loading}
                      placeholder="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage>{errors.rewardsPoints?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Account Status{' '}
                    {!(mode === 'view') && (
                      <span className="text-red-500">*</span>
                    )}
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    disabled={mode === 'view' || loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Account Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage>{errors.accountStatus?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>

          {!(mode === 'view') && (
            <Button
              disabled={mode === 'view' || loading}
              type="submit"
              className="w-full"
              onClick={() => form.handleSubmit(onSubmit)()}
            >
              {action}
            </Button>
          )}
        </form>
      </Form>
    </>
  );
};

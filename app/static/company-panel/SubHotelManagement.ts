// Dummy data for subhotel table
export type SubHotelDataType = {
  hotelID: string;
  hotelName: string;
  mobileNo: string;
  email: string;
  subscriptionDetails: {
    planName: string;
    cost: number;
  };
  status: 'ACTIVE' | 'INACTIVE';
};

export const dummySubHotelData: SubHotelDataType[] = [
  {
    hotelID: 'HD123456',
    hotelName: 'Hotel A',
    mobileNo: '1234567890',
    email: 'a@b.com',
    subscriptionDetails: {
      planName: 'Basic Stay Plan',
      cost: 1000
    },
    status: 'ACTIVE'
  }
];

// Dummy data for subhotel form

export type DummySubHotelFormDataType = {
  parentHotelID: string;
  subHotelImageUrl: string;
  subHotelImageFile: File | undefined;
  subHotelName: string;
  address: string;
  services: string[];
  subscriptionPlan: string;
  subscriptionPrice: number;
  subHotelID: string;
  contactNo: string;
  email: string;
  gstDetails: string;
};
export const dummySubHotelFormData: DummySubHotelFormDataType[] = [
  {
    parentHotelID: 'HD123456',
    subHotelImageUrl: 'https://example.com/image.jpg',
    subHotelImageFile: undefined,
    subHotelName: 'Sub Hotel A',
    address: '123 Main St',
    services: ['Reception', 'Housekeeping', 'Gym'],
    subscriptionPlan: 'Basic Stay Plan',
    subscriptionPrice: 1000,
    subHotelID: 'SH123456',
    contactNo: '1234567890',
    email: 'a@b.com',
    gstDetails: '1234567890'
  }
];

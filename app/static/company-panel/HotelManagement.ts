

export type HotelDataType = {
  hotelID: string;
  hotelName: string;
  serviceID: string;
  mobileNo: string;
  email: string;
  subscriptionDetails: {
    subscriptionEndDate: string;
  subscriptionPrice: number;
  subscriptionPlan: string;
  };
  status: 'ACTIVE' | 'INACTIVE';
};















import { CreateHotelIdFormSchemaType } from 'schema/company-panel';
import img from '/placeholder-user.jpg';

const dummyHotelData: CreateHotelIdFormSchemaType[] = [
  {
    hotelImageUrl: '/assets/cocacola.jpg',
    hotelImageFile: undefined,
    hotelID: 'H001',
    hotelName: 'Grand Royale Hotel',
    address: '123 Luxury Street, New York, NY',
    services: ['Reception', 'Housekeeping', 'In-Room Dining'],
    subscriptionPlan: 'Premium',
    subscriptionPrice: 499,
    contactNo: '1234567890',
    email: 'contact@grandroyale.com'
  },
  {
    hotelImageUrl: '/assets/cocacola.jpg',
    hotelImageFile: undefined,
    hotelID: 'H002',
    hotelName: 'Sunset Paradise',
    address: '456 Beach Avenue, Miami, FL',
    services: ['Swimming Pool', 'Spa'],
    subscriptionPlan: 'Standard',
    subscriptionPrice: 199,
    contactNo: '0987654321',
    email: 'info@sunsetparadise.com'
  },
  {
    hotelImageUrl: '/assets/cocacola.jpg',
    hotelImageFile: undefined,
    hotelID: 'H003',
    hotelName: 'Mountain View Resort',
    address: '789 Hilltop Road, Denver, CO',
    services: ['Gym', 'Concierge Service', 'SOS Management'],
    subscriptionPlan: 'Basic',
    subscriptionPrice: 534,
    contactNo: '1122334455',
    email: 'support@mountainview.com'
  }
];

export default dummyHotelData;

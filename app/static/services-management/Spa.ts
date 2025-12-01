import { StaticImageData } from 'next/image';
import massagePic from '../../../public/assets/massage.png';
type ServiceCategoryType = 'Spa' | 'Salon';

type StatusType = 'Pending' | 'In-Progress' | 'Completed';

export type SpaServiceDataType = {
  serviceID: string;
  serviceType: string;
  requestDetail: string;
  responseDetail: string;
  requestAssignedTo: string;
  requestTime: {
    date: string;
    time: string;
  };
  guestDetails: {
    guestID: string;
    name: string;
    roomNo: string;
    mobileNumber: string;
    email: string;
  };
  serviceCategory: ServiceCategoryType;
  duration: string;
  status: StatusType;
  assignedTo: string;
};

export const SpaServiceData: SpaServiceDataType[] = [
  {
    serviceID: 'SRV17823451',
    serviceType: 'Massage',
    requestDetail: 'Request for a deep tissue massage.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '09-02-2025',
      time: '10 mins ago'
    },
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    serviceCategory: 'Spa',
    duration: '60 mins',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    serviceID: 'SRV17823452',
    serviceType: 'Hair Spa',
    requestDetail: 'Looking for a hair spa session.',
    responseDetail: 'Appointment confirmed at 5 PM.',
    requestAssignedTo: 'Employee 3',
    requestTime: {
      date: '08-02-2025',
      time: '30 mins ago'
    },
    guestDetails: {
      guestID: '01953270',
      name: 'Michael Brown',
      roomNo: '202',
      mobileNumber: '8103672914',
      email: 'michaelbrown@gmail.com'
    },
    serviceCategory: 'Salon',
    duration: '45 mins',
    status: 'Pending',
    assignedTo: 'Employee 3'
  },
  {
    serviceID: 'SRV17823452',
    serviceType: 'Hair Spa',
    requestDetail: 'Looking for a hair spa session.',
    responseDetail: 'Appointment confirmed at 5 PM.',
    requestAssignedTo: 'Employee 3',
    requestTime: {
      date: '08-02-2025',
      time: '30 mins ago'
    },
    guestDetails: {
      guestID: '01953270',
      name: 'Michael Brown',
      roomNo: '202',
      mobileNumber: '8103672914',
      email: 'michaelbrown@gmail.com'
    },
    serviceCategory: 'Salon',
    duration: '45 mins',
    status: 'Pending',
    assignedTo: 'Employee 3'
  },
  {
    serviceID: 'SRV17823452',
    serviceType: 'Hair Spa',
    requestDetail: 'Looking for a hair spa session.',
    responseDetail: 'Appointment confirmed at 5 PM.',
    requestAssignedTo: 'Employee 3',
    requestTime: {
      date: '08-02-2025',
      time: '30 mins ago'
    },
    guestDetails: {
      guestID: '01953270',
      name: 'Michael Brown',
      roomNo: '202',
      mobileNumber: '8103672914',
      email: 'michaelbrown@gmail.com'
    },
    serviceCategory: 'Salon',
    duration: '45 mins',
    status: 'Pending',
    assignedTo: 'Employee 3'
  },
  {
    serviceID: 'SRV17823452',
    serviceType: 'Hair Spa',
    requestDetail: 'Looking for a hair spa session.',
    responseDetail: 'Appointment confirmed at 5 PM.',
    requestAssignedTo: 'Employee 3',
    requestTime: {
      date: '08-02-2025',
      time: '30 mins ago'
    },
    guestDetails: {
      guestID: '01953270',
      name: 'Michael Brown',
      roomNo: '202',
      mobileNumber: '8103672914',
      email: 'michaelbrown@gmail.com'
    },
    serviceCategory: 'Salon',
    duration: '45 mins',
    status: 'Pending',
    assignedTo: 'Employee 3'
  },
  {
    serviceID: 'SRV17823452',
    serviceType: 'Hair Spa',
    requestDetail: 'Looking for a hair spa session.',
    responseDetail: 'Appointment confirmed at 5 PM.',
    requestAssignedTo: 'Employee 3',
    requestTime: {
      date: '08-02-2025',
      time: '30 mins ago'
    },
    guestDetails: {
      guestID: '01953270',
      name: 'Michael Brown',
      roomNo: '202',
      mobileNumber: '8103672914',
      email: 'michaelbrown@gmail.com'
    },
    serviceCategory: 'Salon',
    duration: '45 mins',
    status: 'Pending',
    assignedTo: 'Employee 3'
  },
  {
    serviceID: 'SRV17823452',
    serviceType: 'Hair Spa',
    requestDetail: 'Looking for a hair spa session.',
    responseDetail: 'Appointment confirmed at 5 PM.',
    requestAssignedTo: 'Employee 3',
    requestTime: {
      date: '08-02-2025',
      time: '30 mins ago'
    },
    guestDetails: {
      guestID: '01953270',
      name: 'Michael Brown',
      roomNo: '202',
      mobileNumber: '8103672914',
      email: 'michaelbrown@gmail.com'
    },
    serviceCategory: 'Salon',
    duration: '45 mins',
    status: 'Pending',
    assignedTo: 'Employee 3'
  },
  {
    serviceID: 'SRV17823452',
    serviceType: 'Hair Spa',
    requestDetail: 'Looking for a hair spa session.',
    responseDetail: 'Appointment confirmed at 5 PM.',
    requestAssignedTo: 'Employee 3',
    requestTime: {
      date: '08-02-2025',
      time: '30 mins ago'
    },
    guestDetails: {
      guestID: '01953270',
      name: 'Michael Brown',
      roomNo: '202',
      mobileNumber: '8103672914',
      email: 'michaelbrown@gmail.com'
    },
    serviceCategory: 'Salon',
    duration: '45 mins',
    status: 'Pending',
    assignedTo: 'Employee 3'
  },
  {
    serviceID: 'SRV17823452',
    serviceType: 'Hair Spa',
    requestDetail: 'Looking for a hair spa session.',
    responseDetail: 'Appointment confirmed at 5 PM.',
    requestAssignedTo: 'Employee 3',
    requestTime: {
      date: '08-02-2025',
      time: '30 mins ago'
    },
    guestDetails: {
      guestID: '01953270',
      name: 'Michael Brown',
      roomNo: '202',
      mobileNumber: '8103672914',
      email: 'michaelbrown@gmail.com'
    },
    serviceCategory: 'Salon',
    duration: '45 mins',
    status: 'Pending',
    assignedTo: 'Employee 3'
  },
  {
    serviceID: 'SRV17823452',
    serviceType: 'Hair Spa',
    requestDetail: 'Looking for a hair spa session.',
    responseDetail: 'Appointment confirmed at 5 PM.',
    requestAssignedTo: 'Employee 3',
    requestTime: {
      date: '08-02-2025',
      time: '30 mins ago'
    },
    guestDetails: {
      guestID: '01953270',
      name: 'Michael Brown',
      roomNo: '202',
      mobileNumber: '8103672914',
      email: 'michaelbrown@gmail.com'
    },
    serviceCategory: 'Salon',
    duration: '45 mins',
    status: 'Pending',
    assignedTo: 'Employee 3'
  },
  {
    serviceID: 'SRV17823452',
    serviceType: 'Hair Spa',
    requestDetail: 'Looking for a hair spa session.',
    responseDetail: 'Appointment confirmed at 5 PM.',
    requestAssignedTo: 'Employee 3',
    requestTime: {
      date: '08-02-2025',
      time: '30 mins ago'
    },
    guestDetails: {
      guestID: '01953270',
      name: 'Michael Brown',
      roomNo: '202',
      mobileNumber: '8103672914',
      email: 'michaelbrown@gmail.com'
    },
    serviceCategory: 'Salon',
    duration: '45 mins',
    status: 'Pending',
    assignedTo: 'Employee 3'
  },
  {
    serviceID: 'SRV17823452',
    serviceType: 'Hair Spa',
    requestDetail: 'Looking for a hair spa session.',
    responseDetail: 'Appointment confirmed at 5 PM.',
    requestAssignedTo: 'Employee 3',
    requestTime: {
      date: '08-02-2025',
      time: '30 mins ago'
    },
    guestDetails: {
      guestID: '01953270',
      name: 'Michael Brown',
      roomNo: '202',
      mobileNumber: '8103672914',
      email: 'michaelbrown@gmail.com'
    },
    serviceCategory: 'Salon',
    duration: '45 mins',
    status: 'Pending',
    assignedTo: 'Employee 3'
  },
  {
    serviceID: 'SBV17823452',
    serviceType: 'Hair Spa',
    requestDetail: 'Looking for a hair spa session.',
    responseDetail: 'Appointment confirmed at 5 PM.',
    requestAssignedTo: 'Employee 3',
    requestTime: {
      date: '08-02-2025',
      time: '30 mins ago'
    },
    guestDetails: {
      guestID: '01953270',
      name: 'Michael Brown',
      roomNo: '202',
      mobileNumber: '8103672914',
      email: 'michaelbrown@gmail.com'
    },
    serviceCategory: 'Salon',
    duration: '45 mins',
    status: 'Pending',
    assignedTo: 'Employee 3'
  }
];

/// Product details dummy data

type Product = {
  visibility: boolean;
  name: string;
  price: number;
  description: string;
  image: StaticImageData;
};

type ProductType = {
  productTypeName: string;
  products: Product[];
};

type SpaProductDetails = {
  serviceName: string;
  productType: ProductType[];
};

export const SpaProductDetailsDummyData = [
  {
    serviceName: 'SPA SERVICE',
    productType: [
      {
        productTypeName: 'Massage',
        products: [
          {
            visibility: true,
            name: 'Swedish massage',
            price: 209,
            description:
              'Swedish massage description, with 30 min duration and 1 hour price, Swedish massage description, with 30 min duration and 1 hour price, Swedish massage description, with 30 min duration and 1 hour price, Swedish massage description, with 30 min duration and 1 hour price',
            image: massagePic
          },
          {
            visibility: true,
            name: 'Deep-tissue massage',
            price: 199,
            description:
              'Swedish massage description, with 30 min duration and 1 hour price, Swedish massage description, with 30 min duration and 1 hour price, Swedish massage description, with 30 min duration and 1 hour price, Swedish massage description, with 30 min duration and 1 hour price',
            image: massagePic
          }
        ]
      },
      {
        productTypeName: 'Facial',
        products: [
          {
            visibility: true,
            name: 'Hydrating facial',
            price: 209,
            description:
              'Swedish massage description, with 30 min duration and 1 hour price, Swedish massage description, with 30 min duration and 1 hour price, Swedish massage description, with 30 min duration and 1 hour price, Swedish massage description, with 30 min duration and 1 hour price',
            image: massagePic
          },
          {
            visibility: true,
            name: 'anti-aging facial',
            price: 199,
            description:
              'Swedish massage description, with 30 min duration and 1 hour price, Swedish massage description, with 30 min duration and 1 hour price, Swedish massage description, with 30 min duration and 1 hour price, Swedish massage description, with 30 min duration and 1 hour price',
            image: massagePic
          }
        ]
      }
    ]
  }
];

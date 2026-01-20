import { StaticImageData } from 'next/image';
import templePic from '../../../public/assets/sunTemple.png';
type RequestTypeType =
  | 'Tourist Attraction'
  | 'Taxi/Cab'
  | 'Entertainment'
  | 'Nearby Restaurent'
  | 'Swimming pool';

type StatusType = 'Pending' | 'In-Progress' | 'Completed';

export type ConciergeServiceDataType = {
  requestID: string;
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
  requestType: RequestTypeType;
  status: StatusType;
  assignedTo: string;
  requestedTimeSlot: string;
  effectiveCost: string;
  requestedVenue: string;
};

export const ConciergeServiceData: ConciergeServiceDataType[] = [
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ17823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  },
  {
    requestID: 'RQ99823457',
    requestDetail: 'Request for a sightseeing tour guide for Jaipur.',
    responseDetail: 'Tour booked for tomorrow at 9 AM.',
    requestAssignedTo: 'Employee 2',
    requestTime: {
      date: '2025-02-07',
      time: '1 hour ago'
    },
    guestDetails: {
      guestID: '01953275',
      name: 'Sophia Wilson',
      roomNo: '412',
      mobileNumber: '7309991234',
      email: 'sophiawilson@gmail.com'
    },
    requestType: 'Tourist Attraction',
    status: 'Completed',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '9:00 AM - 12:00 PM',
    effectiveCost: 'INR 1200/hr. only',
    requestedVenue: 'City Palace, Jaipur'
  }
];



type Product = {
  visibility: boolean;
  name: string;
  price: number;
  image: StaticImageData;
};

type ProductType = {
  productTypeName: string;
  products: Product[];
};

type ConciergeProductDetails = {
  serviceName: string;
  productType: ProductType[];
};

export const ConciergeProductDetailsDummyData = [
  {
    serviceName: 'Nearby Attractions',
    productType: [
      {
        productTypeName: 'cultural and historic sites',
        products: [
          {
            visibility: true,
            name: 'National museum',
            price: 209,
            image: templePic
          },
          { visibility: true, name: 'Sun temple', price: 199, image: templePic }
        ]
      },
      {
        productTypeName: 'Shopping and entertainment',
        products: [
          {
            visibility: true,
            name: 'phoenix mall',
            price: 209,
            image: templePic
          },
          {
            visibility: true,
            name: 'inox cinema',
            price: 199,
            image: templePic
          }
        ]
      }
    ]
  },
  {
    serviceName: 'nearby cafe & restaurants',
    productType: [
      {
        productTypeName: 'cozy dinnings',
        products: [
          {
            visibility: true,
            name: 'capuccino blast',
            price: 40,
            image: templePic
          },
          { visibility: true, name: 'dobara', price: 299, image: templePic }
        ]
      },
      {
        productTypeName: 'Bar & Lounge',
        products: [
          { visibility: true, name: 'Tonique', price: 67, image: templePic },
          { visibility: true, name: 'skyglass', price: 20, image: templePic }
        ]
      }
    ]
  }
];
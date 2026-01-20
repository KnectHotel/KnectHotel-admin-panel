import cocacola from '../../../public/assets/cocacola.jpg';
import vegSymbol from '../../../public/assets/veg.png';
import nonVegSymbol from '../../../public/assets/non-veg.png';



import { StaticImageData } from 'next/image';

type OrderStatusType =
  | 'Order in Transit'
  | 'Order is Preparing'
  | 'Order is Picked up'
  | 'Order placed'
  | 'Undelivered'
  | 'Order Delivered';

export type InRoomDiningDataType = {
  orderID: string;
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
  serviceID: string;
  orderStatus: OrderStatusType;
  assignedTo: string;
};

export const InRoomDiningData: InRoomDiningDataType[] = [
  {
    orderID: 'OD17823450',
    requestTime: {
      date: '2025-02-09',
      time: '10 mins ago'
    },
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    serviceID: 'SD1234561',
    orderStatus: 'Order in Transit',
    assignedTo: 'Employee 1'
  },
  {
    orderID: 'OD17823452',
    requestTime: {
      date: '2025-02-10',
      time: '15 mins ago'
    },
    guestDetails: {
      guestID: '01953270',
      name: 'John Doe',
      roomNo: '306',
      mobileNumber: '7302884522',
      email: 'johndoe@gmail.com'
    },
    serviceID: 'SD1234562',
    orderStatus: 'Order is Preparing',
    assignedTo: 'Employee 2'
  },
  {
    orderID: 'OD17823453',
    requestTime: {
      date: '2025-02-11',
      time: '20 mins ago'
    },
    guestDetails: {
      guestID: '01953271',
      name: 'Alice Johnson',
      roomNo: '307',
      mobileNumber: '7302884523',
      email: 'alicejohnson@gmail.com'
    },
    serviceID: 'SD1234563',
    orderStatus: 'Order is Picked up',
    assignedTo: 'Employee 3'
  },
  {
    orderID: 'OD17823454',
    requestTime: {
      date: '2025-02-12',
      time: '25 mins ago'
    },
    guestDetails: {
      guestID: '01953272',
      name: 'Michael Brown',
      roomNo: '308',
      mobileNumber: '7302884524',
      email: 'michaelbrown@gmail.com'
    },
    serviceID: 'SD1234564',
    orderStatus: 'Order placed',
    assignedTo: 'Employee 4'
  },
  {
    orderID: 'OD17823454',
    requestTime: {
      date: '2025-02-12',
      time: '25 mins ago'
    },
    guestDetails: {
      guestID: '01953272',
      name: 'Michael Brown',
      roomNo: '308',
      mobileNumber: '7302884524',
      email: 'michaelbrown@gmail.com'
    },
    serviceID: 'SD1234564',
    orderStatus: 'Order placed',
    assignedTo: 'Employee 4'
  },
  {
    orderID: 'OD17823454',
    requestTime: {
      date: '2025-02-12',
      time: '25 mins ago'
    },
    guestDetails: {
      guestID: '01953272',
      name: 'Michael Brown',
      roomNo: '308',
      mobileNumber: '7302884524',
      email: 'michaelbrown@gmail.com'
    },
    serviceID: 'SD1234564',
    orderStatus: 'Order placed',
    assignedTo: 'Employee 4'
  },
  {
    orderID: 'OD17823454',
    requestTime: {
      date: '2025-02-12',
      time: '25 mins ago'
    },
    guestDetails: {
      guestID: '01953272',
      name: 'Michael Brown',
      roomNo: '308',
      mobileNumber: '7302884524',
      email: 'michaelbrown@gmail.com'
    },
    serviceID: 'SD1234564',
    orderStatus: 'Order placed',
    assignedTo: 'Employee 4'
  },
  {
    orderID: 'OD17823454',
    requestTime: {
      date: '2025-02-12',
      time: '25 mins ago'
    },
    guestDetails: {
      guestID: '01953272',
      name: 'Michael Brown',
      roomNo: '308',
      mobileNumber: '7302884524',
      email: 'michaelbrown@gmail.com'
    },
    serviceID: 'SD1234564',
    orderStatus: 'Order placed',
    assignedTo: 'Employee 4'
  },
  {
    orderID: 'OD17823454',
    requestTime: {
      date: '2025-02-12',
      time: '25 mins ago'
    },
    guestDetails: {
      guestID: '01953272',
      name: 'Michael Brown',
      roomNo: '308',
      mobileNumber: '7302884524',
      email: 'michaelbrown@gmail.com'
    },
    serviceID: 'SD1234564',
    orderStatus: 'Order placed',
    assignedTo: 'Employee 4'
  },
  {
    orderID: 'OD17823454',
    requestTime: {
      date: '2025-02-12',
      time: '25 mins ago'
    },
    guestDetails: {
      guestID: '01953272',
      name: 'Michael Brown',
      roomNo: '308',
      mobileNumber: '7302884524',
      email: 'michaelbrown@gmail.com'
    },
    serviceID: 'SD1234564',
    orderStatus: 'Order placed',
    assignedTo: 'Employee 4'
  },
  {
    orderID: 'OD17823454',
    requestTime: {
      date: '2025-02-12',
      time: '25 mins ago'
    },
    guestDetails: {
      guestID: '01953272',
      name: 'Michael Brown',
      roomNo: '308',
      mobileNumber: '7302884524',
      email: 'michaelbrown@gmail.com'
    },
    serviceID: 'SD1234564',
    orderStatus: 'Order placed',
    assignedTo: 'Employee 4'
  },
  {
    orderID: 'OD17823454',
    requestTime: {
      date: '2025-02-12',
      time: '25 mins ago'
    },
    guestDetails: {
      guestID: '01953272',
      name: 'Michael Brown',
      roomNo: '308',
      mobileNumber: '7302884524',
      email: 'michaelbrown@gmail.com'
    },
    serviceID: 'SD1234564',
    orderStatus: 'Order placed',
    assignedTo: 'Employee 4'
  },
  {
    orderID: 'OD17823454',
    requestTime: {
      date: '2025-02-12',
      time: '25 mins ago'
    },
    guestDetails: {
      guestID: '01953272',
      name: 'Michael Brown',
      roomNo: '308',
      mobileNumber: '7302884524',
      email: 'michaelbrown@gmail.com'
    },
    serviceID: 'SD1234564',
    orderStatus: 'Order placed',
    assignedTo: 'Employee 4'
  },
  {
    orderID: 'OD17823454',
    requestTime: {
      date: '2025-02-12',
      time: '25 mins ago'
    },
    guestDetails: {
      guestID: '01953272',
      name: 'Michael Brown',
      roomNo: '308',
      mobileNumber: '7302884524',
      email: 'michaelbrown@gmail.com'
    },
    serviceID: 'SD1234564',
    orderStatus: 'Order placed',
    assignedTo: 'Employee 4'
  },
  {
    orderID: 'OD17823455',
    requestTime: {
      date: '2025-02-13',
      time: '30 mins ago'
    },
    guestDetails: {
      guestID: '01953273',
      name: 'Emily Wilson',
      roomNo: '309',
      mobileNumber: '7302884525',
      email: 'emilywilson@gmail.com'
    },
    serviceID: 'SD1234565',
    orderStatus: 'Undelivered',
    assignedTo: 'Employee 5'
  },
  {
    orderID: 'OD17823456',
    requestTime: {
      date: '2025-02-14',
      time: '35 mins ago'
    },
    guestDetails: {
      guestID: '01953274',
      name: 'David Lee',
      roomNo: '310',
      mobileNumber: '7302884526',
      email: 'davidlee@gmail.com'
    },
    serviceID: 'SD1234566',
    orderStatus: 'Order Delivered',
    assignedTo: 'Employee 6'
  }
];



type ProductType = 'Vegetarian' | 'Non-Vegetarian';
export type InRoomDiningMenuDataType = {
  productType: string;
  productName: string;
  description: string;
  cost: number;
  discount: number;
  type: ProductType;
  visibility: boolean;
  image: StaticImageData;
  vegIcon: StaticImageData;
  nonVegIcon: StaticImageData;
  serves: number;
};

export const inRoomDiningMenuData: InRoomDiningMenuDataType[] = [
  {
    productType: 'Beverages',
    productName: 'Coca-Cola',
    description:
      'Our signature Whopper with Flame Grilled Chicken patty, onions, lettuce, tomatoes(seasonal), gherkins, cream and smoky sauce with xxl buns',
    cost: 299,
    discount: 60,
    type: 'Non-Vegetarian',
    visibility: true,
    image: cocacola,
    vegIcon: vegSymbol,
    nonVegIcon: nonVegSymbol,
    serves: 1
  },
  {
    productType: 'Beverages',
    productName: 'Coca-Cola',
    description:
      'Our signature Whopper with Flame Grilled Chicken patty, onions, lettuce, tomatoes(seasonal), gherkins, cream and smoky sauce with xxl buns',
    cost: 299,
    discount: 60,
    type: 'Vegetarian',
    visibility: true,
    image: cocacola,
    vegIcon: vegSymbol,
    nonVegIcon: nonVegSymbol,
    serves: 1
  },
  {
    productType: 'Beverages',
    productName: 'Coca-Cola',
    description:
      'Our signature Whopper with Flame Grilled Chicken patty, onions, lettuce, tomatoes(seasonal), gherkins, cream and smoky sauce with xxl buns',
    cost: 299,
    discount: 60,
    type: 'Vegetarian',
    visibility: true,
    image: cocacola,
    vegIcon: vegSymbol,
    nonVegIcon: nonVegSymbol,
    serves: 1
  },
  {
    productType: 'Beverages',
    productName: 'Coca-Cola',
    description:
      'Our signature Whopper with Flame Grilled Chicken patty, onions, lettuce, tomatoes(seasonal), gherkins, cream and smoky sauce with xxl buns',
    cost: 299,
    discount: 60,
    type: 'Vegetarian',
    visibility: true,
    image: cocacola,
    vegIcon: vegSymbol,
    nonVegIcon: nonVegSymbol,
    serves: 1
  },
  {
    productType: 'Beverages',
    productName: 'Coca-Cola',
    description:
      'Our signature Whopper with Flame Grilled Chicken patty, onions, lettuce, tomatoes(seasonal), gherkins, cream and smoky sauce with xxl buns',
    cost: 299,
    discount: 60,
    type: 'Vegetarian',
    visibility: true,
    image: cocacola,
    vegIcon: vegSymbol,
    nonVegIcon: nonVegSymbol,
    serves: 1
  },
  {
    productType: 'Beverages',
    productName: 'Coca-Cola',
    description:
      'Our signature Whopper with Flame Grilled Chicken patty, onions, lettuce, tomatoes(seasonal), gherkins, cream and smoky sauce with xxl buns',
    cost: 299,
    discount: 60,
    type: 'Vegetarian',
    visibility: true,
    image: cocacola,
    vegIcon: vegSymbol,
    nonVegIcon: nonVegSymbol,
    serves: 1
  },
  {
    productType: 'Beverages',
    productName: 'Coca-Cola',
    description:
      'Our signature Whopper with Flame Grilled Chicken patty, onions, lettuce, tomatoes(seasonal), gherkins, cream and smoky sauce with xxl buns',
    cost: 299,
    discount: 60,
    type: 'Vegetarian',
    visibility: true,
    image: cocacola,
    vegIcon: vegSymbol,
    nonVegIcon: nonVegSymbol,
    serves: 1
  },
  {
    productType: 'Beverages',
    productName: 'Coca-Cola',
    description:
      'Our signature Whopper with Flame Grilled Chicken patty, onions, lettuce, tomatoes(seasonal), gherkins, cream and smoky sauce with xxl buns',
    cost: 299,
    discount: 60,
    type: 'Vegetarian',
    visibility: true,
    image: cocacola,
    vegIcon: vegSymbol,
    nonVegIcon: nonVegSymbol,
    serves: 1
  }
];

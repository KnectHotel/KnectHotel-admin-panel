import img from '../../../public/placeholder-user.jpg';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';


export type GuestDetailsDataType = {
  guestID: string;
  hotelName: string;
  guestName: string;
  mobileNo: string;
  roomCategory: string;
  emailID: string;
  checkInDetails: {
    date: string;
    time: string;
  };
  checkOutDetails: {
    date: string;
    time: string;
  };
};

export const GuestDetailsDummyData: GuestDetailsDataType[] = [
  {
    guestID: 'GD123452',
    hotelName: 'Hilton',
    guestName: 'John Doe',
    mobileNo: '9835081173',
    roomCategory: 'SINGLE ROOM',
    emailID: 'johndoe@gmail.com',
    checkInDetails: {
      date: '10-02-25',
      time: '10:00'
    },
    checkOutDetails: {
      date: '12-02-25',
      time: '11:00'
    }
  }
];



export type GuestDetailsCardDataType = {
  guestImage: StaticImport | string;
  guestID: string;
  hotelName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
};

export const GuestDetailsCardDummyData: GuestDetailsCardDataType[] = [
  {
    guestImage: img,
    guestID: 'GD123452',
    hotelName: 'Namaste Village',
    firstName: 'Timothy',
    lastName: 'Chal Re',
    phoneNumber: '6203770138',
    email: 'mainTimothy@gmail.com'
  },
  {
    guestImage: img,
    guestID: 'GD113452',
    hotelName: 'Namaste Village',
    firstName: 'Timothy',
    lastName: 'Chal Re',
    phoneNumber: '6203770138',
    email: 'mainTimothy@gmail.com'
  },
  {
    guestImage: img,
    guestID: 'GD123352',
    hotelName: 'Namaste Village',
    firstName: 'Timothy',
    lastName: 'Chal Re',
    phoneNumber: '6203770138',
    email: 'mainTimothy@gmail.com'
  }
];

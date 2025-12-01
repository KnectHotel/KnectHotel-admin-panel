//****************Dummy guest data type definition*****************
type TrackingStatusType = 'under review' | 'pending' | 'submitted';
type PaymentStatusType = 'pending' | 'paid';

export type GuestDataType = {
  guestId: string;
  checkInCheckOutDetails: {
    checkInDate: string;
    checkInTime: string;
    CheckOutTime: string;
    checkOutDate: string;
  };
  guestDetails: {
    name: string;
    phoneNo: string;
    roomNo: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
  };
  contactDetails: {
    email: string;
    mobileNo: string;
  };
  paymentDetails: {
    receivedAmt: number;
    dueAmt: number;
    paymentMode: string;
  };
  roomDetails: {
    roomCategory: string;
  };
  trackingStatus: TrackingStatusType;
  paymentStatus: PaymentStatusType;
};

// Dummy guest data
export const GuestData: GuestDataType[] = [
  {
    guestId: 'GD17823450',
    checkInCheckOutDetails: {
      checkInDate: '2022-01-01',
      checkInTime: '10:00 AM',
      CheckOutTime: '12:00 PM',
      checkOutDate: '2022-01-05'
    },
    guestDetails: {
      name: 'John Doe',
      phoneNo: '1234567890',
      roomNo: '101',
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'California',
      pinCode: '90001'
    },
    contactDetails: {
      email: 'johndoe@gmail.com',
      mobileNo: '9899999999'
    },
    paymentDetails: {
      receivedAmt: 0,
      dueAmt: 0,
      paymentMode: 'online'
    },
    roomDetails: {
      roomCategory: 'AC'
    },
    trackingStatus: 'under review',
    paymentStatus: 'pending'
  },
  {
    guestId: 'GD17823450',
    checkInCheckOutDetails: {
      checkInDate: '2022-01-01',
      checkInTime: '10:00 AM',
      CheckOutTime: '12:00 PM',
      checkOutDate: '2022-01-05'
    },
    guestDetails: {
      name: 'John Doe',
      phoneNo: '1234567890',
      roomNo: '101',
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'California',
      pinCode: '90001'
    },
    contactDetails: {
      email: 'johndoe@gmail.com',
      mobileNo: '9899999999'
    },
    paymentDetails: {
      receivedAmt: 0,
      dueAmt: 0,
      paymentMode: 'online'
    },
    roomDetails: {
      roomCategory: 'AC'
    },
    trackingStatus: 'under review',
    paymentStatus: 'pending'
  },
  {
    guestId: 'GD17823450',
    checkInCheckOutDetails: {
      checkInDate: '2022-01-01',
      checkInTime: '10:00 AM',
      CheckOutTime: '12:00 PM',
      checkOutDate: '2022-01-05'
    },
    guestDetails: {
      name: 'John Doe',
      phoneNo: '1234567890',
      roomNo: '101',
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'California',
      pinCode: '90001'
    },
    contactDetails: {
      email: 'johndoe@gmail.com',
      mobileNo: '9899999999'
    },
    paymentDetails: {
      receivedAmt: 0,
      dueAmt: 0,
      paymentMode: 'online'
    },
    roomDetails: {
      roomCategory: 'AC'
    },
    trackingStatus: 'under review',
    paymentStatus: 'pending'
  },
  {
    guestId: 'GD17823450',
    checkInCheckOutDetails: {
      checkInDate: '2022-01-01',
      checkInTime: '10:00 AM',
      CheckOutTime: '12:00 PM',
      checkOutDate: '2022-01-05'
    },
    guestDetails: {
      name: 'John Doe',
      phoneNo: '1234567890',
      roomNo: '101',
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'California',
      pinCode: '90001'
    },
    contactDetails: {
      email: 'johndoe@gmail.com',
      mobileNo: '9899999999'
    },
    paymentDetails: {
      receivedAmt: 0,
      dueAmt: 0,
      paymentMode: 'online'
    },
    roomDetails: {
      roomCategory: 'AC'
    },
    trackingStatus: 'under review',
    paymentStatus: 'pending'
  },
  {
    guestId: 'GD17823450',
    checkInCheckOutDetails: {
      checkInDate: '2022-01-01',
      checkInTime: '10:00 AM',
      CheckOutTime: '12:00 PM',
      checkOutDate: '2022-01-05'
    },
    guestDetails: {
      name: 'John Doe',
      phoneNo: '1234567890',
      roomNo: '101',
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'California',
      pinCode: '90001'
    },
    contactDetails: {
      email: 'johndoe@gmail.com',
      mobileNo: '9899999999'
    },
    paymentDetails: {
      receivedAmt: 0,
      dueAmt: 0,
      paymentMode: 'online'
    },
    roomDetails: {
      roomCategory: 'AC'
    },
    trackingStatus: 'under review',
    paymentStatus: 'pending'
  },
  {
    guestId: 'GD17823450',
    checkInCheckOutDetails: {
      checkInDate: '2022-01-01',
      checkInTime: '10:00 AM',
      CheckOutTime: '12:00 PM',
      checkOutDate: '2022-01-05'
    },
    guestDetails: {
      name: 'John Doe',
      phoneNo: '1234567890',
      roomNo: '101',
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'California',
      pinCode: '90001'
    },
    contactDetails: {
      email: 'johndoe@gmail.com',
      mobileNo: '9899999999'
    },
    paymentDetails: {
      receivedAmt: 0,
      dueAmt: 0,
      paymentMode: 'online'
    },
    roomDetails: {
      roomCategory: 'AC'
    },
    trackingStatus: 'under review',
    paymentStatus: 'pending'
  },
  {
    guestId: 'GD17823450',
    checkInCheckOutDetails: {
      checkInDate: '2022-01-01',
      checkInTime: '10:00 AM',
      CheckOutTime: '12:00 PM',
      checkOutDate: '2022-01-05'
    },
    guestDetails: {
      name: 'John Doe',
      phoneNo: '1234567890',
      roomNo: '101',
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'California',
      pinCode: '90001'
    },
    contactDetails: {
      email: 'johndoe@gmail.com',
      mobileNo: '9899999999'
    },
    paymentDetails: {
      receivedAmt: 0,
      dueAmt: 0,
      paymentMode: 'online'
    },
    roomDetails: {
      roomCategory: 'AC'
    },
    trackingStatus: 'under review',
    paymentStatus: 'pending'
  },
  {
    guestId: 'GD17823450',
    checkInCheckOutDetails: {
      checkInDate: '2022-01-01',
      checkInTime: '10:00 AM',
      CheckOutTime: '12:00 PM',
      checkOutDate: '2022-01-05'
    },
    guestDetails: {
      name: 'John Doe',
      phoneNo: '1234567890',
      roomNo: '101',
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'California',
      pinCode: '90001'
    },
    contactDetails: {
      email: 'johndoe@gmail.com',
      mobileNo: '9899999999'
    },
    paymentDetails: {
      receivedAmt: 0,
      dueAmt: 0,
      paymentMode: 'online'
    },
    roomDetails: {
      roomCategory: 'AC'
    },
    trackingStatus: 'under review',
    paymentStatus: 'pending'
  },
  {
    guestId: 'GD17823450',
    checkInCheckOutDetails: {
      checkInDate: '2022-01-01',
      checkInTime: '10:00 AM',
      CheckOutTime: '12:00 PM',
      checkOutDate: '2022-01-05'
    },
    guestDetails: {
      name: 'John Doe',
      phoneNo: '1234567890',
      roomNo: '101',
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'California',
      pinCode: '90001'
    },
    contactDetails: {
      email: 'johndoe@gmail.com',
      mobileNo: '9899999999'
    },
    paymentDetails: {
      receivedAmt: 0,
      dueAmt: 0,
      paymentMode: 'online'
    },
    roomDetails: {
      roomCategory: 'AC'
    },
    trackingStatus: 'under review',
    paymentStatus: 'pending'
  },
  {
    guestId: 'GD17823450',
    checkInCheckOutDetails: {
      checkInDate: '2022-01-01',
      checkInTime: '10:00 AM',
      CheckOutTime: '12:00 PM',
      checkOutDate: '2022-01-05'
    },
    guestDetails: {
      name: 'John Doe',
      phoneNo: '1234567890',
      roomNo: '101',
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'California',
      pinCode: '90001'
    },
    contactDetails: {
      email: 'johndoe@gmail.com',
      mobileNo: '9899999999'
    },
    paymentDetails: {
      receivedAmt: 0,
      dueAmt: 0,
      paymentMode: 'online'
    },
    roomDetails: {
      roomCategory: 'AC'
    },
    trackingStatus: 'under review',
    paymentStatus: 'pending'
  },
  {
    guestId: 'GD17823450',
    checkInCheckOutDetails: {
      checkInDate: '2022-01-01',
      checkInTime: '10:00 AM',
      CheckOutTime: '12:00 PM',
      checkOutDate: '2022-01-05'
    },
    guestDetails: {
      name: 'John Doe',
      phoneNo: '1234567890',
      roomNo: '101',
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'California',
      pinCode: '90001'
    },
    contactDetails: {
      email: 'johndoe@gmail.com',
      mobileNo: '9899999999'
    },
    paymentDetails: {
      receivedAmt: 0,
      dueAmt: 0,
      paymentMode: 'online'
    },
    roomDetails: {
      roomCategory: 'AC'
    },
    trackingStatus: 'under review',
    paymentStatus: 'pending'
  },
  {
    guestId: 'GD17823451',
    checkInCheckOutDetails: {
      checkInDate: '2022-02-10',
      checkInTime: '2:00 PM',
      CheckOutTime: '11:00 AM',
      checkOutDate: '2022-02-15'
    },
    guestDetails: {
      name: 'Jane Smith',
      phoneNo: '2345678901',
      roomNo: '102',
      address: '456 Elm St',
      city: 'New York',
      state: 'New York',
      pinCode: '10001'
    },
    contactDetails: {
      email: 'janesmith@yahoo.com',
      mobileNo: '9876543210'
    },
    paymentDetails: {
      receivedAmt: 0,
      dueAmt: 0,
      paymentMode: 'online'
    },
    roomDetails: {
      roomCategory: 'AC'
    },
    trackingStatus: 'submitted',
    paymentStatus: 'paid'
  },
  {
    guestId: 'GD17823452',
    checkInCheckOutDetails: {
      checkInDate: '2022-03-05',
      checkInTime: '3:00 PM',
      CheckOutTime: '10:00 AM',
      checkOutDate: '2022-03-07'
    },
    guestDetails: {
      name: 'Alice Johnson',
      phoneNo: '3456789012',
      roomNo: '103',
      address: '789 Pine St',
      city: 'Chicago',
      state: 'Illinois',
      pinCode: '60601'
    },
    contactDetails: {
      email: 'alicej@outlook.com',
      mobileNo: '8765432109'
    },
    paymentDetails: {
      receivedAmt: 0,
      dueAmt: 0,
      paymentMode: 'online'
    },
    roomDetails: {
      roomCategory: 'AC'
    },
    trackingStatus: 'pending',
    paymentStatus: 'pending'
  }
  // Continue updating all other guests with similar dummy values
];

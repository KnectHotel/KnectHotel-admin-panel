
type RoleType =
  | 'Reception'
  | 'Housekeeping'
  | 'In-Room Dining'
  | 'Gym'
  | 'Spa'
  | 'Swimming Pool'
  | 'Concierge Service'
  | 'In-Room Control'
  | 'Order Management'
  | 'SOS'
  | 'Chat';
type StatusType = 'ACTIVE' | 'INACTIVE';

export type AdminDummyDataType = {
  adminID: string;
  adminDetails: {
    name: string;
    roomNo: string;
    mobileNo: string;
    emailID: string;
    password: string;
  };
  loginDetails: {
    date: string;
    time: string;
  };
  logoutDetails: {
    date: string;
    time: string;
  };
  role: RoleType;
  status: StatusType;
};


export const AdminDummyData: AdminDummyDataType[] = [
  {
    adminID: 'ED123452',
    adminDetails: {
      name: 'MR JOHN DOE',
      roomNo: '101',
      mobileNo: '6203770138',
      emailID: 'johndoe@gmail.com',
      password: 'asd1234'
    },
    loginDetails: {
      date: '26-02-25',
      time: '10:00am'
    },
    logoutDetails: {
      date: '26-02-25',
      time: '11:00am'
    },
    role: 'Housekeeping',
    status: 'ACTIVE'
  },
  {
    adminID: 'ED123452',
    adminDetails: {
      name: 'MR JOHN DOE',
      roomNo: '101',
      mobileNo: '6203770138',
      emailID: 'johndoe@gmail.com',
      password: 'asd1234'
    },
    loginDetails: {
      date: '26-02-25',
      time: '10:00am'
    },
    logoutDetails: {
      date: '26-02-25',
      time: '11:00am'
    },
    role: 'Housekeeping',
    status: 'ACTIVE'
  },
  {
    adminID: 'ED123452',
    adminDetails: {
      name: 'MR JOHN DOE',
      roomNo: '101',
      mobileNo: '6203770138',
      emailID: 'johndoe@gmail.com',
      password: 'asd1234'
    },
    loginDetails: {
      date: '26-02-25',
      time: '10:00am'
    },
    logoutDetails: {
      date: '26-02-25',
      time: '11:00am'
    },
    role: 'Housekeeping',
    status: 'ACTIVE'
  },
  {
    adminID: 'ED123452',
    adminDetails: {
      name: 'MR JOHN DOE',
      roomNo: '101',
      mobileNo: '6203770138',
      emailID: 'johndoe@gmail.com',
      password: 'asd1234'
    },
    loginDetails: {
      date: '26-02-25',
      time: '10:00am'
    },
    logoutDetails: {
      date: '26-02-25',
      time: '11:00am'
    },
    role: 'Housekeeping',
    status: 'ACTIVE'
  },
  {
    adminID: 'ED123452',
    adminDetails: {
      name: 'MR JOHN DOE',
      roomNo: '101',
      mobileNo: '6203770138',
      emailID: 'johndoe@gmail.com',
      password: 'asd1234'
    },
    loginDetails: {
      date: '26-02-25',
      time: '10:00am'
    },
    logoutDetails: {
      date: '26-02-25',
      time: '11:00am'
    },
    role: 'Housekeeping',
    status: 'ACTIVE'
  },
  {
    adminID: 'ED123452',
    adminDetails: {
      name: 'MR JOHN DOE',
      roomNo: '101',
      mobileNo: '6203770138',
      emailID: 'johndoe@gmail.com',
      password: 'asd1234'
    },
    loginDetails: {
      date: '26-02-25',
      time: '10:00am'
    },
    logoutDetails: {
      date: '26-02-25',
      time: '11:00am'
    },
    role: 'Housekeeping',
    status: 'ACTIVE'
  },
  {
    adminID: 'ED123452',
    adminDetails: {
      name: 'MR JOHN DOE',
      roomNo: '101',
      mobileNo: '6203770138',
      emailID: 'johndoe@gmail.com',
      password: 'asd1234'
    },
    loginDetails: {
      date: '26-02-25',
      time: '10:00am'
    },
    logoutDetails: {
      date: '26-02-25',
      time: '11:00am'
    },
    role: 'Housekeeping',
    status: 'ACTIVE'
  },
  {
    adminID: 'ED123452',
    adminDetails: {
      name: 'MR JOHN DOE',
      roomNo: '101',
      mobileNo: '6203770138',
      emailID: 'johndoe@gmail.com',
      password: 'asd1234'
    },
    loginDetails: {
      date: '26-02-25',
      time: '10:00am'
    },
    logoutDetails: {
      date: '26-02-25',
      time: '11:00am'
    },
    role: 'Housekeeping',
    status: 'ACTIVE'
  },
  {
    adminID: 'ED123452',
    adminDetails: {
      name: 'MR JOHN DOE',
      roomNo: '101',
      mobileNo: '6203770138',
      emailID: 'johndoe@gmail.com',
      password: 'asd1234'
    },
    loginDetails: {
      date: '26-02-25',
      time: '10:00am'
    },
    logoutDetails: {
      date: '26-02-25',
      time: '11:00am'
    },
    role: 'Housekeeping',
    status: 'ACTIVE'
  },
  {
    adminID: 'ED123452',
    adminDetails: {
      name: 'MR JOHN DOE',
      roomNo: '101',
      mobileNo: '6203770138',
      emailID: 'johndoe@gmail.com',
      password: 'asd1234'
    },
    loginDetails: {
      date: '26-02-25',
      time: '10:00am'
    },
    logoutDetails: {
      date: '26-02-25',
      time: '11:00am'
    },
    role: 'Housekeeping',
    status: 'ACTIVE'
  },
  {
    adminID: 'ED123452',
    adminDetails: {
      name: 'MR JOHN DOE',
      roomNo: '101',
      mobileNo: '6203770138',
      emailID: 'johndoe@gmail.com',
      password: 'asd1234'
    },
    loginDetails: {
      date: '26-02-25',
      time: '10:00am'
    },
    logoutDetails: {
      date: '26-02-25',
      time: '11:00am'
    },
    role: 'Housekeeping',
    status: 'ACTIVE'
  },
  {
    adminID: 'ED123452',
    adminDetails: {
      name: 'MR JOHN DOE',
      roomNo: '101',
      mobileNo: '6203770138',
      emailID: 'johndoe@gmail.com',
      password: 'asd1234'
    },
    loginDetails: {
      date: '26-02-25',
      time: '10:00am'
    },
    logoutDetails: {
      date: '26-02-25',
      time: '11:00am'
    },
    role: 'Housekeeping',
    status: 'ACTIVE'
  }
];

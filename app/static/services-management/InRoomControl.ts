type RequestTypeType = 'Electronics' | 'Electricity';

type StatusType = 'Pending' | 'In-Progress' | 'Completed';

export type InRoomControlDataType = {
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
};

export const InRoomControlData: InRoomControlDataType[] = [
  {
    requestID: 'RQ17823451',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    requestID: 'RQ17823451',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    requestID: 'RQ17823451',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    requestID: 'RQ17823451',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    requestID: 'RQ17823451',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    requestID: 'RQ17823451',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    requestID: 'RQ17823451',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    requestID: 'RQ17823451',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    requestID: 'RQ17823451',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    requestID: 'RQ17823451',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    requestID: 'RQ17823451',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    requestID: 'RQ17823451',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    requestID: 'RQ17823451',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    requestID: 'RQ17823451',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    requestID: 'RQ17823451',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    requestID: 'RQ17823451',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    requestID: 'RQ17823451',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    requestID: 'RQ17823451',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  },
  {
    requestID: 'RQ1888881',
    requestDetail:
      'There is a power outage in [location/room]. Please check and provide an estimated restoration time.',
    responseDetail:
      '"Our team is working on the issue. Power is expected to be restored by [12: 00 pm]. Thank you for your patience!"',
    requestAssignedTo: 'Employee 2',
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
    requestType: 'Electronics',
    status: 'In-Progress',
    assignedTo: 'Employee 2'
  }
];

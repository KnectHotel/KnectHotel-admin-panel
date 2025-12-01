type StatusType = 'Pending' | 'Resolved';

type EmergencyTypeType = 'Fire' | 'Medical' | 'Security';

export type SOSManagementDataType = {
  guestID: string;
  requestTime: {
    date: string;
    time: string;
  };
  guestDetails: {
    name: string;
    roomNo: string;
    mobileNumber: string;
  };
  EmergencyType: EmergencyTypeType;
  status: StatusType;
  assignedTo: string;
};

export const SOSManagementData: SOSManagementDataType[] = [
  {
    guestID: 'GD17823450',
    requestTime: {
      date: '2025-02-09',
      time: '10 mins ago'
    },
    guestDetails: {
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521'
    },
    EmergencyType: 'Fire',
    status: 'Pending',
    assignedTo: 'Employee 1'
  },
  {
    guestID: 'GD17823451',
    requestTime: {
      date: '2025-02-09',
      time: '5 mins ago'
    },
    guestDetails: {
      name: 'John Doe',
      roomNo: '202',
      mobileNumber: '8123456789'
    },
    EmergencyType: 'Medical',
    status: 'Resolved',
    assignedTo: 'Employee 2'
  },
  {
    guestID: 'GD17823452',
    requestTime: {
      date: '2025-02-09',
      time: '15 mins ago'
    },
    guestDetails: {
      name: 'Alice Brown',
      roomNo: '401',
      mobileNumber: '9001234567'
    },
    EmergencyType: 'Security',
    status: 'Pending',
    assignedTo: 'Employee 3'
  },
  {
    guestID: 'GD17823453',
    requestTime: {
      date: '2025-02-08',
      time: '1 hour ago'
    },
    guestDetails: {
      name: 'Robert Davis',
      roomNo: '110',
      mobileNumber: '7012345678'
    },
    EmergencyType: 'Fire',
    status: 'Resolved',
    assignedTo: 'Employee 4'
  },
  {
    guestID: 'GD17823454',
    requestTime: {
      date: '2025-02-07',
      time: '2 hours ago'
    },
    guestDetails: {
      name: 'Sophia Wilson',
      roomNo: '210',
      mobileNumber: '8012345678'
    },
    EmergencyType: 'Medical',
    status: 'Pending',
    assignedTo: 'Employee 5'
  },
  {
    guestID: 'GD17823455',
    requestTime: {
      date: '2025-02-06',
      time: '3 hours ago'
    },
    guestDetails: {
      name: 'David Miller',
      roomNo: '512',
      mobileNumber: '9112345678'
    },
    EmergencyType: 'Security',
    status: 'Resolved',
    assignedTo: 'Employee 6'
  },
  {
    guestID: 'GD17823455',
    requestTime: {
      date: '2025-02-06',
      time: '3 hours ago'
    },
    guestDetails: {
      name: 'David Miller',
      roomNo: '512',
      mobileNumber: '9112345678'
    },
    EmergencyType: 'Security',
    status: 'Resolved',
    assignedTo: 'Employee 6'
  },
  {
    guestID: 'GD17823455',
    requestTime: {
      date: '2025-02-06',
      time: '3 hours ago'
    },
    guestDetails: {
      name: 'David Miller',
      roomNo: '512',
      mobileNumber: '9112345678'
    },
    EmergencyType: 'Security',
    status: 'Resolved',
    assignedTo: 'Employee 6'
  },
  {
    guestID: 'GD17823455',
    requestTime: {
      date: '2025-02-06',
      time: '3 hours ago'
    },
    guestDetails: {
      name: 'David Miller',
      roomNo: '512',
      mobileNumber: '9112345678'
    },
    EmergencyType: 'Security',
    status: 'Resolved',
    assignedTo: 'Employee 6'
  },
  {
    guestID: 'GD17823455',
    requestTime: {
      date: '2025-02-06',
      time: '3 hours ago'
    },
    guestDetails: {
      name: 'David Miller',
      roomNo: '512',
      mobileNumber: '9112345678'
    },
    EmergencyType: 'Security',
    status: 'Resolved',
    assignedTo: 'Employee 6'
  },
  {
    guestID: 'GD17823455',
    requestTime: {
      date: '2025-02-06',
      time: '3 hours ago'
    },
    guestDetails: {
      name: 'David Miller',
      roomNo: '512',
      mobileNumber: '9112345678'
    },
    EmergencyType: 'Security',
    status: 'Resolved',
    assignedTo: 'Employee 6'
  },
  {
    guestID: 'GD17823455',
    requestTime: {
      date: '2025-02-06',
      time: '3 hours ago'
    },
    guestDetails: {
      name: 'David Miller',
      roomNo: '512',
      mobileNumber: '9112345678'
    },
    EmergencyType: 'Security',
    status: 'Resolved',
    assignedTo: 'Employee 6'
  },
  {
    guestID: 'GD17823455',
    requestTime: {
      date: '2025-02-06',
      time: '3 hours ago'
    },
    guestDetails: {
      name: 'David Miller',
      roomNo: '512',
      mobileNumber: '9112345678'
    },
    EmergencyType: 'Security',
    status: 'Resolved',
    assignedTo: 'Employee 6'
  }
];

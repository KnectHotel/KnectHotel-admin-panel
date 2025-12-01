type ComplaintStatusType = 'OPEN' | 'CLOSED';

export type ComplaintDataType = {
  complaintID: string;
  complaintTime: {
    date: string;
    time: string;
  };
  hotelId: string;
  complaintType: string;
  status: ComplaintStatusType;
  assignedTo: string;
};

export const ComplaintData: ComplaintDataType[] = [
  {
    complaintID: 'cd123452',
    complaintTime: {
      date: '10-02-2024',
      time: '1 min ago'
    },
    hotelId: '01953268',
    complaintType: 'Wi-fi access',
    status: 'OPEN',
    assignedTo: 'EMPLOYEE 1'
  },
  {
    complaintID: 'cd123453',
    complaintTime: {
      date: '11-02-2024',
      time: '5 min ago'
    },
    hotelId: '01953269',
    complaintType: 'Room service',
    status: 'OPEN',
    assignedTo: 'EMPLOYEE 2'
  },
  {
    complaintID: 'cd123454',
    complaintTime: {
      date: '11-02-2024',
      time: '15 min ago'
    },
    hotelId: '01953270',
    complaintType: 'Noise issue',
    status: 'CLOSED',
    assignedTo: 'EMPLOYEE 3'
  },
  {
    complaintID: 'cd123455',
    complaintTime: {
      date: '12-02-2024',
      time: '30 min ago'
    },
    hotelId: '01953271',
    complaintType: 'Billing dispute',
    status: 'OPEN',
    assignedTo: 'EMPLOYEE 1'
  },
  {
    complaintID: 'cd123456',
    complaintTime: {
      date: '12-02-2024',
      time: '1 hr ago'
    },
    hotelId: '01953272',
    complaintType: 'AC malfunction',
    status: 'OPEN',
    assignedTo: 'EMPLOYEE 4'
  },
  {
    complaintID: 'cd123457',
    complaintTime: {
      date: '13-02-2024',
      time: '2 hrs ago'
    },
    hotelId: '01953273',
    complaintType: 'Cleanliness',
    status: 'CLOSED',
    assignedTo: 'EMPLOYEE 2'
  },
  {
    complaintID: 'cd123458',
    complaintTime: {
      date: '13-02-2024',
      time: '3 hrs ago'
    },
    hotelId: '01953274',
    complaintType: 'Food quality',
    status: 'OPEN',
    assignedTo: 'EMPLOYEE 5'
  },
  {
    complaintID: 'cd123459',
    complaintTime: {
      date: '14-02-2024',
      time: '4 hrs ago'
    },
    hotelId: '01953275',
    complaintType: 'Staff behavior',
    status: 'OPEN',
    assignedTo: 'EMPLOYEE 1'
  },
  {
    complaintID: 'cd123460',
    complaintTime: {
      date: '14-02-2024',
      time: '6 hrs ago'
    },
    hotelId: '01953276',
    complaintType: 'Lost item',
    status: 'CLOSED',
    assignedTo: 'EMPLOYEE 3'
  },
  {
    complaintID: 'cd123461',
    complaintTime: {
      date: '15-02-2024',
      time: '8 hrs ago'
    },
    hotelId: '01953277',
    complaintType: 'Parking issue',
    status: 'OPEN',
    assignedTo: 'EMPLOYEE 4'
  },
  {
    complaintID: 'cd123462',
    complaintTime: {
      date: '15-02-2024',
      time: '12 hrs ago'
    },
    hotelId: '01953278',
    complaintType: 'Hot water',
    status: 'OPEN',
    assignedTo: 'EMPLOYEE 2'
  }
];
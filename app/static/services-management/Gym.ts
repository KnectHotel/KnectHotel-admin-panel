type RequestTypeType = 'Gym' | 'Conference Hall' | 'Community Hall';

type StatusType = 'Pending' | 'In-Progress' | 'Completed';

// app/static/services-management/Gym.ts

export type GymServiceDataType = {
  _id: string;
  uniqueId: string;
  requestID: string;
  serviceID: string;
  requestDetail: string;
  paymentStatus: string;
  paymentDate: string;
  transaction: string;
  facility: string;
  HotelId: string;
  requestType: string;
  facilityType: 'Gym' | 'ConferenceHall' | 'CommunityHall';
  requestTime: {
    date: string;
    time: string;
  };
  guestDetails: {
    guestID: string;
    roomNo: string;
    phoneNumber: string;
    email: string;
    name: string;
  };
  slot: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    price: number;
    maxCapacity: number;
    currentCapacity: number;
  };
  status: 'pending' | 'completed' | 'in-progress' | string;
  createdAt: string;
  updatedAt: string;
};



// export const GymServiceData: GymServiceDataType[] = [
//   {
//     requestID: 'RQ17823450',
//     requestDetail: 'Need extra towels in the gym.',
//     responseDetail: 'Towels will be delivered shortly.',
//     requestAssignedTo: 'None',
//     requestTime: {
//       date: '2025-02-10',
//       time: '1 min ago'
//     },
//     guestDetails: {
//       guestID: '01953268',
//       name: 'John Doe',
//       roomNo: '501',
//       mobileNumber: '6203770138',
//       email: 'johndoe@gmail.com'
//     },
//     requestType: 'Gym',
//     status: 'Pending',
//     assignedTo: 'Employee 1'
//   },
//   {
//     requestID: 'RQ17823451',
//     requestDetail: 'Requesting audio system setup for a seminar.',
//     responseDetail: 'Technician will set up the audio system.',
//     requestAssignedTo: 'None',
//     requestTime: {
//       date: '2025-02-09',
//       time: '30 mins ago'
//     },
//     guestDetails: {
//       guestID: '01953269',
//       name: 'Alice Smith',
//       roomNo: '302',
//       mobileNumber: '9876543210',
//       email: 'alice.smith@email.com'
//     },
//     requestType: 'Conference Hall',
//     status: 'In-Progress',
//     assignedTo: 'Employee 2'
//   },
//   {
//     requestID: 'RQ17823452',
//     requestDetail: 'AC in the gym is not working.',
//     responseDetail: 'Maintenance team has been notified.',
//     requestAssignedTo: 'None',
//     requestTime: {
//       date: '2025-02-08',
//       time: '1 hour ago'
//     },
//     guestDetails: {
//       guestID: '01953270',
//       name: 'Robert Johnson',
//       roomNo: '205',
//       mobileNumber: '9234567890',
//       email: 'robert.johnson@email.com'
//     },
//     requestType: 'Gym',
//     status: 'Pending',
//     assignedTo: 'Employee 3'
//   },
//   {
//     requestID: 'RQ17823453',
//     requestDetail: 'Need additional chairs for the event.',
//     responseDetail: 'Extra chairs will be arranged soon.',
//     requestAssignedTo: 'None',
//     requestTime: {
//       date: '2025-02-07',
//       time: '10 mins ago'
//     },
//     guestDetails: {
//       guestID: '01953271',
//       name: 'Emma Wilson',
//       roomNo: '104',
//       mobileNumber: '9101112134',
//       email: 'emma.wilson@email.com'
//     },
//     requestType: 'Community Hall',
//     status: 'Completed',
//     assignedTo: 'Employee 4'
//   },
//   {
//     requestID: 'RQ17823454',
//     requestDetail: 'Projector is not functioning properly.',
//     responseDetail: 'Technician will check the projector soon.',
//     requestAssignedTo: 'None',
//     requestTime: {
//       date: '2025-02-06',
//       time: '2 hours ago'
//     },
//     guestDetails: {
//       guestID: '01953272',
//       name: 'Michael Brown',
//       roomNo: '303',
//       mobileNumber: '9001122334',
//       email: 'michael.brown@email.com'
//     },
//     requestType: 'Conference Hall',
//     status: 'Pending',
//     assignedTo: 'Employee 5'
//   },
//   {
//     requestID: 'RQ17823455',
//     requestDetail: 'Need a microphone setup for a wedding ceremony.',
//     responseDetail: 'Microphone setup will be completed shortly.',
//     requestAssignedTo: 'None',
//     requestTime: {
//       date: '2025-02-05',
//       time: '5 mins ago'
//     },
//     guestDetails: {
//       guestID: '01953273',
//       name: 'Sophia Martinez',
//       roomNo: '401',
//       mobileNumber: '9304455667',
//       email: 'sophia.martinez@email.com'
//     },
//     requestType: 'Community Hall',
//     status: 'In-Progress',
//     assignedTo: 'Employee 6'
//   },
//   {
//     requestID: 'RQ17823455',
//     requestDetail: 'Need a microphone setup for a wedding ceremony.',
//     responseDetail: 'Microphone setup will be completed shortly.',
//     requestAssignedTo: 'None',
//     requestTime: {
//       date: '2025-02-05',
//       time: '5 mins ago'
//     },
//     guestDetails: {
//       guestID: '01953273',
//       name: 'Sophia Martinez',
//       roomNo: '401',
//       mobileNumber: '9304455667',
//       email: 'sophia.martinez@email.com'
//     },
//     requestType: 'Community Hall',
//     status: 'In-Progress',
//     assignedTo: 'Employee 6'
//   },
//   {
//     requestID: 'RQ17823455',
//     requestDetail: 'Need a microphone setup for a wedding ceremony.',
//     responseDetail: 'Microphone setup will be completed shortly.',
//     requestAssignedTo: 'None',
//     requestTime: {
//       date: '2025-02-05',
//       time: '5 mins ago'
//     },
//     guestDetails: {
//       guestID: '01953273',
//       name: 'Sophia Martinez',
//       roomNo: '401',
//       mobileNumber: '9304455667',
//       email: 'sophia.martinez@email.com'
//     },
//     requestType: 'Community Hall',
//     status: 'In-Progress',
//     assignedTo: 'Employee 6'
//   },
//   {
//     requestID: 'RQ17823455',
//     requestDetail: 'Need a microphone setup for a wedding ceremony.',
//     responseDetail: 'Microphone setup will be completed shortly.',
//     requestAssignedTo: 'None',
//     requestTime: {
//       date: '2025-02-05',
//       time: '5 mins ago'
//     },
//     guestDetails: {
//       guestID: '01953273',
//       name: 'Sophia Martinez',
//       roomNo: '401',
//       mobileNumber: '9304455667',
//       email: 'sophia.martinez@email.com'
//     },
//     requestType: 'Community Hall',
//     status: 'In-Progress',
//     assignedTo: 'Employee 6'
//   },
//   {
//     requestID: 'RQ17823455',
//     requestDetail: 'Need a microphone setup for a wedding ceremony.',
//     responseDetail: 'Microphone setup will be completed shortly.',
//     requestAssignedTo: 'None',
//     requestTime: {
//       date: '2025-02-05',
//       time: '5 mins ago'
//     },
//     guestDetails: {
//       guestID: '01953273',
//       name: 'Sophia Martinez',
//       roomNo: '401',
//       mobileNumber: '9304455667',
//       email: 'sophia.martinez@email.com'
//     },
//     requestType: 'Community Hall',
//     status: 'In-Progress',
//     assignedTo: 'Employee 6'
//   },
//   {
//     requestID: 'RQ17823455',
//     requestDetail: 'Need a microphone setup for a wedding ceremony.',
//     responseDetail: 'Microphone setup will be completed shortly.',
//     requestAssignedTo: 'None',
//     requestTime: {
//       date: '2025-02-05',
//       time: '5 mins ago'
//     },
//     guestDetails: {
//       guestID: '01953273',
//       name: 'Sophia Martinez',
//       roomNo: '401',
//       mobileNumber: '9304455667',
//       email: 'sophia.martinez@email.com'
//     },
//     requestType: 'Community Hall',
//     status: 'In-Progress',
//     assignedTo: 'Employee 6'
//   },
//   {
//     requestID: 'RQ17823455',
//     requestDetail: 'Need a microphone setup for a wedding ceremony.',
//     responseDetail: 'Microphone setup will be completed shortly.',
//     requestAssignedTo: 'None',
//     requestTime: {
//       date: '2025-02-05',
//       time: '5 mins ago'
//     },
//     guestDetails: {
//       guestID: '01953273',
//       name: 'Sophia Martinez',
//       roomNo: '401',
//       mobileNumber: '9304455667',
//       email: 'sophia.martinez@email.com'
//     },
//     requestType: 'Community Hall',
//     status: 'In-Progress',
//     assignedTo: 'Employee 6'
//   },
//   {
//     requestID: 'RQ17823455',
//     requestDetail: 'Need a microphone setup for a wedding ceremony.',
//     responseDetail: 'Microphone setup will be completed shortly.',
//     requestAssignedTo: 'None',
//     requestTime: {
//       date: '2025-02-05',
//       time: '5 mins ago'
//     },
//     guestDetails: {
//       guestID: '01953273',
//       name: 'Sophia Martinez',
//       roomNo: '401',
//       mobileNumber: '9304455667',
//       email: 'sophia.martinez@email.com'
//     },
//     requestType: 'Community Hall',
//     status: 'In-Progress',
//     assignedTo: 'Employee 6'
//   },
//   {
//     requestID: 'RQ17823455',
//     requestDetail: 'Need a microphone setup for a wedding ceremony.',
//     responseDetail: 'Microphone setup will be completed shortly.',
//     requestAssignedTo: 'None',
//     requestTime: {
//       date: '2025-02-05',
//       time: '5 mins ago'
//     },
//     guestDetails: {
//       guestID: '01953273',
//       name: 'Sophia Martinez',
//       roomNo: '401',
//       mobileNumber: '9304455667',
//       email: 'sophia.martinez@email.com'
//     },
//     requestType: 'Community Hall',
//     status: 'In-Progress',
//     assignedTo: 'Employee 6'
//   },
//   {
//     requestID: 'RQ17823455',
//     requestDetail: 'Need a microphone setup for a wedding ceremony.',
//     responseDetail: 'Microphone setup will be completed shortly.',
//     requestAssignedTo: 'None',
//     requestTime: {
//       date: '2025-02-05',
//       time: '5 mins ago'
//     },
//     guestDetails: {
//       guestID: '01953273',
//       name: 'Sophia Martinez',
//       roomNo: '401',
//       mobileNumber: '9304455667',
//       email: 'sophia.martinez@email.com'
//     },
//     requestType: 'Community Hall',
//     status: 'In-Progress',
//     assignedTo: 'Employee 6'
//   },
//   {
//     requestID: 'RQ17823456',
//     requestDetail: 'Need yoga mats in the gym.',
//     responseDetail: 'Yoga mats will be arranged.',
//     requestAssignedTo: 'None',
//     requestTime: {
//       date: '2025-02-04',
//       time: '1 day ago'
//     },
//     guestDetails: {
//       guestID: '01953274',
//       name: 'David Lee',
//       roomNo: '202',
//       mobileNumber: '9456677889',
//       email: 'david.lee@email.com'
//     },
//     requestType: 'Gym',
//     status: 'Completed',
//     assignedTo: 'Employee 7'
//   }
// ];

// export default GymServiceData;

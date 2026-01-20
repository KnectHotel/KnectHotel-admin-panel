type RequestTypeType = 'Gym' | 'Conference Hall' | 'Community Hall';

type StatusType = 'Pending' | 'In-Progress' | 'Completed';



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








































































































































































































































































































































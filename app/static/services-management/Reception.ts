type RequestTypeType =
  | 'Service'
  | 'Complaint'
  | 'Wake-up call'
  | 'Pre check-in'
  | 'Pre check-out'
  | 'Wake up call schedule'
  | 'Feedback'
  | 'Service feedback';
type StatusType = 'Pending' | 'In-Progress' | 'Completed';

export type ReceptionDataType = {
  _id: string;
  requestID: string;
  orderID: string;
  requestDetail: string;
  responseDetail: string;
  requestAssignedTo: string;
  requestTime: {
    date: string;
    time: string;
  };
  createdAt: {
    date: string;
    time: string;
  };
  updatedAt: {
    date: string;
    time: string;
  };
  guestDetails: {
    name: string;
    roomNo: string;
    email: string;
    phoneNumber?: string; 
  };
  requestType: RequestTypeType;
  serviceType?: string;
  status: StatusType;
  assignedTo: string;
  estimatedTime?: string;
  wakeUpTime?: string;
  paymentStatus?: string;
  HotelId?: string;
};


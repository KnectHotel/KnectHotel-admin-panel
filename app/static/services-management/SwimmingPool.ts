type RequestTypeType = 'Swimming Pool';

type StatusType = 'Pending' | 'In-Progress' | 'Completed';
type rulesAndRegulationsType = {
  operatingHours: string;
  showerBeforeEntry: string;
  properSwimwear: string;
  noRunning: string;
  noDiving: string;
  childrenSupervision: string;
  noFoodAndDrinks: string;
  noGlassItems: string;
  healthPrecautions: string;
  poolCapacity: string;
  usePoolAtOwnRisk: string;
  emergencyAlert: string;
};

export type SwimmingpoolServiceDataType = {
  requestID: string;
  poolID: string;
  requestDetail: string;
  responseDetail: string;
  requestAssignedTo: string;
  requestTime: string;
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
  requestedTimeSlot: string;
  effectiveCost: string;
  paymentMode: string;
  rulesAndRegulations: rulesAndRegulationsType;
};

export const SwimmingpoolServiceData: SwimmingpoolServiceDataType[] = [
  {
    requestID: 'RQ17823451',
    poolID: 'PD17823450',
    requestDetail: 'Request for a swimming instructor.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: '11:00AM-3:00PM',
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'In-Progress',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '11:00am-3:00pm',
    effectiveCost: 'INR 1200/hr. only',
    paymentMode: 'At The time of checkout',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  },
  {
    requestID: 'RQ17823451',
    poolID: 'PD17823450',
    requestDetail: 'Request for a swimming instructor.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: '11:00AM-3:00PM',
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'In-Progress',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '11:00am-3:00pm',
    effectiveCost: 'INR 1200/hr. only',
    paymentMode: 'At The time of checkout',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  },
  {
    requestID: 'RQ17823451',
    poolID: 'PD17823450',
    requestDetail: 'Request for a swimming instructor.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: '11:00AM-3:00PM',
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'In-Progress',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '11:00am-3:00pm',
    effectiveCost: 'INR 1200/hr. only',
    paymentMode: 'At The time of checkout',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  },
  {
    requestID: 'RQ17823451',
    poolID: 'PD17823450',
    requestDetail: 'Request for a swimming instructor.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: '11:00AM-3:00PM',
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'In-Progress',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '11:00am-3:00pm',
    effectiveCost: 'INR 1200/hr. only',
    paymentMode: 'At The time of checkout',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  },
  {
    requestID: 'RQ17823451',
    poolID: 'PD17823450',
    requestDetail: 'Request for a swimming instructor.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: '11:00AM-3:00PM',
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'In-Progress',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '11:00am-3:00pm',
    effectiveCost: 'INR 1200/hr. only',
    paymentMode: 'At The time of checkout',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  },
  {
    requestID: 'RQ17823451',
    poolID: 'PD17823450',
    requestDetail: 'Request for a swimming instructor.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: '11:00AM-3:00PM',
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'In-Progress',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '11:00am-3:00pm',
    effectiveCost: 'INR 1200/hr. only',
    paymentMode: 'At The time of checkout',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  },
  {
    requestID: 'RQ17823451',
    poolID: 'PD17823450',
    requestDetail: 'Request for a swimming instructor.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: '11:00AM-3:00PM',
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'In-Progress',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '11:00am-3:00pm',
    effectiveCost: 'INR 1200/hr. only',
    paymentMode: 'At The time of checkout',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  },
  {
    requestID: 'RQ17823451',
    poolID: 'PD17823450',
    requestDetail: 'Request for a swimming instructor.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: '11:00AM-3:00PM',
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'In-Progress',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '11:00am-3:00pm',
    effectiveCost: 'INR 1200/hr. only',
    paymentMode: 'At The time of checkout',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  },
  {
    requestID: 'RQ17823451',
    poolID: 'PD17823450',
    requestDetail: 'Request for a swimming instructor.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: '11:00AM-3:00PM',
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'In-Progress',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '11:00am-3:00pm',
    effectiveCost: 'INR 1200/hr. only',
    paymentMode: 'At The time of checkout',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  },
  {
    requestID: 'RQ17823451',
    poolID: 'PD17823450',
    requestDetail: 'Request for a swimming instructor.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: '11:00AM-3:00PM',
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'In-Progress',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '11:00am-3:00pm',
    effectiveCost: 'INR 1200/hr. only',
    paymentMode: 'At The time of checkout',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  },
  {
    requestID: 'RQ17823451',
    poolID: 'PD17823450',
    requestDetail: 'Request for a swimming instructor.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: '11:00AM-3:00PM',
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'In-Progress',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '11:00am-3:00pm',
    effectiveCost: 'INR 1200/hr. only',
    paymentMode: 'At The time of checkout',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  },
  {
    requestID: 'RQ17823451',
    poolID: 'PD17823450',
    requestDetail: 'Request for a swimming instructor.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: '11:00AM-3:00PM',
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'In-Progress',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '11:00am-3:00pm',
    effectiveCost: 'INR 1200/hr. only',
    paymentMode: 'At The time of checkout',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  },
  {
    requestID: 'RQ17823451',
    poolID: 'PD17823450',
    requestDetail: 'Request for a swimming instructor.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: '11:00AM-3:00PM',
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'In-Progress',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '11:00am-3:00pm',
    effectiveCost: 'INR 1200/hr. only',
    paymentMode: 'At The time of checkout',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  },
  {
    requestID: 'RQ17823451',
    poolID: 'PD17823450',
    requestDetail: 'Request for a swimming instructor.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: '11:00AM-3:00PM',
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'In-Progress',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '11:00am-3:00pm',
    effectiveCost: 'INR 1200/hr. only',
    paymentMode: 'At The time of checkout',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  },
  {
    requestID: 'RQ17823451',
    poolID: 'PD17823450',
    requestDetail: 'Request for a swimming instructor.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: '11:00AM-3:00PM',
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'In-Progress',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '11:00am-3:00pm',
    effectiveCost: 'INR 1200/hr. only',
    paymentMode: 'At The time of checkout',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  },
  {
    requestID: 'RQ17823451',
    poolID: 'PD17823450',
    requestDetail: 'Request for a swimming instructor.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: '11:00AM-3:00PM',
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'In-Progress',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '11:00am-3:00pm',
    effectiveCost: 'INR 1200/hr. only',
    paymentMode: 'At The time of checkout',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  },
  {
    requestID: 'RQ17823451',
    poolID: 'PD17823450',
    requestDetail: 'Request for a swimming instructor.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: '11:00AM-3:00PM',
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'In-Progress',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '11:00am-3:00pm',
    effectiveCost: 'INR 1200/hr. only',
    paymentMode: 'At The time of checkout',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  },
  {
    requestID: 'RQ17823451',
    poolID: 'PD17823450',
    requestDetail: 'Request for a swimming instructor.',
    responseDetail: 'Scheduled for 3 PM today.',
    requestAssignedTo: 'Employee 2',
    requestTime: '11:00AM-3:00PM',
    guestDetails: {
      guestID: '01953269',
      name: 'Jane Smith',
      roomNo: '305',
      mobileNumber: '7302884521',
      email: 'janesmith@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'In-Progress',
    assignedTo: 'Employee 2',
    requestedTimeSlot: '11:00am-3:00pm',
    effectiveCost: 'INR 1200/hr. only',
    paymentMode: 'At The time of checkout',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  },
  {
    requestID: 'RQ22222222',
    poolID: 'PD17823451',
    requestDetail: 'Poolside relaxation request.',
    responseDetail: 'Lounge chairs arranged by 2 PM.',
    requestAssignedTo: 'Employee 3',
    requestTime: '12:00PM-2:00PM',
    guestDetails: {
      guestID: '01953270',
      name: 'John Doe',
      roomNo: '210',
      mobileNumber: '7302884522',
      email: 'johndoe@gmail.com'
    },
    requestType: 'Swimming Pool',
    status: 'Pending',
    assignedTo: 'Employee 3',
    requestedTimeSlot: '12:00pm-2:00pm',
    effectiveCost: 'INR 800/hr. only',
    paymentMode: 'Online',
    rulesAndRegulations: {
      operatingHours: 'Pool open from 6:00 AM – 10:00 PM.',
      showerBeforeEntry: 'Showering before entering the pool is mandatory.',
      properSwimwear: 'Only proper swimwear is allowed.',
      noRunning: 'Running around the pool area is not allowed.',
      noDiving: 'Diving is strictly prohibited.',
      childrenSupervision: 'Children must be supervised at all times.',
      noFoodAndDrinks: 'No food or drinks allowed in the pool area.',
      noGlassItems: 'Glass items are not allowed near the pool.',
      healthPrecautions:
        'Guests with open wounds or illnesses should not enter.',
      poolCapacity: 'Maximum of 30 guests allowed in the pool at a time.',
      usePoolAtOwnRisk: 'Guests use the pool at their own risk.',
      emergencyAlert: 'Emergency lifeguard available on call.'
    }
  }
];

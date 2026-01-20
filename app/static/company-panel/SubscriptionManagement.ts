export type Subscription = {
  subscriptionID: string;
  planDetails: {
    planName: string;
    planType: 'PAID' | 'CANCELED' | 'EXPIRED' | 'TRIAL';
  };
  planDuration: string;
  planDurationType: string;
  costDetails: {
    planName: string;
    planCost: number;
  };
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'CANCELED';
};

export const subscriptionData: Subscription[] = [
  {
    subscriptionID: 'SD123452',
    planDetails: {
      planName: 'Basic Stay Plan',
      planType: 'PAID'
    },
    planDuration: '6 Months',
    planDurationType: 'Half Yearly',
    costDetails: {
      planName: 'Basic',
      planCost: 1999
    },
    status: 'ACTIVE'
  },
  {
    subscriptionID: 'SD123453', 
    planDetails: {
      planName: 'Basic Stay Plan',
      planType: 'CANCELED'
    },
    planDuration: '6 Months',
    planDurationType: 'Half Yearly',
    costDetails: {
      planName: 'Basic',
      planCost: 1999
    },
    status: 'INACTIVE'
  },
  {
    subscriptionID: 'SD123454', 
    planDetails: {
      planName: 'Basic Stay Plan',
      planType: 'EXPIRED'
    },
    planDuration: '6 Months',
    planDurationType: 'Half Yearly',
    costDetails: {
      planName: 'Basic',
      planCost: 1999
    },
    status: 'EXPIRED'
  },
  {
    subscriptionID: 'SD123455', 
    planDetails: {
      planName: 'Basic Stay Plan',
      planType: 'TRIAL'
    },
    planDuration: '6 Months',
    planDurationType: 'Half Yearly',
    costDetails: {
      planName: 'Basic',
      planCost: 1999
    },
    status: 'CANCELED'
  }
];



type status = 'Active' | 'Inactive' | 'Cancelled' | 'Expired';
export type SubscriptionManagementDummyData = {
  subscriptionID: string;
  planName: string;
  planDuration: string;
  planType: string;
  description: string;
  status: string;
  cost: number;
  paymentType: string;
};

export const SubscriptionManagementDummyData: SubscriptionManagementDummyData[] =
  [
    {
      subscriptionID: 'SD123452',
      planName: 'Basic Stay Plan',
      planDuration: '6 Months',
      planType: 'Half yearly',
      description: 'Plan 1 description',
      status: 'Active',
      cost: 100, 
      paymentType: 'Auto Renewal'
    }
  ];

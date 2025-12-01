import { StaticImageData } from 'next/image';
import img1 from '../../public/assets/payment_management/image1.png';
import img2 from '../../public/assets/payment_management/image2.png';
import img3 from '../../public/assets/payment_management/image3.png';
import img4 from '../../public/assets/payment_management/image4.png';
import img5 from '../../public/assets/payment_management/image5.png';
import img6 from '../../public/assets/payment_management/image6.png';
import pic1 from '../../public/assets/payment_management/pic1.png';
import pic2 from '../../public/assets/payment_management/pic2.png';
import pic3 from '../../public/assets/payment_management/pic3.png';
import pic4 from '../../public/assets/payment_management/pic4.png';
import pic5 from '../../public/assets/payment_management/pic5.png';

// ***************Coupon details data************//
export type CouponsDataType = {
  id?: string;
  title: string;
  subtitle: string;
  image: StaticImageData;
};

export const PercentageCouponsData: CouponsDataType[] = [
  {
    id: '1',
    title: 'Summer Special',
    subtitle: 'Get 20% off on all services',
    image: img1
  },
  {
    id: '2',
    title: 'Summer Special',
    subtitle: 'Get 20% off on all services',
    image: img2
  },
  {
    id: '3',
    title: 'Summer Special',
    subtitle: 'Get 20% off on all services',
    image: img2
  },
  {
    id: '4',
    title: 'Summer Special',
    subtitle: 'Get 20% off on all services',
    image: img2
  },
  {
    id: '5',
    title: 'Summer Special',
    subtitle: 'Get 20% off on all services',
    image: img2
  },
  {
    id: '6',
    title: 'Summer Special',
    subtitle: 'Get 20% off on all services',
    image: img2
  },
  {
    id: '7',
    title: 'Summer Special',
    subtitle: 'Get 20% off on all services',
    image: img2
  },
  {
    id: '8',
    title: 'Summer Special',
    subtitle: 'Get 20% off on all services',
    image: img2
  },
  {
    id: '9',
    title: 'Summer Special',
    subtitle: 'Get 20% off on all services',
    image: img2
  },
  {
    id: '10',
    title: 'Summer Special',
    subtitle: 'Get 20% off on all services',
    image: img2
  },
  {
    id: '11',
    title: 'Summer Special',
    subtitle: 'Get 20% off on all services',
    image: img3
  },
  {
    id: '12',
    title: 'Summer Special',
    subtitle: 'Get 20% off on all services',
    image: img4
  },
  {
    id: '13',
    title: 'Summer Special',
    subtitle: 'Get 20% off on all services',
    image: img5
  },
  {
    id: '14',
    title: 'Summer Special',
    subtitle: 'Get 20% off on all services',
    image: img2
  }
];

export const FixedAmountCouponsData: CouponsDataType[] = [
  {
    title: 'Up to 1000 off',
    subtitle: 'cashback on first payment ',
    image: pic1
  },
  {
    title: 'Up to 1000 off',
    subtitle: 'cashback on first payment ',
    image: pic2
  },
  {
    title: 'Up to 1000 off',
    subtitle: 'cashback on first payment ',
    image: pic3
  },
  {
    title: 'Up to 1000 off',
    subtitle: 'cashback on first payment ',
    image: pic4
  },
  {
    title: 'Up to 1000 off',
    subtitle: 'cashback on first payment ',
    image: pic5
  }
];

// *************Refund details data**************//
type StatusType = 'REJECTED' | 'IN-PROGRESS' | 'COMPLETED' | 'INITIATED';
export type RefundDataType = {
  refundID: string;
  userID: string;
  orderID: string;
  hotelDetails: {
    hotelID: string;
    hotelName: string;
  };
  amount: string;
  statusDetails: {
    status: StatusType;
    processedAt: string;
  };
};

export const RefundData: RefundDataType[] = [
  {
    refundID: 'AD123452',
    userID: 'UI8623416',
    orderID: 'OI7356852',
    hotelDetails: {
      hotelID: 'HD2345618',
      hotelName: 'Namaste Village'
    },
    amount: 'INR1000',
    statusDetails: {
      status: 'REJECTED',
      processedAt: 'Processed at : 10:00AM'
    }
  },
  {
    refundID: 'AD123452',
    userID: 'UI8623416',
    orderID: 'OI7356852',
    hotelDetails: {
      hotelID: 'HD2345618',
      hotelName: 'Namaste Village'
    },
    amount: 'INR1000',
    statusDetails: {
      status: 'REJECTED',
      processedAt: 'Processed at : 10:00AM'
    }
  },
  {
    refundID: 'AD123452',
    userID: 'UI8623416',
    orderID: 'OI7356852',
    hotelDetails: {
      hotelID: 'HD2345618',
      hotelName: 'Namaste Village'
    },
    amount: 'INR1000',
    statusDetails: {
      status: 'REJECTED',
      processedAt: 'Processed at : 10:00AM'
    }
  },
  {
    refundID: 'AD123452',
    userID: 'UI8623416',
    orderID: 'OI7356852',
    hotelDetails: {
      hotelID: 'HD2345618',
      hotelName: 'Namaste Village'
    },
    amount: 'INR1000',
    statusDetails: {
      status: 'REJECTED',
      processedAt: 'Processed at : 10:00AM'
    }
  },
  {
    refundID: 'AD123452',
    userID: 'UI8623416',
    orderID: 'OI7356852',
    hotelDetails: {
      hotelID: 'HD2345618',
      hotelName: 'Namaste Village'
    },
    amount: 'INR1000',
    statusDetails: {
      status: 'REJECTED',
      processedAt: 'Processed at : 10:00AM'
    }
  },
  {
    refundID: 'AD123452',
    userID: 'UI8623416',
    orderID: 'OI7356852',
    hotelDetails: {
      hotelID: 'HD2345618',
      hotelName: 'Namaste Village'
    },
    amount: 'INR1000',
    statusDetails: {
      status: 'REJECTED',
      processedAt: 'Processed at : 10:00AM'
    }
  },
  {
    refundID: 'AD123452',
    userID: 'UI8623416',
    orderID: 'OI7356852',
    hotelDetails: {
      hotelID: 'HD2345618',
      hotelName: 'Namaste Village'
    },
    amount: 'INR1000',
    statusDetails: {
      status: 'REJECTED',
      processedAt: 'Processed at : 10:00AM'
    }
  },
  {
    refundID: 'AD123452',
    userID: 'UI8623416',
    orderID: 'OI7356852',
    hotelDetails: {
      hotelID: 'HD2345618',
      hotelName: 'Namaste Village'
    },
    amount: 'INR1000',
    statusDetails: {
      status: 'REJECTED',
      processedAt: 'Processed at : 10:00AM'
    }
  },
  {
    refundID: 'AD123452',
    userID: 'UI8623416',
    orderID: 'OI7356852',
    hotelDetails: {
      hotelID: 'HD2345618',
      hotelName: 'Namaste Village'
    },
    amount: 'INR1000',
    statusDetails: {
      status: 'REJECTED',
      processedAt: 'Processed at : 10:00AM'
    }
  },
  {
    refundID: 'AD123452',
    userID: 'UI8623416',
    orderID: 'OI7356852',
    hotelDetails: {
      hotelID: 'HD2345618',
      hotelName: 'Namaste Village'
    },
    amount: 'INR1000',
    statusDetails: {
      status: 'REJECTED',
      processedAt: 'Processed at : 10:00AM'
    }
  },
  {
    refundID: 'AD123452',
    userID: 'UI8623416',
    orderID: 'OI7356852',
    hotelDetails: {
      hotelID: 'HD2345618',
      hotelName: 'Namaste Village'
    },
    amount: 'INR1000',
    statusDetails: {
      status: 'REJECTED',
      processedAt: 'Processed at : 10:00AM'
    }
  },
  {
    refundID: 'AD123452',
    userID: 'UI8623416',
    orderID: 'OI7356852',
    hotelDetails: {
      hotelID: 'HD2345618',
      hotelName: 'Namaste Village'
    },
    amount: 'INR1000',
    statusDetails: {
      status: 'REJECTED',
      processedAt: 'Processed at : 10:00AM'
    }
  }
];

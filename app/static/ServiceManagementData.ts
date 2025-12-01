import { StaticImageData } from 'next/image';
import img1 from '../../public/assets/service_management_page_images/reception.svg';
import img2 from '../../public/assets/service_management_page_images/housekeeping.svg';
import img3 from '../../public/assets/service_management_page_images/inroomdining.svg';
import img4 from '../../public/assets/service_management_page_images/gym.svg';
import img5 from '../../public/assets/service_management_page_images/spa.svg';
import img6 from '../../public/assets/service_management_page_images/swimmingpool.svg';
import img7 from '../../public/assets/service_management_page_images/conciergeservice.svg';
import img8 from '../../public/assets/service_management_page_images/inroomcontrol.svg';
import img9 from '../../public/assets/service_management_page_images/ordermanagement.svg';
import img10 from '../../public/assets/service_management_page_images/sos.svg';
import img11 from '../../public/assets/service_management_page_images/chat.svg';

//************************Service management home page dummy data
export type ServiceManagementHomePageDataType = {
  id: number;
  name: string;
  displayName: string;
  imgSrc: StaticImageData;
  href: string;
};

export const serviceManagementHomePageData: ServiceManagementHomePageDataType[] =
  [
    {
    id: 1,
    name: 'reception',
    displayName: 'Reception',
    imgSrc: img1,
    href: '/hotel-panel/service-management/reception',
  },
  {
    id: 2,
    name: 'housekeeping',
    displayName: 'Housekeeping',
    imgSrc: img2,
    href: '/hotel-panel/service-management/housekeeping',
  },
  {
    id: 3,
    name: 'inroomdining',
    displayName: 'In-Room Dining',
    imgSrc: img3,
    href: '/hotel-panel/service-management/inroomdining',
  },
  {
    id: 4,
    name: 'gym',
    displayName: 'Gym / Community / Conference Hall',
    imgSrc: img4,
    href: '/hotel-panel/service-management/gym',
  },
  {
    id: 5,
    name: 'spa',
    displayName: 'Spa/Salon',
    imgSrc: img5,
    href: '/hotel-panel/service-management/spa',
  },
  {
    id: 6,
    name: 'swimmingpool',
    displayName: 'Swimming Pool',
    imgSrc: img6,
    href: '/hotel-panel/service-management/swimmingpool',
  },
  {
    id: 7,
    name: 'conciergeservice',
    displayName: 'Concierge Service',
    imgSrc: img7,
    href: '/hotel-panel/service-management/conciergeservice',
  },
  {
    id: 8,
    name: 'in_room_control',
    displayName: 'In-room Control',
    imgSrc: img8,
    href: '/hotel-panel/service-management/in_room_control',
  },
  {
    id: 9,
    name: 'ordermanagement',
    displayName: 'Order Management',
    imgSrc: img9,
    href: '/hotel-panel/service-management/ordermanagement',
  },
  {
    id: 10,
    name: 'sos',
    displayName: 'SOS MANAGEMENT',
    imgSrc: img10,
    href: '/hotel-panel/service-management/sosmanagement',
  },
  {
    id: 11,
    name: 'chat',
    displayName: 'CHAT WITH STAFF',
    imgSrc: img11,
    href: '/hotel-panel/service-management/chatwithstaff',
  },
  ];

//************************Notification details dummy data
type StatusType = 'Received' | 'Sent';
type NotificationType = 'Email';

export type NotificationsDataType = {
  notificationID: string;
  dateAndTime: {
    date: string;
    time: string;
  };
  guestDetails: {
    name: string;
    phoneNo: string;
    roomNo: string;
  };
  notificationType: NotificationType;
  Status: StatusType;
};

export const notificationsData: NotificationsDataType[] = [
  {
    notificationID: 'ND17823450',
    dateAndTime: {
      date: '2025-02-10',
      time: '1 min ago'
    },
    guestDetails: {
      name: 'Mr. Timothy Chalamate',
      phoneNo: '123-456-7890',
      roomNo: '501'
    },
    notificationType: 'Email',
    Status: 'Received'
  },
  {
    notificationID: 'ND27893412',
    dateAndTime: {
      date: '2025-02-11',
      time: '5 mins ago'
    },
    guestDetails: {
      name: 'Ms. Emily Watson',
      phoneNo: '234-567-8901',
      roomNo: '302'
    },
    notificationType: 'Email',
    Status: 'Sent'
  },
  {
    notificationID: 'ND27893412',
    dateAndTime: {
      date: '2025-02-11',
      time: '5 mins ago'
    },
    guestDetails: {
      name: 'Ms. Emily Watson',
      phoneNo: '234-567-8901',
      roomNo: '302'
    },
    notificationType: 'Email',
    Status: 'Sent'
  },
  {
    notificationID: 'ND27893412',
    dateAndTime: {
      date: '2025-02-11',
      time: '5 mins ago'
    },
    guestDetails: {
      name: 'Ms. Emily Watson',
      phoneNo: '234-567-8901',
      roomNo: '302'
    },
    notificationType: 'Email',
    Status: 'Sent'
  },
  {
    notificationID: 'ND27893412',
    dateAndTime: {
      date: '2025-02-11',
      time: '5 mins ago'
    },
    guestDetails: {
      name: 'Ms. Emily Watson',
      phoneNo: '234-567-8901',
      roomNo: '302'
    },
    notificationType: 'Email',
    Status: 'Sent'
  },
  {
    notificationID: 'ND27893412',
    dateAndTime: {
      date: '2025-02-11',
      time: '5 mins ago'
    },
    guestDetails: {
      name: 'Ms. Emily Watson',
      phoneNo: '234-567-8901',
      roomNo: '302'
    },
    notificationType: 'Email',
    Status: 'Sent'
  },
  {
    notificationID: 'ND34567123',
    dateAndTime: {
      date: '2025-02-12',
      time: '15 mins ago'
    },
    guestDetails: {
      name: 'Dr. James Carter',
      phoneNo: '345-678-9012',
      roomNo: '405'
    },
    notificationType: 'Email',
    Status: 'Received'
  },
  {
    notificationID: 'ND45678934',
    dateAndTime: {
      date: '2025-02-13',
      time: '30 mins ago'
    },
    guestDetails: {
      name: 'Mrs. Olivia Bennett',
      phoneNo: '456-789-0123',
      roomNo: '608'
    },
    notificationType: 'Email',
    Status: 'Sent'
  },
  {
    notificationID: 'ND56789045',
    dateAndTime: {
      date: '2025-02-14',
      time: '45 mins ago'
    },
    guestDetails: {
      name: 'Mr. Liam Harper',
      phoneNo: '567-890-1234',
      roomNo: '210'
    },
    notificationType: 'Email',
    Status: 'Received'
  },
  {
    notificationID: 'ND67890156',
    dateAndTime: {
      date: '2025-02-15',
      time: '1 hour ago'
    },
    guestDetails: {
      name: 'Ms. Sophia Nguyen',
      phoneNo: '678-901-2345',
      roomNo: '715'
    },
    notificationType: 'Email',
    Status: 'Sent'
  },
  {
    notificationID: 'ND78901267',
    dateAndTime: {
      date: '2025-02-16',
      time: '2 hours ago'
    },
    guestDetails: {
      name: 'Mr. Ethan Brooks',
      phoneNo: '789-012-3456',
      roomNo: '103'
    },
    notificationType: 'Email',
    Status: 'Received'
  },
  {
    notificationID: 'ND89012378',
    dateAndTime: {
      date: '2025-02-17',
      time: '10 mins ago'
    },
    guestDetails: {
      name: 'Mrs. Ava Patel',
      phoneNo: '890-123-4567',
      roomNo: '312'
    },
    notificationType: 'Email',
    Status: 'Sent'
  },
  {
    notificationID: 'ND90123489',
    dateAndTime: {
      date: '2025-02-18',
      time: '25 mins ago'
    },
    guestDetails: {
      name: 'Mr. Noah Sullivan',
      phoneNo: '901-234-5678',
      roomNo: '419'
    },
    notificationType: 'Email',
    Status: 'Received'
  },
  {
    notificationID: 'ND01234590',
    dateAndTime: {
      date: '2025-02-19',
      time: '3 hours ago'
    },
    guestDetails: {
      name: 'Ms. Isabella Gomez',
      phoneNo: '012-345-6789',
      roomNo: '622'
    },
    notificationType: 'Email',
    Status: 'Sent'
  }
];

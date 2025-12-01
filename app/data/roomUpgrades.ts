export const dummyRoomTypes = [
  'Standard',
  'Deluxe',
  'Suite',
  'Presidential Suite'
];

export const dummyRoomUpgrades = [
  {
    hotelId: 'hotel101',
    roomType: 'Deluxe',
    upgradeName: 'Lake View Balcony',
    price: 1500,
    description: 'Balcony overlooking the lake.',
    amenities: ['Balcony', 'Soft lighting', 'Premium bed'],
    status: 'Active'
  },
  {
    hotelId: 'hotel102',
    roomType: 'Suite',
    upgradeName: 'Private Lounge Access',
    price: 2500,
    description: 'Exclusive lounge with refreshments.',
    amenities: ['Snacks', 'Drinks', 'Concierge'],
    status: 'Inactive'
  }
];

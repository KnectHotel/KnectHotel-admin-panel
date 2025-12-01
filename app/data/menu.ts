// app/data/menu.ts

export const dummyCategories = [
  'Breakfast',
  'Snacks',
  'Main Course',
  'Dessert',
  'Drinks'
];

export const dummyMenuItems = [
  {
    hotelId: 'hotel101',
    category: 'Dessert',
    name: 'Choco Lava Cake',
    unitPrice: 180,
    discountPrice: 150,
    status: 'Active',
    description: 'Warm chocolate cake with molten center.',
    image: '/images/lava.jpg'
  },
  {
    hotelId: 'hotel101',
    category: 'Breakfast',
    name: 'Masala Omelette',
    unitPrice: 120,
    discountPrice: 100,
    status: 'Active',
    description: '2-egg masala omelette served with toast.',
    image: '/images/omelette.jpg'
  },
  {
    hotelId: 'hotel102',
    category: 'Main Course',
    name: 'Paneer Butter Masala',
    unitPrice: 260,
    discountPrice: 220,
    status: 'Active',
    description: 'Creamy tomato-based gravy with paneer cubes.',
    image: '/images/pbm.jpg'
  },
  {
    hotelId: 'hotel102',
    category: 'Drinks',
    name: 'Virgin Mojito',
    unitPrice: 140,
    discountPrice: 120,
    status: 'Inactive',
    description: 'Mint, lime & soda. Refreshing and cool.',
    image: '/images/mojito.jpg'
  },
  {
    hotelId: 'hotel103',
    category: 'Snacks',
    name: 'French Fries',
    unitPrice: 110,
    discountPrice: 90,
    status: 'Active',
    description: 'Crispy salted fries served hot.',
    image: '/images/fries.jpg'
  }
];

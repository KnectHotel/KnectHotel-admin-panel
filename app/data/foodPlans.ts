// app/data/foodPlans.ts

export const dummyHotels = [
  {
    _id: 'hotel101',
    name: 'Grand Palace Hotel'
  },
  {
    _id: 'hotel102',
    name: 'Ocean View Resort'
  },
  {
    _id: 'hotel103',
    name: 'City Center Inn'
  }
];

export const dummyFoodPlans = [
  {
    _id: 'plan01',
    planName: 'Breakfast Buffet',
    price: 250,
    meals: ['Breakfast'],
    hotelId: 'hotel101',
    status: 'active'
  },
  {
    _id: 'plan02',
    planName: 'Full Day Meal',
    price: 600,
    meals: ['Breakfast', 'Lunch', 'Dinner'],
    hotelId: 'hotel102',
    status: 'inactive'
  }
];

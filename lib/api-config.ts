export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Site Settings Endpoints
export const ENDPOINTS = {
  BLOGS: '/api/blogs',
  COLLABORATIONS: '/api/collaborations',
  COMPANY_SECTION: '/api/company-section',
  FAQS: '/api/faqs',
  MILESTONE: '/api/milestone',
  NEWS: '/api/news',
  PRODUCT_VIDEOS: '/api/product-videos',
  REVIEWS: '/api/reviews',
  UPDATES: '/api/updates'
} as const;

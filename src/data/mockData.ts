import { FoodItem, Order } from '@/types';

export const categories = ['All', 'Pizza', 'Burger', 'Sandwich'];

export const initialFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Hamburger',
    category: 'Burger',
    price: '$2.50',
    numericPrice: 2.50,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
    description: 'Juicy 100% prime beef patty, melted cheddar cheese, fresh lettuce, and savory secret house dressing in a warm toasted sesame seed bun.',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    category: 'Pizza',
    price: '$8.99',
    numericPrice: 8.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
    description: 'Crispy stone-baked crust topped with rich San Marzano tomato sauce, double mozzarella, and authentic cured Italian pepperoni.',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Club Sandwich',
    category: 'Sandwich',
    price: '$4.50',
    numericPrice: 4.50,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500',
    description: 'Classic triple-layered toasted sourdough packed with roasted sliced chicken, crispy smoked bacon, crisp romaine, and herb mayonnaise.',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Cheeseburger Supreme',
    category: 'Burger',
    price: '$3.75',
    numericPrice: 3.75,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500',
    description: 'Double grilled beef patties covered in double American cheddar, sweet caramelized onions, and crunchy pickles.',
    rating: 4.9,
  },
  {
    id: '5',
    name: 'Margherita Classic',
    category: 'Pizza',
    price: '$7.50',
    numericPrice: 7.50,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500',
    description: 'Fresh fior di latte mozzarella, whole leaf sweet basil, sea salt, and extra virgin olive oil on hand-stretched napoli dough.',
    rating: 4.6,
  },
  {
    id: '6',
    name: 'Grilled Chicken Sub',
    category: 'Sandwich',
    price: '$5.25',
    numericPrice: 5.25,
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=500',
    description: 'Marinated and chargrilled chicken tenders, melted provolone cheese, baby spinach, and sweet honey mustard on artisan baguette.',
    rating: 4.8,
  },
];

export const bannerImages = [
  'https://i.postimg.cc/BQT9cZ0F/Image.jpg',
  'https://i.postimg.cc/SN6F7QhM/Image-1.jpg',
  'https://i.postimg.cc/9Fd5tXhF/Image-2.jpg',
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-1024',
    date: 'Sep 2, 2026',
    status: 'In Transit',
    total: '$11.49',
    items: '1x Hamburger, 1x Pepperoni Pizza',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
  },
  {
    id: 'ORD-1019',
    date: 'Aug 28, 2026',
    status: 'Delivered',
    total: '$8.99',
    items: '1x Pepperoni Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
  },
];

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const sampleProducts = [
  {
    name: 'Silk Charmeuse Midi Dress',
    slug: 'silk-charmeuse-midi-dress',
    description: 'Luxurious silk charmeuse dress with a fluid silhouette. Features adjustable spaghetti straps and a flattering cowl neckline. Perfect for evening occasions or elevated everyday wear.',
    price: 485,
    compareAtPrice: 650,
    category: 'dresses',
    subcategory: 'midi',
    images: [
      { url: '/images/products/dress-1-1.jpg', alt: 'Silk charmeuse midi dress front view' },
      { url: '/images/products/dress-1-2.jpg', alt: 'Silk charmeuse midi dress back view' }
    ],
    sizes: [
      { size: 'XS', inStock: true, quantity: 8 },
      { size: 'S', inStock: true, quantity: 12 },
      { size: 'M', inStock: true, quantity: 15 },
      { size: 'L', inStock: true, quantity: 10 }
    ],
    colors: [
      { name: 'Ivory', hex: '#FCF9F6' },
      { name: 'Dusty Rose', hex: '#D6B7B0' }
    ],
    materials: ['100% Silk Charmeuse'],
    careInstructions: 'Dry clean only',
    featured: true,
    bestseller: true,
    inStock: true,
    tags: ['silk', 'dress', 'evening', 'luxury'],
    details: [
      'Adjustable spaghetti straps',
      'Cowl neckline',
      'Midi length',
      'Dry clean only',
      'Made in Italy'
    ]
  },
  {
    name: 'Cashmere Turtleneck Sweater',
    slug: 'cashmere-turtleneck-sweater',
    description: 'Timeless cashmere turtleneck in ultra-soft Italian yarn. Classic silhouette with a relaxed fit. An investment piece that will last for years.',
    price: 395,
    category: 'tops',
    subcategory: 'sweaters',
    images: [
      { url: '/images/products/sweater-1-1.jpg', alt: 'Cashmere turtleneck front view' },
      { url: '/images/products/sweater-1-2.jpg', alt: 'Cashmere turtleneck detail' }
    ],
    sizes: [
      { size: 'XS', inStock: true, quantity: 5 },
      { size: 'S', inStock: true, quantity: 8 },
      { size: 'M', inStock: true, quantity: 12 },
      { size: 'L', inStock: true, quantity: 7 },
      { size: 'XL', inStock: true, quantity: 3 }
    ],
    colors: [
      { name: 'Warm Taupe', hex: '#B9AFA4' },
      { name: 'Deep Taupe', hex: '#6B655F' },
      { name: 'Ivory', hex: '#FCF9F6' }
    ],
    materials: ['100% Italian Cashmere'],
    careInstructions: 'Hand wash cold or dry clean',
    newArrival: true,
    bestseller: true,
    inStock: true,
    tags: ['cashmere', 'sweater', 'luxury', 'basics'],
    details: [
      'Turtleneck',
      'Relaxed fit',
      'Ribbed cuffs and hem',
      'Made in Italy'
    ]
  },
  {
    name: 'Wide-Leg Tailored Trousers',
    slug: 'wide-leg-tailored-trousers',
    description: 'Impeccably tailored wide-leg trousers in luxe wool blend. High-waisted with front pleats and a flattering wide-leg silhouette. Perfect for the office or evening.',
    price: 325,
    category: 'bottoms',
    subcategory: 'trousers',
    images: [
      { url: '/images/products/trousers-1-1.jpg', alt: 'Wide-leg trousers front view' },
      { url: '/images/products/trousers-1-2.jpg', alt: 'Wide-leg trousers detail' }
    ],
    sizes: [
      { size: 'XS', inStock: true, quantity: 6 },
      { size: 'S', inStock: true, quantity: 10 },
      { size: 'M', inStock: true, quantity: 14 },
      { size: 'L', inStock: true, quantity: 8 },
      { size: 'XL', inStock: false, quantity: 0 }
    ],
    colors: [
      { name: 'Deep Taupe', hex: '#6B655F' },
      { name: 'Ivory', hex: '#FCF9F6' }
    ],
    materials: ['80% Wool', '20% Polyester'],
    careInstructions: 'Dry clean only',
    featured: true,
    inStock: true,
    tags: ['trousers', 'tailored', 'wool'],
    details: [
      'High-waisted',
      'Front pleats',
      'Side pockets',
      'Back welt pockets',
      'Made in Portugal'
    ]
  },
  {
    name: 'Double-Breasted Wool Coat',
    slug: 'double-breasted-wool-coat',
    description: 'Statement wool coat with timeless double-breasted silhouette. Crafted from premium Italian wool with satin lining. A wardrobe essential.',
    price: 895,
    category: 'outerwear',
    subcategory: 'coats',
    images: [
      { url: '/images/products/coat-1-1.jpg', alt: 'Double-breasted wool coat front' },
      { url: '/images/products/coat-1-2.jpg', alt: 'Double-breasted wool coat back' }
    ],
    sizes: [
      { size: 'XS', inStock: true, quantity: 4 },
      { size: 'S', inStock: true, quantity: 6 },
      { size: 'M', inStock: true, quantity: 8 },
      { size: 'L', inStock: true, quantity: 5 }
    ],
    colors: [
      { name: 'Deep Taupe', hex: '#6B655F' },
      { name: 'Warm Taupe', hex: '#B9AFA4' }
    ],
    materials: ['90% Wool', '10% Cashmere'],
    careInstructions: 'Dry clean only',
    featured: true,
    newArrival: true,
    inStock: true,
    tags: ['coat', 'wool', 'outerwear', 'winter'],
    details: [
      'Double-breasted',
      'Notched lapel',
      'Side pockets',
      'Satin lining',
      'Made in Italy'
    ]
  },
  {
    name: 'Leather Crossbody Bag',
    slug: 'leather-crossbody-bag',
    description: 'Minimalist leather crossbody in buttery soft Italian leather. Perfectly sized for essentials with adjustable strap. Timeless design.',
    price: 495,
    category: 'bags',
    images: [
      { url: '/images/products/bag-1-1.jpg', alt: 'Leather crossbody bag' },
      { url: '/images/products/bag-1-2.jpg', alt: 'Leather crossbody bag detail' }
    ],
    sizes: [
      { size: 'M', inStock: true, quantity: 20 }
    ],
    colors: [
      { name: 'Deep Taupe', hex: '#6B655F' },
      { name: 'Gold', hex: '#C8A97E' }
    ],
    materials: ['100% Italian Leather'],
    careInstructions: 'Clean with leather cleaner',
    bestseller: true,
    inStock: true,
    tags: ['bag', 'leather', 'crossbody', 'accessories'],
    details: [
      'Adjustable strap',
      'Interior zip pocket',
      'Magnetic closure',
      'Gold hardware',
      'Made in Italy'
    ]
  },
  {
    name: 'Linen Blend Shirt',
    slug: 'linen-blend-shirt',
    description: 'Effortlessly chic linen blend shirt with relaxed fit. Perfect for layering or wearing alone. A summer wardrobe essential.',
    price: 245,
    category: 'tops',
    subcategory: 'shirts',
    images: [
      { url: '/images/products/shirt-1-1.jpg', alt: 'Linen blend shirt front' },
      { url: '/images/products/shirt-1-2.jpg', alt: 'Linen blend shirt back' }
    ],
    sizes: [
      { size: 'XS', inStock: true, quantity: 10 },
      { size: 'S', inStock: true, quantity: 15 },
      { size: 'M', inStock: true, quantity: 18 },
      { size: 'L', inStock: true, quantity: 12 },
      { size: 'XL', inStock: true, quantity: 8 }
    ],
    colors: [
      { name: 'Ivory', hex: '#FCF9F6' },
      { name: 'Warm Taupe', hex: '#B9AFA4' }
    ],
    materials: ['70% Linen', '30% Cotton'],
    careInstructions: 'Machine wash cold',
    newArrival: true,
    inStock: true,
    tags: ['shirt', 'linen', 'summer', 'casual'],
    details: [
      'Relaxed fit',
      'Button front',
      'Chest pocket',
      'Machine washable',
      'Made in Portugal'
    ]
  },
  {
    name: 'Silk Slip Skirt',
    slug: 'silk-slip-skirt',
    description: 'Elegant silk slip skirt with bias cut for beautiful drape. Features elastic waistband for comfort. Pairs beautifully with both casual and dressy tops.',
    price: 385,
    category: 'bottoms',
    subcategory: 'skirts',
    images: [
      { url: '/images/products/skirt-1-1.jpg', alt: 'Silk slip skirt front' },
      { url: '/images/products/skirt-1-2.jpg', alt: 'Silk slip skirt detail' }
    ],
    sizes: [
      { size: 'XS', inStock: true, quantity: 7 },
      { size: 'S', inStock: true, quantity: 11 },
      { size: 'M', inStock: true, quantity: 13 },
      { size: 'L', inStock: true, quantity: 9 }
    ],
    colors: [
      { name: 'Dusty Rose', hex: '#D6B7B0' },
      { name: 'Ivory', hex: '#FCF9F6' },
      { name: 'Deep Taupe', hex: '#6B655F' }
    ],
    materials: ['100% Silk'],
    careInstructions: 'Dry clean only',
    featured: true,
    inStock: true,
    tags: ['skirt', 'silk', 'elegant', 'midi'],
    details: [
      'Bias cut',
      'Elastic waistband',
      'Midi length',
      'Dry clean only',
      'Made in Italy'
    ]
  },
  {
    name: 'Leather Ankle Boots',
    slug: 'leather-ankle-boots',
    description: 'Classic leather ankle boots with subtle block heel. Versatile design pairs with everything from jeans to dresses. Investment footwear.',
    price: 595,
    category: 'shoes',
    subcategory: 'boots',
    images: [
      { url: '/images/products/boots-1-1.jpg', alt: 'Leather ankle boots' },
      { url: '/images/products/boots-1-2.jpg', alt: 'Leather ankle boots detail' }
    ],
    sizes: [
      { size: 'S', inStock: true, quantity: 6 },
      { size: 'M', inStock: true, quantity: 10 },
      { size: 'L', inStock: true, quantity: 8 }
    ],
    colors: [
      { name: 'Deep Taupe', hex: '#6B655F' },
      { name: 'Gold', hex: '#C8A97E' }
    ],
    materials: ['100% Leather'],
    careInstructions: 'Clean with leather cleaner',
    bestseller: true,
    inStock: true,
    tags: ['boots', 'leather', 'shoes', 'ankle'],
    details: [
      'Block heel',
      'Side zipper',
      'Leather sole',
      'Made in Italy'
    ]
  },
  {
    name: 'Cashmere Wrap Scarf',
    slug: 'cashmere-wrap-scarf',
    description: 'Oversized cashmere wrap scarf in luxuriously soft yarn. Can be worn as a scarf or light wrap. The perfect finishing touch.',
    price: 295,
    category: 'accessories',
    images: [
      { url: '/images/products/scarf-1-1.jpg', alt: 'Cashmere wrap scarf' },
      { url: '/images/products/scarf-1-2.jpg', alt: 'Cashmere wrap scarf detail' }
    ],
    sizes: [
      { size: 'M', inStock: true, quantity: 25 }
    ],
    colors: [
      { name: 'Warm Taupe', hex: '#B9AFA4' },
      { name: 'Ivory', hex: '#FCF9F6' },
      { name: 'Dusty Rose', hex: '#D6B7B0' }
    ],
    materials: ['100% Cashmere'],
    careInstructions: 'Hand wash cold or dry clean',
    newArrival: true,
    inStock: true,
    tags: ['scarf', 'cashmere', 'accessories', 'wrap'],
    details: [
      'Oversized',
      'Frayed edges',
      'Made in Scotland'
    ]
  },
  {
    name: 'Tailored Blazer',
    slug: 'tailored-blazer',
    description: 'Perfectly tailored blazer in luxe wool blend. Features single-button closure and structured shoulders. A wardrobe cornerstone.',
    price: 695,
    category: 'outerwear',
    subcategory: 'blazers',
    images: [
      { url: '/images/products/blazer-1-1.jpg', alt: 'Tailored blazer front' },
      { url: '/images/products/blazer-1-2.jpg', alt: 'Tailored blazer detail' }
    ],
    sizes: [
      { size: 'XS', inStock: true, quantity: 5 },
      { size: 'S', inStock: true, quantity: 9 },
      { size: 'M', inStock: true, quantity: 11 },
      { size: 'L', inStock: true, quantity: 7 },
      { size: 'XL', inStock: true, quantity: 4 }
    ],
    colors: [
      { name: 'Deep Taupe', hex: '#6B655F' },
      { name: 'Ivory', hex: '#FCF9F6' }
    ],
    materials: ['85% Wool', '15% Polyester'],
    careInstructions: 'Dry clean only',
    featured: true,
    bestseller: true,
    inStock: true,
    tags: ['blazer', 'tailored', 'wool', 'workwear'],
    details: [
      'Single-button closure',
      'Notched lapel',
      'Front pockets',
      'Fully lined',
      'Made in Italy'
    ]
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    console.log('📦 Cleared existing data');

    // Insert products
    await Product.insertMany(sampleProducts);
    console.log('✅ Added 10 sample products');

    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@maisonfernanda.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Created admin user');
    console.log('   Email: admin@maisonfernanda.com');
    console.log('   Password: admin123');

    // Create sample customer
    const customer = await User.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'customer@example.com',
      password: 'customer123',
      role: 'customer'
    });

    console.log('✅ Created sample customer');
    console.log('   Email: customer@example.com');
    console.log('   Password: customer123');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();


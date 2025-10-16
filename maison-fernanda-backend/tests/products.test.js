const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Product = require('../models/Product');

describe('Product API Endpoints', () => {
  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maison-fernanda-test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany();
  });

  describe('GET /api/products', () => {
    it('should return all products with pagination', async () => {
      // Create test products
      await Product.create([
        {
          name: 'Test Dress',
          slug: 'test-dress',
          description: 'A beautiful test dress',
          price: 299,
          category: 'dresses',
          images: [{ url: '/test.jpg', alt: 'Test' }],
          sizes: [{ size: 'S', inStock: true, quantity: 10 }]
        },
        {
          name: 'Test Blazer',
          slug: 'test-blazer',
          description: 'A stylish test blazer',
          price: 499,
          category: 'outerwear',
          images: [{ url: '/test2.jpg', alt: 'Test' }],
          sizes: [{ size: 'M', inStock: true, quantity: 5 }]
        }
      ]);

      const res = await request(app).get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(res.body.products).toHaveLength(2);
      expect(res.body.total).toBe(2);
      expect(res.body.page).toBe(1);
    });

    it('should filter products by category', async () => {
      await Product.create([
        {
          name: 'Test Dress',
          slug: 'test-dress',
          description: 'A beautiful test dress',
          price: 299,
          category: 'dresses',
          images: [],
          sizes: [{ size: 'S', inStock: true, quantity: 10 }]
        },
        {
          name: 'Test Blazer',
          slug: 'test-blazer',
          description: 'A stylish test blazer',
          price: 499,
          category: 'outerwear',
          images: [],
          sizes: [{ size: 'M', inStock: true, quantity: 5 }]
        }
      ]);

      const res = await request(app).get('/api/products?category=dresses');

      expect(res.statusCode).toBe(200);
      expect(res.body.products).toHaveLength(1);
      expect(res.body.products[0].category).toBe('dresses');
    });

    it('should sort products by price ascending', async () => {
      await Product.create([
        {
          name: 'Expensive Dress',
          slug: 'expensive-dress',
          description: 'Test',
          price: 999,
          category: 'dresses',
          images: [],
          sizes: []
        },
        {
          name: 'Cheap Dress',
          slug: 'cheap-dress',
          description: 'Test',
          price: 99,
          category: 'dresses',
          images: [],
          sizes: []
        }
      ]);

      const res = await request(app).get('/api/products?sort=price-asc');

      expect(res.statusCode).toBe(200);
      expect(res.body.products[0].price).toBeLessThan(res.body.products[1].price);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product by slug', async () => {
      const product = await Product.create({
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test description',
        price: 299,
        category: 'dresses',
        images: [{ url: '/test.jpg', alt: 'Test' }],
        sizes: [{ size: 'M', inStock: true, quantity: 10 }]
      });

      const res = await request(app).get(`/api/products/test-product`);

      expect(res.statusCode).toBe(200);
      expect(res.body.product.slug).toBe('test-product');
      expect(res.body.product.name).toBe('Test Product');
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app).get('/api/products/non-existent-slug');

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Product not found');
    });

    it('should return related products', async () => {
      await Product.create([
        {
          name: 'Main Dress',
          slug: 'main-dress',
          description: 'Test',
          price: 299,
          category: 'dresses',
          images: [],
          sizes: []
        },
        {
          name: 'Related Dress 1',
          slug: 'related-dress-1',
          description: 'Test',
          price: 349,
          category: 'dresses',
          images: [],
          sizes: []
        },
        {
          name: 'Related Dress 2',
          slug: 'related-dress-2',
          description: 'Test',
          price: 399,
          category: 'dresses',
          images: [],
          sizes: []
        }
      ]);

      const res = await request(app).get('/api/products/main-dress');

      expect(res.statusCode).toBe(200);
      expect(res.body.relatedProducts).toBeDefined();
      expect(res.body.relatedProducts.length).toBeGreaterThan(0);
      expect(res.body.relatedProducts.length).toBeLessThanOrEqual(4);
    });
  });

  describe('GET /api/products/autocomplete', () => {
    it('should return autocomplete suggestions', async () => {
      await Product.create([
        {
          name: 'Silk Dress',
          slug: 'silk-dress',
          description: 'Test',
          price: 299,
          category: 'dresses',
          images: [],
          sizes: []
        },
        {
          name: 'Silk Blouse',
          slug: 'silk-blouse',
          description: 'Test',
          price: 199,
          category: 'tops',
          images: [],
          sizes: []
        }
      ]);

      const res = await request(app).get('/api/products/autocomplete?q=silk');

      expect(res.statusCode).toBe(200);
      expect(res.body.suggestions).toHaveLength(2);
      expect(res.body.suggestions[0].name).toContain('Silk');
    });

    it('should return empty array for short query', async () => {
      const res = await request(app).get('/api/products/autocomplete?q=s');

      expect(res.statusCode).toBe(200);
      expect(res.body.suggestions).toHaveLength(0);
    });
  });
});


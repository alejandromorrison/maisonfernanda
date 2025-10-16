# Maison Fernanda - Frontend

Next.js frontend for the Maison Fernanda luxury fashion ecommerce platform.

## Features

- **Homepage**: Hero section, featured collections, editorial lookbook, new arrivals
- **Collection Listing**: Faceted filters (category, size, price), sorting, pagination
- **Product Detail**: Image gallery with zoom, size selector, color picker, size guide modal, related products
- **Search**: Instant autocomplete with 10 product suggestions
- **Shopping Cart**: Persistent cart (localStorage + server sync), quantity management
- **Checkout**: Single-page checkout flow with Stripe integration
- **Account**: User authentication (login/signup), order history
- **Admin Dashboard**: Product and order management (admin only)
- **Wishlist**: Save favorite products
- **Responsive Design**: Mobile-first, fully responsive layout
- **SEO Optimized**: Meta tags, Open Graph, semantic HTML

## Design System

### Colors
- `#FCF9F6` - Ivory (background)
- `#B9AFA4` - Warm Taupe (accents)
- `#6B655F` - Deep Taupe (primary text)
- `#D6B7B0` - Dusty Rose (highlights)
- `#C8A97E` - Gold (CTAs, accents)

### Typography
- **Headlines**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Inspiration
- Net-A-Porter
- Farfetch
- Dior
- Luxury editorial patterns with clean imagery and large whitespace

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - API requests
- **Stripe** - Payment processing
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications

## Getting Started

### Prerequisites

- Node.js v16+
- Backend API running (see backend README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file (copy from `.env.local.example`):
```bash
cp .env.local.example .env.local
```

3. Configure environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

### Static Export

For static hosting (with .htaccess support):
```bash
npm run export
```

Output will be in the `out/` directory.

## Project Structure

```
maison-fernanda-frontend/
├── components/
│   ├── Layout.tsx           # Main layout wrapper
│   ├── Header.tsx           # Navigation header
│   ├── Footer.tsx           # Site footer
│   ├── SearchBar.tsx        # Search with autocomplete
│   ├── CartDrawer.tsx       # Sliding cart drawer
│   └── ProductCard.tsx      # Product grid item
├── pages/
│   ├── index.tsx            # Homepage
│   ├── collection.tsx       # Product listing with filters
│   ├── product/
│   │   └── [slug].tsx       # Product detail page
│   ├── cart.tsx             # Shopping cart
│   ├── checkout.tsx         # Checkout form
│   ├── checkout/
│   │   └── success.tsx      # Order confirmation
│   ├── account.tsx          # User account & orders
│   ├── admin.tsx            # Admin dashboard
│   ├── _app.tsx             # App wrapper
│   └── _document.tsx        # HTML document
├── lib/
│   └── api.ts               # API client & endpoints
├── store/
│   └── useStore.ts          # Zustand global state
├── styles/
│   └── globals.css          # Global styles & Tailwind
├── public/
│   ├── .htaccess            # Apache rewrite rules
│   └── logo.png             # Brand logo
├── .env.local.example       # Environment template
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind configuration
└── tsconfig.json            # TypeScript configuration
```

## Pages

### Homepage (`/`)
- Hero section with CTAs
- Featured collection (4 products)
- Editorial lookbook section
- New arrivals (4 products)
- Category navigation grid
- Newsletter signup

### Collection (`/collection`)
- Product grid with pagination
- Sidebar filters:
  - Category
  - Size
  - Price range
- Sorting options:
  - Newest
  - Price: Low to High
  - Price: High to Low
  - Most Popular
- Mobile-friendly filter drawer

### Product Detail (`/product/[slug]`)
- Image gallery with thumbnails
- Product information
- Size selector with size guide modal
- Color picker
- Quantity selector
- Add to cart & wishlist
- Product details, materials, care instructions
- Related products (same category)

### Cart (`/cart`)
- Full cart view with large product images
- Quantity adjustment
- Remove items
- Order summary with shipping and tax
- Free shipping threshold indicator
- Proceed to checkout CTA

### Checkout (`/checkout`)
- Contact information form
- Shipping address form
- Order summary sidebar
- Stripe payment integration
- Redirects to Stripe Checkout
- Success page after payment

### Account (`/account`)
- Login/signup forms
- User profile information
- Order history with status
- Admin dashboard link (if admin)

### Admin (`/admin`)
- Orders tab:
  - View all orders
  - Update order status
  - Customer information
- Products tab:
  - View all products
  - Delete products
  - Placeholders for add/edit

## State Management

Using Zustand with localStorage persistence:

```typescript
// Cart
cart: CartItem[]
addToCart(item)
removeFromCart(productId, size, color)
updateQuantity(productId, quantity, size, color)
clearCart()

// Wishlist
wishlist: string[]
addToWishlist(productId)
removeFromWishlist(productId)

// User
user: User | null
setUser(user)
logout()

// Search
searchQuery: string
setSearchQuery(query)
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Deploy

Vercel automatically handles builds and deploys on every push to main.

### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables
5. Deploy

### Static Export (Traditional Hosting)

1. Build and export:
```bash
npm run export
```

2. Upload `out/` directory contents to web server

3. Ensure `.htaccess` is uploaded for proper routing

4. Configure environment variables on server

## SEO

Each page includes:
- Dynamic `<title>` tags
- Meta descriptions
- Open Graph tags for social sharing
- Semantic HTML structure
- Image alt attributes
- Accessible form labels and ARIA attributes

## Performance

- Next.js automatic code splitting
- Image optimization
- Lazy loading for images
- CSS minification with Tailwind
- Font optimization (Google Fonts)
- Compressed assets

## Accessibility

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus states on all interactive elements
- Color contrast meets WCAG AA standards
- Screen reader friendly

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Change Color Palette

Edit `tailwind.config.js`:
```js
colors: {
  ivory: '#FCF9F6',
  'warm-taupe': '#B9AFA4',
  // ... add your colors
}
```

### Change Fonts

Edit `styles/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');
```

Then update `tailwind.config.js`:
```js
fontFamily: {
  playfair: ['Your Serif Font', 'serif'],
  inter: ['Your Sans Font', 'sans-serif'],
}
```

## Support

For issues or questions, please contact the development team.

## License

MIT


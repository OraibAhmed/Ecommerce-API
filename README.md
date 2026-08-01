# E-Commerce REST API

This project is a RESTful API built with Node.js, Express, and Neon PostgreSQL.

## Features
- Full CRUD operations for Products, Categories, and Users.
- Soft-delete (Deactivate) for Products and Users.
- Strict input validation and database constraints handling (e.g. UNIQUE SKU and Email).
- Web-based testing dashboard built-in.
- Postman collections provided for API testing.

## Getting Started

1. Clone or extract the project.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and enter your Neon DB `DATABASE_URL`.
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   Or for production:
   ```bash
   npm start
   ```

5. Access the API and Test Dashboard at `http://localhost:3000`.

## Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a product by ID
- `POST /api/products` - Create a product
- `PUT /api/products/:id` - Update a product
- `PATCH /api/products/:id/deactivate` - Soft-delete a product

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a category by ID
- `POST /api/categories` - Create a category
- `PUT /api/categories/:id` - Update a category

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a user by ID
- `POST /api/users` - Create a user
- `PATCH /api/users/:id/status` - Toggle user status

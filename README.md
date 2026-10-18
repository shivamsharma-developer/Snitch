# Snitch

Snitch is a Node.js and Express backend for a shopping application. It provides user authentication, seller-managed products, image uploads, and user carts. MongoDB is used for data storage.

## Features

- User registration and login with hashed passwords
- Short-lived access tokens and refresh tokens stored in an HTTP-only cookie
- Seller-only product creation and listing management
- Product image uploads through ImageKit
- Product listing and cart endpoints
- Request validation with `express-validator`

## Requirements

- Node.js (an active LTS release is recommended)
- npm
- MongoDB
- An ImageKit account for product image uploads

## Getting started

1. Clone the repository and enter the server directory:

   ```sh
   git clone <your-repository-url>
   cd 0006-snitch/server
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Create your local environment file from the example:

   ```sh
   copy .env.example .env
   ```

   On macOS or Linux, use `cp .env.example .env`.

4. Set the values in `server/.env`:

   | Variable | Description |
   | --- | --- |
   | `MONGO_URI` | MongoDB connection string |
   | `ACCESS_TOKEN_SECRET` | Private signing secret for access tokens |
   | `REFRESH_TOKEN_SECRET` | Private signing secret for refresh tokens |
   | `IMAGEKIT_PRIVATE_KEY` | ImageKit private API key |

   Use strong, unique token secrets and keep all real credentials out of Git.

5. Start the development server:

   ```sh
   npm run dev
   ```

   The API listens on `http://localhost:3000`.

## API

All routes are currently mounted under `/api`.

### Authentication

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register a user | Public |
| `POST` | `/api/auth/login` | Log in and receive an access token | Public |
| `POST` | `/api/auth/refresh` | Rotate the refresh token and issue a new access token | Refresh-token cookie |
| `GET` | `/api/auth/me` | Get the authenticated user's profile | Bearer access token |

### Products

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/api/product` | Create a product and upload its images | Seller |
| `GET` | `/api/product` | Get published products | Authenticated |
| `GET` | `/api/product/seller` | Get products for seller management | Seller |
| `PATCH` | `/api/product/list/:id` | Publish a product | Seller |
| `PATCH` | `/api/product/unlist/:id` | Unpublish a product | Seller |

Product creation accepts `multipart/form-data`, including image files in the `images` field. The `price` and `sizes` fields are JSON values.

### Cart

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/api/cart` | Add a product and size to the cart | Authenticated |
| `GET` | `/api/cart` | Get the authenticated user's cart | Authenticated |

Protected endpoints expect an access token in the `Authorization: Bearer <token>` header.

## Environment and Git safety

- `server/.env` and other `.env.*` files are excluded by the root `.gitignore`.
- `.env.example` contains placeholders only and is safe to commit.
- `node_modules/` and common local log files are also ignored.
- Before pushing, check `git status` and confirm that no credentials or private files are staged. Ignore rules do not remove files that were already tracked.

If a real credential was ever committed or shared, revoke and replace it; removing it from a later commit does not make the exposed credential safe again.

## License

This project currently declares the ISC license in `server/package.json`.

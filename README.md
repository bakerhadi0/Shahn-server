# Shahn Sales — Server (Express + MongoDB)

## Quick start
1) Copy `.env.example` to `.env` and set:
```
MONGODB_URI=...
JWT_SECRET=...
PORT=5000
```
2) Install and run:
```bash
npm install
npm run dev
```
3) Seed example products (SAR):
```bash
npm run seed
```

## Routes
- `POST /api/auth/register` {name, email, password}
- `POST /api/auth/login` {email, password}
- `GET /api/products` (public)
- `POST /api/products` (Bearer token)
- `PUT /api/products/:id` (Bearer token)
- `DELETE /api/products/:id` (Bearer token)
- `GET /api/sales` (Bearer token)
- `POST /api/sales` (Bearer token) body: {customerName, items:[{product, qty, unitPriceSAR}]}

All currency fields are in **SAR**.

# Web Security Vulnerabilities Demo

Educational project demonstrating web security vulnerabilities.

## Implemented Vulnerabilities

1. **Cross-Site Scripting (XSS) - Stored XSS**
2. **Sensitive Data Exposure**

## Setup

```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

## Environment Variables

Create `.env` file:
```
DATABASE_URL=your_postgresql_connection_string
```

## Testing

Visit http://localhost:3000

### XSS Test
- Toggle vulnerability ON
- Post message: `<img src=x onerror="alert('XSS!')">`
- Alert should appear when vulnerable

### Sensitive Data Test
- Toggle vulnerability ON/OFF
- View password storage (plaintext vs hashed)

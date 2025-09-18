# Botthoven Contact Microservice (NestJS + Prisma + MySQL + React Email)

## Quickstart
```bash
cp .env.sample .env
# edit .env with your DB and SMTP settings

npm install
npx prisma generate
# If DB already exists: npx prisma db pull
# (optional) seed initial services + translations:
npm run seed

npm run dev
# POST http://localhost:3000/contact
```

## DB Expectations
Uses these tables (already created by your SQL scripts):
- services, service_translations, leads, lead_services

## Endpoints
- `POST /contact` → store lead, link services, send confirmation email (ES/EN)

## Email Templates
- React + Tailwind via @react-email/components and @react-email/render.
- See `src/emails/ConfirmationEmail.tsx`.
```

## Prisma schema

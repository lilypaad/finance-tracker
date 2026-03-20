# Budgie

Budgie is a personal finance web application that helps you track your budgeting and expenses.

Built with [Next.js](https://nextjs.org/).

![A screenshot of the application's overview page](screenshot.png)

## Getting Started

Make sure your environment variables are setup. The application expects the following variables:

```bash
# The port the application will run on
PORT=3000

# The database URL (expects PostgreSQL)
DRIZZLE_DATABASE_URL="postgres://admin:password@localhost:1234/postgres"

# Your generated secret key for authentication. Can be generated with `npx auth`.
AUTH_SECRET_KEY="u05Yd9tNM/uPch+w9BGvQFcSUt7qNnO0L4IHCIJem74="

# Your app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Set up your database with Drizzle migrations:

```bash
npx drizzle-kit migrate
```

Then, run the development server:

```bash
npm run dev
```

Sample data can be generated with the included seed script:

```bash
npm run db:seed
```

Open [http://localhost:3000](http://localhost:3000) with your browser to use the application.
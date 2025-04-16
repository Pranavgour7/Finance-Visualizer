# Finance Visualizer Project Structure

This document explains the organization of the Finance Visualizer codebase, which follows a clear separation between frontend and backend components.

## Project Organization

The codebase is organized into three main areas:

```
src/
├── app/           # Next.js app router and UI components
├── backend/       # Backend logic and database operations
├── frontend/      # Frontend-specific components and hooks
└── shared/        # Shared types and utilities used by both frontend and backend
```

## Detailed Structure

### Backend (`src/backend/`)

Contains all server-side logic, database operations, and business logic.

```
backend/
├── db/
│   └── connection.ts      # MongoDB connection handling
├── models/
│   └── models.ts          # Mongoose schema and model definitions
└── services/
    ├── budgetService.ts   # Budget-related operations
    ├── incomeService.ts   # Income-related operations
    ├── transactionService.ts # Transaction-related operations
    └── index.ts           # Exports all services
```

### Frontend (`src/frontend/`)

Contains React components, hooks, and utilities specifically for the UI.

```
frontend/
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
└── utils/         # Frontend-specific utilities
```

### Shared (`src/shared/`)

Contains types, interfaces, and utilities used by both frontend and backend.

```
shared/
├── types/
│   └── index.ts    # Shared TypeScript interfaces and types
└── utils/
    ├── helpers.ts  # Business logic helpers
    └── ui.ts       # UI utility functions
```

### App (`src/app/`)

Contains the Next.js app router pages and API routes.

```
app/
├── api/            # Next.js API routes that use backend services
├── dashboard/      # Dashboard page
├── budgets/        # Budget management page
├── income/         # Income management page
├── transactions/   # Transaction management page
├── layout.tsx      # Root layout component
└── page.tsx        # Home page
```

## Key Benefits of This Structure

1. **Clear Separation of Concerns**
   - Backend code is isolated from frontend code
   - Data models and business logic are separated from UI components

2. **Improved Code Organization**
   - Each component has a dedicated purpose and location
   - Related code is grouped together

3. **Better Maintainability**
   - Changes to one part (e.g., the database schema) are contained
   - Easier to understand and navigate the codebase

4. **Enhanced Testability**
   - Backend services can be tested independently
   - UI components can be tested separately from business logic

5. **Future-Proofing**
   - Structure allows for easy transition to a separate backend if needed
   - Shared types ensure consistency between frontend and backend

6. **Development Efficiency**
   - Multiple developers can work on different areas simultaneously
   - Clear import paths improve development experience

## Import Conventions

Use absolute imports for better readability:

```typescript
// For backend services
import { transactionService } from '@/backend/services';

// For shared types
import { Transaction } from '@/shared/types';

// For frontend components
import { TransactionCard } from '@/frontend/components';
```

## API Structure

API routes use backend services to perform operations:

```typescript
// src/app/api/transactions/route.ts
import { transactionService } from '@/backend/services';

export async function GET() {
  const transactions = await transactionService.getAllTransactions();
  return NextResponse.json(transactions);
}
``` 
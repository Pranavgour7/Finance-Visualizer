# Finance Visualizer

A simple web application for tracking personal finances.

## Features

### Transaction Tracking
- Add, edit, and delete transactions with amount, date, description, and category
- View all transactions in a list
- Visual representation of monthly expenses with bar chart

### Category Management
- Categorize transactions (Food, Housing, Transportation, etc.)
- Category-wise breakdown with pie chart
- Dashboard with summary cards showing total expenses, category breakdown

### Budgeting
- Set monthly budgets by category
- Compare actual spending against budgets
- Visual insights to track spending habits

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Data Visualization**: Recharts
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Validation**: Zod
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- MongoDB (either local or cloud-based like MongoDB Atlas)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/finance-visualizer.git
cd finance-visualizer
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory and add:

```
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app` - Next.js app router pages and API routes
- `src/components` - React components
- `src/lib` - Utility functions, database connection, types, and models
- `public` - Static assets

## License

This project is licensed under the MIT License.

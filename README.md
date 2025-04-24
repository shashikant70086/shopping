# Shopping Assistant Web App

An iOS-inspired shopping assistant web application with a sleek UI design, authentication system, and dark/light mode toggle.

## Features

- 🔐 Authentication system with sign-in/registration page
- 🌓 Dark/Light mode toggle with starry animation in dark mode
- 📱 Responsive design for mobile, tablet, and desktop
- 📒 History page for tracking previous conversations
- 🔄 PostgreSQL database integration for persistent storage
- 💬 Chat interface for interacting with the shopping assistant

## Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm or yarn
- PostgreSQL

### Installation

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/yourusername/shopping-assistant.git
   cd shopping-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a PostgreSQL database and update the environment variables:
   - Create a `.env` file in the root directory with the following content:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/shopping_assistant
   SESSION_SECRET=your-secret-key
   ```
   - Replace `username`, `password`, and database name as needed

4. Create database tables:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

### Default Login Credentials

- Username: shopping
- Password: shopping123

## Development Commands

- `npm run dev`: Start the development server
- `npm run db:push`: Push schema changes to the database
- `npm run db:studio`: Open the Drizzle Studio (database management UI)
- `npm run build`: Build the application for production

## Project Structure

- `/client`: Frontend React application
  - `/src/components`: UI components
  - `/src/hooks`: Custom React hooks
  - `/src/pages`: Page components
- `/server`: Backend Express application
  - `/routes.ts`: API routes
  - `/auth.ts`: Authentication logic
  - `/storage.ts`: Database operations
  - `/db.ts`: Database connection
- `/shared`: Shared code between frontend and backend
  - `/schema.ts`: Database schema and types
  - `/types.ts`: Shared TypeScript interfaces

## Technologies Used

- **Frontend**:
  - React
  - TanStack Query
  - shadcn/ui component library
  - Tailwind CSS
  - Framer Motion for animations

- **Backend**:
  - Express.js
  - Passport.js for authentication
  - PostgreSQL with Drizzle ORM
  - Express Session with PostgreSQL session store

## License

This project is licensed under the MIT License - see the LICENSE file for details.
# Compound Planning Advisor Dashboard

## Project Overview
This project is a financial advisor dashboard for Compound Planning, built using Next.js, React, and Material UI. The dashboard allows users to view and manage financial advisors, their accounts, and holdings. It features filtering, sorting, and navigation between different views.

## Repository Information
- **GitHub Repository**: [Compound-Project-1](https://github.com/Marvive/Compound-Project-1)
- **Main Technologies**: Next.js 15, React 19, Material UI 6, Node.js

## Installation and Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/Marvive/Compound-Project-1.git
cd Compound-Project-1/advisor-dashboard
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Development Server
For development purposes with hot reloading:
```bash
npm run dev
```
This will start the application in development mode. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Step 4: Build and Run Production Version (Optional)
To build the application for production:
```bash
npm run build
```

To start the production server after building:
```bash
npm start
```
The production version will be available at [http://localhost:3000](http://localhost:3000).

## Application Structure

### Key Directories and Files
- `/src/app/` - Main application code
- `/api/` - API routes with mock data
- `/components/` - React components
- `/styles/` - CSS styles
- `layout.js` - Root layout component
- `page.jsx` - Main page component

### API Endpoints
- `/api/advisors` - Get all advisors or add a new advisor
- `/api/accounts` - Get accounts, optionally filtered by advisor ID
- `/api/holdings` - Get holdings data

## Features
- View a list of financial advisors with their key metrics
- Filter and sort advisors by name, email, account count, or total assets
- View accounts managed by a specific advisor
- Filter and sort accounts by various criteria
- View holdings within a specific account
- Calculate and display account balances and advisor total assets

## Technical Implementation Notes
- The application uses Next.js App Router for routing
- Mock data is stored in separate data files in the API directories
- The UI is built using Material UI components
- State management is handled using React's useState and useEffect hooks
- API routes use Next.js API routes feature to simulate a backend server

## Troubleshooting
- If you encounter an "address already in use" error when starting the server, ensure no other application is running on port 3000, or specify a different port:
  ```bash
  PORT=3001 npm run dev
  ```
- If you see the error "Cannot find module", ensure all dependencies are installed correctly with `npm install`
- For any other issues, check the browser console for error messages

## Future Enhancements
- Implement proper URL-based routing for better navigation
- Add CRUD operations (GET, PUT, POST, DELETE) for advisors, accounts, and holdings
- Implement authentication and authorization
- Connect to a real database instead of using mock data
- Add more comprehensive error handling and validation
- Add API Documentation
- URL based routing (optional)

## Assumptions Made
- I added the capability of email address for the advisor to ensure that the users are unique
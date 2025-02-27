# Compound Planning Advisor Dashboard

## Project Overview
This project is a financial advisor dashboard for Compound Planning, built using Next.js, React, and Material UI. The dashboard allows users to view and manage financial advisors, their accounts, and holdings. It features filtering, sorting, and navigation between different views.

## Repository Information
- **GitHub Repository**: [Compound-Project](https://github.com/Marvive/Compound-Project)
- **Main Technologies**: Next.js 15, React 19, Material UI 6, Node.js

## Installation and Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/Marvive/Compound-Project.git
cd Compound-Project/advisor-dashboard
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
- `/utils/` - Helper methods to reduce repetition

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
- Assumption made here that Rep ID is the advisor's repId which connects the custodians to the Advisor

## Acceptance Criteria

### Scenario 1: Viewing Advisor List

Given I am on the dashboard homepage

When the page loads

Then I should see a table listing all financial advisors with their names, emails, account counts, and total assets

### Scenario 2: Advisor Total Assets Calculation

Given I am viewing the advisor table

When I look at an advisor's total assets

Then the value should accurately reflect the sum of all account balances managed by that advisor

### Scenario 3: Advisor Account Count

Given I am viewing the advisor table

When I look at an advisor's account count

Then the value should accurately reflect the actual number of accounts associated with that advisor

### Scenario 4: Filtering Advisors

Given I am viewing the advisor table

When I enter text in the filter field

Then the table should display only advisors whose name or email contains that text

### Scenario 5: Sorting Advisors

Given I am viewing the advisor table

When I select a field to sort by and choose a sort order

Then the table should display advisors sorted by that field in the selected order

## Feature: Account Management

### Scenario 1: Viewing Accounts for an Advisor

Given I am viewing the advisor table

When I click "View Accounts" for a specific advisor

Then I should be taken to a view showing all accounts managed by that advisor

### Scenario 2: Account Details Display

Given I am viewing an advisor's accounts

When I look at the account table

Then I should see each account's name, rep ID, account number, custodian, and balance

### Scenario 3: Account Balance Calculation

Given I am viewing an advisor's accounts

When I look at an account's balance

Then the value should accurately reflect the sum of all holdings within that account

### Scenario 4: Navigating Back to Advisors

Given I am viewing an advisor's accounts

When I click the "Back to Advisors" button

Then I should be returned to the advisor table

### Scenario 5: Filtering Accounts

Given I am viewing an advisor's accounts

When I enter text in the filter field

Then the table should display only accounts whose name, custodian, or account number contains that text

### Scenario 6: Sorting Accounts

Given I am viewing an advisor's accounts

When I select a field to sort by and choose a sort order

Then the table should display accounts sorted by that field in the selected order

## Feature: Holdings Management

### Scenario 1: Viewing Holdings for an Account

Given I am viewing an advisor's accounts

When I click "View Holdings" for a specific account

Then I should be taken to a view showing all holdings within that account

### Scenario 2: Holdings Details Display

Given I am viewing an account's holdings

When I look at the holdings table

Then I should see each holding's ticker, units, unit price, and total value

### Scenario 3: Holdings Total Value Display

Given I am viewing an account's holdings

When I look at the bottom of the holdings table

Then I should see the total value of all holdings in the account

### Scenario 4: Navigating Back to Accounts

Given I am viewing an account's holdings

When I click the "Back to Accounts" button

Then I should be returned to the accounts table

### Scenario 5: Filtering Holdings

Given I am viewing an account's holdings

When I enter text in the filter field

Then the table should display only holdings whose ticker contains that text

### Scenario 6: Sorting Holdings

Given I am viewing an account's holdings

When I select a field to sort by and choose a sort order

Then the table should display holdings sorted by that field in the selected order
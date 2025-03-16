import { allAccounts } from './data';
import { advisors } from '../advisors/data';

export async function GET(request) {
  // Extract search parameters from the request URL
  const { searchParams } = new URL(request.url);
  const advisorId = searchParams.get('advisorId');
  
  // If no advisorId is provided, return all accounts
  // Handles missing parameter
  if (!advisorId) {
    return Response.json(allAccounts);
  }

  // Find advisor and their repIds
  // Changed 'a' to 'advisor' for clarity
  const advisor = advisors.find(advisor => advisor.id === advisorId);
  // If no matching advisor is found, return an empty array
  // Handles invalid advisorId
  if (!advisor) {
    return Response.json([]);
  }

  // Extract all repIds from the advisor's custodians
  // Changed 'c' to 'custodian' for clarity
  const advisorRepIds = advisor.custodians.map(custodian => custodian.repId);

  // Filter accounts by advisor's repIds and calculate values
  const accounts = allAccounts
    // First, filter accounts to only include those with matching repIds
    // filter() creates a new array with elements that pass the test
    // includes() checks if the account's repId is in the advisorRepIds array
    .filter(account => advisorRepIds.includes(account.repId))

    // Then, transform each account to add a balance property
    // map() creates a new array by transforming each element
    // We keep all existing properties (...account) and add the balance
    // ... is the spread operator, it spreads the properties of the account object
    .map(account => ({
      ...account,
      // Calculate balance by summing the value of all holdings
      // Changed 'sum' to 'totalBalance' and 'holding' to 'accountHolding' for clarity
      balance: account.holdings.reduce((totalBalance, accountHolding) => 
        totalBalance + (accountHolding.units * accountHolding.unitPrice), 0
      )
    }));

  // Return the filtered and transformed accounts as a JSON response
  return Response.json(accounts);
} 
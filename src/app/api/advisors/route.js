import { advisors } from './data';
import { allAccounts } from '../accounts/data';

// This function handles GET requests to /api/advisors
// It calculates additional data for each advisor (account count and total assets)
export async function GET() {
  const advisorsWithCalculatedData = advisors.map(advisor => {
    // Get all repIds for this advisor. Map creates the array of repIds
    const advisorRepIds = advisor.custodians.map(c => c.repId);
    
    // Find accounts that belong to this advisor using repIds
    const advisorAccounts = allAccounts.filter(account => 
      advisorRepIds.includes(account.repId)
    );

    // Calculate total assets and account count
    // reduce() is used to calculate the total value of all accounts
    const totalAssets = advisorAccounts.reduce((sum, account) => {
      // Calculate the value of each account by multiplying the units by the unit price
      const accountValue = account.holdings.reduce((holdingSum, holding) => 
        holdingSum + (holding.units * holding.unitPrice), 0);
      // Add the account value to the total sum
      return sum + accountValue;
    }, 0); // Initial value of the sum is 0

    return {
      ...advisor,
      accountCount: advisorAccounts.length, // Total number of accounts for this advisor
      totalAssets // Total value of all accounts for this advisor
    };
  });

  return Response.json(advisorsWithCalculatedData);
}

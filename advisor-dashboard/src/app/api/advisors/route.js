import { advisors } from './data';
import { allAccounts } from '../accounts/data';

export async function GET() {
  const advisorsWithCalculatedData = advisors.map(advisor => {
    // Get all repIds for this advisor
    const advisorRepIds = advisor.custodians.map(c => c.repId);
    
    // Find accounts that belong to this advisor using repIds
    const advisorAccounts = allAccounts.filter(account => 
      advisorRepIds.includes(account.repId)
    );

    // Calculate total assets and account count
    const totalAssets = advisorAccounts.reduce((sum, account) => {
      const accountValue = account.holdings.reduce((holdingSum, holding) => 
        holdingSum + (holding.units * holding.unitPrice), 0);
      return sum + accountValue;
    }, 0);

    return {
      ...advisor,
      accountCount: advisorAccounts.length,
      totalAssets
    };
  });

  return Response.json(advisorsWithCalculatedData);
}

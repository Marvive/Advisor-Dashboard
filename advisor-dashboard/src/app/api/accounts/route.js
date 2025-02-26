import { allAccounts } from './data';
import { advisors } from '../advisors/data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const advisorId = searchParams.get('advisorId');
  
  if (!advisorId) {
    return Response.json(allAccounts);
  }

  // Find advisor and their repIds
  const advisor = advisors.find(a => a.id === advisorId);
  if (!advisor) {
    return Response.json([]);
  }

  const advisorRepIds = advisor.custodians.map(c => c.repId);

  // Filter accounts by advisor's repIds and calculate values
  const accounts = allAccounts
    .filter(account => advisorRepIds.includes(account.repId))
    .map(account => ({
      ...account,
      balance: account.holdings.reduce((sum, holding) => 
        sum + (holding.units * holding.unitPrice), 0
      )
    }));

  return Response.json(accounts);
} 
import { allHoldings } from '../holdings/data'; // Import holdings data
import { allAccounts } from './data'; // Import accounts data

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const advisorId = searchParams.get('advisorId');
  
  // Mock data for accounts
  
  // Calculate balance from holdings
  const accountsWithBalance = allAccounts.map(account => {
    const holdings = allHoldings.filter(holding => holding.accountId === account.id);
    const balance = holdings.reduce((sum, holding) => sum + holding.value, 0);
    return { ...account, balance };
  });

  // Filter accounts by advisorId if provided
  const accounts = advisorId 
    ? accountsWithBalance.filter(account => account.advisorId === parseInt(advisorId))
    : accountsWithBalance;
  
  return Response.json(accounts);
} 
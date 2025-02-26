import { advisors } from './data';
import { allAccounts } from '../accounts/data';
import { allHoldings } from '../holdings/data';

export async function GET() {
  // First calculate balances for all accounts
  const accountsWithBalance = allAccounts.map(account => {
    const holdings = allHoldings.filter(holding => holding.accountId === account.id);
    const balance = holdings.reduce((sum, holding) => sum + holding.value, 0);
    return { ...account, balance };
  });

  // Then calculate total assets for each advisor
  const advisorsWithCalculatedAssets = advisors.map(advisor => {
    const advisorAccounts = accountsWithBalance.filter(account => account.advisorId === advisor.id);
    const totalAssets = advisorAccounts.reduce((sum, account) => sum + account.balance, 0);
    const accountCount = advisorAccounts.length;
    
    return { ...advisor,
       totalAssets,
       accountCount };

  });

  

  return Response.json(advisorsWithCalculatedAssets);
}

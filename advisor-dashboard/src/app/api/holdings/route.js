import { allHoldings } from './data';
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get('accountId');
  
  // Mock data for holdings
  
  
  // Filter holdings by accountId if provided
  const holdings = accountId 
    ? allHoldings.filter(holding => holding.accountId === parseInt(accountId))
    : allHoldings;
  
  return Response.json(holdings);
} 
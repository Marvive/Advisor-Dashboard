import { allHoldings, accountMapping } from './data';
import { NextRequest } from 'next/server';
import { allAccounts } from '../accounts/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get('accountId');
  const accountNumber = searchParams.get('accountNumber');
  
  console.log("Holdings API - Received accountId:", accountId, "accountNumber:", accountNumber);
  
  if (accountId) {
    const parsedId = parseInt(accountId, 10);
    console.log("Trying to find holdings for accountId:", parsedId);
    
    try {
      // Find account by using the accountNumber parameter which is more reliable than index calculations
      let targetAccount = null;
      
      if (accountNumber) {
        // If accountNumber is provided, find the account by its number which is unique
        targetAccount = allAccounts.find(account => account.number === accountNumber);
        console.log("Looking for account with number:", accountNumber);
      } else {
        // Fallback to the old method, but log a warning
        console.warn("No accountNumber provided, using less reliable index-based lookup");
        const accountIndex = parsedId - 100;
        if (accountIndex >= 0 && accountIndex < allAccounts.length) {
          targetAccount = allAccounts[accountIndex];
        }
      }
      
      if (targetAccount) {
        console.log("Found account:", targetAccount.name, "with", targetAccount.holdings?.length || 0, "holdings");
        
        // Use the account's own holdings data
        if (targetAccount.holdings && targetAccount.holdings.length > 0) {
          // Transform the account holdings into the format expected by the frontend
          const transformedHoldings = targetAccount.holdings.map((holding, index) => ({
            id: index + 1000, // Generate unique IDs
            accountId: parsedId,
            securityName: holding.ticker, // Use ticker as the security name if not provided
            ticker: holding.ticker,
            assetClass: "Equity", // Default value
            shares: holding.units,
            price: holding.unitPrice,
            value: holding.units * holding.unitPrice
          }));
          
          console.log(`Transformed ${transformedHoldings.length} holdings for account ${targetAccount.name}. Total value: ${transformedHoldings.reduce((sum, h) => sum + h.value, 0)}`);
          return Response.json(transformedHoldings);
        } else {
          console.log("No holdings found in account:", targetAccount.name);
          return Response.json([]);
        }
      } else {
        console.log("Account not found.");
        return Response.json([]);
      }
    } catch (error) {
      console.error("Error finding account:", error);
      return Response.json([]);
    }
  }
  
  // If no accountId provided, return all holdings (fallback)
  console.log("No accountId provided, returning all holdings");
  return Response.json(allHoldings);
} 
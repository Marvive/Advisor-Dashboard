export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const advisorId = searchParams.get('advisorId');
  
  // Mock data for accounts
  const allAccounts = [
    // Advisor 1 accounts
    {
      id: 101,
      advisorId: 1,
      clientName: "Michael Brown",
      accountType: "401(k)",
      accountNumber: "AC-7845-1201",
      custodian: "Fidelity",
      balance: 1250000
    },
    {
      id: 102,
      advisorId: 1,
      clientName: "Sarah Johnson",
      accountType: "IRA",
      accountNumber: "AC-7845-1202",
      custodian: "Vanguard",
      balance: 850000
    },
    {
      id: 103,
      advisorId: 1,
      clientName: "David Lee",
      accountType: "Brokerage",
      accountNumber: "AC-7845-1203",
      custodian: "Charles Schwab",
      balance: 1650000
    },
    
    // Advisor 2 accounts
    {
      id: 201,
      advisorId: 2,
      clientName: "Jennifer Wilson",
      accountType: "Roth IRA",
      accountNumber: "AC-8932-2101",
      custodian: "Fidelity",
      balance: 920000
    },
    {
      id: 202,
      advisorId: 2,
      clientName: "Thomas Moore",
      accountType: "401(k)",
      accountNumber: "AC-8932-2102",
      custodian: "Vanguard",
      balance: 1100000
    },
    
    // Advisor 3 accounts
    {
      id: 301,
      advisorId: 3,
      clientName: "Lisa Garcia",
      accountType: "Brokerage",
      accountNumber: "AC-9213-3101",
      custodian: "Charles Schwab",
      balance: 1750000
    },
    {
      id: 302,
      advisorId: 3,
      clientName: "Kevin Martinez",
      accountType: "IRA",
      accountNumber: "AC-9213-3102",
      custodian: "Fidelity",
      balance: 980000
    },
    
    // Advisor 4 accounts
    {
      id: 401,
      advisorId: 4,
      clientName: "Patricia Taylor",
      accountType: "401(k)",
      accountNumber: "AC-6547-4101",
      custodian: "Vanguard",
      balance: 1320000
    },
    
    // Advisor 5 accounts
    {
      id: 501,
      advisorId: 5,
      clientName: "James Anderson",
      accountType: "Roth IRA",
      accountNumber: "AC-7812-5101",
      custodian: "Charles Schwab",
      balance: 890000
    },
    {
      id: 502,
      advisorId: 5,
      clientName: "Elizabeth White",
      accountType: "Brokerage",
      accountNumber: "AC-7812-5102",
      custodian: "Fidelity",
      balance: 1450000
    }
  ];
  
  // Filter accounts by advisorId if provided
  const accounts = advisorId 
    ? allAccounts.filter(account => account.advisorId === parseInt(advisorId))
    : allAccounts;
  
  return Response.json(accounts);
} 
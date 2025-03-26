export interface Advisor {
  id: string;
  name: string;
  email: string;
  accountCount: number;
  totalAssets: number;
}

export interface Account {
  id: number;
  name: string;
  repId: string;
  number: string;
  accountNumber: string;
  custodian: string;
  balance: number;
  holdings?: Array<{ ticker: string, units: number, unitPrice: number }>;
}

export interface Holding {
  id: string;
  accountId: string | number;  // Allow both string and number
  ticker: string;
  units: number;
  unitPrice: number;
  totalValue: number;
}

export interface FilterSortOptions {
  filterValue: string;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  searchFields?: string[];
}

export interface ViewedAccount extends Account {
  advisorName?: string;
}

// Component props interfaces
export interface FilterSortProps {
  onFilterSort: (options: FilterSortOptions) => void;
  type: string;
}

export interface AccountTableProps {
  advisorId: string;
  viewedAccounts: Account[];
  setViewedAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
}

export interface HoldingTableProps {
  accountId: number;
  accountNumber: string;
  onBack: () => void;
}

export interface LastViewedHistoryProps {
  accounts: Account[];
} 
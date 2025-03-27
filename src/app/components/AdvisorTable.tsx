'use client'; // tells next.js to render this component on the client
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Box, Button, CircularProgress
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import HoldingTable from './HoldingTable';
import AccountTable from './AccountTable';
import FilterSort from './FilterSort';
import { formatCurrency } from '../utils/formatters';
import { getSearchFields, filterAndSortItems } from '../utils/tabHelpers';
import LastViewedHistory from './LastViewedHistory';
import { Advisor, Account, AccountTableProps, FilterSortOptions } from '../types';
import { useNavigation } from './Layout';

export default function AdvisorTable({ advisorId, viewedAccounts = [], setViewedAccounts }: AccountTableProps) {
  // State Variables
  const [advisors, setAdvisors] = useState<Advisor[]>([]); // List of advisors
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null); // Selected advisor
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null); // Selected account from history
  const [filteredAdvisors, setFilteredAdvisors] = useState<Advisor[]>([]); // Filtered advisors
  
  // State for column sorting
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Get the setResetFunction from our navigation context
  const { setResetFunction } = useNavigation();
  
  // Create a stable resetToAdvisorView function
  const resetToAdvisorView = useCallback(() => {
    setSelectedAdvisor(null);
    setSelectedAccount(null);
    if (advisors.length > 0) {
      setFilteredAdvisors(advisors);
    }
  }, [advisors, setSelectedAdvisor, setSelectedAccount, setFilteredAdvisors]);
  
  // useEffect runs after render - here it's used to fetch data after the component mounts
  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        // Fetch the advisors from the API
        const response = await fetch('/api/advisors');
        const data = await response.json();
        // Update the state variables with the fetched data
        setAdvisors(data);
        setFilteredAdvisors(data);
      } catch (error) {
        console.error('Error fetching advisors:', error);
      } finally {
        // Set the loading state to false after the data has been fetched
        setLoading(false);
      }
    };
    
    fetchAdvisors();
  }, []); // Empty array means this effect only runs once after the initial render
  
  // Set up the reset function when the component mounts or when resetToAdvisorView changes
  useEffect(() => {
    // Register our reset function with the context
    setResetFunction(resetToAdvisorView);
    
    // Clean up when component unmounts
    return () => {
      setResetFunction(() => {});
    };
  }, [resetToAdvisorView, setResetFunction]);
  
  // When a user clicks "View Accounts" for an advisor, we set the selected advisor to the advisor in question
  const handleViewAccounts = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
  };

  // When a user clicks "Back" from the AccountTable, we set the selected advisor to null
  const handleBack = () => {
    setSelectedAdvisor(null); // Clears the selected advisor and returns
    setSelectedAccount(null); // Also clear any selected account
    setFilteredAdvisors(advisors); // Reset filtered advisors to show all advisors
  };
  
  // When a user clicks on an account in the history list
  const handleViewAccount = (account: Account) => {
    console.log("Viewing account from history:", account.name);
    setSelectedAccount(account);
  };
  
  // This function filters and sorts the advisors
  const handleFilterSort = (options: FilterSortOptions) => {
    // Don't update sortField and sortDirection from options
    // Keep the current sort state set by column header clicks
    const searchFields = getSearchFields('advisors');
    
    // Apply filtering with the current sort settings
    const filtered = filterAndSortItems(advisors, { 
      ...options, 
      sortField, 
      sortOrder: sortDirection, 
      searchFields 
    });
    
    setFilteredAdvisors(filtered);
  };
  
  // Handle column header click for sorting
  const handleHeaderSort = (field: string) => {
    let newDirection: 'asc' | 'desc' = 'asc';
    
    // If clicking the same field, toggle direction
    if (field === sortField) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    // Update sort state
    setSortField(field);
    setSortDirection(newDirection);
    
    // Apply sorting
    const searchFields = getSearchFields('advisors');
    const filtered = filterAndSortItems(advisors, { 
      sortField: field, 
      sortOrder: newDirection, 
      filterValue: '', 
      searchFields 
    });
    setFilteredAdvisors(filtered);
  };
  
  /**
   * Renders a sortable column header for the table
   * @param {string} field - The field name to sort by (e.g. 'name', 'email')
   * @param {string} label - The display label for the column header
   * @param {string} align - Text alignment ('left', 'right', 'center'), defaults to 'left'
   * @returns {JSX.Element} A TableCell component with sorting functionality
   */
  const renderSortableHeader = (field: string, label: string, align: 'left' | 'right' | 'center' = 'left') => (
    // TableCell with click handler for sorting and hover styling
    <TableCell 
      align={align} // Controls text alignment within the cell
      onClick={() => handleHeaderSort(field)} // Triggers sort when header is clicked
      sx={{ 
        cursor: 'pointer', // Shows clickable cursor on hover
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)' // Light gray background on hover
        }
      }}
    >
      {/* Flex container to align label and sort icon */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        // Dynamically set justification based on alignment prop
        justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center' 
      }}>
        <strong>{label}</strong>
        {/* Show sort direction icon if this column is being sorted */}
        {sortField === field && (
          sortDirection === 'asc' 
            ? <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> // Up arrow for ascending
            : <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} /> // Down arrow for descending
        )}
      </Box>
    </TableCell>
  );
  
  // Loading state - if the data is still loading, we show a loading spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // If a user has selected an account from history, we show the holdings for that account
  if (selectedAccount) {
    console.log("Rendering HoldingTable with accountId:", selectedAccount.id);
    console.log("Selected account details:", {
      id: selectedAccount.id,
      name: selectedAccount.name,
      number: selectedAccount.number,
      accountNumber: selectedAccount.accountNumber
    });
    return (
      <Box>
        <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
          Back to Advisors
        </Button>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Holdings for {selectedAccount.name}
        </Typography>
        <HoldingTable 
          accountId={selectedAccount.id} 
          accountNumber={selectedAccount.number} 
          onBack={handleBack} 
        />
      </Box>
    );
  }
  
  // If a user has selected an advisor, we show the accounts for that advisor
  if (selectedAdvisor) {
    return (
      <Box>
        <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
          Back to Advisors
        </Button>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Accounts Managed by {selectedAdvisor.name}
        </Typography>
        <AccountTable 
          advisorId={selectedAdvisor.id} 
          viewedAccounts={viewedAccounts} 
          setViewedAccounts={setViewedAccounts} 
        />
      </Box>
    );
  }
  
  // If a user has not selected an advisor, we show the advisor table
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Wealth Dynamics - Advisor Dashboard
      </Typography>
      
      <FilterSort onFilterSort={handleFilterSort} type="advisors" />
      {viewedAccounts && (
        <LastViewedHistory 
          accounts={viewedAccounts} 
          onAccountClick={handleViewAccount} 
        />
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {renderSortableHeader('name', 'Advisor Name')}
              {renderSortableHeader('email', 'Email')}
              {renderSortableHeader('accountCount', 'Accounts', 'right')}
              {renderSortableHeader('totalAssets', 'Total Assets', 'right')}
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdvisors.map((advisor) => (
              <TableRow key={advisor.id} hover>
                <TableCell>{advisor.name}</TableCell>
                <TableCell>{advisor.email}</TableCell>
                <TableCell align="right">{advisor.accountCount}</TableCell>
                <TableCell align="right">{formatCurrency(advisor.totalAssets)}</TableCell>
                <TableCell align="center">
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => handleViewAccounts(advisor)}
                  >
                    View Accounts
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 
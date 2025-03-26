'use client';
import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Box, Button, CircularProgress
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import HoldingTable from './HoldingTable';
import FilterSort from './FilterSort';
import { formatCurrency } from '../utils/formatters';
import { getSearchFields, filterAndSortItems } from '../utils/tabHelpers';
import { Account, AccountTableProps, FilterSortOptions } from '../types';

export default function AccountTable({ advisorId, viewedAccounts, setViewedAccounts }: AccountTableProps) {
  // State Variables
  const [accounts, setAccounts] = useState<Account[]>([]); // Stores accounts
  const [loading, setLoading] = useState<boolean>(true); // Tracks loading state
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null); // Tracks Selected account
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]); // Stores Filtered accounts

  
  // State for column sorting
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // useEffect runs after render - here it's used to fetch data when component mounts
  useEffect(() => {
    // async function to fetch accounts. allows us to use await to wait for the data to be fetched
    const fetchAccounts = async () => {
      try {
        // Fetch accounts for the selected advisor
        const response = await fetch(`/api/accounts?advisorId=${advisorId}`);
        const data = await response.json();
        console.log("Fetched accounts:", data); // Debug log
        setAccounts(data);
        setFilteredAccounts(data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        // Set loading state to false after data has been fetched
        setLoading(false);
      }
    };
    
    fetchAccounts();
  }, [advisorId]); // Refetch if advisorId changes
  
  // Handler for when user clicks on View Holdings
  const handleViewHoldings = (account: Account) => {
    console.log("Selected account:", account);
    console.log("Account ID type:", typeof account.id, "Value:", account.id);
    setSelectedAccount(account);
    
    // Make sure we don't add the same account multiple times
    if (!viewedAccounts.some(a => a.id === account.id)) {
      setViewedAccounts(prev => [...prev, account]);
    }
  };

  // Handler for when user clicks on Back
  const handleBack = () => {
    setSelectedAccount(null); // Clears the selected account and returns
    setFilteredAccounts(accounts); // Reset filtered accounts to show all accounts
  };
  
  const handleFilterSort = (options: FilterSortOptions) => {
    setSortField(options.sortField);
    setSortDirection(options.sortOrder);
    const searchFields = getSearchFields('accounts');
    const filtered = filterAndSortItems(accounts, { ...options, searchFields });
    setFilteredAccounts(filtered);
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
    const searchFields = getSearchFields('accounts');
    const filtered = filterAndSortItems(accounts, { 
      sortField: field, 
      sortOrder: newDirection, 
      filterValue: '', 
      searchFields 
    });
    setFilteredAccounts(filtered);
  };
  
  // Render a sortable column header
  const renderSortableHeader = (field: string, label: string, align: 'left' | 'right' | 'center' = 'left') => (
    <TableCell 
      align={align}
      onClick={() => handleHeaderSort(field)}
      sx={{ 
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center' }}>
        <strong>{label}</strong>
        {sortField === field && (
          sortDirection === 'asc' 
            ? <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} />
            : <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
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
  
  // If a user has selected an account, we show the holdings for that account
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
          Back to Accounts
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

  // If a user has not selected an account, we show the account table
  return (
    <Box>
      <FilterSort onFilterSort={handleFilterSort} type="accounts" />
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {renderSortableHeader('name', 'Account Name')}
              {renderSortableHeader('repId', 'Rep ID')}
              {renderSortableHeader('accountNumber', 'Account Number')}
              {renderSortableHeader('custodian', 'Custodian')}
              {renderSortableHeader('balance', 'Balance', 'right')}
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccounts.map((account) => (
              <TableRow key={account.id} hover>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.repId}</TableCell>
                <TableCell>{account.accountNumber}</TableCell>
                <TableCell>{account.custodian}</TableCell>
                <TableCell align="right">{formatCurrency(account.balance)}</TableCell>
                <TableCell align="center">
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => handleViewHoldings(account)}
                  >
                    View Holdings
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
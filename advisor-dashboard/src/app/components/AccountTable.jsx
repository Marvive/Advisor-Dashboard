'use client';
import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Box, Button, CircularProgress
} from '@mui/material';
import HoldingTable from './HoldingTable';
import FilterSort from './FilterSort';

export default function AccountTable({ advisorId }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`/api/accounts?advisorId=${advisorId}`);
        const data = await response.json();
        console.log("Fetched accounts:", data); // Debug log
        setAccounts(data);
        setFilteredAccounts(data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccounts();
  }, [advisorId]);
  
  const handleViewHoldings = (account) => {
    console.log("Selected account:", account); // Debug log
    setSelectedAccount(account);
  };
  
  const handleBack = () => {
    setSelectedAccount(null);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const handleFilterSort = ({ sortField, sortOrder, filterValue }) => {
    let filtered = [...accounts];
    
    // Apply filter
    if (filterValue) {
      const lowerCaseFilter = filterValue.toLowerCase();
      filtered = filtered.filter(account => 
        account.name.toLowerCase().includes(lowerCaseFilter) ||
        account.custodian.toLowerCase().includes(lowerCaseFilter) ||
        account.number.toLowerCase().includes(lowerCaseFilter)
      );
    }
    
    // Apply sort
    if (sortField) {
      filtered.sort((a, b) => {
        if (typeof a[sortField] === 'string') {
          return sortOrder === 'asc' 
            ? a[sortField].localeCompare(b[sortField])
            : b[sortField].localeCompare(a[sortField]);
        } else {
          return sortOrder === 'asc'
            ? a[sortField] - b[sortField]
            : b[sortField] - a[sortField];
        }
      });
    }
    
    setFilteredAccounts(filtered);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (selectedAccount) {
    return (
      <Box>
        <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
          Back to Accounts
        </Button>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Holdings for {selectedAccount.name}
        </Typography>
        <HoldingTable account={selectedAccount} />
      </Box>
    );
  }
  
  return (
    <Box>
      <FilterSort onFilterSort={handleFilterSort} type="accounts" />
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Account Name</strong></TableCell>
              <TableCell><strong>Rep ID</strong></TableCell>
              <TableCell><strong>Account Number</strong></TableCell>
              <TableCell><strong>Custodian</strong></TableCell>
              <TableCell align="right"><strong>Balance</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccounts.map((account) => (
              <TableRow key={account.number} hover>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.repId}</TableCell>
                <TableCell>{account.number}</TableCell>
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
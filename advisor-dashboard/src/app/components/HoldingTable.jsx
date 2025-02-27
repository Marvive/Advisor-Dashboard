'use client';
import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Box, CircularProgress
} from '@mui/material';
import FilterSort from './FilterSort';

export default function HoldingTable({ account }) {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredHoldings, setFilteredHoldings] = useState([]);
  
  useEffect(() => {
    // Instead of fetching from API, use the holdings data from the account
    if (account && account.holdings) {
      setHoldings(account.holdings);
      setFilteredHoldings(account.holdings);
      setLoading(false);
    } else {
      console.error('No holdings data found in account:', account);
      setLoading(false);
    }
  }, [account]);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const handleFilterSort = ({ sortField, sortOrder, filterValue }) => {
    let filtered = [...holdings];
    
    // Apply filter
    if (filterValue) {
      const lowerCaseFilter = filterValue.toLowerCase();
      filtered = filtered.filter(holding => 
        holding.ticker.toLowerCase().includes(lowerCaseFilter)
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
    
    setFilteredHoldings(filtered);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Calculate total value of all holdings
  const totalValue = filteredHoldings.reduce((sum, holding) => 
    sum + (holding.units * holding.unitPrice), 0
  );
  
  return (
    <Box>
      <FilterSort onFilterSort={handleFilterSort} type="holdings" />
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Ticker</strong></TableCell>
              <TableCell align="right"><strong>Units</strong></TableCell>
              <TableCell align="right"><strong>Unit Price</strong></TableCell>
              <TableCell align="right"><strong>Value</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHoldings.map((holding, index) => (
              <TableRow key={index} hover>
                <TableCell>{holding.ticker}</TableCell>
                <TableCell align="right">{holding.units.toLocaleString()}</TableCell>
                <TableCell align="right">${holding.unitPrice.toFixed(2)}</TableCell>
                <TableCell align="right">{formatCurrency(holding.units * holding.unitPrice)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right"><strong>Total:</strong></TableCell>
              <TableCell align="right"><strong>{formatCurrency(totalValue)}</strong></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 
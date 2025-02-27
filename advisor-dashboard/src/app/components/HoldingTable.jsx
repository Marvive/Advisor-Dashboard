'use client';
import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Box, CircularProgress
} from '@mui/material';
import FilterSort from './FilterSort';
import { formatCurrency } from '../utils/formatters';
import { getSearchFields, filterAndSortItems } from '../utils/tabHelpers';

export default function HoldingTable({ account }) {
  // State Variables
  const [holdings, setHoldings] = useState([]); // Stores holdings
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [filteredHoldings, setFilteredHoldings] = useState([]); // Stores Filtered holdings
  
  // useEffect runs after render - here it's used to fetch data when component mounts
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
  }, [account]); // Refetch if account changes

  const handleFilterSort = (options) => {
    const searchFields = getSearchFields('holdings');
    const filtered = filterAndSortItems(holdings, { ...options, searchFields });
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
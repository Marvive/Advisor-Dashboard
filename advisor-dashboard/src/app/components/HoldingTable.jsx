'use client';
import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Box, CircularProgress
} from '@mui/material';
import FilterSort from './FilterSort';

export default function HoldingTable({ accountId }) {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredHoldings, setFilteredHoldings] = useState([]);
  
  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const response = await fetch(`/api/holdings?accountId=${accountId}`);
        const data = await response.json();
        setHoldings(data);
        setFilteredHoldings(data);
      } catch (error) {
        console.error('Error fetching holdings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHoldings();
  }, [accountId]);
  
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
        holding.securityName.toLowerCase().includes(lowerCaseFilter) ||
        holding.ticker.toLowerCase().includes(lowerCaseFilter) ||
        holding.assetClass.toLowerCase().includes(lowerCaseFilter)
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
  
  return (
    <Box>
      <FilterSort onFilterSort={handleFilterSort} type="holdings" />
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Security Name</strong></TableCell>
              <TableCell><strong>Ticker</strong></TableCell>
              <TableCell><strong>Asset Class</strong></TableCell>
              <TableCell align="right"><strong>Shares</strong></TableCell>
              <TableCell align="right"><strong>Price</strong></TableCell>
              <TableCell align="right"><strong>Value</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHoldings.map((holding) => (
              <TableRow key={holding.id} hover>
                <TableCell>{holding.securityName}</TableCell>
                <TableCell>{holding.ticker}</TableCell>
                <TableCell>{holding.assetClass}</TableCell>
                <TableCell align="right">{holding.shares.toLocaleString()}</TableCell>
                <TableCell align="right">${holding.price.toFixed(2)}</TableCell>
                <TableCell align="right">{formatCurrency(holding.value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 
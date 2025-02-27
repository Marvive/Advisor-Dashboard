'use client';
import { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';

export default function FilterSort({ onFilterSort, type }) {
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterValue, setFilterValue] = useState('');
  
  const handleApply = () => {
    onFilterSort({
      sortField,
      sortOrder,
      filterValue
    });
  };
  
  const getSortOptions = () => {
    switch(type) {
      case 'advisors':
        return [
          { value: 'name', label: 'Name' },
          { value: 'totalAssets', label: 'Total Assets' },
          { value: 'clientCount', label: 'Client Count' },
          { value: 'accountCount', label: 'Account Count' }
        ];
      case 'accounts':
        return [
          { value: 'name', label: 'Account Name' },
          { value: 'repId', label: 'Rep ID' },
          { value: 'number', label: 'Account Number' },
          { value: 'custodian', label: 'Custodian' },
          { value: 'balance', label: 'Balance' }
        ];
      case 'holdings':
        return [
          { value: 'ticker', label: 'Ticker' },
          { value: 'units', label: 'Units' },
          { value: 'unitPrice', label: 'Unit Price' },
        ];
      default:
        return [];
    }
  };
  
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-end' }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortField}
          label="Sort By"
          onChange={(e) => setSortField(e.target.value)}
        >
          {getSortOptions().map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Order</InputLabel>
        <Select
          value={sortOrder}
          label="Order"
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>
      
      <TextField
        label="Filter"
        variant="outlined"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        placeholder="Search..."
      />
      
      <Button variant="contained" onClick={handleApply}>
        Apply
      </Button>
    </Box>
  );
}
/**
 * FilterSort.jsx
 * 
 * A reusable component that provides UI controls for filtering and sorting data.
 * This component is used across different data views (advisors, accounts, holdings)
 * and provides a consistent interface for data manipulation.
 */

'use client'; // Mark as client component for Next.js

import { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';

/**
 * FilterSort Component
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onFilterSort - Callback function that receives filter/sort criteria
 * @param {string} props.type - Data type to filter/sort ('advisors', 'accounts', or 'holdings')
 * @returns {JSX.Element} - Rendered component
 */
export default function FilterSort({ onFilterSort, type }) {
  // State for tracking sort field (which column to sort by)
  const [sortField, setSortField] = useState('');
  
  // State for tracking sort order ('asc' for ascending, 'desc' for descending)
  // 'asc' is just a string identifier we define - it could be any value as long as
  // the parent component understands what it means
  const [sortOrder, setSortOrder] = useState('asc');
  
  // State for tracking filter text input
  const [filterValue, setFilterValue] = useState('');
  
  /**
   * Handles the Apply button click by passing current filter/sort criteria
   * to the parent component via the onFilterSort callback
   */
  const handleApply = () => {
    onFilterSort({
      sortField,
      sortOrder,
      filterValue
    });
  };
  
  /**
   * Returns the appropriate sort options based on the data type.
   * Each option has a value (used in sorting logic) and a label (displayed to user).
   * 
   * @returns {Array} Array of sort option objects { value, label }
   */
  const getSortOptions = () => {
    switch(type) {
      case 'advisors':
        // Sort options for advisor data
        return [
          { value: 'name', label: 'Name' },
          { value: 'totalAssets', label: 'Total Assets' },
          { value: 'clientCount', label: 'Client Count' },
          { value: 'accountCount', label: 'Account Count' }
        ];
      case 'accounts':
        // Sort options for account data
        return [
          { value: 'name', label: 'Account Name' },
          { value: 'repId', label: 'Rep ID' },
          { value: 'number', label: 'Account Number' },
          { value: 'custodian', label: 'Custodian' },
          { value: 'balance', label: 'Balance' }
        ];
      case 'holdings':
        // Sort options for holdings data
        return [
          { value: 'ticker', label: 'Ticker' },
          { value: 'units', label: 'Units' },
          { value: 'unitPrice', label: 'Unit Price' },
        ];
      default:
        // Return empty array if type is not recognized
        return [];
    }
  };
  
  return (
    // Container with flex layout and spacing between elements
    <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-end' }}>
      {/* Sort Field Dropdown */}
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortField}
          label="Sort By"
          onChange={(e) => setSortField(e.target.value)}
        >
          {/* Dynamically generate menu items based on data type */}
          {getSortOptions().map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {/* Sort Order Dropdown */}
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Order</InputLabel>
        <Select
          value={sortOrder}
          label="Order"
          onChange={(e) => setSortOrder(e.target.value)}
        >
          {/* Fixed options for sort direction */}
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>
      
      {/* Filter Text Input */}
      <TextField
        label="Filter"
        variant="outlined"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        placeholder="Search..."
      />
      
      {/* Apply Button */}
      <Button variant="contained" onClick={handleApply}>
        Apply
      </Button>
    </Box>
  );
}
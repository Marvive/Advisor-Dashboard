/**
 * FilterSort.tsx
 * 
 * A reusable component that provides UI controls for filtering data.
 * This component is used across different data views (advisors, accounts, holdings)
 * and provides a consistent interface for data filtering.
 */

'use client'; // Mark as client component for Next.js

import React, { useState } from 'react';
import { Box, TextField, Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { FilterSortProps } from '../types';

/**
 * FilterComponent
 * 
 * @param props - Component props
 * @param props.onFilterSort - Callback function that receives filter criteria
 * @param props.type - Data type to filter ('advisors', 'accounts', or 'holdings')
 * @returns Rendered component
 */
export default function FilterSort({ onFilterSort, type }: FilterSortProps) {
  // State for tracking filter text input
  const [filterValue, setFilterValue] = useState<string>('');
  
  /**
   * Handles the Apply button click by passing current filter criteria
   * to the parent component via the onFilterSort callback
   */
  const handleApply = () => {
    onFilterSort({
      sortField: '',
      sortOrder: 'asc',
      filterValue
    });
  };

  // Handle Enter key press to apply filter
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleApply();
    }
  };
  
  return (
    // Container with flex layout and spacing between elements
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      mb: 2, 
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      maxWidth: '400px'
    }}>
      {/* Filter Text Input */}
      <TextField
        label="Filter"
        variant="outlined"
        size="small"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search..."
        sx={{ 
          width: '300px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />
      
      {/* Apply Button */}
      <Button 
        variant="contained" 
        onClick={handleApply}
        sx={{ 
          borderRadius: '8px',
          textTransform: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          height: '40px'
        }}
      >
        Apply
      </Button>
    </Box>
  );
}
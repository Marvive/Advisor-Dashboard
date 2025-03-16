/**
 * HoldingTable.jsx
 * 
 * A component that displays a table of financial holdings for a specific account.
 * It shows ticker symbols, units, unit prices, and calculated values with a total at the bottom.
 * Includes filtering and sorting capabilities through the FilterSort component.
 */

'use client'; // Mark as client component for Next.js

import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Box, CircularProgress
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FilterSort from './FilterSort';
import { formatCurrency } from '../utils/formatters';
import { getSearchFields, filterAndSortItems } from '../utils/tabHelpers';

/**
 * HoldingTable Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.account - The account object containing holdings data
 * @param {Array} props.account.holdings - Array of holding objects with ticker, units, and unitPrice
 * @returns {JSX.Element} - Rendered component
 */
export default function HoldingTable({ account }) {
  // State for storing the original holdings data from the account
  const [holdings, setHoldings] = useState([]);
  
  // State for tracking if data is still loading
  const [loading, setLoading] = useState(true);
  
  // State for storing filtered/sorted holdings (what's actually displayed)
  const [filteredHoldings, setFilteredHoldings] = useState([]);
  
  // State for column sorting
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  
  /**
   * Effect hook to initialize holdings data from the account prop
   * Runs when the component mounts or when the account prop changes
   */
  useEffect(() => {
    // Instead of fetching from API, use the holdings data from the account object
    if (account && account.holdings) {
      setHoldings(account.holdings);
      setFilteredHoldings(account.holdings); // Initialize filtered data with all holdings
      setLoading(false); // Data is ready, so we're no longer loading
    } else {
      // Handle the case where account or holdings data is missing
      console.error('No holdings data found in account:', account);
      setLoading(false); // Still need to set loading to false to avoid infinite loading state
    }
  }, [account]); // Dependency array - re-run if account changes

  /**
   * Handles filtering and sorting of holdings data
   * Called when the user applies filters/sorting via the FilterSort component
   * 
   * @param {Object} options - Filter and sort criteria
   * @param {string} options.sortField - Field to sort by
   * @param {string} options.sortOrder - Sort direction ('asc' or 'desc')
   * @param {string} options.filterValue - Text to filter by
   */
  const handleFilterSort = (options) => {
    // Update sort state
    setSortField(options.sortField);
    setSortDirection(options.sortOrder);
    
    // Get the fields that can be searched for this data type
    const searchFields = getSearchFields('holdings');
    
    // Apply filtering and sorting using the utility function
    const filtered = filterAndSortItems(holdings, { ...options, searchFields });
    
    // Update state with the filtered/sorted data
    setFilteredHoldings(filtered);
  };
  
  /**
   * Handles sorting when a column header is clicked
   * 
   * @param {string} field - The field to sort by
   */
  const handleHeaderSort = (field) => {
    let newDirection = 'asc';
    
    // If clicking the same field, toggle direction
    if (field === sortField) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    // Update sort state
    setSortField(field);
    setSortDirection(newDirection);
    
    // Apply sorting
    const searchFields = getSearchFields('holdings');
    const filtered = filterAndSortItems(holdings, { 
      sortField: field, 
      sortOrder: newDirection, 
      filterValue: '', 
      searchFields 
    });
    setFilteredHoldings(filtered);
  };
  
  /**
   * Renders a sortable column header
   * 
   * @param {string} field - The field to sort by when clicked
   * @param {string} label - The display text for the header
   * @param {string} align - Text alignment ('left', 'right', 'center')
   * @returns {JSX.Element} - The rendered header cell
   */
  const renderSortableHeader = (field, label, align = 'left') => (
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
  
  // If data is still loading, show a loading spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  /**
   * Calculate the total value of all holdings by summing (units × unitPrice) for each holding
   * This is a derived value calculated during render, not stored in state
   */
  const totalValue = filteredHoldings.reduce((sum, holding) => 
    sum + (holding.units * holding.unitPrice), 0
  );
  
  // Render the holdings table with filter controls
  return (
    <Box>
      {/* Filter and sort controls */}
      <FilterSort onFilterSort={handleFilterSort} type="holdings" />
      
      {/* Holdings data table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          {/* Table header */}
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {renderSortableHeader('ticker', 'Ticker')}
              {renderSortableHeader('units', 'Units', 'right')}
              {renderSortableHeader('unitPrice', 'Unit Price', 'right')}
              <TableCell align="right"><strong>Value</strong></TableCell>
            </TableRow>
          </TableHead>
          
          {/* Table body with holdings data */}
          <TableBody>
            {/* Map through filtered holdings to create table rows */}
            {filteredHoldings.map((holding, index) => (
              <TableRow key={index} hover>
                <TableCell>{holding.ticker}</TableCell>
                <TableCell align="right">{holding.units.toLocaleString()}</TableCell>
                <TableCell align="right">${holding.unitPrice.toFixed(2)}</TableCell>
                <TableCell align="right">{formatCurrency(holding.units * holding.unitPrice)}</TableCell>
              </TableRow>
            ))}
            
            {/* Total row at the bottom */}
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
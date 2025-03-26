/**
 * HoldingTable.tsx
 * 
 * A component that displays a table of financial holdings for a specific account.
 * It shows ticker symbols, units, unit prices, and calculated values with a total at the bottom.
 * Includes filtering and sorting capabilities through the FilterSort component.
 */

'use client'; // Mark as client component for Next.js

import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Box, CircularProgress, Typography, Button
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FilterSort from './FilterSort';
import { formatCurrency } from '../utils/formatters';
import { getSearchFields, filterAndSortItems } from '../utils/tabHelpers';
import { Holding, HoldingTableProps, FilterSortOptions } from '../types';

// Interface for API response structure
interface ApiHolding {
  id: number;
  accountId: number;
  ticker: string;
  securityName?: string;
  assetClass?: string;
  shares: number;
  price: number;
  value: number;
}

/**
 * HoldingTable Component
 * 
 * @param props - Component props
 * @param props.accountId - The ID of the account to display holdings for
 * @param props.accountNumber - The account number to help identify the right account
 * @param props.onBack - Callback function to return to the previous view
 * @returns Rendered component
 */
export default function HoldingTable({ accountId, accountNumber, onBack }: HoldingTableProps) {
  // State for storing the original holdings data from the account
  const [holdings, setHoldings] = useState<Holding[]>([]);
  
  // State for tracking if data is still loading
  const [loading, setLoading] = useState<boolean>(true);
  
  // State for storing filtered/sorted holdings (what's actually displayed)
  const [filteredHoldings, setFilteredHoldings] = useState<Holding[]>([]);
  
  // State for column sorting
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  /**
   * Effect hook to fetch holdings data for the account
   * Runs when the component mounts or when the accountId prop changes
   */
  useEffect(() => {
    console.log("HoldingTable useEffect - accountId:", accountId, "accountNumber:", accountNumber);
    
    const fetchHoldings = async () => {
      try {
        // Include accountNumber for more reliable account lookup
        const url = `/api/holdings?accountId=${accountId}&accountNumber=${accountNumber}`;
        console.log("Fetching holdings from:", url);
        const response = await fetch(url);
        const apiData: ApiHolding[] = await response.json();
        console.log("API response data:", apiData, "length:", apiData.length);
        
        if (apiData.length === 0) {
          console.warn("No holdings found for accountId:", accountId, "accountNumber:", accountNumber);
          setLoading(false);
          return;
        }
        
        // Map API data to the Holding interface structure
        const mappedHoldings: Holding[] = apiData.map(item => ({
          id: String(item.id),
          accountId: String(item.accountId),
          ticker: item.ticker,
          units: item.shares,
          unitPrice: item.price,
          totalValue: item.value
        }));
        
        console.log("Mapped holdings:", mappedHoldings);
        setHoldings(mappedHoldings);
        setFilteredHoldings(mappedHoldings);
      } catch (error) {
        console.error('Error fetching holdings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (accountId && accountNumber) {
      fetchHoldings();
    } else {
      console.error("Missing accountId or accountNumber in HoldingTable");
      setLoading(false);
    }
  }, [accountId, accountNumber]); // Dependency array - re-run if accountId or accountNumber changes

  /**
   * Handles filtering and sorting of holdings data
   * Called when the user applies filters/sorting via the FilterSort component
   */
  const handleFilterSort = (options: FilterSortOptions) => {
    // Don't update sort state from options
    // Keep the current sort state set by column header clicks
    
    // Get the fields that can be searched for this data type
    const searchFields = getSearchFields('holdings');
    
    // Apply filtering with the current sort settings
    const filtered = filterAndSortItems(holdings, { 
      ...options, 
      sortField, 
      sortOrder: sortDirection, 
      searchFields 
    });
    
    // Update state with the filtered/sorted data
    setFilteredHoldings(filtered);
  };
  
  /**
   * Handles sorting when a column header is clicked
   * 
   * @param field - The field to sort by
   */
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
   * @param field - The field to sort by when clicked
   * @param label - The display text for the header
   * @param align - Text alignment ('left', 'right', 'center')
   * @returns The rendered header cell
   */
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
  
  // If data is still loading, show a loading spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // If no holdings were found, show a message
  if (holdings.length === 0) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">
          No holdings found for this account.
        </Typography>
        <Button 
          variant="contained" 
          onClick={onBack} 
          sx={{ mt: 2 }}
        >
          Back to Accounts
        </Button>
      </Box>
    );
  }
  
  /**
   * Calculate the total value of all holdings by summing the totalValue for each holding
   * This is a derived value calculated during render, not stored in state
   */
  const totalValue = filteredHoldings.reduce((sum, holding) => 
    sum + holding.totalValue, 0
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
            {filteredHoldings.map((holding) => (
              <TableRow key={holding.id} hover>
                <TableCell>{holding.ticker}</TableCell>
                <TableCell align="right">{holding.units.toLocaleString()}</TableCell>
                <TableCell align="right">${holding.unitPrice.toFixed(2)}</TableCell>
                <TableCell align="right">{formatCurrency(holding.totalValue)}</TableCell>
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
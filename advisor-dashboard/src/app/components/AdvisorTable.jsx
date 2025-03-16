'use client'; // tells next.js to render this component on the client
import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Box, Button, CircularProgress
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccountTable from './AccountTable';
import FilterSort from './FilterSort';
import { formatCurrency } from '../utils/formatters';
import { getSearchFields, filterAndSortItems } from '../utils/tabHelpers';

export default function AdvisorTable() {
  // state variables to store the advisors, loading state, selected advisor, and filtered advisors
  const [advisors, setAdvisors] = useState([]); // List of advisors
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedAdvisor, setSelectedAdvisor] = useState(null); // Selected advisor
  const [filteredAdvisors, setFilteredAdvisors] = useState([]); // Filtered advisors
  
  // State for column sorting
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // useEffect runs after render - here it's used to fetch data after the component mounts
  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        // Fetch the advisors from the API
        const response = await fetch('/api/advisors');
        const data = await response.json();
        // Update the state variables with the fetched data
        setAdvisors(data);
        setFilteredAdvisors(data);
      } catch (error) {
        console.error('Error fetching advisors:', error);
      } finally {
        // Set the loading state to false after the data has been fetched
        setLoading(false);
      }
    };
    
    fetchAdvisors();
  }, []); // Empty array means this effect only runs once after the initial render
  
  // When a user clicks "View Accounts" for an advisor, we set the selected advisor to the advisor in question
  const handleViewAccounts = (advisor) => {
    setSelectedAdvisor(advisor);
  };

  // When a user clicks "Back" from the AccountTable, we set the selected advisor to null
  const handleBack = () => {
    setSelectedAdvisor(null); // Clears the selected advisor and returns
    setFilteredAdvisors(advisors); // Reset filtered advisors to show all advisors
  };
  
  // This function filters and sorts the advisors
  const handleFilterSort = (options) => {
    setSortField(options.sortField);
    setSortDirection(options.sortOrder);
    const searchFields = getSearchFields('advisors');
    const filtered = filterAndSortItems(advisors, { ...options, searchFields });
    setFilteredAdvisors(filtered);
  };
  
  // Handle column header click for sorting
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
    const searchFields = getSearchFields('advisors');
    const filtered = filterAndSortItems(advisors, { 
      sortField: field, 
      sortOrder: newDirection, 
      filterValue: '', 
      searchFields 
    });
    setFilteredAdvisors(filtered);
  };
  
  // Render a sortable column header
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
  
  // Loading state - if the data is still loading, we show a loading spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // If a user has selected an advisor, we show the accounts for that advisor
  if (selectedAdvisor) {
    return (
      <Box>
        <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
          Back to Advisors
        </Button>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Accounts Managed by {selectedAdvisor.name}
        </Typography>
        <AccountTable advisorId={selectedAdvisor.id} />
      </Box>
    );
  }
  
  // If a user has not selected an advisor, we show the advisor table
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Compound Planning - Advisor Dashboard
      </Typography>
      
      <FilterSort onFilterSort={handleFilterSort} type="advisors" />
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {renderSortableHeader('name', 'Advisor Name')}
              {renderSortableHeader('email', 'Email')}
              {renderSortableHeader('accountCount', 'Accounts', 'right')}
              {renderSortableHeader('totalAssets', 'Total Assets', 'right')}
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdvisors.map((advisor) => (
              <TableRow key={advisor.id} hover>
                <TableCell>{advisor.name}</TableCell>
                <TableCell>{advisor.email}</TableCell>
                <TableCell align="right">{advisor.accountCount}</TableCell>
                <TableCell align="right">{formatCurrency(advisor.totalAssets)}</TableCell>
                <TableCell align="center">
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => handleViewAccounts(advisor)}
                  >
                    View Accounts
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
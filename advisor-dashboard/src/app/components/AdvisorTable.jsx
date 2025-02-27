'use client'; // tells next.js to render this component on the client
import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Box, Button, CircularProgress
} from '@mui/material';
import AccountTable from './AccountTable';
import FilterSort from './FilterSort';

export default function AdvisorTable() {
  // state variables to store the advisors, loading state, selected advisor, and filtered advisors
  const [advisors, setAdvisors] = useState([]); // List of advisors
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedAdvisor, setSelectedAdvisor] = useState(null); // Selected advisor
  const [filteredAdvisors, setFilteredAdvisors] = useState([]); // Filtered advisors
  
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
  };

  // This function formats the currency to USD
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // This function filters and sorts the advisors
  const handleFilterSort = ({ sortField, sortOrder, filterValue }) => {
    let filtered = [...advisors];
    
    // Apply filter - if the user has typed in a name or email, we filter the advisors by that name or email
    if (filterValue) {
      const lowerCaseFilter = filterValue.toLowerCase();
      filtered = filtered.filter(advisor => 
        advisor.name.toLowerCase().includes(lowerCaseFilter) ||
        advisor.email.toLowerCase().includes(lowerCaseFilter)
      );
    }
    
    // Apply sort - if the user has clicked on a column header (in the sort by), we sort the advisors by that column
    if (sortField) {
      filtered.sort((a, b) => {
        if (typeof a[sortField] === 'string') {
          // Sort Alphabetically if a string
          return sortOrder === 'asc' 
            ? a[sortField].localeCompare(b[sortField])
            : b[sortField].localeCompare(a[sortField]);
        } else {
          // Sort Numerically if a number
          return sortOrder === 'asc'
            ? a[sortField] - b[sortField]
            : b[sortField] - a[sortField];
        }
      });
    }
    
    setFilteredAdvisors(filtered); // Update state with filtered/sorted advisors
  };
  
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
              <TableCell><strong>Advisor Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell align="right"><strong>Accounts</strong></TableCell>
              <TableCell align="right"><strong>Total Assets</strong></TableCell>
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
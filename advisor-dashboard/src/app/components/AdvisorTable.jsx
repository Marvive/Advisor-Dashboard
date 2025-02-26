'use client';
import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Box, Button, CircularProgress
} from '@mui/material';
import AccountTable from './AccountTable';
import FilterSort from './FilterSort';

export default function AdvisorTable() {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [filteredAdvisors, setFilteredAdvisors] = useState([]);
  
  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const response = await fetch('/api/advisors');
        const data = await response.json();
        setAdvisors(data);
        setFilteredAdvisors(data);
      } catch (error) {
        console.error('Error fetching advisors:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdvisors();
  }, []);
  
  const handleViewAccounts = (advisor) => {
    setSelectedAdvisor(advisor);
  };
  
  const handleBack = () => {
    setSelectedAdvisor(null);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const handleFilterSort = ({ sortField, sortOrder, filterValue }) => {
    let filtered = [...advisors];
    
    // Apply filter
    if (filterValue) {
      const lowerCaseFilter = filterValue.toLowerCase();
      filtered = filtered.filter(advisor => 
        advisor.name.toLowerCase().includes(lowerCaseFilter) ||
        advisor.email.toLowerCase().includes(lowerCaseFilter)
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
    
    setFilteredAdvisors(filtered);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (selectedAdvisor) {
    return (
      <Box>
        <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
          Back to Advisors
        </Button>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Accounts managed by {selectedAdvisor.name}
        </Typography>
        <AccountTable advisorId={selectedAdvisor.id} />
      </Box>
    );
  }
  
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
'use client';

import React, { useState, useEffect } from 'react';
import Layout, { NavigationProvider } from './components/Layout';
import AdvisorTable from './components/AdvisorTable';
import { Account } from './types';

// Storage key for the viewed accounts
const VIEWED_ACCOUNTS_STORAGE_KEY = 'wealthDynamics_viewedAccounts';

// Validate that the loaded data matches Account structure
function isValidAccountArray(data: any): data is Account[] {
  if (!Array.isArray(data)) return false;
  
  return data.every(item => 
    item !== null &&
    typeof item === 'object' &&
    'id' in item &&
    'name' in item &&
    'accountNumber' in item &&
    'custodian' in item
  );
}

export default function Home() {
  // Add state for tracking viewed accounts at the top level
  const [viewedAccounts, setViewedAccounts] = useState<Account[]>([]);
  
  // Load the viewed accounts from localStorage when the component mounts
  useEffect(() => {
    try {
      const savedAccounts = localStorage.getItem(VIEWED_ACCOUNTS_STORAGE_KEY);
      if (savedAccounts) {
        const parsedData = JSON.parse(savedAccounts);
        
        // Validate the data before using it
        if (isValidAccountArray(parsedData)) {
          setViewedAccounts(parsedData);
        } else {
          console.warn('Invalid data structure found in localStorage, using empty array instead');
          localStorage.removeItem(VIEWED_ACCOUNTS_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading viewed accounts from localStorage:', error);
      // If there's an error loading from localStorage, we keep the empty array
      localStorage.removeItem(VIEWED_ACCOUNTS_STORAGE_KEY);
    }
  }, []);
  
  // Custom setter to update both state and localStorage
  const handleSetViewedAccounts = (newAccounts: Account[] | ((prev: Account[]) => Account[])) => {
    setViewedAccounts((prevAccounts) => {
      // Handle functional updates (when the new state depends on the previous state)
      const updatedAccounts = typeof newAccounts === 'function'
        ? newAccounts(prevAccounts)
        : newAccounts;
      
      // Limit to the 10 most recent viewed accounts
      const limitedAccounts = updatedAccounts.slice(-10);
      
      try {
        // Store the updated accounts in localStorage
        localStorage.setItem(VIEWED_ACCOUNTS_STORAGE_KEY, JSON.stringify(limitedAccounts));
      } catch (error) {
        console.error('Error saving viewed accounts to localStorage:', error);
      }
      
      return limitedAccounts;
    });
  };
  
  return (
    <NavigationProvider>
      <Layout>
        <AdvisorTable 
          viewedAccounts={viewedAccounts} 
          setViewedAccounts={handleSetViewedAccounts} 
        />
      </Layout>
    </NavigationProvider>
  );
} 
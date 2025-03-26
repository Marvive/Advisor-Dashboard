'use client';

import React, { useState } from 'react';
import Layout from './components/Layout';
import AdvisorTable from './components/AdvisorTable';
import { Account } from './types';

export default function Home() {
  // Add state for tracking viewed accounts at the top level
  const [viewedAccounts, setViewedAccounts] = useState<Account[]>([]);
  
  return (
    <Layout>
      <AdvisorTable 
        viewedAccounts={viewedAccounts} 
        setViewedAccounts={setViewedAccounts} 
      />
    </Layout>
  );
} 
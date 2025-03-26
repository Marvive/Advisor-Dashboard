'use client';
import React from 'react';
// bullet icons for list items
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
// Import a bullet icon (you may need to adjust this import based on what icons you have)
import CircleIcon from '@mui/icons-material/Circle'; // or another icon of your choice
import { LastViewedHistoryProps } from '../types';

export default function LastViewedHistory({ accounts }: LastViewedHistoryProps) {
    // Renamed from account to accounts for clarity, since it should be an array
    return (
        <List>
            {accounts && accounts.length > 0 ? (
                accounts.map((account) => (
                    <ListItem key={account.id}>
                        <ListItemIcon>
                            <CircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={account.name} />
                    </ListItem>
                ))
            ) : (
                <ListItem>
                    <ListItemText primary="No accounts viewed recently" />
                </ListItem>
            )}
        </List>
    );
}
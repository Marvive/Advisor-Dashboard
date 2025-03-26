'use client';
import React from 'react';
// bullet icons for list items
import { List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
// Import a bullet icon (you may need to adjust this import based on what icons you have)
import CircleIcon from '@mui/icons-material/Circle'; // or another icon of your choice
import HistoryIcon from '@mui/icons-material/History'; // Icon for history items
import { LastViewedHistoryProps } from '../types';

export default function LastViewedHistory({ accounts = [], onAccountClick }: LastViewedHistoryProps) {
    // Handle the click on an account
    const handleClick = (account: any) => {
        onAccountClick(account);
    };

    return (
        <List sx={{ 
            mb: 3, 
            bgcolor: 'background.paper',
            border: '1px solid #eee',
            borderRadius: 1,
            maxHeight: '200px',
            overflow: 'auto'
        }}>
            {accounts && accounts.length > 0 ? (
                <>
                    <ListItem>
                        <ListItemText 
                            primary="Recently Viewed Accounts" 
                            primaryTypographyProps={{ 
                                fontWeight: 'bold', 
                                variant: 'subtitle1',
                                color: 'primary' 
                            }} 
                        />
                    </ListItem>
                    {accounts.map((account) => (
                        <ListItemButton 
                            key={account.id} 
                            onClick={() => handleClick(account)}
                            sx={{ 
                                '&:hover': { 
                                    bgcolor: 'action.hover' 
                                },
                                py: 0.5
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                <HistoryIcon fontSize="small" color="action" />
                            </ListItemIcon>
                            <ListItemText 
                                primary={account.name} 
                                secondary={`${account.custodian} - ${account.accountNumber}`}
                                primaryTypographyProps={{ 
                                    variant: 'body2',
                                    fontWeight: 'medium' 
                                }}
                                secondaryTypographyProps={{ 
                                    variant: 'caption',
                                    color: 'text.secondary'
                                }}
                            />
                        </ListItemButton>
                    ))}
                </>
            ) : (
                <ListItem>
                    <ListItemText 
                        primary="No accounts viewed recently" 
                        primaryTypographyProps={{ 
                            fontStyle: 'italic',
                            color: 'text.secondary' 
                        }}
                    />
                </ListItem>
            )}
        </List>
    );
}
'use client';
import React, { useState } from 'react';
// bullet icons for list items
import { 
    List, ListItem, ListItemIcon, ListItemText, ListItemButton, 
    Collapse, IconButton, Box
} from '@mui/material';
// Import a bullet icon (you may need to adjust this import based on what icons you have)
import CircleIcon from '@mui/icons-material/Circle'; // or another icon of your choice
import HistoryIcon from '@mui/icons-material/History'; // Icon for history items
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { LastViewedHistoryProps } from '../types';

export default function LastViewedHistory({ accounts = [], onAccountClick }: LastViewedHistoryProps) {
    const [expanded, setExpanded] = useState(true);
    
    // Handle the click on an account
    const handleClick = (account: any) => {
        onAccountClick(account);
    };
    
    // Toggle the expanded state
    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <List sx={{ 
            mb: 3, 
            bgcolor: 'background.paper',
            border: '1px solid #eee',
            borderRadius: 1,
            overflow: 'hidden'
        }}>
            <ListItem 
                sx={{ 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } 
                }}
            >
                <ListItemText 
                    primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            Recently Viewed Accounts
                            {accounts && accounts.length > 0 && (
                                <Box component="span" sx={{ ml: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                                    ({accounts.length})
                                </Box>
                            )}
                        </Box>
                    }
                    primaryTypographyProps={{ 
                        fontWeight: 'bold', 
                        variant: 'subtitle1',
                        color: 'primary' 
                    }} 
                    onClick={toggleExpanded}
                />
                <IconButton size="small" onClick={toggleExpanded}>
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </ListItem>
            
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box sx={{ maxHeight: '200px', overflow: 'auto' }}>
                    {accounts && accounts.length > 0 ? (
                        accounts.map((account) => (
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
                        ))
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
                </Box>
            </Collapse>
        </List>
    );
}
import React from 'react';
import { TextField, Box } from '@mui/material';

function SearchBar({ onSearchChange }) {
  return (
    <Box sx={{ marginBottom: '1rem' }}>
      <TextField
        fullWidth
        label="Search by URL..."
        variant="outlined"
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </Box>
  );
}

export default SearchBar;
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function HistoryTable({ analyses, onRowClick }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Summary</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {analyses.map((row) => (
            <TableRow 
              key={row.id} 
              onClick={() => onRowClick(row)}
              hover 
              style={{ cursor: 'pointer' }}
            >
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.url}</TableCell>
              <TableCell>{row.privacy_score}</TableCell>
              <TableCell>{row.summary}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default HistoryTable;
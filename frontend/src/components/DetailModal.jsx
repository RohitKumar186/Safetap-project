import React from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function DetailModal({ analysis, open, handleClose }) {
  if (!analysis) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Detailed Analysis for: {analysis.url}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Score:</strong> {analysis.privacy_score}/100
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <strong>Summary:</strong> {analysis.summary}
        </Typography>
        <Typography sx={{ mt: 2, mb: 1 }}>
          <strong>Detected Clauses:</strong>
        </Typography>
        <Paper variant="outlined" style={{ maxHeight: 300, overflow: 'auto' }}>
          <List dense>
            {analysis.risk_clauses.map((clause, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={clause.clause_text}
                  secondary={`Type: ${clause.risk_type} | Level: ${clause.level}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Modal>
  );
}

export default DetailModal;
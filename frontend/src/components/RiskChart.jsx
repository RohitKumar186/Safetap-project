import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Paper, Typography } from '@mui/material';

function RiskChart({ analyses }) {
  // Logic to count the total number of risk clauses by level
  const riskCounts = { High: 0, Medium: 0, Low: 0 };
  analyses.forEach(analysis => {
    analysis.risk_clauses.forEach(clause => {
      if (clause.level in riskCounts) {
        riskCounts[clause.level]++;
      }
    });
  });

  const chartData = [
    { risk: 'Low', count: riskCounts.Low, color: '#ffc107' },
    { risk: 'Medium', count: riskCounts.Medium, color: '#fd7e14' },
    { risk: 'High', count: riskCounts.High, color: '#dc3545' },
  ];

  return (
    <Paper elevation={3} style={{ padding: '1rem', marginBottom: '2rem' }}>
      <Typography variant="h6" gutterBottom>
        Risk Levels Overview
      </Typography>
      <BarChart
        dataset={chartData}
        xAxis={[{ scaleType: 'band', dataKey: 'risk' }]}
        series={[{ dataKey: 'count', label: 'Number of Clauses', color: '#28a745' }]}
        height={300}
        colors={['#ffc107', '#fd7e14', '#dc3545']}
      />
    </Paper>
  );
}

export default RiskChart;
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Container, CssBaseline } from '@mui/material';
import { getAnalysisHistory } from '../api/analysisApi';
import HistoryTable from '../components/HistoryTable';
import RiskChart from '../components/RiskChart';
import SearchBar from '../components/SearchBar';
import DetailModal from '../components/DetailModal';

function DashboardPage() {
  const [analyses, setAnalyses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getAnalysisHistory().then(data => {
      setAnalyses(data);
    });
  }, []);

  const filteredAnalyses = analyses.filter(analysis =>
    analysis.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (analysis) => {
    setSelectedAnalysis(analysis);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">SafeTap Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '2rem' }}>
        <RiskChart analyses={filteredAnalyses} /> 
        
        <Typography variant="h4" gutterBottom>Analysis History</Typography>
        
        <SearchBar onSearchChange={setSearchQuery} /> 
        
        <HistoryTable analyses={filteredAnalyses} onRowClick={handleRowClick} />

        <DetailModal 
          analysis={selectedAnalysis} 
          open={isModalOpen} 
          handleClose={handleCloseModal} 
        />
      </Container>
    </div>
  );
}

export default DashboardPage;
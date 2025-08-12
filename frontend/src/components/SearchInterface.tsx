import { useState } from 'react';
import {
  Box,
  TextField,
  Paper,
  Typography,
  Container,
  Button,
  IconButton,
  Divider,
  Card,
  CardContent,
  Alert,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { useQuery } from 'react-query';
import type { Filters } from '../types/therapist';
import { getFilters } from '../services/api';
import { v4 as uuidv4 } from 'uuid';
import DynamicFilters from './DynamicFilters';

interface SearchCriteria {
  id: string;
  query: string;
}

interface SearchInterfaceProps {
  onSearch: (criteria: string[], insurance: string[], titles: string[]) => void;
  isLoading: boolean;
  searchResults: any[];
  onFilterChange: (filters: Record<string, string[]>) => void;
  selectedFilters: Record<string, string[]>;
  onClearResults: () => void;
}

export const SearchInterface = ({ onSearch, isLoading, searchResults, onFilterChange, selectedFilters, onClearResults }: SearchInterfaceProps) => {
  const [criteria, setCriteria] = useState<SearchCriteria[]>([
    { id: uuidv4(), query: '' },
  ]);
  const [showExamples, setShowExamples] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useQuery<Filters>('filters', getFilters);

  const exampleCriteria = [
    ['therapist who specializes in anxiety', 'speaks Spanish'],
    ['ADHD specialist', 'works with adults'],
    ['trauma therapist', 'uses EMDR therapy'],
    ['couples counselor', 'accepts Kaiser insurance'],
    ['depression specialist', 'culturally sensitive therapist'],
  ];

  const addCriteria = () => {
    setCriteria([...criteria, { id: uuidv4(), query: '' }]);
  };

  const clearAllResults = () => {
    onClearResults();
  };

  const removeCriteria = (id: string) => {
    setCriteria(criteria.filter(criterion => criterion.id !== id));
  };

  const updateCriteria = (id: string, query: string) => {
    setCriteria(
      criteria.map(criterion =>
        criterion.id === id ? { ...criterion, query } : criterion
      )
    );
  };

  const loadExample = (exampleSet: string[]) => {
    const newCriteria = exampleSet.map(query => ({
      id: uuidv4(),
      query,
    }));
    setCriteria(newCriteria);
    setShowExamples(false);
  };

  const handleSearch = () => {
    const validCriteria = criteria
      .map(c => c.query.trim())
      .filter(q => q.length > 0);

    if (validCriteria.length > 0) {
      onSearch(validCriteria, [], []);
    }
  };

  const handleKeyEvent = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const hasActiveFilters = Object.keys(selectedFilters).length > 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Find Your PDX Therapist
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4 }}
          align="center"
        >
          Add multiple criteria to find therapists that match all your specific
          needs
        </Typography>

        {/* Examples Section */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<InfoIcon />}
            onClick={() => setShowExamples(!showExamples)}
            variant="text"
            size="small"
          >
            {showExamples ? 'Hide Examples' : 'Show Examples'}
          </Button>

          <Collapse in={showExamples}>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Example searches (click to try):
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {exampleCriteria.map((example, index) => (
                  <Button
                    key={`example-${index}-${example.join('-')}`}
                    onClick={() => loadExample(example)}
                    variant="outlined"
                    size="small"
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      fontSize: '0.875rem',
                    }}
                  >
                    {example.join(' + ')}
                  </Button>
                ))}
              </Box>
            </Alert>
          </Collapse>
        </Box>

        {/* Search Criteria Section */}
        <Card variant="outlined" sx={{ mb: 4, p: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Search Criteria
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={addCriteria}
                variant="outlined"
                size="small"
                disabled={isLoading}
                sx={{ mr: 2 }}
              >
                Add Criteria
              </Button>
              {searchResults.length > 0 && (
                <Button
                  startIcon={<FilterListIcon />}
                  onClick={() => setShowFilters(true)}
                  variant={hasActiveFilters ? "contained" : "outlined"}
                  size="small"
                  disabled={isLoading}
                  color={hasActiveFilters ? "primary" : "inherit"}
                  sx={{ mr: 2 }}
                >
                  Filter Results {hasActiveFilters && `(${Object.keys(selectedFilters).length})`}
                </Button>
              )}
              {searchResults.length > 0 && (
                <Button
                  startIcon={<ClearIcon />}
                  onClick={clearAllResults}
                  variant="outlined"
                  size="small"
                  disabled={isLoading}
                  color="error"
                >
                  Clear Results
                </Button>
              )}
            </Box>

            {criteria.map((criterion, index) => (
              <Box key={criterion.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ minWidth: '120px', fontWeight: 'medium' }}
                  >
                    {index === 0 ? 'Looking for' : 'AND also'}
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={criterion.query}
                    onChange={e =>
                      updateCriteria(criterion.id, e.target.value)
                    }
                    onKeyDown={handleKeyEvent}
                    placeholder={
                      index === 0
                        ? 'e.g., therapist who specializes in anxiety'
                        : index === 1
                        ? 'e.g., speaks Spanish'
                        : 'e.g., accepts my insurance'
                    }
                    disabled={isLoading}
                  />
                  {criteria.length > 1 && (
                    <IconButton
                      onClick={() => removeCriteria(criterion.id)}
                      disabled={isLoading}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
                {index < criteria.length - 1 && (
                  <Divider sx={{ mt: 2, mx: 8 }} />
                )}
              </Box>
            ))}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={handleSearch}
                disabled={isLoading || criteria.every(c => !c.query.trim())}
                startIcon={<SearchIcon />}
                variant="contained"
                size="large"
                sx={{ px: 4 }}
              >
                {criteria.filter(c => c.query.trim()).length > 1
                  ? `Search with ${
                      criteria.filter(c => c.query.trim()).length
                    } criteria`
                  : 'Search Therapists'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Filters Modal */}
        <Dialog
          open={showFilters}
          onClose={() => setShowFilters(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Filter Results</DialogTitle>
          <DialogContent sx={{ maxHeight: '70vh', overflow: 'auto' }}>
            <DynamicFilters
              searchResults={searchResults}
              selectedFilters={selectedFilters}
              onFilterChange={onFilterChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowFilters(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}; 
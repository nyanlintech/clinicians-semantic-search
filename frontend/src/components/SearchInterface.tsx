import { useState } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  Chip,
  Paper,
  Typography,
  Container,
  CircularProgress,
  Button,
  IconButton,
  Divider,
  Card,
  CardContent,
  Alert,
  Collapse,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { useQuery } from 'react-query';
import type { Filters } from '../types/therapist';
import { getFilters } from '../services/api';

interface SearchCriterion {
  id: string;
  query: string;
}

interface SearchInterfaceProps {
  onSearch: (criteria: string[], insurance: string[], titles: string[]) => void;
  isLoading: boolean;
}

export const SearchInterface = ({ onSearch, isLoading }: SearchInterfaceProps) => {
  const [criteria, setCriteria] = useState<SearchCriterion[]>([
    { id: '1', query: '' }
  ]);
  const [selectedInsurance, setSelectedInsurance] = useState<string[]>([]);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [showExamples, setShowExamples] = useState(false);

  const { data: filters, isLoading: isLoadingFilters } = useQuery<Filters>(
    'filters',
    getFilters
  );

  const exampleCriteria = [
    ['therapist who specializes in anxiety', 'speaks Spanish'],
    ['ADHD specialist', 'works with adults'],
    ['trauma therapist', 'uses EMDR therapy'],
    ['couples counselor', 'accepts Kaiser insurance'],
    ['depression specialist', 'culturally sensitive therapist']
  ];

  const addCriterion = () => {
    const newId = Date.now().toString();
    setCriteria([...criteria, { id: newId, query: '' }]);
  };

  const removeCriterion = (id: string) => {
    if (criteria.length > 1) {
      setCriteria(criteria.filter(criterion => criterion.id !== id));
    }
  };

  const updateCriterion = (id: string, query: string) => {
    setCriteria(criteria.map(criterion => 
      criterion.id === id ? { ...criterion, query } : criterion
    ));
  };

  const loadExample = (exampleSet: string[]) => {
    const newCriteria = exampleSet.map((query, index) => ({
      id: Date.now() + index + '',
      query
    }));
    setCriteria(newCriteria);
    setShowExamples(false);
  };

  const handleSearch = () => {
    const validCriteria = criteria
      .map(c => c.query.trim())
      .filter(q => q.length > 0);
    
    if (validCriteria.length > 0) {
      onSearch(validCriteria, selectedInsurance, selectedTitles);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Find Your PDX Therapist
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }} align="center">
          Add multiple criteria to find therapists that match all your specific needs
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
                    key={index}
                    onClick={() => loadExample(example)}
                    variant="outlined"
                    size="small"
                    sx={{ 
                      justifyContent: 'flex-start', 
                      textTransform: 'none',
                      fontSize: '0.875rem'
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
                onClick={addCriterion}
                variant="outlined"
                size="small"
                disabled={isLoading}
              >
                Add Criterion
              </Button>
            </Box>

            {criteria.map((criterion, index) => (
              <Box key={criterion.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ minWidth: '80px', fontWeight: 'medium' }}
                  >
                    {index === 0 ? 'Looking for' : 'AND also'}
                  </Typography>
                  <TextField
                    fullWidth
                    label={`Criterion ${index + 1}`}
                    variant="outlined"
                    size="small"
                    value={criterion.query}
                    onChange={(e) => updateCriterion(criterion.id, e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      index === 0 
                        ? "e.g., therapist who specializes in anxiety"
                        : index === 1
                        ? "e.g., speaks Spanish"
                        : "e.g., accepts my insurance"
                    }
                    disabled={isLoading}
                  />
                  {criteria.length > 1 && (
                    <IconButton
                      onClick={() => removeCriterion(criterion.id)}
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
                  ? `Search with ${criteria.filter(c => c.query.trim()).length} criteria`
                  : 'Search Therapists'
                }
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Filters Section */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Additional Filters (Optional)
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Autocomplete
                multiple
                options={filters?.titles || []}
                value={selectedTitles}
                onChange={(_, newValue) => setSelectedTitles(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Therapist Title"
                    placeholder="Select titles"
                    disabled={isLoading || isLoadingFilters}
                    size="small"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, ...chipProps } = getTagProps({ index });
                    return (
                      <Chip
                        key={key}
                        label={option}
                        size="small"
                        {...chipProps}
                        disabled={isLoading}
                      />
                    );
                  })
                }
                sx={{ minWidth: 250, flexGrow: 1 }}
              />

              <Autocomplete
                multiple
                options={filters?.insurance || []}
                value={selectedInsurance}
                onChange={(_, newValue) => setSelectedInsurance(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Insurance"
                    placeholder="Select insurance"
                    disabled={isLoading || isLoadingFilters}
                    size="small"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, ...chipProps } = getTagProps({ index });
                    return (
                      <Chip
                        key={key}
                        label={option}
                        size="small"
                        {...chipProps}
                        disabled={isLoading}
                      />
                    );
                  })
                }
                sx={{ minWidth: 250, flexGrow: 1 }}
              />
            </Box>
          </CardContent>
        </Card>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <CircularProgress />
          </Box>
        )}
      </Paper>
    </Container>
  );
}; 
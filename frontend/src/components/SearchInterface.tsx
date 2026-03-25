import { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Container,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TuneIcon from '@mui/icons-material/Tune';
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
  hasResults: boolean;
}

const exampleSets = [
  ['anxiety specialist', 'accepts sliding scale'],
  ['trauma therapist', 'uses EMDR therapy'],
  ['ADHD specialist', 'works with adults'],
  ['couples counselor', 'accepts Kaiser insurance'],
  ['depression', 'culturally sensitive', 'speaks Spanish'],
];

export const SearchInterface = ({
  onSearch,
  isLoading,
  searchResults,
  onFilterChange,
  selectedFilters,
  onClearResults,
  hasResults,
}: SearchInterfaceProps) => {
  const [criteria, setCriteria] = useState<SearchCriteria[]>([{ id: uuidv4(), query: '' }]);
  const [showFilters, setShowFilters] = useState(false);

  useQuery<Filters>('filters', getFilters);

  const addCriteria = () => {
    setCriteria([...criteria, { id: uuidv4(), query: '' }]);
  };

  const removeCriteria = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const updateCriteria = (id: string, query: string) => {
    setCriteria(criteria.map(c => (c.id === id ? { ...c, query } : c)));
  };

  const loadExample = (exampleSet: string[]) => {
    setCriteria(exampleSet.map(query => ({ id: uuidv4(), query })));
  };

  const handleSearch = () => {
    const valid = criteria.map(c => c.query.trim()).filter(q => q.length > 0);
    if (valid.length > 0) onSearch(valid, [], []);
  };

  const handleKeyEvent = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') handleSearch();
  };

  const hasActiveFilters = Object.keys(selectedFilters).length > 0;
  const activeFilterCount = Object.keys(selectedFilters).length;
  const validCriteriaCount = criteria.filter(c => c.query.trim()).length;

  return (
    <>
      {/* Hero section */}
      <Box
        component="section"
        sx={{
          pt: { xs: 6, md: 10 },
          pb: { xs: 5, md: 8 },
          borderBottom: hasResults ? '1px solid' : 'none',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          {/* Eyebrow */}
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              mb: 2,
              color: 'secondary.main',
              letterSpacing: '0.14em',
            }}
          >
            Portland, Oregon · Semantic Search
          </Typography>

          {/* Headline */}
          <Typography
            variant="h1"
            sx={{
              mb: 2.5,
              maxWidth: '20ch',
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' },
            }}
          >
            Find the right therapist for you
          </Typography>

          {/* Subheading */}
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: { xs: 4, md: 6 },
              maxWidth: '56ch',
              fontSize: '1rem',
              lineHeight: 1.7,
            }}
          >
            Describe what you're looking for in plain language. Add multiple criteria
            to narrow down therapists who match all your specific needs.
          </Typography>

          {/* Search form */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 3,
              p: { xs: 2.5, md: 3.5 },
              boxShadow: '0 1px 3px rgba(26, 18, 8, 0.05), 0 4px 20px rgba(26, 18, 8, 0.07)',
              maxWidth: 740,
            }}
          >
            {/* Criteria rows */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {criteria.map((criterion, index) => (
                <Box key={criterion.id}>
                  {index > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 1,
                        px: 0,
                      }}
                    >
                      <Box
                        sx={{
                          flex: 1,
                          height: '1px',
                          bgcolor: 'grey.200',
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                        }}
                      >
                        and
                      </Typography>
                      <Box
                        sx={{
                          flex: 1,
                          height: '1px',
                          bgcolor: 'grey.200',
                        }}
                      />
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {/* Row label */}
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        color: 'text.secondary',
                        minWidth: 80,
                        textAlign: 'right',
                        flexShrink: 0,
                        display: { xs: 'none', sm: 'block' },
                      }}
                    >
                      {index === 0 ? 'looking for' : 'also'}
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={criterion.query}
                      onChange={e => updateCriteria(criterion.id, e.target.value)}
                      onKeyDown={handleKeyEvent}
                      placeholder={
                        index === 0
                          ? 'e.g., therapist who specializes in anxiety'
                          : index === 1
                          ? 'e.g., speaks Spanish or telehealth only'
                          : 'e.g., accepts my insurance'
                      }
                      disabled={isLoading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.9375rem',
                        },
                      }}
                    />
                    {criteria.length > 1 && (
                      <IconButton
                        onClick={() => removeCriteria(criterion.id)}
                        disabled={isLoading}
                        size="small"
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { color: 'error.main', bgcolor: 'rgba(168, 48, 48, 0.06)' },
                          flexShrink: 0,
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Actions row */}
            <Box
              sx={{
                mt: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSearch}
                disabled={isLoading || validCriteriaCount === 0}
                sx={{ minWidth: 160 }}
              >
                {validCriteriaCount > 1
                  ? `Search with ${validCriteriaCount} criteria`
                  : 'Search Therapists'}
              </Button>

              <Button
                variant="text"
                startIcon={<AddIcon />}
                onClick={addCriteria}
                disabled={isLoading}
                size="small"
                sx={{ color: 'text.secondary' }}
              >
                Add criterion
              </Button>

              {searchResults.length > 0 && (
                <>
                  <Button
                    variant={hasActiveFilters ? 'outlined' : 'text'}
                    color={hasActiveFilters ? 'primary' : 'inherit'}
                    startIcon={<TuneIcon />}
                    onClick={() => setShowFilters(true)}
                    disabled={isLoading}
                    size="small"
                    sx={!hasActiveFilters ? { color: 'text.secondary' } : {}}
                  >
                    {hasActiveFilters ? `Filters (${activeFilterCount})` : 'Filter'}
                  </Button>

                  <Button
                    variant="text"
                    startIcon={<ClearIcon />}
                    onClick={onClearResults}
                    disabled={isLoading}
                    size="small"
                    sx={{ color: 'text.secondary', ml: 'auto' }}
                  >
                    Clear
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {/* Example searches */}
          <Box sx={{ mt: 3, maxWidth: 740 }}>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: 'text.secondary',
                textTransform: 'uppercase',
                mb: 1.5,
              }}
            >
              Try an example
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {exampleSets.map((example, idx) => (
                <Button
                  key={idx}
                  variant="outlined"
                  size="small"
                  onClick={() => loadExample(example)}
                  disabled={isLoading}
                  sx={{
                    borderColor: 'grey.300',
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    fontWeight: 400,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 20,
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      bgcolor: 'rgba(37, 61, 46, 0.04)',
                    },
                  }}
                >
                  {example.join(' · ')}
                </Button>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Filter dialog */}
      <Dialog
        open={showFilters}
        onClose={() => setShowFilters(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Refine Results</DialogTitle>
        <DialogContent sx={{ maxHeight: '65vh', overflow: 'auto', pt: '20px !important' }}>
          <DynamicFilters
            searchResults={searchResults}
            selectedFilters={selectedFilters}
            onFilterChange={onFilterChange}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          {hasActiveFilters && (
            <Button
              onClick={() => { onFilterChange({}); }}
              size="small"
              sx={{ color: 'text.secondary', mr: 'auto' }}
            >
              Clear all
            </Button>
          )}
          <Button onClick={() => setShowFilters(false)} variant="contained" color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

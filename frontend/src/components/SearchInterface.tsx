import { useState, useRef } from 'react';
import {
  Box,
  TextField,
  Typography,
  Container,
  Button,
  Chip,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { v4 as uuidv4 } from 'uuid';

interface SearchCriteria {
  id: string;
  query: string;
}

interface SearchInterfaceProps {
  onSearch: (criteria: string[], insurance: string[], titles: string[]) => void;
  isLoading: boolean;
  searchResults: any[];
  onClearResults: () => void;
  hasResults: boolean;
  initialCriteria?: string[];
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
  onClearResults,
  hasResults,
  initialCriteria = [],
}: SearchInterfaceProps) => {
  const [committed, setCommitted] = useState<SearchCriteria[]>(() =>
    initialCriteria.map(query => ({ id: uuidv4(), query }))
  );
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isCompact = hasResults;

  const removeCriterion = (id: string) => {
    setCommitted(prev => prev.filter(c => c.id !== id));
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = draft.trim();
      if (trimmed) {
        const allCriteria = [...committed.map(c => c.query), trimmed];
        setCommitted(prev => [...prev, { id: uuidv4(), query: trimmed }]);
        setDraft('');
        onSearch(allCriteria, [], []);
      } else if (committed.length > 0) {
        handleSearch();
      }
    } else if (e.key === 'Backspace' && draft === '' && committed.length > 0) {
      const last = committed[committed.length - 1];
      setCommitted(prev => prev.slice(0, -1));
      setDraft(last.query);
    }
  };

  const handleSearch = () => {
    const draftTrimmed = draft.trim();
    const all = [
      ...committed.map(c => c.query),
      ...(draftTrimmed ? [draftTrimmed] : []),
    ];
    if (all.length === 0) return;
    if (draftTrimmed) {
      setCommitted(prev => [...prev, { id: uuidv4(), query: draftTrimmed }]);
      setDraft('');
    }
    onSearch(all, [], []);
  };

  const loadExample = (exampleSet: string[]) => {
    setCommitted(exampleSet.map(query => ({ id: uuidv4(), query })));
    setDraft('');
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setCommitted([]);
    setDraft('');
    onClearResults();
    inputRef.current?.focus();
  };

  const totalCriteria = committed.length + (draft.trim() ? 1 : 0);
  const hasAnyCriteria = totalCriteria > 0;

  const placeholder =
    committed.length === 0
      ? 'e.g., therapist who specializes in anxiety…'
      : committed.length === 1
      ? 'Add another requirement…'
      : 'Add more…';

  return (
    <Box
      component="section"
      sx={{
        pt: isCompact ? { xs: 1.5, md: 2 } : { xs: 6, md: 10 },
        pb: isCompact ? { xs: 1.5, md: 2 } : { xs: 5, md: 8 },
        borderBottom: '1px solid',
        borderColor: 'divider',
        transition: 'padding 0.25s ease',
      }}
    >
      <Container maxWidth="lg">
        {!isCompact && (
          <>
            <Typography
              variant="overline"
              sx={{
                display: 'block',
                mb: 2,
                color: 'secondary.main',
                letterSpacing: '0.12em',
              }}
            >
              Portland, Oregon · Semantic Search
            </Typography>

            <Typography
              variant="h1"
              sx={{
                mb: 2.5,
                maxWidth: '22ch',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              }}
            >
              Find the right therapist for you
            </Typography>

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
              Describe what you're looking for in plain language. Add multiple
              criteria to narrow down therapists who match all your specific needs.
            </Typography>
          </>
        )}

        <Box
          sx={{
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'grey.200',
            borderRadius: 2,
            p: isCompact ? { xs: 1.5, md: 2 } : { xs: 2.5, md: 3.5 },
            boxShadow:
              '0 1px 3px rgba(26, 18, 8, 0.06), 0 1px 2px rgba(26, 18, 8, 0.04)',
            maxWidth: isCompact ? 'none' : 740,
          }}
        >
          {committed.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
              {committed.map((c, i) => (
                <Chip
                  key={c.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {i > 0 && (
                        <Box
                          component="span"
                          sx={{
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: 'secondary.main',
                            mr: 0.25,
                            opacity: 0.8,
                          }}
                        >
                          +
                        </Box>
                      )}
                      {c.query}
                    </Box>
                  }
                  onDelete={() => removeCriterion(c.id)}
                  disabled={isLoading}
                  sx={{
                    bgcolor: 'rgba(37, 61, 46, 0.07)',
                    border: '1px solid',
                    borderColor: 'rgba(37, 61, 46, 0.18)',
                    color: 'primary.main',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    height: 32,
                    borderRadius: '6px',
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(37, 61, 46, 0.45)',
                      fontSize: '1rem',
                      '&:hover': { color: 'primary.main' },
                    },
                  }}
                />
              ))}
            </Box>
          )}

          {isCompact ? (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                inputRef={inputRef}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.disabled', fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                  endAdornment: draft.trim() ? (
                    <InputAdornment position="end">
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          color: 'text.disabled',
                          fontFamily: '"IBM Plex Mono", monospace',
                          userSelect: 'none',
                        }}
                      >
                        ↵
                      </Typography>
                    </InputAdornment>
                  ) : null,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.9rem',
                    bgcolor: committed.length > 0 ? 'rgba(37,61,46,0.02)' : 'transparent',
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={handleSearch}
                disabled={isLoading || !hasAnyCriteria}
                sx={{ minWidth: 88, whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                Search
              </Button>
              {(committed.length > 0 || hasResults) && (
                <Button
                  variant="text"
                  onClick={handleClear}
                  disabled={isLoading}
                  size="small"
                  sx={{ color: 'text.secondary', flexShrink: 0, minWidth: 0, px: 0.75 }}
                >
                  Clear
                </Button>
              )}
            </Box>
          ) : (
            <>
              <TextField
                fullWidth
                variant="outlined"
                size="medium"
                inputRef={inputRef}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.disabled', fontSize: '1.25rem' }} />
                    </InputAdornment>
                  ),
                  endAdornment: draft.trim() ? (
                    <InputAdornment position="end">
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          color: 'text.disabled',
                          fontFamily: '"IBM Plex Mono", monospace',
                          letterSpacing: 0,
                          userSelect: 'none',
                        }}
                      >
                        ↵ to add
                      </Typography>
                    </InputAdornment>
                  ) : null,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.9375rem',
                    bgcolor: committed.length > 0 ? 'rgba(37,61,46,0.02)' : 'transparent',
                  },
                }}
              />

              <Box
                sx={{
                  mt: 2.5,
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
                  disabled={isLoading || !hasAnyCriteria}
                  sx={{ minWidth: 160 }}
                >
                  {totalCriteria > 1
                    ? `Search with ${totalCriteria} criteria`
                    : 'Search Therapists'}
                </Button>

                {(hasResults || committed.length > 0) && (
                  <Button
                    variant="text"
                    startIcon={<ClearIcon />}
                    onClick={handleClear}
                    disabled={isLoading}
                    size="small"
                    sx={{ color: 'text.secondary', ml: 'auto' }}
                  >
                    Clear
                  </Button>
                )}
              </Box>
            </>
          )}
        </Box>

        {!isCompact && (
          <Box sx={{ mt: 3, maxWidth: 740 }}>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: 'text.secondary',
                textTransform: 'uppercase',
                mb: 1.5,
              }}
            >
              Try an example
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {exampleSets.map((example, idx) => (
                <Chip
                  key={idx}
                  label={example.join(' · ')}
                  variant="outlined"
                  size="small"
                  onClick={() => !isLoading && loadExample(example)}
                  disabled={isLoading}
                  sx={{
                    borderColor: 'grey.300',
                    color: 'text.secondary',
                    fontSize: '0.8125rem',
                    fontWeight: 400,
                    height: 30,
                    borderRadius: '15px',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      bgcolor: 'rgba(37, 61, 46, 0.04)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

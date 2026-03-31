import { useState, useEffect, useRef } from 'react';
import type { SyntheticEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Skeleton,
  Card,
  CardContent,
  ThemeProvider,
  Button,
  Drawer,
  Badge,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';

import { BookmarkBorder, Search, TuneOutlined } from '@mui/icons-material';
import { SearchInterface } from './components/SearchInterface';
import { TherapistCard } from './components/TherapistCard';
import DynamicFilters from './components/DynamicFilters';
import { SearchRequestError, searchTherapists } from './services/api';
import type { Therapist } from './types/therapist';
import { theme } from './theme';

const queryClient = new QueryClient();

const BOOLEAN_FILTER_KEYS = new Set(['telehealth', 'in_person', 'free_consultation']);

const FILTER_LABELS: Record<string, string> = {
  status: 'Status',
  services: 'Services',
  insurance: 'Insurance',
  other_techniques: 'Technique',
  other_issues: 'Focus',
  telehealth: 'Telehealth',
  in_person: 'In-Person',
  free_consultation: 'Free Consult',
};

const SLOW_SEARCH_DELAY_MS = 30_000;

const TherapistCardSkeleton = () => (
  <Card sx={{ width: '100%' }}>
    <CardContent sx={{ p: { xs: 2.5, md: 3 }, '&:last-child': { pb: { xs: 2.5, md: 3 } } }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
        <Skeleton variant="circular" width={68} height={68} sx={{ flexShrink: 0 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="42%" height={22} sx={{ mb: 0.75 }} />
          <Skeleton width="32%" height={16} sx={{ mb: 0.5 }} />
          <Skeleton width="22%" height={14} />
        </Box>
      </Box>
      <Skeleton variant="rectangular" height={1} sx={{ mb: 2.5 }} />
      <Skeleton width="100%" height={13} sx={{ mb: 0.75 }} />
      <Skeleton width="90%" height={13} sx={{ mb: 0.75 }} />
      <Skeleton width="75%" height={13} />
    </CardContent>
  </Card>
);

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<Therapist[]>([]);
  const [favorites, setFavorites] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSlowSearch, setIsSlowSearch] = useState(false);
  const [lastSearchCriteria, setLastSearchCriteria] = useState<string[]>([]);
  const [lastSearchInsurance, setLastSearchInsurance] = useState<string[]>([]);
  const [lastSearchTitles, setLastSearchTitles] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const slowSearchTimerRef = useRef<number | null>(null);

  const initialCriteria = searchParams.getAll('q');

  const clearSlowSearchTimer = () => {
    if (slowSearchTimerRef.current !== null) {
      window.clearTimeout(slowSearchTimerRef.current);
      slowSearchTimerRef.current = null;
    }
  };

  useEffect(() => {
    const savedFavorites = localStorage.getItem('therapist-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    if (initialCriteria.length > 0) {
      handleSearch(initialCriteria, [], []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem('therapist-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    return () => {
      clearSlowSearchTimer();
    };
  }, []);

  const handleSearch = async (criteria: string[], insurance: string[], titles: string[]) => {
    clearSlowSearchTimer();
    setIsLoading(true);
    setSearchError(null);
    setIsSlowSearch(false);
    setResults([]);
    setActiveTab(0);
    setSelectedFilters({});
    setLastSearchCriteria(criteria);
    setLastSearchInsurance(insurance);
    setLastSearchTitles(titles);
    setSearchParams(criteria.reduce((p, q) => { p.append('q', q); return p; }, new URLSearchParams()), { replace: true });

    slowSearchTimerRef.current = window.setTimeout(() => {
      setIsSlowSearch(true);
    }, SLOW_SEARCH_DELAY_MS);

    try {
      const searchResults = await searchTherapists({
        criteria,
        insurance: insurance.length > 0 ? insurance : undefined,
        titles: titles.length > 0 ? titles : undefined,
      });

      const validResults = searchResults.filter(therapist => {
        const hasName = therapist.name && therapist.name.trim() !== '';
        const hasIntro = therapist.intro && therapist.intro.trim() !== '';
        const hasTitle = therapist.title && therapist.title.trim() !== '';
        return hasName && (hasIntro || hasTitle);
      });

      clearSlowSearchTimer();
      setIsSlowSearch(false);
      setResults(validResults);
      setTimeout(() => {
        if (resultsRef.current) {
          const top = resultsRef.current.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 50);
    } catch (error) {
      console.error('Error searching therapists:', error);
      clearSlowSearchTimer();
      setIsSlowSearch(false);
      setResults([]);
      setSearchError(
        error instanceof SearchRequestError
          ? error.message
          : 'Something went wrong while searching. Please try again.'
      );
    } finally {
      clearSlowSearchTimer();
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    clearSlowSearchTimer();
    setResults([]);
    setSelectedFilters({});
    setSearchError(null);
    setIsSlowSearch(false);
    setSearchParams({}, { replace: true });
  };

  const retryLastSearch = () => {
    if (lastSearchCriteria.length === 0) return;
    handleSearch(lastSearchCriteria, lastSearchInsurance, lastSearchTitles);
  };

  const toggleFavorite = (therapist: Therapist) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === therapist.id);
      return isFavorite
        ? prev.filter(fav => fav.id !== therapist.id)
        : [...prev, therapist];
    });
  };

  const removeFilter = (key: string, value: string) => {
    const next = (selectedFilters[key] || []).filter(v => v !== value);
    if (next.length === 0) {
      const rest = { ...selectedFilters };
      delete rest[key];
      setSelectedFilters(rest);
    } else {
      setSelectedFilters({ ...selectedFilters, [key]: next });
    }
  };

  const filteredResults = results.filter(therapist => {
    return Object.entries(selectedFilters).every(([key, values]) => {
      if (values.length === 0) return true;
      const therapistValue = therapist[key as keyof Therapist];

      if (BOOLEAN_FILTER_KEYS.has(key)) {
        const booleanValues = values.map(v => v === 'true');
        return booleanValues.includes(therapistValue as boolean);
      }

      if (Array.isArray(therapistValue)) {
        if (therapistValue.every(item => typeof item === 'string')) {
          return values.some(v => (therapistValue as string[]).includes(v));
        }
        if (therapistValue.every(item => typeof item === 'object' && item !== null && 'name' in item)) {
          const names = therapistValue.map(item => (item as { name: string }).name);
          return values.some(v => names.includes(v));
        }
      }

      return values.includes(therapistValue as string);
    });
  });

  const isFavorite = (therapistId: number) => favorites.some(fav => fav.id === therapistId);
  const handleTabChange = (_event: SyntheticEvent, newValue: number) => setActiveTab(newValue);

  const hasResults = results.length > 0 || isLoading || searchError !== null;
  const activeFilterCount = Object.values(selectedFilters).reduce((sum, vals) => sum + vals.length, 0);

  // All active filter chips as flat [key, value] pairs
  const activeFilterChips = Object.entries(selectedFilters).flatMap(([key, values]) =>
    values.map(value => ({ key, value }))
  );

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          {/* ── Top nav bar ── */}
          <Box
            component="nav"
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'rgba(245, 240, 232, 0.92)',
              backdropFilter: 'blur(12px)',
              position: 'sticky',
              top: 0,
              zIndex: 100,
              px: { xs: 2, md: 4 },
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 600,
                fontSize: '1.25rem',
                color: 'text.primary',
                letterSpacing: '0',
              }}
            >
              PDX Therapist Finder
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {hasResults && !isLoading && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {filteredResults.length} results
                </Typography>
              )}
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Portland, OR
              </Typography>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#B5622D',
                }}
              />
            </Box>
          </Box>

          {/* ── Search bar ── */}
          <SearchInterface
            onSearch={handleSearch}
            isLoading={isLoading}
            searchResults={results}
            onClearResults={clearResults}
            hasResults={hasResults}
            initialCriteria={initialCriteria}
          />

          {/* ── Results Section ── */}
          {hasResults && (
            <Box sx={{ maxWidth: 1400, mx: 'auto', display: 'flex' }}>
              {/* ── Sidebar (desktop only) ── */}
              <Box
                sx={{
                  width: 268,
                  flexShrink: 0,
                  display: { xs: 'none', md: 'block' },
                  position: 'sticky',
                  top: 112,
                  height: 'calc(100vh - 112px)',
                  overflowY: 'auto',
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  p: 2.5,
                  bgcolor: 'background.paper',
                }}
              >
                <Typography
                  variant="overline"
                  sx={{ color: 'text.secondary', mb: 2, display: 'block', letterSpacing: '0.1em' }}
                >
                  Refine Results
                </Typography>
                <DynamicFilters
                  searchResults={results}
                  selectedFilters={selectedFilters}
                  onFilterChange={setSelectedFilters}
                  compact
                />
              </Box>

              {/* ── Results column ── */}
              <Box ref={resultsRef} sx={{ flex: 1, minWidth: 0, px: { xs: 2, md: 3 }, py: 3 }}>

                {/* ── Mobile filter button ── */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
                  {/* Spacer */}
                  <Box sx={{ flex: 1 }} />

                  {/* Mobile filter button */}
                  <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <Badge badgeContent={activeFilterCount} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.75rem' } }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<TuneOutlined sx={{ fontSize: '1rem !important' }} />}
                        onClick={() => setFiltersOpen(true)}
                        sx={{
                          borderColor: activeFilterCount > 0 ? 'primary.main' : 'grey.300',
                          color: activeFilterCount > 0 ? 'primary.main' : 'text.secondary',
                          fontSize: '0.8125rem',
                        }}
                      >
                        {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : 'Filters'}
                      </Button>
                    </Badge>
                  </Box>
                </Box>

                {/* ── Active filter chips bar ── */}
                {activeFilterChips.length > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.75,
                      mb: 2,
                      pb: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      alignItems: 'center',
                    }}
                  >
                    {activeFilterChips.map(({ key, value }) => {
                      const label = BOOLEAN_FILTER_KEYS.has(key)
                        ? FILTER_LABELS[key] || key
                        : `${FILTER_LABELS[key] || key}: ${value}`;
                      return (
                        <Chip
                          key={`${key}-${value}`}
                          label={label}
                          size="small"
                          onDelete={() => removeFilter(key, value)}
                          sx={{
                            height: 26,
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            bgcolor: 'rgba(37, 61, 46, 0.08)',
                            color: 'primary.main',
                            border: '1px solid rgba(37, 61, 46, 0.2)',
                            borderRadius: '4px',
                            '& .MuiChip-deleteIcon': {
                              fontSize: '0.9rem',
                              color: 'rgba(37, 61, 46, 0.4)',
                              '&:hover': { color: 'primary.main' },
                            },
                          }}
                        />
                      );
                    })}
                    {activeFilterChips.length > 1 && (
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setSelectedFilters({})}
                        sx={{ fontSize: '0.8rem', color: 'text.secondary', px: 0.5, minWidth: 0 }}
                      >
                        Clear all
                      </Button>
                    )}
                  </Box>
                )}

                {/* ── Tabs ── */}
                <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 3 }}>
                  <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab
                      icon={<Search sx={{ fontSize: 15 }} />}
                      label={
                        <span>
                          Results
                          {filteredResults.length > 0 && (
                            <Box
                              component="span"
                              sx={{
                                ml: 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: 20,
                                height: 20,
                                borderRadius: '10px',
                                bgcolor: 'primary.main',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                px: 0.75,
                              }}
                            >
                              {filteredResults.length}
                            </Box>
                          )}
                        </span>
                      }
                      iconPosition="start"
                      sx={{ gap: 0.75 }}
                    />
                    <Tab
                      icon={<BookmarkBorder sx={{ fontSize: 15 }} />}
                      label={
                        <span>
                          Saved
                          {favorites.length > 0 && (
                            <Box
                              component="span"
                              sx={{
                                ml: 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: 20,
                                height: 20,
                                borderRadius: '10px',
                                bgcolor: 'secondary.main',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                px: 0.75,
                              }}
                            >
                              {favorites.length}
                            </Box>
                          )}
                        </span>
                      }
                      iconPosition="start"
                      sx={{ gap: 0.75 }}
                    />
                  </Tabs>
                </Box>

                {/* ── Results Tab ── */}
                {activeTab === 0 && (
                  <Box>
                    {isLoading ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.25,
                            px: 0.5,
                          }}
                        >
                          <CircularProgress size={20} color="secondary" />
                          <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: 'text.primary' }}>
                            Searching therapists...
                          </Typography>
                        </Box>
                        {isSlowSearch && (
                          <Alert
                            severity="warning"
                            sx={{
                              alignItems: 'flex-start',
                              bgcolor: 'rgba(181, 98, 45, 0.08)',
                              border: '1px solid rgba(181, 98, 45, 0.2)',
                            }}
                          >
                            This is taking longer than expected. The backend may be unavailable, but
                            we&apos;re still waiting for a response.
                          </Alert>
                        )}
                        {[0, 1, 2].map(i => (
                          <TherapistCardSkeleton key={i} />
                        ))}
                      </Box>
                    ) : searchError ? (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          minHeight: '240px',
                          flexDirection: 'column',
                          gap: 1.5,
                          textAlign: 'center',
                          maxWidth: 520,
                          mx: 'auto',
                        }}
                      >
                        <Typography
                          sx={{ fontSize: '1.125rem', fontWeight: 600, color: 'text.primary' }}
                        >
                          Something went wrong while searching
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {searchError}
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={retryLastSearch}
                          disabled={lastSearchCriteria.length === 0}
                          sx={{ mt: 1 }}
                        >
                          Try again
                        </Button>
                      </Box>
                    ) : filteredResults.length > 0 ? (
                      <>
                        {/* Result summary */}
                        <Typography
                          variant="caption"
                          sx={{ display: 'block', mb: 2, color: 'text.secondary' }}
                        >
                          {activeFilterChips.length > 0
                            ? `${filteredResults.length} of ${results.length} therapists after filtering`
                            : `${results.length} therapist${results.length !== 1 ? 's' : ''} found`}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {filteredResults.map((therapist, index) => (
                            <TherapistCard
                              key={therapist.id}
                              therapist={therapist}
                              isFavorite={isFavorite(therapist.id)}
                              onToggleFavorite={() => toggleFavorite(therapist)}
                              index={index}
                            />
                          ))}
                        </Box>
                      </>
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          minHeight: '240px',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        <Typography
                          sx={{ fontSize: '1.125rem', fontWeight: 600, color: 'text.primary' }}
                        >
                          {results.length > 0
                            ? 'No therapists match the selected filters'
                            : 'No results found'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {results.length > 0
                            ? 'Try removing some filters'
                            : 'Try different search terms'}
                        </Typography>
                        {results.length > 0 && activeFilterChips.length > 0 && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setSelectedFilters({})}
                            sx={{ mt: 1, borderColor: 'grey.300', color: 'text.secondary' }}
                          >
                            Clear all filters
                          </Button>
                        )}
                      </Box>
                    )}
                  </Box>
                )}

                {/* ── Favorites Tab ── */}
                {activeTab === 1 && (
                  favorites.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {favorites.map((therapist, index) => (
                        <TherapistCard
                          key={therapist.id}
                          therapist={therapist}
                          isFavorite={true}
                          onToggleFavorite={() => toggleFavorite(therapist)}
                          index={index}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '240px',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: 'text.primary' }}>
                        No saved therapists yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Bookmark therapists you want to revisit
                      </Typography>
                    </Box>
                  )
                )}
              </Box>
            </Box>
          )}

          {/* ── Mobile Filter Drawer ── */}
          <Drawer
            anchor="left"
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            sx={{ '& .MuiDrawer-paper': { width: 300, p: 2.5 } }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography
                variant="overline"
                sx={{ color: 'text.secondary', letterSpacing: '0.1em' }}
              >
                Refine Results
              </Typography>
              <Button
                size="small"
                variant="contained"
                onClick={() => setFiltersOpen(false)}
                sx={{ fontSize: '0.8125rem', px: 2 }}
              >
                Done
              </Button>
            </Box>
            <DynamicFilters
              searchResults={results}
              selectedFilters={selectedFilters}
              onFilterChange={setSelectedFilters}
            />
          </Drawer>
        </Box>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

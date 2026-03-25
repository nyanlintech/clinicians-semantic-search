import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Box, Typography, Tabs, Tab, CircularProgress, ThemeProvider, Container } from '@mui/material';
import { BookmarkBorder, Search } from '@mui/icons-material';
import { SearchInterface } from './components/SearchInterface';
import { TherapistCard } from './components/TherapistCard';
import { searchTherapists } from './services/api';
import type { Therapist } from './types/therapist';
import { theme } from './theme';

const queryClient = new QueryClient();

function App() {
  const [results, setResults] = useState<Therapist[]>([]);
  const [favorites, setFavorites] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const savedFavorites = localStorage.getItem('therapist-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('therapist-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async (criteria: string[], insurance: string[], titles: string[]) => {
    setIsLoading(true);
    setResults([]);
    setActiveTab(0);

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

      setResults(validResults);
    } catch (error) {
      console.error('Error searching therapists:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setSelectedFilters({});
  };

  const toggleFavorite = (therapist: Therapist) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === therapist.id);
      return isFavorite
        ? prev.filter(fav => fav.id !== therapist.id)
        : [...prev, therapist];
    });
  };

  const filteredResults = results.filter(therapist => {
    return Object.entries(selectedFilters).every(([key, values]) => {
      if (values.length === 0) return true;
      const therapistValue = therapist[key as keyof Therapist];

      if (key === 'telehealth' || key === 'in_person') {
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
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => setActiveTab(newValue);

  const hasResults = results.length > 0 || isLoading;

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          {/* Top nav bar */}
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
                fontFamily: '"Cormorant Garamond", serif',
                fontWeight: 600,
                fontSize: '1.25rem',
                color: 'text.primary',
                letterSpacing: '-0.01em',
              }}
            >
              PDX Therapist Finder
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', mr: 0.5 }}>
                Portland, OR
              </Typography>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#4A7A5C',
                }}
              />
            </Box>
          </Box>

          {/* Search Hero */}
          <SearchInterface
            onSearch={handleSearch}
            isLoading={isLoading}
            searchResults={results}
            onFilterChange={setSelectedFilters}
            selectedFilters={selectedFilters}
            onClearResults={clearResults}
            hasResults={hasResults}
          />

          {/* Results Section */}
          {hasResults && (
            <Container maxWidth="lg" sx={{ pt: 3, pb: 8 }}>
              {/* Tabs */}
              <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 4 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab
                    icon={<Search sx={{ fontSize: 16 }} />}
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
                              fontSize: '0.6875rem',
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
                    icon={<BookmarkBorder sx={{ fontSize: 16 }} />}
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
                              fontSize: '0.6875rem',
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

              {/* Search Results Tab */}
              {activeTab === 0 && (
                <Box>
                  {isLoading ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '320px',
                        flexDirection: 'column',
                        gap: 3,
                      }}
                    >
                      <CircularProgress size={40} thickness={2.5} />
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontSize: '1.25rem',
                            color: 'text.primary',
                            mb: 0.5,
                          }}
                        >
                          Finding therapists…
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Searching through profiles semantically
                        </Typography>
                      </Box>
                    </Box>
                  ) : filteredResults.length > 0 ? (
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
                        sx={{
                          fontFamily: '"Cormorant Garamond", serif',
                          fontSize: '1.375rem',
                          color: 'text.primary',
                        }}
                      >
                        {results.length > 0
                          ? 'No therapists match the selected filters'
                          : 'No results found'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {results.length > 0
                          ? 'Try adjusting your filters'
                          : 'Try different search terms'}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Favorites Tab */}
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
                    <Typography
                      sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontSize: '1.375rem',
                        color: 'text.primary',
                      }}
                    >
                      No saved therapists yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bookmark therapists you want to revisit
                    </Typography>
                  </Box>
                )
              )}
            </Container>
          )}
        </Box>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

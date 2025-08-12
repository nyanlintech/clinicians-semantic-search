import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Container, Typography, Box, Tabs, Tab, CircularProgress, ThemeProvider } from '@mui/material';
import { Favorite, Search } from '@mui/icons-material';
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

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('therapist-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('therapist-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async (criteria: string[], insurance: string[], titles: string[]) => {
    setIsLoading(true);
    setResults([]); // Clear current results immediately
    setActiveTab(0); // Switch to search results tab
    
    try {
      console.log('Searching with criteria:', criteria);
      const searchResults = await searchTherapists({
        criteria: criteria,
        insurance: insurance.length > 0 ? insurance : undefined,
        titles: titles.length > 0 ? titles : undefined,
      });
      console.log('Search results received:', searchResults);
      console.log('Number of results:', searchResults.length);
      if (searchResults.length > 0) {
        console.log('First result sample:', searchResults[0]);
      }
      
      // Filter out therapists with empty essential fields
      const validResults = searchResults.filter(therapist => {
        const hasName = therapist.name && therapist.name.trim() !== '';
        const hasIntro = therapist.intro && therapist.intro.trim() !== '';
        const hasTitle = therapist.title && therapist.title.trim() !== '';
        
        // Keep therapist if they have at least a name and either intro or title
        return hasName && (hasIntro || hasTitle);
      });

      console.log('Valid results before filtering:', searchResults.length); 
      
      console.log('Valid results after filtering:', validResults.length);
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
      if (isFavorite) {
        return prev.filter(fav => fav.id !== therapist.id);
      } else {
        return [...prev, therapist];
      }
    });
  };

  const filteredResults = results.filter(therapist => {
    return Object.entries(selectedFilters).every(([key, values]) => {
      if (values.length === 0) return true;
      const therapistValue = therapist[key as keyof Therapist];
      
      // Handle boolean fields (telehealth, in_person)
      if (key === 'telehealth' || key === 'in_person') {
        const booleanValues = values.map(v => v === 'true');
        return booleanValues.includes(therapistValue as boolean);
      }
      
      if (Array.isArray(therapistValue)) {
        // Handle array of strings (e.g., insurance, services)
        if (therapistValue.every(item => typeof item === 'string')) {
          return values.some(v => (therapistValue as string[]).includes(v));
        }
        // Handle array of objects (e.g., approaches, specialities)
        if (therapistValue.every(item => typeof item === 'object' && item !== null && 'name' in item)) {
          const names = therapistValue.map(item => (item as { name: string }).name);
          return values.some(v => names.includes(v));
        }
      }

      return values.includes(therapistValue as string);
    });
  });

  const isFavorite = (therapistId: number) => {
    return favorites.some(fav => fav.id === therapistId);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <SearchInterface
            onSearch={handleSearch}
            isLoading={isLoading}
            searchResults={results}
            onFilterChange={setSelectedFilters}
            selectedFilters={selectedFilters}
            onClearResults={clearResults}
          />

          <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab 
                  icon={<Search />} 
                  label={`Search Results (${filteredResults.length})`} 
                  iconPosition="start"
                />
                <Tab 
                  icon={<Favorite />} 
                  label={`Favorites (${favorites.length})`} 
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            {/* Tab Content */}
            {activeTab === 0 && (
              // Search Results Tab
              <Box>
                {isLoading ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: '300px',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <CircularProgress size={60} />
                    <Typography variant="h6" color="text.secondary">
                      Searching for therapists...
                    </Typography>
                  </Box>
                ) : filteredResults.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filteredResults.map((therapist) => (
                      <TherapistCard 
                        key={therapist.id} 
                        therapist={therapist}
                        isFavorite={isFavorite(therapist.id)}
                        onToggleFavorite={() => toggleFavorite(therapist)}
                      />
                    ))}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: '200px',
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      {results.length > 0 ? 'No therapists match the selected filters.' : 'Add your search criteria to find therapists'}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {activeTab === 1 && (
              // Favorites Tab
              favorites.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {favorites.map((therapist) => (
                    <TherapistCard 
                      key={therapist.id} 
                      therapist={therapist}
                      isFavorite={true}
                      onToggleFavorite={() => toggleFavorite(therapist)}
                    />
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '200px',
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    No favorites yet. Search for therapists and heart the ones you like!
                  </Typography>
                </Box>
              )
            )}
          </Container>
        </Box>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
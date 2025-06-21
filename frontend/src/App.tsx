import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Container, Grid, Typography, Box } from '@mui/material';
import { SearchInterface } from './components/SearchInterface';
import { TherapistCard } from './components/TherapistCard';
import { searchTherapists } from './services/api';
import type { Therapist } from './types/therapist';

const queryClient = new QueryClient();

function App() {
  const [results, setResults] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (criteria: string[], insurance: string[], titles: string[]) => {
    setIsLoading(true);
    try {
      const searchResults = await searchTherapists({
        criteria: criteria,  // Send as separate criteria array
        insurance: insurance.length > 0 ? insurance : undefined,
        titles: titles.length > 0 ? titles : undefined,
        limit: 300
      });
      setResults(searchResults);
    } catch (error) {
      console.error('Error searching therapists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <SearchInterface onSearch={handleSearch} isLoading={isLoading} />

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {results.length > 0 ? (
            <Grid container spacing={3}>
              {results.map((therapist) => (
                <Grid item xs={12} sm={6} md={4} key={therapist.id}>
                  <TherapistCard therapist={therapist} />
                </Grid>
              ))}
            </Grid>
          ) : (
            !isLoading && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '200px',
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Add your search criteria to find therapists
                </Typography>
              </Box>
            )
          )}
        </Container>
      </Box>
    </QueryClientProvider>
  );
}

export default App;

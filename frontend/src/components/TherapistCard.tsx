import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import { Favorite, FavoriteBorder, Launch } from '@mui/icons-material';
import type { Therapist } from '../types/therapist';

interface TherapistCardProps {
  therapist: Therapist;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const TherapistCard = ({ therapist, isFavorite, onToggleFavorite }: TherapistCardProps) => {
  return (
    <Card sx={{ width: '100%', mb: 2, position: 'relative', backgroundColor: '#FAF9F7' }}>
      {/* Heart Icon */}
      <IconButton
        onClick={onToggleFavorite}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          },
        }}
      >
        {isFavorite ? (
          <Favorite sx={{ color: 'error.main' }} />
        ) : (
          <FavoriteBorder sx={{ color: 'text.secondary' }} />
        )}
      </IconButton>

      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Therapist Image */}
          {therapist.image && (
            <Box sx={{ flexShrink: 0 }}>
              <img
                src={therapist.image}
                alt={therapist.name}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
            </Box>
          )}
          
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {therapist.name || 'Name not available'}
                </Typography>
                {therapist.title && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {therapist.title}
                  </Typography>
                )}
                {therapist.credentials && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {therapist.credentials}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Telehealth and In-Person Indicators */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {therapist.telehealth && (
                <Chip
                  label="Telehealth"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {therapist.in_person && (
                <Chip
                  label="In-Person"
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              )}
            </Box>

            {therapist.intro && (
              <Typography variant="body2" paragraph>
                {therapist.intro}
              </Typography>
            )}

            {/* Rate */}
            {therapist.rate_min && therapist.rate_max && (
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 'bold', mb: 2 }}
              >
                Rate: {therapist.rate_min} - {therapist.rate_max}
              </Typography>
            )}

            {/* Details */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              {/* Insurance */}
              {therapist.insurance && therapist.insurance.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Insurance:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {therapist.insurance.filter(Boolean).map((ins) => (
                      <Chip
                        key={ins}
                        label={ins}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Other Issues */}
              {therapist.other_issues && therapist.other_issues.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Issues:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {therapist.other_issues.map((issue) => (
                      <Chip
                        key={issue}
                        label={issue}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Techniques */}
              {therapist.other_techniques && therapist.other_techniques.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Techniques:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {therapist.other_techniques.map((technique) => (
                      <Chip
                        key={technique}
                        label={technique}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>
              )}    

              {/* Services */}
              {therapist.services && therapist.services.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Services:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {therapist.services.map((service) => (
                      <Chip
                        key={service}
                        label={service}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Languages */}
              {therapist.languages && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Languages:
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'text.primary' }}>
                    {therapist.languages}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Free consultation */}
            {therapist.free_consultation && (
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Offers Free Consultation
              </Typography>
            )}

            {/* Ideal Client */}
            {therapist.ideal_client && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Ideal Client:
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'text.primary' }}>
                  {therapist.ideal_client}
                </Typography>
              </Box>
            )}

            {/* Therapeutic Approaches */}
            {therapist.approaches && therapist.approaches.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Therapeutic Approaches:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {therapist.approaches?.map((approach, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      sx={{ pl: 1, lineHeight: 1.6, color: 'text.primary' }}
                    >
                      • {typeof approach === 'string' ? approach : Object.values(approach)[0]}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}

            {/* Visit Profile Button */}
            {therapist.url && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  href={therapist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  size="small"
                  startIcon={<Launch />}
                >
                  Visit Profile
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

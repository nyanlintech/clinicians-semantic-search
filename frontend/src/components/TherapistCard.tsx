import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Link,
  Divider,
} from '@mui/material';
import type { Therapist } from '../types/therapist';

interface TherapistCardProps {
  therapist: Therapist;
}

export const TherapistCard = ({ therapist }: TherapistCardProps) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {therapist.name}
          {therapist.pronouns && (
            <Typography
              component="span"
              variant="subtitle1"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              ({therapist.pronouns})
            </Typography>
          )}
        </Typography>

        {therapist.title && (
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {therapist.title}
          </Typography>
        )}

        {therapist.intro && (
          <Typography variant="body1" paragraph>
            {therapist.intro}
          </Typography>
        )}

        {therapist.ideal_client && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Ideal Client:
            </Typography>
            <Typography variant="body2">{therapist.ideal_client}</Typography>
          </Box>
        )}

        {therapist.approaches && therapist.approaches.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Approaches:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {therapist.approaches.map((approach, index) => (
                <Box key={index}>
                  <Typography variant="body2" color="text.secondary">
                    {typeof approach === 'string' ? approach : Object.values(approach)[0]}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          {therapist.insurance && therapist.insurance.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Insurance:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {therapist.insurance.map((ins) => (
                  <Chip
                    key={ins}
                    label={ins}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 'auto' }}>
          {therapist.rate_min && therapist.rate_max && (
            <Typography variant="body2" color="text.secondary">
              Rate: ${therapist.rate_min} - ${therapist.rate_max}
            </Typography>
          )}
          {therapist.free_consultation && (
            <Typography variant="body2" color="primary">
              Offers free consultation
            </Typography>
          )}
          {therapist.url && (
            <Link
              href={therapist.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'block', mt: 1 }}
            >
              Visit Website
            </Link>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}; 
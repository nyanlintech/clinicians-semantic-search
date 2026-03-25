import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Tooltip,
} from '@mui/material';
import { BookmarkBorder, Bookmark, Launch, VideocamOutlined, PersonOutlined } from '@mui/icons-material';
import type { Therapist } from '../types/therapist';

interface TherapistCardProps {
  therapist: Therapist;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  index?: number;
}

// Category-specific chip styles for visual distinction
const chipStyles = {
  insurance: {
    backgroundColor: 'rgba(37, 61, 46, 0.08)',
    color: '#1F3828',
    border: '1px solid rgba(37, 61, 46, 0.2)',
  },
  techniques: {
    backgroundColor: 'rgba(58, 82, 112, 0.08)',
    color: '#2A3D5A',
    border: '1px solid rgba(58, 82, 112, 0.2)',
  },
  services: {
    backgroundColor: 'rgba(181, 98, 45, 0.08)',
    color: '#7A4215',
    border: '1px solid rgba(181, 98, 45, 0.2)',
  },
  issues: {
    backgroundColor: 'rgba(90, 58, 122, 0.07)',
    color: '#4A2870',
    border: '1px solid rgba(90, 58, 122, 0.18)',
  },
};

// Initials avatar when no image is available
const InitialsAvatar = ({ name }: { name: string }) => {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const hue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;

  return (
    <Box
      sx={{
        width: 88,
        height: 88,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: `hsl(${hue}, 28%, 82%)`,
        fontFamily: '"Cormorant Garamond", serif',
        fontWeight: 600,
        fontSize: '1.5rem',
        color: `hsl(${hue}, 35%, 28%)`,
        letterSpacing: '0.03em',
        userSelect: 'none',
      }}
    >
      {initials}
    </Box>
  );
};

export const TherapistCard = ({ therapist, isFavorite, onToggleFavorite, index = 0 }: TherapistCardProps) => {
  const delay = Math.min(index * 50, 300);

  return (
    <Card
      className="result-card"
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        animationDelay: `${delay}ms`,
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 }, '&:last-child': { pb: { xs: 2.5, md: 3 } } }}>
        {/* Header: photo + identity + save button */}
        <Box sx={{ display: 'flex', gap: 2.5, mb: 2.5 }}>
          {/* Photo or initials */}
          <Box sx={{ flexShrink: 0 }}>
            {therapist.image ? (
              <Box
                component="img"
                src={therapist.image}
                alt={therapist.name}
                sx={{
                  width: 88,
                  height: 88,
                  borderRadius: 2,
                  objectFit: 'cover',
                  display: 'block',
                  border: '1px solid rgba(221, 213, 200, 0.5)',
                }}
              />
            ) : (
              <InitialsAvatar name={therapist.name} />
            )}
          </Box>

          {/* Name, title, credentials */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontWeight: 600,
                    fontSize: { xs: '1.375rem', md: '1.5rem' },
                    lineHeight: 1.2,
                    color: 'text.primary',
                    letterSpacing: '-0.01em',
                    mb: 0.25,
                  }}
                >
                  {therapist.name}
                </Typography>
                {therapist.title && (
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', lineHeight: 1.4, mb: 0.25 }}
                  >
                    {therapist.title}
                  </Typography>
                )}
                {therapist.credentials && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block' }}
                  >
                    {therapist.credentials}
                  </Typography>
                )}
              </Box>

              {/* Save / bookmark button */}
              <Tooltip title={isFavorite ? 'Remove from saved' : 'Save therapist'} placement="left">
                <IconButton
                  onClick={onToggleFavorite}
                  size="small"
                  sx={{
                    color: isFavorite ? 'secondary.main' : 'text.secondary',
                    bgcolor: isFavorite ? 'rgba(181, 98, 45, 0.08)' : 'transparent',
                    border: '1px solid',
                    borderColor: isFavorite ? 'rgba(181, 98, 45, 0.25)' : 'grey.300',
                    '&:hover': {
                      bgcolor: 'rgba(181, 98, 45, 0.1)',
                      borderColor: 'secondary.main',
                      color: 'secondary.main',
                    },
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                  }}
                >
                  {isFavorite ? (
                    <Bookmark fontSize="small" />
                  ) : (
                    <BookmarkBorder fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Box>

            {/* Service mode + accepting status badges */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1.25 }}>
              {therapist.telehealth && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1,
                    py: 0.375,
                    borderRadius: 20,
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    bgcolor: 'rgba(37, 61, 46, 0.08)',
                    color: '#1F3828',
                    border: '1px solid rgba(37, 61, 46, 0.15)',
                  }}
                >
                  <VideocamOutlined sx={{ fontSize: 12 }} />
                  Telehealth
                </Box>
              )}
              {therapist.in_person && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1,
                    py: 0.375,
                    borderRadius: 20,
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    bgcolor: 'rgba(58, 82, 112, 0.07)',
                    color: '#2A3D5A',
                    border: '1px solid rgba(58, 82, 112, 0.15)',
                  }}
                >
                  <PersonOutlined sx={{ fontSize: 12 }} />
                  In-Person
                </Box>
              )}
              {therapist.accepting_clients === false && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1,
                    py: 0.375,
                    borderRadius: 20,
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    bgcolor: 'rgba(168, 48, 48, 0.07)',
                    color: '#8A2828',
                    border: '1px solid rgba(168, 48, 48, 0.15)',
                  }}
                >
                  Not accepting
                </Box>
              )}
              {therapist.free_consultation && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1,
                    py: 0.375,
                    borderRadius: 20,
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    bgcolor: 'rgba(181, 98, 45, 0.08)',
                    color: '#7A4215',
                    border: '1px solid rgba(181, 98, 45, 0.2)',
                  }}
                >
                  Free consultation
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Bio */}
        {therapist.intro && (
          <Typography
            variant="body1"
            sx={{
              color: 'text.primary',
              lineHeight: 1.7,
              mb: 2.5,
              fontSize: '0.9rem',
            }}
          >
            {therapist.intro}
          </Typography>
        )}

        {/* Details grid */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2.5 }}>
          {/* Rate */}
          {therapist.rate_min && therapist.rate_max && (
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', minWidth: 80 }}>
                Rate
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  fontFamily: '"IBM Plex Mono", monospace',
                }}
              >
                {therapist.rate_min} – {therapist.rate_max}
              </Typography>
            </Box>
          )}

          {/* Languages */}
          {therapist.languages && (
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', minWidth: 80 }}>
                Languages
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
                {therapist.languages}
              </Typography>
            </Box>
          )}

          {/* Insurance */}
          {therapist.insurance && therapist.insurance.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', minWidth: 80, pt: 0.25 }}>
                Insurance
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {therapist.insurance.filter(Boolean).map(ins => (
                  <Chip
                    key={ins}
                    label={ins}
                    size="small"
                    sx={chipStyles.insurance}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Services */}
          {therapist.services && therapist.services.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', minWidth: 80, pt: 0.25 }}>
                Services
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {therapist.services.map(service => (
                  <Chip
                    key={service}
                    label={service}
                    size="small"
                    sx={chipStyles.services}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Techniques */}
          {therapist.other_techniques && therapist.other_techniques.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', minWidth: 80, pt: 0.25 }}>
                Techniques
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {therapist.other_techniques.map(technique => (
                  <Chip
                    key={technique}
                    label={technique}
                    size="small"
                    sx={chipStyles.techniques}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Issues */}
          {therapist.other_issues && therapist.other_issues.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', minWidth: 80, pt: 0.25 }}>
                Focuses on
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {therapist.other_issues.map(issue => (
                  <Chip
                    key={issue}
                    label={issue}
                    size="small"
                    sx={chipStyles.issues}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Ideal client section */}
        {therapist.ideal_client && (
          <Box
            sx={{
              bgcolor: 'grey.100',
              border: '1px solid',
              borderColor: 'grey.200',
              borderRadius: 2,
              px: 2,
              py: 1.5,
              mb: 2.5,
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 0.75, color: 'text.secondary' }}>
              Ideal Client
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.65 }}>
              {therapist.ideal_client}
            </Typography>
          </Box>
        )}

        {/* Approaches */}
        {therapist.approaches && therapist.approaches.length > 0 && (
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Therapeutic Approaches
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {therapist.approaches.map((approach, i) => {
                const name = typeof approach === 'string' ? approach : approach.name;
                return (
                  <Box
                    key={i}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      px: 1.25,
                      py: 0.375,
                      borderRadius: 4,
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'text.secondary',
                      bgcolor: 'grey.100',
                      border: '1px solid',
                      borderColor: 'grey.300',
                    }}
                  >
                    {name}
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        {/* Footer: visit profile */}
        {therapist.url && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              pt: 1,
              borderTop: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Button
              href={therapist.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              color="primary"
              size="small"
              endIcon={<Launch sx={{ fontSize: '0.875rem !important' }} />}
              sx={{
                fontSize: '0.8125rem',
              }}
            >
              View Profile
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

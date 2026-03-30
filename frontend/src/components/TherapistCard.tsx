import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Tooltip,
  Divider,
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
    backgroundColor: 'rgba(37, 61, 46, 0.07)',
    color: '#253D2E',
    border: '1px solid rgba(37, 61, 46, 0.2)',
    borderRadius: '4px',
    fontSize: '0.8125rem',
  },
  techniques: {
    backgroundColor: 'rgba(181, 98, 45, 0.08)',
    color: '#8F4D23',
    border: '1px solid rgba(181, 98, 45, 0.22)',
    borderRadius: '4px',
    fontSize: '0.8125rem',
  },
  services: {
    backgroundColor: 'rgba(37, 61, 46, 0.06)',
    color: '#3A5C47',
    border: '1px solid rgba(37, 61, 46, 0.18)',
    borderRadius: '4px',
    fontSize: '0.8125rem',
  },
  issues: {
    backgroundColor: 'rgba(92, 80, 69, 0.08)',
    color: '#3D3028',
    border: '1px solid rgba(92, 80, 69, 0.2)',
    borderRadius: '4px',
    fontSize: '0.8125rem',
  },
};

// Collapsible chip group: shows first N chips then "+X more"
const CHIP_LIMIT = 5;
const ChipGroup = ({ items, style }: { items: string[]; style: React.CSSProperties }) => {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, CHIP_LIMIT);
  const overflow = items.length - CHIP_LIMIT;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
      {visible.filter(Boolean).map(item => (
        <Chip key={item} label={item} size="small" sx={style} />
      ))}
      {!expanded && overflow > 0 && (
        <Box
          onClick={() => setExpanded(true)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1.25,
            py: 0.5,
            borderRadius: '4px',
            fontSize: '0.8125rem',
            fontWeight: 500,
            cursor: 'pointer',
            bgcolor: 'rgba(26, 18, 8, 0.04)',
            color: 'text.secondary',
            border: '1px solid rgba(26, 18, 8, 0.1)',
            userSelect: 'none',
            '&:hover': { bgcolor: 'rgba(26, 18, 8, 0.08)' },
          }}
        >
          +{overflow} more
        </Box>
      )}
      {expanded && overflow > 0 && (
        <Box
          onClick={() => setExpanded(false)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1.25,
            py: 0.5,
            borderRadius: '4px',
            fontSize: '0.8125rem',
            fontWeight: 500,
            cursor: 'pointer',
            color: 'text.secondary',
            userSelect: 'none',
            '&:hover': { color: 'text.primary' },
          }}
        >
          Show less
        </Box>
      )}
    </Box>
  );
};

// Initials avatar when no image is available
const InitialsAvatar = ({ name }: { name: string }) => {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Box
      sx={{
        width: 68,
        height: 68,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: 'rgba(37, 61, 46, 0.09)',
        border: '2px solid rgba(37, 61, 46, 0.15)',
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        fontWeight: 600,
        fontSize: '1.25rem',
        color: '#253D2E',
        letterSpacing: '0.02em',
        userSelect: 'none',
      }}
    >
      {initials}
    </Box>
  );
};

export const TherapistCard = ({ therapist, isFavorite, onToggleFavorite, index = 0 }: TherapistCardProps) => {
  const delay = Math.min(index * 50, 300);
  const [bioExpanded, setBioExpanded] = useState(false);
  const isNotAccepting = therapist.accepting_clients === false;

  return (
    <Card
      className="result-card"
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        animationDelay: `${delay}ms`,
        opacity: isNotAccepting ? 0.75 : 1,
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 }, '&:last-child': { pb: { xs: 2.5, md: 3 } } }}>
        {/* ── Header: photo + identity + rate pill + save button ── */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
          {/* Photo or initials */}
          <Box sx={{ flexShrink: 0 }}>
            {therapist.image ? (
              <Box
                component="img"
                src={therapist.image}
                alt={therapist.name}
                sx={{
                  width: 68,
                  height: 68,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  display: 'block',
                  border: '2px solid rgba(37, 61, 46, 0.15)',
                }}
              />
            ) : (
              <InitialsAvatar name={therapist.name} />
            )}
          </Box>

          {/* Name, title, credentials, rate */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="h5"
                  sx={{
                    lineHeight: 1.2,
                    color: 'text.primary',
                    mb: 0.25,
                  }}
                >
                  {therapist.name}
                </Typography>
                {therapist.title && (
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      color: 'text.secondary',
                      lineHeight: 1.45,
                      mb: 0.2,
                      fontFamily: '"DM Sans", sans-serif',
                    }}
                  >
                    {therapist.title}
                  </Typography>
                )}
                {therapist.credentials && (
                  <Typography
                    sx={{
                      fontSize: '0.8125rem',
                      color: '#8C7D6E',
                      display: 'block',
                      mb: 0.75,
                      fontFamily: '"DM Sans", sans-serif',
                    }}
                  >
                    {therapist.credentials}
                  </Typography>
                )}
                {/* Rate pill — uses monospace for the number */}
                {therapist.rate_min && therapist.rate_max && (
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      px: 1.25,
                      py: 0.5,
                      borderRadius: '4px',
                      bgcolor: 'rgba(37, 61, 46, 0.07)',
                      border: '1px solid rgba(37, 61, 46, 0.15)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"IBM Plex Mono", monospace',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: '#253D2E',
                        letterSpacing: '0',
                      }}
                    >
                      {therapist.rate_min}–{therapist.rate_max} / session
                    </Typography>
                  </Box>
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
                    borderColor: isFavorite ? 'rgba(181, 98, 45, 0.3)' : 'grey.200',
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
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    fontFamily: '"DM Sans", sans-serif',
                    bgcolor: 'rgba(37, 61, 46, 0.08)',
                    color: '#253D2E',
                    border: '1px solid rgba(37, 61, 46, 0.18)',
                  }}
                >
                  <VideocamOutlined sx={{ fontSize: 13 }} />
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
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    fontFamily: '"DM Sans", sans-serif',
                    bgcolor: 'rgba(181, 98, 45, 0.08)',
                    color: '#8F4D23',
                    border: '1px solid rgba(181, 98, 45, 0.18)',
                  }}
                >
                  <PersonOutlined sx={{ fontSize: 13 }} />
                  In-Person
                </Box>
              )}
              {isNotAccepting && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1,
                    py: 0.375,
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    fontFamily: '"DM Sans", sans-serif',
                    bgcolor: 'rgba(184, 50, 50, 0.08)',
                    color: '#B83232',
                    border: '1px solid rgba(184, 50, 50, 0.2)',
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
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    fontFamily: '"DM Sans", sans-serif',
                    bgcolor: 'rgba(58, 107, 72, 0.08)',
                    color: '#3A6B48',
                    border: '1px solid rgba(58, 107, 72, 0.2)',
                  }}
                >
                  Free consultation
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2.5, borderColor: '#DDD5C8' }} />

        {/* ── Bio with truncation ── */}
        {therapist.intro && (
          <Box sx={{ mb: 2.5 }}>
            <Typography
              sx={{
                color: 'text.primary',
                lineHeight: 1.75,
                fontSize: '0.9375rem',
                fontFamily: '"DM Sans", sans-serif',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: bioExpanded ? 'unset' : 4,
                overflow: 'hidden',
              }}
            >
              {therapist.intro}
            </Typography>
            {therapist.intro.length > 300 && (
              <Button
                onClick={() => setBioExpanded(prev => !prev)}
                variant="text"
                size="small"
                sx={{
                  mt: 0.75,
                  px: 0,
                  minWidth: 0,
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  fontWeight: 500,
                  '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                }}
              >
                {bioExpanded ? 'Show less' : 'Read more'}
              </Button>
            )}
          </Box>
        )}

        {/* ── Details grid ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, mb: 2.5 }}>
          {/* Languages */}
          {therapist.languages && (
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: 'text.secondary', minWidth: 88, flexShrink: 0 }}
              >
                Languages
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', color: 'text.primary', fontFamily: '"DM Sans", sans-serif' }}>
                {therapist.languages}
              </Typography>
            </Box>
          )}

          {/* Insurance */}
          {therapist.insurance && therapist.insurance.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: 'text.secondary', minWidth: 88, flexShrink: 0, pt: 0.25 }}
              >
                Insurance
              </Typography>
              <ChipGroup items={therapist.insurance} style={chipStyles.insurance} />
            </Box>
          )}

          {/* Services */}
          {therapist.services && therapist.services.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: 'text.secondary', minWidth: 88, flexShrink: 0, pt: 0.25 }}
              >
                Services
              </Typography>
              <ChipGroup items={therapist.services} style={chipStyles.services} />
            </Box>
          )}

          {/* Techniques */}
          {therapist.other_techniques && therapist.other_techniques.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: 'text.secondary', minWidth: 88, flexShrink: 0, pt: 0.25 }}
              >
                Techniques
              </Typography>
              <ChipGroup items={therapist.other_techniques} style={chipStyles.techniques} />
            </Box>
          )}

          {/* Issues */}
          {therapist.other_issues && therapist.other_issues.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: 'text.secondary', minWidth: 88, flexShrink: 0, pt: 0.25 }}
              >
                Focuses on
              </Typography>
              <ChipGroup items={therapist.other_issues} style={chipStyles.issues} />
            </Box>
          )}
        </Box>

        {/* ── Ideal client — left accent border ── */}
        {therapist.ideal_client && (
          <Box
            sx={{
              borderLeft: '3px solid #253D2E',
              bgcolor: 'rgba(37, 61, 46, 0.04)',
              borderRadius: '0 6px 6px 0',
              px: 2,
              py: 1.5,
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ mb: 0.75, color: '#253D2E', fontWeight: 600 }}
            >
              Ideal Client
            </Typography>
            <Typography
              sx={{
                fontSize: '0.9rem',
                color: 'text.primary',
                lineHeight: 1.7,
                fontFamily: '"DM Sans", sans-serif',
              }}
            >
              {therapist.ideal_client}
            </Typography>
          </Box>
        )}

        {/* ── Therapeutic Approaches ── */}
        {therapist.approaches && therapist.approaches.length > 0 && (
          <Box
            sx={{
              borderRadius: '0 6px 6px 0',
              px: 2,
              py: 1.5,
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, color: '#B5622D', fontWeight: 600 }}
            >
              Therapeutic Approaches
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {therapist.approaches.map((approach, i) => {

                const name = typeof approach === 'string' ? approach : approach.name;
                return (
                  <Box
                    key={i}
                    sx={{
                      py: 0.5,
                      borderBottom: '1px solid rgba(26, 18, 8, 0.05)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.9rem',
                        color: 'text.primary',
                        lineHeight: 1.6,
                        fontFamily: '"DM Sans", sans-serif',
                      }}
                    >
                      {name}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        {/* ── Footer ── */}
        {therapist.url && (
          <>
            <Divider sx={{ mb: 1.5, borderColor: '#DDD5C8' }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                href={therapist.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="text"
                endIcon={<Launch sx={{ fontSize: '0.9rem !important' }} />}
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'primary.main',
                  px: 1,
                  '&:hover': {
                    bgcolor: 'rgba(37, 61, 46, 0.06)',
                    color: 'primary.dark',
                  },
                }}
              >
                View Profile
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

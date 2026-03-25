import React from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';

type SelectedFilters = Record<string, string[]>;

interface DynamicFiltersProps {
  searchResults: any[];
  selectedFilters: SelectedFilters;
  onFilterChange: (filters: SelectedFilters) => void;
}

const DynamicFilters: React.FC<DynamicFiltersProps> = ({
  searchResults,
  selectedFilters,
  onFilterChange,
}) => {
  const handleFilterChange = (key: string, value: string) => {
    const newValues = selectedFilters[key] ? [...selectedFilters[key]] : [];
    const index = newValues.indexOf(value);
    if (index === -1) {
      newValues.push(value);
    } else {
      newValues.splice(index, 1);
    }

    if (newValues.length === 0) {
      const { [key]: _, ...rest } = selectedFilters;
      onFilterChange(rest);
    } else {
      onFilterChange({ ...selectedFilters, [key]: newValues });
    }
  };

  const clearAllFilters = () => onFilterChange({});

  if (searchResults.length === 0) return null;

  const generateFilterOptions = (data: any[], key: string) => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      const value = item[key];
      if (value) {
        if (Array.isArray(value)) {
          value.forEach(v => {
            if (v) counts[v] = (counts[v] || 0) + 1;
          });
        } else {
          counts[value] = (counts[value] || 0) + 1;
        }
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  const listFilters = [
    { key: 'status', label: 'Status' },
    { key: 'services', label: 'Services' },
    { key: 'insurance', label: 'Insurance' },
    { key: 'other_techniques', label: 'Techniques' },
    { key: 'other_issues', label: 'Focuses on' },
  ];

  const booleanFilters = [
    { key: 'telehealth', label: 'Telehealth' },
    { key: 'in_person', label: 'In-Person' },
  ];

  const hasActiveFilters = Object.keys(selectedFilters).length > 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {hasActiveFilters && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 0.5 }}>
          <Button
            startIcon={<ClearIcon />}
            onClick={clearAllFilters}
            size="small"
            sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}
          >
            Clear all filters
          </Button>
        </Box>
      )}

      {listFilters.map(({ key, label }) => {
        const options = generateFilterOptions(searchResults, key);
        if (options.length === 0) return null;

        return (
          <Accordion key={key} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: 'text.primary',
                  }}
                >
                  {label}
                </Typography>
                {selectedFilters[key]?.length > 0 && (
                  <Box
                    sx={{
                      minWidth: 18,
                      height: 18,
                      borderRadius: '9px',
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      px: 0.5,
                    }}
                  >
                    {selectedFilters[key].length}
                  </Box>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 1, pb: 1.5 }}>
              <FormGroup>
                {options.map(([value, count]) => (
                  <FormControlLabel
                    key={value}
                    control={
                      <Checkbox
                        checked={selectedFilters[key]?.includes(value) || false}
                        onChange={() => handleFilterChange(key, value)}
                        size="small"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography
                          sx={{ flexGrow: 1, fontSize: '0.8125rem', color: 'text.primary' }}
                        >
                          {value}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '0.6875rem',
                            color: 'text.secondary',
                            ml: 1,
                            fontFamily: '"IBM Plex Mono", monospace',
                          }}
                        >
                          {count}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      width: '100%',
                      margin: 0,
                      padding: '2px 0',
                      '& .MuiFormControlLabel-label': { width: '100%' },
                    }}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        );
      })}

      {booleanFilters.map(({ key, label }) => {
        const trueCount = searchResults.filter(item => item[key] === true).length;
        const falseCount = searchResults.filter(item => item[key] === false).length;
        if (trueCount === 0 && falseCount === 0) return null;

        return (
          <Accordion key={key} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary' }}
                >
                  {label}
                </Typography>
                {selectedFilters[key]?.length > 0 && (
                  <Box
                    sx={{
                      minWidth: 18,
                      height: 18,
                      borderRadius: '9px',
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      px: 0.5,
                    }}
                  >
                    {selectedFilters[key].length}
                  </Box>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 1, pb: 1.5 }}>
              <FormGroup>
                {trueCount > 0 && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedFilters[key]?.includes('true') || false}
                        onChange={() => handleFilterChange(key, 'true')}
                        size="small"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ flexGrow: 1, fontSize: '0.8125rem', color: 'text.primary' }}>
                          Yes
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '0.6875rem',
                            color: 'text.secondary',
                            ml: 1,
                            fontFamily: '"IBM Plex Mono", monospace',
                          }}
                        >
                          {trueCount}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      width: '100%',
                      margin: 0,
                      padding: '2px 0',
                      '& .MuiFormControlLabel-label': { width: '100%' },
                    }}
                  />
                )}
                {falseCount > 0 && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedFilters[key]?.includes('false') || false}
                        onChange={() => handleFilterChange(key, 'false')}
                        size="small"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ flexGrow: 1, fontSize: '0.8125rem', color: 'text.primary' }}>
                          No
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '0.6875rem',
                            color: 'text.secondary',
                            ml: 1,
                            fontFamily: '"IBM Plex Mono", monospace',
                          }}
                        >
                          {falseCount}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      width: '100%',
                      margin: 0,
                      padding: '2px 0',
                      '& .MuiFormControlLabel-label': { width: '100%' },
                    }}
                  />
                )}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default DynamicFilters;

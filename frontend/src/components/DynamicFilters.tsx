import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, FormGroup, Chip, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';

type SelectedFilters = Record<string, string[]>;

interface DynamicFiltersProps {
  searchResults: any[];
  selectedFilters: SelectedFilters;
  onFilterChange: (filters: SelectedFilters) => void;
}

const DynamicFilters: React.FC<DynamicFiltersProps> = ({ searchResults, selectedFilters, onFilterChange }) => {
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
      onFilterChange({
        ...selectedFilters,
        [key]: newValues,
      });
    }
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  if (searchResults.length === 0) {
    return null;
  }

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
          if (value) counts[value] = (counts[value] || 0) + 1;
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
    { key: 'other_issues', label: 'Issues' },
  ];

  // Boolean filters
  const booleanFilters = [
    { key: 'telehealth', label: 'Telehealth' },
    { key: 'in_person', label: 'In-Person' },
  ];

  const hasActiveFilters = Object.keys(selectedFilters).length > 0;

  return (
    <Box sx={{ pt: 1 }}>
      {hasActiveFilters && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            startIcon={<ClearIcon />}
            onClick={clearAllFilters}
            variant="outlined"
            size="small"
            color="error"
          >
            Clear All Filters
          </Button>
        </Box>
      )}
      
      {listFilters.map(({ key, label }) => {
        const options = generateFilterOptions(searchResults, key);
        if (options.length === 0) return null;

        return (
          <Accordion key={key} defaultExpanded sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight={600}>
                {label}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {options.map(([value, count]) => (
                  <FormControlLabel
                    key={value}
                    control={
                      <Checkbox 
                        checked={selectedFilters[key]?.includes(value) || false}
                        onChange={() => handleFilterChange(key, value)}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          {value}
                        </Typography>
                        <Chip label={count} size="small" sx={{ ml: 1 }} />
                      </Box>
                    }
                    sx={{ 
                      width: '100%', 
                      margin: 0, 
                      padding: '4px 0',
                      '& .MuiFormControlLabel-label': { width: '100%' }
                    }}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* Boolean Filters */}
      {booleanFilters.map(({ key, label }) => {
        const trueCount = searchResults.filter(item => item[key] === true).length;
        const falseCount = searchResults.filter(item => item[key] === false).length;
        
        if (trueCount === 0 && falseCount === 0) return null;

        return (
          <Accordion key={key} defaultExpanded sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight={600}>
                {label}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {trueCount > 0 && (
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={selectedFilters[key]?.includes('true') || false}
                        onChange={() => handleFilterChange(key, 'true')}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          Yes
                        </Typography>
                        <Chip label={trueCount} size="small" sx={{ ml: 1 }} />
                      </Box>
                    }
                    sx={{ 
                      width: '100%', 
                      margin: 0, 
                      padding: '4px 0',
                      '& .MuiFormControlLabel-label': { width: '100%' }
                    }}
                  />
                )}
                {falseCount > 0 && (
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={selectedFilters[key]?.includes('false') || false}
                        onChange={() => handleFilterChange(key, 'false')}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          No
                        </Typography>
                        <Chip label={falseCount} size="small" sx={{ ml: 1 }} />
                      </Box>
                    }
                    sx={{ 
                      width: '100%', 
                      margin: 0, 
                      padding: '4px 0',
                      '& .MuiFormControlLabel-label': { width: '100%' }
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
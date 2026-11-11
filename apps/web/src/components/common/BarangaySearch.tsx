'use client';

import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import type { SxProps, Theme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { LUCENA_BARANGAYS } from '../../data/lucenaBarangays';

interface BarangaySearchProps {
  /** Currently selected barangay name, or null. */
  value: string | null;
  /** Called with the chosen barangay name, or null when cleared. */
  onChange: (name: string | null) => void;
  /** Optional: control the typed text (for live-filtering a list elsewhere). */
  inputValue?: string;
  onInputChange?: (text: string) => void;
  placeholder?: string;
  sx?: SxProps<Theme>;
}

/**
 * Barangay search with a name-only dropdown.
 * Options are plain strings from LUCENA_BARANGAYS and every row is rendered
 * as just the name, so no zone data can leak into the list.
 */
export function BarangaySearch({
  value,
  onChange,
  inputValue,
  onInputChange,
  placeholder = 'Search barangay',
  sx,
}: BarangaySearchProps) {
  return (
    <Autocomplete
      size="small"
      options={LUCENA_BARANGAYS}
      value={value}
      onChange={(_, name) => onChange(name)}
      {...(inputValue !== undefined && {
        inputValue,
        onInputChange: (_: React.SyntheticEvent, text: string) => onInputChange?.(text),
      })}
      noOptionsText="No barangay found"
      renderOption={(props, option) => {
        const { key, ...liProps } = props;
        return (
          <li key={key} {...liProps}>
            {option}
          </li>
        );
      }}
      sx={sx}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}   
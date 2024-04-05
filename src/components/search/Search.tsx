import { FormControl, TextField, InputAdornment } from '@mui/material';
import React, { FunctionComponent, useState } from 'react';
import { Search, Clear } from '@mui/icons-material';

const TypeSearch: FunctionComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const [showClearIcon, setShowClearIcon] = useState('none');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
    setShowClearIcon(event.target.value === '' ? 'none' : 'flex');
  };

  const handleClearInput = (): void => {
    setInputValue('');
    setShowClearIcon('none');
  };

  return (
    <FormControl sx={{ marginLeft: 20 }}>
      <TextField
        size="small"
        variant="outlined"
        value={inputValue}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment
              position="end"
              style={{ display: showClearIcon, cursor: 'pointer' }}
              onClick={handleClearInput}
            >
              <Clear />
            </InputAdornment>
          ),
        }}
      />
    </FormControl>
  );
};

export default TypeSearch;

import { Search } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import classNames from 'classnames/bind';
import { ChangeEvent } from 'react';
import styles from './SearchBar.module.scss';

const cx = classNames.bind(styles);

interface SearchBarProps {
  placeholder?: string;
  onChange: (value: string) => void;
  value: string;
}

export default function SearchBar({ placeholder = 'Tìm kiếm bằng tên nhóm học tập', onChange, value }: SearchBarProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cx('searchBar')}>
      <TextField
        fullWidth
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          className: cx('input')
        }}
      />
    </div>
  );
} 
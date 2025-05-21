import { Pagination as MUIPagination, PaginationItem, PaginationRenderItemParams } from '@mui/material';
import classnames from 'classnames/bind';
import styles from './ProfilePersonalComponents.module.scss';

const cx = classnames.bind(styles);

interface CustomPaginationProps {
  totalPages: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  currentPage?: number;
  useAlphabet?: boolean;
}

const CustomPagination = ({ 
  totalPages, 
  onPageChange, 
  currentPage = 1,
  useAlphabet = false
}: CustomPaginationProps) => {
  // For alphabet pagination
  const alphabet = Array.from('1234567');

  return (
    <div className={cx('pagination-container')}>
      <MUIPagination
        count={totalPages}
        defaultPage={currentPage}
        page={currentPage}
        siblingCount={0}
        onChange={onPageChange}
        variant="outlined"
        shape="circular"
        hidePrevButton={false}
        hideNextButton={false}
        renderItem={(item: PaginationRenderItemParams) => (
          <PaginationItem
            sx={{
              margin: '0 4px',
              fontFamily: 'Inter',
              color: 'var(--primary-color)',
              borderColor: 'rgba(255, 60, 60, 0.3)',
              '&.Mui-selected': {
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                borderColor: 'var(--primary-color)',
              },
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 60, 60, 0.1)',
                borderColor: 'var(--primary-color)',
              },
              '&:focus': {
                outline: 'none',
              }
            }}
            {...item}
            page={useAlphabet && item.page ? alphabet[item.page - 1] : item.page}
          />
        )}
      />
    </div>
  );
};

export default CustomPagination; 
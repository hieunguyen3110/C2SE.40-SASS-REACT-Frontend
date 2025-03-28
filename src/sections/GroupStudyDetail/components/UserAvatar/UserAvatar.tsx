import React from 'react';
import { Avatar } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './UserAvatar.module.scss';

const cx = classNames.bind(styles);

interface UserAvatarProps {
  src?: string;
  name: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  src, 
  name, 
  size = 'medium',
  className 
}) => {
  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get random background color based on name
  const getRandomColor = (name: string) => {
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7', 
      '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', 
      '#009688', '#4CAF50', '#8BC34A', '#CDDC39', 
      '#FFC107', '#FF9800', '#FF5722'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Avatar 
      src={src} 
      alt={name}
      className={cx('user-avatar', size, className)}
      sx={{ 
        bgcolor: !src ? getRandomColor(name) : undefined,
        width: size === 'small' ? 32 : size === 'large' ? 48 : 40,
        height: size === 'small' ? 32 : size === 'large' ? 48 : 40,
      }}
    >
      {!src && getInitials(name)}
    </Avatar>
  );
};

export default UserAvatar; 
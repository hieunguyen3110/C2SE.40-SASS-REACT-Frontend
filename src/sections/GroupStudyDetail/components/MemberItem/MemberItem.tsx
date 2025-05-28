import React, { useState, useRef, useEffect } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames/bind';
import styles from './MemberItem.module.scss';
import UserAvatar from '../UserAvatar/UserAvatar';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    ListItemButton,
    ListItemText,
    Radio,
    Divider,
    Typography,
} from '@mui/material';
import { RootState } from '../../../../redux/store';
import { useAppSelector } from '../../../../redux/store';

const cx = classNames.bind(styles);

interface MemberItemProps {
    id: number;
    avatar?: string;
    name: string;
    joinDate: string;
    role?: 'OWNER' | 'ADMIN' | 'MEMBER';
    showActions?: boolean;
    canDelete?: boolean;
    onDelete?: () => void;
    onRoleChange?: (newRole: 'OWNER' | 'ADMIN' | 'MEMBER') => void;
    canChangeRole?: boolean;
}

const MemberItem: React.FC<MemberItemProps> = ({
    id,
    avatar,
    name,
    joinDate,
    role = 'MEMBER',
    showActions = true,
    canDelete,
    onDelete,
    onRoleChange,
    canChangeRole = false,
}) => {
    const { accountId } = useAppSelector((state: RootState) => state.authentication);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'OWNER' | 'ADMIN' | 'MEMBER'>(role);
    const [dialogConfig, setDialogConfig] = useState<{
        title: string;
        content: React.ReactNode;
        onConfirm: () => void;
        confirmText: string;
    }>({
        title: '',
        content: null,
        onConfirm: () => {},
        confirmText: '',
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close the menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (menuOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        // Add event listeners for both mouse and touch events
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [menuOpen]);

    const handleToggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event from bubbling up
        setMenuOpen((prev) => !prev);
    };

    const openDialog = (config: {
        title: string;
        content: React.ReactNode;
        onConfirm: () => void;
        confirmText: string;
    }) => {
        setDialogConfig(config);
        setDialogOpen(true);
    };

    const handleDeleteClick = () => {
        setMenuOpen(false);
        openDialog({
            title: 'Xác nhận xóa',
            content: (
                <p>
                    Bạn có chắc chắn muốn xóa thành viên <strong>{name}</strong> khỏi nhóm?
                </p>
            ),
            onConfirm: () => {
                if (onDelete) onDelete();
            },
            confirmText: 'Xóa',
        });
    };

    const handleRoleClick = () => {
        setMenuOpen(false);
        setSelectedRole(role);
        setRoleDialogOpen(true);
    };

    const handleRoleChange = (newRole: 'OWNER' | 'ADMIN' | 'MEMBER') => {
        setSelectedRole(newRole);
    };

    const handleConfirmDialog = () => {
        dialogConfig.onConfirm();
        setDialogOpen(false);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleCloseRoleDialog = () => {
        setRoleDialogOpen(false);
    };

    const handleConfirmRoleChange = () => {
        setRoleDialogOpen(false);
        onRoleChange?.(selectedRole);
    };

    // Menu animation variants
    const menuVariants = {
        hidden: {
            opacity: 0,
            scale: 0.85,
            y: -5,
            transformOrigin: 'top right',
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 25,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.85,
            y: -5,
            transition: {
                duration: 0.2,
            },
        },
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    return (
        <>
            <motion.div
                className={cx('member-item')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                <div className={cx('member-info')}>
                    <UserAvatar src={avatar} name={name !== 'null null' ? name : joinDate} className={cx('avatar')} />
                    <div className={cx('details')}>
                        <h4 className={cx('name')}>{name !== 'null null' ? name : joinDate}</h4>
                        <span className={cx('date')}>{joinDate}</span>
                    </div>
                </div>
                <div className={cx('role-actions')}>
                    <div className={cx('role-badge', role.toLowerCase())}>
                        <span className={cx('role-text')}>{role}</span>
                    </div>
                    {showActions && (
                        <div className={cx('menu-container')} ref={containerRef}>
                            <motion.button
                                ref={menuButtonRef}
                                className={cx('more-actions', { active: menuOpen })}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleToggleMenu}
                            >
                                <MoreHorizIcon />
                            </motion.button>

                            {id !== accountId && (
                                <AnimatePresence>
                                    {menuOpen && (
                                        <>
                                            <motion.div
                                                className={cx('menu-backdrop')}
                                                variants={backdropVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                onClick={() => setMenuOpen(false)}
                                            />

                                            <motion.div
                                                ref={menuRef}
                                                className={cx('custom-menu')}
                                                variants={menuVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                            >
                                                {canChangeRole && (
                                                    <motion.button
                                                        className={cx('menu-item', 'role-item')}
                                                        onClick={handleRoleClick}
                                                        whileHover={{
                                                            backgroundColor: 'rgba(25, 118, 210, 0.15)',
                                                            x: 3,
                                                            transition: { type: 'spring', stiffness: 300 },
                                                        }}
                                                        whileTap={{
                                                            scale: 0.95,
                                                            backgroundColor: 'rgba(25, 118, 210, 0.25)',
                                                        }}
                                                    >
                                                        <motion.div
                                                            className={cx('item-icon-wrapper')}
                                                            style={{ backgroundColor: 'rgba(25, 118, 210, 0.08)' }}
                                                            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                                            transition={{ duration: 0.5 }}
                                                        >
                                                            <SettingsIcon
                                                                className={cx('item-icon')}
                                                                style={{ color: '#1976d2' }}
                                                            />
                                                        </motion.div>
                                                        <span>Chức vụ</span>
                                                    </motion.button>
                                                )}

                                                {canDelete && (
                                                    <motion.button
                                                        className={cx('menu-item', 'delete-item')}
                                                        onClick={handleDeleteClick}
                                                        whileHover={{
                                                            backgroundColor: 'rgba(211, 47, 47, 0.15)',
                                                            x: 3,
                                                            transition: { type: 'spring', stiffness: 300 },
                                                        }}
                                                        whileTap={{
                                                            scale: 0.95,
                                                            backgroundColor: 'rgba(211, 47, 47, 0.25)',
                                                        }}
                                                    >
                                                        <motion.div
                                                            className={cx('item-icon-wrapper')}
                                                            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                                            transition={{ duration: 0.5 }}
                                                        >
                                                            <DeleteIcon className={cx('item-icon')} />
                                                        </motion.div>
                                                        <span>Xóa thành viên</span>
                                                    </motion.button>
                                                )}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* MUI Dialog for confirmations */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    sx: { borderRadius: '8px', maxWidth: '500px' },
                }}
            >
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{
                        pb: 1,
                        fontWeight: 600,
                        color: dialogConfig.confirmText === 'Xóa' ? '#d32f2f' : '#1976d2',
                    }}
                >
                    {dialogConfig.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{ color: 'text.primary' }}>
                        {dialogConfig.content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleCloseDialog}
                        color="inherit"
                        sx={{
                            borderRadius: '4px',
                            minWidth: '80px',
                            fontWeight: 500,
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirmDialog}
                        color={dialogConfig.confirmText === 'Xóa' ? 'error' : 'primary'}
                        variant="contained"
                        autoFocus
                        sx={{
                            borderRadius: '4px',
                            minWidth: '80px',
                            fontWeight: 500,
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            },
                        }}
                    >
                        {dialogConfig.confirmText}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Role Selection Dialog */}
            <Dialog
                open={roleDialogOpen}
                onClose={handleCloseRoleDialog}
                aria-labelledby="role-dialog-title"
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '8px' },
                }}
            >
                <DialogTitle
                    id="role-dialog-title"
                    sx={{
                        fontWeight: 600,
                        pb: 1,
                    }}
                >
                    <Typography variant="h6">Chọn chức vụ</Typography>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 400 }}>
                        Chọn vai trò phù hợp cho thành viên này
                    </Typography>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 2 }}>
                    <ListItemButton
                        onClick={() => handleRoleChange('OWNER')}
                        disabled={role === 'OWNER'}
                        sx={{
                            borderRadius: '8px',
                            mb: 1,
                            bgcolor: selectedRole === 'OWNER' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                            '&:hover': {
                                bgcolor: 'rgba(139, 92, 246, 0.1)',
                            },
                            transition: 'all 0.2s',
                        }}
                    >
                        <Radio
                            checked={selectedRole === 'OWNER'}
                            sx={{
                                color: '#8b5cf6',
                                '&.Mui-checked': {
                                    color: '#8b5cf6',
                                },
                            }}
                        />
                        <ListItemText
                            primary="OWNER"
                            secondary="Chủ sở hữu nhóm, chỉnh sửa và xoá nhóm"
                            
                            primaryTypographyProps={{
                                fontWeight: selectedRole === 'OWNER' ? 600 : 500,
                                color: '#8b5cf6',
                            }}
                        />
                    </ListItemButton>

                    <Divider variant="middle" sx={{ my: 1.5 }} />
                    <ListItemButton
                        onClick={() => handleRoleChange('ADMIN')}
                        disabled={role === 'ADMIN'}
                        sx={{
                            borderRadius: '8px',
                            mb: 1,
                            bgcolor: selectedRole === 'ADMIN' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                            '&:hover': {
                                bgcolor: 'rgba(16, 185, 129, 0.1)',
                            },
                            transition: 'all 0.2s',
                        }}
                    >
                        <Radio
                            checked={selectedRole === 'ADMIN'}
                            sx={{
                                color: '#10b981',
                                '&.Mui-checked': {
                                    color: '#10b981',
                                },
                            }}
                        />
                        <ListItemText
                            primary="ADMIN"
                            secondary="Quản lý và tổ chức nhóm"
                            primaryTypographyProps={{
                                fontWeight: selectedRole === 'ADMIN' ? 600 : 500,
                                color: '#10b981',
                            }}
                        />
                    </ListItemButton>

                    <Divider variant="middle" sx={{ my: 1.5 }} />

                    <ListItemButton
                        onClick={() => handleRoleChange('MEMBER')}
                        disabled={role === 'MEMBER'}
                        sx={{
                            borderRadius: '8px',
                            bgcolor: selectedRole === 'MEMBER' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                            '&:hover': {
                                bgcolor: 'rgba(59, 130, 246, 0.1)',
                            },
                            transition: 'all 0.2s',
                        }}
                    >
                        <Radio
                            checked={selectedRole === 'MEMBER'}
                            sx={{
                                color: '#3b82f6',
                                '&.Mui-checked': {
                                    color: '#3b82f6',
                                },
                            }}
                        />
                        <ListItemText
                            primary="MEMBER"
                            secondary="Thành viên cơ bản"
                            primaryTypographyProps={{
                                fontWeight: selectedRole === 'MEMBER' ? 600 : 500,
                                color: '#3b82f6',
                            }}
                        />
                    </ListItemButton>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={handleCloseRoleDialog}
                        color="inherit"
                        sx={{
                            borderRadius: '4px',
                            fontWeight: 500,
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirmRoleChange}
                        color="error"
                        variant="contained"
                        disabled={selectedRole === role}
                        sx={{
                            borderRadius: '4px',
                            fontWeight: 500,
                            px: 3,
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            },
                        }}
                    >
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MemberItem;

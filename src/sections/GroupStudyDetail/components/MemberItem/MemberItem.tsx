import React, { useState, useRef, useEffect } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames/bind';
import styles from './MemberItem.module.scss';
import UserAvatar from '../UserAvatar/UserAvatar';
import AlertModal from '../../../../components/AlertModal/AlertModal';
import { useAlertModal } from '../../../../hooks/useAlertModal';

const cx = classNames.bind(styles);

interface MemberItemProps {
    avatar?: string;
    name: string;
    joinDate: string;
    role?: 'Owner' | 'Admin' | 'Member';
    showActions?: boolean;
    canDelete?: boolean;
    onDelete?: () => void;
}

const MemberItem: React.FC<MemberItemProps> = ({
    avatar,
    name,
    joinDate,
    role = 'Member',
    showActions = true,
    canDelete,
    onDelete,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const { isOpen, title, content, onConfirm, confirmText, openModal, closeModal } = useAlertModal();

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

    const handleDeleteClick = () => {
        setMenuOpen(false);
        openModal({
            title: 'Xác nhận xóa',
            content: (
                <p>
                    Bạn có chắc chắn muốn xóa thành viên <strong>{name}</strong> khỏi nhóm?
                </p>
            ),
            onConfirm: () => {
                if (onDelete) onDelete();
                setMenuOpen(false);
            },
            confirmText: 'Xóa',
        });
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

                                        {canDelete && (
                                            <motion.div
                                                ref={menuRef}
                                                className={cx('custom-menu')}
                                                variants={menuVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                            >
                                                <motion.button
                                                    className={cx('menu-item', 'delete-item')}
                                                    onClick={handleDeleteClick}
                                                    whileHover={{
                                                        backgroundColor: 'rgba(255, 60, 60, 0.15)',
                                                        x: 3,
                                                        transition: { type: 'spring', stiffness: 300 },
                                                    }}
                                                    whileTap={{
                                                        scale: 0.95,
                                                        backgroundColor: 'rgba(255, 60, 60, 0.25)',
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
                                            </motion.div>
                                        )}
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.div>

            <AlertModal
                isOpen={isOpen}
                onClose={closeModal}
                title={title}
                content={content}
                onConfirm={onConfirm}
                confirmText={confirmText}
            />
        </>
    );
};

export default MemberItem;

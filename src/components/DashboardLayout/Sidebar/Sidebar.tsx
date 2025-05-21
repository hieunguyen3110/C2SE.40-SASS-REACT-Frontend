import Avatar from '../../../assets/images/icons/student-avatar.svg';
import { 
    HomeOutlined as HomeOutlinedIcon, 
    InsertDriveFileOutlined as InsertDriveFileOutlinedIcon, 
    PermIdentityOutlined as PermIdentityOutlinedIcon, 
    ChevronLeft as CloseIcon, 
    ChevronRight as OpenIcon, 
    ContactSupportOutlined as ContactSupportOutlinedIcon
} from '@mui/icons-material';
import { Tooltip, styled } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppSelector } from '../../../redux/store';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const resourceItems = [
    {
        title: 'Tài liệu',
        icon: InsertDriveFileOutlinedIcon,
        pathAcitve: '/admin/documents',
    },
    {
        title: 'Người dùng',
        icon: PermIdentityOutlinedIcon,
        pathAcitve: '/admin/users',
    },
];

// Animation variants
const sidebarVariants = {
    open: { width: '20%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { width: '80px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const itemVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    closed: { opacity: 0, x: -10, transition: { duration: 0.2 } },
};

const hoverVariants = {
    hover: { scale: 1.03, transition: { duration: 0.2 } },
};

// Custom styled tooltip
const CustomTooltip = styled(({ className, ...props }: any) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({  }) => ({
    [`& .MuiTooltip-tooltip`]: {
        backgroundColor: '#fff1f1',
        color: '#ff3c3c',
        fontSize: '13px',
        fontWeight: 500,
        padding: '8px 12px',
        boxShadow: '0 2px 10px rgba(255, 60, 60, 0.1)',
        borderRadius: '6px',
        maxWidth: '200px',
        border: '1px solid rgba(255, 60, 60, 0.2)',
    },
    [`& .MuiTooltip-arrow`]: {
        color: '#fff1f1',
    },
}));

export default function Sidebar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const pathName = useLocation().pathname;
    const [showToggle, setShowToggle] = useState<boolean>(false);
    const { username, profilePicture } = useAppSelector((state) => state.authentication);
    const shouldShowTooltip = !isOpen;

    const handleClickProfile = () => {
        navigate('/admin/profile');
    };

    const isMenuItemActive = (pathActive: string) => {
        if (pathActive === '/admin/dashboard' && (pathName === '/admin/dashboard' || pathName === '/admin/dashboard/')) {
            return true;
        }

        if (pathActive !== '/admin/dashboard' && pathName.startsWith(pathActive)) {
            const nextChar = pathName.charAt(pathActive.length);
            return nextChar === '' || nextChar === '/';
        }

        return false;
    };

    return (
        <motion.div
            className={cx('sidebar')}
            variants={sidebarVariants}
            animate={isOpen ? 'open' : 'closed'}
            initial={isOpen ? 'open' : 'closed'}
            onMouseEnter={() => setShowToggle(true)}
            onMouseLeave={() => setShowToggle(false)}
        >
            <motion.div className={cx('account')}>
                <motion.img
                    src={profilePicture || Avatar}
                    alt="avatar"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                />
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h3 onClick={handleClickProfile}>{username !== 'null null' ? username : 'N/A'}</h3>
                            <span>Admin</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <div className={cx('toggle-container')}>
                <AnimatePresence>
                    {showToggle && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            whileHover={{ scale: 1.1 }} 
                            whileTap={{ scale: 0.95 }}
                        >
                            {isOpen ? (
                                <CloseIcon
                                    onClick={() => setIsOpen(false)}
                                    className={cx('toggle')}
                                    sx={{
                                        color: 'var(--primary-color)',
                                        fontSize: '28px',
                                        position: 'absolute',
                                        right: '-30px',
                                        top: '30px',
                                        cursor: 'pointer',
                                        backgroundColor: '#fff',
                                        borderRadius: '50%',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                    }}
                                />
                            ) : (
                                <OpenIcon
                                    onClick={() => setIsOpen(true)}
                                    className={cx('toggle')}
                                    sx={{
                                        color: 'var(--primary-color)',
                                        fontSize: '28px',
                                        position: 'absolute',
                                        right: '-27.5px',
                                        top: '30px',
                                        cursor: 'pointer',
                                        backgroundColor: '#fff',
                                        borderRadius: '50%',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                    }}
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.div style={{ ...(!isOpen && { alignItems: 'center' }) }} className={cx('items')}>
                <CustomTooltip
                    title="Trang chủ"
                    placement="right"
                    arrow
                    disableHoverListener={!shouldShowTooltip}
                >
                    <motion.div whileHover={hoverVariants.hover}>
                        <Link className={cx(pathName === '/admin/dashboard' && 'active')} to="/admin/dashboard">
                            <HomeOutlinedIcon
                                sx={{
                                    width: '22px',
                                    height: '22px',
                                    color: pathName === '/admin/dashboard' ? 'var(--primary-color)' : 'inherit',
                                    transition: 'color 0.3s ease',
                                }}
                            />
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.h3
                                        variants={itemVariants}
                                        initial="closed"
                                        animate="open"
                                        exit="closed"
                                    >
                                        Trang chủ
                                    </motion.h3>
                                )}
                            </AnimatePresence>
                        </Link>
                    </motion.div>
                </CustomTooltip>
            </motion.div>

            <motion.div style={{ ...(!isOpen && { alignItems: 'center' }) }} className={cx('items')}>
                <AnimatePresence>
                    {isOpen && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            Quản lý tài nguyên
                        </motion.span>
                    )}
                </AnimatePresence>

                {resourceItems.map((item, index) => (
                    <CustomTooltip
                        key={index}
                        title={item.title}
                        placement="right"
                        arrow
                        disableHoverListener={!shouldShowTooltip}
                    >
                        <motion.div whileHover={hoverVariants.hover}>
                            <Link
                                className={cx(isMenuItemActive(item.pathAcitve) && 'active')}
                                to={item.pathAcitve}
                            >
                                <item.icon
                                    sx={{
                                        width: '22px',
                                        height: '22px',
                                        color: isMenuItemActive(item.pathAcitve) ? 'var(--primary-color)' : 'inherit',
                                        transition: 'color 0.3s ease',
                                    }}
                                />
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.h3
                                            variants={itemVariants}
                                            initial="closed"
                                            animate="open"
                                            exit="closed"
                                        >
                                            {item.title}
                                        </motion.h3>
                                    )}
                                </AnimatePresence>
                            </Link>
                        </motion.div>
                    </CustomTooltip>
                ))}
            </motion.div>

            <CustomTooltip title="Hỗ trợ 24/7" placement="right" arrow disableHoverListener={!shouldShowTooltip}>
                <motion.button
                    id={cx(pathName === '/admin/support' && 'support-active')}
                    className={cx('support-btn')}
                    onClick={() => {
                        toast.info('Coming soon!');
                    }}
                    whileHover={{ scale: 1.05, boxShadow: '0px 4px 8px rgba(255, 60, 60, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ContactSupportOutlinedIcon sx={{ color: 'white' }} />
                    <AnimatePresence>
                        {isOpen && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                Hỗ trợ 24/7
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </CustomTooltip>
        </motion.div>
    );
}

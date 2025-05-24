import Avatar from '../../../assets/images/icons/student-avatar.svg';
import { Button } from '../../../components/Button';
import {
    HomeOutlined as HomeOutlinedIcon,
    InsertDriveFileOutlined as InsertDriveFileOutlinedIcon,
    NotificationsOutlined as NotificationsOutlinedIcon,
    PeopleOutline as PeopleOutlineIcon,
    PersonSearchOutlined as PersonSearchOutlinedIcon,
    BookmarkAddedOutlined as BookmarkAddedOutlinedIcon,
    SmartToyOutlined as SmartToyOutlinedIcon,
    ChevronLeft as CloseIcon,
    ChevronRight as OpenIcon,
    CreateNewFolderOutlined as CreateNewFolderOutlinedIcon,
    UploadFile as UploadFileIcon,
    ContactSupportOutlined as ContactSupportOutlinedIcon,
    AssessmentOutlined as AssessmentOutlinedIcon,
} from '@mui/icons-material';
import { Badge, Tooltip, styled } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../redux/store';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

const menuItems = [
    { title: 'Trang chủ', icon: HomeOutlinedIcon, pathActive: '/document' },
    { title: 'Nhóm học tập', icon: PeopleOutlineIcon, pathActive: '/document/group-study' },
    { title: 'AI Quiz', icon: AssessmentOutlinedIcon, pathActive: '/document/ai-quiz' },
];

const docItems = [
    {
        title: 'Tài liệu',
        icon: InsertDriveFileOutlinedIcon,
        regex: /^\/document\/(directory|folder)/,
        linkTo: '/document/directory',
    },
    {
        title: 'Thông báo',
        icon: NotificationsOutlinedIcon,
        regex: /^\/document\/(notication)/,
        linkTo: '/document/notification',
    },
];

const searchItems = [
    {
        title: 'Người dùng',
        icon: PersonSearchOutlinedIcon,
        pathAcitve: '/document/search-user',
    },
    {
        title: 'Tài liệu đã lưu',
        icon: BookmarkAddedOutlinedIcon,
        pathAcitve: '/document/document-storage',
    },
    {
        title: 'Hỗ trợ AI',
        icon: SmartToyOutlinedIcon,
        pathAcitve: '/document/ai-support',
    },
];

interface ISidebar {
    isModal: boolean;
    isOpen: boolean;
    setIsOpen: any;
}

// Animation variants
const sidebarVariants = {
    open: { width: '20%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { width: '80px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const itemVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    closed: { opacity: 0, x: -10, transition: { duration: 0.2 } },
};

const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 25,
        },
    },
};

const hoverVariants = {
    hover: { scale: 1.03, transition: { duration: 0.2 } },
};

// Custom styled tooltip
const CustomTooltip = styled(({ className, ...props }: any) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({}) => ({
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

export default function Sidebar({ isModal, isOpen, setIsOpen }: ISidebar) {
    const navigate = useNavigate();
    const pathName = useLocation().pathname;
    const [dropdownToggle, setDropdownToggle] = useState<boolean>(false);
    const [showToggle, setShowToggle] = useState<boolean>(false);
    const { username, profilePicture, follower, following, upload } = useAppSelector((state) => state.authentication);
    const { numberOfNotificationsUnRead } = useAppSelector((state) => state.notication);
    const isOpenAndModal = isModal && isOpen;
    const shouldShowTooltip = !isOpen;

    useEffect(() => {
        if (isModal) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    }, [isModal, setIsOpen]);

    const handleClickUpFIle = () => {
        navigate('/document/upload-file');
    };

    const handleClickProfile = () => {
        navigate('/document/profile-personal');
    };

    const uploadFileDropdown = (
        <AnimatePresence>
            {dropdownToggle && (
                <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className={cx('uploadfile-dropdown')}
                >
                    <motion.div
                        className={cx('item')}
                        onClick={handleClickUpFIle}
                        whileHover={{
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                        }}
                    >
                        <UploadFileIcon
                            sx={{
                                width: '22px',
                                height: '22px',
                            }}
                        />
                        {isOpen && <span>Tải tài liệu</span>}
                    </motion.div>
                    <hr />
                    <motion.div
                        className={cx('item')}
                        onClick={() => navigate('/document/create-folder')}
                        whileHover={{
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                        }}
                    >
                        <CreateNewFolderOutlinedIcon
                            sx={{
                                width: '22px',
                                height: '22px',
                            }}
                        />
                        {isOpen && <span>Tạo thư mục</span>}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const isMenuItemActive = (pathActive: string) => {
        if (pathActive === '/document' && (pathName === '/document' || pathName === '/document/')) {
            return true;
        }

        if (pathActive !== '/document' && pathName.startsWith(pathActive)) {
            const nextChar = pathName.charAt(pathActive.length);
            return nextChar === '' || nextChar === '/';
        }

        return false;
    };

    return (
        <motion.div
            style={isOpenAndModal ? { position: 'fixed' } : {}}
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
                            <h3 onClick={handleClickProfile}>{username ? username : 'Student'}</h3>
                            <a href="/document/edit-profile">+ Add information</a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <div className={cx('statistics')}>
                <AnimatePresence>
                    {showToggle && (
                        <motion.div
                            className={cx('toggle-container')}
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

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className={cx('statistics-in4')}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div>
                                <h3>{follower || 0}</h3>
                                <h4>Followers</h4>
                            </div>
                            <div>
                                <h3>{upload || 0}</h3>
                                <h4>Upload</h4>
                            </div>
                            <div>
                                <h3>{following || 0}</h3>
                                <h4>Following</h4>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.div
                className={cx('addDoc-btn')}
                onClick={(e) => {
                    e.preventDefault();
                    setDropdownToggle((prevDropdownToggle) => !prevDropdownToggle);
                }}
                whileHover={hoverVariants.hover}
                whileTap={{ scale: 0.98 }}
            >
                <Button text={`+ ${isOpen ? 'Thêm mới' : ''}`} paddingY={9.5} paddingX={0} fontSize={16} />
            </motion.div>

            {uploadFileDropdown}

            <motion.div style={{ ...(!isOpen && { alignItems: 'center' }) }} className={cx('items')}>
                {menuItems.map((item, index) => (
                    <CustomTooltip
                        key={index}
                        title={item.title}
                        placement="right"
                        arrow
                        disableHoverListener={!shouldShowTooltip}
                    >
                        <motion.div whileHover={hoverVariants.hover}>
                            <Link className={cx(isMenuItemActive(item.pathActive) && 'active')} to={item.pathActive}>
                                {typeof item.icon === 'string' ? (
                                    <img src={item.icon} alt={item.title} style={{ width: '22px', height: '22px' }} />
                                ) : (
                                    <item.icon
                                        sx={{
                                            width: '22px',
                                            height: '22px',
                                            color: isMenuItemActive(item.pathActive)
                                                ? 'var(--primary-color)'
                                                : 'inherit',
                                            transition: 'color 0.3s ease',
                                        }}
                                    />
                                )}
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

            <motion.div style={{ ...(!isOpen && { alignItems: 'center' }) }} className={cx('items')}>
                <AnimatePresence>
                    {isOpen && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            Tài liệu của tôi
                        </motion.span>
                    )}
                </AnimatePresence>

                {docItems.map((item, index) => (
                    <CustomTooltip
                        key={index}
                        title={item.title}
                        placement="right"
                        arrow
                        disableHoverListener={!shouldShowTooltip}
                    >
                        <motion.div whileHover={hoverVariants.hover}>
                            <Link
                                className={cx(
                                    (item.regex ? item.regex.test(pathName) : pathName === item.linkTo) && 'active',
                                    `${
                                        item.linkTo === '/document/notification' && numberOfNotificationsUnRead > 0
                                            ? 'brings'
                                            : ''
                                    }`,
                                )}
                                to={item.linkTo}
                            >
                                {item.linkTo === '/document/notification' ? (
                                    <Badge
                                        badgeContent={numberOfNotificationsUnRead > 0 ? numberOfNotificationsUnRead : 0}
                                        color="error"
                                        sx={{ '& .MuiBadge-badge': { backgroundColor: 'var(--primary-color)' } }}
                                    >
                                        <item.icon
                                            sx={{
                                                width: '22px',
                                                height: '22px',
                                                color: (
                                                    item.regex ? item.regex.test(pathName) : pathName === item.linkTo
                                                )
                                                    ? 'var(--primary-color)'
                                                    : item.linkTo === '/document/notification' &&
                                                        numberOfNotificationsUnRead > 0
                                                      ? 'var(--primary-color)'
                                                      : 'inherit',
                                                transition: 'color 0.3s ease',
                                            }}
                                        />
                                    </Badge>
                                ) : (
                                    <item.icon
                                        sx={{
                                            width: '22px',
                                            height: '22px',
                                            color: (item.regex ? item.regex.test(pathName) : pathName === item.linkTo)
                                                ? 'var(--primary-color)'
                                                : 'inherit',
                                            transition: 'color 0.3s ease',
                                        }}
                                    />
                                )}

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

            <motion.div style={{ ...(!isOpen && { alignItems: 'center' }) }} className={cx('items')}>
                <AnimatePresence>
                    {isOpen && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            Tìm kiếm nâng cao
                        </motion.span>
                    )}
                </AnimatePresence>

                {searchItems.map((item, index) => (
                    <CustomTooltip
                        key={index}
                        title={item.title}
                        placement="right"
                        arrow
                        disableHoverListener={!shouldShowTooltip}
                    >
                        <motion.div whileHover={hoverVariants.hover}>
                            <Link className={cx(isMenuItemActive(item.pathAcitve) && 'active')} to={item.pathAcitve}>
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
                    id={cx(pathName === '/document/support' && 'support-active')}
                    className={cx('support-btn')}
                    onClick={() => {
                        navigate('/document/support');
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

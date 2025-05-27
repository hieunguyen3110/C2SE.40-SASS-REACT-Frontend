import classNames from 'classnames/bind';
import styles from './GroupSidebar.module.scss';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import React, { useEffect, useState } from 'react';
import { getGroupOfUserAction } from '../../../redux/GroupStudySlice/GroupStudySlice';
import { IGroup } from '../../../types/groupStudy.types';

// MUI Icons only
import {
    Search as SearchIcon,
    Add as AddIcon,
    Help as HelpIcon,
    PeopleOutline as GroupIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    InfoOutlined as InfoIcon,
} from '@mui/icons-material';
const cx = classNames.bind(styles);

const GroupSidebar = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const [ownedGroups, setOwnedGroups] = useState<IGroup[]>([]);
    const [joinedGroups, setJoinedGroups] = useState<IGroup[]>([]);
    const [showAllOwned, setShowAllOwned] = useState(false);
    const [showAllJoined, setShowAllJoined] = useState(false);

    const { username, profilePicture, listRoles, accountId } = useAppSelector((state) => state.authentication);
    const { userGroups, loading, unreadMessages } = useAppSelector((state) => state.groupStudy);

    // Function to get unread message count for a specific group
    const getUnreadMessageCount = (groupId: number) => {
        const unreadInfo = unreadMessages.find((msg) => msg.groupId === groupId);
        return unreadInfo ? unreadInfo.count : 0;
    };

    useEffect(() => {
        // Dispatch action to get user groups
        if (userGroups.length === 0) {
            dispatch(getGroupOfUserAction());
        }
    }, [dispatch, userGroups]);

    useEffect(() => {
        if (userGroups && Array.isArray(userGroups)) {
            // Split groups into owned and joined groups
            // Note: API returns "userId" which is actually the owner ID
            const owned = userGroups.filter((group) => group.userId === accountId);
            const joined = userGroups.filter((group) => group.userId !== accountId);

            setOwnedGroups(owned);
            setJoinedGroups(joined);
        }
    }, [userGroups, accountId]);


    const navigationItems = [
        {
            icon: <AddIcon />,
            label: 'Tạo nhóm học tập',
            path: '/document/group-study/create',
        },
        {
            icon: <GroupIcon />,
            label: 'Quản lý nhóm học tập',
            path: '/document/group-study/management',
        },
        {
            icon: <SearchIcon />,
            label: 'Tìm kiếm nhóm học tập',
            path: '/document/group-study/search',
        },
        {
            icon: <HelpIcon />,
            label: 'Hỗ trợ',
            path: '/document/group-study/support',
        },
    ];

    // Get limited groups to display (3 by default)
    const displayedOwnedGroups = showAllOwned ? ownedGroups : ownedGroups.slice(0, 3);
    const displayedJoinedGroups = showAllJoined ? joinedGroups : joinedGroups.slice(0, 3);

    // Functions to toggle visibility
    const toggleOwnedGroups = () => setShowAllOwned(!showAllOwned);
    const toggleJoinedGroups = () => setShowAllJoined(!showAllJoined);

    return (
        <div className={cx('sidebar')}>
            {/* Header */}
            <div className={cx('header')}>
                <Link to="/document/group-study" className={cx('headerLink')}>
                    <h2 className={cx('headerTitle')}>
                        <span className={cx('groupText')}>GROUP</span>
                        <span className={cx('studyText')}>STUDY</span>
                    </h2>
                </Link>
                <Link to={'/document/group-study/search'} className={cx('searchButton')}>
                    <SearchIcon className={cx('searchIcon')} />
                </Link>
            </div>

            {/* User Profile */}
            <div className={cx('userProfile')}>
                <div className={cx('avatar')}>
                    {profilePicture ? (
                        <img src={profilePicture} alt={username} />
                    ) : (
                        <span>{username?username?.charAt(0)?.toUpperCase():"A"}</span>
                    )}
                </div>
                <div className={cx('userInfo')}>
                    <span className={cx('username')}>{username}</span>
                    <span className={cx('userRole')}>{listRoles.map((role) => role).join(', ').toString()==="STUDENT"?"Sinh viên": "Giảng viên"}</span>
                </div>
            </div>

            <hr className={cx('divider')} />

            {/* Navigation */}
            <div className={cx('section')}>
                <h3 className={cx('sectionTitle')}>Điều hướng</h3>

                <ul className={cx('navList')}>
                    {navigationItems.map((item, index) => (
                        <li key={index} className={cx('navItem')}>
                            <Link
                                to={item.path}
                                className={cx('navLink', { selected: location.pathname === item.path })}
                            >
                                <span className={cx('navIcon')}>
                                    {React.cloneElement(item.icon, {
                                        style: { color: location.pathname === item.path ? '#ff3c3c' : 'inherit' },
                                    })}
                                </span>
                                <span className={cx('navText', { selectedText: location.pathname === item.path })}>
                                    {item.label}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <hr className={cx('divider')} />

            {/* Group Chats */}
            <div className={cx('section')}>
                <div className={cx('sectionHeader')}>
                    <h3 className={cx('sectionTitle')}>Nhóm chat</h3>
                    <Link to={'/document/group-study/create'} className={cx('addButton')}>
                        <AddIcon className={cx('addIcon')} />
                    </Link>
                </div>

                {/* My Groups (Owner) */}
                <div className={cx('groupCategory')}>
                    <h4 className={cx('categoryTitle')}>Nhóm của tôi</h4>
                    {loading && ownedGroups.length === 0 ? (
                        <p>Đang tải...</p>
                    ) : (
                        <>
                            <ul className={cx('chatList')}>
                                {ownedGroups.length === 0 ? (
                                    <li>Chưa có nhóm nào</li>
                                ) : (
                                    displayedOwnedGroups.map((group, index) => (
                                        <li
                                            key={index}
                                            className={cx('chatItem', {
                                                selected:
                                                    location.pathname === `/document/group-study/${group.groupId}` ||
                                                    location.pathname === `/document/group-study/${group.groupId}/chat`,
                                            })}
                                        >
                                            <Link
                                                to={`/document/group-study/${group.groupId}/chat`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    width: 'calc(100% - 30px)',
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                }}
                                            >
                                                <span className={cx('chatIcon')}>
                                                    <GroupIcon
                                                        style={{
                                                            color:
                                                                location.pathname ===
                                                                    `/document/group-study/${group.groupId}` ||
                                                                location.pathname ===
                                                                    `/document/group-study/${group.groupId}/chat`
                                                                    ? '#ff3c3c'
                                                                    : 'inherit',
                                                        }}
                                                    />
                                                    {getUnreadMessageCount(group.groupId) > 0 && (
                                                        <span className={cx('unreadBadge')}>
                                                            {getUnreadMessageCount(group.groupId)}
                                                        </span>
                                                    )}
                                                </span>
                                                <span
                                                    className={cx('chatText', {
                                                        selectedText:
                                                            location.pathname ===
                                                                `/document/group-study/${group.groupId}` ||
                                                            location.pathname ===
                                                                `/document/group-study/${group.groupId}/chat`,
                                                    })}
                                                >
                                                    {group.groupName}
                                                </span>
                                            </Link>
                                            <Link
                                                to={`/document/group-study/${group.groupId}`}
                                                className={cx('chatButton')}
                                                title="Group information"
                                            >
                                                <InfoIcon className={cx('chatSvgIcon')} />
                                            </Link>
                                        </li>
                                    ))
                                )}
                            </ul>
                            {ownedGroups.length > 3 && (
                                <button className={cx('showMoreButton')} onClick={toggleOwnedGroups}>
                                    {showAllOwned ? (
                                        <>
                                            <span>Thu gọn</span>
                                            <ExpandLessIcon fontSize="small" />
                                        </>
                                    ) : (
                                        <>
                                            <span>Xem tất cả ({ownedGroups.length})</span>
                                            <ExpandMoreIcon fontSize="small" />
                                        </>
                                    )}
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Joined Groups (Member) */}
                <div className={cx('groupCategory')}>
                    <h4 className={cx('categoryTitle')}>Nhóm đã tham gia</h4>
                    {loading && joinedGroups.length === 0 ? (
                        <p>Đang tải...</p>
                    ) : (
                        <>
                            <ul className={cx('chatList')}>
                                {joinedGroups.length === 0 ? (
                                    <li>Chưa tham gia nhóm nào</li>
                                ) : (
                                    displayedJoinedGroups.map((group, index) => (
                                        <li
                                            key={index}
                                            className={cx('chatItem', {
                                                selected:
                                                    location.pathname === `/document/group-study/${group.groupId}` ||
                                                    location.pathname === `/document/group-study/${group.groupId}/chat`,
                                            })}
                                        >
                                            <Link
                                                to={`/document/group-study/${group.groupId}/chat`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    width: 'calc(100% - 30px)',
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                }}
                                            >
                                                <span className={cx('chatIcon')}>
                                                    <GroupIcon
                                                        style={{
                                                            color:
                                                                location.pathname ===
                                                                    `/document/group-study/${group.groupId}` ||
                                                                location.pathname ===
                                                                    `/document/group-study/${group.groupId}/chat`
                                                                    ? '#ff3c3c'
                                                                    : 'inherit',
                                                        }}
                                                    />
                                                    {getUnreadMessageCount(group.groupId) > 0 && (
                                                        <span className={cx('unreadBadge')}>
                                                            {getUnreadMessageCount(group.groupId)}
                                                        </span>
                                                    )}
                                                </span>
                                                <span
                                                    className={cx('chatText', {
                                                        selectedText:
                                                            location.pathname ===
                                                                `/document/group-study/${group.groupId}` ||
                                                            location.pathname ===
                                                                `/document/group-study/${group.groupId}/chat`,
                                                    })}
                                                >
                                                    {group.groupName}
                                                </span>
                                            </Link>
                                            <Link
                                                to={`/document/group-study/${group.groupId}`}
                                                className={cx('chatButton')}
                                                title="Group information"
                                            >
                                                <InfoIcon className={cx('chatSvgIcon')} />
                                            </Link>
                                        </li>
                                    ))
                                )}
                            </ul>
                            {joinedGroups.length > 3 && (
                                <button className={cx('showMoreButton')} onClick={toggleJoinedGroups}>
                                    {showAllJoined ? (
                                        <>
                                            <span>Thu gọn</span>
                                            <ExpandLessIcon fontSize="small" />
                                        </>
                                    ) : (
                                        <>
                                            <span>Xem tất cả ({joinedGroups.length})</span>
                                            <ExpandMoreIcon fontSize="small" />
                                        </>
                                    )}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupSidebar;

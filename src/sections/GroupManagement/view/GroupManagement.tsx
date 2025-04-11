import { useState, useEffect } from 'react';
import styles from './GroupManagement.module.scss';
import classNames from 'classnames/bind';
import { 
    Typography, 
    Box, 
    Container, 
    Card, 
    CardContent, 
    Avatar, 
    Chip, 
    Button,
    InputAdornment,
    TextField
} from '@mui/material';
import { 
    Search as SearchIcon, 
    PeopleOutline as GroupIcon,
    ArrowForward as ArrowForwardIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

// Mock data for the groups
const mockGroups = [
    {
        id: 1,
        name: 'Nhóm học Machine Learning',
        description: 'Nghiên cứu và thực hành các thuật toán Machine Learning',
        memberCount: 25,
        role: 'Admin',
        category: 'Khoa học máy tính',
        lastActive: '2 giờ trước'
    },
    {
        id: 2,
        name: 'Học Toán cao cấp',
        description: 'Thảo luận về các chủ đề Đại số tuyến tính và Giải tích',
        memberCount: 18,
        role: 'Member',
        category: 'Toán học',
        lastActive: 'Hôm qua'
    },
    {
        id: 3,
        name: 'Nhóm ôn thi IELTS',
        description: 'Luyện tập và chia sẻ tài liệu học IELTS',
        memberCount: 32,
        role: 'Moderator',
        category: 'Ngoại ngữ',
        lastActive: '3 ngày trước'
    },
    {
        id: 4,
        name: 'Lập trình Web nâng cao',
        description: 'Chia sẻ kiến thức về React, Angular và Vue',
        memberCount: 15,
        role: 'Member',
        category: 'Công nghệ',
        lastActive: 'Hôm nay'
    }
];

export default function GroupManagement() {
    const [groups, setGroups] = useState(mockGroups);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Filter groups based on search query
    const filteredGroups = groups.filter(group => 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleGroupClick = (groupId: number) => {
        navigate(`/document/group-study/${groupId}`);
    };

    const getRoleColor = (role: string) => {
        switch(role) {
            case 'Admin':
                return '#eb2930'; // using the main color for admin
            case 'Moderator':
                return '#1976d2'; // blue for moderator
            default:
                return '#4caf50'; // green for member
        }
    };

    return (
        <Container className={cx('group-management')}>
            <Box className={cx('header')}>
                <Typography variant="h4" className={cx('title')}>
                    Quản lý nhóm học tập
                </Typography>
                <Typography variant="body1" className={cx('subtitle')}>
                    Danh sách các nhóm học tập bạn đang tham gia
                </Typography>
            </Box>

            {/* Search bar */}
            <Box className={cx('search-container')}>
                <TextField
                    className={cx('search-input')}
                    placeholder="Tìm kiếm theo tên nhóm hoặc mô tả..."
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Groups list */}
            <Box className={cx('groups-list')}>
                {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                        <Card key={group.id} className={cx('group-card')} onClick={() => handleGroupClick(group.id)}>
                            <CardContent className={cx('card-content')}>
                                <Box className={cx('group-info')}>
                                    <Avatar className={cx('group-avatar')}>
                                        <GroupIcon />
                                    </Avatar>
                                    <Box className={cx('group-details')}>
                                        <Box className={cx('name-and-role')}>
                                            <Typography variant="h6" className={cx('group-name')}>
                                                {group.name}
                                            </Typography>
                                            <Chip
                                                label={group.role}
                                                size="small"
                                                className={cx('role-chip')}
                                                style={{ 
                                                    backgroundColor: `${getRoleColor(group.role)}20`, 
                                                    color: getRoleColor(group.role),
                                                    borderColor: getRoleColor(group.role)
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="body2" className={cx('group-description')}>
                                            {group.description}
                                        </Typography>
                                        <Box className={cx('group-metadata')}>
                                            <Chip
                                                label={group.category}
                                                size="small"
                                                className={cx('category-chip')}
                                            />
                                            <Typography variant="body2" className={cx('member-count')}>
                                                {group.memberCount} thành viên
                                            </Typography>
                                            <Typography variant="body2" className={cx('last-active')}>
                                                Hoạt động: {group.lastActive}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box className={cx('action-area')}>
                                    <Button
                                        variant="outlined"
                                        className={cx('view-button')}
                                        endIcon={<ArrowForwardIcon />}
                                    >
                                        Xem nhóm
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Box className={cx('empty-state')}>
                        <Typography variant="h6">Không tìm thấy nhóm nào</Typography>
                        <Typography variant="body2">
                            Bạn chưa tham gia nhóm nào hoặc không có nhóm nào phù hợp với tìm kiếm của bạn.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
}

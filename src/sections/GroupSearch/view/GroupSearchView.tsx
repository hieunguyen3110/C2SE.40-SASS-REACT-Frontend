import { Container, Typography, Box, Button } from '@mui/material';
import classNames from 'classnames/bind';
import { useState } from 'react';
import GroupCard from '../components/GroupCard';
import GroupSearchHeader from '../components/GroupSearchHeader';
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';
import EmptyStateIllustration from '../../../assets/images/empty-state.svg';
import styles from './GroupSearchView.module.scss';

const cx = classNames.bind(styles);

// Define the Group type
interface Group {
  id: number;
  image: string;
  category: string;
  memberCount: number;
  title: string;
  description: string;
}

// Mock data for the groups
const mockGroups: Group[] = [
  {
    id: 1,
    image: 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=JavaScript',
    category: 'Programming',
    memberCount: 24,
    title: 'JavaScript Mastery',
    description: 'A group focused on advanced JavaScript concepts and modern frameworks.',
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/300x200/3498db/ffffff?text=Data+Science',
    category: 'Data Science',
    memberCount: 18,
    title: 'Data Science Explorers',
    description: 'Exploring data analysis, machine learning, and statistical methods together.',
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/300x200/27ae60/ffffff?text=UX+Design',
    category: 'Design',
    memberCount: 15,
    title: 'UX/UI Design Workshop',
    description: 'Collaborative learning about user experience and interface design principles.',
  },
  {
    id: 4,
    image: 'https://via.placeholder.com/300x200/9b59b6/ffffff?text=Mobile+Dev',
    category: 'Programming',
    memberCount: 20,
    title: 'Mobile App Development',
    description: 'Building iOS and Android applications with React Native and Flutter.',
  },
];

export default function GroupSearchView() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter groups based on search query
  const filteredGroups = mockGroups.filter(group => 
    group.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if there are no groups to display
  const noGroupsFound = filteredGroups.length === 0;

  const handleJoinGroup = (groupId: number) => {
    console.log(`Joining group with ID: ${groupId}`);
    // Here would be the logic to join a group
  };

  return (
    <Container className={cx('groupSearchView')}>
      <GroupSearchHeader 
        title="Tìm kiếm nhóm học tập"
        subtitle="Kết nối với những người khác có cùng sở thích và cùng nhau học hỏi trong quá trình công tác nhóm"
      />
      
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
      />
      
      <Typography className={cx('resultsCount')}>
        {filteredGroups.length} groups found
      </Typography>
      
      {noGroupsFound ? (
        <Box className={cx('emptyState')}>
          <img 
            src={EmptyStateIllustration} 
            alt="No groups found" 
            className={cx('emptyStateImage')}
          />
          <Typography variant="h5" className={cx('emptyStateTitle')}>
            Không tìm thấy nhóm học tập nào
          </Typography>
          <Typography className={cx('emptyStateDescription')}>
            Hiện tại chúng tôi thấy bạn chưa tham gia hoặc tạo nhóm học tập nào hết.
            Bạn có thể tạo một nhóm học tập mới để bắt đầu.
          </Typography>
          <Button 
            component={Link}
            to="/document/group-study/create"
            variant="contained" 
            color="primary" 
            className={cx('createGroupButton')}
          >
            Tạo nhóm ngay
          </Button>
        </Box>
      ) : (
        <div className={cx('groupsList')}>
          {filteredGroups.map(group => (
            <GroupCard
              key={group.id}
              image={group.image}
              category={group.category}
              memberCount={group.memberCount}
              title={group.title}
              description={group.description}
              onJoin={() => handleJoinGroup(group.id)}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
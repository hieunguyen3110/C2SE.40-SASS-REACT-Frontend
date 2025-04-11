import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import styles from './GroupCreationForm.module.scss';

const cx = classNames.bind(styles);

import {
    Box,
    Typography,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Paper,
    InputAdornment,
    Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookIcon from '@mui/icons-material/Book';
import LockIcon from '@mui/icons-material/Lock';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import { useState } from 'react';
import { useAppDispatch } from '../../../../redux/store';
import { createGroupAction } from '../../../../redux/GroupStudySlice/GroupStudySlice';

// Available categories
const categories = [
    { id: 'programming', label: 'Lập trình' },
    { id: 'language', label: 'Ngôn ngữ' },
    { id: 'economics', label: 'Kinh tế' },
    { id: 'law', label: 'Luật' },
    { id: 'tourism', label: 'Du lịch' },
    { id: 'design', label: 'Thiết kế đồ họa' },
    { id: 'management', label: 'QTKD' },
    { id: 'medicine', label: 'Y khoa' },
    { id: 'other', label: 'Khác' },
];

const GroupCreationForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [memberLimit, setMemberLimit] = useState(10);
    const [isPublic, setIsPublic] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // await dispatch(createGroupAction({
            //     groupName: groupName,
            //     description,
            //     isPrivate: !isPublic,
            //     memberIds: [],
            // })).unwrap();

            // Chuyển hướng về trang danh sách nhóm sau khi tạo thành công
            // navigate('/document/group-study');
        } catch (error) {
            console.error('Lỗi khi tạo nhóm:', error);
        }
    };

    return (
        <Box className={cx('container')}>
            <Paper className={cx('formPaper')}>
                <Typography variant="h5" className={cx('formTitle')}>
                    Tạo nhóm học tập
                </Typography>

                <Box component="form" onSubmit={handleSubmit} className={cx('form')}>
                    {/* Group Information Section */}
                    <Box className={cx('section')}>
                        <Box className={cx('sectionHeader')}>
                            <BookIcon sx={{ color: '#e62e2d' }} />
                            <Typography variant="h6">Thông tin nhóm</Typography>
                        </Box>

                        <Box className={cx('formField')}>
                            <Typography className={cx('fieldLabel')}>
                                Tên Nhóm<span className={cx('required')}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Nhập tên nhóm"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                required
                                variant="outlined"
                                className={cx('input')}
                            />
                        </Box>

                        <Box className={cx('formField')}>
                            <Typography className={cx('fieldLabel')}>
                                Group Theme/Subject<span className={cx('required')}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm môn học, ngành học..."
                                variant="outlined"
                                className={cx('input')}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Box className={cx('categoryChips')}>
                                {categories.map((category) => (
                                    <Chip
                                        key={category.id}
                                        label={category.label}
                                        onClick={() => setSelectedCategory(category.id)}
                                        sx={{
                                            backgroundColor: selectedCategory === category.id ? '#FFE0E1' : 'default',
                                            color: selectedCategory === category.id ? '#e62e2d' : 'default',
                                            border: selectedCategory === category.id ? '1px solid #e62e2d' : 'default',
                                        }}
                                        variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                                        className={cx('categoryChip')}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    {/* Privacy Settings Section */}
                    <Box className={cx('section')}>
                        <Box className={cx('sectionHeader')}>
                            <LockIcon sx={{ color: '#e62e2d' }} />
                            <Typography variant="h6">Thiết lập quyền riêng tư</Typography>
                        </Box>

                        <FormControlLabel
                            control={
                                <Switch checked={isPublic} onChange={() => setIsPublic(!isPublic)} color="primary" />
                            }
                            label={
                                <Box className={cx('switchLabel')}>
                                    <Typography>Công khai nhóm</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Bất kì ai cũng có thể tham gia
                                    </Typography>
                                </Box>
                            }
                            className={cx('switchControl')}
                        />
                    </Box>

                    {/* Group Description Section */}
                    <Box className={cx('section')}>
                        <Box className={cx('sectionHeader')}>
                            <InfoIcon sx={{ color: '#e62e2d' }} />
                            <Typography variant="h6">Thông tin nhóm</Typography>
                        </Box>

                        <Box className={cx('formField')}>
                            <Typography className={cx('fieldLabel')}>Mô tả</Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Mô tả về nhóm học tập của bạn về ngành học, mục tiêu,..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                variant="outlined"
                                className={cx('input')}
                            />
                            <Typography variant="caption" className={cx('charCount')}>
                                {description.length}/500 kí tự
                            </Typography>
                        </Box>
                    </Box>

                    {/* Members Section */}
                    <Box className={cx('section')}>
                        <Box className={cx('sectionHeader')}>
                            <PeopleIcon sx={{ color: '#e62e2d' }} />
                            <Typography variant="h6">Thành viên</Typography>
                        </Box>

                        <Box className={cx('formField')}>
                            <Typography className={cx('fieldLabel')}>Giới hạn thành viên</Typography>
                            <Box className={cx('memberLimitContainer')}>
                                <TextField
                                    type="number"
                                    value={memberLimit}
                                    onChange={(e: any) => setMemberLimit(e.target.value)}
                                    variant="outlined"
                                    inputProps={{ min: 1, max: 100 }}
                                    className={cx('memberLimitInput')}
                                />
                                <Typography className={cx('memberLimitLabel')}>thành viên</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Submit Button */}
                    <Button type="submit" variant="contained" color="error" fullWidth className={cx('submitButton')}>
                        Tạo nhóm học tập
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default GroupCreationForm;

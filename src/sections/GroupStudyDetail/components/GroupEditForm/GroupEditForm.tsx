import classNames from 'classnames/bind';
import { useParams } from 'react-router-dom';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import { editGroupAction, searchSubjectsAction } from '../../../../redux/GroupStudySlice/GroupStudySlice';
import { motion } from 'framer-motion';
import { debounce } from '@mui/material';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { CreateGroupRequest } from '../../../../types/groupStudy.types';

// MUI Icons only
import SearchIcon from '@mui/icons-material/Search';
import BookIcon from '@mui/icons-material/Book';
import LockIcon from '@mui/icons-material/Lock';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

// Default image
import defaultUserImage from '../../../../assets/images/icons/user-pen-svgrepo-com.svg';

import styles from './GroupEditForm.module.scss';

const cx = classNames.bind(styles);

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
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: 'beforeChildren',
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 24,
        },
    },
};

const buttonVariants = {
    hover: {
        scale: 1.05,
        boxShadow: '0px 5px 10px rgba(255, 60, 60, 0.3)',
        transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
};

const chipVariants = {
    hover: {
        scale: 1.1,
        transition: { duration: 0.2 },
    },
    tap: { scale: 0.9 },
};

interface GroupEditFormProps {
    open: boolean;
    onClose: () => void;
}

const GroupEditForm = ({ open, onClose }: GroupEditFormProps) => {
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();
    const groupId = id ? parseInt(id) : 0;
    const { currentGroup, loading } = useAppSelector((state) => state.groupStudy);

    // Form state
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [memberLimited, setMemberLimited] = useState(10);
    const [isPrivate, setIsPrivate] = useState<boolean>(currentGroup?.isPrivate ?? true);
    const [selectedCategory, setSelectedCategory] = useState('');

    // Group picture state
    const [groupPicture, setGroupPicture] = useState<File | null>(null);
    const [previewPicture, setPreviewPicture] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Create a ref for the search input
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Subject search state
    const [subjectSelected, setSubjectSelected] = useState('');
    const [subjectId, setSubjectId] = useState<string>('');

    // Get group data and search results from Redux store
    const searchSubject = useAppSelector((state) => state.groupStudy.subjects) || [];

    // Load current group data when the component mounts or currentGroup changes
    useEffect(() => {
        if (currentGroup) {
            setGroupName(currentGroup.groupName || '');
            setDescription(currentGroup.description || '');
            setMemberLimited(currentGroup.memberLimited || 10);
            setIsPrivate(currentGroup.isPrivate ?? true);
            // Check if subjectName exists and use it to set appropriate values
            setSubjectId(String(currentGroup.subjectId));
            setSubjectSelected(currentGroup.subjectName || '');
            // Set group picture preview if available
            if (currentGroup.picture) {
                setPreviewPicture(currentGroup.picture);
            } else {
                setPreviewPicture(defaultUserImage);
            }
        }
    }, [currentGroup]);

    // Debounced search function
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceSearchSubject = useCallback(
        debounce((value: string) => dispatch(searchSubjectsAction(value)).unwrap(), 1000),
        [dispatch, searchSubjectsAction],
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const clearSubjects = useCallback(() => {
        dispatch({ type: 'groupStudy/searchSubjects/fulfilled', payload: [] });
    }, [dispatch]);

    // Search subject handler
    const handleSearchSubject = async (value: string) => {
        setSubjectSelected(value);

        if (!value.trim()) {
            clearSubjects();
            return;
        }
        try {
            debounceSearchSubject(value);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check if file is jpg or png
        const fileType = file.type;
        if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
            alert('Chỉ chấp nhận file JPG hoặc PNG');
            return;
        }

        // Set the file to state
        setGroupPicture(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewPicture(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Create FormData instead of a regular object
            const formData = new FormData();
            formData.append('groupName', groupName);
            formData.append('description', description);
            formData.append('isPrivate', String(isPrivate));
            formData.append('memberLimited', String(memberLimited));
            formData.append('picture', currentGroup?.picture || '');
            formData.append('subjectId', subjectId);
            formData.append('file', groupPicture || '');
            // formData.append('memberIds', JSON.stringify([]));

            await dispatch(
                editGroupAction({
                    groupId,
                    // Use type assertion to resolve type compatibility issue
                    data: formData as unknown as CreateGroupRequest,
                }),
            ).unwrap();

            onClose();
        } catch (error) {
            console.error('Lỗi khi cập nhật nhóm:', error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                style: { borderRadius: '12px' },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 24px',
                    borderBottom: '1px solid #f0f0f0',
                }}
            >
                <span style={{ fontSize: '1.5rem', fontWeight: 500 }}>Chỉnh sửa nhóm học tập</span>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <motion.div
                    className={cx('container')}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.form
                        onSubmit={handleSubmit}
                        className={cx('form')}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Group Picture Section */}
                        <motion.section className={cx('section')} variants={itemVariants}>
                            <div className={cx('sectionHeader')}>
                                <PhotoCameraIcon style={{ color: '#ff3c3c' }} />
                                <h3>Ảnh nhóm</h3>
                            </div>

                            <div className={cx('formField')}>
                                <div className={cx('groupPictureContainer')}>
                                    <motion.div
                                        className={cx('picturePreview')}
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        whileHover={{ scale: 1.05 }}
                                        onClick={handleImageClick}
                                    >
                                        <img src={previewPicture} alt="Group Preview" className={cx('previewImage')} />
                                        <div className={cx('imageOverlay')}>
                                            <AddPhotoAlternateIcon />
                                            <span>Cập nhật ảnh</span>
                                        </div>
                                    </motion.div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept=".jpg,.jpeg,.png"
                                        style={{ display: 'none' }}
                                    />
                                    <div className={cx('imageHint')}>
                                        <small>Chỉ chấp nhận file JPG hoặc PNG</small>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Group Information Section */}
                        <motion.section className={cx('section')} variants={itemVariants}>
                            <div className={cx('sectionHeader')}>
                                <BookIcon style={{ color: '#ff3c3c' }} />
                                <h3>Thông tin nhóm</h3>
                            </div>

                            <div className={cx('formField')}>
                                <label className={cx('fieldLabel')}>
                                    Tên Nhóm<span className={cx('required')}>*</span>
                                </label>
                                <motion.input
                                    type="text"
                                    placeholder="Nhập tên nhóm"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    required
                                    className={cx('input')}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    whileFocus={{ scale: 1.01, boxShadow: '0 0 0 2px rgba(255, 60, 60, 0.3)' }}
                                />
                            </div>

                            <div className={cx('formField')}>
                                <label className={cx('fieldLabel')}>
                                    Group Theme/Subject<span className={cx('required')}>*</span>
                                </label>
                                <div className={cx('searchContainer')}>
                                    <SearchIcon className={cx('searchIcon')} />
                                    <motion.input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Tìm kiếm môn học, ngành học..."
                                        className={cx('input')}
                                        value={subjectSelected}
                                        onChange={(e) => handleSearchSubject(e.target.value)}
                                        whileFocus={{ scale: 1.01, boxShadow: '0 0 0 2px rgba(255, 60, 60, 0.3)' }}
                                    />

                                    {/* Subject search results dropdown - Moved inside searchContainer */}
                                    {subjectSelected.trim() && searchSubject?.length > 0 && (
                                        <motion.div
                                            className={cx('searchResults')}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ul>
                                                {searchSubject.map((result, index) => (
                                                    <motion.li
                                                        key={index}
                                                        whileHover={{ backgroundColor: 'rgba(255, 60, 60, 0.1)' }}
                                                        onClick={() => {
                                                            setSubjectId(String(result.subjectId));
                                                            setSubjectSelected(result.subjectName);
                                                            clearSubjects();
                                                        }}
                                                    >
                                                        {result.subjectName}
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}
                                </div>

                                <div className={cx('categoryChips')}>
                                    {categories.map((category) => (
                                        <motion.button
                                            key={category.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedCategory(category.id);
                                                setSubjectSelected(category.label);
                                                debounceSearchSubject(category.label);
                                                // Focus the input after setting the selection
                                                if (searchInputRef.current) {
                                                    searchInputRef.current.focus();
                                                }
                                            }}
                                            className={cx('categoryChip', {
                                                selected: selectedCategory === category.id,
                                            })}
                                            whileHover="hover"
                                            whileTap="tap"
                                            variants={chipVariants}
                                        >
                                            {category.label}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </motion.section>

                        {/* Privacy Settings Section */}
                        <motion.section className={cx('section')} variants={itemVariants}>
                            <div className={cx('sectionHeader')}>
                                <LockIcon style={{ color: '#ff3c3c' }} />
                                <h3>Thiết lập quyền riêng tư</h3>
                            </div>

                            <label className={cx('switchControl')}>
                                <motion.div
                                    className={cx('toggleContainer')}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={!isPrivate}
                                        onChange={() => setIsPrivate(!isPrivate)}
                                        className={cx('toggleInput')}
                                    />
                                    <motion.span
                                        className={cx('toggleSlider')}
                                        animate={{
                                            backgroundColor: !isPrivate ? '#ff3c3c' : '#ccc',
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </motion.div>
                                <div className={cx('switchLabel')}>
                                    <span>Công khai nhóm</span>
                                    <small>Bất kì ai cũng có thể tham gia</small>
                                </div>
                            </label>
                        </motion.section>

                        {/* Group Description Section */}
                        <motion.section className={cx('section')} variants={itemVariants}>
                            <div className={cx('sectionHeader')}>
                                <InfoIcon style={{ color: '#ff3c3c' }} />
                                <h3>Thông tin nhóm</h3>
                            </div>

                            <div className={cx('formField')}>
                                <label className={cx('fieldLabel')}>Mô tả</label>
                                <motion.textarea
                                    rows={4}
                                    placeholder="Mô tả về nhóm học tập của bạn về ngành học, mục tiêu,..."
                                    value={description}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 500) {
                                            setDescription(value);
                                        }
                                    }}
                                    className={cx('textarea')}
                                    whileFocus={{ scale: 1.01, boxShadow: '0 0 0 2px rgba(255, 60, 60, 0.3)' }}
                                    maxLength={500}
                                />
                                <small className={cx('charCount', { 'limit-reached': description.length === 500 })}>
                                    {description.length}/500 kí tự
                                </small>
                            </div>
                        </motion.section>

                        {/* Members Section */}
                        <motion.section className={cx('section')} variants={itemVariants}>
                            <div className={cx('sectionHeader')}>
                                <PeopleIcon style={{ color: '#ff3c3c' }} />
                                <h3>Thành viên</h3>
                            </div>

                            <div className={cx('formField')}>
                                <label className={cx('fieldLabel')}>Giới hạn thành viên</label>
                                <div className={cx('memberLimitContainer')}>
                                    <motion.input
                                        type="number"
                                        value={memberLimited}
                                        onChange={(e) => setMemberLimited(Number(e.target.value))}
                                        min={1}
                                        max={100}
                                        className={cx('memberLimitInput')}
                                        whileFocus={{ scale: 1.05 }}
                                    />
                                    <span className={cx('memberLimitLabel')}>thành viên</span>
                                </div>
                            </div>
                        </motion.section>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            className={cx('submitButton')}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            disabled={loading}
                        >
                            {loading ? 'Đang cập nhật...' : 'Cập nhật nhóm học tập'}
                        </motion.button>
                    </motion.form>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};

export default GroupEditForm;

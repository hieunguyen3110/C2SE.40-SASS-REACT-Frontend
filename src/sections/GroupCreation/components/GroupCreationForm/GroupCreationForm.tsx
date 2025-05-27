import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import {
    createGroupAction,
    searchSubjectsAction,
    updateUserGroups,
} from '../../../../redux/GroupStudySlice/GroupStudySlice';
import { motion } from 'framer-motion';
import { debounce } from '@mui/material';

// MUI Icons only
import SearchIcon from '@mui/icons-material/Search';
import BookIcon from '@mui/icons-material/Book';
import LockIcon from '@mui/icons-material/Lock';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import { toast } from 'react-toastify';
import styles from './GroupCreationForm.module.scss';

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

const GroupCreationForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [memberLimited, setMemberLimited] = useState(10);
    const [isPrivate, setIsPrivate] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');

    // Create a ref for the search input
    const searchInputRef = useRef<HTMLInputElement>(null);

    const accountId = useAppSelector((state) => state.authentication.accountId);
    // Subject search state
    const [subjectSelected, setSubjectSelected] = useState('');
    const [subjectId, setSubjectId] = useState('');

    // Get search results from Redux store
    const searchSubject = useAppSelector((state) => state.groupStudy.subjects) || [];

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!subjectId) {
                toast.error('Vui lòng chọn đúng môn học');
                return;
            }
            const response: any = await dispatch(
                createGroupAction({
                    groupName: groupName,
                    description,
                    isPrivate: isPrivate,
                    memberIds: [],
                    subjectId: subjectId ? parseInt(subjectId) : undefined,
                    memberLimited: memberLimited,
                }),
            ).unwrap();
            if (response && response.id) {
                const newGroup: any = {
                    groupId: response.id,
                    groupName: groupName,
                    description: description,
                    private: isPrivate,
                    subjectName: subjectSelected,
                    memberCount: 1,
                    picture: null,
                    memberIds: [],
                    memberLimited: memberLimited,
                    userId: accountId,
                    role: 'OWNER',
                };
                dispatch(updateUserGroups(newGroup));
                navigate(`/document/group-study/${response.id}`);
            }
        } catch (error) {
            console.error('Lỗi khi tạo nhóm:', error);
        }
    };

    return (
        <motion.div
            className={cx('container')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className={cx('formPaper')}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <motion.h2
                    className={cx('formTitle')}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    Tạo nhóm học tập
                </motion.h2>

                <motion.form
                    onSubmit={handleSubmit}
                    className={cx('form')}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
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
                                    required
                                    type="text"
                                    placeholder="Tìm kiếm môn học, ngành học..."
                                    className={cx('input')}
                                    value={subjectSelected}
                                    onChange={(e) => handleSearchSubject(e.target.value)}
                                    whileFocus={{ scale: 1.01, boxShadow: '0 0 0 2px rgba(255, 60, 60, 0.3)' }}
                                />
                            </div>

                            {/* Subject search results dropdown */}
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
                                    if (e.target.value.length <= 500) {
                                        setDescription(e.target.value);
                                    }
                                }}
                                className={cx('textarea')}
                                whileFocus={{ scale: 1.01, boxShadow: '0 0 0 2px rgba(255, 60, 60, 0.3)' }}
                            />
                            <small className={cx('charCount')}>{description.length}/500 kí tự</small>
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
                    >
                        Tạo nhóm học tập
                    </motion.button>
                </motion.form>
            </motion.div>
        </motion.div>
    );
};

export default GroupCreationForm;

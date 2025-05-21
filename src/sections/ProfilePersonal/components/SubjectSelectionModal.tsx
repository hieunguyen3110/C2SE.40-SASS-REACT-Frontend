import React, { useState, useEffect, useCallback } from 'react';
import classnames from 'classnames/bind';
import styles from './SubjectSelectionModal.module.scss';
import { motion } from 'framer-motion';
import { Close, Search } from '@mui/icons-material';
import { debounce } from 'lodash';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { searchSubjectsAction } from '../../../redux/GroupStudySlice/GroupStudySlice';
import { SubjectDto } from '../../../types/groupStudy.types';

interface SubjectSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selectedSubjects: SubjectDto[]) => void;
}

const cx = classnames.bind(styles);

const SubjectSelectionModal: React.FC<SubjectSelectionModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState<SubjectDto[]>([]);
    const [confirmSelection, setConfirmSelection] = useState(false);
    
    const subjects = useAppSelector((state) => state.groupStudy.subjects);
    const loading = useAppSelector((state) => state.groupStudy.loading);

    // Debounced search function
    const debounceSearchSubject = useCallback(
        debounce((value: string) => {
            dispatch(searchSubjectsAction(value));
        }, 500),
        [dispatch]
    );

    // Search subjects when typing in the search input
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value.trim()) {
            debounceSearchSubject(value);
        }
    };

    // Handle subject selection
    const handleSubjectSelect = (subject: SubjectDto) => {
        if (selectedSubjects.some(s => s.subjectId === subject.subjectId)) {
            setSelectedSubjects(selectedSubjects.filter(s => s.subjectId !== subject.subjectId));
        } else {
            if (selectedSubjects.length < 10) {
                setSelectedSubjects([...selectedSubjects, subject]);
            }
        }
    };

    // Handle confirmation
    const handleConfirm = () => {
        onConfirm(selectedSubjects);
        onClose();
    };

    // Fetch initial subjects on mount
    useEffect(() => {
        if (isOpen) {
            dispatch(searchSubjectsAction(''));
        }
    }, [dispatch, isOpen]);

    if (!isOpen) return null;

    return (
        <motion.div 
            className={cx('modal-overlay')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div 
                className={cx('modal-content')}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
                <div className={cx('modal-header')}>
                    <h3>Chọn môn học của bạn</h3>
                    <button className={cx('close-button')} onClick={onClose}>
                        <Close />
                    </button>
                </div>

                <div className={cx('search-container')}>
                    <Search className={cx('search-icon')} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm môn học..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={cx('search-input')}
                    />
                </div>

                <div className={cx('modal-body')}>
                    <div className={cx('selected-count')}>
                        Đã chọn: {selectedSubjects.length}/10
                    </div>
                    
                    <div className={cx('subject-list')}>
                        {loading ? (
                            <div className={cx('loading')}>Đang tải...</div>
                        ) : subjects.length > 0 ? (
                            subjects.map((subject) => (
                                <div 
                                    key={subject.subjectId}
                                    className={cx('subject-item')}
                                >
                                    <input
                                        type="checkbox"
                                        id={`subject-${subject.subjectId}`}
                                        checked={selectedSubjects.some(s => s.subjectId === subject.subjectId)}
                                        onChange={() => handleSubjectSelect(subject)}
                                    />
                                    <label htmlFor={`subject-${subject.subjectId}`}>
                                        {subject.subjectName}
                                        <span className={cx('subject-code')}>
                                            ITEC{(subject.subjectId % 1000) || '101'}
                                        </span>
                                    </label>
                                </div>
                            ))
                        ) : (
                            <div className={cx('no-results')}>
                                {searchTerm ? 'Không tìm thấy môn học' : 'Vui lòng tìm kiếm môn học'}
                            </div>
                        )}
                    </div>
                    
                    <div className={cx('confirmation')}>
                        <input
                            type="checkbox"
                            id="confirmation-checkbox"
                            checked={confirmSelection}
                            onChange={() => setConfirmSelection(!confirmSelection)}
                        />
                        <label htmlFor="confirmation-checkbox">
                            Tôi xác nhận đã chọn đúng các môn học của mình, và sẽ không thay đổi trong vòng 2 tháng tới.
                        </label>
                    </div>
                </div>

                <div className={cx('modal-footer')}>
                    <button className={cx('cancel-button')} onClick={onClose}>
                        Hủy
                    </button>
                    <button 
                        className={cx('confirm-button')} 
                        onClick={handleConfirm}
                        disabled={selectedSubjects.length === 0 || !confirmSelection}
                    >
                        Xác nhận
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SubjectSelectionModal; 
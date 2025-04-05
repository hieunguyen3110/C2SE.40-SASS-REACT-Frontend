import classNames from 'classnames/bind';
import styles from './KnowledgeTest.module.scss';
import { useState } from 'react';
import { Autocomplete, TextField, Button } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import ScienceIcon from '@mui/icons-material/Science';
import ComputerIcon from '@mui/icons-material/Computer';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LanguageIcon from '@mui/icons-material/Language';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

// Sample subjects data
const subjects = [
    { id: 1, name: 'Mathematics', icon: <BarChartIcon sx={{ color: '#4caf50' }} /> },
    { id: 2, name: 'Physics', icon: <ScienceIcon sx={{ color: '#2196f3' }} /> },
    { id: 3, name: 'Chemistry', icon: <ScienceIcon sx={{ color: '#f44336' }} /> },
    { id: 4, name: 'Biology', icon: <ScienceIcon sx={{ color: '#ff9800' }} /> },
    { id: 5, name: 'Computer Science', icon: <ComputerIcon sx={{ color: '#9c27b0' }} /> },
    { id: 6, name: 'Literature', icon: <MenuBookIcon sx={{ color: '#795548' }} /> },
    { id: 7, name: 'History', icon: <MenuBookIcon sx={{ color: '#607d8b' }} /> },
    { id: 8, name: 'Geography', icon: <LanguageIcon sx={{ color: '#3f51b5' }} /> },
];

export default function KnowledgeTest() {
    const navigate = useNavigate();
    const [selectedSubject, setSelectedSubject] = useState<{ id: number; name: string; icon: any } | null>(subjects[0]);
    const [numberOfQuestions, setNumberOfQuestions] = useState<string>('5');

    const handleSubjectChange = (
        _event: React.SyntheticEvent,
        newValue: { id: number; name: string; icon: any } | null,
    ) => {
        setSelectedSubject(newValue);
    };

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumberOfQuestions(event.target.value);
    };

    const handleStartTest = () => {
        // Validate inputs
        if (!selectedSubject) {
            alert('Please select a subject');
            return;
        }
        
        if (parseInt(numberOfQuestions) < 1) {
            alert('Please enter a valid number of questions');
            return;
        }
        
        // Generate a test ID (in a real app, this would come from the backend)
        const testId = `${selectedSubject.id}-${Date.now()}`;
        
        // Store test configuration in localStorage (in a real app, this would be stored in the backend)
        localStorage.setItem('testConfig', JSON.stringify({
            subject: selectedSubject.name,
            numberOfQuestions: parseInt(numberOfQuestions),
            testId
        }));

        // Navigate to the test page
        navigate(`/document/ai-quiz/test-process/${testId}`);
    };

    return (
        <div className={cx('knowledge-test')}>
            <div className={cx('knowledge-test-container')}>
                <h1 className={cx('title')}>Online Knowledge Test</h1>

                <div className={cx('form-group')}>
                    <label className={cx('label')}>Select Subject</label>
                    <Autocomplete
                        id="select-subject"
                        options={subjects}
                        getOptionLabel={(option) => option.name}
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Select a subject"
                                className={cx('subject-select')}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: selectedSubject && (
                                        <div className={cx('selected-icon')}>
                                            {selectedSubject.icon}
                                        </div>
                                    ),
                                }}
                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props} className={cx('subject-option-item')}>
                                <span className={cx('subject-option')}>
                                    <span className={cx('subject-icon')}>{option.icon}</span>
                                    {option.name}
                                </span>
                            </li>
                        )}
                    />
                </div>

                <div className={cx('form-group')}>
                    <label className={cx('label')}>Number of Questions</label>
                    <TextField
                        type="number"
                        className={cx('number-input')}
                        value={numberOfQuestions}
                        onChange={handleNumberChange}
                        inputProps={{ min: 1, max: 50 }}
                        fullWidth
                    />
                </div>

                <Button
                    variant="contained"
                    className={cx('start-button')}
                    onClick={handleStartTest}
                    fullWidth
                >
                    Start Test
                </Button>
            </div>
        </div>
    );
}

import classNames from 'classnames/bind';
import styles from './GroupCard.module.scss';
import { motion } from 'framer-motion';
import { PeopleOutline, Check as CheckIcon } from '@mui/icons-material';
import { useState } from 'react';
const cx = classNames.bind(styles);

interface GroupCardProps {
    image: string;
    category: string;
    memberCount: number;
    memberLimited?: number;
    title: string;
    description: string;
    onJoin: () => void;
    isUserMember?: boolean;
    isPrivate: boolean;
}

export default function GroupCard({
    image,
    category,
    memberCount,
    memberLimited,
    title,
    description,
    onJoin,
    isUserMember = false,
    isPrivate,
}: GroupCardProps) {
    const [isSent, setIsSent] = useState(false);
    const isGroupFull = memberLimited !== undefined && memberCount >= memberLimited;

    // Calculate the fill percentage for the progress bar
    const fillPercentage = memberLimited ? Math.min(Math.round((memberCount / memberLimited) * 100), 100) : 0;

    // Determine color based on how full the group is
    const getProgressColor = () => {
        if (fillPercentage < 60) return '#4CAF50'; // Green
        if (fillPercentage < 85) return '#FFC107'; // Yellow/Orange
        return '#F44336'; // Red
    };

    return (
        <div className={cx('groupCard')}>
            <div className={cx('cardContent')}>
                <img src={image} alt={title} className={cx('cardImage')} />
                <div className={cx('content')}>
                    <div className={cx('header')}>
                        <span className={cx('categoryChip')}>{category}</span>
                        {isPrivate && <span className={cx('categoryChip')}>Riêng tư</span>}

                        {memberLimited ? (
                            <div className={cx('memberCapacity')}>
                                <div className={cx('memberCapacityInfo')}>
                                    <PeopleOutline className={cx('icon')} />
                                    <span className={cx('memberCountText')}>
                                        {memberCount}/{memberLimited}
                                    </span>
                                </div>
                                <div className={cx('progressBarContainer')}>
                                    <div
                                        className={cx('progressBar')}
                                        style={{
                                            width: `${fillPercentage}%`,
                                            backgroundColor: getProgressColor(),
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className={cx('memberCount')}>
                                <PeopleOutline className={cx('icon')} />
                                <span>{memberCount} members</span>
                            </div>
                        )}
                    </div>

                    <h3 className={cx('title')}>{title}</h3>

                    <p className={cx('description')}>{description}</p>

                    <motion.button
                        className={cx('joinButton', {
                            memberButton: isUserMember,
                            fullButton: isGroupFull && !isUserMember,
                        })}
                        onClick={() => {
                            setIsSent(true);
                            onJoin();
                        }}
                        whileHover={{ scale: isUserMember || isGroupFull ? 1 : 1.05 }}
                        whileTap={{ scale: isUserMember || isGroupFull ? 1 : 0.95 }}
                        disabled={isUserMember || isGroupFull || isSent}
                    >
                        {isUserMember ? (
                            <>
                                <CheckIcon className={cx('checkIcon')} />
                                Đã tham gia
                            </>
                        ) : isGroupFull ? (
                            'Đã đủ người'
                        ) : isPrivate ? (
                            isSent ? (
                                'Đã gửi yêu cầu'
                            ) : (
                                'Gửi yêu cầu'
                            )
                        ) : (
                            'Tham gia'
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

import { Button, Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './GroupCard.module.scss';
const cx = classNames.bind(styles);

interface GroupCardProps {
    image: string;
    category: string;
    memberCount: number;
    title: string;
    description: string;
    onJoin: () => void;
}

export default function GroupCard({ image, category, memberCount, title, description, onJoin }: GroupCardProps) {
    return (
        <Card className={cx('groupCard')}>
            <div className={cx('cardContent')}>
                <CardMedia component="img" height="140" image={image} alt={title} className={cx('cardImage')} />
                <CardContent className={cx('content')}>
                    <div className={cx('header')}>
                        <Chip
                            label={category}
                            size="small"
                            sx={{
                                backgroundColor: '#FFE0E1',
                                color: '#e62e2d',
                                border: '1px solid #e62e2d',
                            }}
                            className={cx('categoryChip')}
                        />
                        <Typography variant="caption">• {memberCount} members</Typography>
                    </div>

                    <Typography variant="h6" className={cx('title')}>
                        {title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" className={cx('description')}>
                        {description}
                    </Typography>

                    <Button variant="contained" color="error" className={cx('joinButton')} onClick={onJoin}>
                        Join Group
                    </Button>
                </CardContent>
            </div>
        </Card>
    );
}

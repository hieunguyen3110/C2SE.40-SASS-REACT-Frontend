import classNames from 'classnames/bind';
import styles from './Content.module.scss';
const cx = classNames.bind(styles);
import Background from '../../../assets/images/library.background.jpeg';
import { Statistics } from './Statistics';
import { Docs } from './Docs';

import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { useEffect, useState } from 'react';
import { getPopularDocuments } from '../../../redux/DocumentSlice/documentSlice';
import { getStatsForUser } from '../../../redux/StatsSlice/statsSlice';
   
export default function Content() {
    const dispatch = useAppDispatch();
    const documents = useAppSelector((state) => state.document.Documents);
    const stats = useAppSelector((state) => state.stats.stats);
    const [statsData, setStatsData] = useState<any>({});

    useEffect(() => {
        dispatch(getPopularDocuments());
        dispatch(getStatsForUser());
    }, [dispatch]);

    useEffect(() => {
        if (stats) {
            setStatsData(stats);
        }
    }, [stats]);

    return (
        <div className={cx('content')}>
            <img src={Background} alt="bg" />
            <div className={cx('central')}>
                <div className={cx('category')}>
                    <Docs title={'Tài liệu phổ biến'} docs={documents} />
                </div>
                <Statistics data={statsData} />
            </div>
        </div>
    );
}

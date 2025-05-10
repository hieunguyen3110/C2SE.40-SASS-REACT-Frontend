import classNames from 'classnames/bind';
import styles from './Chart.module.scss';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useAppSelector } from '../../../../../redux/store';
import { motion } from 'framer-motion';
import { useState } from 'react';

const cx = classNames.bind(styles);
const barColors: string[] = ['#ff3c3c', '#f0f0f0'];
const pieColors: string[] = ['#ff3c3c', '#2196f3', '#4caf50', '#ff9800', '#9c27b0'];

export default function Chart() {
    const { data }: any = useAppSelector((state) => state.adminDashboard);
    const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
    
    // Sample data for bar chart
    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const barData = [15, 20, 18, 22, 25, 30, 28, 32, 35, 38, 42, 45];
    
    // Data for pie chart
    const pieData = [
        { id: 0, value: data?.totalDocuments || 59, label: 'Tài liệu' },
        { id: 1, value: data?.totalSubjects || 862, label: 'Môn học' },
        { id: 2, value: data?.totalStudents || 2, label: 'Sinh viên' },
        { id: 3, value: data?.totalFolders || 17, label: 'Thư mục' },
        { id: 4, value: data?.totalLecturers || 0, label: 'Giảng viên' }
    ];

    return (
        <motion.div 
            className={cx('admin-chart-container')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={cx('chart-header')}>
                <h3>Thống kê hệ thống</h3>
                
                <div className={cx('chart-controls')}>
                    <button 
                        className={cx('chart-type-btn', { active: chartType === 'bar' })}
                        onClick={() => setChartType('bar')}
                    >
                        Biểu đồ cột
                    </button>
                    <button 
                        className={cx('chart-type-btn', { active: chartType === 'pie' })}
                        onClick={() => setChartType('pie')}
                    >
                        Biểu đồ tròn
                    </button>
                </div>
            </div>
            
            <div className={cx('chart-content')}>
                {chartType === 'bar' ? (
                    <BarChart
                        xAxis={[{
                            scaleType: 'band',
                            data: months,
                        }]}
                        series={[
                            { data: barData, label: 'Tài liệu' },
                        ]}
                        height={300}
                        colors={barColors}
                    />
                ) : (
                    <div className={cx('pie-container')}>
                        <PieChart
                            series={[
                                {
                                    data: pieData,
                                    innerRadius: 30,
                                    outerRadius: 90,
                                    paddingAngle: 1,
                                    cornerRadius: 4,
                                }
                            ]}
                            height={350}
                            width={500}
                            colors={pieColors}
                            margin={{ top: 10, bottom: 80, left: 30, right: 30 }}
                            legend={{
                                direction: 'row',
                                position: { vertical: 'bottom', horizontal: 'middle' },
                                padding: 30,
                            }}
                        />
                    </div>
                )}
            </div>
        </motion.div>
    );
}

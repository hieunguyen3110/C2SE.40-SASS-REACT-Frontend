import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Paper, 
  Divider, 
  Button, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  AlertTitle,
  Container,
  Tab,
  Tabs,
  Link
} from '@mui/material';
import { 
  Assignment, 
  AssignmentTurnedIn, 
  Timeline, 
  Warning, 
  Book, 
  School, 
  TrendingUp, 
  AutoGraph,
  ArrowBack,
  Check
} from '@mui/icons-material';

// Định nghĩa interface cho dữ liệu
interface AssignmentData {
  completed: number;
  averageScore: string;
  needAttention: boolean;
}

interface ResourceItem {
  title: string;
  type: string;
}

const LearningAnalyticsDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Dữ liệu mẫu
  const assignmentData: AssignmentData = {
    completed: 0,
    averageScore: '0%',
    needAttention: true
  };

  const examData: AssignmentData = {
    completed: 0,
    averageScore: '0%',
    needAttention: true
  };

  const recommendedResources: ResourceItem[] = [
    { title: 'Calculus Made Easy', type: 'document' },
    { title: '3D Geometry Guide', type: 'document' },
    { title: 'Linear Equations Handbook', type: 'document' },
    { title: 'Advanced Mathematics', type: 'document' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Header với nút quay lại */}
      <Box display="flex" alignItems="center" mb={4}>
        <Button 
          startIcon={<ArrowBack />}
          variant="text" 
          color="primary"
          component={Link}
          href="#"
          sx={{ mr: 2 }}
        >
          Quay lại trang cá nhân
        </Button>
        
      </Box>
      <Box textAlign="center"  margin="1rem">
      <Typography variant="h4" component="h1" fontWeight="bold">
          PHÂN TÍCH HỌC TẬP CÁ NHÂN
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Card Bài tập đã làm */}
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              borderLeft: '4px solid #1976d2', 
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' 
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Assignment color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Bài tập đã làm
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Số lượng: {assignmentData.completed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Điểm Trung bình tổng: {assignmentData.averageScore}
              </Typography>
              <Box mt={2} display="flex" justifyContent="center">
                <Box position="relative" display="inline-flex">
                  <CircularProgress 
                    variant="determinate" 
                    value={parseFloat(assignmentData.averageScore) || 0} 
                    size={80}
                    thickness={5}
                    sx={{ color: '#1976d2' }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      component="div"
                      color="text.secondary"
                      style={{fontSize: "2.75rem"}}
                    >{`${parseFloat(assignmentData.averageScore) || 0}%`}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card Bài thi đã làm */}
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              borderLeft: '4px solid #4caf50', 
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' 
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AssignmentTurnedIn color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Bài thi đã làm
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Số lượng: {examData.completed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Điểm Trung bình tổng: {examData.averageScore}
              </Typography>
              <Box mt={2} display="flex" justifyContent="center">
                <Box position="relative" display="inline-flex">
                  <CircularProgress 
                    variant="determinate" 
                    value={parseFloat(examData.averageScore) || 0}
                    size={80}
                    thickness={5}
                    sx={{ color: '#4caf50' }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      component="div"
                      color="text.secondary"
                      style={{fontSize: "2.75rem"}}
                    >{`${parseFloat(examData.averageScore) || 0}%`}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card Trạng thái học tập */}
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              borderLeft: '4px solid #f44336', 
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' 
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Warning color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Trạng thái học tập
                </Typography>
              </Box>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <AlertTitle>Cần chú ý</AlertTitle>
                Vui lòng hoàn thành trên 3 bài kiểm tra bài tập hoặc bài thi để có thể phân tích trạng thái học tập của bạn!
              </Alert>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                startIcon={<TrendingUp />}
              >
                Bắt đầu học tập
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Khu vực nội dung chính */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' }}>
            <Typography variant="h5" component="h2" align="center" gutterBottom>
              PHÂN TÍCH HỌC TẬP VÀ PHƯƠNG PHÁP HỌC DÀNH CHO BẠN
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Tabs điều hướng */}
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              indicatorColor="primary"
              textColor="primary"
              centered
              sx={{ mb: 3 }}
            >
              <Tab icon={<Timeline />} label="Phân tích học tập" />
              <Tab icon={<AutoGraph />} label="Đề xuất phương pháp" />
              <Tab icon={<Book />} label="Tài liệu gợi ý" />
            </Tabs>

            {/* Nội dung tab 1 - Phân tích học tập */}
            {tabValue === 0 && (
              <Box>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <AlertTitle>Thông tin phân tích</AlertTitle>
                  Hiện tại bạn cần hoàn thành ít nhất 3 bài tập hoặc bài thi để có thể xem phân tích chi tiết về quá trình học tập của mình.
                </Alert>
                <Box display="flex" justifyContent="center">
                  <Button variant="contained" color="primary">
                    Xem danh sách bài tập
                  </Button>
                </Box>
              </Box>
            )}

            {/* Nội dung tab 2 - Đề xuất phương pháp */}
            {tabValue === 1 && (
              <Box>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <AlertTitle>Phương pháp học tập</AlertTitle>
                  Dựa trên dữ liệu học tập, hệ thống sẽ đề xuất các phương pháp học tập phù hợp. Vui lòng hoàn thành thêm bài tập để nhận đề xuất chi tiết.
                </Alert>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Mẹo học tập hiệu quả:
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon><Check color="success" /></ListItemIcon>
                        <ListItemText primary="Lập kế hoạch học tập cụ thể với thời gian biểu chi tiết" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Check color="success" /></ListItemIcon>
                        <ListItemText primary="Sử dụng phương pháp Pomodoro (25 phút học, 5 phút nghỉ)" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Check color="success" /></ListItemIcon>
                        <ListItemText primary="Luyện tập giải bài tập thường xuyên để củng cố kiến thức" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Nội dung tab 3 - Tài liệu gợi ý */}
            {tabValue === 2 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Tài liệu tham khảo được đề xuất dựa trên quá trình học tập của bạn:
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {recommendedResources.map((resource, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Box 
                            sx={{ 
                              height: 140, 
                              bgcolor: 'grey.100', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              mb: 2
                            }}
                          >
                            <Book sx={{ fontSize: 60, color: 'primary.main' }} />
                          </Box>
                          <Typography variant="subtitle1" component="div" noWrap>
                            {resource.title}
                          </Typography>
                          <Box mt={2}>
                            <Button variant="outlined" color="primary" size="small" fullWidth>
                              Xem Tài Liệu
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Thông báo cảnh báo */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderLeft: '4px solid #ff9800', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' }}>
            <Box display="flex" alignItems="flex-start">
              <Warning color="warning" sx={{ mr: 2, mt: 0.5 }} />
              <Box>
                <Typography variant="h6" component="div" gutterBottom>
                  CHÚ Ý
                </Typography>
                <Typography variant="body2" paragraph>
                  Phân tích AI dưới đây chỉ mang tính tương đối thông qua quá trình học tập, điểm số và thời gian học tập của bạn ở trên web. AI của chúng tôi không đánh giá hoàn toàn trình độ và khả năng của bạn, mọi thông tin được đưa ra chỉ mang tính chất tham khảo!
                </Typography>
                <Typography variant="body2">
                  Mỗi tuần AI chúng tôi sẽ lấy dữ liệu điểm số và số bài đã làm của bạn để phân tích quá trình học tập và đưa ra giải pháp học tập phù hợp dành cho bạn. Vui lòng làm bài và học bài đầy đủ, ít nhất làm 3 bài thi 1 tuần để AI có thể phân tích được chi tiết và cụ thể hơn.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LearningAnalyticsDashboard;
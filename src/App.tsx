import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './app/page';
import LoginPage from './app/login/page';
import RegisterPage from './app/register/page';
import LearnPage from './app/learn/page';
import AdminLoginPage from './app/admin/page';
import AdminDashboard from './app/admin/dashboard/page';
import VocabularyPage from './app/vocabulary/page';
import LeaderboardPage from './app/leaderboard/page';
import StatsPage from './app/stats/page';
import ProfilePage from './app/profile/page';
import LessonsPage from './app/lessons/page';
import LessonPage from './app/lessons/[id]/page';
import StoriesPage from './app/stories/page';
import StoryDetailPage from './app/stories/[id]/page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/lessons/:id" element={<LessonPage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/stories/:id" element={<StoryDetailPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ProtectedRoute, AdminRoute } from '@/components/RouteGuards';
import LandingPage from '@/pages/LandingPage';
import SignupPage from '@/pages/SignupPage';
import LoginPage from '@/pages/LoginPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import DashboardLayout from '@/pages/dashboard/DashboardLayout';
import DashboardOverview from '@/pages/dashboard/DashboardOverview';
import AboutSection from '@/pages/dashboard/AboutSection';
import SkillsSection from '@/pages/dashboard/SkillsSection';
import ProjectsSection from '@/pages/dashboard/ProjectsSection';
import BlogSection from '@/pages/dashboard/BlogSection';
import ContactSection from '@/pages/dashboard/ContactSection';
import SocialSection from '@/pages/dashboard/SocialSection';
import ResumeSection from '@/pages/dashboard/ResumeSection';
import SeoSection from '@/pages/dashboard/SeoSection';
import PublicPortfolioPage from '@/pages/PublicPortfolioPage';
import AdminPage from '@/pages/AdminPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/p" element={<ProtectedRoute><PublicPortfolioPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<DashboardOverview />} />
                <Route path="about" element={<AboutSection />} />
                <Route path="skills" element={<SkillsSection />} />
                <Route path="projects" element={<ProjectsSection />} />
                <Route path="blog" element={<BlogSection />} />
                <Route path="contact" element={<ContactSection />} />
                <Route path="social" element={<SocialSection />} />
                <Route path="resume" element={<ResumeSection />} />
                <Route path="seo" element={<SeoSection />} />
              </Route>
              <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

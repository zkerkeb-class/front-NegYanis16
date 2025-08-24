import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './MainLayout';
import HomePage from '../pages/HomePage';
import RegisterPage from '../features/Auth/components/RegisterPage';
import LoginPage from '../features/Auth/components/LoginPage';
import QuizPage from '../features/Quiz/components/QuizPage';
import SelectQuizPage from '../pages/SelectQuizPage';
import PrivateRoute from '../router/PrivateRoute';
import DashboardPage from '../features/Quiz/components/DashboardPage';
import ProfilePage from '../features/Auth/components/ProfilePage';
import JetonsPage from '../pages/JetonsPage';
import SuccessPage from '../pages/SuccessPage';
import CancelPage from '../pages/CancelPage';
import ResultsPage from '../pages/ResultsPage';
import CompleteProfilePage from '../pages/CompleteProfilePage';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/jetons" element={<JetonsPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} />
        <Route
          path="/select-quiz"
          element={
            <PrivateRoute>
              <SelectQuizPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <PrivateRoute>
              <QuizPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/results"
          element={
            <PrivateRoute>
              <ResultsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </MainLayout>
  );
}

export default App;

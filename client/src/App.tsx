import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

// Layouts (usually better to keep these synchronous, but for maximum splitting we can lazy load them or just pages)
import PublicLayout from './components/layout/PublicLayout';
import CandidateLayout from './components/layout/CandidateLayout';
import RecruiterLayout from './components/layout/RecruiterLayout';
import AdminLayout from './components/layout/AdminLayout';

// Lazy loaded pages
const Home = lazy(() => import('./pages/public/Home'));
const OpportunityListing = lazy(() => import('./pages/public/OpportunityListing'));
const OpportunityDetail = lazy(() => import('./pages/public/OpportunityDetail'));
const Login = lazy(() => import('./pages/public/Login'));
const Signup = lazy(() => import('./pages/public/Signup'));

const Dashboard = lazy(() => import('./pages/candidate/Dashboard'));
const Profile = lazy(() => import('./pages/candidate/Profile'));
const Applications = lazy(() => import('./pages/candidate/Applications'));
const ApplicationDetail = lazy(() => import('./pages/candidate/ApplicationDetail'));
const SavedOpportunities = lazy(() => import('./pages/candidate/SavedOpportunities'));
const Resumes = lazy(() => import('./pages/candidate/Resumes'));
const Notifications = lazy(() => import('./pages/candidate/Notifications'));

const RecruiterDashboard = lazy(() => import('./pages/recruiter/Dashboard'));
const CreateOrganization = lazy(() => import('./pages/recruiter/CreateOrganization'));
const Opportunities = lazy(() => import('./pages/recruiter/Opportunities'));
const CreateOpportunity = lazy(() => import('./pages/recruiter/CreateOpportunity'));
const Pipeline = lazy(() => import('./pages/recruiter/Pipeline'));
const CandidateProfile = lazy(() => import('./pages/recruiter/CandidateProfile'));

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminOrganizations = lazy(() => import('./pages/admin/Organizations'));
const AdminOpportunities = lazy(() => import('./pages/admin/Opportunities'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="flex h-screen items-center justify-center text-primary text-lg">Loading...</div>}>
            <Routes>
              <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="internships" element={<OpportunityListing type="internship" />} />
          <Route path="jobs" element={<OpportunityListing type="job" />} />
          <Route path="hackathons" element={<OpportunityListing type="hackathon" />} />
          <Route path="competitions" element={<OpportunityListing type="competition" />} />
          <Route path="opportunities/:slug" element={<OpportunityDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
        
        {/* Protected Candidate Routes */}
        <Route path="/student" element={<CandidateLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="applications" element={<Applications />} />
          <Route path="applications/:id" element={<ApplicationDetail />} />
          <Route path="saved" element={<SavedOpportunities />} />
          <Route path="resumes" element={<Resumes />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Protected Recruiter Routes */}
        <Route path="/recruiter" element={<RecruiterLayout />}>
          <Route path="onboarding" element={<CreateOrganization />} />
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="opportunities/create" element={<CreateOpportunity />} />
          <Route path="opportunities/:opportunityId/applications" element={<Pipeline />} />
          <Route path="candidates/:candidateId/profile" element={<CandidateProfile />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="organizations" element={<AdminOrganizations />} />
          <Route path="opportunities" element={<AdminOpportunities />} />
        </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

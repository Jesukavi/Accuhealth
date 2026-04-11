import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Masters from './pages/Masters/Masters';
import UserManagement from './pages/UserManagement';
import Notifications from './pages/Notification/Notifications';
import MalariaEntry from './pages/Notification/MalariaEntry';
import MalariaView from './pages/Notification/MalariaView';
import MalariaListing from './pages/Notification/MalariaListing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import VaccinationListing from './pages/Vaccination/VaccinationListing';
import VaccinReport from './pages/Vaccination/VaccinReport';
import VaccinationReport from './pages/Reporting/VaccinationReport';
import MalariaReport from './pages/Reporting/MalariaReport';
import NotificationEntry from './pages/Notification/NotificationEntry';
import VaccinationEntry from './pages/Vaccination/VaccinationEntry';
import Role from './pages/Masters/Roles';
import TBNotification from './pages/TB/TBNotification';
import TBListing from './pages/TB/TBListing';
import TBScreening from './pages/TB/TBScreening';
import TBNotificationListing from './pages/TB/TBNotificationListing';
import TBView from './pages/TB/TBView';
import FeverRashEntry from './pages/Fever&Rash/FeverRashEntry';
import FeverRashListing from './pages/Fever&Rash/FeverRashListing';
import FeverRashNotificationListing from './pages/Fever&Rash/FeverRashNotificationListing';
import FeverRashView from './pages/Fever&Rash/FeverRashView';
import ARIListing from './pages/ARI/ARIListing';
import ARINotification from './pages/ARI/ARINotification';
import ARIView from './pages/ARI/ARIView';
import PolioCaseListing from './pages/Polio/PolioCaseListing';
import PolioInvestigation from './pages/Polio/PolioInvestigation';
import HEVEntry from './pages/HEV/HEVEntry';
import HEVListing from './pages/HEV/HEVListing';
import HepatitisNotification from './pages/HEV/HepatitisNotification';
import HAVListing from './pages/HEV/HAVListing';
import HBVListing from './pages/HEV/HBVListing';
import HBVView from './pages/HEV/HBVView';
import HAVView from './pages/HEV/HAVView';
import HCVView from './pages/HEV/HCVView';
import HEVView from './pages/HEV/HEVView';
import HCVListing from './pages/HEV/HCVListing';
import HemorrhagicNotification from './pages/Hemorrhagic ds/HemorrhagicNotification';
import NewEntry from './pages/Hemorrhagic ds/NewEntry';
import HemorrhagicNewEntry from './pages/Hemorrhagic ds/HemorrhagicNewEntry';
import HemorrhagicView from './pages/Hemorrhagic ds/HemorrhagicView';
import DoseNumber from './pages/Masters/DoseNumber';
import Education from './pages/Masters/Education';
import Governorate from './pages/Masters/Governorate';
import Wilayat from './pages/Masters/Wilayat';
import GovernorateVaccinated from './pages/Masters/GovernorateVaccinated';
import Institution from './pages/Masters/Institution';
import InstitutionPlace from './pages/Masters/InstitutionPlace';
import Nationality from './pages/Masters/Nationality';
import Occupation from './pages/Masters/Occupation';
import Source from './pages/Masters/Source';
import SiteOfInjection from './pages/Masters/SiteOfInjection';
import Treatment from './pages/Masters/Treatment';
import VaccineManufacturer from './pages/Masters/VaccineManufacturer';
import VaccineName from './pages/Masters/VaccineName';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/masters"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Masters />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UserManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/malaria-notification"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Notifications />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/malaria-listing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MalariaListing />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/malaria-entry"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MalariaEntry />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/malaria-entry/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MalariaEntry />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/malaria-view/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MalariaView />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vaccination-report"
              element={
                <ProtectedRoute>
                  <Layout>
                    <VaccinationReport />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/malaria-report"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MalariaReport />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vaccin-report"
              element={
                <ProtectedRoute>
                  <Layout>
                    <VaccinReport />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vaccination-listing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <VaccinationListing />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notification-entry"
              element={<NotificationEntry />}
            />
            <Route
              path="/vaccination-entry"
              element={<VaccinationEntry />}
            />
            <Route
              path="/roles"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Role />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* TB Routes */}
            <Route
              path="/tb-notification"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TBNotificationListing />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tb-notification/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TBNotification />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tb-notification/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TBNotification />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tb-view/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TBView />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tb-listing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TBListing />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tb-screening"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TBScreening />
                  </Layout>
                </ProtectedRoute>
              }
            />
            {/* Fever & Rash Routes */}
            <Route
              path="/fever-rash-entry"
              element={
                <ProtectedRoute>
                  <Layout>
                    <FeverRashNotificationListing />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/fever-rash-entry/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <FeverRashEntry />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/fever-rash-notifications"
              element={
                <ProtectedRoute>
                  <Layout>
                    <FeverRashListing />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/fever-rash-view/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <FeverRashView />
                  </Layout>
                </ProtectedRoute>
              }
            />
            {/* ARI Routes */}
            <Route
              path="/ari-listing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ARIListing />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ari-notification"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ARINotification />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ari-notification/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ARINotification />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ari-notification/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ARINotification />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ari-view/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ARIView />
                  </Layout>
                </ProtectedRoute>
              }
            />
            {/* Polio Routes */}
            <Route
              path="/polio-case-listing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PolioCaseListing />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/polio-investigation"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PolioInvestigation />
                  </Layout>
                </ProtectedRoute>
              }
            />



            {/* Hemorrhagic Routes */}
            <Route
              path="/hemorrhagic-new-entry"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NewEntry />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hemorrhagic-notification-listing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HemorrhagicNotification />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* HEV Routes */}
            <Route
              path="/hev-notification"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HEVListing />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hev-notification/entry"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HEVEntry />
                  </Layout>
                </ProtectedRoute>
              }
            />
            {/* Hepatitis Routes */}
            <Route
              path="/hav-listing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HAVListing />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hav-notification"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HepatitisNotification type="HAV" />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hav-notification/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HepatitisNotification type="HAV" />
                  </Layout>
                </ProtectedRoute>
              }
            />
             <Route
              path="/hav-view/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HAVView />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hbv-listing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HBVListing />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hbv-notification"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HepatitisNotification type="HBV" />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hbv-notification/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HepatitisNotification type="HBV" />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hbv-view/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HBVView />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hcv-listing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HCVListing />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hcv-notification"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HepatitisNotification type="HCV" />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hcv-notification/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HepatitisNotification type="HCV" />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hcv-view/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HCVView />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hev-listing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HEVListing />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hev-notification-form"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HepatitisNotification type="HEV" />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hev-notification/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HepatitisNotification type="HEV" />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hev-view/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HEVView />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Hemorrhagic DS Routes */}
            <Route
              path="/hemorrhagic-new-entry"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HemorrhagicNewEntry />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hemorrhagic-disease"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HemorrhagicNewEntry />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hemorrhagic-diseases"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HemorrhagicNewEntry />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hemorrhagic-edit/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HemorrhagicNewEntry />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hemorrhagic-view/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HemorrhagicView />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hemorrhagic-notification-listing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HemorrhagicNotification />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Dose Number Routes */}
            <Route
              path="/dose-number"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DoseNumber />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Education Routes */}
            <Route
              path="/education"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Education />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Governorate Routes */}
            <Route
              path="/governorate"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Governorate />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Wilayat Routes */}
            <Route
              path="/wilayat"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Wilayat />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Governorate Vaccinated Routes */}
            <Route
              path="/governorate-vaccinated"
              element={
                <ProtectedRoute>
                  <Layout>
                    <GovernorateVaccinated />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Institution Routes */}
            <Route
              path="/institution"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Institution />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Institution Place Routes */}
            <Route
              path="/institution-place"
              element={
                <ProtectedRoute>
                  <Layout>
                    <InstitutionPlace />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Nationality Routes */}
            <Route
              path="/nationality"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Nationality />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Occupation Routes */}
            <Route
              path="/occupation"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Occupation />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Source Routes */}
            <Route
              path="/source"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Source />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Site of Injection Routes */}
            <Route
              path="/site-of-injection"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SiteOfInjection />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Treatment Routes */}
            <Route
              path="/treatment"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Treatment />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Vaccine Manufacturer Routes */}
            <Route
              path="/vaccine-manufacturer"
              element={
                <ProtectedRoute>
                  <Layout>
                    <VaccineManufacturer />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Vaccine Name Routes */}
            <Route
              path="/vaccine-name"
              element={
                <ProtectedRoute>
                  <Layout>
                    <VaccineName />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

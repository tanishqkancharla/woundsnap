import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import providers
import { AuthProvider } from "./context/AuthContext";

// Import screens  
import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import Dashboard from "./screens/Dashboard";
import PhotoCapture from "./screens/PhotoCapture";
import ResultsScreen from "./screens/ResultsScreen";
import WoundInformationForm from "./screens/WoundInformationForm";
import TreatmentPlan from "./screens/TreatmentPlan";
import PatientProfile from "./screens/PatientProfile";
import FollowUpReminders from "./screens/FollowUpReminders";
import ClinicianVerification from "./screens/ClinicianVerification";
import Settings from "./screens/Settings";
import SupportFAQs from "./screens/SupportFAQs";

// Import components
import AuthCallback from "./components/AuthCallback";

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="app">
					<Routes>
						<Route path="/" element={<WelcomeScreen />} />
						<Route path="/login" element={<LoginScreen />} />
						<Route path="/auth/callback" element={<AuthCallback />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/photo-capture" element={<PhotoCapture />} />
						<Route path="/results" element={<ResultsScreen />} />
						<Route path="/wound-form" element={<WoundInformationForm />} />
						<Route path="/treatment" element={<TreatmentPlan />} />
						<Route path="/profile" element={<PatientProfile />} />
						<Route path="/reminders" element={<FollowUpReminders />} />
						<Route path="/clinician" element={<ClinicianVerification />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="/support" element={<SupportFAQs />} />
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;

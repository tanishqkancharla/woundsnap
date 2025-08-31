import React, { useState } from "react";
import { Link } from "react-router-dom";

interface PatientProfile {
	id: string;
	name: string;
	dateOfBirth: string;
	profilePhoto: string;
	medicalHistory: {
		surgeries: string[];
		conditions: string[];
		allergies: string[];
	};
	contactDetails: {
		phone: string;
		email: string;
		address?: string;
	};
}

// Mock patient data - can be replaced with Canvas Medical/Metriport API data
const mockPatientData: PatientProfile = {
	id: "patient-001",
	name: "Emily Johnson",
	dateOfBirth: "12/03/1985",
	profilePhoto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
	medicalHistory: {
		surgeries: ["Knee Replacement"],
		conditions: ["Hypertension"],
		allergies: ["Penicillin"]
	},
	contactDetails: {
		phone: "(555) 123-4567",
		email: "emily.johnson@example.com"
	}
};

function PatientProfile() {
	const [patient] = useState<PatientProfile>(mockPatientData);
	const [showEditModal, setShowEditModal] = useState<string | null>(null);

	const handleEditClick = (section: string) => {
		setShowEditModal(section);
		// In a real app, this would open an edit modal or navigate to an edit screen
		console.log(`Edit ${section} clicked`);
	};

	const handleUpdateClick = () => {
		console.log("Update patient profile clicked");
		// In a real app, this would save changes to Canvas Medical/Metriport
	};

	return (
		<div className="patient-profile">
			<header className="profile-header">
				<Link to="/dashboard" className="back-button">
					← Back
				</Link>
				<h1>Patient Profile</h1>
			</header>

			<div className="profile-content">
				{/* Personal Information Section */}
				<div className="profile-section">
					<h2 className="section-title">Personal Information</h2>
					<div className="profile-photo-container">
						<img 
							src={patient.profilePhoto} 
							alt={patient.name}
							className="profile-photo"
						/>
					</div>
					<div className="personal-info">
						<div className="info-item">
							<span className="info-label">Name:</span> {patient.name}
						</div>
						<div className="info-item">
							<span className="info-label">DOB:</span> {patient.dateOfBirth}
						</div>
					</div>
					<button 
						className="edit-button"
						onClick={() => handleEditClick("personal")}
					>
						Edit
					</button>
				</div>

				{/* Medical History Section */}
				<div className="profile-section">
					<h2 className="section-title">Medical History</h2>
					<div className="medical-info">
						{patient.medicalHistory.surgeries.map((surgery, index) => (
							<div key={index} className="info-item">
								<span className="info-label">Surgery:</span> {surgery}
							</div>
						))}
						{patient.medicalHistory.conditions.map((condition, index) => (
							<div key={index} className="info-item">
								<span className="info-label">Condition:</span> {condition}
							</div>
						))}
						{patient.medicalHistory.allergies.map((allergy, index) => (
							<div key={index} className="info-item">
								<span className="info-label">Allergy:</span> {allergy}
							</div>
						))}
					</div>
					<button 
						className="edit-button"
						onClick={() => handleEditClick("medical")}
					>
						Edit
					</button>
				</div>

				{/* Contact Details Section */}
				<div className="profile-section">
					<h2 className="section-title">Contact Details</h2>
					<div className="contact-info">
						<div className="info-item">
							<span className="info-label">Phone:</span> {patient.contactDetails.phone}
						</div>
						<div className="info-item">
							<span className="info-label">Email:</span> {patient.contactDetails.email}
						</div>
					</div>
					<button 
						className="edit-button"
						onClick={() => handleEditClick("contact")}
					>
						Edit
					</button>
				</div>

				{/* Update Button */}
				<button 
					className="update-button"
					onClick={handleUpdateClick}
				>
					Update
				</button>
			</div>

			{/* Simple edit modal placeholder */}
			{showEditModal && (
				<div className="edit-modal-overlay" onClick={() => setShowEditModal(null)}>
					<div className="edit-modal" onClick={(e) => e.stopPropagation()}>
						<h3>Edit {showEditModal} Information</h3>
						<p>Edit functionality would be implemented here.</p>
						<div className="modal-actions">
							<button onClick={() => setShowEditModal(null)}>Cancel</button>
							<button className="save-button">Save</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default PatientProfile;

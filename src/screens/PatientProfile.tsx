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
	const [patient, setPatient] = useState<PatientProfile>(mockPatientData);
	const [showEditModal, setShowEditModal] = useState<string | null>(null);
	const [editFormData, setEditFormData] = useState<any>({});

	const handleEditClick = (section: string) => {
		setShowEditModal(section);
		// Pre-populate form data based on section
		switch (section) {
			case 'personal':
				setEditFormData({
					name: patient.name,
					dateOfBirth: patient.dateOfBirth
				});
				break;
			case 'medical':
				setEditFormData({
					surgeries: patient.medicalHistory.surgeries.join(', '),
					conditions: patient.medicalHistory.conditions.join(', '),
					allergies: patient.medicalHistory.allergies.join(', ')
				});
				break;
			case 'contact':
				setEditFormData({
					phone: patient.contactDetails.phone,
					email: patient.contactDetails.email,
					address: patient.contactDetails.address || ''
				});
				break;
		}
	};

	const handleSaveEdit = () => {
		// Update patient data based on the current section
		const newPatient = { ...patient };
		
		switch (showEditModal) {
			case 'personal':
				newPatient.name = editFormData.name;
				newPatient.dateOfBirth = editFormData.dateOfBirth;
				break;
			case 'medical':
				newPatient.medicalHistory = {
					surgeries: editFormData.surgeries.split(',').map((s: string) => s.trim()).filter((s: string) => s),
					conditions: editFormData.conditions.split(',').map((s: string) => s.trim()).filter((s: string) => s),
					allergies: editFormData.allergies.split(',').map((s: string) => s.trim()).filter((s: string) => s)
				};
				break;
			case 'contact':
				newPatient.contactDetails = {
					phone: editFormData.phone,
					email: editFormData.email,
					address: editFormData.address
				};
				break;
		}
		
		setPatient(newPatient);
		setShowEditModal(null);
		console.log('Patient data updated:', newPatient);
	};

	const handleInputChange = (field: string, value: string) => {
		setEditFormData(prev => ({
			...prev,
			[field]: value
		}));
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

			{/* Edit modal with form fields */}
			{showEditModal && (
				<div className="edit-modal-overlay" onClick={() => setShowEditModal(null)}>
					<div className="edit-modal" onClick={(e) => e.stopPropagation()}>
						<h3>Edit {showEditModal === 'personal' ? 'Personal' : showEditModal === 'medical' ? 'Medical History' : 'Contact Details'} Information</h3>
						
						<div className="edit-form">
							{showEditModal === 'personal' && (
								<>
									<div className="form-group">
										<label>Name:</label>
										<input
											type="text"
											value={editFormData.name || ''}
											onChange={(e) => handleInputChange('name', e.target.value)}
											placeholder="Enter name"
										/>
									</div>
									<div className="form-group">
										<label>Date of Birth:</label>
										<input
											type="text"
											value={editFormData.dateOfBirth || ''}
											onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
											placeholder="MM/DD/YYYY"
										/>
									</div>
								</>
							)}
							
							{showEditModal === 'medical' && (
								<>
									<div className="form-group">
										<label>Surgeries (comma-separated):</label>
										<input
											type="text"
											value={editFormData.surgeries || ''}
											onChange={(e) => handleInputChange('surgeries', e.target.value)}
											placeholder="e.g., Knee Replacement, Appendectomy"
										/>
									</div>
									<div className="form-group">
										<label>Conditions (comma-separated):</label>
										<input
											type="text"
											value={editFormData.conditions || ''}
											onChange={(e) => handleInputChange('conditions', e.target.value)}
											placeholder="e.g., Hypertension, Diabetes"
										/>
									</div>
									<div className="form-group">
										<label>Allergies (comma-separated):</label>
										<input
											type="text"
											value={editFormData.allergies || ''}
											onChange={(e) => handleInputChange('allergies', e.target.value)}
											placeholder="e.g., Penicillin, Peanuts"
										/>
									</div>
								</>
							)}
							
							{showEditModal === 'contact' && (
								<>
									<div className="form-group">
										<label>Phone:</label>
										<input
											type="tel"
											value={editFormData.phone || ''}
											onChange={(e) => handleInputChange('phone', e.target.value)}
											placeholder="(555) 123-4567"
										/>
									</div>
									<div className="form-group">
										<label>Email:</label>
										<input
											type="email"
											value={editFormData.email || ''}
											onChange={(e) => handleInputChange('email', e.target.value)}
											placeholder="email@example.com"
										/>
									</div>
									<div className="form-group">
										<label>Address:</label>
										<input
											type="text"
											value={editFormData.address || ''}
											onChange={(e) => handleInputChange('address', e.target.value)}
											placeholder="123 Main St, City, State"
										/>
									</div>
								</>
							)}
						</div>
						
						<div className="modal-actions">
							<button onClick={() => setShowEditModal(null)}>Cancel</button>
							<button className="save-button" onClick={handleSaveEdit}>Save</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default PatientProfile;

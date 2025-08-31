import React from "react";
import { Link } from "react-router-dom";

function SupportFAQs() {
	const faqs = [
		{
			question: "How accurate is the AI wound analysis?",
			answer: "Our AI uses Google MedGemma trained on medical imagery and provides clinical-grade analysis. However, always consult healthcare professionals for medical decisions.",
		},
		{
			question: "Is my medical data secure?",
			answer: "Yes, all data is encrypted and stored securely through Canvas Medical's FHIR-compliant platform, meeting HIPAA requirements.",
		},
		{
			question: "Can I share results with my doctor?",
			answer: "Absolutely! Results are automatically formatted for easy sharing with healthcare providers and can be integrated into EHR systems.",
		},
	];

	return (
		<div className="support-faqs">
			<header className="support-header">
				<Link to="/dashboard" className="back-button">
					← Back
				</Link>
				<h1>Help & Support</h1>
			</header>
			
			<div className="support-content">
				<section className="about-section">
					<h2>About WoundSnap</h2>
					<p>
						WoundSnap uses advanced AI to analyze wound photos and provide 
						clinical-grade assessments with automated care coordination.
					</p>
				</section>

				<section className="faqs-section">
					<h2>Frequently Asked Questions</h2>
					<div className="faqs-list">
						{faqs.map((faq, index) => (
							<div key={index} className="faq-item">
								<h3 className="faq-question">{faq.question}</h3>
								<p className="faq-answer">{faq.answer}</p>
							</div>
						))}
					</div>
				</section>

				<section className="contact-section">
					<h2>Need More Help?</h2>
					<p>Contact our support team:</p>
					<div className="contact-options">
						<button className="btn-primary">Email Support</button>
						<button className="btn-secondary">Live Chat</button>
					</div>
				</section>
			</div>
		</div>
	);
}

export default SupportFAQs;

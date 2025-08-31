import React from "react";
import { Link } from "react-router-dom";

function SupportFAQs() {
	const faqs = [
		{
			question: "How do I create a new wound record?",
			answer: "To create a new wound record, navigate to the Dashboard and select 'Create New Wound Record'. Follow the prompts to enter details about the wound.",
		},
		{
			question: "What is the best way to track wound healing?",
			answer: "Regularly update the wound record with photos and notes. Utilize the 'Follow-Up Reminders' to schedule check-ins and monitor progress.",
		},
		{
			question: "How can I access my treatment plan?",
			answer: "Your treatment plan is accessible from the 'Treatment Plan' section on the Dashboard. It provides detailed guidance on wound care.",
		},
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

	const resources = [
		{
			title: "The Art of Wound Care - A comprehensive guide",
			url: "#",
		},
		{
			title: "Wound Care Basics - Understanding the essentials", 
			url: "#",
		},
		{
			title: "Advanced Wound Care Techniques - For complex cases",
			url: "#",
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

				<section className="resources-section">
					<h2>Additional Resources</h2>
					<div className="resources-list">
						{resources.map((resource, index) => (
							<a key={index} href={resource.url} className="resource-link">
								{resource.title}
							</a>
						))}
					</div>
				</section>

				<section className="contact-section">
					<button className="contact-support-btn">Contact Support</button>
				</section>
			</div>
		</div>
	);
}

export default SupportFAQs;

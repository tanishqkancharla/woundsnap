import React from 'react';

interface ToggleSwitchProps {
	id: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	label: string;
	className?: string;
}

function ToggleSwitch({ id, checked, onChange, label, className = '' }: ToggleSwitchProps) {
	return (
		<div className={`toggle-switch-container ${className}`}>
			<span className="toggle-label">{label}</span>
			<div 
				className={`toggle-switch ${checked ? 'checked' : ''}`}
				onClick={() => onChange(!checked)}
				role="switch"
				aria-checked={checked}
				aria-labelledby={`${id}-label`}
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === ' ' || e.key === 'Enter') {
						e.preventDefault();
						onChange(!checked);
					}
				}}
			>
				<div className="toggle-circle"></div>
			</div>
		</div>
	);
}

export default ToggleSwitch;

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./style.css";

export function add(x: number, y: number) {
	return x + y;
}

function run() {
	const container = document.createElement("main");
	document.body.appendChild(container);
	ReactDOM.render(<App />, container);
}

if (typeof window !== "undefined") {
	// If in browser context
	run();
}

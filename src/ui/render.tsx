import React from 'react';
import { createRoot } from 'react-dom/client';
import { Overlay } from './Overlay';
import { setDebugVisible } from '../debug';

const navDomNode = document.getElementById('overlay-react-root');
const navRoot = createRoot(navDomNode); 

declare global {
	var showingOverlay: boolean;
}

globalThis.showingOverlay = false;

export function toggleOverlay(to?: boolean) {
	const stateChanged = to === undefined || globalThis.showingOverlay !== to;
	globalThis.showingOverlay = to ?? !globalThis.showingOverlay;

	if (stateChanged) {
		setDebugVisible(!globalThis.showingOverlay);
		navRoot.render(<Overlay visible={globalThis.showingOverlay} />);
	}
}
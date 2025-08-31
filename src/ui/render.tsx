import React from 'react';
import { createRoot } from 'react-dom/client';
import { Overlay } from './Overlay';
import { setDebugVisible } from '../debug';

const navDomNode = document.getElementById('overlay-react-root');
const navRoot = createRoot(navDomNode); 

let showingOverlay = false;

export function toggleOverlay(to?: boolean) {
	const stateChanged = to === undefined || showingOverlay !== to;
	showingOverlay = to ?? !showingOverlay;

	if (stateChanged) {
		setDebugVisible(!showingOverlay);
		navRoot.render(<Overlay visible={showingOverlay} />);
	}
}
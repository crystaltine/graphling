import React from 'react';
import './Overlay.css';

import { XIcon } from 'lucide-react';
import { toggleOverlay } from './render';

import { EditableMathField } from 'react-mathquill';

export const Overlay = ({visible}: {visible: boolean}) => {

	const containerRef = React.useRef<HTMLDivElement>(null);
	const bodyRef = React.useRef<HTMLDivElement>(null);

	const [latex, setLatex] = React.useState<string>('')

	const [exitAnimTimeout_bodyElement, setExitAnimTimeout_bodyElement] = React.useState<NodeJS.Timeout | null>(null);
	const [editAnimTimeout_containerElement, setEditAnimTimeout_containerElement] = React.useState<NodeJS.Timeout | null>(null);

	React.useEffect(() => {
		if (!visible && containerRef.current && bodyRef.current) {
			// handle exit animations
			containerRef.current.classList.add('exiting');
			bodyRef.current.classList.add('exiting');

			const bodyAnimDuration = parseFloat(getComputedStyle(bodyRef.current).animationDuration);
			
			// timeout for body element (handling exit animiation END)
			setExitAnimTimeout_bodyElement(setTimeout(() => {
				if (bodyRef.current) {
					bodyRef.current.style.display = 'none';
					bodyRef.current.classList.remove('exiting');
				}
			}, bodyAnimDuration * 1000));
			
			// timeout for container (handling exit animiation END)
			const containerAnimDuration = parseFloat(getComputedStyle(containerRef.current).animationDuration);
			setEditAnimTimeout_containerElement(setTimeout(() => {
				if (containerRef.current) {
					containerRef.current.style.display = 'none';
					containerRef.current.classList.remove('exiting');
				}
			}, containerAnimDuration * 1000));

		} else {
			// we need to make it visible here
			// cancel all the garbage above and just make ts visible
			if (exitAnimTimeout_bodyElement) {
				clearTimeout(exitAnimTimeout_bodyElement);
				if (bodyRef.current) {
					bodyRef.current.classList.remove('exiting');
				}
				setExitAnimTimeout_bodyElement(null);
			}
			if (editAnimTimeout_containerElement) {
				clearTimeout(editAnimTimeout_containerElement);
				if (containerRef.current) {
					containerRef.current.classList.remove('exiting');
				}
				setEditAnimTimeout_containerElement(null);
			}
			if (containerRef.current && bodyRef.current) {
				containerRef.current.style.display = 'flex';
				bodyRef.current.style.display = 'flex';
			}
		}
	}, [visible]);

	return (
		<div ref={containerRef} className='overlay-container'>
			<div ref={bodyRef} className='overlay-body' onClick={e => e.stopPropagation()}>
				<button className='overlay-close-button' onClick={() => toggleOverlay(false)}>
					<XIcon size="1em" />
				</button>

				<div className='overlay-section'>
					<h2>Equation</h2>
					<EditableMathField
					className='overlay-equation-input'
					latex={latex}
					onChange={(mathField) => {
						setLatex(mathField.latex())
					}}/>
					<p>{latex}</p>
				</div>

				<div className='overlay-section'>
					<h2>Bounds</h2>
					<div>
						x
					</div>
					<div>
						y
					</div>
					<div>
						z
					</div>
				</div>

				<div className='overlay-section'>
					<h2>Settings</h2>
				</div>

			</div>
		</div>
	);
};

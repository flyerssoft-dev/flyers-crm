import React from 'react';
import Highlighter from 'react-highlight-words';

const HighlightComponent = ({ highlightClassName = 'highlightClass', searchWords = [], autoEscape = true, textToHighlight = '' }) => {
	return <Highlighter {...{ highlightClassName, searchWords, autoEscape, textToHighlight }} />;
};

export default HighlightComponent;

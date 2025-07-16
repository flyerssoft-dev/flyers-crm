import React from 'react';
import ProjectDetailsPresentational from './project-details-presentational';

const ProjectDetailsFunctional = ({ visible, closeModal }) => {
	return <ProjectDetailsPresentational {...{ visible, closeModal }} />;
};

export default ProjectDetailsFunctional;

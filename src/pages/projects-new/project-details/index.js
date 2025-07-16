import React from 'react';
import ProjectDetailsFunctional from './components/project-details-functional';
import './project-details.scss';

const ProjectDetail = ({ visible, closeModal }) => <ProjectDetailsFunctional {...{ visible, closeModal }} />;

export default ProjectDetail;

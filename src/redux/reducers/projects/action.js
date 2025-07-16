import { ACTIONS } from 'constants/app-constants';

function setProjects(data) {
	return {
		type: 'SET_PROJECTS',
		payload: data,
	};
}

function setSelectedProject(data) {
	return {
		type: 'SET_SELECTED_PROJECT',
		payload: data,
	};
}
function setProjectDetails(data) {
	return {
		type: ACTIONS.GET_PROJECTS_DETAILS,
		payload: data,
	};
}

export { setProjects, setSelectedProject, setProjectDetails };

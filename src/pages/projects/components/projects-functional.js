import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SERVER_IP } from 'assets/Config';
import { getApi } from 'redux/sagas/getApiDataSaga';
import ProjectPresentational from './projects-presentational';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { API_STATUS } from 'constants/app-constants';

const ProjectsFunctional = () => {
	const dispatch = useDispatch();
	const customers = useSelector((state) => state?.customerRedux?.customers);
	const [selectedProject, setSelectedProject] = useState(null);
	const [addModalVisible, setAddModalVisible] = useState(false);
	const globalRedux = useSelector((state) => state.globalRedux);
	const projects = useSelector((state) => state?.projectRedux?.projects);

	const getProjects = useCallback(() => {
		let url = `${SERVER_IP}project?orgId=${globalRedux.selectedOrganization._id}`;
		dispatch(getApi('GET_PROJECTS', url));
	}, [dispatch, globalRedux.selectedOrganization._id]);

	const getCustomers = useCallback(() => {
		let url = `${SERVER_IP}customer?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(getApi('GET_CUSTOMERS', url));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	const handleProjectChange = useCallback((value) => {
		setSelectedProject(value);
	}, []);

	const handleAddProject = useCallback(
		(values) => {
			dispatch(postApi({ ...values, status: 'active', orgId: globalRedux?.selectedOrganization?._id }, 'ADD_PROJECT'));
		},
		[dispatch, globalRedux?.selectedOrganization?._id]
	);

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_PROJECT === 'SUCCESS') {
			dispatch(resetApiStatus('ADD_PROJECT'));
			setAddModalVisible(false);
			getProjects();
		}
	}, [globalRedux.apiStatus, getProjects, setAddModalVisible, dispatch]);

	useEffect(() => {
		getProjects();
		getCustomers();
	}, [getProjects, getCustomers]);

	const addingProject = globalRedux.apiStatus.ADD_PROJECT === API_STATUS.PENDING;


	return (
		<ProjectPresentational
			{...{ projects,addingProject, handleProjectChange, selectedProject, addModalVisible, setAddModalVisible, handleAddProject, customers }}
		/>
	);
};

export default ProjectsFunctional;

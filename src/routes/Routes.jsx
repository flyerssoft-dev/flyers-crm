import React, { Suspense, useState, useEffect } from 'react';
import { Route, Routes as Switch } from 'react-router-dom';
import { Row, Col } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

import PageLayout from 'components/page-layout';
import Register from 'pages/pre_login_pages/register';
import Login from 'pages/pre_login_pages/login';
import CompleteYourProfile from 'pages/profile/complete_your_profile';
import OrganizationList from 'pages/organization';
import NoAccess from 'components/no-access';
import { ROUTES } from 'constants/app-constants';
import LottieComponent from 'components/lottie-component';
import LottieFile from 'assets/lottie-files';
import ProtectedRoute from './protected-route';

const Routes = () => {
	const [showLoader, setShowLoader] = useState(true);

	useEffect(() => {
		// Simulate route content loading delay (Suspense fallback duration)
		const timer = setTimeout(() => {
			setShowLoader(false);
		}, 1500); // Adjust as needed (ideally matches load time)

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="app_container">
			<AnimatePresence>
				{showLoader && (
					<motion.div
						className="route-loader"
						initial={{ opacity: 1 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
						style={{
							position: 'fixed',
							top: 0,
							left: 0,
							width: '100%',
							height: '100vh',
							background: '#fff',
							zIndex: 9999,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<Row className="loader" align="middle">
							<Col span={24}>
								<LottieComponent file={LottieFile.Loading} width="15%" height="15%" />
							</Col>
						</Row>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Suspense wraps route loading but without animation */}
			<Suspense fallback={null}>
				<Switch>
					<Route element={<PageLayout />}>
						{ROUTES.map(({ route, Component , roles}, index) => (
							<Route
								key={index}
								path={route}
								element={
									<ProtectedRoute allowedRoles={roles}>
										<Component />
									</ProtectedRoute>
								}
							/>
						))}
						<Route path="*" element={<NoAccess />} />
					</Route>

					{/* Public Routes */}
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/organization" element={<OrganizationList />} />
					<Route path="/complete-your-profile" element={<CompleteYourProfile />} />
					<Route path="*" element={<NoAccess />} />
				</Switch>
			</Suspense>
		</div>
	);
};

export default Routes;

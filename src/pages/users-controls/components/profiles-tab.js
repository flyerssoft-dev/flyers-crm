// components/ProfilesTab.js
import React, { useState } from "react";
import {
	Table,
	Button,
	Input,
	Divider,
	Select,
	Row,
	Col,
	Typography,
	Switch,
	Space,
	Popconfirm,
	message,
	Modal,
} from "antd";
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	CloseOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const initialProfiles = [
	{
		key: 1,
		name: "Administrator",
		description: "This profile will have all the permissions.",
		modifiedBy: "FlyersSoft Admin",
		basicPermissions: {},
		advancedFeatures: {},
	},
	{
		key: 2,
		name: "Standard",
		description:
			"This profile will have all the permissions except administrative privileges.",
		modifiedBy: "System",
		basicPermissions: {},
		advancedFeatures: {},
	},
];

const defaultPermission = ["View", "Create", "Edit"];

const ProfilesTab = () => {
	const [profiles, setProfiles] = useState(initialProfiles);
	const [creating, setCreating] = useState(false);
	const [editingProfile, setEditingProfile] = useState(null);
	const [profileName, setProfileName] = useState("");
	const [basicPermissionsSelections, setBasicPermissionsSelections] = useState(
		{}
	);
	const [advancedFeaturesToggles, setAdvancedFeaturesToggles] = useState({});

	const [basicPermissionsList, setBasicPermissionsList] = useState([
		"Pipeline Records",
		"Contacts",
		"Companies",
		"Products",
		"Activities",
		"Notes",
		"Files",
		"Dashboards",
	]);
	const [advancedFeaturesList, setAdvancedFeaturesList] = useState([
		"Manage Team Pipelines",
		"Automation",
		"Forms",
		"User Management",
		"Bulk Actions",
		"Data Administration",
		"Miscellaneous",
		"Payment Links",
	]);
	const [newBasicPerm, setNewBasicPerm] = useState("");
	const [newAdvFeature, setNewAdvFeature] = useState("");

	const handleEdit = (record) => {
		setProfileName(record.name);
		setEditingProfile(record);
		setCreating(true);
		setBasicPermissionsSelections(record.basicPermissions || {});
		setAdvancedFeaturesToggles(record.advancedFeatures || {});
	};

	const handleDelete = (key) => {
		setProfiles(profiles.filter((p) => p.key !== key));
		message.success("Profile deleted");
	};

	const handleSave = () => {
		if (!profileName.trim()) {
			message.error("Profile name is required");
			return;
		}

		const newProfileData = {
			name: profileName,
			basicPermissions: basicPermissionsSelections,
			advancedFeatures: advancedFeaturesToggles,
		};

		if (editingProfile) {
			const updated = profiles.map((p) =>
				p.key === editingProfile.key
					? {
							...p,
							...newProfileData,
							modifiedBy: "Current User",
							description: p.description || "Updated profile",
					  }
					: p
			);
			setProfiles(updated);
			message.success("Profile updated");
		} else {
			const newProfile = {
				key: profiles.length ? profiles[profiles.length - 1].key + 1 : 1,
				description: "New custom profile",
				modifiedBy: "Current User",
				...newProfileData,
			};
			setProfiles([...profiles, newProfile]);
			message.success("Profile created");
		}

		setProfileName("");
		setCreating(false);
		setEditingProfile(null);
		setBasicPermissionsSelections({});
		setAdvancedFeaturesToggles({});
	};

	const handleDeleteBasicPermission = (perm) => {
		Modal.confirm({
			title: "Are you sure you want to delete this permission?",
			onOk: () => {
				setBasicPermissionsList(basicPermissionsList.filter((p) => p !== perm));
				const updatedSelections = { ...basicPermissionsSelections };
				delete updatedSelections[perm];
				setBasicPermissionsSelections(updatedSelections);
				message.success("Permission deleted");
			},
		});
	};

	const handleDeleteAdvancedFeature = (feature) => {
		Modal.confirm({
			title: "Are you sure you want to delete this feature?",
			onOk: () => {
				setAdvancedFeaturesList(
					advancedFeaturesList.filter((f) => f !== feature)
				);
				const updatedToggles = { ...advancedFeaturesToggles };
				delete updatedToggles[feature];
				setAdvancedFeaturesToggles(updatedToggles);
				message.success("Feature deleted");
			},
		});
	};

	return (
		<>
			{!creating && (
				<>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						style={{ marginBottom: 16 }}
						onClick={() => {
							setCreating(true);
							setProfileName("");
							setEditingProfile(null);
							setBasicPermissionsSelections({});
							setAdvancedFeaturesToggles({});
						}}
					>
						Create New Profile
					</Button>
					<Table
						columns={[
							{ title: "Profile Name", dataIndex: "name" },
							{ title: "Profile Description", dataIndex: "description" },
							{ title: "Modified By", dataIndex: "modifiedBy" },
							{
								title: "Actions",
								key: "actions",
								render: (_, record) => (
									<Space>
										<Button
											icon={<EditOutlined />}
											onClick={() => handleEdit(record)}
										/>
										<Popconfirm
											title="Delete this profile?"
											onConfirm={() => handleDelete(record.key)}
										>
											<Button icon={<DeleteOutlined />} danger />
										</Popconfirm>
									</Space>
								),
							},
						]}
						dataSource={profiles}
						pagination={false}
					/>
				</>
			)}

			{creating && (
				<div style={{ padding: 24, background: "#fafafa", borderRadius: 8 }}>
					<Title level={5}>
						{editingProfile ? "Edit Profile" : "Create New Profile"}
					</Title>
					<Input
						placeholder="Enter Profile Name"
						value={profileName}
						onChange={(e) => setProfileName(e.target.value)}
						style={{ width: 400, marginBottom: 24 }}
					/>

					<Divider />

					<Title level={5}>Basic Permissions</Title>
					<Space style={{ marginBottom: 12 }}>
						<Input
							placeholder="Add new basic permission"
							value={newBasicPerm}
							onChange={(e) => setNewBasicPerm(e.target.value)}
						/>
						<Button
							onClick={() => {
								if (!newBasicPerm.trim()) return;
								if (basicPermissionsList.includes(newBasicPerm)) {
									message.warning("Permission already exists");
									return;
								}
								setBasicPermissionsList([
									...basicPermissionsList,
									newBasicPerm.trim(),
								]);
								setNewBasicPerm("");
							}}
						>
							Add
						</Button>
					</Space>

					<Row gutter={[24, 16]}>
						{basicPermissionsList.map((perm) => (
							<Col span={12} key={perm}>
								<Space
									style={{ width: "100%", justifyContent: "space-between" }}
								>
									<strong>{perm}</strong>
									<Button
										size="small"
										icon={<CloseOutlined />}
										onClick={() => handleDeleteBasicPermission(perm)}
									/>
								</Space>
								<Select
									mode="multiple"
									allowClear
									placeholder="Select permissions"
									value={basicPermissionsSelections[perm] || defaultPermission}
									onChange={(value) =>
										setBasicPermissionsSelections({
											...basicPermissionsSelections,
											[perm]: value,
										})
									}
									style={{ width: "100%", marginTop: 8 }}
								>
									{["View", "Create", "Edit", "Delete"].map((option) => (
										<Option key={option} value={option}>
											{option}
										</Option>
									))}
								</Select>
							</Col>
						))}
					</Row>

					<Divider />

					<Title level={5}>Advanced Features</Title>
					<Space style={{ marginBottom: 12 }}>
						<Input
							placeholder="Add new advanced feature"
							value={newAdvFeature}
							onChange={(e) => setNewAdvFeature(e.target.value)}
						/>
						<Button
							onClick={() => {
								if (!newAdvFeature.trim()) return;
								if (advancedFeaturesList.includes(newAdvFeature)) {
									message.warning("Feature already exists");
									return;
								}
								setAdvancedFeaturesList([
									...advancedFeaturesList,
									newAdvFeature.trim(),
								]);
								setNewAdvFeature("");
							}}
						>
							Add
						</Button>
					</Space>

					<Row gutter={[24, 16]} style={{ marginBottom: 20 }}>
						{advancedFeaturesList.map((feat) => (
							<Col
								span={12}
								key={feat}
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<Space>
									<span>{feat}</span>
									<Button
										size="small"
										icon={<CloseOutlined />}
										onClick={() => handleDeleteAdvancedFeature(feat)}
									/>
								</Space>
								<Switch
									checked={
										advancedFeaturesToggles[feat] ?? feat !== "Payment Links"
									}
									onChange={(checked) =>
										setAdvancedFeaturesToggles({
											...advancedFeaturesToggles,
											[feat]: checked,
										})
									}
								/>
							</Col>
						))}
					</Row>

					<Divider />

					<div style={{ textAlign: "right", marginTop: 20 }}>
						<Button
							onClick={() => {
								setCreating(false);
								setProfileName("");
								setEditingProfile(null);
								setBasicPermissionsSelections({});
								setAdvancedFeaturesToggles({});
							}}
							style={{ marginRight: 8 }}
						>
							Cancel
						</Button>
						<Button type="primary" onClick={handleSave}>
							{editingProfile ? "Update" : "Save"}
						</Button>
					</div>
				</div>
			)}
		</>
	);
};

export default ProfilesTab;

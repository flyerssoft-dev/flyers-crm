import React, { useEffect, useState } from "react";
import { Badge, Button, Skeleton, Card } from "antd";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedOrganization } from "redux/reducers/globals/globalActions";
import { setLoginStatus } from "redux/reducers/login/loginActions";
import { getApi } from "redux/sagas/getApiDataSaga";
import { applicationLogout } from "services/LoginServices";
import { API_STATUS } from "constants/app-constants";
import AddModal from "components/add-modal";
import building from "assets/images/building.jpg";
import AddOrganization from "./add-organization";
import Swal from "sweetalert2";
import "./OrganizationList.scss";
import { sendGetRequest } from "redux/sagas/utils";
import { SERVER_IP } from "assets/Config";

const OrganizationList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginRedux = useSelector((state) => state.loginRedux);
  const globalRedux = useSelector((state) => state.globalRedux);
  const [visible, toggleVisible] = useState(false);

  useEffect(() => {
    if (!loginRedux.isLogged) navigate("/login");
  }, [loginRedux.isLogged, navigate]);

  console.log('loginRedux',loginRedux)

  useEffect(() => {
    dispatch(getApi("GET_ALL_ORGANIZATION"));
  }, [dispatch]);

  const refreshOrganizationList = () => {
    dispatch(getApi("GET_ALL_ORGANIZATION"));
    toggleVisible(false);
  };

  const handleSelectOrganization = async (org) => {
    try {
      const response = await sendGetRequest(
        null,
        `${SERVER_IP}organization/${org.id}`
      );

      if (response?.data?.message) {
        dispatch(setLoginStatus(true));
        dispatch(setSelectedOrganization(response.data.message));
        navigate('/');
      } else {
        console.warn("No org data in response");
      }
    } catch (error) {
      console.error("Error selecting organization:", error);
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title:
        '<h3 style="font-weight:600;color:#333;margin-bottom:8px">Logout Confirmation</h3>',
      html: '<p style="color:#777;font-size:14px;margin:0">Are you sure you want to logout?</p>',
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2562ec",
      cancelButtonColor: "#f0f0f0",
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        popup: "logout-popup",
        confirmButton: "logout-confirm",
        cancelButton: "logout-cancel",
      },
    });

    if (result.isConfirmed) {
      applicationLogout();
    }
  };

  let organizationDetails = useSelector(
    (state) => state?.globalRedux?.organizations || []
  );
  organizationDetails = organizationDetails.sort(
    (a, b) => b.defaultOrg - a.defaultOrg
  );

  return (
    <div className="organization-container">
      <div className="org-header">
        <h2>
          Hi {loginRedux.firstName} {loginRedux.lastName},
        </h2>
        <div className="org-header-actions">
          <Button type="primary" onClick={() => toggleVisible(true)}>
            Create Organization
          </Button>
          <Button type="primary" danger onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <hr className="org-divider" />

      <div className="org-list">
        {!organizationDetails.length &&
          globalRedux.apiStatus.GET_ALL_ORGANIZATION === API_STATUS.PENDING && (
            <Skeleton active />
          )}
        {!organizationDetails.length &&
          globalRedux.apiStatus.GET_ALL_ORGANIZATION === API_STATUS.SUCCESS && (
            <div className="org-empty">No organizations</div>
          )}

        <div className="org-grid">
          {organizationDetails.map((details, index) => {
            const isDefault = details.defaultOrg || details.default;
            const key = details.id || details.id || details.orgNumber || index;

            const cardContent = (
              <Card
                key={key}
                className="org-card"
                onClick={() => handleSelectOrganization(details)}
                styles={{ padding: "16px" }}
              >
                <div className="org-card-inner">
                  <div className="org-img-box">
                    <img src={building} alt="org" />
                  </div>
                  <div className="org-info">
                    <h5 className="org-name">{details?.organization_name}</h5>
                    <p className="org-meta">
                      Organization ID: {details?.id || details?.orgNumber}
                    </p>
                    <p className="org-meta">
                      GST: {details?.edition || details?.gstin}
                    </p>
                    {details.createdAt && (
                      <p className="org-meta">
                        Created On:{" "}
                        {moment(details.createdAt).format("DD/MM/YYYY")}
                      </p>
                    )}
                    {details.userRole && (
                      <p className="org-meta">
                        You are an <strong>{details.userRole}</strong> in this
                        organization
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );

            return isDefault ? (
              <Badge.Ribbon
                key={`default-${key}`}
                text="Default"
                placement="start"
              >
                {cardContent}
              </Badge.Ribbon>
            ) : (
              cardContent
            );
          })}
        </div>
      </div>

      <AddModal
        visible={visible}
        toggleVisible={toggleVisible}
        modalTitle="Create Organization"
        width="40%"
      >
        <AddOrganization
          refreshList={refreshOrganizationList}
          closeModal={() => toggleVisible(false)}
        />
      </AddModal>
    </div>
  );
};

export default OrganizationList;

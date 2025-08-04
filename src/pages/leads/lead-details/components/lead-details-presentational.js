import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Tour, Tooltip, Checkbox } from "antd";
import "../styles.scss";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_IP } from "assets/Config";
import { getApi } from "redux/sagas/getApiDataSaga";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const LeadPresentational = () => {
  // const [activeTab, setActiveTab] = useState("overview");
  // const [isDetailsVisible, setIsDetailsVisible] = useState(true);
  const { leadsId } = useParams();
  const leadsRedux = useSelector((state) => state.leadsRedux);

  const dispatch = useDispatch();
  const navigate= useNavigate()

  useEffect(() => {
    if (leadsId) {
      let url = `${SERVER_IP}leads/${leadsId}`;
      dispatch(getApi("GET_LEADS_BY_ID", url));
    }
  }, [leadsId]);

  const leadData = {
    leadOwner: leadsRedux?.leadData?.lead_owner_name,
    title: leadsRedux?.leadData?.title,
    phone: leadsRedux?.leadData?.phone,
    mobile: leadsRedux?.leadData?.mobile,
    leadSource: leadsRedux?.leadData?.lead_source,
    industry: leadsRedux?.leadData?.industry,
    annualRevenue: leadsRedux?.leadData?.annual_revenue,
    emailOptOut: leadsRedux?.leadData?.email_opt_out,
    modifiedBy: leadsRedux?.leadData?.lead_owner_name,
    modifiedDate: leadsRedux?.leadData?.updatedAt,
    company: leadsRedux?.leadData?.company_name,
    leadName: `${leadsRedux?.leadData?.first_name} ${leadsRedux?.leadData?.last_name}`,
    email: leadsRedux?.leadData?.email,
    fax: leadsRedux?.leadData?.fax,
    website: leadsRedux?.leadData?.website,
    leadStatus: leadsRedux?.leadData?.lead_status,
    numberOfEmployees: leadsRedux?.leadData?.no_of_employees,
    rating: leadsRedux?.leadData?.rating,
    createdBy: leadsRedux?.leadData?.lead_owner_name,
    createdDate: leadsRedux?.leadData?.createdAt,
    skypeId: leadsRedux?.leadData?.skype_id,
    secondaryEmail: leadsRedux?.leadData?.secondary_email,
    twitter: leadsRedux?.leadData?.twitter,
    street: `${leadsRedux?.leadData?.address_line_one},${leadsRedux?.leadData?.address_line_two}`,
    city: leadsRedux?.leadData?.city,
    state: leadsRedux?.leadData?.state,
    zipCode: leadsRedux?.leadData?.zip_code,
    country: leadsRedux?.leadData?.country,
    description: leadsRedux?.leadData?.description,
  };

  // const toggleDetails = () => {
  //   setIsDetailsVisible(!isDetailsVisible);
  // };
  return (
    <>
      <Col className="lead_container">
        <div className="lead-details">
       <div
            className="lead-details__header"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <div onClick={() => navigate(-1)} style={{ cursor:'pointer'}}>←</div>
            <div>Lead Details</div>
          </div>

          <div className="lead-details__content">
            {/* Lead Information Section */}
            <div className="lead-details__section">
              <h3 className="lead-details__section-title">Lead Information</h3>
              <div className="lead-details__grid">
                <div className="lead-details__column">
                  <div className="lead-field">
                    <label className="lead-field__label">Lead Owner</label>
                    <div className="lead-field__value">
                      {leadData.leadOwner}
                    </div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Title</label>
                    <div className="lead-field__value">{leadData.title}</div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Phone</label>
                    <div className="lead-field__value lead-field__value--phone">
                      {leadData.phone}
                    </div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Mobile</label>
                    <div className="lead-field__value lead-field__value--phone">
                      {leadData.mobile}
                    </div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Lead Source</label>
                    <div className="lead-field__value">
                      {leadData.leadSource}
                    </div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Industry</label>
                    <div className="lead-field__value">{leadData.industry}</div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Annual Revenue</label>
                    <div className="lead-field__value">
                      {leadData.annualRevenue}
                    </div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Email Opt Out</label>
                    <div className="lead-field__value">
                      <Checkbox checked={leadData.emailOptOut}></Checkbox>
                    </div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Modified By</label>
                    <div className="lead-field__value lead-field__value--with-date">
                      <div>{leadData.modifiedBy}</div>
                      <div className="lead-field__date">
                        {dayjs(leadData.modifiedDate).format(
                          "DD-MM-YYYY HH:mm"
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lead-details__column">
                  <div className="lead-field">
                    <label className="lead-field__label">Company</label>
                    <div className="lead-field__value">{leadData.company}</div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Lead Name</label>
                    <div className="lead-field__value">{leadData.leadName}</div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Email</label>
                    <div className="lead-field__value lead-field__value--email">
                      {leadData.email}
                    </div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Fax</label>
                    <div className="lead-field__value">{leadData.fax}</div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Website</label>
                    <div className="lead-field__value lead-field__value--link">
                      {leadData.website}
                    </div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Lead Status</label>
                    <div className="lead-field__value">
                      {leadData.leadStatus}
                    </div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">
                      No. of Employees
                    </label>
                    <div className="lead-field__value">
                      {leadData.numberOfEmployees}
                    </div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Rating</label>
                    <div className="lead-field__value">{leadData.rating}</div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Created By</label>
                    <div className="lead-field__value lead-field__value--with-date">
                      <div>{leadData.createdBy}</div>
                      <div className="lead-field__date">
                        {dayjs(leadData.createdDate).format("DD-MM-YYYY HH:mm")}
                      </div>
                    </div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Skype ID</label>
                    <div className="lead-field__value lead-field__value--skype">
                      {leadData.skypeId}
                      <span className="skype-icon">📞</span>
                    </div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Secondary Email</label>
                    <div className="lead-field__value">
                      {leadData.secondaryEmail}
                    </div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Twitter</label>
                    <div className="lead-field__value lead-field__value--twitter">
                      {leadData.twitter}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="lead-details__section">
              <h3 className="lead-details__section-title">
                Address Information
              </h3>
              <div className="lead-details__grid">
                <div className="lead-details__column">
                  <div className="lead-field">
                    <label className="lead-field__label">Street</label>
                    <div className="lead-field__value">{leadData.street}</div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">State</label>
                    <div className="lead-field__value">{leadData.state}</div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Country</label>
                    <div className="lead-field__value">{leadData.country}</div>
                  </div>
                </div>
                <div className="lead-details__column">
                  <div className="lead-field">
                    <label className="lead-field__label">City</label>
                    <div className="lead-field__value">{leadData.city}</div>
                  </div>
                  <div className="lead-field">
                    <label className="lead-field__label">Zip Code</label>
                    <div className="lead-field__value">{leadData.zipCode}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Information Section */}
            <div className="lead-details__section">
              <h3 className="lead-details__section-title">
                Description Information
              </h3>
              <div className="lead-field">
                <label className="lead-field__label">Description</label>
                <div className="lead-field__value">{leadData.description}</div>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default LeadPresentational;

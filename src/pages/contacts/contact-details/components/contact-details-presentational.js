import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Tour, Tooltip, Checkbox, Button } from "antd";
import "../styles.scss";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_IP } from "assets/Config";
import { getApi } from "redux/sagas/getApiDataSaga";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const ContactDetailsPresentational = () => {
  // const [activeTab, setActiveTab] = useState("overview");
  // const [isDetailsVisible, setIsDetailsVisible] = useState(true);
  const { contactId } = useParams();
  const contactRedux = useSelector((state) => state.contactRedux);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (contactId) {
      let url = `${SERVER_IP}contact/${contactId}`;
      dispatch(getApi("GET_CONTACT_BY_ID", url));
    }
  }, [contactId]);

  const contactData = {
    contactOwner: contactRedux?.contactData?.contact_owner_name,
    account_name: contactRedux?.contactData?.account_name,
    phone: contactRedux?.contactData?.phone,
    mobile: contactRedux?.contactData?.mobile,
    other_phone: contactRedux?.contactData?.other_phone,
    assistant: contactRedux?.contactData?.assistant,
    modifiedBy: contactRedux?.contactData?.contact_owner_name,
    modifiedDate: contactRedux?.contactData?.updatedAt,
    lead_source: contactRedux?.contactData?.lead_source,
    contactName: `${contactRedux?.contactData?.first_name} ${contactRedux?.contactData?.last_name}`,
    email: contactRedux?.contactData?.email,
    title: contactRedux?.contactData?.title,
    department: contactRedux?.contactData?.department,
    fax: contactRedux?.contactData?.fax,
    home_phone: contactRedux?.contactData?.home_phone,
    date_of_birth: contactRedux?.contactData?.date_of_birth,
    emailOptOut: contactRedux?.contactData?.email_opt_out,
    createdBy: contactRedux?.contactData?.contact_owner_name,
    createdDate: contactRedux?.contactData?.createdAt,
    skypeId: contactRedux?.contactData?.skype_id,
    secondaryEmail: contactRedux?.contactData?.secondary_email,
    twitter: contactRedux?.contactData?.twitter,
    reporting_to: contactRedux?.contactData?.reporting_to,
    mailing_street: contactRedux?.contactData?.mailing_street,
    mailing_city: contactRedux?.contactData?.mailing_city,
    mailing_state: contactRedux?.contactData?.mailing_state,
    mailing_zip_code: contactRedux?.contactData?.mailing_zip_code,
    mailing_country: contactRedux?.contactData?.mailing_country,
    other_street: contactRedux?.contactData?.other_street,
    other_city: contactRedux?.contactData?.other_city,
    other_state: contactRedux?.contactData?.other_state,
    other_zip_code: contactRedux?.contactData?.other_zip_code,
    other_country: contactRedux?.contactData?.other_country,
    description: contactRedux?.contactData?.description,
  };

  // const toggleDetails = () => {
  //   setIsDetailsVisible(!isDetailsVisible);
  // };
  return (
    <>
      <Col className="contact_container">
        <div className="contact-details">
          <div
            className="contact-details__header"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <div onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
              ←
            </div>
            <div>Contact Details</div>
          </div>

          <div className="contact-details__content">
            {/* contact Information Section */}
            <div className="contact-details__section">
              <h3 className="contact-details__section-title">
                Contact Information
              </h3>
              <div className="contact-details__grid">
                <div className="contact-details__column">
                  <div className="contact-field">
                    <label className="contact-field__label">
                      Contact Owner
                    </label>
                    <div className="contact-field__value">
                      {contactData.contactOwner}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Account Name</label>
                    <div className="contact-field__value">
                      {contactData?.account_name}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Email</label>
                    <div className="contact-field__value contact-field__value--phone">
                      {contactData.email}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Phone</label>
                    <div className="contact-field__value contact-field__value--phone">
                      {contactData.phone}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Other Phone</label>
                    <div className="contact-field__value">
                      {contactData.other_phone}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Mobile</label>
                    <div className="contact-field__value">
                      {contactData.mobile}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Assitant</label>
                    <div className="contact-field__value">
                      {contactData.assistant}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Created By</label>
                    <div className="contact-field__value">
                      <div>{contactData.createdBy}</div>
                      <div className="contact-field__date">
                        {dayjs(contactData.createdDate).format(
                          "DD-MM-YYYY HH:mm"
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="contact-field">
                    <label className="contact-field__label">Modified By</label>
                    <div className="contact-field__value">
                      <div>{contactData.modifiedBy}</div>
                      <div className="contact-field__date">
                        {dayjs(contactData.modifiedDate).format(
                          "DD-MM-YYYY HH:mm"
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="contact-details__column">
                  <div className="contact-field">
                    <label className="contact-field__label">Lead Source</label>
                    <div className="contact-field__value">
                      {contactData.lead_source}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Contact Name</label>
                    <div className="contact-field__value">
                      {contactData.contactName}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Title</label>
                    <div className="contact-field__value contact-field__value--email">
                      {contactData.title}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Department</label>
                    <div className="contact-field__value">
                      {contactData.department}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Home Phone</label>
                    <div className="contact-field__value contact-field__value--link">
                      {contactData.home_phone}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Fax</label>
                    <div className="contact-field__value">
                      {contactData.fax}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">
                      Date of Birth
                    </label>
                    <div className="contact-field__value">
                      {contactData.date_of_birth}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">
                      Email Opt Out
                    </label>
                    <Checkbox checked={contactData.emailOptOut}></Checkbox>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Skype ID</label>
                    <div className="contact-field__value contact-field__value--skype">
                      {contactData.skypeId}
                      <span className="skype-icon">📞</span>
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">
                      Secondary Email
                    </label>
                    <div className="contact-field__value">
                      {contactData.secondaryEmail}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Twitter</label>
                    <div className="contact-field__value contact-field__value--twitter">
                      {contactData.twitter}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Reporting to</label>
                    <div className="contact-field__value contact-field__value--twitter">
                      {contactData.reporting_to}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="contact-details__section">
              <h3 className="contact-details__section-title">
                Address Information
              </h3>
              <div className="contact-details__grid">
                <div className="contact-details__column">
                  <div className="contact-field">
                    <label className="contact-field__label">
                      Mailing Street
                    </label>
                    <div className="contact-field__value">
                      {contactData.mailing_street}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Mailing City</label>
                    <div className="contact-field__value">
                      {contactData.mailing_city}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">
                      Mailing State
                    </label>
                    <div className="contact-field__value">
                      {contactData.mailing_state}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Mailing Zip</label>
                    <div className="contact-field__value">
                      {contactData.mailing_zip_code}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">
                      {" "}
                      Mailing Country
                    </label>
                    <div className="contact-field__value">
                      {contactData.mailing_country}
                    </div>
                  </div>
                </div>
                <div className="contact-details__column">
                  <div className="contact-field">
                    <label className="contact-field__label">Other Street</label>
                    <div className="contact-field__value">
                      {contactData.other_street}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Other City</label>
                    <div className="contact-field__value">
                      {contactData.other_city}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Other State</label>
                    <div className="contact-field__value">
                      {contactData.other_state}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Other Zip</label>
                    <div className="contact-field__value">
                      {contactData.other_zip_code}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">
                      Other Country
                    </label>
                    <div className="contact-field__value">
                      {contactData.other_country}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Information Section */}
            <div className="contact-details__section">
              <h3 className="contact-details__section-title">
                Description Information
              </h3>
              <div className="contact-field">
                <label className="contact-field__label">Description</label>
                <div className="contact-field__value">
                  {contactData.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default ContactDetailsPresentational;

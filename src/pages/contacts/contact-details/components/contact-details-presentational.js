import React, { useEffect, useState } from "react";
import { Col, Modal, Button, Select, Tabs } from "antd";
import "../styles.scss";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_IP } from "assets/Config";
import { getApi } from "redux/sagas/getApiDataSaga";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { PhoneOutlined } from "@ant-design/icons";
import {
  Clock,
  Mic,
  MicOff,
  Phone,
  PhoneCall,
  PhoneOff,
  Radio,
  Square,
} from "lucide-react";
import { useTwilioVoice } from "hooks/useTwilioVoice";
import { postApi } from "redux/sagas/postApiDataSaga";

const displayValue = (value) =>
  value && String(value).trim() !== "" ? value : "-";
const formatDate = (value) =>
  value ? dayjs(value).format("DD-MM-YYYY HH:mm") : "-";

const ContactDetailsPresentational = () => {
  const { contactId } = useParams();
  const contactRedux = useSelector((state) => state.contactRedux);
  const userRedux = useSelector((state) => state.userRedux);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [assignDropdownValue, setAssignDropdownValue] = useState([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    device,
    callState,
    identity,
    initializeDevice,
    makeCall,
    answerCall,
    rejectCall,
    hangUp,
    toggleMute,
    sendDigit,
    startRecording,
    stopRecording,
  } = useTwilioVoice();

  useEffect(() => {
    const user = userRedux?.userDetails?.message;
    if (user.length > 0) {
      const value = user?.map((item) => ({
        label: item?.display_name,
        value: item?.id,
        image_url: item?.image_url,
        employee_id: item?.employee_id,
        job_title: item?.job_title,
        department: item?.department,
      }));
      setAssignDropdownValue(value);
    }
  }, [userRedux?.userDetails]);

  console.log(
    "userRedux?.userDetails?.message",
    userRedux?.userDetails?.message
  );

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    initializeDevice("Roshan");
  }, [initializeDevice]);

  useEffect(() => {
    if (device) {
      setIsRegistered(true);
    }
  }, [device]);

  const handleCall = async (number) => {
    if (!number) return;
    if (!isRegistered) {
      console.error("Device not registered yet");
      return;
    }

    await makeCall(`${number}`);
  };

  const handleEndCall = async () => {
    await hangUp();
  };
  useEffect(() => {
    if (contactId) {
      const url = `${SERVER_IP}contact/${contactId}`;
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
    modifiedBy: contactRedux?.contactData?.updated_by_name,
    modifiedDate: contactRedux?.contactData?.updatedAt,
    lead_source: contactRedux?.contactData?.lead_source,
    contactName: `${contactRedux?.contactData?.first_name || ""} ${
      contactRedux?.contactData?.last_name || ""
    }`.trim(),
    email: contactRedux?.contactData?.email,
    title: contactRedux?.contactData?.title,
    department: contactRedux?.contactData?.department,
    fax: contactRedux?.contactData?.fax,
    home_phone: contactRedux?.contactData?.home_phone,
    date_of_birth: contactRedux?.contactData?.date_of_birth,
    emailOptOut: contactRedux?.contactData?.email_opt_out,
    createdBy: contactRedux?.contactData?.created_by_name,
    createdDate: contactRedux?.contactData?.createdAt,
    linkedIn_profile: contactRedux?.contactData?.linkedin_profile,
    secondaryEmail: contactRedux?.contactData?.secondary_email,
    time_zone: contactRedux?.contactData?.time_zone,
    Status: contactRedux?.contactData?.Status,
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

  const getUserName = (id) => {
    const user = userRedux?.userDetails?.message;
    const value = user?.find((item) => item?.id === id);
    return value;
  };

  const handleAssign = () => {
    if (!selectedUser) return;
    console.log("selectedUser", selectedUser);
    const contactId = contactRedux?.contactData?.id;
    const payload = {
      followed_by_id: selectedUser,
      followed_by_name: getUserName(selectedUser)?.display_name,
      contact_ids: [String(contactId)],
    };

    const url = `${SERVER_IP}contact/assign-contact`;
    dispatch(postApi(payload, "ASSIGN_CONTACT", url));
    setAssignModalOpen(false);
  };

  return (
    <Col className="contact_container">
      <div className="contact-details">
        <div
          className="contact-details__header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
              ←
            </div>
            <div>Contact Details</div>
          </div>
          <Button type="primary" onClick={() => setAssignModalOpen(true)}>
            Assign Contact
          </Button>
        </div>

        <div className="contact-details__content">
          {/* Contact Information Section */}
          <div className="contact-details__section">
            <h3 className="contact-details__section-title">
              Contact Information
            </h3>
            <div className="contact-details__grid">
              <div className="contact-details__column">
                <div className="contact-field">
                  <label className="contact-field__label">Contact Owner</label>
                  <div className="contact-field__value">
                    {displayValue(contactData.contactOwner)}
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">Account Name</label>
                  <div className="contact-field__value">
                    {displayValue(contactData.account_name)}
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">Email</label>
                  <div className="contact-field__value contact-field__value--phone">
                    {displayValue(contactData.email)}
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">Phone</label>
                  <div className="contact-field__value contact-field__value--phone">
                    {displayValue(contactData.phone)}
                    <Phone
                      style={{
                        width: "20px",
                        marginLeft: 8,
                        fontSize: 16,
                        color: "#1890ff",
                        cursor: "pointer",
                      }}
                      onClick={() => handleCall(contactData.phone)}
                    />
                  </div>
                </div>

                <div className="contact-field">
                  <label className="contact-field__label">Mobile</label>
                  <div className="contact-field__value">
                    {displayValue(contactData.mobile)}
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">Created By</label>
                  <div className="contact-field__value">
                    <div>{displayValue(contactData.createdBy)}</div>
                    <div className="contact-field__date">
                      {formatDate(contactData.createdDate)}
                    </div>
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">Modified By</label>
                  <div className="contact-field__value">
                    <div>{displayValue(contactData.modifiedBy)}</div>
                    <div className="contact-field__date">
                      {formatDate(contactData.modifiedDate)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-details__column">
                <div className="contact-field">
                  <label className="contact-field__label">Contact Name</label>
                  <div className="contact-field__value">
                    {displayValue(contactData.contactName)}
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">Title</label>
                  <div className="contact-field__value">
                    {displayValue(contactData.title)}
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">Department</label>
                  <div className="contact-field__value">
                    {displayValue(contactData.department)}
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">
                    LinkedIn Profile
                  </label>
                  <div className="contact-field__value contact-field__value--skype">
                    {displayValue(contactData.linkedIn_profile)}
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">
                    Secondary Email
                  </label>
                  <div className="contact-field__value">
                    {displayValue(contactData.secondaryEmail)}
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">Time Zone</label>
                  <div className="contact-field__value">
                    {displayValue(contactData.time_zone)}
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">Status</label>
                  <div className="contact-field__value">
                    {displayValue(contactData.Status)}
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
                  <label className="contact-field__label">Mailing Street</label>
                  <div className="contact-field__value">
                    {displayValue(contactData.mailing_street)}
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">Mailing City</label>
                  <div className="contact-field__value">
                    {displayValue(contactData.mailing_city)}
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">Mailing State</label>
                  <div className="contact-field__value">
                    {displayValue(contactData.mailing_state)}
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">Mailing Zip</label>
                  <div className="contact-field__value">
                    {displayValue(contactData.mailing_zip_code)}
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">
                    Mailing Country
                  </label>
                  <div className="contact-field__value">
                    {displayValue(contactData.mailing_country)}
                  </div>
                </div>
              </div>
              <div className="contact-details__column">
                <div className="contact-field">
                  <label className="contact-field__label">Other Street</label>
                  <div className="contact-field__value">
                    {displayValue(contactData.other_street)}
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">Other City</label>
                  <div className="contact-field__value">
                    {displayValue(contactData.other_city)}
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">Other State</label>
                  <div className="contact-field__value">
                    {displayValue(contactData.other_state)}
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">Other Zip</label>
                  <div className="contact-field__value">
                    {displayValue(contactData.other_zip_code)}
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">Other Country</label>
                  <div className="contact-field__value">
                    {displayValue(contactData.other_country)}
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
                {displayValue(contactData.description)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Modal */}
      <Modal open={callState.isConnected} footer={null} closable={false}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div
            style={{
              width: "5rem",
              height: "5rem",
              backgroundImage:
                "linear-gradient(to bottom right, #4ade80, #3b82f6)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "1rem",
            }}
          >
            <PhoneCall
              style={{
                width: "2.5rem",
                height: "2.5rem",
                color: "white",
              }}
            />
          </div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "0.5rem",
            }}
          >
            Call Active
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#4b5563",
              marginBottom: "0.5rem",
            }}
          >
            <Clock
              style={{
                width: "1rem",
                height: "1rem",
                marginRight: "0.25rem",
              }}
            />
            <span>{formatDuration(callState.callDuration)}</span>
          </div>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
            }}
          >{`${contactData?.phone}`}</p>
        </div>

        <div className="call-controls">
          <button
            onClick={toggleMute}
            className={`control-btn ${callState.isMuted ? "active-red" : ""}`}
          >
            {callState.isMuted ? <MicOff /> : <Mic />}
          </button>

          <button
            onClick={callState.isRecording ? stopRecording : startRecording}
            className={`control-btn ${
              callState.isRecording ? "active-red pulse" : ""
            }`}
          >
            {callState.isRecording ? <Square /> : <Radio />}
          </button>

          <button
            onClick={() => setShowKeypad(!showKeypad)}
            className="control-btn"
          >
            #
          </button>

          <button onClick={handleEndCall} className="control-btn active-red">
            <PhoneOff />
          </button>
        </div>

        {/* {showKeypad && (
          <div className="modal-keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((num) => (
              <button
                key={num}
                onClick={() => handleKeypadPress(num)}
                className="modal-keypad-btn"
              >
                {num}
              </button>
            ))}
          </div>
        )} */}
      </Modal>
      <Modal
        title="Assign Contact"
        open={assignModalOpen}
        onCancel={() => setAssignModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setAssignModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="assign"
            type="primary"
            onClick={handleAssign}
            disabled={!selectedUser}
          >
            Assign
          </Button>,
        ]}
      >
        <p>Select a user to assign this contact:</p>
        <Select
          style={{ width: "100%" }}
          placeholder="Select user"
          value={selectedUser}
          onChange={(val) => setSelectedUser(val)}
          showSearch
          optionLabelProp="label"  
        >
          {assignDropdownValue.map((user) => (
            <Select.Option key={user.value} label={user.label} value={user.value}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {/* Avatar Circle with initials */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  {user.label
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>

                {/* User Info */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>
                    {user.label}
                  </span>
                  <span style={{ fontSize: 12, color: "#555" }}>
                    {user.email}
                  </span>
                  <span style={{ fontSize: 12, color: "#888" }}>
                    {user.job_title} ({user.department})
                  </span>
                </div>
              </div>
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </Col>
  );
};

export default ContactDetailsPresentational;

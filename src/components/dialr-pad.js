import React, { useEffect, useState } from "react";
import { Button, Select, Tabs, Modal, Input } from "antd";
import {
  Clock,
  DeleteIcon,
  Mic,
  MicOff,
  PhoneCall,
  PhoneCallIcon,
  PhoneOff,
  Radio,
  RemoveFormattingIcon,
  Square,
} from "lucide-react";
import "./DialPadComponent.scss"; // Import SCSS
import { useTwilioVoice } from "hooks/useTwilioVoice";

const { Option } = Select;

const DialPadComponent = () => {
  const [showDialPad, setShowDialPad] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [dialNumber, setDialNumber] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

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

  const [showKeypad, setShowKeypad] = useState(false);

  const handleKeypadPress = (value) => {
    setDialNumber((prev) => prev + value);
  };

  const handleDelete = () => {
    setDialNumber((prev) => prev.slice(0, -1));
  };

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

  const handleCall = async () => {
    if (!dialNumber) return;
    if (!isRegistered) {
      console.error("Device not registered yet");
      return;
    }
    setShowDialPad(false);
    await makeCall(`${dialNumber}`);
  };

  const handleEndCall = async () => {
    await hangUp();
  };

  const handleDial = () => {
    setShowDialPad(!showDialPad);
    setCountryCode("+91");
    setDialNumber("");
  };

  return (
    <>
      <Button
        type="primary"
        shape="circle"
        size="large"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 2000,
        }}
        onClick={() => handleDial()}
        icon={<PhoneCallIcon />}
      ></Button>
      {showDialPad && (
        <div className="dialpad-popup">
          <div className="number-input">
            <div className="dial-display">
              <input
                type="text"
                value={dialNumber}
                readOnly
                className="dial-input"
              />
            </div>
            <div onClick={handleDelete} style={{ cursor: "pointer" }}>
              <DeleteIcon />
            </div>
          </div>

          <div className="keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#", "+"].map((num) => (
              <Button
                key={num}
                shape="circle"
                size="large"
                className="keypad-btn"
                onClick={() => handleKeypadPress(num)}
              >
                {num}
              </Button>
            ))}
          </div>

          <div className="call-btn-container">
            <Button
              type="primary"
              shape="round"
              size="large"
              className="call-btn"
              onClick={handleCall}
              disabled={!dialNumber || !isRegistered}
            >
              CALL
            </Button>
          </div>
        </div>
      )}

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
          >{`${dialNumber}`}</p>
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

        {showKeypad && (
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
        )}
      </Modal>
    </>
  );
};

export default DialPadComponent;

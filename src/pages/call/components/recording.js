import React from "react";
import "./styles.scss";
import { Download, FileText, Loader, Pause, Play, Radio } from "lucide-react";
import { Select } from "antd";
import { useSelector } from "react-redux";

const { Option } = Select;

function Recordings({
  recordings,
  playingRecording,
  transcriptions,
  handlePlayRecording,
  usersValue,
  handleSelectUser,
  selectedUser
}) {
  const User = useSelector((state) => state.loginRedux);
  return (
    <div className="recordings-container">
      <div className="dropdown-input">
        {User?.role !== "employee" && (
          <Select
            placeholder="Select user "
            onChange={(e) => handleSelectUser(e)}
            className="dropdown-input-value"
            allowClear
            value={selectedUser}
          >
            {usersValue?.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.display_name}
              </Option>
            ))}
          </Select>
        )}
      </div>
      {recordings.length === 0 ? (
        <div className="empty-recordings">
          <Radio className="empty-icon" />
          <p>No recordings yet</p>
        </div>
      ) : (
        recordings.map((recording) => (
          <div key={recording.recordingSid} className="recording-card">
            <div className="recording-header">
              <div className="recording-info">
                <h3>{recording?.employeeName}</h3>
                <p className="meta">
                  Duration: {recording.recordingDuration}s • Status:{" "}
                  {recording.recordingStatus}
                </p>
                <p className="date">
                  {new Date(recording.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="recording-actions">
                <button
                  onClick={() => handlePlayRecording(recording)}
                  className={`action-btn play-btn ${
                    playingRecording === recording.recordingSid ? "playing" : ""
                  }`}
                  title="Play recording"
                >
                  {playingRecording === recording.recordingSid ? (
                    <Pause className="icon" />
                  ) : (
                    <Play className="icon" />
                  )}
                </button>

                {/* <button
                  //   onClick={() => handleTranscribeRecording(recording)}
                  disabled={transcribingRecordings.has(recording.sid)}
                  className={`action-btn transcribe-btn ${
                    transcriptions[recording.sid]
                      ? "done"
                      : transcribingRecordings.has(recording.sid)
                      ? "loading"
                      : ""
                  }`}
                  title={
                    transcriptions[recording.sid]
                      ? "View transcription"
                      : transcribingRecordings.has(recording.sid)
                      ? "Transcribing..."
                      : "Transcribe with Whisper AI"
                  }
                >
                  {transcribingRecordings.has(recording.sid) ? (
                    <Loader className="icon spin" />
                  ) : (
                    <FileText className="icon" />
                  )}
                </button> */}

                {/* <button
                  //   onClick={() => handleDownloadRecording(recording)}
                  className="action-btn download-btn"
                  title="Download recording"
                >
                  <Download className="icon" />
                </button> */}
              </div>
            </div>

            {/* Transcription Display */}
            {/* {transcriptions[recording.sid] && (
              <div className="transcription-box">
                <div className="transcription-header">
                  <FileText className="icon text" />
                  <span>Transcription</span>
                </div>
                <p>{transcriptions[recording.sid]}</p>
              </div>
            )} */}
          </div>
        ))
      )}
    </div>
  );
}

export default Recordings;

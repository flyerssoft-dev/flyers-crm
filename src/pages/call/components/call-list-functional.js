import React, { useEffect, useState } from "react";
import CallListPresentional from "./call-list-presentational";
import { SERVER_IP } from "assets/Config";
import { getApi } from "redux/sagas/getApiDataSaga";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function CallListFunctional() {
  const dispatch = useDispatch();
  const callRedux = useSelector((state) => state.callRedux);
  const [callHistory, setCallHistory] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [activeTab, setActiveTab] = useState("recordings");
  const [playingRecording, setPlayingRecording] = useState(false);
  const [audioElements, setAudioElements] = useState({});
  const [transcriptions, setTranscriptions] = useState({});

  const getRecordings = () => {
    const url = `${SERVER_IP}call/recordings`;
    dispatch(getApi("GET_CALL_RECORDINGS", url));
  };

  const getCallHistory = () => {
    const url = `${SERVER_IP}call/history`;
    dispatch(getApi("GET_CALL_HISTORY", url));
  };

  useEffect(() => {
    getRecordings();
    getCallHistory();
  }, []);

  useEffect(() => {
    if (callRedux?.call_recordings) {
      setRecordings(callRedux?.call_recordings);
    }
  }, [callRedux?.call_recordings]);

  useEffect(() => {
    if (callRedux?.call_history) {
      setCallHistory(callRedux?.call_history);
    }
  }, [callRedux?.call_history]);

  const handlePlayRecording = (recording) => {
    const audioKey = recording.sid;

    // If already playing this recording, pause it
    if (playingRecording === audioKey) {
      if (audioElements[audioKey]) {
        audioElements[audioKey].pause();
        setPlayingRecording(null);
      }
      return;
    }

    // Stop any currently playing recording
    if (playingRecording && audioElements[playingRecording]) {
      audioElements[playingRecording].pause();
    }

    // Create new audio element if it doesn't exist
    if (!audioElements[audioKey]) {
      const audio = new Audio();
      audio.src = `http://localhost:3002/api/recordings/${recording.sid}/download`;
      audio.preload = "metadata";

      audio.addEventListener("ended", () => {
        setPlayingRecording(null);
      });

      audio.addEventListener("error", (e) => {
        console.error("Audio playback error:", e);
        setPlayingRecording(null);
        alert("Failed to play recording. The audio file may not be ready yet.");
      });

      setAudioElements((prev) => ({
        ...prev,
        [audioKey]: audio,
      }));

      // Play the audio
      audio
        .play()
        .then(() => {
          setPlayingRecording(audioKey);
        })
        .catch((error) => {
          console.error("Failed to play audio:", error);
          alert("Failed to play recording. Please try again.");
        });
    } else {
      // Play existing audio element
      audioElements[audioKey].currentTime = 0;
      audioElements[audioKey]
        .play()
        .then(() => {
          setPlayingRecording(audioKey);
        })
        .catch((error) => {
          console.error("Failed to play audio:", error);
          alert("Failed to play recording. Please try again.");
        });
    }
  };

  // Cleanup audio elements when component unmounts
  useEffect(() => {
    return () => {
      Object.values(audioElements).forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
    };
  }, [audioElements]);

  return (
    <CallListPresentional
      {...{
        activeTab,
        setActiveTab,
        recordings,
        playingRecording,
        transcriptions,
        handlePlayRecording,
        callHistory
      }}
    />
  );
}

export default CallListFunctional;

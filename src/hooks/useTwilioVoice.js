import { useState, useEffect, useCallback } from "react";
import { Device } from "@twilio/voice-sdk";
import { SERVER_IP } from "assets/Config";
import { store } from './../redux/store';

export const useTwilioVoice = () => {
  const [device, setDevice] = useState(null);
  const [callState, setCallState] = useState({
    isConnected: false,
    isConnecting: false,
    isMuted: false,
    isOnHold: false,
    isRecording: false,
    currentCall: null,
    incomingCall: null,
    callDuration: 0,
    callStatus: "idle",
    recordingSid: null,
  });

  const [identity, setIdentity] = useState("");

  // Initialize device with token
  const initializeDevice = useCallback(async (userIdentity) => {
    try {
      const response = await fetch(`${SERVER_IP}call/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.getState().loginRedux.accessToken}`,
        },
        body: JSON.stringify({ identity: userIdentity }),
      });

      const { token } = await response.json();

      const newDevice = new Device(token, {
        logLevel: 1,
        codecPreferences: ["opus", "pcmu"],
      });

      // Device event listeners
      newDevice.on("ready", () => {
        console.log("Twilio Device Ready");
        setIdentity(userIdentity);
      });

      newDevice.on("error", (error) => {
        console.error("Twilio Device Error:", error);
      });

      newDevice.on("incoming", (call) => {
        console.log("Incoming call:", call);
        setCallState((prev) => ({
          ...prev,
          incomingCall: call,
          callStatus: "ringing",
        }));

        // Set up call event listeners
        setupCallEventListeners(call);
      });

      newDevice.on("tokenWillExpire", async () => {
        const response = await fetch(`${SERVER_IP}call/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json",	Authorization:`Bearer ${store.getState().loginRedux.accessToken}`, },
          body: JSON.stringify({ identity: userIdentity }),
        });

        const { token } = await response.json();
        newDevice.updateToken(token);
      });

      await newDevice.register();
      setDevice(newDevice);

      console.log("newDevice", newDevice);
    } catch (error) {
      console.error("Failed to initialize device:", error);
    }
  }, []);

  // Setup call event listeners
  const setupCallEventListeners = useCallback((call) => {
    call.on("accept", () => {
      console.log("Call accepted");
      setCallState((prev) => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        currentCall: call,
        callStatus: "connected",
      }));
    });

    call.on("disconnect", () => {
      console.log("Call disconnected");
      setCallState((prev) => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        currentCall: null,
        incomingCall: null,
        isRecording: false,
        recordingSid: undefined,
        callDuration: 0,
        callStatus: "idle",
      }));
    });

    call.on("cancel", () => {
      console.log("Call cancelled");
      setCallState((prev) => ({
        ...prev,
        incomingCall: null,
        isRecording: false,
        recordingSid: undefined,
        callStatus: "idle",
      }));
    });

    call.on("reject", () => {
      console.log("Call rejected");
      setCallState((prev) => ({
        ...prev,
        incomingCall: null,
        isRecording: false,
        recordingSid: undefined,
        callStatus: "idle",
      }));
    });
  }, []);

  // Make outbound call
  const makeCall = useCallback(
    async (phoneNumber) => {
      console.log("ff", phoneNumber);
      if (!device || !phoneNumber) return;

      try {
        setCallState((prev) => ({
          ...prev,
          isConnecting: true,
          callStatus: "connecting",
        }));

        const call = await device.connect({
          params: { To: phoneNumber },
        });

        setupCallEventListeners(call);
      } catch (error) {
        console.error("Failed to make call:", error);
        setCallState((prev) => ({
          ...prev,
          isConnecting: false,
          isRecording: false,
          recordingSid: undefined,
          callStatus: "idle",
        }));
      }
    },
    [device, setupCallEventListeners]
  );

  // Answer incoming call
  const answerCall = useCallback(() => {
    if (callState.incomingCall) {
      callState.incomingCall.accept();
    }
  }, [callState.incomingCall]);

  // Reject incoming call
  const rejectCall = useCallback(() => {
    if (callState.incomingCall) {
      callState.incomingCall.reject();
    }
  }, [callState.incomingCall]);

  // Hang up current call
  const hangUp = useCallback(() => {
    if (callState.currentCall) {
      callState.currentCall.disconnect();
    }
  }, [callState.currentCall]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (callState.currentCall) {
      const newMuteState = !callState.isMuted;
      callState.currentCall.mute(newMuteState);
      setCallState((prev) => ({
        ...prev,
        isMuted: newMuteState,
      }));
    }
  }, [callState.currentCall, callState.isMuted]);

  // Send DTMF tones
  const sendDigit = useCallback(
    (digit) => {
      if (callState.currentCall) {
        callState.currentCall.sendDigits(digit);
      }
    },
    [callState.currentCall]
  );

  // Start recording
  const startRecording = useCallback(async () => {
    if (!callState.currentCall) return;

    try {
      const response = await fetch(
        `http://localhost:3002/api/calls/${callState.currentCall.parameters.CallSid}/record`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const { recordingSid } = await response.json();

      setCallState((prev) => ({
        ...prev,
        isRecording: true,
        recordingSid,
      }));
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  }, [callState.currentCall]);

  // Stop recording
  const stopRecording = useCallback(async () => {
    if (!callState.currentCall || !callState.recordingSid) return;

    try {
      await fetch(
        `http://localhost:3002/api/calls/${callState.currentCall.parameters.CallSid}/record/stop`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recordingSid: callState.recordingSid }),
        }
      );

      setCallState((prev) => ({
        ...prev,
        isRecording: false,
        recordingSid: undefined,
      }));
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  }, [callState.currentCall, callState.recordingSid]);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (callState.isConnected) {
      interval = setInterval(() => {
        setCallState((prev) => ({
          ...prev,
          callDuration: prev.callDuration + 1,
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState.isConnected]);

  return {
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
  };
};

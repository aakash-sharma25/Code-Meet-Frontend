import React, { useRef, useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import SimplePeer from "simple-peer";
import { PreferenceContext } from "../context/PreferenceContext";

const VideoCall = ({ socketRef, roomId }) => {
  const localVideoRef = useRef(null); // Local video DOM element
  const remoteVideoRef = useRef(null); // Remote video DOM element
  const peerRef = useRef(null); // WebRTC Peer instance
  const [stream, setStream] = useState(null); // Local media stream
  const [isCallStarted, setIsCallStarted] = useState(false);

  const { isCall, setIsCall ,remoteUser } = useContext(PreferenceContext);

  useEffect(() => {
    if (!socketRef.current) {
      console.error("Socket reference is not initialized.");
      return;
    }

    // Join the room for signaling
    console.log(isCallStarted)
    socketRef.current.emit("join-room", { roomId });

    // Handle incoming WebRTC signaling data
    socketRef.current.on("offer", ({ signal }) => {
      console.log("Received offer");
      handleIncomingOffer(signal);
    });

    socketRef.current.on("answer", ({ signal }) => {
      console.log("Received answer");
      peerRef.current?.signal(signal);
    });

    socketRef.current.on("ice-candidate", (candidate) => {
      console.log("Received ICE candidate");
      if (peerRef.current) {
        peerRef.current.signal(candidate);
      }
    });

    return () => {
      // Clean up listeners
      socketRef.current?.off("offer");
      socketRef.current?.off("answer");
      // eslint-disable-next-line react-hooks/exhaustive-deps
      socketRef.current?.off("ice-candidate");
      setIsCall(false);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef, roomId]);

  const initializeMediaStream = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(userStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = userStream;
      }
      return userStream;
    } catch (err) {
      console.error("Failed to access camera and microphone:", err);
      alert("Please allow access to your camera and microphone.");
    }
  };

  const handleStartCall = async () => {
    if (!socketRef.current) {
      toast.error("Socket reference is not initialized.");
      return;
    }

    setIsCallStarted(true);
    setIsCall(true);

    const userStream = await initializeMediaStream();

    // Create a new SimplePeer instance as the initiator
    peerRef.current = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: userStream,
    });

    // Handle signaling data
    peerRef.current.on("signal", (signal) => {
      console.log("Sending offer signal");
      socketRef.current.emit("offer", { roomId, signal });
    });

    // Handle remote stream
    peerRef.current.on("stream", (remoteStream) => {
      console.log("Received remote stream");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    peerRef.current.on("error", (err) => {
      console.error("Peer connection error:", err);
    });
  };

  const handleIncomingOffer = async (offerSignal) => {
    if (!socketRef.current) {
      console.error("Socket reference is not initialized.");
      return;
    }

    const userStream = await initializeMediaStream();

    // Create a new SimplePeer instance as a responder
    peerRef.current = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: userStream,
    });

    // Respond to the incoming offer
    peerRef.current.signal(offerSignal);

    // Send an answer back to the caller
    peerRef.current.on("signal", (signal) => {
      console.log("Sending answer signal");
      socketRef.current.emit("answer", { roomId, signal });
    });

    // Handle remote stream
    peerRef.current.on("stream", (remoteStream) => {
      console.log("Received remote stream");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    peerRef.current.on("error", (err) => {
      console.error("Peer connection error:", err);
    });
  };

  return (
    <div>
      {/* <h2>Video Call</h2> */}
      <div
        className={` position-absolute d-flex flex-column ${
          !isCall && "d-none"
        }`}
        style={isCall ? { top: "200px", left: "20px" } : {}}
      >
        <div className="">
          {/* <h3>Local Video</h3> */}
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "200px" }}
          />
        </div>
        <div>
          <h3>{remoteUser} </h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: "300px" }}
          />
        </div>
      </div>
      {!isCall && (
        <button
          onClick={handleStartCall}
          className="btn btn-primary m-3"
          style={{
            marginTop: "20px",
            position: "fixed",
            bottom: "0px",
            left: "20%",
          }}
        >
          Start Call
        </button>
      )}
    </div>
  );
};

export default VideoCall;

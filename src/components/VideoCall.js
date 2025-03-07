import React, { useRef, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const VideoCall = () => {
  const connectionRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [myConnectionId, setMyConnectionId] = useState(null);
  const [remoteConnectionId, setRemoteConnectionId] = useState("");

  const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  useEffect(() => {
    if (
      connectionRef.current &&
      connectionRef.current.state === signalR.HubConnectionState.Connected
    ) {
      console.warn("SignalR connection already exists. Skipping setup.");
      return;
    }

    const SIGNALING_URL = process.env.REACT_APP_SIGNALING_SERVICE_URL;
    console.log("Connecting to Signaling Server at:", SIGNALING_URL);

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${SIGNALING_URL}/signalinghub`, {
        skipNegotiation: true, 
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = newConnection;

    newConnection.start()
      .then(() => {
        console.log("SignalR Connected Successfully");
        return newConnection.invoke("GetConnectionId");
      })
      .then(connectionId => {
        console.log("My Connection ID:", connectionId);
        setMyConnectionId(connectionId);
      })
      .catch(err => {
        console.error("SignalR Connection Error:", err);
        connectionRef.current = null;
      });

    newConnection.onclose(() => console.warn("SignalR Connection Closed"));
    newConnection.onreconnecting(() => console.log("Reconnecting to SignalR..."));
    newConnection.onreconnected(() => console.log("Reconnected to SignalR"));

    newConnection.on("ReceiveSignal", async (senderConnectionId, data) => {
      console.log(`Received Signal from ${senderConnectionId}:`, data);
      const signal = JSON.parse(data);

      if (!peerConnectionRef.current) {
        console.warn("PeerConnection is null. Initializing now...");
        await startLocalVideo();
      }

      if (signal.type === "offer") {
        console.log("Received Offer. Setting remote description...");
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        connectionRef.current.invoke("SendSignal", senderConnectionId, JSON.stringify(answer));
      } else if (signal.type === "answer") {
        console.log("Received Answer. Setting remote description...");
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
      }
    });

    newConnection.on("ReceiveIceCandidate", async (senderConnectionId, candidate) => {
      console.log(`Received ICE Candidate from ${senderConnectionId}:`, candidate);
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
      }
    });

    return () => {
      if (
        connectionRef.current &&
        connectionRef.current.state === signalR.HubConnectionState.Connected
      ) {
        console.log("Cleaning up: Stopping SignalR Connection...");
        connectionRef.current.stop()
          .then(() => {
            console.log("SignalR Connection Stopped Successfully");
            connectionRef.current = null;
          })
          .catch(err => console.error("Error stopping SignalR:", err));
      } else {
        console.warn("Cleanup skipped: SignalR was not fully connected.");
      }
    };
  }, []); 

  const startLocalVideo = async () => {
    try {
      if (peerConnectionRef.current) {
        console.warn("Local video already started!");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      setupPeerConnection(stream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const setupPeerConnection = (stream) => {
    console.log("Setting up Peer Connection...");
    if (peerConnectionRef.current) {
      console.warn("peerConnection already exists. Skipping setup.");
      return;
    }

    const pc = new RTCPeerConnection(servers);
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.onicecandidate = event => {
      if (event.candidate && connectionRef.current && remoteConnectionId) {
        console.log(`Sending ICE Candidate to ${remoteConnectionId}`);
        connectionRef.current.invoke("SendIceCandidate", remoteConnectionId, JSON.stringify(event.candidate));
      }
    };

    pc.ontrack = event => {
      console.log("Remote stream received");
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnectionRef.current = pc;
  };

  const makeCall = async () => {
    if (!peerConnectionRef.current || !connectionRef.current || !remoteConnectionId) {
      alert("Enter remote connection ID before calling.");
      return;
    }

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    
    console.log(`Sending Offer to ${remoteConnectionId}`);
    connectionRef.current.invoke("SendSignal", remoteConnectionId, JSON.stringify(offer));
  };

  return (
    <div>
      <h2>WebRTC Video Call</h2>
      <p><strong>My Connection ID:</strong> {myConnectionId}</p>
      <input 
        type="text" 
        placeholder="Enter remote connection ID" 
        value={remoteConnectionId} 
        onChange={(e) => setRemoteConnectionId(e.target.value)} 
      />
      <div>
        <video ref={localVideoRef} autoPlay playsInline style={{ width: "300px" }} />
        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "300px" }} />
      </div>
      <button onClick={startLocalVideo}>Start Camera</button>
      <button onClick={makeCall}>Call</button>
    </div>
  );
};

export default VideoCall;
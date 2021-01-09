import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column; 
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`; 

const Video = styled.video`
  border: 1px solid blue;
  width: 50%;
  // height: 50%;
`;

function Chat() {
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [msgState, setMsgState] = useState('');
  const [chatMsgs, setchatMsgs] = useState([]);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io.connect("/");
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })

    socket.current.on("yourID", (id) => {
      setYourID(id);
    })
    socket.current.on("allUsers", (users) => {
      setUsers(users);
    })

    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    })

    // Chat message
    socket.current.on("newMsg", (newMessage) => {
      // console.log("New message: ", newMessage);
      setchatMsgs(oldmsg => [...oldmsg, newMessage]);
    });

    return () => {
      socket.current.disconnect();
      socket.current.off();
    }    

  }, []); 

  function callPeer(id) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {

        iceServers: [
            {
                urls: "stun:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            },
            {
                urls: "turn:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            }
        ]
    },
      stream: stream,
    });

    peer.on("signal", data => {
      socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })

  }  

  function acceptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.current.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <Video playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <Video playsInline ref={partnerVideo} autoPlay />
    );
  }

  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div>
        <h4 style={{color:"#000"}}>{caller} is calling you</h4>
        <button style={{display:'block', border:'none', outline:'none', padding:"10px 5px", borderRadius:"5px", margin:"5px 0", backgroundColor:"green", color:"#fff", cursor:"pointer" }} onClick={acceptCall}>Accept</button>
      </div>
    )
  }

  // Chat message
  function chatPeer(id) {
    const chatWrapper = document.getElementById("chatWrapper");
    chatWrapper.style.display = "flex";
    // const title = document.createTextNode(`Chatting with ${id}`)
    // document.getElementById("title").appendChild(title)
  }

  function handleSubmit(event){
    event.preventDefault();
    socket.current.emit("message", msgState);
    document.getElementById("input").value = "";
  }
  function handleChange(event){
    setMsgState(event.target.value)
  }
 

  return (
    <Container>
      <Row>
        {UserVideo}
        {PartnerVideo}
      </Row>
      <div id="chatWrapper" style={{ marginBottom:"20px", flexDirection:'column', display:'none', marginTop:"20px"}}>
        <div id="msgWrapper" style={{background: '#eee', width: '60%', margin: 'auto'}}>
          {chatMsgs.map(msg => {
            return <p style={{color:"#000"}}>{msg}</p>
          })}
          {/* <p style={{background: '#ccc', paddingLeft: '10px', marginLeft: '20px' }}>Hello in left</p>
          <p style={{textAlign: 'right', paddingRight: "10px", marginRight: '20px'}}>Hello in right</p> */}
        </div>
        <form style={{margin: "auto"}} id="form" onSubmit={handleSubmit}  >
          <input autoComplete="false" type='text' placeholder="Type a message" id="input" onChange={handleChange} style={{padding:"5px", fontSize:"16px", outline:'none', border:'none', borderRadius:"5px"}} />
          <input type="submit" value="Send" style={{padding:"5px", fontSize:"16px", outline:'none', border:'none', borderRadius:"5px", marginLeft:"10px", cursor:"pointer"}} />
        </form>        
      </div>
      <Row>
        {Object.keys(users).map(key => {
          if (key === yourID) {
            return null;
          }
          return (
            <div style={{marginRight: '10px'}}>
              <button style={{display:'block', border:'none', outline:'none', padding:"10px 5px", borderRadius:"5px", margin:"5px 0", backgroundColor:"green", color:"#fff", cursor:"pointer" }} onClick={() => callPeer(key)}>Call {key}</button>
              <button style={{display:'block', border:'none', outline:'none', padding:"10px 5px", borderRadius:"5px", margin:"5px 0", backgroundColor:"green", color:"#fff", cursor:"pointer" }} onClick={() => chatPeer(key)}>Chat With {key}</button>
            </div>
          );
        })}
      </Row>
      <Row>
        {incomingCall}
      </Row>
    </Container>
  );
}

export default Chat;

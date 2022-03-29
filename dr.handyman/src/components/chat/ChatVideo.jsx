import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import TextField from "@mui/material/TextField"
import AssignmentIcon from "@mui/icons-material/Assignment"
import PhoneIcon from "@mui/icons-material/Phone"
import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard"
import Peer from "simple-peer"
import io from "socket.io-client"

const socket = io.connect('https://localhost:4000/');
function ChatVideo({callerEmail}) {
	const [ me, setMe ] = useState("")
	const [ stream, setStream ] = useState()
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ caller, setCaller ] = useState("")
	const [ callerSignal, setCallerSignal ] = useState()
	const [ callAccepted, setCallAccepted ] = useState(false)
	const [ idToCall, setIdToCall ] = useState("")
	const [ callEnded, setCallEnded] = useState(false)
	const [ name, setName ] = useState("")
	const myVideo = useRef()
	const userVideo = useRef()
	const connectionRef= useRef()

    const userData = useSelector((state) => state.userData);
	if (!userData || !myVideo)
		return (<div>loading</div>)

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream)
				myVideo.current.srcObject = stream
		})

		socket.on("me", (id) => {
			setMe(id)
		})
		socket.emit("login", userData.email);

		socket.on("callUser", (data) => {
			setReceivingCall(true)
			setCaller(data.fromId)
			setName(data.name)
			setCallerSignal(data.signal)
		})
		socket.on("incomingCall", (data) => {
			setReceivingCall(true)
			setCaller(data.fromId)
			setName(data.username)
			setCallerSignal(data.signal)
		})
	}, [userData])

	const callEmail = (email) => {
		connectionRef.current = null
		connectionRef.current = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})
		connectionRef.current.on("signal", (data) => {
			console.log(1)
			socket.emit("callEmail", {
				email,
				signalData: data,
				username: userData.username
			})
		})
		connectionRef.current.on("stream", (stream) => {
				setCallAccepted(true)
				userVideo.current.srcObject = stream
				
			
		})
		socket.on("answered", (signal) => {
			
			connectionRef.current.signal(signal)
		})
	}


	const answer =() =>  {
		connectionRef.current = null
		connectionRef.current = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		connectionRef.current.on("signal", (data) => {
			socket.emit("answer", { signal: data, toId: caller })
		})
		connectionRef.current.on("stream", (stream) => {
			setCallAccepted(true)
			userVideo.current.srcObject = stream
			
		})
		
		connectionRef.current.signal(callerSignal)
	}

	const leaveCall = () => {
		// setCallEnded(true)
		setCallAccepted(false)
		setReceivingCall(false)
		connectionRef.current.destroy();
		socket.removeAllListeners("answered");
	}
	
	return (
		<div>
		<div className="container">
			<div className="video-container">
				<div className="video">
					{stream &&  <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
				</div>
				<div className="video">
					{callAccepted && !callEnded ?
					<video playsInline ref={userVideo} autoPlay style={{ width: "300px"}} />:
					<div style={{ height: "100px", width: "300px", backgroundColor: "black", color: "white"}} >Waiting for connection</div>}
				</div>
			</div>
			<div className="myId">
				<div className="call-button">
					{callAccepted && !callEnded ? (
						<Button variant="contained" color="secondary" onClick={leaveCall}>
							End Call
						</Button>
					) : (
						<IconButton color="primary" aria-label="call" onClick={() => callEmail(callerEmail)}>
							<PhoneIcon fontSize="large" />
						</IconButton>
					)}
				</div>
			</div>
			<div>
				{receivingCall && !callAccepted ? (
						<div className="caller">
						<h1 >{name} is calling...</h1>
						<Button variant="contained" color="primary" onClick={answer}>
							Answer
						</Button>
					</div>
				) : null}
			</div>
		</div>
		</div>
	)
}

export default ChatVideo;
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
	if (!userData)
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

    
	const callUser = (id) => {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("callUser", {
				userToCall: id,
				signalData: data,
				from: me,
				name: userData.email
			})
		})
		peer.on("stream", (stream) => {
			
				userVideo.current.srcObject = stream
			
		})
		socket.on("callAccepted", (signal) => {
			setCallAccepted(true)
			peer.signal(signal)
		})

		connectionRef.current = peer
	}

	const callEmail = (email) => {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("callEmail", {
				email,
				signalData: data,
				username: userData.username
			})
		})
		peer.on("stream", (stream) => {
			
				userVideo.current.srcObject = stream
			
		})
		socket.on("answered", (signal) => {
			setCallAccepted(true)
			peer.signal(signal)
		})

		connectionRef.current = peer
	}

	const answerCall =() =>  {
		setCallAccepted(true)
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("answerCall", { signal: data, to: caller })
		})
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream
		})

		peer.signal(callerSignal)
		connectionRef.current = peer
	}

	const answer =() =>  {
		setCallAccepted(true)
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("answer", { signal: data, toId: caller })
		})
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream
		})

		peer.signal(callerSignal)
		connectionRef.current = peer
	}

	const leaveCall = () => {
		// setCallEnded(true)
		setCallAccepted(false)
		setReceivingCall(false)
		// connectionRef.current.destroy()
		// setCallEnded(false)
	}
	
	return (
		<div>
			<h1 style={{ textAlign: "center", color: '#fff' }}>Zoomish</h1>
		<div className="container">
			<div className="video-container">
				<div className="video">
					{stream &&  <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
				</div>
				<div className="video">
					{callAccepted && !callEnded ?
					<video playsInline ref={userVideo} autoPlay style={{ width: "300px"}} />:
					null}
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
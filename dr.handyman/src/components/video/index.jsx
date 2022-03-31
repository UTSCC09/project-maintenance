import { useSelector } from "react-redux";
import { Dialog } from "@mui/material";
import ChatVideo from "../chat/ChatVideo";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { UPDATE_CALLING_USER } from "../../store/constants";
import { TRIGGER_MESSAGE } from "../../store/constants";
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import PhoneIcon from "@mui/icons-material/Phone"
import Peer from "simple-peer"

export default () => {
    const [videoShow, setvideoShow] = useState(true);
    const [ receivingCall, setReceivingCall ] = useState(false)
    const [ callAccepted, setCallAccepted ] = useState(false)
    const [ caller, setCaller ] = useState("")
    const [ name, setName ] = useState("")
    const [ stream, setStream ] = useState()
    const [ callerSignal, setCallerSignal ] = useState()

    const myVideo = useRef()
	const userVideo = useRef()
    const connectionRef= useRef()

    const dispatch = useDispatch();
    const toggleVideo = () => {
		//<ChatVideo callerEmail={currentConvUserInfo.conversation.userEmails[0] == userData.email ? currentConvUserInfo.conversation.userEmails[1] : currentConvUserInfo.conversation.userEmails[0]}></ChatVideo>

		setvideoShow(!videoShow);
        socket.removeAllListeners("answered");
        dispatch({
            type: UPDATE_CALLING_USER,
			payload: ""
        })
	};
    
    const callingUser = useSelector((state) => state.callingUser);
    const userData = useSelector((state) => state.userData);
	const socket = useSelector((state) => state.socket);

    useEffect(() => {
		if (!callingUser || callingUser === "")
            setvideoShow (false);
        else
            setvideoShow (true);
           

        // socket.removeAllListeners("incomingCall");
        socket.on("incomingCall", (data) => {
            setReceivingCall(true)
            console.log("ok");
            setCaller(data.fromId)
            setName(data.username)
            setCallerSignal(data.signal)
            dispatch({
                type: UPDATE_CALLING_USER,
                payload: data.username
            })
        })
	}, [callingUser])

    const callEmail = (email) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current.srcObject = stream
            connectionRef.current = null
            connectionRef.current = new Peer({
                initiator: true,
                trickle: false,
                stream: stream
            })
            connectionRef.current.on("signal", (data) => {
                socket.emit("callEmail", {
                    email,
                    signalData: data,
                    username: userData.username
                })
            })
            connectionRef.current.on("stream", (stream) => {
                    userVideo.current.srcObject = stream
            })
            socket.on("answered", (signal) => {
                setCallAccepted(true)
                connectionRef.current.signal(signal)
            })
        })
		
	}

    const answer =() =>  {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current.srcObject = stream
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
        })
		
	}

    const leaveCall = () => {
		// setCallEnded(true)
		setCallAccepted(false)
		setReceivingCall(false)
		connectionRef.current.destroy();
		socket.removeAllListeners("answered");
	}
	return (
		<Dialog 
        scroll="body"
        open={videoShow}
        onClose={toggleVideo}>
            <div className="myId">
                {!receivingCall ? (
                    <IconButton color="primary" aria-label="call" onClick={() => callEmail(callingUser)}>
                        <PhoneIcon fontSize="large" />
                    </IconButton>
                ) : null}
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
            <div>
                <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />
                
                {callAccepted ? 
                    (<div>
                        {stream && <video playsInline ref={userVideo} autoPlay style={{ width: "300px"}} />}
                        {callAccepted &&
                            <Button variant="contained" color="secondary" onClick={leaveCall}>
                                        End Call
                            </Button>}
                    </div>
                        
                    ) : null}
            </div>
            {/* <ChatVideo callerEmail={callingUser}></ChatVideo> */}
            {callingUser}
        </Dialog>
	);
};

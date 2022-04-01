import { useSelector } from "react-redux";
import { Dialog } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { UPDATE_CALLING_USER } from "../../store/constants";
import { TRIGGER_MESSAGE } from "../../store/constants";
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import PhoneIcon from "@mui/icons-material/Phone"
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import Peer from "simple-peer"

export default () => {
    const [videoShow, setvideoShow] = useState(true);
    const [ receivingCall, setReceivingCall ] = useState(false)
    const [ recievingEnd, setRecievingEnd ] = useState(false)
    const [ makingCall, setMakingCall ] = useState(false)
    const [ callAccepted, setCallAccepted ] = useState(false)

    const [ otherId, setOtherId ] = useState("")
    const [ otherName, setOtherName ] = useState("")
    const [ otherSignal, setOtherSignal ] = useState()
    const [ stream, setStream ] = useState()
    
    const [ otherStopped, setOtherStopped ] = useState(true);
    const [ meStopped, setMeStopped ] = useState(true);
    const [ meMuted, setMeMuted ] = useState(true);
    const [ otherMuted, setOtherMuted ] = useState(true);
    const myVideo = useRef()
	const userVideo = useRef()
    const connectionRef= useRef()

    const dispatch = useDispatch();
    const closeVideo = () => {
        if (myVideo && myVideo.current && myVideo.current.srcObject && myVideo.current.srcObject.getVideoTracks().length == 1)
        {
            myVideo.current.srcObject.getVideoTracks()[0].enabled = false;
            myVideo.current.srcObject.getAudioTracks()[0].enabled = false;
        }
		setvideoShow(false);
        setOtherStopped(false);
        setMeStopped(false)
        setReceivingCall(false);
        setMakingCall(false);
        setCallAccepted(false);
        setRecievingEnd(false);
        socket.removeAllListeners("answered");

        if (otherId)
            {
                socket.emit("callEnded", otherId);
                setOtherId(null);
            }
        if (connectionRef.current)
            {
                connectionRef.current.destroy();
                connectionRef.current = null;
            }
        if (makingCall)
            {
                socket.emit("cancel", callingUser);
            }
        
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
           
        setRecievingEnd(false)
        socket.removeAllListeners("incomingCall");
        socket.removeAllListeners("callEnded");
        socket.removeAllListeners("cancel");
        socket.removeAllListeners("startVideo")
        socket.removeAllListeners("stopVideo")
        socket.on("incomingCall", (data) => {
            if (!receivingCall && !makingCall && !callAccepted){
                setReceivingCall(true)
                setRecievingEnd(true)
                setOtherId(data.fromId)
                setOtherName(data.username)
                setOtherSignal(data.signal)
                dispatch({
                    type: UPDATE_CALLING_USER,
                    payload: data.username
                })
            }
            else
                {
                    leaveCall();
                }
                
                
        })
        socket.on("cancel", () => {
            console.log("other canceled");
            leaveCall();
        })
        socket.on("stopVideo", () => {
            userVideo.current.srcObject.getVideoTracks()[0].enabled = false;
            setOtherStopped(true);
        })
        socket.on("startVideo", ()=>{
            userVideo.current.srcObject.getVideoTracks()[0].enabled = true;
            setOtherStopped(false);
        })
        socket.on("mute", () => {
            userVideo.current.srcObject.getAudioTracks()[0].enabled = false;
            setOtherMuted(true);
        })
        socket.on("unmute", ()=>{
            userVideo.current.srcObject.getAudioTracks()[0].enabled = true;
            setOtherMuted(false);
        })
        socket.on("callEnded", () => {
            console.log("other ended");
            leaveCall();
        })
	}, [callingUser])

    const callEmail = (email) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            stream.getAudioTracks()[0].enabled = false;
            stream.getVideoTracks()[0].enabled = false;
            setMakingCall(true);
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
            socket.on("answered", (data) => {
                setCallAccepted(true)
                setMakingCall(false)
                connectionRef.current.signal(data.signal)
                setOtherId(data.id);
                setOtherName(data.username);
            })
        }).catch(() => {
            leaveCall();
        })
		
	}

    const answer =() =>  {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            stream.getAudioTracks()[0].enabled = false;
            stream.getVideoTracks()[0].enabled = false;
            setStream(stream)
            myVideo.current.srcObject = stream
            connectionRef.current = null
            connectionRef.current = new Peer({
                initiator: false,
                trickle: false,
                stream: stream
            })
            connectionRef.current.on("signal", (data) => {
                socket.emit("answer", { signal: data, toId: otherId, toUsername: userData.username })
            })
            connectionRef.current.on("stream", (stream) => {
                setCallAccepted(true)
                userVideo.current.srcObject = stream
                
            })
            connectionRef.current.signal(otherSignal)
        }).catch(() => {
            leaveCall();
        })
		
	}
    const cancel = () => {
        socket.emit("cancel", callingUser);
        leaveCall();
    }

    const stopVideo = () => {
        if (!meStopped){
            myVideo.current.srcObject.getVideoTracks()[0].enabled = false;
            socket.emit("stopVideo", otherId);
            setMeStopped(true);
        }
    }

    const startVideo = () => {
        if (meStopped){
            myVideo.current.srcObject.getVideoTracks()[0].enabled = true;
            setMeStopped(false);
            socket.emit("startVideo", otherId);
        }
    }
    const stopAudio = () => {
        if (!meMuted){
            myVideo.current.srcObject.getAudioTracks()[0].enabled = false;
            socket.emit("mute", otherId);
            setMeMuted(true);
        }
    }
    const startAudio = () => {
        if (meMuted){
            myVideo.current.srcObject.getAudioTracks()[0].enabled = true;
            setMeMuted(false);
            socket.emit("unmute", otherId);
        }
    }
    const leaveCall = () => {
        closeVideo();
	}
	return (
		<Dialog 
        scroll="body"
        open={videoShow}
        onClose={closeVideo}>
            <div className="myId">
                {!recievingEnd && !receivingCall ? (
                    <div>
                    {!callAccepted && <IconButton color="primary" aria-label="call" onClick={() => callEmail(callingUser)}>
                        <PhoneIcon fontSize="large" />
                    </IconButton>}
                    {makingCall && <Button variant="contained" color="primary" onClick={cancel}>
						Cancel
					</Button>}
                    </div>
                ) : null}
			</div>
            <div>
				{receivingCall && !callAccepted ? (
					<div className="caller">
						<h1 >{otherName} is calling...</h1>
						<Button variant="contained" color="primary" onClick={answer}>
							Answer
						</Button>
                        <Button variant="contained" color="primary" onClick={leaveCall}>
							Decline
						</Button>
					</div>
				) : null}
			</div>
            <div>
                {userData.username}
                {<video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
                
                {callAccepted ? 
                    (<div>
                        {otherName}
                        {stream && <video playsInline ref={userVideo} autoPlay style={{ width: "300px"}} />}
                        <Button variant="contained" color="secondary" onClick={leaveCall}>
                                    End Call
                        </Button>
                        {meStopped ? <VideocamOffIcon onClick={startVideo}></VideocamOffIcon> : <VideocamIcon onClick={stopVideo}></VideocamIcon>}
                        {meMuted ? <MicOffIcon onClick={startAudio}></MicOffIcon> : <MicIcon onClick={stopAudio}></MicIcon>}
                    </div>
                        
                    ) : null}
            </div>
        </Dialog>
	);
};

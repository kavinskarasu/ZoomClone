import React,{createConext,useState,useRef,useEffect} from  'react';
import {io} from 'socket.io-client'
import Peer from 'simple-peer'
const SocketContext=createConext();
const socket=io('https://localhost:5000');
const contextProvider=({childer})=>{
    const [stream,setStream]=useState(null);
    const [me,setMe]=useState('');
    const [call,setCall]=useState(null);
    const [callAccepted,setCallAccepted]=useState(false);
    const [callEnded,setCallEnded]=useState(false)
    const [name,setName]=useState('')
    const myvideo=useRef();
    const userVideo=useRef();
    const connectionRef=useRef();
    useEffect(()=>{
        navigator.mediaDevices.getDisplayMedia({video:true,audio:true}).then((currentstream)=>{
            setStream(currentstream);
            myvideo.current.srcObject=currentstream;

        })
        socket.on('me',(id)=>setMe(id))
        socket.on('calluser',({from,name:callerName,signal})=>{
setCall({isRecivedCall:true,from,name:callerName,signal})
        })
    },[])
    const answercall=()=>{
     setCallAccepted(true)
     const peer=new Peer({initiator:false,trickle:false,stream})
     peer.on('signal',(data)=>{
        socket.emit('answercall',{signal:data,to:call.from})
     })
     peer.on('stream',(currentstream)=>{
        userVideo.current.srcObject=currentstream
     })
     peer.signal(call.signal)
     connectionRef.current=peer;

    }
    const callUser=(id)=>{

        const peer=new Peer({initiator:true,trickle:false,stream})
        peer.on('signal',(data)=>{
           socket.emit('calluser',{userToCall:id,signalData:data,from:me,name})
        })
        peer.on('stream',(currentstream)=>{
           userVideo.current.srcObject=currentstream
        })
        socket.on('callaccepted',(signal)=>{
            setCallAccepted(true);
            peer.signal(signal)
        })
    }
    connectionRef.current=peer;

    const leaveCall=()=>{
setCallEnded(true);
connectionRef.current.destroy();
window.location.current.reload();
    }
    return (
        <SocketContext.Provider value={{
            call,
            callAccepted,
            myvideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,callUser,
            leaveCall,
            answercall,
            

        }}>
            {Children}
        </SocketContext.Provider>
    )
}

export {contextProvider,SocketContext}
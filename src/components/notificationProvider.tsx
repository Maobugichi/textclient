import { useEffect , useContext , useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { ShowContext } from "./context-provider";

type ToastType = 'success' | 'error' | 'info' | 'warn';

interface NotificationPayLoad {
    type: ToastType;
    message:string
}

export const useNotifications = () => {
    const myContext = useContext(ShowContext)
    if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
    const { userData } = myContext;
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        const userId = userData.userId
        
         if (!userId) return;
         if (socketRef.current) {
          socketRef.current.disconnect();
        }

        const socket = io('https://api.textflex.net', {
            query: { userId }
        })

       socket.on("connect", () => {
        console.log(`Socket connected for user ${userId}`);
        socket.emit("join-room", userId);
        //socket.emit("client-ready");
        });
         
        socket.on("notification", (data: NotificationPayLoad) => {
            console.log(userId)
            console.log("Notification received:", data);
            return toast[data.type](data.message)
        })
         
        socketRef.current = socket;
        return () =>  { socket.disconnect() }
    },[userData?.userId])
}
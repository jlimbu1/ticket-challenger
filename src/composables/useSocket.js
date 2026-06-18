import { ref, onUnmounted } from "vue";
import { connectSocket } from "@/utils/socket";
export function useSocket() {
    const socket = connectSocket();
    const isConnected = ref(false);
    const message = ref(null);
    socket.on("connect", () => {
        isConnected.value = true;
    });
    socket.on("disconnect", () => {
        isConnected.value = false;
    });
    // Example: listen for a 'message' event
    socket.on("message", (data) => {
        message.value = data;
    });
    // Clean up on component unmount
    onUnmounted(() => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("message");
    });
    return {
        socket,
        isConnected,
        message,
        emitEvent: (event, data) => socket.emit(event, data),
    };
}

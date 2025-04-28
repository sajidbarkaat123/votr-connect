import { useContext } from "react";
import { MessageContext, IMessageContext } from "@/context/message-context";

const useMessage = () => {
    const { showSnackbar, hideSnackbar, snackbarState } = useContext(MessageContext) as IMessageContext;

    return { showSnackbar, hideSnackbar, snackbarState };
}

export default useMessage;
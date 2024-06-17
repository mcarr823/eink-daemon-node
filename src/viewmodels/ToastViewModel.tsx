import { ToastType } from "@/enums/ToastType";
import { useEffect, useState } from "react";

/**
 * Viewmodel for use with a Toast component.
 * 
 * Toasts should be manipulated by binding an instance of
 * this viewmodel to a toast, then running the functions
 * provided by this viewmodel.
 * 
 * eg.
 * const model = ToastViewModel()
 * const elem = (<Toast model={model}/>)
 * model.success('My success message')
 * 
 * @returns IToastViewModel
 */
export default function ToastViewModel(): IToastViewModel {

    const [visible, setVisible] = useState<boolean>(false)
    const [title, setTitle] = useState<string>("")
    const [message, setMessage] = useState<string>("")
    const [hideAfter, setHideAfter] = useState<number>(0)
    const [type, setType] = useState<ToastType>(ToastType.DEFAULT)

    const show = (args: IToastShowParams) => {
        setTitle(args.title)
        setMessage(args.message)
        setType(args.type ?? ToastType.DEFAULT)
        setHideAfter(3)
        setVisible(true)
    }
    const hide = () => setVisible(false);

    // Convenience function to show a toast with ERROR styling
    const error = (message: string) => {
        show({
            title:'Error',
            message,
            type:ToastType.ERROR
        })
    }

    // Convenience function to show a toast with SUCCESS styling
    const success = (message: string) => {
        show({
            title:'Success',
            message,
            type:ToastType.SUCCESS
        })
    }

    // When the toast is shown, check if hideAfter is set.
    // If hideAfter > 0, then the toast should be hidden
    // automatically after `hideAfter` seconds.
    useEffect(() => {
        if (visible && hideAfter > 0){
            const millis = hideAfter * 1000;
            setTimeout(() => {
                setVisible(false)
            }, millis);
        }
    }, [visible])

    return {
        visible, setVisible,
        title,
        message,
        show, hide,
        type,
        success, error
    }

}

export interface IToastViewModel{
    visible: boolean;
    setVisible: (value: boolean) => void;
    title: string;
    message: string;
    show: (args: IToastShowParams) => void;
    hide: () => void;
    type: ToastType;
    success: (message: string) => void;
    error: (message: string) => void;
}

interface IToastShowParams{
    title: string;
    message: string;
    type?: ToastType;
}

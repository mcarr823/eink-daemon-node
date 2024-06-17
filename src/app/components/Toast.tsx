import { ToastType } from '@/enums/ToastType';
import { IToastViewModel } from '@/viewmodels/ToastViewModel';

/**
 * Represents a Bootstrap Toast.
 * @see https://getbootstrap.com/docs/5.0/components/toasts/
 * 
 * In short, it is a passive alert dialog used to show some
 * information to the user.
 * eg. A success message, or an error message.
 * 
 * See ToastViewModel for information on how to use it.
 * 
 * @param model A ToastViewModel instance used to manipulate
 * this Toast component.
 * @returns Toast
 */
export default function Toast(args : IToast){

    const { model } = args
    const styles = model.visible ? {} : {display:'none'}

    var cardClass = "toast show";
    var textClass = "toast-body";
    if (model.type == ToastType.SUCCESS){
        cardClass += " bg-success";
        textClass += " text-white";
    }else if (model.type == ToastType.ERROR){
        cardClass += " bg-danger";
        textClass += " text-white";
    }

    return (
        <div
            className="position-fixed bottom-0 end-0 p-3"
            style={styles}
            >

            <div
                id="liveToast"
                className={cardClass}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                >

                <div className="toast-header">
                    <strong className="me-auto">{model.title}</strong>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="toast"
                        aria-label="Close"
                        onClick={model.hide}
                        ></button>
                </div>
                <div className={textClass}>
                    {model.message}
                </div>

            </div>

        </div>
    )
}

interface IToast{
    model: IToastViewModel;
}
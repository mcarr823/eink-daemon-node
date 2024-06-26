import { ChangeEventHandler } from "react";

/**
 * A simple checkbox input element with bootstrap styling.
 * 
 * This is intended for use with the setter of a useState variable (setValue)
 * and simplifies the implementation of ChangeEventHandler.
 * 
 * eg.
 * const [checked, setChecked] = useState(false)
 * return (
 *  <Checkbox
 *   id="test"
 *   value={checked}
 *   setValue={setChecked}/>
 * )
 * 
 * @param id Unique identifier for this element
 * @param value Default value to display. Can be a state variable from useState
 * @param setValue Callback to invoke when the checkbox state changes
 * @returns A styled <input> node
 */
export default function Checkbox(args: ICheckboxArgs){
    
    const setValue: ChangeEventHandler<HTMLInputElement> = (event) => {
        const checked = event.target.checked;
        args.setValue(checked)
    }

    return (
        <input
            className="form-check-input"
            id={args.id}
            type="checkbox"
            defaultChecked={args.value}
            onChange={setValue}
            />
    )
}

interface ICheckboxArgs{
    id: string;
    value: boolean;
    setValue: (value: boolean) => void;
}
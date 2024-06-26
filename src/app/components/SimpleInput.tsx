import { ChangeEventHandler } from "react";

/**
 * A simple input element with bootstrap styling.
 * 
 * This is intended for use with the setter of a useState variable (setValue)
 * and simplifies the implementation of ChangeEventHandler.
 * 
 * eg.
 * const [selectedValue, setSelectedValue] = useState("")
 * return (
 *  <SimpleInput
 *   id="test"
 *   value={selectedValue}
 *   setValue={setSelectedValue}/>
 * )
 * 
 * @param id Unique identifier for this element
 * @param value Default value to display. Can be a state variable from useState
 * @param setValue Callback to invoke when an option is selected
 * @returns A styled <input> node
 */
export default function SimpleInput(args: ISimpleInputArgs){
    
    const setValue: ChangeEventHandler<HTMLInputElement> = (event) => {
        args.setValue(event.target.value)
    }

    return (
        <input
            className="form-control"
            id={args.id}
            type="text"
            defaultValue={args.value}
            onChange={setValue}
            />
    )
}

interface ISimpleInputArgs{
    id: string;
    value: string;
    setValue: (value: string) => void;
}
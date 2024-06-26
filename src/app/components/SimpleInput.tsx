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
 * @param setValue Callback to invoke when the text changes. Sends back a string
 * @param setValueNumeric Callback to invoke when the text changes. Sends back a number
 * @returns A styled <input> node
 */
export default function SimpleInput(args: ISimpleInputArgs){
    
    const setValue: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (args.setValue){
            args.setValue(event.target.value)
        }else if (args.setValueNumeric){
            const numVal = parseInt(event.target.value)
            args.setValueNumeric(numVal)
        }
    }

    var type: string;
    if (args.setValueNumeric){
        type = "number"
    }else{
        type = "text"
    }

    return (
        <input
            className="form-control"
            id={args.id}
            type={type}
            defaultValue={args.value}
            onChange={setValue}
            />
    )
}

interface ISimpleInputArgs{
    id: string;
    value: string | number;
    setValue?: (value: string) => void;
    setValueNumeric?: (value: number) => void;
}
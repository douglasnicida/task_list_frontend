import { TextField } from "@radix-ui/themes";
import { Dispatch, SetStateAction } from "react";

interface DateTextInputProps {
    dueDate: string
    setDueDate: Dispatch<SetStateAction<string>>
}

export const DateTextInput = ({dueDate, setDueDate }: DateTextInputProps) => {

    const handleChange = (event: any) => {
        const inputValue = event.target.value;
        const formattedValue = inputValue
            .replace(/^(\d{2})(\d)$/g, '$1/$2')
            .replace(/^(\d{2}\/\d{2})(\d+)$/g, '$1/$2')
            .replace(/[^\d/]/g, '');

        setDueDate(formattedValue);
    };

    return (
        <TextField.Root
            value={dueDate}
            placeholder="DD/MM/AAAA"
            maxLength={10}
            onInput={handleChange}
        ></TextField.Root>
    )
}
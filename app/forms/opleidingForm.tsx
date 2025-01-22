import { Form, Input } from "@nextui-org/react";
import React, { FormEvent } from "react";
import { Opleiding } from "../types/types";

type OpleidingFormProps = {
    editingOpleiding?: Partial<Opleiding> | undefined;
    setSavedOpleiding: (opleiding: Partial<Opleiding>, isEdit: boolean) => void;
};
export const OpleidingForm: React.FC<OpleidingFormProps> = ({ editingOpleiding, setSavedOpleiding }) => {    
    
    const [errors, setErrors] = React.useState({});
    const [submitted, setSubmitted] = React.useState(null);

    const onSubmit: ((event: FormEvent<HTMLFormElement>) => void) | undefined = (e: any) => {
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        e.preventDefault();
        const opleiding: Partial<Opleiding> = {
            naam: data.Naam.toString(),
            id: (editingOpleiding?.id ?? 0),
        }  

        setSavedOpleiding(opleiding, editingOpleiding !== undefined);
    }
    
    return (
     <Form
                className="w-full justify-center items-center w-full space-y-6"
                validationBehavior="native"
                validationErrors={errors}
                onReset={() => setSubmitted(null)}
                onSubmit={onSubmit}
                id="opleidingForm"
                >
                    <Input
                        defaultValue={editingOpleiding?.naam}
                        isRequired
                        errorMessage={({validationDetails}) => {
                            if (validationDetails.valueMissing) {
                            return "Voer een naam in";
                            }

                            return "naam is incorrect";
                        }}
                        label="Naam"
                        labelPlacement="outside"
                        name="Naam"
                        placeholder="Voer een naam in"
                    />
            </Form>
    );
}
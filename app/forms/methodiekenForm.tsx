import { Form, Input } from "@nextui-org/react";
import React, { FormEvent } from "react";
import { Methodiek } from "../types/types";

type MethodiekFormProps = {
    editingMethodiek?: Partial<Methodiek> | undefined;
    setSavedMethodiek: (methodiek: Partial<Methodiek>, isEdit: boolean) => void;
};

export const MethodiekenForm: React.FC<MethodiekFormProps> = ({ editingMethodiek, setSavedMethodiek }) => {    
    const [errors, setErrors] = React.useState({});
    const [submitted, setSubmitted] = React.useState(null);

    const onSubmit: ((event: FormEvent<HTMLFormElement>) => void) | undefined = (e: any) => {
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        e.preventDefault();
        const methodiek: Partial<Methodiek> = {
            naam: data.Naam.toString(),
           // beoordeling: selectedBeoordeling,
           id: (editingMethodiek?.id ?? 0), 
        }  
        setSavedMethodiek(methodiek, editingMethodiek !== undefined); 
    }
    
    return (
     <Form
                className="w-full justify-center items-center w-full space-y-6"
                validationBehavior="native"
                validationErrors={errors}
                onReset={() => setSubmitted(null)}
                onSubmit={onSubmit}
                id="methodiekForm"
                >
                    <Input
                        defaultValue={editingMethodiek?.naam}
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
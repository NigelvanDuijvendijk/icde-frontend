import { Form, Input } from "@nextui-org/react";
import React, { FormEvent } from "react";
import { Leereenheid } from "../types/types";

type LeereenheidFormProps = {
    leeruitkomstId?: number | undefined;
    setSavedLeereenheid: (leereenheid: Leereenheid, isEdit: boolean) => void;
    editingLeereenheid?: Partial<Leereenheid> | undefined;
};

export const LeereenheidForm: React.FC<LeereenheidFormProps> = ({leeruitkomstId, setSavedLeereenheid, editingLeereenheid}) => {
    
    const [errors, setErrors] = React.useState({});
    const [submitted, setSubmitted] = React.useState(null);

    const onSubmit: ((event: FormEvent<HTMLFormElement>) => void) | undefined = (e: any) => {
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        e.preventDefault();
        const leereenheid: Leereenheid = {
            naam: data.Naam.toString(),
            omschrijving: data.Omschrijving.toString(),
            id: (editingLeereenheid?.id ?? 0),
        }  

        if(leereenheid !== undefined) {
            setSavedLeereenheid(leereenheid, editingLeereenheid !== undefined); 
        }
    }
    
    return (
     <Form
                className="w-full justify-center items-center w-full space-y-6"
                validationBehavior="native"
                validationErrors={errors}
                onReset={() => setSubmitted(null)}
                onSubmit={onSubmit}
                id="leereenheidForm"
                >
                    <Input
                        defaultValue={editingLeereenheid?.naam}
                        isRequired
                        errorMessage={({validationDetails}) => {
                            if (validationDetails.valueMissing) {
                            return "Voer een naam in";
                            }

                            return "Naam is incorrect";
                        }}
                        label="Naam"
                        labelPlacement="outside"
                        name="Naam"
                        placeholder="Voer een naam in"
                    />
                    <Input
                        defaultValue={editingLeereenheid?.omschrijving}
                        isRequired
                        errorMessage={({validationDetails}) => {
                            if (validationDetails.valueMissing) {
                            return "Voer een omschrijving in";
                            }

                            return "omschrijving is incorrect";
                        }}
                        label="Omschrijving"
                        labelPlacement="outside"
                        name="Omschrijving"
                        placeholder="Voer een omschrijving in"
                    />
            </Form>
    );
}
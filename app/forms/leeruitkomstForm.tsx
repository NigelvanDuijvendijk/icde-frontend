import { Form, Input } from "@nextui-org/react";
import React, { FormEvent } from "react";
import { Leeruitkomst } from "../types/types";
import { postLeeruitkomst } from "../apiService";

type LeeruitkomstFormProps = {
    onderwijseenheidId?: number;
};

export const LeeruitkomstForm: React.FC<LeeruitkomstFormProps> = ({ onderwijseenheidId }) => {
    
    const [errors, setErrors] = React.useState({});
    const [submitted, setSubmitted] = React.useState(null);

    const onSubmit: ((event: FormEvent<HTMLFormElement>) => void) | undefined = (e: any) => {
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        e.preventDefault();
        const leeruitkomst: Partial<Leeruitkomst> = {
            naam: data.Naam.toString(),
            omschrijving: data.Omschrijving.toString()
        }  

        if(onderwijseenheidId !== undefined) {
            postLeeruitkomst(leeruitkomst, onderwijseenheidId!);      
        }
    }
    
    return (
     <Form
                className="w-full justify-center items-center w-full space-y-6"
                validationBehavior="native"
                validationErrors={errors}
                onReset={() => setSubmitted(null)}
                onSubmit={onSubmit}
                id="leeruitkomstForm"
                >
                    <Input
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
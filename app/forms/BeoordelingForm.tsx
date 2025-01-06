import { Form, Input } from "@nextui-org/react";
import React, { FormEvent } from "react";
import { Beoordeling, Onderwijseenheid } from "../types/types";
import { postBeoordeling } from "../apiService";

type BeoordelingFormProps = {
    onderwijseenheidId?: number;
};

export const BeoordelingForm: React.FC<BeoordelingFormProps> = ({ onderwijseenheidId }) => {
    const [errors, setErrors] = React.useState({});
    const [submitted, setSubmitted] = React.useState(null);

    const onSubmit: ((event: FormEvent<HTMLFormElement>) => void) | undefined = (e: any) => {
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        e.preventDefault();
        const beoordeling: Partial<Beoordeling> = {
            code: data.Code.toString(),
            onderbouwing: data.Onderbouwing.toString(), 
            minimaleLeereenheden: Number(data.MinimaleLeereenheden),
            omschrijving: data.Omschrijving.toString()
        }  
        console.log(onderwijseenheidId);
        if(onderwijseenheidId !== undefined) {
            postBeoordeling(beoordeling, onderwijseenheidId!);      
        }
    }
    
    return (
     <Form
                className="w-full justify-center items-center w-full space-y-6"
                validationBehavior="native"
                validationErrors={errors}
                onReset={() => setSubmitted(null)}
                onSubmit={onSubmit}
                id="beoordelingForm"
                >
                    <Input
                        isRequired
                        errorMessage={({validationDetails}) => {
                            if (validationDetails.valueMissing) {
                            return "Voer een code in";
                            }

                            return "Code is incorrect";
                        }}
                        label="Code"
                        labelPlacement="outside"
                        name="Code"
                        placeholder="Voer een code in"
                    />
                    <Input
                        isRequired
                        errorMessage={({validationDetails}) => {
                            if (validationDetails.valueMissing) {
                            return "Voer een onderbouwing in";
                            }

                            return "Onderbouwing is incorrect";
                        }}
                        label="Onderbouwing"
                        labelPlacement="outside"
                        name="Onderbouwing"
                        placeholder="Voer een Onderbouwing in"
                    />
                    <Input
                        isRequired
                        errorMessage={({validationDetails}) => {
                            if (validationDetails.valueMissing) {
                            return "Voer een aantal minimaleLeereenheden in";
                            }

                            return "minimaleLeereenheden aantal is incorrect";
                        }}
                        label="MinimaleLeereenheden"
                        labelPlacement="outside"
                        name="MinimaleLeereenheden"
                        placeholder="Voer een aantal minimaleLeereenheden in"
                    />
                    <Input
                        isRequired
                        errorMessage={({validationDetails}) => {
                            if (validationDetails.valueMissing) {
                            return "Voer een omschrijving in";
                            }

                            return "Omschrijving is incorrect";
                        }}
                        label="Omschrijving"
                        labelPlacement="outside"
                        name="Omschrijving"
                        placeholder="Voer een omschrijving in"
                    />
            </Form>
    );
}
import { Form, Input } from "@nextui-org/react";
import React, { FormEvent } from "react";
import { Leerbron } from "../types/types";
import { postLeerbron } from "../apiService";

type LeerbronFormProps = {
    onderwijseenheidId?: number;
};

export const LeerbronForm: React.FC<LeerbronFormProps> = ({ onderwijseenheidId }) => {
    const [errors, setErrors] = React.useState({});
    const [submitted, setSubmitted] = React.useState(null);

    const onSubmit: ((event: FormEvent<HTMLFormElement>) => void) | undefined = (e: any) => {
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        e.preventDefault();
        const leerbron: Partial<Leerbron> = {
            naam: data.Naam.toString(),
            link: data.Link.toString()
        }  
        if(onderwijseenheidId !== undefined) {
            postLeerbron(leerbron, onderwijseenheidId!);      
        }
    }
    
    return (
     <Form
                className="w-full justify-center items-center w-full space-y-6"
                validationBehavior="native"
                validationErrors={errors}
                onReset={() => setSubmitted(null)}
                onSubmit={onSubmit}
                id="leerbronForm"
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
                            return "Voer een link in";
                            }

                            return "Link is incorrect";
                        }}
                        label="Link"
                        labelPlacement="outside"
                        name="Link"
                        placeholder="Voer een link in"
                    />
            </Form>
    );
}
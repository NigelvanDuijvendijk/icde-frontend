import { Form, Input } from "@nextui-org/react";
import React, { FormEvent } from "react";
import { Leerbron } from "../types/types";

type LeerbronFormProps = {
    onderwijscode?: String;
    setSavedLeerbron: (value: Leerbron | null, isEdit: boolean) => void;
    editLeerbron?: Partial<Leerbron> | undefined;
};

export const LeerbronForm: React.FC<LeerbronFormProps> = ({ onderwijscode, setSavedLeerbron, editLeerbron }) => {
    const [errors, setErrors] = React.useState({});
    const [submitted, setSubmitted] = React.useState(null);

    const onSubmit: ((event: FormEvent<HTMLFormElement>) => void) | undefined = (e: any) => {
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        e.preventDefault();

        const leerbron: Leerbron = {
            naam: data.Naam.toString(),
            link: data.Link.toString(),
            id: (editLeerbron?.id ?? 0),
            isDeleted: false,
        }  
        if(onderwijscode !== undefined) {
            setSavedLeerbron(leerbron, editLeerbron !== undefined);
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
                        defaultValue={editLeerbron?.naam}
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
                        defaultValue={editLeerbron?.link}
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
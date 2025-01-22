import { Form, Input } from "@nextui-org/react";
import React, { FormEvent } from "react";
import { Les } from "../types/types";
import { postLes } from "../apiService";

type LesFormProps = {
    leereenheidId?: number;
    editingLes?: Partial<Les> | undefined;
};

export const LesForm: React.FC<LesFormProps> = ({ leereenheidId, editingLes }) => {
    
    const [errors, setErrors] = React.useState({});
    const [submitted, setSubmitted] = React.useState(null);

    const onSubmit: ((event: FormEvent<HTMLFormElement>) => void) | undefined = (e: any) => {
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        e.preventDefault();
        const les: Partial<Les> = {
            omschrijving: data.Omschrijving.toString(),
            tijdsduur: parseInt(data.tijdsduur.toString())
        }  

        if(leereenheidId !== undefined) {
           postLes(les, leereenheidId!);      
        }
    }
    
    return (
     <Form
                className="w-full justify-center items-center w-full space-y-6"
                validationBehavior="native"
                validationErrors={errors}
                onReset={() => setSubmitted(null)}
                onSubmit={onSubmit}
                id="lesForm"
                >
                    <Input
                        defaultValue={editingLes?.omschrijving}
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
                    <Input
                        defaultValue={editingLes?.tijdsduur?.toString()}
                        isRequired
                        errorMessage={({validationDetails}) => {
                            if (validationDetails.valueMissing) {
                            return "Voer een tijdsduur in";
                            }

                            return "omschrijving is incorrect";
                        }}
                        label="Tijdsduur"
                        labelPlacement="outside"
                        name="tijdsduur"
                        placeholder="Voer een tijdsduur in"
                        type="number"
                    />
            </Form>
    );
}
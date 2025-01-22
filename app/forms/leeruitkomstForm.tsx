import { Form, Input } from "@nextui-org/react";
import React, { FormEvent } from "react";
import { Leeruitkomst } from "../types/types";

type LeeruitkomstFormProps = {
    onderwijscode?: String;
    setSavedLeeruitkomst: (value: Leeruitkomst | null, isEdit: boolean) => void;
    editingLeeruitkomst?: Partial<Leeruitkomst> | undefined;
};

export const LeeruitkomstForm: React.FC<LeeruitkomstFormProps> = ({ onderwijscode, setSavedLeeruitkomst, editingLeeruitkomst }) => {
    
    const [errors, setErrors] = React.useState({});
    const [submitted, setSubmitted] = React.useState(null);

    const onSubmit: ((event: FormEvent<HTMLFormElement>) => void) | undefined = (e: any) => {
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        e.preventDefault();
        const leeruitkomst: Leeruitkomst = {
            naam: data.Naam.toString(),
            omschrijving: data.Omschrijving.toString(),
            id: (editingLeeruitkomst?.id ?? 0),
            leereenheden: editingLeeruitkomst?.leereenheden ?? []
        }  

        if(leeruitkomst != null){
            setSavedLeeruitkomst(leeruitkomst!, editingLeeruitkomst !== undefined);
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
                        defaultValue={editingLeeruitkomst?.naam}
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
                        defaultValue={editingLeeruitkomst?.omschrijving}
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
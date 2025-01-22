import { Form, Input, Select, SelectItem } from "@nextui-org/react";
import React, { FormEvent, useEffect } from "react";
import { Beoordeling, Methodiek } from "../types/types";
import { getMethodieken } from "../apiService";

type BeoordelingFormProps = {
    onderwijscode?: String;
    setSavedBeoordeling: (value: Beoordeling | null, isEdit: boolean) => void;
    editingBeoordeling?: Partial<Beoordeling> | undefined;
};

export const BeoordelingForm: React.FC<BeoordelingFormProps> = ({ onderwijscode, setSavedBeoordeling, editingBeoordeling }) => {
    const [errors, setErrors] = React.useState({});
    const [submitted, setSubmitted] = React.useState(null);
    const [methodieken, setMethodieken] = React.useState<Methodiek[]>();
    const [selectedMethodiek, setSelectedMethodiek] = React.useState<Methodiek | undefined>();
    const onSubmit: ((event: FormEvent<HTMLFormElement>) => void) | undefined = (e: any) => {
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        e.preventDefault();
        const beoordeling: Beoordeling = {
            onderbouwing: data.Onderbouwing.toString(), 
            minimaleLeereenheden: Number(data.MinimaleLeereenheden),
            omschrijving: data.Omschrijving.toString(),
            methodiek: selectedMethodiek ?? editingBeoordeling?.methodiek!,
            id: (editingBeoordeling?.id ?? 0),
        }  

        if(onderwijscode !== undefined) {
            if(beoordeling !== null) {
                setSavedBeoordeling(beoordeling!, editingBeoordeling !== undefined);
            }
        }
    }

    useEffect(() => { 
        getMethodieken().then(setMethodieken);
    }, []);
    
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
                        defaultValue={editingBeoordeling?.onderbouwing}
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
                        defaultValue={editingBeoordeling?.minimaleLeereenheden?.toString()}
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
                        defaultValue={editingBeoordeling?.omschrijving}
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
                    <Select defaultSelectedKeys={editingBeoordeling?.methodiek ? [editingBeoordeling.methodiek.id.toString()] : undefined} label="Selecteer een methodiek" name="Beoordeling" onChange={(e) => {
                        const selected = methodieken?.find(methodiek => methodiek.id === Number(e.target.value));
                        setSelectedMethodiek(selected);
                    }}>
                        {methodieken ? methodieken.map((methodiek) => (
                            <SelectItem key={methodiek.id}>{methodiek.naam}</SelectItem>
                        )) : null}
                    </Select>
            </Form>
    );
}

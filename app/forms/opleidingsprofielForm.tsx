import { Form, Input, Select, SelectItem } from "@nextui-org/react";
import React, { FormEvent, useEffect } from "react";
import { Opleiding, Opleidingsprofiel } from "../types/types";
import { getOpleidingen, postOpleiding, postOpleidingsprofiel } from "../apiService";


export default function OpleidingsprofielForm() {
    
    const [errors, setErrors] = React.useState({});
    const [submitted, setSubmitted] = React.useState(null);
    const [opleidingen, setOpleidingen] = React.useState<Opleiding[]>([]);
    const [selectedOpleiding, setSelectedOpleiding] = React.useState<Opleiding | undefined>();

    const onSubmit: ((event: FormEvent<HTMLFormElement>) => void) | undefined = (e: any) => {
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        e.preventDefault();
        const opleidingsprofiel: Partial<Opleidingsprofiel> = {
            naam: data.Naam.toString(),
            opleiding: selectedOpleiding
        }  

        postOpleidingsprofiel(opleidingsprofiel);
    }

    useEffect(() => {
        getOpleidingen().then((data) => {
            setOpleidingen(data);
        });
    }, []);
    
    return (
     <Form
                className="w-full justify-center items-center w-full space-y-6"
                validationBehavior="native"
                validationErrors={errors}
                onReset={() => setSubmitted(null)}
                onSubmit={onSubmit}
                id="opleidingsprofielForm"
                >
                    <Input
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
                    <Select label="Selecteer een beoordeling" name="Beoordeling" onChange={(e) => {
                        const selected = opleidingen?.find(opleiding => opleiding.id === Number(e.target.value));
                        setSelectedOpleiding(selected);
                    }}>
                        {opleidingen ? opleidingen.map((opleiding) => (
                            <SelectItem key={opleiding.id}>{opleiding.naam}</SelectItem>
                        )) : null}
                    </Select>
            </Form>
    );
}
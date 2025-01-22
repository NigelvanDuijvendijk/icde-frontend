import { Form, Input } from "@nextui-org/react";
import React, { FormEvent } from "react";
import { postOnderwijseenheid } from "../apiService";
import { Onderwijseenheid } from "../types/types";

export default function OnderwijseenheidForm() {
    const [errors, setErrors] = React.useState({});
    const [submitted, setSubmitted] = React.useState(null);

    const onSubmit: ((event: FormEvent<HTMLFormElement>) => void) | undefined = (e: any) => {
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        e.preventDefault();
        const onderwijseenheid: Partial<Onderwijseenheid> = {
            naam: data.Naam.toString(),
            studiepunten: Number(data.Studiepunten),
            onderwijscode: data.Onderwijscode.toString(),
            omschrijving: data.Omschrijving.toString(),
            doel: data.Doel.toString(),
            samenhang: data.Samenhang.toString(),
            version: 0,
            isPublished: true
        } 
        postOnderwijseenheid(onderwijseenheid);
    }
    
    return (
    <Form
        className="w-full justify-center items-center w-full space-y-6"
        validationBehavior="native"
        validationErrors={errors}
        onReset={() => setSubmitted(null)}
        onSubmit={onSubmit}
        id="onderwijseenheidForm"
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
                    return "Voer het aantal studiepunten in";
                    }

                    return "Studiepunten aantal is incorrect";
                }}
                label="Studiepunten"
                labelPlacement="outside"
                name="Studiepunten"
                placeholder="Voer het aantal studiepunten in"
            />
            <Input
                isRequired
                errorMessage={({validationDetails}) => {
                    if (validationDetails.valueMissing) {
                    return "Voer een onderwijscode in";
                    }

                    return "onderwijscode is incorrect";
                }}
                label="Onderwijscode"
                labelPlacement="outside"
                name="Onderwijscode"
                placeholder="Voer een onderwijscode in"
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
            <Input
                isRequired
                errorMessage={({validationDetails}) => {
                    if (validationDetails.valueMissing) {
                    return "Voer een doel in";
                    }

                    return "doel is incorrect";
                }}
                label="Doel"
                labelPlacement="outside"
                name="Doel"
                placeholder="Voer een doel in"
            />
                <Input
                isRequired
                errorMessage={({validationDetails}) => {
                    if (validationDetails.valueMissing) {
                    return "Voer een samenhang in";
                    }

                    return "samenhang is incorrect";
                }}
                label="Samenhang"
                labelPlacement="outside"
                name="Samenhang"
                placeholder="Voer een samenhang in"
            />
        </Form>
    );
}
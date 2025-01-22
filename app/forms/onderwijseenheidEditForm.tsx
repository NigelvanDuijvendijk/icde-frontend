import { Form, Input } from "@nextui-org/react";
import React, { FormEvent } from "react";
import { Onderwijseenheid } from "../types/types";

type OnderwijseenheidEditFormProps = {
    onderwijseenheid?: Partial<Onderwijseenheid>;
    setOnderwijseenheid: (value: Partial<Onderwijseenheid> | null) => void;
};

export const OnderwijseenheidEditForm: React.FC<OnderwijseenheidEditFormProps> = ({ onderwijseenheid, setOnderwijseenheid }) => {
    const [errors, setErrors] = React.useState({});
    const [submitted, setSubmitted] = React.useState(null);

    const onSubmit: ((event: FormEvent<HTMLFormElement>) => void) | undefined = (e: any) => {
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        e.preventDefault();
        onderwijseenheid!.naam = data.Naam.toString();
        onderwijseenheid!.studiepunten = parseInt(data.Studiepunten.toString());
        onderwijseenheid!.onderwijscode = data.Onderwijscode.toString();
        onderwijseenheid!.omschrijving = data.Omschrijving.toString();
        onderwijseenheid!.doel = data.Doel.toString();
        onderwijseenheid!.samenhang = data.Samenhang.toString();
        onderwijseenheid!.isPublished = false;
        if(onderwijseenheid !== undefined) {
            setOnderwijseenheid(onderwijseenheid!);
        }
    }
    
    return (
    <Form
        className="w-full justify-center items-center w-full space-y-6"
        validationBehavior="native"
        validationErrors={errors}
        onReset={() => setSubmitted(null)}
        onSubmit={onSubmit}
        id="onderwijseenheidEditForm"
        >
            <Input
                isRequired 
                defaultValue={onderwijseenheid?.naam}
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
                defaultValue={onderwijseenheid?.studiepunten?.toString()}
                errorMessage={({validationDetails}) => {
                    if (validationDetails.valueMissing) {
                    return "Voer het aantal studiepunten in";
                    }

                    return "Studiepunten aantal is incorrect";
                }}
                label="Studiepunten"
                labelPlacement="outside"
                type="number"
                name="Studiepunten"
                placeholder="Voer het aantal studiepunten in"
            />
            <Input
                isRequired
                defaultValue={onderwijseenheid?.onderwijscode}
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
                defaultValue={onderwijseenheid?.omschrijving}
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
                defaultValue={onderwijseenheid?.doel}
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
                defaultValue={onderwijseenheid?.samenhang}
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
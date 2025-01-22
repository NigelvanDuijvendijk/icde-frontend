import { Form, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import React, { FormEvent } from "react";
import { exportFormatToString, formats, stringToExportFormat, Template } from "../types/types";

type TemplateFormProps = {
    setSavedTemplate: (template: Partial<Template>, isEdit: boolean) => void;
    editingTemplate?: Partial<Template> | undefined;
};

export const TemplateForm: React.FC<TemplateFormProps> = ({ editingTemplate, setSavedTemplate }) => {
    
    const [errors, setErrors] = React.useState({});
    const [submitted, setSubmitted] = React.useState(null);
    const [structuur, setStructuur] = React.useState<string | undefined>();

    const onSubmit: ((event: FormEvent<HTMLFormElement>) => void) | undefined = (e: any) => {
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        e.preventDefault();
        const template: Partial<Template> = {
            naam: data.Naam.toString(),
            structuur: structuur ?? editingTemplate?.structuur,
            exportFormaat: data.ExportFormaat ? stringToExportFormat(data.ExportFormaat.toString()) : (editingTemplate?.exportFormaat ? stringToExportFormat(editingTemplate.exportFormaat.toString()) : undefined),     
            id: (editingTemplate?.id ?? 0),
        }  

        setSavedTemplate(template, editingTemplate !== undefined);
    }
    
    return (
     <Form
                className="w-full justify-center items-center w-full space-y-6"
                validationBehavior="native"
                validationErrors={errors}
                onReset={() => setSubmitted(null)}
                onSubmit={onSubmit}
                id="templateForm"
                >
                    <Input
                        defaultValue={editingTemplate?.naam}
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
                    <Select label="Select an export format" name="ExportFormaat"
                        defaultSelectedKeys={editingTemplate?.exportFormaat ? [exportFormatToString(editingTemplate?.exportFormaat).toLowerCase()] : undefined}>
                        {formats.map((format) => (
                            <SelectItem key={format.key}>{format.label}</SelectItem>
                        ))}
                    </Select>
                    <Textarea defaultValue={editingTemplate?.structuur} fullWidth labelPlacement="outside" name="Structuur" label="structuur" placeholder="" onValueChange={(value) => setStructuur(value)} />

            </Form>
    );
}
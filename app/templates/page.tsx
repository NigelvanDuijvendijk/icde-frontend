'use client';
import Head from "next/head";
import { Template } from "../types/types";
import React, { useState }  from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    getKeyValue,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
  } from "@nextui-org/react";
import { deleteTemplate, getTemplates, postTemplate } from "../apiService";
import { TemplateForm } from "../forms/templateForm";
import NotAllowed from "../ui-components/NotAllowed";
import { useAuth } from "../contexts/AuthProvider";

export default function Templates() {

    const [templates, setTemplates] = useState<Partial<Template>[] | undefined>([]);
    const [editingTemplate, setEditingTemplate] = useState<Partial<Template> | undefined>();

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const { user, authenticationToken } = useAuth();

    const templateColumns: any[] | undefined  = [
        {
          key: "naam",
          label: "Naam"
        },
        {
          key: "structuur",
          label: "Structuur" 
        },
        {
            key: "exportFormaat",
            label: "ExportFormaat" 
        },
        {
            key: "bewerken",
            label: "Bewerken"
        },
        {
            key: "verwijderen",
            label: "Verwijderen"
        }
    ]

    const renderCellTemplate = React.useCallback((template: Partial<Template>, columnKey: string | number) => {
        const cellValue = template![columnKey as keyof Template];
        switch (columnKey) {
            case "verwijderen":
                return (
                    <Button onPress={() => {
                        if (template.id !== undefined) {
                            removeTemplate(template);
                        }
                    }} color="primary">Verwijderen</Button>
                );
            case "bewerken":
                return (
                    <Button onPress={() => {
                        onOpen();
                        setEditingTemplate(template);
                    }} color="primary">Bewerken</Button>
                );
            default: 
                return cellValue as React.ReactNode; 
        }
    }, [templates]);

    React.useEffect(() => { 
        if (authenticationToken !== undefined){
            getTemplates().then(setTemplates);        
        }
      }, [authenticationToken]);

    function removeTemplate (template: Partial<Template>) {
        setTemplates(templates?.filter((m) => m.id !== template.id));
        if (template.id !== undefined) {
            deleteTemplate(template.id);
        }
    }
    
    function setSavedTemplate (template: Partial<Template>, isEdit: boolean) {
        if (isEdit) {
            setTemplates(templates?.map((m) => m.id === template.id ? template : m));
        } else {
            setTemplates([...(templates || []), template]);
        }
       postTemplate(template);
    }
    
    return (
        <>
        { user !== undefined && authenticationToken !== undefined ?
        <div className="flex justify-center items-center">
            <Head> 
                <title>Templates</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="vh-100 d-flex justify-content-center align-items-center">

            <Button onPress={onOpen} className="mb-2 mt-2" color="primary" >Nieuw</Button>
            <Modal size="full" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Template toevoegen</ModalHeader>
                        <ModalBody>
                            <TemplateForm setSavedTemplate={setSavedTemplate} editingTemplate={editingTemplate}  />
                        </ModalBody>
                        <ModalFooter>
                        <Button color="danger" variant="light" onPress={() => {onClose(); setEditingTemplate(undefined)}}>
                            Close
                        </Button>
                        <Button type="submit" form='templateForm' color="primary" onPress={() => {onClose(); setEditingTemplate(undefined)}}>
                            Opslaan
                        </Button>
                        </ModalFooter>
                    </>
                    )}
                </ModalContent>
            </Modal>
            <Table aria-label="Example table with dynamic content" className="w-full min-w-max table-auto text-left">
                <TableHeader columns={templateColumns} >
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={templates}>
                    {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCellTemplate(item, columnKey)}</TableCell>}
                    </TableRow>
                    )}
                </TableBody>
            </Table>
            </main>
        </div>
        : <NotAllowed/>
        }
        </>
    );
}
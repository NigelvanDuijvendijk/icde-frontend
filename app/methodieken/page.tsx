'use client';
import Head from "next/head";
import { Methodiek } from "../types/types";
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
import { deleteMethodiek, getMethodieken, postMethodiek } from "../apiService";
import { MethodiekenForm } from "../forms/methodiekenForm";
import { useAuth } from "../contexts/AuthProvider";
import NotAllowed from "../ui-components/NotAllowed";

export default function Methodieken() {

    const [methodieken, setMethodieken] = useState<Partial<Methodiek>[] | undefined>([]);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const { user, authenticationToken } = useAuth();
    const [editingMethodiek, setEditingMethodiek] = useState<Partial<Methodiek> | undefined>();

    const methodiekColumns: any[] | undefined  = [
        {
          key: "naam",
          label: "Naam"
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

    React.useEffect(() => { 
        if (authenticationToken !== undefined){
            getMethodieken().then(setMethodieken);
        }
      }, [authenticationToken]);

    const renderCellMethodieken = React.useCallback((methodiek: Partial<Methodiek>, columnKey: string | number) => {
        const cellValue = methodiek![columnKey as keyof Methodiek];
        switch (columnKey) {
            case "verwijderen":
                return (
                    <Button onPress={() => {
                        if (methodiek.id !== undefined) {
                            removeMethodiek(methodiek);
                        }
                    }} color="primary">Verwijderen</Button>
                );
            case "bewerken":
                return (
                    <Button onPress={() => {
                        setEditingMethodiek(methodiek);
                        onOpen();
                    }} color="primary">Bewerken</Button>
                );
            default: 
                return cellValue as React.ReactNode; 
        }
    }, [methodieken]);

    function removeMethodiek (methodiek: Partial<Methodiek>) {
        setMethodieken(methodieken?.filter((m) => m.id !== methodiek.id));
        if (methodiek.id !== undefined) {
            deleteMethodiek(methodiek.id);
        }
    }
    function setSavedMethodiek (methodiek: Partial<Methodiek>, isEdit: boolean) {
        if (isEdit) {
            setMethodieken(methodieken?.map((m) => m.id === methodiek.id ? methodiek : m));
        } else {
            setMethodieken([...(methodieken || []), methodiek]);
        }

        postMethodiek(methodiek);
    }

    return (
        <>
        { user !== undefined && authenticationToken !== undefined ?

        <div className="flex justify-center items-center">
            <Head> 
                <title>Methodieken</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="vh-100 d-flex justify-content-center align-items-center">

            <Button onPress={onOpen} className="mb-2 mt-2" color="primary" >Nieuw</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Methodiek toevoegen</ModalHeader>
                        <ModalBody>
                            <MethodiekenForm setSavedMethodiek={setSavedMethodiek} editingMethodiek={editingMethodiek}/>
                        </ModalBody>
                        <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Close
                        </Button>
                        <Button type="submit" form='methodiekForm' color="primary" onPress={() => {onClose(); setEditingMethodiek(undefined)}}>
                            Opslaan
                        </Button>
                        </ModalFooter>
                    </>
                    )}
                </ModalContent>
            </Modal>
            <Table aria-label="Example table with dynamic content" className="w-full min-w-max table-auto text-left">
                <TableHeader columns={methodiekColumns} >
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={methodieken}>
                    {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCellMethodieken(item, columnKey)}</TableCell>}
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
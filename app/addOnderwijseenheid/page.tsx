'use client';

import Head from "next/head";
import React, { use, useEffect, useState }  from "react";
import { FormEvent } from "react";
import {Accordion, AccordionItem} from "@nextui-org/accordion";
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
    Selection
  } from "@nextui-org/react";

import {LeerbronForm} from "../forms/LeerbronForm";
import {BeoordelingForm} from "../forms/BeoordelingForm";
import {LeeruitkomstForm} from "../forms/leeruitkomstForm"; 
import { Beoordeling, Leerbron, Leereenheid, Leeruitkomst, Onderwijseenheid } from "../types/types";
import { getBeoordelingen, getLeerbronnen, getLeereenheden, getLeeruitkomsten, getOnderwijseenheid } from "../apiService";
import { LeereenheidForm } from "../forms/leereenheidForm";

export default function addOnderwijseenheid() {
    const [errors, setErrors] = React.useState({});
    const [submitted, setSubmitted] = React.useState(null);
    const [selectedLeeruitkomst, setSelectedLeeruitkomst] = useState<number | undefined>(1);
    const [onderwijseenheid, setOnderwijseenheid] = useState<Partial<Onderwijseenheid> | undefined>({});
    const [leeruitkomsten, setLeeruitkomsten] = useState<Partial<Leeruitkomst>[] | undefined>([]);
    const [beoordelingen, setBeoordelingen] = useState<Partial<Beoordeling>[] | undefined>([]);
    const [leerbronnen, setLeerbronnen] = useState<Partial<Leerbron>[] | undefined>([]);
    const [leereenheden, setLeereenheden] = useState<Partial<Leereenheid>[] | undefined>([]);

    const modal1 = useDisclosure()
    const modal2 = useDisclosure()
    const modal3 = useDisclosure()
    const modal4 = useDisclosure() 


    React.useEffect(() => {
        const onderwijscode: String = window.location.search.split('=')[1];
        if (onderwijscode) {
            console.log(onderwijscode);
            getOnderwijseenheid(onderwijscode).then((value: Onderwijseenheid | undefined) => { 
                setOnderwijseenheid(value);
                getBeoordelingen(value!.id).then((setBeoordelingen));
                getLeerbronnen(value?.id!).then((setLeerbronnen));
                getLeeruitkomsten(String(value?.id)).then((value: Leeruitkomst[] | undefined) => {
                    if(value != undefined) {
                        setLeeruitkomsten(value);
                        getLeereenheden(value![0].id).then((setLeereenheden));
                    }
                });
            });
        }
    }, []);

    const LeeruitkomstColumns: any[] | undefined  = [
        {
          key: "naam",
          label: "Naam"
        },
        {
          key: "omschrijving",
          label: "Omschrijving" 
        },
    ]

    const LeereenheidColumns: any[] | undefined  = [
        {
          key: "naam",
          label: "Naam"
        },
        {
          key: "omschrijving",
          label: "Omschrijving"
        },
    ]

    const BeoordelingenColumns: any[] | undefined  = [
        {
            key: "code",
            label: "Code"
        },
        {
            key: "onderbouwing",
            label: "Onderbouwing"
        },
        {
            key: "minimaleLeereenheden",
            label: "MinimaleLeereenheden"
        },
        {
            key: "omschrijving",
            label: "Omschrijving"
        },
    ]

    const LeerbronnenColumns: any[] | undefined  = [
        {
          key: "naam",
          label: "Naam"
        },
        {
          key: "link",
          label: "Link"
        },
    ]
    
    const LessenColumns: any[] | undefined  = [
        {
          key: "tijdsduur",
          label: "Tijdsduur"
        },
        {
          key: "omschrijving",
          label: "Omschrijving"
        },
    ]

    const LeeruitkomstRows: any[] | undefined = [
        {
          key: "1",
          Id: 1,
          Naam: "Software development",
          Omschrijving: "fsdfsdfsdf", 
        }
      ]

    return (
        <div className="flex justify-center items-center pt-6">
            <Head>
                <title>Onderwijseenheid toevoegen</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>

            <Modal
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                isOpen={modal1.isOpen}
                onOpenChange={modal1.onOpenChange}
            >
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Leeruitkomst toevoegen</ModalHeader>
                    <ModalBody>
                        <LeeruitkomstForm onderwijseenheidId={onderwijseenheid?.id}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                        Close
                        </Button>
                        <Button type="submit" form='leeruitkomstForm' color="primary" onPress={() => {onClose();}}>
                            Opslaan
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>

            <Modal
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                isOpen={modal2.isOpen}
                onOpenChange={modal2.onOpenChange}
            >
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Beoordeling toevoegen</ModalHeader>
                    <ModalBody>
                        <BeoordelingForm onderwijseenheidId={onderwijseenheid?.id} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                        Close
                        </Button>
                        <Button type="submit" form='beoordelingForm' color="primary" onPress={() => {onClose();}}>
                            Opslaan
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>

            <Modal
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                isOpen={modal3.isOpen}
                onOpenChange={modal3.onOpenChange}
            >
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Leerbron toevoegen</ModalHeader>
                    <ModalBody>
                        <LeerbronForm onderwijseenheidId={onderwijseenheid?.id}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Close
                        </Button>
                        <Button type="submit" form='leerbronForm' color="primary" onPress={() => {onClose();}}>
                            Opslaan
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>

            <Modal
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                isOpen={modal4.isOpen}
                onOpenChange={modal4.onOpenChange}
            >
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Leereenheid toevoegen aan {selectedLeeruitkomst?.toString()}</ModalHeader>
                    <ModalBody>
                        <LeereenheidForm leeruitkomstId={selectedLeeruitkomst} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Close
                        </Button>
                        <Button type="submit" form='leereenheidForm' color="primary" onPress={() => {onClose();}}>
                            Opslaan
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>

            <h1 className="mb-6">Onderwijseenheid aanpassen</h1>
            <h3>{onderwijseenheid?.naam}</h3>

            <Accordion className="pt-6 w-full" variant="splitted">
                <AccordionItem key="1" aria-label="Leeruitkomsten" title="Leeruitkomsten">
                    <div>
                        <Button color="primary" onPress={modal1.onOpen} className="mb-2">Nieuw</Button>
                        <Table aria-label="Example table with dynamic content" className="w-full min-w-max table-auto text-left mb-6" selectionMode="single"  defaultSelectedKeys={["1"]}
                            onSelectionChange={(selected: Selection) => {
                                setSelectedLeeruitkomst(Number(Array.from(selected)[0])); 
                                if(Array.from(selected).length > 0) {
                                    getLeereenheden(Number(Array.from(selected)[0])).then((value: Leereenheid[] | undefined) => {
                                        if(value != undefined) {
                                            setLeereenheden(value);
                                        }
                                    });
                                }
                            }} >
                            <TableHeader columns={LeeruitkomstColumns} > 
                                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                            </TableHeader>
                            <TableBody items={leeruitkomsten}>
                                {(item) => (
                                <TableRow key={item.id}> 
                                    {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                                </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <h3 className="mb-2">Leereenheden (Selecteer een leeruitkomst om de leereenheden aan te passen)</h3>
                        <Button color="primary" isDisabled={selectedLeeruitkomst == undefined || selectedLeeruitkomst == undefined} onPress={modal4.onOpen} className="mb-2">Nieuw</Button>
                        <Table aria-label="Example table with dynamic content" className="w-full min-w-max table-auto text-left" selectionMode="single">
                            <TableHeader columns={LeereenheidColumns} > 
                                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                            </TableHeader>
                            <TableBody items={leereenheden}> 
                                {(item) => (
                                <TableRow key={item.id}> 
                                    {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                                </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </AccordionItem>
                <AccordionItem key="4" aria-label="Beoordelingen" title="Beoordelingen">
                    <div>
                    <Button color="primary" onPress={modal2.onOpen} className="mb-2">Nieuw</Button>
                    <Table aria-label="Example table with dynamic content" className="w-full min-w-max table-auto text-left">
                            <TableHeader columns={BeoordelingenColumns} >
                                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                            </TableHeader>
                            <TableBody items={beoordelingen}>
                                {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                                </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </AccordionItem>
                <AccordionItem key="5" aria-label="Leerbronnen" title="Leerbronnen">
                    <div>
                    <Button color="primary" onPress={modal3.onOpen} className="mb-2">Nieuw</Button>
                    <Table aria-label="Example table with dynamic content" className="w-full min-w-max table-auto text-left">
                            <TableHeader columns={LeerbronnenColumns} >
                                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                            </TableHeader>
                            <TableBody items={leerbronnen}>
                                {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                                </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </AccordionItem>
                {/* <AccordionItem key="6" aria-label="Lessen" title="Lessen">
                    <div>
                    <Button color="primary" onPress={modal3.onOpen} className="mb-2">Nieuw</Button>
                    <Table aria-label="Example table with dynamic content" className="w-full min-w-max table-auto text-left">
                            <TableHeader columns={LeereenheidColumns} >
                                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                            </TableHeader>
                            <TableBody items={leerbronnen}>
                                {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                                </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </AccordionItem> */}
            </Accordion>
            <div>
                <Button color="danger" className="mt-6 mr-2">Cancel</Button>
                <Button color="success" className="mt-6">Opslaan</Button>
            </div>
            </main>
        </div>
    );
} 
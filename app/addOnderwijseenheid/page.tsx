'use client';

import Head from "next/head";
import React, { useState }  from "react";
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
    Selection,
    Select,
    SelectItem
  } from "@nextui-org/react";
 

import {LeeruitkomstForm} from "../forms/leeruitkomstForm"; 
import { Beoordeling, Leerbron, Leereenheid, Leeruitkomst, Les, Onderwijseenheid, Template, OnderwijseenheidVersion, Opleidingsprofiel } from "../types/types";
import {updateOnderwijseenheid, changeOnderwijseenheidTemplate, deleteLeereenheid, getLessen, getOnderwijseenheid, getTemplates, getOnderwijseenheidVersions, getOnderwijseenheidByVersion, getOpleidingsprofielen } from "../apiService";
import { LeereenheidForm } from "../forms/leereenheidForm";
import { LesForm } from "../forms/lesForm";
import { BeoordelingForm } from "../forms/beoordelingForm";
import { LeerbronForm } from "../forms/leerbronForm";
import { useAuth } from "../contexts/AuthProvider";
import NotAllowed from "../ui-components/NotAllowed";
import { OnderwijseenheidEditForm } from "../forms/onderwijseenheidEditForm";
import { useRouter } from "next/navigation";

export default function AddOnderwijseenheid() {
    const [selectedLeeruitkomst, setSelectedLeeruitkomst] = useState<number | undefined>(undefined);
    const [selectedLeereenheid, setSelectedLeereenheid] = useState<number | undefined>(1);
    const [opleidingsprofielen, setOpleidingsprofielen] = useState<Opleidingsprofiel[] | undefined>(undefined);
    const [selectedOpleidingsprofiel, setSelectedOpleidingsprofiel] = useState<Opleidingsprofiel | undefined>(undefined);
    const [selectedTemplate, setSelectedTemplate] = useState<String | undefined>();
    const [onderwijseenheid, setOnderwijseenheid] = useState<Partial<Onderwijseenheid> | undefined>({});
    const [lessen, setLessen] = useState<Partial<Les>[] | undefined>([]);
    const [templates, setTemplates] = useState<Partial<Template>[] | undefined>([]);
    const [allowed, setAllowed] = useState<Boolean>(true);
    const [onderwijseenheidVersions, setOnderwijseenheidVersions] = useState<OnderwijseenheidVersion[]>([]);
    const [currentVersionIsHeighestVersion, setCurrentVersionIsHeighestVersion] = useState<Boolean>(true);
    const {user, authenticationToken} = useAuth();
    const router = useRouter();

    const [editingLeerbron, setEditingLeerbron] = useState<Partial<Leerbron>| undefined>(undefined);
    const [editingBeoordeling, setEditingBeoordeling] = useState<Partial<Beoordeling>| undefined>(undefined);
    const [editingLeeruitkomst, setEditingLeeruitkomst] = useState<Partial<Leeruitkomst>| undefined>(undefined);
    const [editingLeereenheid, setEditingLeereenheid] = useState<Partial<Leereenheid>| undefined>(undefined);
    const [editingles, setEditingLes] = useState<Partial<Les>| undefined>(undefined);

    const modal1 = useDisclosure()
    const modal2 = useDisclosure()
    const modal3 = useDisclosure()
    const modal4 = useDisclosure() 
    const modal5 = useDisclosure() 
    const modal6 = useDisclosure() 


    React.useEffect(() => {
        const onderwijscode: String = window.location.search.split('=')[1];
        if (onderwijscode) {
            getOnderwijseenheid(onderwijscode).then((value: Onderwijseenheid | undefined) => { 
                value!.version = value!.version! + 1;
                value!.id = 0;
                setOnderwijseenheid(value);
                getOnderwijseenheidVersions(value?.onderwijscode!).then((setOnderwijseenheidVersions));
                getTemplates().then(setTemplates);
                if(value?.template != undefined) {
                    setSelectedTemplate(value?.template.id.toString());
                }
                getOpleidingsprofielen().then(setOpleidingsprofielen);
            });
        }
    }, []);

    React.useEffect(() => {
        if(onderwijseenheid != undefined) {
            if(onderwijseenheid.ontwikkelaars != undefined){
                if(onderwijseenheid!.ontwikkelaars!.find((ontwikkelaar) => ontwikkelaar.email === user?.email) == undefined) {
                    setAllowed(false);
                }else{
                    setAllowed(true);
                }
            }
            setCurrentVersionIsHeighestVersion(currentVersionIsHeighestVersionFunc(onderwijseenheid));
        }
    }, [onderwijseenheid]);

    function currentVersionIsHeighestVersionFunc(onderwijseenheid: Partial<Onderwijseenheid>) :Boolean{
        if(onderwijseenheidVersions != undefined && onderwijseenheid != undefined) { 
            onderwijseenheidVersions.sort((a, b) => (a.version > b.version) ? 1 : -1);
            return onderwijseenheidVersions[onderwijseenheidVersions.length - 1]?.version == onderwijseenheid?.version;
        }
        return false;
    }
    
    function updateOrCreateLeerbron(leerbron: Leerbron | null, isEdit: boolean) {
        if(leerbron != null) {
            var editedOnderwijseenheid = null;

            if(isEdit) {
                const updatedLeerbronnen = onderwijseenheid?.leerbron?.map((item) => item.id === leerbron.id ? leerbron : item);
                editedOnderwijseenheid = {...onderwijseenheid!, leerbron: updatedLeerbronnen};
            } else {
                const updatedLeerbronnen = [...(onderwijseenheid?.leerbron as Leerbron[]), leerbron];
                editedOnderwijseenheid = {...onderwijseenheid!, leerbron: updatedLeerbronnen};
            }

            editedOnderwijseenheid.isPublished = false;

            updateOnderwijseenheid(editedOnderwijseenheid!).then((value) => {
                if(value != null){
                    setOnderwijseenheid(value!);
                }
            });
        }
    }

    function setSavedBeoordeling(beoordeling: Beoordeling | null, isEdit: boolean) {
        if(beoordeling != null) {
            var editedOnderwijseenheid = null;
            if(isEdit) {
                const updatedBeoordelingen = onderwijseenheid?.beoordeling?.map((item) => item.id === beoordeling.id ? beoordeling : item);
                editedOnderwijseenheid = {...onderwijseenheid!, beoordeling: updatedBeoordelingen};
            } else {
                const updatedBeoordelingen = [...(onderwijseenheid?.beoordeling as Beoordeling[]), beoordeling];
                editedOnderwijseenheid = {...onderwijseenheid!, beoordeling: updatedBeoordelingen};
            }

            editedOnderwijseenheid.isPublished = false;

            updateOnderwijseenheid(editedOnderwijseenheid!).then((value) => {
                if(value != null){
                    setOnderwijseenheid(value!);
                }
            });        
        }
    }

    function setSavedLeeruitkomst(leeruitkomst: Leeruitkomst | null, isEdit: boolean) {
        if(leeruitkomst != null) {
            var editedOnderwijseenheid = null;
            if(isEdit) {
                const updatedLeeruitkomsten = onderwijseenheid?.leeruitkomst?.map((item) => item.id === leeruitkomst.id ? leeruitkomst : item);
                editedOnderwijseenheid = {...onderwijseenheid!, leeruitkomst: updatedLeeruitkomsten};
            } else {
                const updatedLeeruitkomsten = [...(onderwijseenheid?.leeruitkomst as Leeruitkomst[]), leeruitkomst];
                editedOnderwijseenheid = {...onderwijseenheid!, leeruitkomst: updatedLeeruitkomsten};
            }

            editedOnderwijseenheid.isPublished = false;
            updateOnderwijseenheid(editedOnderwijseenheid!).then((value) => {
                if(value != null){
                    setOnderwijseenheid(value!);
                }
            });  
        }
    }

    function setSavedOnderwijseenheid(newOnderwijseenheid: Partial<Onderwijseenheid> | null) {
        if(newOnderwijseenheid != null) {
            updateOnderwijseenheid(newOnderwijseenheid!).then((value) => {
                if(value != null){
                    setOnderwijseenheid(value!);
                }
            });  
        }
    }

    function setSavedOpleidingsprofiel(opleidingsprofiel: Opleidingsprofiel | null) {
        if(opleidingsprofiel != null) {
            var editedOnderwijseenheid = null;
            const updatedOpleidingsprofielen = [...(onderwijseenheid?.opleidingsprofielen as Opleidingsprofiel[]), opleidingsprofiel];
            editedOnderwijseenheid = {...onderwijseenheid!, opleidingsprofielen: updatedOpleidingsprofielen};

            editedOnderwijseenheid.isPublished = false;
            updateOnderwijseenheid(editedOnderwijseenheid!).then((value) => {
                if(value != null){
                    setOnderwijseenheid(value!);
                }
            });  
        }
    }

    function setSavedleereenheid(Leereenheid: Leereenheid | null, isEdit: boolean) {
        if(Leereenheid != null) {
            var updatedLeeruitkomsten : Leeruitkomst[] | undefined;
            if(isEdit) {
                const updatedLeereenheden = onderwijseenheid?.leeruitkomst![selectedLeeruitkomst!].leereenheden?.map((item) => item.id === Leereenheid.id ? Leereenheid : item);
                updatedLeeruitkomsten = onderwijseenheid?.leeruitkomst!.map((lu, index) => 
                    index === selectedLeeruitkomst ? { ...lu, leereenheden: updatedLeereenheden! } : lu
                );
            } else {
                const updatedLeereenheden = [...(onderwijseenheid?.leeruitkomst![selectedLeeruitkomst!].leereenheden as Leereenheid[]), Leereenheid];
                updatedLeeruitkomsten = onderwijseenheid?.leeruitkomst!.map((lu, index) => 
                    index === selectedLeeruitkomst ? { ...lu, leereenheden: updatedLeereenheden } : lu
                );
            }
            
            const updatedOnderwijseenheid = {...onderwijseenheid!, leeruitkomst: updatedLeeruitkomsten};
            updatedOnderwijseenheid.isPublished = false;

            updateOnderwijseenheid(updatedOnderwijseenheid!).then((value) => {
                if(value != null){
                    setOnderwijseenheid(value!);
                }
            });

        }
    }

    function removeLeeruitkomst(leeruitkomst: Partial<Leeruitkomst>) {
        if(leeruitkomst !== null) {
            const updatedLeeruitkomsten = onderwijseenheid?.leeruitkomst?.filter((item) => item.id !== leeruitkomst.id);
            const editedOnderwijseenheid = {...onderwijseenheid!, leeruitkomst: updatedLeeruitkomsten};
            editedOnderwijseenheid.isPublished = false;
            setOnderwijseenheid(editedOnderwijseenheid);

            updateOnderwijseenheid(editedOnderwijseenheid!).then((value) => {
                if(value != null){
                    setOnderwijseenheid(value!);
                }
            }); 
        }   
    }

    function removeLeerbron(leerbron: Partial<Leerbron>) {
        if(leerbron !== null) {
            const updatedLeerbronnen = onderwijseenheid?.leerbron?.filter((item) => item.id !== leerbron.id);
            const editedOnderwijseenheid = {...onderwijseenheid!, leerbron: updatedLeerbronnen};
            editedOnderwijseenheid.isPublished = false;
            setOnderwijseenheid(editedOnderwijseenheid);

            updateOnderwijseenheid(editedOnderwijseenheid!).then((value) => {
                if(value != null){
                    setOnderwijseenheid(value!);
                }
            }); 
        }   
    }

    function removeBeoordeling(beoordeling: Partial<Beoordeling>) {
        if(beoordeling !== null) {
            const updatedBeoordelingen = onderwijseenheid?.beoordeling?.filter((item) => item.id !== beoordeling.id);
            const editedOnderwijseenheid = {...onderwijseenheid!, beoordeling: updatedBeoordelingen};
            editedOnderwijseenheid.isPublished = false;
            setOnderwijseenheid(editedOnderwijseenheid);

            updateOnderwijseenheid(editedOnderwijseenheid!).then((value) => {
                if(value != null){
                    setOnderwijseenheid(value!);
                }
            }); 
        }   
    }

    function removeOpleidingsprofiel(opleidingsprofiel: Partial<Opleidingsprofiel>) {
        if(opleidingsprofiel !== null) {
            const updatedOpleidingsprofielen= onderwijseenheid?.opleidingsprofielen?.filter((item) => item.id !== opleidingsprofiel.id);
            const editedOnderwijseenheid = {...onderwijseenheid!, opleidingsprofielen: updatedOpleidingsprofielen};
            editedOnderwijseenheid.isPublished = false;
            setOnderwijseenheid(editedOnderwijseenheid);

            updateOnderwijseenheid(editedOnderwijseenheid!).then((value) => {
                if(value != null){
                    setOnderwijseenheid(value!);
                }
            }); 
        }   
    }

    function save(): ((e: import("@react-types/shared").PressEvent) => void) | undefined {
        return (e: any) => {
            onderwijseenheid!.isPublished = true;
            onderwijseenheid!.version = onderwijseenheid!.version! + 1;
            updateOnderwijseenheid(onderwijseenheid!);
            if (selectedTemplate) {
                changeOnderwijseenheidTemplate(selectedTemplate, onderwijseenheid?.onderwijscode!);
            }
            router.push('/onderwijseenheden');
        }
    }

    function cancel() {
        router.push('/onderwijseenheden');
    }

    function getOnderwijseenheidVersion(version: String) {
        getOnderwijseenheidByVersion(onderwijseenheid?.onderwijscode!, Number(version)).then((value: Onderwijseenheid | undefined) => { 
            setOnderwijseenheid(value);
        });
    }

    const LeeruitkomstColumns: any[] | undefined  = [
        {
          key: "naam",
          label: "Naam"
        },
        {
          key: "omschrijving",
          label: "Omschrijving" 
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

    const LeereenheidColumns: any[] | undefined  = [
        {
          key: "naam",
          label: "Naam"
        },
        {
          key: "omschrijving",
          label: "Omschrijving"
        },
        {
          key: "lessen",
          label: "Lessen"
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

    const BeoordelingenColumns: any[] | undefined  = [
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
        {
            key: "methodiek",
            label: "Methodiek"
        },
        {
            key: "genoegLeereenheden",
            label: "Genoeg Leereenheden"
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

    const LeerbronnenColumns: any[] | undefined  = [
        {
          key: "naam",
          label: "Naam"
        },
        {
          key: "link",
          label: "Link"
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
    
    const LessenColumns: any[] | undefined  = [
        {
          key: "omschrijving",
          label: "Omschrijving"
        },
        {
            key: "tijdsduur",
            label: "Tijdsduur"
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

    const OpleidingsprofielColumns: any[] | undefined  = [
        {
            key: "naam",
            label: "Naam"
        },
        {
            key: "opleiding",
            label: "Opleiding"
        },
        {
            key: "verwijderen",
            label: "Verwijderen"
        }
    ]

    function beoordelingHasEnoughLeereenheden(beoordeling: Partial<Beoordeling>) : boolean {
        //leereenheden from leeruitkomsten
        const leereenheden = onderwijseenheid?.leeruitkomst?.flatMap(lu => lu.leereenheden);
        if (leereenheden === undefined) {
            return false;
        }
        return leereenheden.length >= beoordeling.minimaleLeereenheden!;
    }

    const renderCellLeereenheid = React.useCallback((leereenheid: Partial<Leereenheid>, columnKey: string | number) => {
        const cellValue = leereenheid![columnKey as keyof Leereenheid];
        switch (columnKey) {
            case "lessen":
                return (
                    <Button onPress={() => {
                        setSelectedLeereenheid(leereenheid.id);
                        getLessen(leereenheid.id!).then((setLessen));
                        modal5.onOpen(); 
                    }} color="primary">Bewerken</Button>
                );
            case "bewerken":
                return (
                    <Button onPress={() => {
                        setEditingLeereenheid(leereenheid);
                        modal5.onOpen(); 
                    }} color="primary">Bewerken</Button>
                );
            case "verwijderen":
                return (
                    <Button onPress={() => {
                        if (leereenheid.id !== undefined) {
                            deleteLeereenheid(leereenheid.id);
                        }
                    }} color="primary">Verwijderen</Button>
                );
            default: 
                return cellValue as React.ReactNode; 
        }
    }, [selectedLeeruitkomst, onderwijseenheid]);

    const renderCellLeeruitkomst = React.useCallback((leeruitkomst: Partial<Leeruitkomst>, columnKey: string | number) => {
        const cellValue = leeruitkomst![columnKey as keyof Leeruitkomst];
        switch (columnKey) {
            case "bewerken":
                return (
                    <Button onPress={() => {
                        setEditingLeeruitkomst(leeruitkomst);
                        modal1.onOpen(); 
                    }} color="primary">Bewerken</Button>
                );
            case "verwijderen":
                return (
                    <Button onPress={() => {
                        if (leeruitkomst.id !== undefined) {
                            removeLeeruitkomst(leeruitkomst);
                        }
                    }} color="primary">Verwijderen</Button>
                );
            default: 
                return cellValue as React.ReactNode; 
        }
    }, [onderwijseenheid]);

    const renderCellBeoordeling = React.useCallback((beoordeling: Partial<Beoordeling>, columnKey: string | number) => {
        const cellValue = beoordeling![columnKey as keyof Beoordeling];
        switch (columnKey) {
            case "bewerken":
                return (
                    <Button onPress={() => {
                        setEditingBeoordeling(beoordeling);
                        modal2.onOpen(); 
                    }} color="primary">Bewerken</Button>
                );
            case "genoegLeereenheden": 
                return beoordelingHasEnoughLeereenheden(beoordeling!) ? "Ja" : "Nee";
            case "verwijderen":
                return (
                    <Button onPress={() => {
                        if (beoordeling !== undefined) {
                            removeBeoordeling(beoordeling);
                        }
                    }} color="primary">Verwijderen</Button>
                );
            case "methodiek":
                return (<h3>{beoordeling.methodiek?.naam}</h3>)
            default: 
                return cellValue as React.ReactNode; 
        }
    }, [onderwijseenheid]);

    const renderCellLeerbron = React.useCallback((leerbron: Partial<Leerbron>, columnKey: string | number) => {
        const cellValue = leerbron![columnKey as keyof Leerbron];
        switch (columnKey) {
            case "bewerken":
                return (
                    <Button onPress={() => {
                        setEditingLeerbron(leerbron);
                        modal3.onOpen(); 
                    }} color="primary">Bewerken</Button>
                );
            case "verwijderen":
                return ( <div>
                        {onderwijseenheid &&
                            <Button onPress={() => {
                                if (leerbron.id !== undefined) {
                                    removeLeerbron(leerbron);
                                }
                            }} color="primary">Verwijderen</Button>
                        }
                    </div>
                );
            default: 
                return cellValue as React.ReactNode; 
        }
    }, [onderwijseenheid]);

    const renderCellOpleidingsprofiel = React.useCallback((opleidingsprofiel: Partial<Opleidingsprofiel>, columnKey: string | number) => {
        const cellValue = opleidingsprofiel![columnKey as keyof Opleidingsprofiel];
        switch (columnKey) {
            case "verwijderen":
                return (
                    <Button onPress={() => {
                        if (opleidingsprofiel !== undefined) {
                            removeOpleidingsprofiel(opleidingsprofiel);
                        }
                    }} color="primary">Verwijderen</Button>
                );
            case "opleiding":
                return getKeyValue(opleidingsprofiel.opleiding, 'naam');
            default: 
                return cellValue as React.ReactNode; 
        }
    }, [onderwijseenheid]);

    return (
        <>
        { user !== undefined && authenticationToken !== undefined && allowed && onderwijseenheid ?
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
                        <LeeruitkomstForm editingLeeruitkomst={editingLeeruitkomst} setSavedLeeruitkomst={setSavedLeeruitkomst} onderwijscode={onderwijseenheid?.onderwijscode}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={() => {onClose(); setEditingLeeruitkomst(undefined)}}>
                        Close
                        </Button>
                        <Button type="submit" form='leeruitkomstForm' color="primary" onPress={() => {onClose(); setEditingLeeruitkomst(undefined)}}>
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
                        <BeoordelingForm editingBeoordeling={editingBeoordeling} setSavedBeoordeling={setSavedBeoordeling} onderwijscode={onderwijseenheid?.onderwijscode} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={() => {onClose(); setEditingBeoordeling(undefined)}}>
                        Close
                        </Button>
                        <Button type="submit" form='beoordelingForm' color="primary" onPress={() => {onClose(); setEditingBeoordeling(undefined)}}>
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
                    <ModalHeader className="flex flex-col gap-1">Leerbron</ModalHeader>
                    <ModalBody>
                        <LeerbronForm editLeerbron={editingLeerbron} onderwijscode={onderwijseenheid?.onderwijscode} setSavedLeerbron={updateOrCreateLeerbron} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={() => {onClose(); setEditingLeerbron(undefined)}}>
                            Close
                        </Button>
                        <Button type="submit" form='leerbronForm' color="primary" onPress={() => {onClose(); setEditingLeerbron(undefined)}}>
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
                        <LeereenheidForm editingLeereenheid={editingLeereenheid} leeruitkomstId={selectedLeeruitkomst} setSavedLeereenheid={setSavedleereenheid} />
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

            <Modal
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                isOpen={modal5.isOpen}
                onOpenChange={modal5.onOpenChange}
            >
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Lessen van </ModalHeader>
                    <ModalBody>
                        <Table aria-label="Example table with dynamic content" className="w-full min-w-max table-auto text-left">
                            <TableHeader columns={LessenColumns} >
                                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                            </TableHeader>
                            <TableBody items={lessen}>
                                {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                                </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <LesForm editingLes={editingles} leereenheidId={selectedLeereenheid} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Close
                        </Button>
                        <Button type="submit" form='lesForm' color="primary" onPress={() => {onClose();}}>
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
                isOpen={modal6.isOpen}
                onOpenChange={modal6.onOpenChange}
            >
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Opleidingsprofiel toevoegen</ModalHeader>
                    <ModalBody>
                        <Select label="Selecteer een opleidingsprofiel" name="Opleidingsprofiel" 
                        onChange={(e) => {
                            const selected = opleidingsprofielen?.find(opleidingsprofiel => opleidingsprofiel.id === Number(e.target.value));
                            setSelectedOpleidingsprofiel(selected);
                        }}>
                            {/* filter on not already added opleidingsprofielen */}
                            {opleidingsprofielen ? opleidingsprofielen.filter((opleidingsprofiel) => !onderwijseenheid?.opleidingsprofielen?.some(op => op.id === opleidingsprofiel.id)).map((opleidingsprofiel) => (
                                <SelectItem key={opleidingsprofiel.id}>{opleidingsprofiel.naam}</SelectItem>
                            )) : null}
                        </Select>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={() => 
                            {onClose(); setSelectedOpleidingsprofiel(undefined);}}>
                            Close
                        </Button>
                        <Button type="submit" color="primary" onPress={() => {onClose(); setSavedOpleidingsprofiel(selectedOpleidingsprofiel != undefined ? selectedOpleidingsprofiel : null); setSelectedOpleidingsprofiel(undefined);}}>
                            Toevoegen
                        </Button>
                    </ModalFooter>
                    </>
                )} 
                </ModalContent>
            </Modal>
            <h1 className="mb-6">Onderwijseenheid aanpassen</h1>
            <Select className="mb-3" label="Selecteer een versie" name="VersionSelect" onChange={(e) => getOnderwijseenheidVersion(e.target.value)}>
                {onderwijseenheidVersions!.map((onderwijseenheidVersion) => (
                    <SelectItem key={onderwijseenheidVersion.version}>{"Versie " + onderwijseenheidVersion.version + " (" + onderwijseenheidVersion.updated + ")"}</SelectItem>
                ))}
            </Select>
            
            { onderwijseenheid != undefined && onderwijseenheid.naam != undefined &&
                <div>
                    <OnderwijseenheidEditForm key={`${onderwijseenheid?.version ?? ''}${onderwijseenheid?.id ?? ''}`} onderwijseenheid={onderwijseenheid} setOnderwijseenheid={setSavedOnderwijseenheid} />
                    <Button type="submit" className="mt-4" form='onderwijseenheidEditForm' color="primary">
                            Opslaan
                    </Button>                
                </div>
            }
            <Accordion className="pt-6 w-full" variant="splitted">
                <AccordionItem key="1" aria-label="Leeruitkomsten" title="Leeruitkomsten">
                    <div>
                        <Button color="primary" onPress={modal1.onOpen} className="mb-2">Nieuw</Button>
                        <Table aria-label="Example table with dynamic content" className="w-full min-w-max table-auto text-left mb-6" selectionMode="single"
                            onSelectionChange={(selected: Selection) => {
                                setSelectedLeeruitkomst( onderwijseenheid?.leeruitkomst?.findIndex((lu) => lu.id == Number(Array.from(selected)[0])) ); 
                            }} > 
                            <TableHeader columns={LeeruitkomstColumns} > 
                                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                            </TableHeader>
                            <TableBody items={onderwijseenheid?.leeruitkomst}>
                                {(item) => (
                                <TableRow key={item.id}> 
                                    {(columnKey) => <TableCell>{renderCellLeeruitkomst(item, columnKey)}</TableCell>}
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
                            {/* TODO: fix */}
                            <TableBody items={selectedLeeruitkomst && onderwijseenheid?.leeruitkomst?.at(selectedLeeruitkomst) != undefined ? onderwijseenheid?.leeruitkomst?.at(selectedLeeruitkomst)!.leereenheden : new Array()}> 
                                {(item) => ( 
                                <TableRow key={item.id}> 
                                    {(columnKey) => <TableCell>{renderCellLeereenheid(item, columnKey)}</TableCell>}
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
                            <TableBody items={onderwijseenheid?.beoordeling}>
                                {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => <TableCell>{renderCellBeoordeling(item, columnKey)}</TableCell>}
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
                            <TableBody items={currentVersionIsHeighestVersion ? onderwijseenheid?.leerbron?.filter((item) => (!item.isDeleted)) : onderwijseenheid?.leerbron}>
                                {(item) => (
                                <TableRow>
                                    {(columnKey) => <TableCell key={columnKey}>{renderCellLeerbron(item, columnKey)}</TableCell>}
                                </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </AccordionItem>
                <AccordionItem key="6" aria-label="Opleidingsprofiel" title="Opleidingsprofiel">
                    <div>
                    <Button color="primary" onPress={modal6.onOpen} className="mb-2">Toevoegen</Button>
                    <Table aria-label="Example table with dynamic content" className="w-full min-w-max table-auto text-left">
                            <TableHeader columns={OpleidingsprofielColumns} >
                                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                            </TableHeader>
                            <TableBody items={currentVersionIsHeighestVersion ? onderwijseenheid?.opleidingsprofielen?.filter((item) => (!item.isDeleted)) : onderwijseenheid?.opleidingsprofielen}>
                                {(item) => (
                                <TableRow>
                                    {(columnKey) => <TableCell key={columnKey}>{renderCellOpleidingsprofiel(item, columnKey)}</TableCell>}
                                </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </AccordionItem>
            </Accordion>
            <h3 className="pt-4">Template</h3>
            <Select label="Select an export format" name="ExportFormaat" defaultSelectedKeys={"10"} onChange={(e) => setSelectedTemplate(e.target.value)}>
                {templates!.map((template) => (
                    <SelectItem key={template.id}>{template.naam}</SelectItem>
                ))}
            </Select>
            <div>
                <Button onPress={cancel} color="danger" className="mt-6 mr-2">Cancel</Button>
                <Button color="success" className="mt-6" onPress={save()}>Publiseer</Button>
            </div>
            </main>
        </div>
        : <NotAllowed/>}
        </>
    );
} 
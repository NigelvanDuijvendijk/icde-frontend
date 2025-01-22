'use client';
import Head from "next/head";
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
    Select,
    SelectItem,
  } from "@nextui-org/react";
  
  import { useRouter } from 'next/navigation'
import OnderwijseenheidForm from "../forms/onderwijseenheidForm";
import React from "react";
import { deleteOnderwijseenheid, downloadBeoordeling, downloadOweDescription, getOnderwijseenheden, uploadBeoordeling, uploadOwe } from "../apiService";
import { formats, Onderwijseenheid } from "../types/types";
import { useAuth } from "../contexts/AuthProvider";
import NotAllowed from "../ui-components/NotAllowed";

  const columns: any[] | undefined  = [
      {
        key: "naam",
        label: "Naam"
      },
      {
        key: "ontwikkelaars",
        label: "Ontwikkelaars",
      },
      {
        key: "onderwijscode",
        label: "Onderwijscode"
      },
      {
        key: "compleet",
        label: "Compleet"
      },
      {
        key: "edit",
        label: "Edit"
      },
      {
        key: "Owe",
        label: "Owe beschrijving"
      },
      {
        key: "beoordelingen",
        label: "Beoordelingen"
      },
      {
        key: "verwijderen",
        label: "Verwijderen"
      }
  ]

export default function Onderwijseenheden() { 
  const [rows, setRows] = React.useState<Onderwijseenheid[]>([]);
  const [selectedFormat, setSelectedFormat] = React.useState<string | undefined>();
  const router = useRouter()
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const onderwijseenheidForm  = OnderwijseenheidForm();
  const downloadModal = useDisclosure()
  const { user, authenticationToken } = useAuth();

  async function getRows(): Promise<Onderwijseenheid[]> {
    return getOnderwijseenheden().then((onderwijseenheden) => {
      return onderwijseenheden;
    });
  }

  React.useEffect(() => { 
    if (authenticationToken !== undefined){
      getRows().then(setRows);
    }
  }, [authenticationToken]);

  const renderCell = React.useCallback((onderwijseenheid: Onderwijseenheid, columnKey: string | number) => {
      const cellValue = onderwijseenheid[columnKey as keyof Onderwijseenheid];
      switch (columnKey) {
        case "edit":
            return (
              <Button onPress={() => router.push('/addOnderwijseenheid?id=' + onderwijseenheid.onderwijscode)} color="primary">Bewerken</Button>
            );
        case "verwijderen":
              return (
                <Button onPress={() =>{deleteOnderwijseenheid(onderwijseenheid.onderwijscode)}} color="primary">Verwijderen</Button>
              );
        case "Owe":
            return (
              <span>
                <Button className="mr-2" onPress={() => {downloadOweDescription(onderwijseenheid.onderwijscode, selectedFormat!)}} color="primary">Download</Button>
                <Button onPress={() => {uploadOwe(onderwijseenheid.onderwijscode)}} color="primary">Upload</Button>
              </span>
            );
        case "beoordelingen":
            return ( 
              <span>
                <Button className="mr-2" onPress={() => {downloadBeoordeling(onderwijseenheid.onderwijscode, selectedFormat!)}} color="primary">Download</Button>
                <Button onPress={() => {uploadBeoordeling(onderwijseenheid.onderwijscode)}} color="primary">Upload</Button>
              </span> 
            );
        case "compleet":
            return (
              <input type="checkbox" checked={cellValue as boolean} readOnly/>
            );
        case "ontwikkelaars":
          const value: string = getKeyValue(cellValue, "ontwikkerlaars") as string;
          return value ? value : "Geen ontwikkelaars";
        default: 
          return cellValue as React.ReactNode; 
      }
    }, [selectedFormat]);

    return (
    <>
    { user !== undefined && authenticationToken !== undefined ?
    <div className="flex justify-center items-center">
        <Head>
          <title>Onderwijseenheden</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="vh-100 d-flex justify-content-center align-items-center">
          {/* <Button className="mb-2" color="primary" onPress={() => router.push('/addOnderwijseenheid')}>Nieuw</Button> */}
        <Button className="mb-2 mt-2" color="primary" onPress={onOpen}>Nieuw</Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Onderwijseenheid toevoegen</ModalHeader>
                <ModalBody>
                  {onderwijseenheidForm}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button type="submit" form='onderwijseenheidForm' color="primary" onPress={() => {onClose();}}>
                    Opslaan
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Select label="Selecteer download export type" name="ExportFormaat" className="mb-2" onChange={(event) => setSelectedFormat(event.target.value)}>
                        {formats.map((format) => (
                            <SelectItem key={format.key}>{format.label}</SelectItem>
                        ))}
                    </Select>
          <Table key={selectedFormat} aria-label="Example table with dynamic content" className="w-full min-w-max table-auto text-left">
              <TableHeader columns={columns} >
                  {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={rows}>
                  {(item: Onderwijseenheid) => (
                  <TableRow key={item.onderwijscode + selectedFormat}>
                      {(columnKey) => <TableCell key={columnKey}>{renderCell(item, columnKey)}</TableCell>}
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
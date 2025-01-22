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
    useDisclosure
  } from "@nextui-org/react";
  
import React from "react";
import { deleteOpleidingsprofiel, getOpleidingsprofielen, postOpleidingsprofiel } from "../apiService";
import { Opleidingsprofiel } from "../types/types";
import { useAuth } from "../contexts/AuthProvider";
import NotAllowed from "../ui-components/NotAllowed";
import { OpleidingsprofielForm } from "../forms/opleidingsprofielForm";

  const columns: any[] | undefined  = [
        {
        key: "naam",
        label: "Naam"
        },
        {
        key: "opleiding",
        label: "Opleiding"
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

export default function Opleidingsprofielen() { 
  const [rows, setRows] = React.useState<Opleidingsprofiel[]>([]);
  const [selectedFormat, setSelectedFormat] = React.useState<string | undefined>();
  const [editingOpleidingsprofiel, setEditingOpleidingsprofiel] = React.useState<Opleidingsprofiel | undefined>();
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { user, authenticationToken } = useAuth();

  async function getRows(): Promise<Opleidingsprofiel[]> {
    return getOpleidingsprofielen().then((opleidingsprofielen) => {
      return opleidingsprofielen;
    });
  }

  React.useEffect(() => { 
    if (authenticationToken !== undefined){
      getRows().then(setRows);
    }
  }, [authenticationToken]);

  const renderCell = React.useCallback((opleidingsprofiel: Opleidingsprofiel, columnKey: string | number) => {
      const cellValue = opleidingsprofiel[columnKey as keyof Opleidingsprofiel];
      switch (columnKey) {
        case "bewerken":
            return (
              <Button onPress={() => {onOpen(); setEditingOpleidingsprofiel(opleidingsprofiel)}} color="primary">Bewerken</Button>
            );
        case "verwijderen":
              return (
                <Button onPress={() =>{removeOpleidingsprofiel(opleidingsprofiel)}} color="primary">Verwijderen</Button>
              );
        case "opleiding":
            return getKeyValue(opleidingsprofiel.opleiding, 'naam');
        default: 
          return cellValue as React.ReactNode; 
      }
    }, [selectedFormat]);

    function removeOpleidingsprofiel (opleidingsprofiel: Opleidingsprofiel) {
        setRows(rows?.filter((m) => m.id !== opleidingsprofiel.id));
        if (opleidingsprofiel.id !== undefined) {
          deleteOpleidingsprofiel(opleidingsprofiel.id);
        }
    }

    function setSavedOpleidingsprofiel (opleidingsprofiel: Partial<Opleidingsprofiel>, isEdit: boolean) {
        if (isEdit) {
            setRows(rows.map((row) => row.id === opleidingsprofiel.id ? { ...row, ...opleidingsprofiel } : row));
        } else {
            setRows([...rows, opleidingsprofiel as Opleidingsprofiel]);
        }
        
        postOpleidingsprofiel(opleidingsprofiel);
    }

    return (
    <>
    { user !== undefined && authenticationToken !== undefined ?
    <div className="flex justify-center items-center">
        <Head>
          <title>Opleidingsprofielen</title>
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
                <ModalHeader className="flex flex-col gap-1">Opleidingsprofiel toevoegen</ModalHeader>
                <ModalBody>
                  <OpleidingsprofielForm editingOpleidingsprofiel={editingOpleidingsprofiel} setSavedOpleidingsprofiel={setSavedOpleidingsprofiel} />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={() => {onClose(); setEditingOpleidingsprofiel(undefined)}}>
                    Close
                  </Button>
                  <Button type="submit" form='opleidingsprofielForm' color="primary" onPress={() => {onClose(); setEditingOpleidingsprofiel(undefined)}}>
                    Opslaan
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
          <Table key={selectedFormat} aria-label="Example table with dynamic content" className="w-full min-w-max table-auto text-left">
              <TableHeader columns={columns} >
                  {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={rows}>
                  {(item: Opleidingsprofiel) => (
                  <TableRow key={item.id}>
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
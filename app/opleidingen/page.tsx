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
  } from "@nextui-org/react";
  
  import { useRouter } from 'next/navigation'
import React from "react";
import { deleteOpleiding, getOpleidingen, postOpleiding } from "../apiService";
import { Opleiding } from "../types/types";
import { useAuth } from "../contexts/AuthProvider";
import NotAllowed from "../ui-components/NotAllowed";
import { OpleidingForm } from "../forms/opleidingForm";

  const columns: any[] | undefined  = [
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

export default function Profielen() { 
  const [rows, setRows] = React.useState<Partial<Opleiding>[]>([]);
  const [selectedFormat, setSelectedFormat] = React.useState<string | undefined>();
  const [editingOpleiding, setEditingOpleiding] = React.useState<Partial<Opleiding> | undefined>();
  const router = useRouter()
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { user, authenticationToken } = useAuth();

  async function getRows(): Promise<Opleiding[]> {
    return getOpleidingen().then((opleidingen) => {
      return opleidingen;
    });
  }

  React.useEffect(() => { 
    if (authenticationToken !== undefined){
      getRows().then(setRows);
    }
  }, [authenticationToken]);

  const renderCell = React.useCallback((opleiding: Partial<Opleiding>, columnKey: string | number) => {
      const cellValue = opleiding[columnKey as keyof Opleiding];
      switch (columnKey) {
        case "bewerken":
            return (
              <Button onPress={() => {onOpen(); setEditingOpleiding(opleiding)}} color="primary">Bewerken</Button>
            );
        case "verwijderen":
              return (
                <Button onPress={() => {}} color="primary">Verwijderen</Button>
              );
        default: 
          return cellValue as React.ReactNode; 
      }
    }, [selectedFormat]);

    function removeOpleiding (opleiding: Partial<Opleiding>) {
        setRows(rows?.filter((m) => m.id !== opleiding.id));
        if (opleiding.id !== undefined) {
            deleteOpleiding(opleiding.id);
        }
    }
    function setSavedOpleiding (opleiding: Partial<Opleiding>, isEdit: boolean) {
        if (isEdit) {
            setRows(rows?.map((m) => m.id === opleiding.id ? opleiding : m));
        } else {
            setRows([...(rows || []), opleiding]);
        }

        postOpleiding(opleiding);
    }

    return (
    <>
    { user !== undefined && authenticationToken !== undefined ?
    <div className="flex justify-center items-center">
        <Head>
          <title>Opleidingen</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="vh-100 d-flex justify-content-center align-items-center">
        <Button className="mb-2 mt-2" color="primary" onPress={onOpen}>Nieuw</Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Opleiding toevoegen</ModalHeader>
                <ModalBody>
                  <OpleidingForm setSavedOpleiding={setSavedOpleiding} editingOpleiding={editingOpleiding} />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button type="submit" form='opleidingForm' color="primary" onPress={() => {onClose();}}>
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
                  {(item: Partial<Opleiding>) => (
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
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
import OnderwijseenheidForm from "../forms/onderwijseenheidForm";
import React from "react";
import { getOnderwijseenheden } from "../apiService";
import { Onderwijseenheid } from "../types/types";

  async function getRows(): Promise<Onderwijseenheid[]> {
    return getOnderwijseenheden().then((onderwijseenheden) => {
      console.log(onderwijseenheden);
      return onderwijseenheden;
    });
  }

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
        key: "gevalideerd",
        label: "Gevalideerd"
      },
      {
        key: "edit",
        label: "Edit"
      }
  ]

export default function onderwijseenheden() { 
  const [rows, setRows] = React.useState<Onderwijseenheid[]>([]);
  const router = useRouter()
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const onderwijseenheidForm  = OnderwijseenheidForm();

  React.useEffect(() => { 
    getRows().then(setRows);
  }, []);

  const renderCell = React.useCallback((onderwijseenheid: Onderwijseenheid, columnKey: string | number) => {
      const cellValue = onderwijseenheid[columnKey as keyof Onderwijseenheid];
      switch (columnKey) {
        case "edit":
          const onderwijscode = onderwijseenheid.onderwijscode;
          return (
            <Button onPress={() => router.push('/addOnderwijseenheid?id=' + onderwijscode)} color="primary">Bewerken</Button>
          );
        case "ontwikkelaars":
          const value: string = getKeyValue(cellValue, "ontwikkerlaars") as string;
          return value ? value : "Geen ontwikkelaars";
        default: 
          return cellValue as React.ReactNode; 
      }
    }, []);

    return (
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
          <Table aria-label="Example table with dynamic content" className="w-full min-w-max table-auto text-left">
              <TableHeader columns={columns} >
                  {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={rows}>
                  {(item: Onderwijseenheid) => (
                  <TableRow key={item.onderwijscode}>
                      {(columnKey) => <TableCell key={columnKey}>{renderCell(item, columnKey)}</TableCell>}
                  </TableRow>
                  )}
              </TableBody>
          </Table>
        </main> 
      </div>
    );
  }
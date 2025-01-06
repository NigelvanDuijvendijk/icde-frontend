import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { Beoordeling, Leerbron, Leereenheid, Leeruitkomst, Les, Onderwijseenheid } from './types/types';

async function getOnderwijseenheden(): Promise<Onderwijseenheid[]> {
    let foundOnderwijseenheden: Onderwijseenheid[] = [];

    try {
        const response: AxiosResponse<Onderwijseenheid[]> = await axios.get<Onderwijseenheid[]>('http://localhost:8080/api/onderwijseenheid/');
        foundOnderwijseenheden = response.data;
        console.log(foundOnderwijseenheden);
        return foundOnderwijseenheden;
    } catch (error) {
        console.error(error);
        return []; 
    }
}

async function getOnderwijseenheid(onderwijscode: String): Promise<Onderwijseenheid | undefined> {
    let foundOnderwijseenheid: Onderwijseenheid | undefined = undefined;
    try {
        const response: AxiosResponse<Onderwijseenheid> = await axios.get<Onderwijseenheid>('http://localhost:8080/api/onderwijseenheid/' + onderwijscode);
        foundOnderwijseenheid = response.data;
        return foundOnderwijseenheid;
    } catch (error) {
        console.error(error);
        return foundOnderwijseenheid; 
    }
}

async function postOnderwijseenheid(onderwijseenheid: Onderwijseenheid | Partial<Onderwijseenheid>): Promise<void> {
    axios.post('http://localhost:8080/api/onderwijseenheid/', onderwijseenheid)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error);
    });
}

async function getLeeruitkomsten(onderwijseenheidId: String): Promise<Leeruitkomst[]> {
    let foundLeeruitkomsten: Leeruitkomst[] = [];

    try {
        const response: AxiosResponse<Leeruitkomst[]> = await axios.get<Leeruitkomst[]>('http://localhost:8080/api/leeruitkomst/onderwijseenheid/' + onderwijseenheidId);
        foundLeeruitkomsten = response.data;
        console.log(foundLeeruitkomsten);
        return foundLeeruitkomsten;
    } catch (error) {
        console.error(error);
        return []; 
    }
}

async function postLeeruitkomst(leeruitkomst: Leeruitkomst | Partial<Leeruitkomst>, onderwijseenheidId: Number): Promise<void> {
    console.log(leeruitkomst);
    axios.post('http://localhost:8080/api/leeruitkomst/onderwijseenheid/' + onderwijseenheidId, leeruitkomst)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error);
    });
}

async function getBeoordelingen(onderwijseenheidId: Number): Promise<Beoordeling[]> {
    let foundBeoordelingen: Beoordeling[] = [];

    try {
        console.log(onderwijseenheidId);
        const response: AxiosResponse<Beoordeling[]> = await axios.get<Beoordeling[]>('http://localhost:8080/api/beoordeling/onderwijseenheid/' + onderwijseenheidId);
        foundBeoordelingen = response.data;

        console.log(foundBeoordelingen);
        return foundBeoordelingen;
    } catch (error) {
        console.error(error);
        return []; 
    }
}

async function postBeoordeling(beoordeling: Beoordeling | Partial<Beoordeling>, onderwijseenheidId: Number): Promise<void> {
    axios.post('http://localhost:8080/api/beoordeling/' + onderwijseenheidId, beoordeling)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error);
    });
}

async function getLeerbronnen(onderwijseenheidId: number): Promise<Leerbron[]> {
    let foundLeerbronnen: Leerbron[] = [];

    try {
        console.log(onderwijseenheidId);
        const response: AxiosResponse<Leerbron[]> = await axios.get<Leerbron[]>('http://localhost:8080/api/leerbron/onderwijseenheid/' + onderwijseenheidId);
        foundLeerbronnen = response.data;
        console.log(foundLeerbronnen);
        return foundLeerbronnen;
    } catch (error) {
        console.error(error);
        return []; 
    }
}

async function postLeerbron(leerbron: Leerbron | Partial<Leerbron>, onderwijseenheidId: Number): Promise<void> {
    axios.post('http://localhost:8080/api/leerbron/' + onderwijseenheidId, leerbron)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error);
    });
}

async function getLeereenheden(leeruitkomstId: number): Promise<Leereenheid[]> {
    let foundLeereenheden: Leereenheid[] = [];

    try {
        const response: AxiosResponse<Leereenheid[]> = await axios.get<Leereenheid[]>('http://localhost:8080/api/leereenheid/leeruitkomst/' + leeruitkomstId);
        foundLeereenheden = response.data;
        return foundLeereenheden;
    } catch (error) {
        console.error(error);
        return []; 
    }
}

async function postLeereenheid(leereenheid: Leereenheid | Partial<Leereenheid>, leeruitkomstId: Number): Promise<void> {
    axios.post('http://localhost:8080/api/leereenheid/leeruitkomst/' + leeruitkomstId, leereenheid)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error);
    });
}

export { getOnderwijseenheden, postOnderwijseenheid, getOnderwijseenheid, getLeeruitkomsten, postLeeruitkomst, getBeoordelingen, postBeoordeling, getLeerbronnen, postLeerbron, getLeereenheden, postLeereenheid };
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { AuthenticationToken, Beoordeling, ExportFormaat, exportFormatToString, Leerbron, Leereenheid, Leeruitkomst, Les, Methodiek, Onderwijseenheid, OnderwijseenheidVersion, Ontwikkelaar, Opleiding, Opleidingsprofiel, Template } from './types/types';


async function login(ontwikkelaar: Ontwikkelaar | Partial<Ontwikkelaar>): Promise<AuthenticationToken> {
    try {
        const response: AxiosResponse<AuthenticationToken> = await axios.post('http://localhost:8080/login', ontwikkelaar);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getOpleidingen(): Promise<Opleiding[]> {
    let foundOpleidingen: Opleiding[] = [];

    try {
        const response: AxiosResponse<Opleiding[]> = await axios.get<Opleiding[]>('http://localhost:8080/api/opleiding/');
        foundOpleidingen = response.data;
        return foundOpleidingen;
    } catch (error) {
        console.error(error);
        return []; 
    }
}


async function postOpleiding(opleiding: Opleiding | Partial<Opleiding>): Promise<void> {
    axios.post('http://localhost:8080/api/opleiding/', opleiding);
}

async function getOpleidingsprofielen(): Promise<Opleidingsprofiel[]> {
    let foundOpleidingsprofielen: Opleidingsprofiel[] = [];

    try {
        const response: AxiosResponse<Opleidingsprofiel[]> = await axios.get<Opleidingsprofiel[]>('http://localhost:8080/api/opleidingsprofiel/');
        foundOpleidingsprofielen = response.data;
        return foundOpleidingsprofielen;
    } catch (error) {
        console.error(error);
        return []; 
    }
}

async function postOpleidingsprofiel(opleidingsprofiel: Opleidingsprofiel | Partial<Opleidingsprofiel>): Promise<void> {
    axios.post('http://localhost:8080/api/opleidingsprofiel/', opleidingsprofiel);
}

async function getOnderwijseenheden(): Promise<Onderwijseenheid[]> {
    let foundOnderwijseenheden: Onderwijseenheid[] = [];

    try {
        const response: AxiosResponse<Onderwijseenheid[]> = await axios.get<Onderwijseenheid[]>('http://localhost:8080/api/onderwijseenheid/');
        foundOnderwijseenheden = response.data;
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

async function getOnderwijseenheidByVersion(onderwijscode: String, version: number): Promise<Onderwijseenheid | undefined> {
    let foundOnderwijseenheid: Onderwijseenheid | undefined = undefined;
    try {
        const response: AxiosResponse<Onderwijseenheid> = 
            await axios.get<Onderwijseenheid>('http://localhost:8080/api/onderwijseenheid/' + onderwijscode + "/version/" + version);
        foundOnderwijseenheid = response.data;
        return foundOnderwijseenheid;
    } catch (error) {
        console.error(error);
        return foundOnderwijseenheid; 
    }
}

async function postOnderwijseenheid(onderwijseenheid: Onderwijseenheid | Partial<Onderwijseenheid>): Promise<Onderwijseenheid | null> {
    try {
        const response: AxiosResponse<Onderwijseenheid> = await axios.post<Onderwijseenheid>('http://localhost:8080/api/onderwijseenheid/', onderwijseenheid);
        return response.data;
    } catch (error) {
        console.error(error);
        return null; 
    }
}

async function updateOnderwijseenheid(onderwijseenheid: Onderwijseenheid | Partial<Onderwijseenheid>): Promise<Onderwijseenheid | null> {
    try {
        const response: AxiosResponse<Onderwijseenheid> = await axios.put<Onderwijseenheid>('http://localhost:8080/api/onderwijseenheid/', onderwijseenheid);
        return response.data;
    } catch (error) {
        console.error(error);
        return null; 
    }
}

async function postLeeruitkomst(leeruitkomst: Leeruitkomst | Partial<Leeruitkomst>): Promise<Leeruitkomst | null> {
    return axios.post<Leeruitkomst>('http://localhost:8080/api/leeruitkomst/', leeruitkomst)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error);
            return null;
        });
}

async function postBeoordeling(beoordeling: Beoordeling | Partial<Beoordeling>, onderwijscode: String): Promise<Beoordeling | null> {
    return axios.post<Beoordeling>('http://localhost:8080/api/beoordeling/', beoordeling)
    .then(response => {
        return response.data;
    })
    .catch(error => {
        console.error(error);
        return null;
    });
}

async function postLeerbron(leerbron: Leerbron | Partial<Leerbron>, onderwijscode: String): Promise<Leerbron | null> {
    try {
        const response: AxiosResponse<Leerbron> = await axios.post<Leerbron>('http://localhost:8080/api/leerbron/', leerbron);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function postLeereenheid(leereenheid: Leereenheid | Partial<Leereenheid>, leeruitkomstId: Number): Promise<void> {
    axios.post('http://localhost:8080/api/leereenheid/leeruitkomst/' + leeruitkomstId, leereenheid);
}

async function getLessen(leereenheidId: number): Promise<Les[]> {
    let foundLessen: Les[] = [];

    try {
        const response: AxiosResponse<Les[]> = await axios.get<Les[]>('http://localhost:8080/api/les/leereenheid/' + leereenheidId);
        foundLessen = response.data;
        return foundLessen;
    } catch (error) {
        console.error(error);
        return []; 
    }
}

async function postLes(les: Les | Partial<Les>, leereenheidId: Number): Promise<void> {
    axios.post('http://localhost:8080/api/les/leereenheid/' + leereenheidId, les);
}

async function getTemplates(): Promise<Template[]> {
    let foundTemplates: Template[] = [];

    try {
        const response: AxiosResponse<Template[]> = await axios.get<Template[]>('http://localhost:8080/api/template/');
        foundTemplates = response.data;
        return foundTemplates;
    } catch (error) {
        console.error(error);
        return []; 
    }
}

async function changeOnderwijseenheidTemplate(templateId: String, onderwijscode: String): Promise<void> {
    axios.put('http://localhost:8080/api/onderwijseenheid/' + onderwijscode + "/template/" + templateId, null);
}

async function postTemplate(template: Template | Partial<Template>): Promise<void> {
    axios.post('http://localhost:8080/api/template/', template);
}

async function downloadOweDescription(onderwijscode: String, format: String): Promise<void> {
    // axios.get('http://localhost:8080/api/onderwijseenheid/' + onderwijscode + '/owe-beschrijving/' + exportFormatToString(format));
}

async function getMethodieken(): Promise<Methodiek[]> {
    let foundMethodieken: Methodiek[] = [];

    try {
        const response: AxiosResponse<Methodiek[]> = await axios.get<Methodiek[]>('http://localhost:8080/api/methodiek/');
        foundMethodieken = response.data;
        return foundMethodieken;
    } catch (error) {
        console.error(error);
        return []; 
    }
}

async function postMethodiek(methodiek: Methodiek | Partial<Methodiek>): Promise<void> {
    axios.post('http://localhost:8080/api/methodiek/', methodiek);
}

//delete onderwijseenheid
async function deleteOnderwijseenheid(onderwijscode: String): Promise<void> {
    axios.delete('http://localhost:8080/api/onderwijseenheid/' + onderwijscode);
}

async function deleteLeereenheid(leereenheidId: number): Promise<void> {
    axios.delete('http://localhost:8080/api/leereenheid/' + leereenheidId);
}

async function deleteTemplate(templateId: number): Promise<void> {
    axios.delete('http://localhost:8080/api/template/' + templateId);
}

async function deleteMethodiek(methodiekId: number): Promise<void> {
    axios.delete('http://localhost:8080/api/methodiek/' + methodiekId);
}

async function deleteOpleiding(opleidingId: number): Promise<void> {
    axios.delete('http://localhost:8080/api/opleiding/' + opleidingId);
}

async function deleteOpleidingsprofiel(opleidingsprofielId: number): Promise<void> {
    axios.delete('http://localhost:8080/api/opleidingsprofiel/' + opleidingsprofielId);
}

async function getOnderwijseenheidVersions(onderwijscode: String): Promise<OnderwijseenheidVersion[]> {
    let foundVersions: OnderwijseenheidVersion[] = [];

    try {
        const response: AxiosResponse<OnderwijseenheidVersion[]> = 
            await axios.get<OnderwijseenheidVersion[]>('http://localhost:8080/api/onderwijseenheid/' + onderwijscode +'/versions');
        foundVersions = response.data;

        return foundVersions;
    } catch (error) {
        console.error(error);
        return []; 
    }
}


async function downloadBeoordeling(onderwijscode: String, format: String): Promise<void> {
    axios({
        url: 'http://localhost:8080/api/onderwijseenheid/' + onderwijscode + "/beoordeling/" +  format.toUpperCase(), 
        method: 'GET',
        responseType: 'blob', // important
    }).then((response) => {
        const href = URL.createObjectURL(response.data);
    
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', 'file.' + format.toLowerCase()); //or any other extension
        document.body.appendChild(link);
        link.click();
    
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    });
}

function uploadBeoordeling(onderwijscode: String): Promise<void> {
    return axios.get('http://localhost:8080/api/onderwijseenheid/' + onderwijscode + "/alluris/upload");
}

function uploadOwe(onderwijscode: String): Promise<void> {
    return axios.get('http://localhost:8080/api/onderwijseenheid/' + onderwijscode + "/onderwijsonline/upload");
}

export {login, getOnderwijseenheden, postOnderwijseenheid, getOnderwijseenheid, postLeeruitkomst, postBeoordeling, postLeerbron,
    postLeereenheid, getLessen, postLes, getTemplates, postTemplate, downloadOweDescription, changeOnderwijseenheidTemplate, getMethodieken, postMethodiek, 
    deleteOnderwijseenheid, deleteLeereenheid, deleteTemplate, deleteMethodiek, getOnderwijseenheidVersions, deleteOpleidingsprofiel, uploadBeoordeling, uploadOwe,
    getOnderwijseenheidByVersion, downloadBeoordeling, getOpleidingsprofielen, getOpleidingen, postOpleiding, postOpleidingsprofiel, deleteOpleiding, updateOnderwijseenheid};
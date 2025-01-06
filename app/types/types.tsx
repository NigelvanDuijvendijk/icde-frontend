export type Onderwijseenheid = {
    id: number;
    naam: string;
    onderwijscode: string;
    studiepunten: number;
    doel: string;
    isBeroepsproduct: boolean;
    omschrijving: string;
    samenhang: string;
    studielast: number;
    compleet: boolean;
    leerbron: Leerbron;
    leeruitkomst: Leeruitkomst;
    template: Template;
    beoordeling: Beoordeling;
    ontwikkelaars: Ontwikkelaar[]
    opleidingsprofielen: Opleidingsprofiel[]
};

export type Leerbron = {
    id: number;
    naam: string;
    link: string;
};

export type Leeruitkomst = {
    id: number;
    naam: string;
    omschrijving: string;
    leereenheden: Leereenheid[];
};

export type Leereenheid = {
    id: number;
    naam: string;
    omschrijving: string;
}

export type Template = {
    id: number;
    naam: string;
    structuur: string;
    exportFormaat: ExportFormaat;
};

export type Beoordeling = {
    id: number;
    code: string;
    onderbouwing: string;
    minimaleLeereenheden: number;
    omschrijving: string;
};

export type Ontwikkelaar = {
    id: number;
    email: string;
    isActive: Boolean;
};

export type Opleidingsprofiel = {
    id: number;
    naam: string;
};

export type Opleiding = {
    id: number;
    naam: string;
    opleidingsprofielen: Opleidingsprofiel[]
}

export type Les = {
    id: number;
    naam: string;
    omschrijving: string;
    leerdoelen: Leereenheid[];
}

export enum ExportFormaat {
	PDF,
	XLSX,
	OSV
}

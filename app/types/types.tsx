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
    leerbron: Leerbron[];
    leeruitkomst: Leeruitkomst[];
    template: Template;
    beoordeling: Beoordeling[];
    ontwikkelaars: Ontwikkelaar[]
    opleidingsprofielen: Opleidingsprofiel[]
    version: number;
    isPublished: boolean;
};

export type AuthenticationToken = {
    token: string;
    createdAt: Date;
    expiresAt: Date;
}

export type Leerbron = {
    id: number;
    naam: string;
    link: string;
    isDeleted: boolean;
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
    onderbouwing: string;
    minimaleLeereenheden: number;
    omschrijving: string;
    methodiek: Methodiek;
};

export type Ontwikkelaar = {
    id: number;
    email: string;
    hashedPassword: string;
    isActive: boolean;
};

export type Opleidingsprofiel = {
    id: number; 
    naam: string;
    opleiding: Opleiding;
    isDeleted: boolean;
};

export type Opleiding = {
    id: number;
    naam: string;
    isDeleted: boolean;
}

export type Les = {
    id: number;
    omschrijving: string;
    tijdsduur: number;
    leerdoelen: Leereenheid[];
}

export type Methodiek = {
    id: number;
    naam: string;
    beoordeling: Beoordeling;
}

export type OnderwijseenheidVersion = {
    onderwijscode: string;
    version: number;
    updated: Date;
}

export enum ExportFormaat {
	PDF,
	CSV,
	XLSX
}

export const formats = [
    {
        key: "pdf",
        label: "PDF"
    },
    {
        key: "csv",
        label: "CSV"
    },
    {
        key: "xlsx",
        label: "XLSX"
    }
  ];

export function stringToExportFormat(exportFormat: string): ExportFormaat {
    switch(exportFormat) {
        case "PDF":
            return ExportFormaat.PDF;
        case "CSV":
            return ExportFormaat.CSV;
        case "XLSX":
            return ExportFormaat.XLSX;
        default:
            return ExportFormaat.PDF;
    }
}

export function exportFormatToString(exportFormat: ExportFormaat): string {
    switch(exportFormat) {
        case ExportFormaat.PDF:
            return "PDF";
        case ExportFormaat.CSV:
            return "CSV";
        case ExportFormaat.XLSX:
            return "XLSX";
    }
    return "PDF";
}
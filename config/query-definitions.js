import {
  AGENDAPUNT_SUBJECTS_GRAPH,
  BEHANDELING_VAN_AGENDAPUNT_SUBJECTS_GRAPH,
  BESLUIT_SUBJECTS_GRAPH,
  BESTUURSORGAAN_SUBJECTS_GRAPH,
  MANDATARIS_SUBJECTS_GRAPH,
  STEMMING_SUBJECTS_GRAPH,
} from "../environment";

export const prefixes = {
  besluit: "http://data.vlaanderen.be/ns/besluit#",
  dcterms: "http://purl.org/dc/terms/",
  prov: "http://www.w3.org/ns/prov#",
  mandaat: "http://data.vlaanderen.be/ns/mandaat#",
};

export const queryDefs = {
  agendapunt: {
    type: "besluit:Agendapunt",
    bestuursorgaanPropertyPath: "^besluit:behandelt / besluit:isGehoudenDoor",
    outputGraph: AGENDAPUNT_SUBJECTS_GRAPH,
  },
  behandelingVanAgendapunt: {
    type: "besluit:BehandelingVanAgendapunt",
    bestuursorgaanPropertyPath:
      "dcterms:subject / ^besluit:behandelt / besluit:isGehoudenDoor",
    outputGraph: BEHANDELING_VAN_AGENDAPUNT_SUBJECTS_GRAPH,
  },
  besluit: {
    type: "besluit:Besluit",
    bestuursorgaanPropertyPath:
      "^prov:generated / dcterms:subject / ^besluit:behandelt / besluit:isGehoudenDoor",
    outputGraph: BESLUIT_SUBJECTS_GRAPH,
  },
  bestuursorgaan: {
    type: "besluit:Bestuursorgaan",
    bestuursorgaanPropertyPath: "",
    outputGraph: BESTUURSORGAAN_SUBJECTS_GRAPH,
  },
  mandataris: {
    type: "mandaat:Mandataris",
    bestuursorgaanPropertyPath:
      "^besluit:heeftVoorzitter / dcterms:subject / ^besluit:behandelt / besluit:isGehoudenDoor",
    outputGraph: MANDATARIS_SUBJECTS_GRAPH,
  },
  stemming: {
    type: "besluit:Stemming",
    bestuursorgaanPropertyPath:
      "^besluit:heeftStemming / dcterms:subject / ^besluit:behandelt / besluit:isGehoudenDoor",
    outputGraph: STEMMING_SUBJECTS_GRAPH,
  },
};

const prefixes = {
  besluit: "http://data.vlaanderen.be/ns/besluit#",
  dcterms: "http://purl.org/dc/terms/",
  prov: "http://www.w3.org/ns/prov#",
  mandaat: "http://data.vlaanderen.be/ns/mandaat#",
};

const bestuursorganen = [
  "http://data.lblod.info/id/bestuursorganen/6efc9b0c3ebb3371031d45e517d88f66eb115adf28e5e1827684522f56a8aa2",
  "http://data.lblod.info/id/bestuursorganen/c126b20bc1a94de293b7fceaf998c82e9a7a1d56ba34cbf9992aa4bf01ae2b0",
  "http://data.lblod.info/id/bestuursorganen/c55fc5e892d9540e8d2463b4377e1f4b2caad04b280118f9fc408e5df61f573",
  "http://data.lblod.info/id/bestuursorganen/304b1cf175214a830ab2000c5f38fd688524e34d33a0fda4466693378aef8a4",
  "http://data.lblod.info/id/bestuursorganen/325c479023eed57b44ecdc40bb1c1b1b42a213975ca01f5a127bee6e9a4e798",
  "http://data.lblod.info/id/bestuursorganen/cc2aba212d4102c6fa9ee2d43f27a1cde04da144a21cb8b1683dc7bb1e0154d",
  "http://data.lblod.info/id/bestuursorganen/d06e5e292522046e94ebd6560813604df8e467a7347efc46c8b066ab5bbd38b",
  "http://data.lblod.info/id/bestuursorganen/807a46610dcbd3c0646ea9d13784d09ba0bb2f6de6cd7c9029e3dc9a15ad33a",
  "http://data.lblod.info/id/bestuursorganen/c484767ea88b545af011c47b52ac540a0ffdab400cfe9d3f53c6685ec8733cc",
  "http://data.lblod.info/id/bestuursorganen/0c0338929c4edb5e847f98481c1df2b22ffa858b44e49dec603d3d97cf6272c",
  "http://data.lblod.info/id/bestuursorganen/0d0c1eeff199e9f0d9aabfa7e68b0600d6092fff099c5d7a0caba3d8ef762fb",
  "http://data.lblod.info/id/bestuursorganen/192502e559e9b150c6bf895e3c145b7cf80feb286c48182ccf25153192d4365",
  "http://data.lblod.info/id/bestuursorganen/e1bdfec06e5407566b72ea6a1a9e89c82a1d5a81d1461772761e0974b2ddebe",
  "http://data.lblod.info/id/bestuursorganen/16d7f193d9f7f49c27a16978b2cb800c2ae06a8bd64a0532c4dd47aae83a2b6",
  "http://data.lblod.info/id/bestuursorganen/196d3dc10bb71196ea971bb5ff315083742e9a458d97b51bc31e2320b8d9de7",
  "http://data.lblod.info/id/bestuursorganen/a315ccc212dc2e19db45209761f5786e125138d01815a8f339092b70778b18e",
  "http://data.lblod.info/id/bestuursorganen/3ee975c24dddc132d37c262cac268012335575cf3ea2c0fa274d5b75f9c8ecd",
  "http://data.lblod.info/id/bestuursorganen/c0cf2d8f3a45a50e65b34dab2059dbdab19d716e66f35f9a06e23b975d8d46e",
  "http://data.lblod.info/id/bestuursorganen/20825ff7b875937c78d5520a1de2c29339ededf65c8a5c4fc9b257604769a3e",
  "http://data.lblod.info/id/bestuursorganen/1e9960d4c38937637027f21226ad19ff443e7bd33b8f6cc1a9cd47cc34f6fc5",
];

export const queryDefs = {
  agendapunt: {
    type: "besluit:Agendapunt",
    bestuursorgaanPropertyPath: "^besluit:behandelt / besluit:isGehoudenDoor",
  },
  behandelingVanAgendapunt: {
    type: "besluit:BehandelingVanAgendapunt",
    bestuursorgaanPropertyPath:
      "dcterms:subject / ^besluit:behandelt / besluit:isGehoudenDoor",
  },
  besluit: {
    type: "besluit:Besluit",
    bestuursorgaanPropertyPath:
      "^prov:generated / dcterms:subject / ^besluit:behandelt / besluit:isGehoudenDoor",
  },
  bestuursorgaan: {
    type: "besluit:Bestuursorgaan",
    bestuursorgaanPropertyPath: "",
  },
  mandataris: {
    type: "mandaat:Mandataris",
    bestuursorgaanPropertyPath:
      "^besluit:heeftVoorzitter / dcterms:subject / ^besluit:behandelt / besluit:isGehoudenDoor",
  },
  stemming: {
    type: "besluit:Stemming",
    bestuursorgaanPropertyPath:
      "^besluit:heeftStemming / dcterms:subject / ^besluit:behandelt / besluit:isGehoudenDoor",
  },
};

const buildPrefixBlock = () =>
  Object.entries(prefixes)
    .map(([prefix, uri]) => `PREFIX ${prefix}: <${uri}>`)
    .join("\n");

const buildValuesBlock = (varName) => {
  const lines = bestuursorganen
    .map((bestuursorgaan) => `<${bestuursorgaan}>`)
    .join("\n");
  return `VALUES ${varName} {\n${lines}\n}`;
};

export const buildQuery = (queryType, graph, limit, offset) => {
  const s = "?s";
  const prefixBlock = buildPrefixBlock();

  const path = queryType.bestuursorgaanPropertyPath || "";
  const pathBlock = path.length
    ? `${s} ${path} ?bestuursorgaan .\n${buildValuesBlock("?bestuursorgaan")}`
    : `${buildValuesBlock(s)}`;

  const innerBody = `${s} a ${queryType.type} .\n${pathBlock}`;

  const graphWrapped = graph
    ? `GRAPH <${graph}> {\n${innerBody}\n}`
    : innerBody;

  return `${prefixBlock}
SELECT DISTINCT ${s}
WHERE {
${graphWrapped}
}
LIMIT ${limit}
OFFSET ${offset}`;
};

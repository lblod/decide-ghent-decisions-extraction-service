import { bestuursorganen } from "./config/bestuursorganen";
import { prefixes } from "./config/query-definitions";

function buildPrefixBlock() {
  return Object.entries(prefixes)
    .map(([prefix, uri]) => `PREFIX ${prefix}: <${uri}>`)
    .join("\n");
}

function buildValuesBlock(varName) {
  const lines = bestuursorganen
    .map((bestuursorgaan) => `<${bestuursorgaan}>`)
    .join("\n");
  return `VALUES ${varName} {\n${lines}\n}`;
}

export function buildSelectQuery(type, graph, limit, offset) {
  const s = "?s";
  const prefixBlock = buildPrefixBlock();

  const path = type.bestuursorgaanPropertyPath || "";
  const pathBlock = path.length
    ? `${s} ${path} ?bestuursorgaan .\n${buildValuesBlock("?bestuursorgaan")}`
    : `${buildValuesBlock(s)}`;

  const innerBody = `${s} a ${type.type} .\n${pathBlock}`;

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
}

export function buildInsertQuery(triplesToInsert, graph) {
  const prefixBlock = buildPrefixBlock();

  return `${prefixBlock}
INSERT DATA {
  GRAPH ${graph} {
    ${triplesToInsert.join("\n")}
  }
}`;
}

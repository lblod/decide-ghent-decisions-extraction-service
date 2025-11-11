import { app, query, update, sparqlEscapeUri } from "mu";
import { queryDefs, buildQuery } from "./queries";
import {
  BATCH_SIZE,
  SLEEP_BETWEEN_BATCHES,
  INPUT_GRAPH,
  AGENDAPUNT_SUBJECTS_GRAPH,
  BEHANDELING_VAN_AGENDAPUNT_SUBJECTS_GRAPH,
  BESLUIT_SUBJECTS_GRAPH,
  BESTUURSORGAAN_SUBJECTS_GRAPH,
  MANDATARIS_SUBJECTS_GRAPH,
  STEMMING_SUBJECTS_GRAPH,
} from "./config";

const OUTPUT_GRAPHS = {
  agendapunt: AGENDAPUNT_SUBJECTS_GRAPH,
  behandelingVanAgendapunt: BEHANDELING_VAN_AGENDAPUNT_SUBJECTS_GRAPH,
  besluit: BESLUIT_SUBJECTS_GRAPH,
  bestuursorgaan: BESTUURSORGAAN_SUBJECTS_GRAPH,
  mandataris: MANDATARIS_SUBJECTS_GRAPH,
  stemming: STEMMING_SUBJECTS_GRAPH,
};

app.post("/extract-subjects", async (req, res, next) => {
  // 1) Req holds list of types (e.g. agendapunt, besluit), loop over them
  // 2) For each type, check whether in OUTPUT_GRAPHS and run query (from build_query, with INPUT_GRAPH and limit/offset)
  // 3) Extract results (subject URIs) and complete triples with "a [RDF type]"
  // 4) Insert triples in correct output graph
  // 5) Increase limit/offset and keep on querying/inserting until done
  // 6) Return 200 if all types have been looped over
});

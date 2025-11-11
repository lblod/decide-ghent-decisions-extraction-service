import { app, query, update, sparqlEscapeUri } from "mu";
import bodyParser from "body-parser";
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

app.use(
  bodyParser.json({
    type: function (req) {
      return /^application\/json/.test(req.get("content-type"));
    },
  })
);

app.post("/extract-subjects", async (req, res, next) => {
  try {
    const { types } = req.body || {};
    const typesToProcess = (Array.isArray(types) ? types : []).filter((type) =>
      Object.prototype.hasOwnProperty.call(OUTPUT_GRAPHS, type)
    );

    for (const typeName of typesToProcess) {
      console.info(`Received extraction request for type '${typeName}'.`);
      // 2) For each type, run query (from build_query, with INPUT_GRAPH and limit/offset)
      // 3) Extract results (subject URIs) and complete triples with "a [RDF type]"
      // 4) Insert triples in correct output graph
      // 5) Increase limit/offset and keep on querying/inserting until done
      // 6) Return 200 if all types have been looped over
    }

    return res.status(202).json({
      data: {
        type: "extraction-job",
        attributes: {
          types: typesToProcess,
          status: "queued",
        },
      },
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        errors: [{ title: error.message }],
      });
    }

    return next(error);
  }
});

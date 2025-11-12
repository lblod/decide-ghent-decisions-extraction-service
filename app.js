import { app, sparqlEscapeUri } from "mu";
import { querySudo, updateSudo } from "@lblod/mu-auth-sudo";
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

    if (typesToProcess.length) {
      extractSubjects(typesToProcess).catch((error) =>
        console.error(
          "[extract-subjects] Extraction flow failed unexpectedly.",
          error
        )
      );
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

async function extractSubjects(types) {
  for (const typeName of types) {
    console.info(
      `[extract-subjects] Received extraction request for type '${typeName}'.`
    );

    const queryDefinition = queryDefs[typeName];
    if (!queryDefinition) {
      console.warn(
        `[extract-subjects] Missing query definition for type '${typeName}', skipping.`
      );
      continue;
    }

    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const sparql = buildQuery(
        queryDefinition,
        INPUT_GRAPH,
        BATCH_SIZE,
        offset
      );
      console.info(
        `[extract-subjects] Executing query for type '${typeName}' (limit=${BATCH_SIZE}, offset=${offset}).`
      );

      const result = await querySudo(sparql);
      const bindings = result?.results?.bindings ?? [];

      const subjects = bindings
        .map((binding) => binding?.s?.value)
        .filter((value) => typeof value === "string" && value.length);

      if (subjects.length) {
        const triplesToInsert = subjects.map(
          (subject) => `${sparqlEscapeUri(subject)} a ${queryDefinition.type} .`
        );
        console.info(
          `[extract-subjects] Prepared ${triplesToInsert.length} triples for type '${typeName}'.`
        );

        // 4) Insert triples in correct output graph
      }

      if (bindings.length < BATCH_SIZE) {
        hasMore = false;
      } else {
        offset += BATCH_SIZE;
        if (SLEEP_BETWEEN_BATCHES > 0) {
          await sleep(SLEEP_BETWEEN_BATCHES * 1000);
        }
      }
    }

    console.info(
      `[extract-subjects] Finished extraction request for type '${typeName}'.`
    );
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

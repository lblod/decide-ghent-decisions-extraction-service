import { app } from "mu";
import { querySudo, updateSudo } from "@lblod/mu-auth-sudo";
import bodyParser from "body-parser";
import { buildSelectQuery, buildInsertQuery } from "./queries";
import { queryDefs } from "./config/query-definitions";
import { BATCH_SIZE, SLEEP_BETWEEN_BATCHES } from "./environment";

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
    const typesToProcess = (Array.isArray(types) ? types : []).filter(
      (type) =>
        Object.prototype.hasOwnProperty.call(queryDefs, type) &&
        queryDefs[type]?.outputGraph
    );

    if (typesToProcess.length) {
      extractAndInsertSubjects(typesToProcess).catch((error) =>
        console.error("Extraction flow failed unexpectedly.", error)
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

async function extractAndInsertSubjects(types) {
  for (const typeName of types) {
    await extractAndInsertSubjectsForType(typeName);
  }
}

async function extractAndInsertSubjectsForType(typeName) {
  const queryDefinition = queryDefs[typeName];
  if (!queryDefinition) return;

  console.info(`Received extraction request for type '${typeName}'.`);

  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const { subjects, hasMoreResults } = await fetchSubjectsBatch(
      queryDefinition,
      offset
    );

    await sleep();

    if (subjects.length) {
      await insertSubjectsBatch(queryDefinition, subjects);
      await sleep();
    }

    if (!hasMoreResults) {
      hasMore = false;
    } else {
      offset += BATCH_SIZE;
    }
  }

  console.info(`Finished extraction request for type '${typeName}'.`);
}

async function fetchSubjectsBatch(queryDefinition, offset) {
  console.info(
    `Executing query for type '${queryDefinition.type}' (limit=${BATCH_SIZE}, offset=${offset}).`
  );

  const selectQuery = buildSelectQuery(queryDefinition, BATCH_SIZE, offset);
  const result = await querySudo(selectQuery);
  const bindings = result?.results?.bindings ?? [];

  const subjects = bindings
    .map((binding) => binding?.s?.value)
    .filter((value) => typeof value === "string" && value.length);

  console.info(
    `Found ${subjects.length} result(s) for type '${queryDefinition.type}'.`
  );

  return {
    subjects,
    hasMoreResults: bindings.length === BATCH_SIZE,
  };
}

async function insertSubjectsBatch(queryDefinition, subjects) {
  console.info(
    `Executing insert for type '${queryDefinition.type}' (amount=${subjects.length}).`
  );

  const insertQuery = buildInsertQuery(queryDefinition, subjects);
  await updateSudo(insertQuery);

  console.info(
    `Inserted ${subjects.length} triple(s) into graph '${queryDefinition.outputGraph}'.`
  );
}

async function sleep() {
  if (SLEEP_BETWEEN_BATCHES > 0) {
    console.info(`Sleeping for ${SLEEP_BETWEEN_BATCHES} ms.`);
    return new Promise((resolve) => setTimeout(resolve, SLEEP_BETWEEN_BATCHES));
  }
}

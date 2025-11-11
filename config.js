export const BATCH_SIZE = parseInt(process.env.DCR_BATCH_SIZE) || 1000;
export const SLEEP_BETWEEN_BATCHES =
  parseInt(process.env.DCR_SLEEP_BETWEEN_BATCHES) || 5;

export const INPUT_GRAPH =
  process.env.DCR_INPUT_GRAPH ||
  `http://mu.semte.ch/graphs/oslo-decisions/landing`;
export const AGENDAPUNT_SUBJECTS_GRAPH =
  process.env.DCR_AGENDAPUNT_SUBJECTS_GRAPH ||
  `http://mu.semte.ch/graphs/oslo-decisions/ghent/agendapunt`;
export const BEHANDELING_VAN_AGENDAPUNT_SUBJECTS_GRAPH =
  process.env.DCR_BEHANDELING_VAN_AGENDAPUNT_SUBJECTS_GRAPH ||
  `http://mu.semte.ch/graphs/oslo-decisions/ghent/behandeling-van-agendapunt`;
export const BESLUIT_SUBJECTS_GRAPH =
  process.env.DCR_BESLUIT_SUBJECTS_GRAPH ||
  `http://mu.semte.ch/graphs/oslo-decisions/ghent/besluit`;
export const BESTUURSORGAAN_SUBJECTS_GRAPH =
  process.env.DCR_BESTUURSORGAAN_SUBJECTS_GRAPH ||
  `http://mu.semte.ch/graphs/oslo-decisions/ghent/bestuursorgaan`;
export const MANDATARIS_SUBJECTS_GRAPH =
  process.env.DCR_MANDATARIS_SUBJECTS_GRAPH ||
  `http://mu.semte.ch/graphs/oslo-decisions/ghent/mandataris`;
export const STEMMING_SUBJECTS_GRAPH =
  process.env.DCR_STEMMING_SUBJECTS_GRAPH ||
  `http://mu.semte.ch/graphs/oslo-decisions/ghent/stemming`;

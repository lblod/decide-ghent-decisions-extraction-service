export const BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 100;
export const SLEEP_BETWEEN_BATCHES =
  parseInt(process.env.SLEEP_BETWEEN_BATCHES) || 1000;

export const INPUT_GRAPH =
  process.env.INPUT_GRAPH || `http://mu.semte.ch/graphs/oslo-decisions`;
export const AGENDAPUNT_SUBJECTS_GRAPH =
  process.env.AGENDAPUNT_SUBJECTS_GRAPH ||
  `http://mu.semte.ch/graphs/oslo-decisions/ghent/agendapunt`;
export const BEHANDELING_VAN_AGENDAPUNT_SUBJECTS_GRAPH =
  process.env.BEHANDELING_VAN_AGENDAPUNT_SUBJECTS_GRAPH ||
  `http://mu.semte.ch/graphs/oslo-decisions/ghent/behandeling-van-agendapunt`;
export const BESLUIT_SUBJECTS_GRAPH =
  process.env.BESLUIT_SUBJECTS_GRAPH ||
  `http://mu.semte.ch/graphs/oslo-decisions/ghent/besluit`;
export const BESTUURSORGAAN_SUBJECTS_GRAPH =
  process.env.BESTUURSORGAAN_SUBJECTS_GRAPH ||
  `http://mu.semte.ch/graphs/oslo-decisions/ghent/bestuursorgaan`;
export const MANDATARIS_SUBJECTS_GRAPH =
  process.env.MANDATARIS_SUBJECTS_GRAPH ||
  `http://mu.semte.ch/graphs/oslo-decisions/ghent/mandataris`;
export const STEMMING_SUBJECTS_GRAPH =
  process.env.STEMMING_SUBJECTS_GRAPH ||
  `http://mu.semte.ch/graphs/oslo-decisions/ghent/stemming`;

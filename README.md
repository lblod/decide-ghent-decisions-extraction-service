# Decide - Ghent decisions extraction service

## About
This service moves resource URIs of *besluit*-related triples from an input graph to an output graph, but only those that belong to a Ghent *bestuursorgaan*. Resources having any of the following RDF types are supported:

| Identifier               | RDF type                         |
| ------------------------ | -------------------------------- |
| agendapunt               | `besluit:Agendapunt`               |
| behandelingVanAgendapunt | `besluit:BehandelingVanAgendapunt` |
| besluit                  | `besluit:Besluit`                  |
| bestuursorgaan           | `besluit:Bestuursorgaan`           |
| mandataris               | `mandaat:Mandataris`               |
| stemming                 | `besluit:Stemming`                 |

Each type has its own graph in which results are written. Results are triples looking like `<resource-uri> a <rdf-type>`.

## Usage

Trigger an extraction job by POSTing to `/extract-subjects` on the service.  
Body must be JSON with a `types` array containing any of the supported type identifiers (see table above). Unsupported entries are ignored.

```bash
curl -X POST http://localhost:80/extract-subjects \
  -H 'Content-Type: application/json' \
  -d '{"types":["agendapunt","besluit","stemming"]}'
```

The endpoint replies immediately with `202 Accepted` and lists the sanitized types that were queued. The heavy SPARQL querying and insertion work continues asynchronously.

### Configuration

| Env var                                         | Description                                            | Default                                                                     |
| ----------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------- |
| `DCR_BATCH_SIZE`                                | Batch size (`LIMIT`) for SPARQL queries.                 | 100                                                                       |
| `DCR_SLEEP_BETWEEN_BATCHES`                     | Delay between SPARQL queries/inserts, in milliseconds. | 1000                                                                      |
| `DCR_INPUT_GRAPH`                               | Source graph containing decisions data.                | `http://mu.semte.ch/graphs/oslo-decisions`                                  |
| `DCR_AGENDAPUNT_SUBJECTS_GRAPH`                 | Target graph for `agendapunt` triples.                 | `http://mu.semte.ch/graphs/oslo-decisions/ghent/agendapunt`                 |
| `DCR_BEHANDELING_VAN_AGENDAPUNT_SUBJECTS_GRAPH` | Target graph for `behandelingVanAgendapunt` triples.   | `http://mu.semte.ch/graphs/oslo-decisions/ghent/behandeling-van-agendapunt` |
| `DCR_BESLUIT_SUBJECTS_GRAPH`                    | Target graph for `besluit` triples.                    | `http://mu.semte.ch/graphs/oslo-decisions/ghent/besluit`                    |
| `DCR_BESTUURSORGAAN_SUBJECTS_GRAPH`             | Target graph for `bestuursorgaan` triples.             | `http://mu.semte.ch/graphs/oslo-decisions/ghent/bestuursorgaan`             |
| `DCR_MANDATARIS_SUBJECTS_GRAPH`                 | Target graph for `mandataris` triples.                 | `http://mu.semte.ch/graphs/oslo-decisions/ghent/mandataris`                 |
| `DCR_STEMMING_SUBJECTS_GRAPH`                   | Target graph for `stemming` triples.                   | `http://mu.semte.ch/graphs/oslo-decisions/ghent/stemming`                   |

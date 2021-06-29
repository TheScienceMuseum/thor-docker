const commonNamespaces = [
  'soch: <http://kulturarvsdata.se/ksamsok#>',
  'owl: <http://www.w3.org/2002/07/owl#>',
  'dcterms: <http://purl.org/dc/terms/>',
  'foaf: <http://xmlns.com/foaf/0.1/>',
  'edm: <http://www.europeana.eu/schemas/edm/>',
  'dc: <http://purl.org/dc/elements/1.1/>',
  'skos: <http://www.w3.org/2004/02/skos/core#>',
  'crm: <http://www.cidoc-crm.org/rdfs/cidoc-crm#>',
  'cc: <http://creativecommons.org/ns#>',
  'rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
  'rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
  'wd: <http://www.wikidata.org/entity/>',
  'wdt: <http://www.wikidata.org/prop/direct/>',
  'wikibase: <http://wikiba.se/ontology#>',
  'p: <http://www.wikidata.org/prop/>',
  'ps: <http://www.wikidata.org/prop/statement/>',
  'pq: <http://www.wikidata.org/prop/qualifier/>',
  'mwapi: <https://www.mediawiki.org/ontology#API/>',
  'bd: <http://www.bigdata.com/rdf#>',
  'lido: <http://www.lido-schema.org/>',
  'dbpedia: <http://dbpedia.org/resource/>',
  'sdo: <https://schema.org/>',
  'xsd: <http://www.w3.org/2001/XMLSchema#>',
  'smgp: <https://collection.sciencemuseumgroup.org.uk/people/>',
  'smgo: <https://collection.sciencemuseumgroup.org.uk/objects/>',
  'smgd: <https://collection.sciencemuseumgroup.org.uk/documents/>',
  'wd: <http://www.wikidata.org/entity/>',
  'wdt: <http://www.wikidata.org/prop/direct/>',
  'hc: <http://www.heritageconnector.org/RDF/>',
];

YASQE.Autocompleters._prefixes = YASQE.Autocompleters.prefixes;
YASQE.Autocompleters.prefixes = function(yasqe, completerName) {
  var completer = YASQE.Autocompleters._prefixes(yasqe, completerName);
  completer.async = false;
  completer.persistent = false;
  completer.get = commonNamespaces;
  return completer;
};

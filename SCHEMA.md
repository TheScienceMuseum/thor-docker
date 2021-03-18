# Heritage Connector Schema

## Person

| Field       | Primary RDF Predicate     | Wikidata    | Notes |
| ----------- | ----------- | ----------- | ----------- | 
| Title | FOAF.title | | |
| Prefered Name | FOAF.givenName | [WDT.P735](https://www.wikidata.org/wiki/Property:P735) | |
| Family Name | FOAF.familyName | [WDT.P734](https://www.wikidata.org/wiki/Property:P734) | |
| Gender | SDO.gender | [WDT.P21](https://www.wikidata.org/wiki/Property:P21) |
| Birth Date | SDO.birthDate | [WDT.P569](https://www.wikidata.org/wiki/Property:P569) | |
| Death Date | SDO.deathDate | [WDT.P570](https://www.wikidata.org/wiki/Property:P570) | |
| Birth Pace | SDO.birthPlace | [WDT.P19](https://www.wikidata.org/wiki/Property:P19) | |
| Death Place | SDO.deathPlace | [WDT.P20](https://www.wikidata.org/wiki/Property:P20) | |
| Nationality | SDO.nationality | | |
| Occupation | SDO.hasOccupation | [WDT.P106](https://www.wikidata.org/wiki/Property:P106) | |
| Biography | XSD.description | | |

## Organisation

| Field       | Primary RDF Predicate     | Wikidata    | Notes |
| ----------- | ----------- | ----------- | ----------- | 
| Title | FOAF.title | | |
| Prefered Name | FOAF.givenName | [WDT.P735](https://www.wikidata.org/wiki/Property:P735) | |
| Family Name | FOAF.familyName | [WDT.P734](https://www.wikidata.org/wiki/Property:P734) | |
| Gender | SDO.gender | [WDT.P21](https://www.wikidata.org/wiki/Property:P21) |
| Birth Date | SDO.birthDate | [WDT.P569](https://www.wikidata.org/wiki/Property:P569) | |
| Death Date | SDO.birthDate | [WDT.P570](https://www.wikidata.org/wiki/Property:P570) | | 
| Nationality | SDO.nationality | | | 
| Occupation | SDO.hasOccupation | [WDT.P106](https://www.wikidata.org/wiki/Property:P106) | |
| Biography | XSD.description | | |

## Object

| Field       | Primary RDF Predicate | Wikidata    | Notes |
| ----------- | ----------- | ----------- | ----------- | 
| Title | RDFS.label | | |
| Description | XSD.description | | |
| Maker | FOAF.maker | | |
| User | PROV.used | | |
| Item type | XSD.additionalType | [WDT.P31](https://www.wikidata.org/wiki/Property:P31) | |
| Materials | SDO.material | [WDT.P186](https://www.wikidata.org/wiki/Property:P186) | |
| Date made| SDO.dateCreated | [WDT.P571](https://www.wikidata.org/wiki/Property:P571) | |
| SMG Category | SDO.isPartOf | | |


## Common

 RDF Predicate | Usage       | Notes |
| ----------- | ----------- | ----------- |
| rdf:type | Type of item | Corresponds to Wikidata [WDT.P31](https://www.wikidata.org/wiki/Property:P31) | 
| rdf:hasTopConcept | The record type used in the orignal collection | ie. OBJECT, PERSON or ORGANISATION
| owl:sameAs | Used to express equivalance between records | used to link to external Wikidata entries | 

## Custom HC Namespace (NER)

Used to express links/terms discocvered by NER (Named Entity Recognition) in a records description or biography field. Values can either be a URIO or a string depening of wether trhe foudn entitioes have been linked to a knowlege graph (either the local Heritage Connector graph or an external graph such as Wikidata/Wikipedia)

| RDF Predicate | Usage       | Notes |
| ----------- | ----------- | ----------- |
| hc.entityPERSON | Person | A person identified by NER | 
| hc.entityORG | Organistion | An Organistion identified by NER | 
| hc.entityNORP | | | 
| hc.entityFAC | Facility | A building or facility identified by NER | 
| hc.entityLOC |  | A geographical location or country identified by NER | 
| hc.entityOBJECT | Object | | 
| hc.entityLANGUAGE | Language | A language identified by NER | 
| hc.entityDATE | Date | A date or year identified by NER | 






# Heritage Connector Schema

## Prefixes

| | | |
|-|-|-|
| `foaf` | http://xmlns.com/foaf/0.1/ |
| `owl` | http://www.w3.org/2002/07/owl# |
| `rdf` | http://www.w3.org/1999/02/22-rdf-syntax-ns# |
| `rdfs` | http://www.w3.org/2000/01/rdf-schema# |
| `prov` | http://www.w3.org/ns/prov# |
| `sdo` | https://schema.org/ |
| `skos` | http://www.w3.org/2004/02/skos/core# |
| `wd` | http://www.wikidata.org/entity/ |
| `wdt` | http://www.wikidata.org/prop/direct/ |
| `hc` | http://www.heritageconnector.org/RDF/ |
## Common

 RDF Predicate | Usage       | Notes |
| ----------- | ----------- | ----------- |
| `rdf:type` | Type of item | Corresponds to Wikidata [WDT.P31](https://www.wikidata.org/wiki/Property:P31) | 
| `skos:hasTopConcept` | The record type used in the orignal collection | one of `OBJECT, PERSON, ORGANISATION, DOCUMENT, JOURNAL_ARTICLE, BLOG_POST` |
| `owl:sameAs` | Used to express equivalance between records | used to link to external Wikidata entries | 
| `hc.database` | Whether the record exists in Adlib or Mimsy | Relevant mainly for people and organisations, as they can exist in either database | 

## Custom HC Namespace (NER)

Used to express links/terms discocvered by NER (Named Entity Recognition) in a records description or biography field. Values can either be a URI or a string depending of whether the found entities have been linked to a knowledge graph (either the local Heritage Connector graph or an external graph such as Wikidata/Wikipedia)

| RDF Predicate | Usage       | Notes |
| ----------- | ----------- | ----------- |
| `hc:entityPERSON` | Person | A person identified by NER | 
| `hc:entityORG` | Organisation | An Organisation identified by NER | 
| `hc:entityNORP` | Nationality | A nationality identified by NER | 
| `hc:entityFAC` | Facility | A building or facility identified by NER | 
| `hc:entityLOC` | Place | A geographical location or country identified by NER | 
| `hc:entityOBJECT` | Object | A product or work of art identified by NER | 
| `hc:entityLANGUAGE` | Language | A language identified by NER | 
| `hc:entityDATE` | Date | A date or year identified by NER | 


## Person

| Field       | Primary RDF Predicate     | Wikidata    | Notes |
| ----------- | ----------- | ----------- | ----------- | 
| Title | `foaf:title` | | |
| Preferred Name | `foaf:givenName` | [WDT.P735](https://www.wikidata.org/wiki/Property:P735) | |
| Family Name | `foaf:familyName` | [WDT.P734](https://www.wikidata.org/wiki/Property:P734) | |
| Gender | `sdo:gender` | [WDT.P21](https://www.wikidata.org/wiki/Property:P21) |
| Birth Date | `sdo:birthDate` | [WDT.P569](https://www.wikidata.org/wiki/Property:P569) | |
| Death Date | `sdo:deathDate` | [WDT.P570](https://www.wikidata.org/wiki/Property:P570) | |
| Birth Place | `sdo:birthPlace` | [WDT.P19](https://www.wikidata.org/wiki/Property:P19) | |
| Death Place | `sdo:deathPlace` | [WDT.P20](https://www.wikidata.org/wiki/Property:P20) | |
| Nationality | `sdo:nationality` | | |
| Occupation | `sdo:hasOccupation` | [WDT.P106](https://www.wikidata.org/wiki/Property:P106) | |

## Organisation

| Field       | Primary RDF Predicate     | Wikidata    | Notes |
| ----------- | ----------- | ----------- | ----------- | 
| Title | `foaf:title` | | |
| Preferred Name | `rdfs:label` | | |
| Product or Material Produced | `wdt:P1056` | | |
| Founding Date/Inception | `sdo:foundingDate` | [WDT.P571](https://www.wikidata.org/wiki/Property:P571) | |
| Dissolution Date | `sdo:dissolutionDate` | [WDT.P576](https://www.wikidata.org/wiki/Property:P576) | | 
| Nationality | `sdo:nationality` | | | 
| Occupation | `sdo:hasOccupation` | [WDT.P106](https://www.wikidata.org/wiki/Property:P106) | |
| Industry | `xsd:additionalType` | | |

## Object

| Field       | Primary RDF Predicate | Wikidata    | Notes |
| ----------- | ----------- | ----------- | ----------- | 
| Title | `rdfs:label` | | |
| Maker | `foaf:maker` | | |
| User | `prov:used` | | |
| Item type | `xsd:additionalType` | [WDT.P31](https://www.wikidata.org/wiki/Property:P31) | |
| Materials | `sdo:material` | [WDT.P186](https://www.wikidata.org/wiki/Property:P186) | |
| Date made| `sdo:dateCreated` | [WDT.P571](https://www.wikidata.org/wiki/Property:P571) | |
| SMG Category | `sdo:isPartOf` | | |

## Archival document

| Field       | Primary RDF Predicate | Wikidata    | Notes |
| ----------- | ----------- | ----------- | ----------- | 
| Title | `rdfs:label` | | |
| Description | `xsd.description` | | |

## Journal article

| Field       | Primary RDF Predicate | Wikidata    | Notes |
| ----------- | ----------- | ----------- | ----------- | 
| DOI | `sdo:identifier` | | |
| Author | `sdo:author` | | |
| Title | `rdfs:label` | | |
| Issue | `sdo:isPartOf` | | |
| Keywords | `sdo:genre` | | |
| Tags | `sdo:keywords` | | |

## Blog post

| Field       | Primary RDF Predicate | Wikidata    | Notes |
| ----------- | ----------- | ----------- | ----------- | 
| Date | `sdo:dateCreated` | | |
| Author | `sdo:author` | | |
| Title | `rdfs:label` | | |
| Issue | `sdo:isPartOf` | | |
| Categories | `sdo:genre` | | |
| Tags | `sdo:keywords` | | |
| Hyperlinks | `sdo.mentions` | | Hyperlinks in a blog post to other blogs, collection pages or Wikipedia. |







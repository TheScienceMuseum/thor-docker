// This script uses sample data to show how the transformDataForGraph function works without having 
// to run a query through the SPARQL UI in app.js.
// The version of this function in app.js also compresses URIs to their shortened version using 
// getURIMarkup.

const rawResponseData = {
  "head": {
    "vars": [
      "s",
      "sLabel",
      "edgeLabel",
      "o",
      "oLabel"
    ]
  },
  "results": {
    "bindings": [
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://xmlns.com/foaf/0.1/givenName"
        },
        "o": {
          "type": "literal",
          "value": "Maurice"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://www.heritageconnector.org/RDF/entityLOC"
        },
        "o": {
          "type": "uri",
          "value": "http://www.wikidata.org/entity/Q49111"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://www.heritageconnector.org/RDF/entityLOC"
        },
        "o": {
          "type": "uri",
          "value": "http://www.wikidata.org/entity/Q350"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://www.wikidata.org/prop/direct/P2283"
        },
        "o": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/objects/co62390"
        },
        "oLabel": {
          "type": "literal",
          "value": "Ferrite core memory from the electronic computer EDSAC2"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://www.wikidata.org/prop/direct/P2283"
        },
        "o": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/objects/co62388"
        },
        "oLabel": {
          "type": "literal",
          "value": "Panel 1 unit from EDSAC1, 1946-1958"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://www.wikidata.org/prop/direct/P2283"
        },
        "o": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/objects/co62386"
        },
        "oLabel": {
          "type": "literal",
          "value": "Micro-program control matrix from the EDSAC2"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://www.wikidata.org/prop/direct/P2283"
        },
        "o": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/objects/co62387"
        },
        "oLabel": {
          "type": "literal",
          "value": "Short mercury delay tube from the electronic computer EDSAC, 1946-1958"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://www.wikidata.org/prop/direct/P2283"
        },
        "o": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/objects/co62389"
        },
        "oLabel": {
          "type": "literal",
          "value": "End plate assembly for a battery of mercury delay tubes from EDSAC 1, 1946-1958"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "https://schema.org/deathDate"
        },
        "o": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#double",
          "value": "2010.0"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#sameAs"
        },
        "o": {
          "type": "uri",
          "value": "http://www.wikidata.org/entity/Q62857"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://xmlns.com/foaf/0.1/familyName"
        },
        "o": {
          "type": "literal",
          "value": "Wilkes"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "https://schema.org/hasOccupation"
        },
        "o": {
          "type": "literal",
          "value": "computer scientist"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.wikidata.org/entity/Q5"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://xmlns.com/foaf/0.1/made"
        },
        "o": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/objects/co62388"
        },
        "oLabel": {
          "type": "literal",
          "value": "Panel 1 unit from EDSAC1, 1946-1958"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "https://schema.org/birthDate"
        },
        "o": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#double",
          "value": "1913.0"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://xmlns.com/foaf/0.1/title"
        },
        "o": {
          "type": "literal",
          "value": "Sir"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "https://schema.org/nationality"
        },
        "o": {
          "type": "literal",
          "value": "united kingdom"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "https://schema.org/gender"
        },
        "o": {
          "type": "uri",
          "value": "http://www.wikidata.org/entity/Q6581097"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://www.heritageconnector.org/RDF/entityORG"
        },
        "o": {
          "type": "uri",
          "value": "http://www.wikidata.org/entity/Q7895212"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://www.heritageconnector.org/RDF/entityORG"
        },
        "o": {
          "type": "literal",
          "value": "Computer Pioneer"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://www.heritageconnector.org/RDF/entityORG"
        },
        "o": {
          "type": "uri",
          "value": "http://www.wikidata.org/entity/Q119329"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://www.heritageconnector.org/RDF/entityORG"
        },
        "o": {
          "type": "uri",
          "value": "http://www.wikidata.org/entity/Q690079"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://www.heritageconnector.org/RDF/entityORG"
        },
        "o": {
          "type": "uri",
          "value": "http://www.wikidata.org/entity/Q4045727"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://www.heritageconnector.org/RDF/entityORG"
        },
        "o": {
          "type": "literal",
          "value": "the Mathematical Laboratory"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "http://www.heritageconnector.org/RDF/entityOBJECT"
        },
        "o": {
          "type": "uri",
          "value": "http://www.wikidata.org/entity/Q752297"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "https://collection.sciencemuseumgroup.org.uk/people/cp21611"
        },
        "sLabel": {
          "type": "literal",
          "value": "Sir Maurice Wilkes"
        },
        "edgeLabel": {
          "type": "uri",
          "value": "https://schema.org/deathPlace"
        },
        "o": {
          "type": "uri",
          "value": "http://www.wikidata.org/entity/Q350"
        }
      }
    ]
  }
}


function transformDataForGraph (rawResponseData) {
    const dataColumns = rawResponseData.head.vars;
    const dataFirstColumn = dataColumns[0];
    const data = rawResponseData.results.bindings;

    var nodes = [];
    var links = [];

    for (const [row_idx, row] of data.entries()) {
        for (const [col_idx, col] of dataColumns.entries()) {
            if (!col.includes("Label")) {
                var nodeLabel = (row[col + "Label"]) ? row[col + "Label"].value : row[col].value
                var nodeId = row[col].value
                var node = {
                    id: nodeId,
                    label: nodeLabel
                }
    
                if (col_idx != 0) {
                    // create new edge
                    var link = {
                        source: row[dataFirstColumn].value,
                        target: nodeId
                    };
                    if (row.edgeLabel.value) {
                      link.label = row.edgeLabel.value
                    }
                    
                    const linkInLinks = links.filter(d => d.source === link.source && d.target === link.target)
                    if (linkInLinks.length) {
                      const linkIndex = links.indexOf(linkInLinks[0])
                      var newLink = {
                        source: link.source,
                        target: link.target,
                        label: (linkInLinks[0].label ? linkInLinks[0].label + ' & ' : '' || '') + (link.label || '')
                      }
                      links[linkIndex] = newLink;
                    } else {
                      links.push(link);
                    }
    
                    if (!nodes[nodeId]) {
                        // create a new node if it doesn't exist
                        nodes[nodeId] = node;
                    }
                } else {
                    nodes[nodeId] = node;
                }
            }
        }
    }  

    return {
        nodes: Object.values(nodes), 
        links: links
    }
}

const transformedData = transformDataForGraph(rawResponseData);

// console.log(transformedData.nodes);
console.log(transformedData.links);

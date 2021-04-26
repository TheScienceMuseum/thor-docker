YASQE.defaults.sparql.showQueryButton = false;
YASQE.defaults.value = '';
YASQE.defaults.autocompleters = ['prefixes', 'customPropertyCompleter', 'customClassCompleter', 'customUrisCompleter', 'customServicesCompleter', 'variables'];

let rawResponseData;
YASQE.defaults.sparql.callbacks.success = data => {
  document.querySelector('#queryLoadingIndicator').style.display = 'none';
  rawResponseData = data;
  render(data);
}

YASQE.defaults.sparql.callbacks.beforeSend = () => {
  clearResults();
  document.querySelector('#queryLoadingIndicator').style.display = 'block';
}

YASQE.defaults.sparql.callbacks.error = data => {
  if (data.status == 400) {
    flashMessage('400 Bad Request: Your SPARQL likely contains an error.')
  } else {
    flashMessage('Request failed for an unknown reason.');
  }
  document.querySelector('#queryLoadingIndicator').style.display = 'none';
}

function getSharableURL() {
  return window.location.origin + window.location.pathname + '#query=' + encodeURIComponent(yasqe.getValue());
}

function populateShareModal() {
  document.querySelector('#shareURLInput').value = getSharableURL();
}

function copyAndCloseShareModal() {
  const copyTextarea = document.querySelector('#shareURLInput');
  copyTextarea.focus();
  copyTextarea.select();
  document.execCommand('copy'); // assuming that copying never fails. Likely a bad idea.
  window.location.hash = '';
}

function clearResults() {
  if (document.querySelector('.results').hasChildNodes()) {
    document.querySelector('#resultContainer').innerHTML = '';
    document.querySelector('#result-label').style.display = 'none';
  }
}

function download(evt) {
  const format = evt.options[evt.selectedIndex].value;
  if (format === 'json' && rawResponseData) {
    const downloadElm = document.querySelector('#download');
    downloadElm.href = window.URL.createObjectURL(new Blob([JSON.stringify(rawResponseData)], { type: 'application/json' }));
    downloadElm.download = 'query-result.json';
    downloadElm.click();
  }
}

function flashMessage(message) {
  document.querySelector('#messageContainer').innerText = message;
  document.querySelector('#messageContainer').style.display = 'block';
  setTimeout(() => {
    document.querySelector('#messageContainer').style.display = 'none';
  }, 5000);
}

function getURIMarkup(yasqe, uri) {
  const prefixes = yasqe.getPrefixesFromQuery();
  let uriText = uri;

  Object.keys(prefixes).forEach(key => {
    if (uri.startsWith(prefixes[key])) {
      uriText = uri.replace(prefixes[key], key + ':');
    }
  });
  let a = document.createElement('a');
  a.href = uri;
  let node = document.createTextNode(uriText);
  a.append(node);
  return a;
}

function setResultsLabel(len, max) {
  const label = document.querySelector('#result-label');
  let text = `viewing ${len}/${len} rows`;
  if (len > max) {
    text = `viewing ${max}/${len} rows`;
  }

  label.innerText = text;
  label.style.display = 'block';
}

function renderTable() {
  const table = document.createElement('table');
  table.classList.add(['raa-table']);
  table.id = 'resultTable';
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');

  let vars = [];
  rawResponseData.head.vars.forEach(e => {
    const th = document.createElement('th');
    const thNode = document.createTextNode(e);
    vars.push(e);
    th.appendChild(thNode);
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  table.appendChild(thead);

  tbody = document.createElement('tbody');
  setResultsLabel(rawResponseData.results.bindings.length, 500);
  rawResponseData.results.bindings.slice(-500).forEach(e => { // this loop could be clearer
    const tr = document.createElement('tr');
    vars.forEach(v => {
      const td = document.createElement('td');
      let node;
      if (e[v]) {
        if (e[v].value.startsWith('http')) {
          node = getURIMarkup(yasqe, e[v].value);
        } else {
          node = document.createTextNode(e[v].value);
        }
      } else {
        node = document.createTextNode('');
      }
      td.appendChild(node);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  document.querySelector('#resultContainer').appendChild(table);
}

function renderImages() {
  const container = document.createElement('div');
  container.id = 'resultImages';

  setResultsLabel(rawResponseData.results.bindings.length, 500);
  rawResponseData.results.bindings.slice(-100).forEach(row => {
    if (row.thumbnail.value.match(/^(http(s?):\/\/).+(\.(jpeg|jpg|gif|png|tif)$)/i) != null) {
      const img = document.createElement('img');
      img.src = row.thumbnail.value;
      container.appendChild(img);
    }
  });

  document.querySelector('#resultContainer').appendChild(container);
}

function renderPieChart() {
  const data = rawResponseData.results.bindings.map(data => {
    return {
      label: data['label'].value,
      count: data['count'].value,
    };
  });

  const width = window.innerWidth;
  const height = 500;

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.label))
    .range(['#4285F4', '#EA4335', '#34A853', '#FBBC04', '#FA7B17', '#F53BA0', '#A142F4', '#24C1E0'])

  const pie = d3.pie()
    .sort(null)
    .value(d => d.count)

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(Math.min(width, height) / 2 - 1)

  arcLabel = d3.arc().innerRadius(Math.min(width, height) / 2 * 0.8).outerRadius(Math.min(width, height) / 2 * 0.8);
  const arcs = pie(data);

  const svg = d3.select('#resultContainer').append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('text-anchor', 'middle')
  .style('font', '14px sans-serif');

  const g = svg.append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`);

  g.selectAll('path')
  .data(arcs)
  .enter().append('path')
    .attr('fill', d => color(d.data.label))
    .attr('d', arc)
    .attr('stroke', 'white')
  .append('title')
    .text(d => `${d.data.label}: ${d.data.count.toLocaleString()}`);

  const text = g.selectAll('text')
  .data(arcs)
  .enter().append('text')
    .attr('transform', d => `translate(${arcLabel.centroid(d)})`)
    .attr('dy', '0.35em');

  text.append('tspan')
    .attr('x', 0)
    .attr('y', '-0.7em')
    .text(d => d.data.label);
}

function renderGraph() {
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
                if (nodeLabel.startsWith("http")) {
                  nodeLabel = getURIMarkup(yasqe, nodeLabel).innerText;
                }
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
                    if (row.edgeLabel) {
                      if (row.edgeLabel.value.startsWith("http")) {
                        link.label = getURIMarkup(yasqe, row.edgeLabel.value).innerText;
                      } else {
                        link.label = row.edgeLabel.value;
                      }
                    }
                    
                    // to accommodate for where there are two triples (s, p1, o) and (s, p2, o), we get all the 
                    // links with the same source and target from `links`. If there is one, we give it a new
                    // label of 'p1 & p2', or either p1 or p2 if one predicate is not labelled.
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

  const data = transformDataForGraph(rawResponseData);

  const width = window.innerWidth;
  const height = 700;
  const radius = 60;
  const ellipseWidth = radius * 1.5;
  const ellipseHeight = radius / 2.5;

  const zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);
 
  function zoom_actions(){
    group.attr("transform", d3.event.transform)
  }

  const links = data.links.map(d => Object.create(d));
  const nodes = data.nodes.map(d => Object.create(d));

  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(2.5*radius).strength(1))
      .force("charge", d3.forceManyBody().strength(-20))
      .force('collide', d3.forceCollide().radius(function (d) {return ellipseWidth}))
      .force("center", d3.forceCenter(width / 4, height / 2))
      .force("x", d3.forceX([width/2]).strength(0.01))
      .force("y", d3.forceY([height/2]).strength(0.15))
      .alphaTarget(0.01);
    
  const svg = d3.select('#resultContainer').append('svg')
  // .attr('width', width)
  // .attr('height', height)
  .attr("viewBox", [0, 0, width, height])
  .attr('text-anchor', 'middle')
  .style('font', '14px sans-serif');

  const group = svg.append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`);

  zoom_handler(svg);  

  group.append('defs').append('marker')
    .attr("id",'arrowhead')
    .attr('viewBox','-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
     .attr('refX',radius) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
     .attr('refY',0)
     .attr('orient','auto')
        .attr('markerWidth',13)
        .attr('markerHeight',13)
        .attr('xoverflow','visible')
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#999')
    .style('stroke','none');

  const link = group
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1)
      .attr("marker-end", "url(#arrowhead)");
  //    .attr("stroke-width", d => Math.sqrt(d.value));

  link.append("title")
      .text(function (d) {return "link text";});

  edgepaths = group.selectAll(".edgepath")
    .data(links)
    .enter()
    .append('path')
    .attr('class', 'edgepath')
    .attr('fill-opacity', 0)
    .attr('stroke-opacity', 0)
    .attr('id', function (d, i) {return 'edgepath' + i})
    .style("pointer-events", "none");

  edgelabels = group.selectAll(".edgelabel")
    .data(links)
    .enter()
    .append('text')
    .style("pointer-events", "none")
    .attr('class', 'edgelabel')
    .attr('id', function (d, i) {return 'edgelabel' + i})
    .attr('font-size', 12)
    .attr('fill', '#aaa');
    
  edgelabels.append('textPath')
    .attr('xlink:href', function (d, i) {return '#edgepath' + i})
    .style("text-anchor", "middle")
    .style("pointer-events", "none")
    .attr("startOffset", "50%")
    .text(function (d) {return d.label || ''});

  const node = group.selectAll(".node")
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag() 
        .on("start", dragstarted) //start - after a new pointer becomes active (on mousedown or touchstart).
        .on("drag", dragged) //drag - after an active pointer moves (on mousemove or touchmove).
        .on("end", dragended)
      )
      .on('click', function (d) {
        if (d.id.startsWith('http')) {
          window.open(d.id);
        }});
  
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.1).restart();//sets the current target alpha to the specified number in the range [0,1].
    d.fy = d.y; //fx - the node’s fixed x-position. Original is null.
    d.fx = d.x; //fy - the node’s fixed y-position. Original is null.
  }
  
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) {
      simulation.alphaTarget(0.01)
    }
  }

  const setCircleColor = function(d){
    if (d.id.includes("collection.sciencemuseum")) {
      return "#FF9B42"
    } else if (d.id.includes("wikidata")) {
      return "#FFE39D"
    }
    else {
      return "#E9F4F6"
    }
  }

  //Add circles to each node
  // const circle = node.append("circle")
  //     .attr("r", radius)
  //     .attr("stroke", "#000")
  //     .attr("stroke-opacity", 1.0)
  //     .attr("stroke-width", 2)
  //     .attr("fill-opacity", 1)
  //     .attr("fill", d => setCircleColor(d) )
      
  // Ellipses instead of circles
  node.append("ellipse")
      .attr("rx", function(d) { return ellipseWidth; })
      .attr("ry", function(d) { return ellipseHeight; })
      // .attr("stroke", "#000")
      .attr("stroke-opacity", 0)
      .attr("stroke-width", 0)
      .attr("fill-opacity", 1)
      .attr("fill", d => setCircleColor(d) )
      
  const side = 2 * radius * Math.cos(Math.PI / 4),
    dx = radius - side / 2;  

  // label
  node.append("g")
    .attr('transform', 'translate(' + [ellipseWidth * -0.75, ellipseHeight * -0.5] + ')')
    .append("foreignObject")
    .attr("width", ellipseWidth/radius*side)
    .attr("height", ellipseHeight/radius*side)
    .append("xhtml:p")
    .attr("class", "center")
    .html((d) => d.label );

  simulation.on("tick", () => {
    node
      .attr('r', radius)
      // attempts at keeping the nodes within the bounding box
      // .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
      // .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); })
      // alternative to above
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")" );

    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    edgepaths.attr('d', function (d) {
        return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
    });

    edgelabels.attr('transform', function (d) {
        if (d.target.x < d.source.x) {
            var bbox = this.getBBox();

            rx = bbox.x + bbox.width / 2;
            ry = bbox.y + bbox.height / 2;
            return 'rotate(180 ' + rx + ' ' + ry + ')';
        }
        else {
            return 'rotate(0)';
        }
    })

  });

}

let renderMode = 'table';
function setRenderMode(evt) {
  renderMode = evt.options[evt.selectedIndex].value;
  if (rawResponseData) {
    clearResults();
    render();
  }
}

function renderBoolean(bool) {
  const p = document.createElement('p');
  p.id = 'booleanResult';
  const text = document.createTextNode(bool);
  p.appendChild(text);
  document.querySelector('#resultContainer').appendChild(p);
}

function render() {
  // detect results from ASK queries
  if (typeof rawResponseData['boolean'] === 'boolean') {
    renderBoolean(rawResponseData['boolean'].toString());
    return;
  }

  if (renderMode === 'images') {
    if (rawResponseData.head.vars.includes('thumbnail')) {
      renderImages();
    } else {
      flashMessage('Could not render Image grid. No variable named "thumbnail".');
      renderTable();
    }
  } else if (renderMode === 'pie') {
    if (rawResponseData.head.vars.includes('count') && rawResponseData.head.vars.includes('label')) {
      renderPieChart();
    } else {
      flashMessage('Could not render Pie chart. Missing variables "count"/"label".');
      renderTable();
    }
  } else if (renderMode === 'graph') {
    if (rawResponseData.head.vars.length > 1) {
      renderGraph();
    } else {
      flashMessage('Could not render Force Directed graph. Response data needs more than one column.');
      renderTable();
    }
  } else {
    renderTable();
  }
}


function setupQueryLibrary() {
  // fetch('queries.json').then(response => {
  fetch('https://raw.githubusercontent.com/TheScienceMuseum/thor-docker/main/public_html/queries.json').then(response => {
    return response.json();
  }).then(data => {
    data.forEach(query => {
      const li = document.createElement('li');
      const div = document.createElement('div');
      div.classList.add('interactive');
      div.dataset.query = query.body;
      const h3 = document.createElement('h3');
      const h3Text = document.createTextNode(query.title);

      h3.appendChild(h3Text);
      div.appendChild(h3);

      query.tags.forEach(tag => {
        const span = document.createElement('span');
        const spanText = document.createTextNode(tag);

        span.classList.add('raa-label', 'm-l-small');
        span.appendChild(spanText);
        div.appendChild(span);
      });

      div.addEventListener('click', e => {
        const hostElm = (e.target.tagName === 'DIV') ? e.target : e.target.parentElement;
        yasqe.setValue(hostElm.dataset.query);
        window.location.hash = '';
      });

      li.appendChild(div);
      document.querySelector('#query-library-container').appendChild(li);
    });
  });
}
setupQueryLibrary();

// get endpoint and init

function closeAndSetEndpointModal() {
  const endpoint = document.querySelector('#endpointInput').value;
  localStorage.setItem('endpoint', endpoint);
  yasqe.options.sparql.endpoint = localStorage.getItem('endpoint');
  window.location.hash = '';
}

// Manually set / overide the endpoint for use woith Heritage Connector Fuseki instance
localStorage.setItem('endpoint', 'http://63.33.68.17:8080');

if (localStorage.getItem('endpoint') !== null) {
  YASQE.defaults.sparql.endpoint = localStorage.getItem('endpoint');
} else {
  window.location.hash = 'endpoint-modal';
}

var yasqe = YASQE(document.getElementById('queryEditor'));

// drag to change editor size logic

const handle = document.querySelector('.handle');
const container = document.querySelector('#queryEditor');

let startX;
let startY;
let startH;

function onDrag(e) {
  yasqe.setSize(null, Math.max(200, (startH + e.y - startY)) + 'px'); // 200px = min height
}

function onRelease() {
  document.body.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', onRelease);
}

handle.addEventListener('mousedown', e => {
  startX = e.x;
  startY = e.y;
  startH =  parseInt(window.getComputedStyle(container).height.replace(/px$/, ''));

  document.body.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', onRelease);
});

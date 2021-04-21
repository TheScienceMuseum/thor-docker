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
  // const data = rawResponseData.results.bindings.map(data => {
  //   return {
  //     subject: data['s'].value,
  //     predicate: data['p'].value,
  //     object: data['o'].value,
  //   };
  // });

  data = {"nodes":[{"id":1,"entityId":"fd1f96a5-1ea8-4532-ba0d-42db936801cb","group":1,"name":"Apples LLC","influence":8},{"id":2,"entityId":"19275365-5f7f-45e7-acda-d18933c86fc6","group":1,"name":"Driver Drives U","influence":8},{"id":3,"entityId":"1c70bc82-229e-4ceb-8110-22cc92805fe3","group":1,"name":"Krakatoa equity partners","influence":8},{"id":4,"entityId":"461ab5a1-e30f-4ffd-9ee9-2b4f85f98e0a","group":1,"name":"Leaping Lizards 1.0","influence":8},{"id":5,"entityId":"61d73985-4d6d-4d3c-90cb-2535c2a28641","group":1,"name":"Charly Charts","influence":8},{"id":6,"entityId":"b825e2cd-d848-4aba-b09d-82c72ccf8115","group":1,"name":"Hatteras Capital, LLP","influence":8},{"id":7,"entityId":"b939cbb6-a437-43da-8cd6-d11537879cdf","group":1,"name":"Indiana Sushi Co","influence":8},{"id":8,"entityId":"bb6ca6f9-5dfc-4bbe-a8f0-28c67c972f45","group":1,"name":"Echo Automotive, LLP","influence":8},{"id":9,"entityId":"d9a34dbf-4142-454b-9adc-4759f7b96ab9","group":1,"name":"BoomBox Radio Parts","influence":8},{"id":10,"entityId":"debb7db4-f740-4393-babf-31e3793b50de","group":1,"name":"French French Fries, LLC","influence":8},{"id":11,"entityId":"ed59c29f-23a3-43a8-b512-3e182208a0a8","group":1,"name":"Golf Partners, LLP","influence":8},{"id":12,"entityId":"ed6a2f01-c025-4370-b021-196b541c8f28","group":1,"name":"Maximum return capital parters holdco","influence":8},{"id":13,"entityId":"ff2ce5ea-61e8-4e86-89de-1d05317f62f3","group":1,"name":"Julie and Katie Bakery","influence":8}],"links":[{"source":6,"target":13,"weight":1},{"source":9,"target":5,"weight":1},{"source":9,"target":2,"weight":1},{"source":9,"target":8,"weight":1},{"source":9,"target":10,"weight":1},{"source":9,"target":11,"weight":1},{"source":9,"target":6,"weight":1},{"source":1,"target":9,"weight":5}]}

  const width = window.innerWidth;
  const height = 500;
  const radius = 50;

  const zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);
 
  function zoom_actions(){
    group.attr("transform", d3.event.transform)
  }

  const links = data.links.map(d => Object.create(d));
  const nodes = data.nodes.map(d => Object.create(d));

  const forceCollide = d3.forceCollide(d => d.influence * d.name.length)
      .strength(0.8);

  //custom force to put stuff in a box 
  function box_force(alpha) { 
    for (var i = 0, n = nodes.length; i < n; ++i) {
      curr_node = nodes[i];
      curr_node.x = Math.max(radius, Math.min(width - radius, curr_node.x));
      curr_node.y = Math.max(radius, Math.min(height - radius, curr_node.y));
    }
  }

  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody())
      .force('collide', forceCollide)
      .force("center", d3.forceCenter(width / 4, height / 2))
      // .force("box_force", box_force);
      // .force("x", d3.forceX([width/2]).strength(0.01))
      // .force("y", d3.forceY([height/2]).strength(0.05));
    

  // original
  // const svg = d3.create("svg")
  //   .attr("viewBox", [0, 0, width, height])

  const svg = d3.select('#resultContainer').append('svg')
  // .attr('width', width)
  // .attr('height', height)
  .attr("viewBox", [0, 0, width, height])
  .attr('text-anchor', 'middle')
  .style('font', '14px sans-serif');

  const group = svg.append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`);

  //zoom_handler(svg);  

  const link = group
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 1.0)
      .attr("stroke-width", 3);
  //    .attr("stroke-width", d => Math.sqrt(d.value));

  const node = group.selectAll(".node")
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
  //      .call(drag(simulation));

  const color = function(d){return "#ffffff"}

  //Add circles to each node
  const circle = node.append("circle")
       .attr("r", radius)
  //     .attr("r", (d) => d.influence > 15 ? d.influence : d.influence / 2 )
      .attr("stroke", "#000")
      .attr("stroke-opacity", 1.0)
      .attr("stroke-width", 3)
      .attr("fill-opacioty", 0)
      .attr("fill", d => color(d) );

  //Add labels to each node
  /*
  const label = node.append("text")
            .attr("dx", "0em")
            .attr("dy", "0em")
            .attr("font-size", 14 )
  //            .attr("font-size", (d) => d.influence * 1.5 > 40 ? d.influence * 1.5: 14 )
            .attr("text-anchor", "middle")
            .text((d) => d.name )
            .call(wrap, 100);
  */

  const side = 2 * radius * Math.cos(Math.PI / 4),
    dx = radius - side / 2;  

  const label = node.append("g")
    .attr('transform', 'translate(' + [radius * -0.75, radius * -0.5] + ')')
    .append("foreignObject")
    .attr("width", side)
    .attr("height", side)
    .append("xhtml:body")
    .append("span")
    .attr("class", "center")
    .html((d) => d.name );

  simulation.on("tick", () => {
    node
      .attr('r', d => d.influence)
      // attempts at keeping the nodes within the bounding box
      .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
      .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); })
      // alternative to above
      // .attr("cx", d => d.x)
      // .attr("cy", d => d.y)
      .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")" );

    link
        //.attr("stroke-width", d => d.weight * 10)
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

  });

  // invalidation.then(() => simulation.stop());
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
    if (rawResponseData.head.vars.includes('s') && rawResponseData.head.vars.includes('p') && rawResponseData.head.vars.includes('o')) {
      renderGraph();
    } else {
      flashMessage('Could not render Force Directed graph. Missing variables "s-p-o".');
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

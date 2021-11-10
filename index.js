const fs = require('fs')

const template = fs.readFileSync('index_template.html', 'utf8');
const html = template.replace('<!-- ENDPOINT -->', process.env.SPARQL_ENDPOINT)

fs.writeFileSync('public_html/index.html', html)
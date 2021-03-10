# fuseki-thor

Docker image for [Thor](https://github.com/Abbe98/thor).  
An interactive SPARQL Editor for K-samsök.

## Usage (local)

### To build:

``` bash
docker build --no-cache . -t thor
```

### To run:

``` bash
docker run -p 80:80 thor
```
or to run as a demon

``` bash
docker run -d --restart=always -p 80:80 thor
```

### To stop:

``` bash
docker stop thor
```

### HC Endpoint
http://63.33.68.17:3030/heritage-connector/sparql
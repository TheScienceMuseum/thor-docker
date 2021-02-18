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

### To stop:

``` bash
docker stop thor
```
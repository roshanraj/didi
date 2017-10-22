all: clean build

build: 
	go build ./

clean:
	rm -f didi
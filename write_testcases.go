package main

import (
	"fmt"
	"io"
	"os"
	"regexp"
)

func getClassName() {

}
func getPublicFunctions(line string) {
	// matched, err := regexp.MatchString("public\\s*[a-zA-Z]+\\([^\\)]*\\)(\\.[^\\)]*\\))?:?", line)
	re := regexp.MustCompile("public\\s*[a-zA-Z]+\\([^\\)]*\\)(\\.[^\\)]*\\))?:?")
	match := re.FindStringSubmatch(line)
	fmt.Println("********")
	fmt.Println(line)
	fmt.Println("********")
	fmt.Println("______________")
	fmt.Println(match)
	fmt.Println("______________")

	// if err == nil {
	// 	fmt.Println(" _________ ", matched)
	// } else {
	// 	fmt.Println(" __######___ ", err)
	// }

}

func ReadFile(path string) {
	var file, err = os.OpenFile(path, os.O_RDWR, 0644)
	if err != nil {
		return
	}
	defer file.Close()

	// read file, line by line
	var text = make([]byte, 1024)
	for {
		_, err := file.Read(text)
		// getPublicFunctions(string(line))
		// break if finally arrived at end of file
		if err == io.EOF {
			break
		}

		// break if error occured
		if err != nil && err != io.EOF {
			if err != err {
				break
			}
		}
	}

	fmt.Println("==> done reading from file")
	getPublicFunctions(string(text))
	// fmt.Println(string(text))
}

func WriteTestCases(read_file_from, write_file_to string) {
	fmt.Println("Read test cases to ", read_file_from)
	ReadFile(read_file_from)
	fmt.Println("writing test cases to ", write_file_to)
}

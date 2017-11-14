package main

import (
	"bufio"
	"bytes"
	"fmt"
	"os"
	"regexp"
	"text/template"
)

type TestCase struct {
	ClassName    string
	FunctionName []string
}

func (t *TestCase) writeToFile() {

	fmt.Println("\n Function")
	fmt.Println("_______________________________________________________---")
	for x := range t.FunctionName {
		fmt.Println(t.FunctionName[x])
	}
	fmt.Println("_______________________________________________________---")
	fmt.Println("\n Class")
	fmt.Println("_______________________________________________________---")
	fmt.Println(t.ClassName)
}

func (t *TestCase) templateParser(td string) string {
	tem := template.Must(template.New("testcase").Parse(td))
	fmt.Println(tem)
	var pt bytes.Buffer
	tem.Execute(&pt, t)
	s := pt.String()
	return s
}

func getClassName(line string, t *TestCase) {
	re := regexp.MustCompile("export class+\\s[A-za-z]+\\s")
	match := re.FindStringSubmatch(line)
	if len(match) > 0 {
		fmt.Println("----", match)
		t.ClassName = match[0]
	}
}
func getPublicFunctions(line string, t *TestCase) {
	// matched, err := regexp.MatchString("public\\s*[a-zA-Z]+\\([^\\)]*\\)(\\.[^\\)]*\\))?:?", line)
	re := regexp.MustCompile("public\\s*[a-zA-Z]+\\([^\\)]*\\)(\\.[^\\)]*\\))?:?")
	match := re.FindStringSubmatch(line)
	if len(match) > 0 {
		fmt.Println("----", match)
		t.FunctionName = append(t.FunctionName, match[0])
	}
}

func ReadFile(path string) {
	inFile, _ := os.Open(path)
	defer inFile.Close()
	scanner := bufio.NewScanner(inFile)
	scanner.Split(bufio.ScanLines)
	t := TestCase{}
	t.FunctionName = make([]string, 0)
	for scanner.Scan() {
		getPublicFunctions(scanner.Text(), &t)
		getClassName(scanner.Text(), &t)
	}
	t.writeToFile()
	fmt.Println(t.templateParser(NewTemplate()))

}

func WriteTestCases(readFileFrom, writeFileTo string) {
	fmt.Println("Read test cases to ", readFileFrom)
	ReadFile(readFileFrom)
	fmt.Println("writing test cases to ", writeFileTo)
}

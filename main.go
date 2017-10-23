package main
import (
	"fmt"
	"github.com/spf13/pflag"
	"os"
	"strings"
	"path/filepath"	
	"regexp"
)

func main(){
	var file_path = pflag.StringP("flagname","f" ,"./", "path to src")
	pflag.Parse()
	ReadDir(*file_path)
}

func isValidFileToHaveUnitTestCase(file_path string) bool{
	return !strings.Contains(file_path, "module")
}

func istypescriptFile(file_path string) bool{
	matched, err := regexp.MatchString("\\.ts", file_path)
	specsMatched, serr := regexp.MatchString("\\.specs.ts", file_path)
	if err == nil && serr == nil{
		return matched && !specsMatched
	}else{
		return false
	}
}

func generateSpecsFile(file_path string){
	var re = regexp.MustCompile("\\.ts")
	var newFileName = re.ReplaceAllString(file_path, ".specs.ts")
	fmt.Println("new file  --  ",newFileName)
	
	fileInfo, err := os.Stat(newFileName)
	
	  // check if there is an error
	  if err != nil {
		 // check if error is file does not exist
		 if os.IsNotExist(err) {
			fmt.Println("File does not exist.")
			os.OpenFile(newFileName, os.O_RDONLY|os.O_CREATE, 0666)
		 }
	  } else {

	   fmt.Println(fileInfo.Name() , "exists")
	  }
}

func ReadDir(searchDir string){
		fmt.Println(searchDir);
		fmt.Println();
		fileList := []string{}
		err := filepath.Walk(searchDir, func(path string, f os.FileInfo, err error) error {
			fileList = append(fileList, path)
			return nil
		})
		if err == nil {
			for x, file := range fileList {
				if isValidFileToHaveUnitTestCase(file){
					if istypescriptFile(file){
					
							
					
						fmt.Println(x,"  --  ",file, " ts file ")
						generateSpecsFile(file)
					}else{
						fmt.Println(x,"  --  ",file)
					}
				}else{
					fmt.Println(x,"  --  ",file, "  ---  not valid")
				}
			}
		}else{
			fmt.Println("Oops something broke",err);
		}
}
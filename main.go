package main
import (
	"fmt"
	"github.com/spf13/pflag"
	"os"
    "path/filepath"	
)

func main(){
	var file_path = pflag.StringP("flagname","f" ,"./", "path to src")
	pflag.Parse()
	ReadDir(*file_path)
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
				fmt.Println(x,"  --  ",file)
				
			}
		}else{
			fmt.Println("Oops something broke",err);
		}
}
# directory-browser

directory-browser is a nodejs express application which browses the directories and files recursively for any given path.
The API exposes a single endpoint /getallfiles with below sets of query params
  path=<Local directory path, e.g D:\Downloads>
  index=<int value for pagination>
  limit=<int value for pagination>
  
Response Body:
{
  success: true,
  errorMessage: "",
  data: 
  [
    {
      file_name: {
        fullPath: "Full local path of the file",
        extension: "Extension of the file e.g jpeg|png|exe|mp3",
        type: "file",
        name: "Name of the file",
        attributes: {
          size: "Size of file e.g 200KB",
          createdOn: "Date created on",
          lastModifiedOn: "Date last modified on"
        }
      }
    }
  ]
}

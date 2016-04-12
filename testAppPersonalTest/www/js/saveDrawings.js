       function writeDrawingToFile(){
        alert("Test 1");
        document.addEventListener("deviceready", onDeviceReady, false);
        alert("test 2");
       }

        function onDeviceReady() 
        {
            //PERSISTENT indicates that any change we make to the file system now will be permanent. 
            alert("test 3");
            requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, onError);
        }
//fileSystem object points to the hard disk.
        function onSuccess(fileSystem) 
        {   
            alert("Test 4");
            //fileSystem.root points to the application storage directory
            var directoryEntry = fileSystem.root;
         
            //absolute fileSystem path to the application storage directory
            console.log(directoryEntry.fullPath);
            
            //web path(or URL) to the application storage directory
            console.log(directoryEntry.toURL());
            
            //lets create a file named readme.txt. getFile method actually creates a file and returns a pointer(FileEntry) if it doesn't exist otherwise just returns a pointer to it. It returns the file pointer as callback parameter.
            directoryEntry.getFile("readme.txt", {create: true, exclusive: false}, function(fileEntry){
                //lets write something into the file
                fileEntry.createWriter(function(writer){
                    writer.write("Can I get a B-men?");
                    alert("test");
                }, function(error){
                    alert("Error occurred while writing to file. Error code is: " + error.code);
                });
                
                //lets read the content of the file. 
                fileEntry.file(function(file){
                    var reader = new FileReader();
                    reader.onloadend = function (evt) {
                        //result property is string type if you read data as string. If you read data as array buffer then its assigned to a array buffer object.
                        console.log(evt.target.result);
                    };
                    //to read the content as binary use readAsArrayBuffer function.
                    reader.readAsText(file);
                }, function(error){
                    alert("Error occurred while readline file. Error code is: " + error.code);  
                });
                
            }, function(error){
                alert("Error occurred while getting a pointer to file. Error code is: " + error.code);
            });
            
            //create a directory using getDirectory. If already exists it returns a pointer only.
            directoryEntry.getDirectory("new_directory", {create: true, exclusive: false}, function(directoryEntry_1){
                //for any operation inside this directory use directoryEntry_1 object. 
            }, function(error){
                console.log("Error occurred while getting pointer to new directory. Error code is: " + error.code);
            });
            
            //object to read the contents of the directory
            var directoryReader = directoryEntry.createReader();
            
            //now read the contents using the readEntries function.
            directoryReader.readEntries(function(entries){
                var i;
                for (i=0; i<entries.length; i++) 
                {
                    console.log(entries[i].name);
                }
            },function(error){
                console.log("Failed to list directory contents. Error code is: " + error.code);
            });
        }
        
        function onError(evt)
        {
            alert("Error occurred during request to file system pointer. Error code is: " + evt.code);
        }
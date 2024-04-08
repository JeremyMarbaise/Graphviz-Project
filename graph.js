const express = require('express');
const app = express();
const fs = require('fs');
const path=require('path');
const xlsx=require('xlsx');
const graphvizBuilder= require('graphviz-builder');


const appPort = 8080;

// Use on generic function to load file stuff and send it to the client
function loadPage(filename, res) {
    
    fs.readFile(filename,'utf8', (err,data) => {
                    if ( err ) {
                    	res.send(JSON.stringify(err));
                    } else {
                        var page = data.toString();
                        res.send(page);
                    }
                })
}

// The paths (routes) to the files we want to send.


app.use(express.static(path.join(__dirname,'svg')));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname, 'public', 'css')));

app.get('/', (req, res) => {
    loadPage(path.join(__dirname,'public')+'/DynamicGraphviz.html',res);
});

app.get('/graphviz', (req, res) => {
    loadPage(path.join(__dirname,'public')+'/graphviz.html',res);
});

app.get('/getFilenames',(requ,res)=>{
    var filenames=fs.readdirSync(path.join(__dirname,'server')+'/ExcelFiles');
    res.send(filenames);    

});


app.get('/GetDotSource',(req,res)=>
{
    var filename=path.join(__dirname,'server/ExcelFiles/')+req.query.filename;

    var workbook=xlsx.readFile(filename);
    var sheet=workbook.Sheets['Jobs'];

    var jason=xlsx.utils.sheet_to_json(sheet);
    var jobs=[];
    var dependencies=[];
    
    //parse excel:  Column "Table name" contains "jobLabel" and the 4th empty column contains "dependencies label"
    for(let i=5;i<jason.length;i++)
    {
        jobs.push(jason[i]['Table name']);
        dependencies.push(jason[i].__EMPTY_4);
    
    }

    var dot=graphvizBuilder.digraph('Jobs');
    dot.set("bgcolor","transparent");
    dot.set("style","filled");
    dot.setNodeAttribut("shape","box");
    dot.setNodeAttribut("style","rounded,filled");
    
    dot.setNodeAttribut("fillcolor","white");


    jobs.forEach((row,i)=>{

            dot.addNode(row);
    });
    
         
    dependencies.forEach((row, i)=>
    {
        
        if(row)
        {
            //splits dependencies if they are separated with comma or line carriage, the string is trimmed before adding to edge to remove spaces
            row.split(/[\n,]/).map((string,j)=>{
             
                dot.addEdge(string.trim(),jobs[i]);

                //If the dependencies is dependent on another file it is marked with a dot, This dependencie is marked in yellow
                if(string.includes("."))
                {
                    dot.getNode(string.trim()).set("color","yellow");
                }
            

            
            }
                );
            
         }
        
               
    })

    res.send(dot.to_dot());


 
});



app.listen(appPort, () => console.log(`Example app listening on port ${appPort}!`))
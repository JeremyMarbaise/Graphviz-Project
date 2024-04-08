# Dynamic Graphviz 

This project allows for a conversion of excel files into dot language source files in the backend.
Aswell as a dynamic display of this dot source image [DynamicGraphviz.html](public/DynamicGraphviz.html) or a static display [graphviz.html](public/graphviz.html) in the frontend.


### File structure

The backend file graph.js is located in the root directory. There are three main directories , public , server and node_modules .
The public directory contains the HTML files for the frontend aswell as the jquery dependency, it also contains a directory for style sheets.
The server directory is for files stored on the server side, it contains a directory with the ExcelFiles used for the dot source creation.


### Backend

The backend uses Express to route and serve. 
It uses the [xlsx] module to import the excel worksheet and transform it into a json. 
The [graphviz-builder] module is used to convert the joblabel and dependencies of the json into a dot source, where the joblabel constitute the nodes and the edges are defined
by a combination of joblabel and the affected dependencies .

### Static Graphviz

The static conversion of a dot source into an svg is done with the [d3-graphviz] module.
Which is dependent on the visualization library [d3] and the graphviz javascript library [viz].
These 3 modules can be referenced through [unpkg]. 
In my project I use version 2.1.0 of d3-graphviz.

```html
<script src="https://d3js.org/d3.v5.js"></script>
<script src="https://unpkg.com/viz.js@1.8.1/viz.js" type="application/javascript"></script>
<script src="https://unpkg.com/@hpcc-js/wasm@2/dist/graphviz.umd.js" type="javascript/worker"></script>
<script src="https://unpkg.com/d3-graphviz@2.1.0/build/d3-graphviz.js"></script>

```

### DynamicGraphiv.html

The dynamic Graphviz html lets you move nodes independently from each other through dragging of the mouse.
The library used for this dynamic display is [viz-network].
Viz Network provides methods to convert a dot source string into a readable format for the library.

```javascript
var parsedData=vis.parseDOTNetwork(DotSourceString);
var data=
{
    nodes: parsedData.nodes,
    edges: parsedData.edges
}
```
The module can be referenced through unpkg 
```html
<script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
```



[xlsx]: https://www.npmjs.com/package/xlsx
[graphviz-builder]: https://www.npmjs.com/package/graphviz-builder
[d3-graphviz]: https://www.npmjs.com/package/d3-graphviz/v/2.1.0
[d3]: https://github.com/magjac/d3-graphviz
[viz]: https://github.com/mdaines/viz-js
[uppkg]: https://unpkg.com/
[viz-network]: https://visjs.github.io/vis-network/docs/network/

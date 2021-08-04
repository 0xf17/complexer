#!/usr/bin/env node
const fs = require("fs");

function getNode(nodes, id) {
    return nodes.find(node => node.id === id);
}

function getLink(links, src_id, dest_id) {
    return links.find(link => link.src.id === src_id && link.dest.id === dest_id);
}

function compileGraph(obj) {
    var meta = obj.meta;
    var nodes = obj.data.nodes;
    var links = obj.data.links;

    links.forEach(link => {
        const a = getNode(nodes, link.source);
        const b = getNode(nodes, link.target);
        !a.neighbors && (a.neighbors = []);
        !b.neighbors && (b.neighbors = []);
        a.neighbors.push(b.id);
        b.neighbors.push(a.id);
    });

    return { meta, data: { nodes: nodes, links: links } };
}

file = process.argv[2];

fs.readFile(file, "utf8", (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }
    const compiled = compileGraph(JSON.parse(jsonString));
    const str = JSON.stringify(compiled);

    fs.writeFile('./compiled.json', str, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
});



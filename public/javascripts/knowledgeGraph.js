
function queryKnowledgeGraph(subject, index) {
    return new Promise((resolve, reject) => {
        const endpointUrl = 'https://dbpedia.org/sparql';
        const  sparqlQuery= `PREFIX dbo: <http://dbpedia.org/ontology/> PREFIX dbprop: <http://dbpedia.org/property/> SELECT ?bird ?name ?abstract WHERE { ?bird rdf:type dbo:Bird ; dbprop:name ?name OPTIONAL {?bird dbo:abstract ?abstract . FILTER langMatches(lang(?abstract),"en")} FILTER  regex(?name, "`+subject+`", "i" ) }`;
        const encodedQuery = encodeURIComponent(sparqlQuery);
        const url = `${endpointUrl}?query=${encodedQuery}&format=json`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // The results are in the 'data' object
                var bindings = data.results.bindings;

                // console.log(bindings[0].name.value)
                // console.log(bindings[0].abstract.value)
                // console.log(bindings[0].bird.value)

                // console.log(bindings)
                if (bindings) {
                    resolve(bindings)
                } else {
                    reject(new Error('No knowledge graph results'));
                }

            });
    })
}

function insertOption(entry) {
    const dropdown = document.getElementById("identification");
    let relevant = entry.name.value + ", "+ entry.bird.value
    console.log("relevant", relevant)
    let optionHTML = '<option value= `' + relevant + ' `>'+entry.name.value+'</option>'
    dropdown.insertAdjacentHTML("beforeend", optionHTML)
}
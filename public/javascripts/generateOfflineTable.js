
function insertRows(bird, id) {
    const tableBody = document.getElementById("sightingsTableData");
    // console.log(bird._id)
    let link = "/bird?id=" + String(bird._id);
    let rowHtml = "<tr>\n" +
        "            <th scope=\"row\">"+id+"</th>\n" +
        "            <td class=\"col-md-2 px-0\">\n" +
        "                <div class=\"container\" >\n" +
        "                    <img src="+bird.img+" class=\"img-fluid img-thumbnail\">\n" +
        "                </div>\n" +
        "            </td>\n" +
        "            <td>"+bird.bird_name+"</td>\n" +
        "            <td>"+new Date(bird.date).toLocaleString()+"</td>\n" +
        "            <td>"+bird.location+"</td>\n" +
        "            <td>"+bird.description+"</td>\n" +
        "            <td>"+bird.identification+"</td>\n" +
        "            <td>"+bird.addedBy+"</td>\n" +
        "            <td><a href="+ link +" class=\"btn btn-outline-primary stretched-link\">Detailed view</a></td>\n" +
        "        </tr>"
    tableBody.insertAdjacentHTML("beforeend", rowHtml)
}
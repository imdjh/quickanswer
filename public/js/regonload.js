// TODO: replace alert()
function loadXMLDoc() {
    var xmlhttp;

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                window.jsonQA = JSON.parse(xmlhttp.responseText);
                window.sizeJSONQA = window.jsonQA.q.length;
                spinner.stop();     // Stop the spinner on load
                initpage();
                rendereverything();
                attachEvents();
            }
            else if (xmlhttp.status == 404) {
                alert('您要找试题不在!');
            }
            else {
                window.setTimeout(loadXMLDoc, 1000);
            }
        }
    };
    objLocation = window.location;

    xmlhttp.open("GET", objLocation.origin + '/api/json?n=' + objLocation.pathname.replace("/qa/", ""), true);
    xmlhttp.send();
}

// get Ajax on load
if (window.addEventListener) // W3C standard
{
    window.addEventListener('load', loadXMLDoc, false); // NB **not** 'onload'
}
else if (window.attachEvent) // Microsoft
{
    window.attachEvent('onload', loadXMLDoc);
}


function GetXmlHttpObject()
{
    if (window.XMLHttpRequest)  {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        return new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        // code for IE6, IE5
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }
    }
    return null;
}

function LoadXmlDocument(content)
{
    var doc = null;
    if(window.ActiveXObject && /Win/.test(navigator.userAgent))
    {
        // Se il browser supporta ActiveX ed è IE creo l'oggetto come ActiveXObject
        doc = new ActiveXObject("Microsoft.XMLDOM");
        doc.async = false;  // caricamento sincrono
        doc.loadXML(content);
    }
    else if (window.DOMParser)
    {
        var parser = new DOMParser();
        doc = parser.parseFromString(content, "text/xml");
    }
    return doc;
}

function ShowSuggestions()
{
    var hPattern = "^";
    var vPattern = "^";
    
    var col;
    for (col = selected.FirstColumn; col<=selected.LastColumn; col++)  {
        var c;
        if (CrossWordSchema[selected.Row][col].TableCell.hasChildNodes())  {
            c = CrossWordSchema[selected.Row][col].TableCell.firstChild.nodeValue;
            if (c.match("^\\s*$"))  {
                c = ".";
            }
        } else {
            c = ".";
        }
        hPattern += c;
    }

    var row;
    for (row = selected.FirstRow; row<=selected.LastRow ; row++)  {
        if (CrossWordSchema[row][selected.Column].TableCell.hasChildNodes())  {
            c = CrossWordSchema[row][selected.Column].TableCell.firstChild.nodeValue;
            if (c.match("^\\s*$"))  {
                c = ".";
            }
        } else {
            c = ".";
        }
        vPattern += c;
    }
    
    hPattern += "$";
    vPattern += "$";

    var xmlHttp = GetXmlHttpObject();
    if(xmlHttp == null)
    {
        alert("Il tuo browser non supporta Ajax!");
        return;
    }
    
    xmlHttp.onreadystatechange = function()
    {
        if((xmlHttp.readyState == 4) && (xmlHttp.status == 200))  {
            var text = xmlHttp.responseText;
            var xmlDoc = LoadXmlDocument(text);
            if(ParseAndShowHints(xmlDoc, "horizontal", hSuggestionsContent))
            {
                if (hSuggestionsTitle.firstChild)
                    hSuggestionsTitle.firstChild.nodeValue = "Suggerimenti orizzontali:";
                else
                    hSuggestionsTitle.nodeValue = "Suggerimenti orizzontali:";
            }
            else  {
                if (hSuggestionsTitle.firstChild)
                    hSuggestionsTitle.firstChild.nodeValue = "Nessun suggerimento orizzontale trovato!";
                else
                    hSuggestionsTitle.nodeValue = "Nessun suggerimento orizzontale trovato!";
            }
            if(ParseAndShowHints(xmlDoc, "vertical", vSuggestionsContent))
            {
                if (vSuggestionsTitle.firstChild)
                    vSuggestionsTitle.firstChild.nodeValue = "Suggerimenti verticali:";
                else
                    vSuggestionsTitle.nodeValue = "Suggerimenti verticali:";
            }
            else  {
                if (vSuggestionsTitle.firstChild)
                    vSuggestionsTitle.firstChild.nodeValue = "Nessun suggerimento verticale trovato!";
                else
                    vSuggestionsTitle.nodeValue = "Nessun suggerimento verticale trovato!";
            }
            if(hSuggestions.style)  {
                hSuggestions.style.display = "block";
            } else {
                hSuggestions.display = "block";
            }
            if(vSuggestions.style)  {
                vSuggestions.style.display = "block";
            } else {
                vSuggestions.display = "block";
            }
            if(suggestionsHeader.style)  {
                suggestionsHeader.style.display = "none";
            } else {
                suggestionsHeader.display = "none";
            }
       }
    }
    
    var request = "suggestions.php?hpattern=" + escape(hPattern) + "&vpattern=" + escape(vPattern);
    xmlHttp.open("GET", request, true);
    // xmlHttp.setRequestHeader("Cache-Control", "no-cache");
    xmlHttp.send(null);
    
    if(suggestionsHeader.style)  {
        suggestionsHeader.style.display = "block";
    } else {
        suggestionsHeader.display = "block";
    }
    if(hSuggestions.style)  {
        hSuggestions.style.display = "none";
    } else {
        hSuggestions.display = "none";
    }
    if(vSuggestions.style)  {
        vSuggestions.style.display = "none";
    } else {
        vSuggestions.display = "none";
    }
    if(suggestionsHeader.firstChild)  {
        suggestionsHeader.firstChild.nodeValue = "Attendere...";
    } else  {
        suggestionsHeader.nodeValue = "Attendere...";
    }
}


function ParseAndShowHints(xmlDoc, which, suggestionsContent)
{
    var nodes;
    try {
        // Internet Explorer
        nodes = xmlDoc.selectNodes("hints/" + which + "/h");
    } catch(e) {
        // Firefox
        nodes = xmlDoc.getElementsByTagName(which)[0].getElementsByTagName("h");
    }

    if (nodes.length > 0)
    {
        while(suggestionsContent.hasChildNodes())  {
            suggestionsContent.removeChild(suggestionsContent.lastChild);
        }
        for (var i=0; i<nodes.length; i++)
        {
            var span = suggestionsContent.appendChild(document.createElement("span"));
            var node = span.appendChild(document.createTextNode(nodes[i].firstChild.nodeValue));
            span.setAttribute("class", "suggestion");
            if(i < nodes.length-1)  {
                suggestionsContent.appendChild(document.createTextNode(", "));
            }
        }
        if(suggestionsContent.style)  {
            suggestionsContent.style.display = "block";
        } else {
            suggestionsContent.display = "block";
        }
        return true;
    }
    else
    {
        if(suggestionsContent.style)  {
            suggestionsContent.style.display = "none";
        } else {
            suggestionsContent.display = "none";
        }
        return false;
    }
}
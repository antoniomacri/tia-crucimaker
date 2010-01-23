
function StampaCrittografato()
{
    var wnd = window.open("", "crucicritt");
    
    wnd.document.writeln("<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/html4/strict.dtd'>");
    wnd.document.writeln("<html>");
    wnd.document.writeln("<head>");
    wnd.document.writeln("  <title></title>");
    wnd.document.writeln("  <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>");
    wnd.document.writeln("  <link href='css/video.css' rel='stylesheet' type='text/css'>");
    wnd.document.writeln("</head>");
    wnd.document.writeln("<body>");
    wnd.document.writeln("<h2>Cruciverba crittografato</h2>");

    var array = new Array();
    for(i=0; i<26; i++)
    {
        array[i] = i;
    }
    array.sort(function(){return Math.round(Math.random()*3-1.5);});

    wnd.document.writeln("<table class='board'>");
    for(i=0; i<CrossWordSchema.length; i++)
    {
        wnd.document.writeln("<tr>");
        for(j=0; j<CrossWordSchema[i].length; j++)
        {
            var cell = CrossWordSchema[i][j];
            if (cell.IsBlackened)  {
                wnd.document.writeln("<td class='cell-numbered' style='background-color:black'></td>");
            }
            else  {
                var num = cell.TableCell.firstChild.nodeValue.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
                num = array[num] + 1;
                wnd.document.writeln("<td class='cell-numbered'><span class='cell-number'>" + num + "</span></td>");
            }
        }
        wnd.document.writeln("</tr>");
    }
    wnd.document.writeln("</table>");

    wnd.document.writeln("</body>");
    
    wnd.document.close();
}

function StampaDefinito()
{
    var wnd = window.open("", "crucidef");
    
    wnd.document.writeln("<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/html4/strict.dtd'>");
    wnd.document.writeln("<html>");
    wnd.document.writeln("<head>");
    wnd.document.writeln("  <title></title>");
    wnd.document.writeln("  <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>");
    wnd.document.writeln("  <link href='css/video.css' rel='stylesheet' type='text/css'>");
    wnd.document.writeln("</head>");
    wnd.document.writeln("<body>");
    wnd.document.writeln("<h2>Cruciverba</h2>");

    // Si noti l'utilizzo di innerHTML per ricopiare in modo rapido e semplice la tabella relativa allo schema del cruciverba
    wnd.document.writeln("<table class='board'>" + document.getElementById("board-numbered").innerHTML + "</table>");

    var i;
    wnd.document.writeln("<h3>Orizzontali</h3>");
    for(i=1; i<horizontalDefs.childNodes.length; i++)
    {
        var node = horizontalDefs.childNodes.item(i);
        if (node.nodeName.toUpperCase() == "LABEL") {
            var s = node.firstChild.nodeValue;
            wnd.document.writeln("<p>" + s.substr(0,s.indexOf(".")) + "<br>" + escapeHTML(node.childNodes.item(2).value) + "</p>");
        }
    }

    wnd.document.writeln("<h3>Verticali</h3>");
    for(i=1; i<verticalDefs.childNodes.length; i++)
    {
        var node = verticalDefs.childNodes.item(i);
        if (node.nodeName.toUpperCase() == "LABEL") {
            var s = node.firstChild.nodeValue;
            wnd.document.writeln("<p>" + s.substr(0,s.indexOf(".")) + "<br>" + escapeHTML(node.childNodes.item(2).value) + "</p>");
        }
    }

    wnd.document.writeln("</body>");
    
    wnd.document.close();
}


function escapeHTML(s)
{
    return s.replace(/&/, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace("\"", "&quot;");
}

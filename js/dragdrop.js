// Gestione Drag & Drop
var dragging = false;
var draggedObject = null;

function Move(e)
{
    e = e || window.event;
    
    var mousePos_x = e.clientX + document.body.scrollLeft - document.body.clientLeft;
    var mousePos_y = e.clientY + document.body.scrollTop  - document.body.clientTop;
    if(dragging && draggedObject)  {
        if(draggedObject.style)  {
            draggedObject.style.left = mousePos_x + 2 + "px";
            draggedObject.style.top = mousePos_y + 2 + "px";
        }
        else  {
            draggedObject.left = mousePos_x + 2;
            draggedObject.top = mousePos_y + 2;
        }

        var oggetto = e.target || e.srcElement;
        if(oggetto.getAttribute("class") == "cell")
        {
            var s = draggedObject.firstChild.nodeValue;
            CrossWordSchema[oggetto.parentNode.rowIndex][oggetto.cellIndex].TryInject(s, e.shiftKey);
        }
        return false;
    }
}

function Drop(e)
{
    document.onmousemove = null;
    document.onmouseup = null;
    dragging = false;
    
    e = e || window.event;

    var oggetto = e.target || e.srcElement;
    if(oggetto.getAttribute("class") == "cell")
    {
        var s = draggedObject.firstChild.nodeValue;
        CrossWordSchema[oggetto.parentNode.rowIndex][oggetto.cellIndex].Inject(s, e.shiftKey);
    }
    else
    {
        // nascondo la linee evidenziata
        selected.EndInject();
    }
    
    document.body.removeChild(draggedObject);
    draggedObject = null;
}

function Drag(e)
{
    e = e || window.event;
    var oggetto = e.target || e.srcElement;

    if(oggetto.className == "suggestion")
    {
        var trascinato = oggetto.cloneNode(true);
        trascinato.setAttribute("class", "suggestion-dragging");
        try { document.body.insertBefore(trascinato); }
        catch(e) { document.body.insertBefore(trascinato, document.body.firstChild); }

        dragging = true;
        draggedObject = trascinato;

        Move(e);

        document.onmousemove = Move;
        document.onmouseup = Drop;
        return false;
    }
}

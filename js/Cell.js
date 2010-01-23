
// Colore della cella selezionata. La cella selezionata è quella per la quale
// sono visualizzate le informazioni nel pannello laterale destro
var SELECTED_COLOR = "#E6E6E6";

// Colori delle celle evidenziate. Le celle evidenziate sono quelle sulle
// quali l'utente sta effettuando il drag and drop.
var HIGHLIGHTED_COLOR_VALID = "#40FF40";
var HIGHLIGHTED_COLOR_INVALID = "#FF4040";

// Cella selezionata
var selected = null;


function Cell(row, column)
{
     this.Column = column;
     this.Row = row;
     this.TableCell = board.rows.item(this.Row).childNodes[this.Column];

     this.IsBlackened = false;

     this.FirstColumn = 0;
     this.FirstRow = 0;
     this.LastColumn = 0;
     this.LastRow = 0;
}


Cell.prototype.Select = function()
{
    if (selected != this)
    {
        if (selected && !selected.IsBlackened)
        {
            selected.TableCell.style.backgroundColor = "";
        }

        if(!this.IsBlackened)
        {
            this.TableCell.style.backgroundColor = SELECTED_COLOR;
        }

        selected = this;

        var col = this.Column;
        while (IsCellFillable(this.Row, col-1))  { col--; }
        this.FirstColumn = col;

        col = this.Column;
        while (IsCellFillable(this.Row, col+1))  { col++; }
        this.LastColumn = col;

        var row = this.Row;
        while (IsCellFillable(row-1, this.Column))  { row--; }
        this.FirstRow = row;

        row = this.Row;
        while (IsCellFillable(row+1, this.Column))  { row++; }
        this.LastRow = row;

        // Aggiorno il pannello laterale
        this.UpdatePanel();
    }
}


Cell.prototype.ProcessKey = function(keyCode, shiftKey)
{
    var c = String.fromCharCode(keyCode);
    if (!CrossWordSchema[this.Row][this.Column].IsBlackened)
    {
        if ((65 <= keyCode && keyCode <= 90) || (97 <= keyCode && keyCode <= 122))
        {
            CrossWordSchema[this.Row][this.Column].TableCell.firstChild.nodeValue = c;
            if (shiftKey)  {
                if(IsCellFillable(this.Row+1, this.Column))
                    CrossWordSchema[this.Row+1][this.Column].Select();
            }
            else if(IsCellFillable(this.Row, this.Column+1))
                CrossWordSchema[this.Row][this.Column+1].Select();
            CheckFinished();
            return true;
        }
        if((keyCode == 8) || (keyCode == 46))
        {
            CrossWordSchema[this.Row][this.Column].TableCell.firstChild.nodeValue = "";
            if (shiftKey)  {
                if(IsCellFillable(this.Row-1, this.Column))
                    CrossWordSchema[this.Row-1][this.Column].Select();
            }
            else if(IsCellFillable(this.Row, this.Column-1))
                CrossWordSchema[this.Row][this.Column-1].Select();
            CheckFinished();
            return true;
        }
    }
    if((keyCode == 37) && (this.Column > 0))
    {
        CrossWordSchema[this.Row][this.Column-1].Select();
    }
    else if((keyCode == 38) && (this.Row > 0))
    {
        CrossWordSchema[this.Row-1][this.Column].Select();
    }
    else if((keyCode == 39) && CrossWordSchema[this.Row][this.Column+1])
    {
        CrossWordSchema[this.Row][this.Column+1].Select();
    }
    else if((keyCode == 40) && CrossWordSchema[this.Row+1])
    {
        CrossWordSchema[this.Row+1][this.Column].Select();
    }
    else {
        return false;
    }
    return true;
}


Cell.prototype.TryInject = function(s, vertical)
{
    if(!selected.IsBlackened)  {
        selected.HighlightLine();
    }
    this.Select();

    if(!this.IsBlackened)  {
        var color;
        if(vertical)
        { color = (this.LastRow-this.FirstRow+1 == s.length) ?  HIGHLIGHTED_COLOR_VALID : HIGHLIGHTED_COLOR_INVALID; }
        else
        { color = (this.LastColumn-this.FirstColumn+1 == s.length) ?  HIGHLIGHTED_COLOR_VALID : HIGHLIGHTED_COLOR_INVALID; }
        this.HighlightLine(color, vertical);
    }
}


Cell.prototype.EndInject = function()
{
    if(!this.IsBlackened)  {
        this.HighlightLine();
    }
}


Cell.prototype.Inject = function(s, vertical)
{
    if(!selected.IsBlackened)  {
        selected.HighlightLine();
    }
    this.Select();

    if (!this.IsBlackened)
    {
        if(!vertical)
        {
            if(this.LastColumn-this.FirstColumn+1 == s.length)  {
                for(var col=this.FirstColumn; col<=this.LastColumn; col++)  {
                    CrossWordSchema[this.Row][col].TableCell.firstChild.nodeValue = s.charAt(col-this.FirstColumn);
                }
                CheckFinished();
            }
        }
        else if(this.LastRow-this.FirstRow+1 == s.length)
        {
            for(var row=this.FirstRow; row<=this.LastRow; row++)  {
                CrossWordSchema[row][this.Column].TableCell.firstChild.nodeValue = s.charAt(row-this.FirstRow);
            }
            CheckFinished();
        }
    }
}

Cell.prototype.Blacken = function()
{
    this.IsBlackened = !this.IsBlackened;
    if(this.IsBlackened)
    {
        this.TableCell.style.backgroundColor = "black";            
        this.TableCell.firstChild.nodeValue = "";
    }
    else
    {
        this.TableCell.style.backgroundColor = SELECTED_COLOR;
    }
    CheckFinished();

    this.UpdatePanel();
}

Cell.prototype.StartsHorizontalWord = function()
{
    return (!this.IsBlackened) && (!IsCellFillable(this.Row, this.Column-1) && IsCellFillable(this.Row, this.Column+1));
}

Cell.prototype.StartsVerticalWord = function()
{
    return (!this.IsBlackened) && (!IsCellFillable(this.Row-1, this.Column) && IsCellFillable(this.Row+1, this.Column));
}

Cell.prototype.StartsWord = function()
{
    return this.StartsHorizontalWord() || this.StartsVerticalWord();
}

Cell.prototype.GetHorizontalText = function()
{
    return this.TableCell.firstChild.nodeValue +
         (IsCellFillable(this.Row, this.Column+1) ? CrossWordSchema[this.Row][this.Column+1].GetHorizontalText() : "");
}

Cell.prototype.GetVerticalText = function()
{
    return this.TableCell.firstChild.nodeValue +
         (IsCellFillable(this.Row+1, this.Column) ? CrossWordSchema[this.Row+1][this.Column].GetVerticalText() : "");
}


Cell.prototype.UpdatePanel = function()
{
    if(horizontalLetters.firstChild)
        horizontalLetters.firstChild.nodeValue = this.LastColumn - this.FirstColumn + 1;
    else
        horizontalLetters.nodeValue = this.LastColumn - this.FirstColumn + 1;
    if(verticalLetters.firstChild)
        verticalLetters.firstChild.nodeValue = this.LastRow - this.FirstRow + 1;
    else
        verticalLetters.nodeValue = this.LastRow - this.FirstRow + 1;

    letters.style.display =  this.IsBlackened ? "none" : "";
    suggestion.style.display =  this.IsBlackened ? "none" : "";

    annerisci.checked = this.IsBlackened;
}

function IsCellFillable(row, col)
{
    return ((row >= 0) && CrossWordSchema[row] &&
           (col >= 0) && CrossWordSchema[row][col] &&
           !CrossWordSchema[row][col].IsBlackened) ? true : false;
}

Cell.prototype.HighlightLine = function(color, vertical)
{
    color = color || "";
    if(!vertical || color == "")
    {
        for(var col=this.FirstColumn; col<=this.LastColumn; col++)  {
            CrossWordSchema[this.Row][col].TableCell.style.backgroundColor = color;
        }
    }
    if(vertical || color == "")
    {
        for(var row=this.FirstRow; row<=this.LastRow; row++)  {
            CrossWordSchema[row][this.Column].TableCell.style.backgroundColor = color;
        }
    }
}

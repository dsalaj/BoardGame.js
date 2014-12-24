$(document).ready(function(){
    var f = $('<div id="div1" tile="g" ondrop="drop(event)" ondragover="allowDrop(event)"></div>');
    
    for(i = 0; i < 14; i++) {
        for(j = 0; j < 14; j++) {
            $('#pfield').append(f.clone().attr("y",i).attr("x",j));
        }
    }

    $("#div1[x='5']").attr("tile", "p");

    var u1 = $('<div draggable="true" ondragstart="drag(event)" id="drag1"></div>');
    var u2 = $('<div draggable="true" ondragstart="drag(event)" id="drag2"></div>');
    $('#pfield').children('#div1').first().append(u1);
    $('#pfield').children('#div1').last().prev().append(u2);
    
});

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    var x = ev.target.attributes[5].nodeValue;
    var y = ev.target.attributes[4].nodeValue;
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    if (x == 5) {
      $('#console').prepend("<span>FORBIDDEN ROW 5</span></br>");
    } else {
      ev.target.appendChild(document.getElementById(data));
      $('#console').prepend("<span>" + data + " moved to x:"+ x +" y:" + y + "</span>");
    }
}

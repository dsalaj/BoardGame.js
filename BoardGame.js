
var BOARD = '#pfield';

$(document).ready(function(){
  var f = $('<div id="div1" tile="g" ondrop="drop(event)" ondragover="allowDrop(event)"></div>');
  
  for(i = 0; i < 14; i++) {
      for(j = 0; j < 14; j++) {
          $(BOARD).append(f.clone().attr("y",i).attr("x",j));
      }
  }

  $("#div1[x='5']").attr("tile", "p");

  var u1 = $('<div draggable="true" ondragstart="drag(event)" id="drag1"></div>');
  var u2 = $('<div draggable="true" ondragstart="drag(event)" id="drag2"></div>');
  $(BOARD).children('#div1').first().append(u1);
  $(BOARD).children('#div1').last().prev().append(u2);

  var sec = 5;
  setInterval( function(){
    if(sec == 0) {
      sec = 5;
      $(".roll_dice").attr("active", "yes");
    }
    $(".turn span").html("Next turn in " + sec--);
  }, 1000);

});

function allowDrop(ev) {
    ev.preventDefault();
}

function reachableFrom(r, pos, steps) {
  r.push(pos);
  //console.log(pos.x);
  var s = steps - 1;
  if (s > 0){
    p_r = {x: (pos.x+1), y: pos.y};
    reachableFrom(r, p_r, s);
    p_l = {x: (pos.x-1), y: pos.y};
    reachableFrom(r, p_l, s);
    p_u = {x: pos.x, y: (pos.y-1)};
    reachableFrom(r, p_u, s);
    p_d = {x: pos.x, y: (pos.y+1)};
    reachableFrom(r, p_d, s);
  }
}

function drag(ev) {
  console.log("start draging");
  //if ($(ev.target).attr('id') == 'drag1') {
  ev.dataTransfer.setData("text", ev.target.id);
  var x_current = $(ev.target).closest("#div1").attr("x");
  var y_current = $(ev.target).closest("#div1").attr("y");
  $('#console').prepend("<span> from x:"+ x_current +" y:" + y_current + "</span>");
  // Run the reach algorithm here and mark all reachable field
  var r = [];
  var pos = {x: parseInt(x_current), y: parseInt(y_current)};
  reachableFrom(r, pos, 3);
  console.log(r.length);
}

function drop(ev) {
  var x = $(ev.target).attr("x");
  var y = $(ev.target).attr("y");
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  if (x == 5) {
    $('#console').prepend("<span>FORBIDDEN ROW 5</span></br>");
  } else {
    ev.target.appendChild(document.getElementById(data));
    $('#console').prepend("<span>" + data + " moved to x:"+ x +" y:" + y + "</span>");
  }
}

$(document).ready(function(){
  $(".roll_dice").on("click", function(){
    if($(this).attr("active") == "yes"){
      $(this).attr("active", "no");
      $(".roll span").html("You rolled: " + roll(6));
    }
  });
});

function roll(sides) { 
  with(Math) return 1 + floor(random() * sides); 
}


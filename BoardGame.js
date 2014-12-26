
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
  if (!posContains(r, pos)) {
    r.push(pos);
  }
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

function mark(r, mark) {
  for (var i = 0; i < r.length; i++) {
    $( "div[x='"+r[i].x+"'][ y='"+r[i].y+"']" ).attr("class", mark);
  }
}

var r = [];

function drag(ev) {
  console.log("start draging");
  ev.dataTransfer.setData("text", ev.target.id);
  var x_current = $(ev.target).closest("#div1").attr("x");
  var y_current = $(ev.target).closest("#div1").attr("y");
  $('#console').prepend("<span> from x:"+ x_current +" y:" + y_current + "</span>");
  // Run the reach algorithm here and mark all reachable field
  var pos = {x: parseInt(x_current), y: parseInt(y_current)};
  reachableFrom(r, pos, 3);
  console.log(r);
  mark(r, "active");
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
  mark(r, "");
  r.length = 0; //clear out the reachable fields when move is finished
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

function posEqual(p1, p2) { 
  if (p1.x == p2.x && p1.y == p2.y) {
    return true;
  } else {
    return false;
  }
}

function posContains(r, p) {
  for (var i = 0; i < r.length; i++) { 
    if (posEqual(r[i], p)) {
      return true;
    }
  }
  return false;
}


var BOARD = '#pfield';
var TILE_ = 'tile';
var TILE = '#'+TILE_;
var MAX_TURN = 5;

var r = []; //reachable region
var s = 0; //number of steps

function drag(ev) {
  if ( s == 0 ) {
    return;
  }
  ev.dataTransfer.setData("text", ev.target.id);
  var x_current = $(ev.target).closest(TILE).attr("x");
  var y_current = $(ev.target).closest(TILE).attr("y");
  $('#console').prepend("<span> from x:"+ x_current +" y:" + y_current + "</span>");
  // Run the reach algorithm here and mark all reachable field
  var pos = {x: parseInt(x_current), y: parseInt(y_current)};
  reachableFrom(r, pos, s+1); // s+1 because field on which the unit is standing is also counted
  //console.log(r);
  mark(r, "active");
}

function drop(ev) {
  if ( s == 0 ) {
    return;
  }
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
  s = 0; //all steps are used
}

$(document).ready(function(){
  //var f = $('<div id="div1" tile="g" ondrop="drop(event)" ondragover="allowDrop(event)"></div>');
  var f = $('<div id="'+TILE_+'" tile="g"></div>');
  
  for(i = 0; i < 14; i++) {
      for(j = 0; j < 14; j++) {
          $(BOARD).append(f.clone().attr("y",i).attr("x",j));
      }
  }

  $('div', '#pfield').each(function() {
    var $div = $(this);
    $div.droppable({
      drop: function(ev, ui) {
        $('#drag1').
        css({ top: $div.offset().top, left: $div.offset().left });
        //TODO: Rewrite the old drop function
        if ( s == 0 ) {
          return;
        }
        var x = $(ev.target).attr("x");
        var y = $(ev.target).attr("y");
        $('#console').prepend("<span> moved to x:"+ x +" y:" + y + "</span>");
        //ev.preventDefault();
        ////var data = ev.dataTransfer.getData("text");
        //var data = ui.helper;
        //if (x == 5) {
        //  $('#console').prepend("<span>FORBIDDEN ROW 5</span></br>");
        //} else {
        //  ev.target.appendChild(document.getElementById(data));
        //  $('#console').prepend("<span>" + data + " moved to x:"+ x +" y:" + y + "</span>");
        //}
        //mark(r, "");
        //r.length = 0; //clear out the reachable fields when move is finished
        //s = 0; //all steps are used
      }
    });
  });

  // test map
  $("#tile[x='5'][y='0']").attr("tile", "p");
  $("#tile[x='5'][y='1']").attr("tile", "p");
  $("#tile[x='5'][y='2']").attr("tile", "p");
  $("#tile[x='5'][y='0']").attr("tile", "p");
  $("#tile[x='5'][y='4']").attr("tile", "p");
  $("#tile[x='4'][y='4']").attr("tile", "p");
  $("#tile[x='3'][y='4']").attr("tile", "p");
  $("#tile[x='3'][y='5']").attr("tile", "p");
  $("#tile[x='5'][y='5']").attr("tile", "p");

  var u1 = $('<div id="drag1"></div>'); //first movable unit
  var t1 = $(BOARD).children(TILE).first(); //first tile on the board
  t1.append(u1); //put unit on the tile
  u1.css({ top: t1.offset().top, left: t1.offset().left }); //snap to tile
  u1.draggable({
    start: function(ev, ui) {
      if ( s == 0 ) {
        return;
      }
      // FIXME: check the code under
      var x_current = $(ev.target).closest(TILE).attr("x");
      var y_current = $(ev.target).closest(TILE).attr("y");
      $('#console').prepend("<span> from x:"+ x_current +" y:" + y_current + "</span>");
      // Run the reach algorithm here and mark all reachable field
      var pos = {x: parseInt(x_current), y: parseInt(y_current)};
      reachableFrom(r, pos, s+1); // s+1 because field on which the unit is standing is also counted
      //console.log(r);
      mark(r, "active");
    }
  });

  var sec = MAX_TURN;
  setInterval( function(){
    if(sec == 0) {
      sec = MAX_TURN;
      $(".roll_dice").attr("active", "yes");
    }
    $( "#turn_time_bar" ).progressbar({ value: (1 - sec / (MAX_TURN+1))*100 });
    $(".turn span").html("Next turn in " + sec--);
  }, 1000);

});

//function allowDrop(ev) {
//  ev.preventDefault();
//}

function reachableFrom(r, pos, steps) {
  if (!($("div[x='"+pos.x+"'][ y='"+pos.y+"']").attr("tile")=="g")) return;
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

    p_ru = {x: (pos.x+1), y: (pos.y-1)};
    reachableFrom(r, p_ru, s);
    p_lu = {x: (pos.x-1), y: (pos.y-1)};
    reachableFrom(r, p_lu, s);
    p_rd = {x: (pos.x+1), y: (pos.y+1)};
    reachableFrom(r, p_rd, s);
    p_ld = {x: (pos.x-1), y: (pos.y+1)};
    reachableFrom(r, p_ld, s);
  }
}

function mark(r, mark) {
  for (var i = 0; i < r.length; i++) {
    $( "div[x='"+r[i].x+"'][ y='"+r[i].y+"']" ).attr("class", mark);
  }
}

$(document).ready(function(){
  $(".roll_dice").on("click", function(){
    if($(this).attr("active") == "yes"){
      $(this).attr("active", "no");
      s = roll(6);
      $(".roll span").html("You rolled: " + s);
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

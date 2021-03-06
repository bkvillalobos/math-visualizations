var width = 1000;
var height = 250;
var status = "move";
var container = d3.select("div").append("svg").attr("width", width).attr("height", height);
var text = container.append("text")
                    .text("Start Demo")
                    .attr("x", 10)
                    .attr("y", 20)
                    .attr("font-family", "Calibri")
                    .attr("font-size", "20px")
                    .attr("font-weight", "bold")
                    .attr("fill", "black");
text.on("click", parse);
text.on("mouseover", function(){text.attr("fill", "blue"); });
text.on("mouseout", function(){text.attr("fill", "black");});
var drawLines = d3.svg.line()
                    .x(function(d){ return d.x; })
                    .y(function(d){ return d.y; })
                    .interpolate("linear");
var A, B, C;
var triangle, hypotenuse, legOne, legTwo;
var one_length, two_length, hyp_length;
var aText, bText, cText, aSup, bSup, cSup;
generateTri();

function resetVars(){
  triangle.remove()
  legOne.remove();
  legTwo.remove();
  hypotenuse.remove();
  aText.remove();
  aText = null;
  bText.remove();
  bText = null;
  cText.remove();
  cText = null;
  d3.selectAll("text").remove();
}

function parse(){
  if(status =="first"){
    status = "square";
    text.text("Square each leg");
    nextTransition(one_length, two_length, hyp_length);
  }
  if(status == "draw" || status == "first"){
    status = "move";
    resetVars();
    text = container.append("text")
                    .text("Start Demo")
                    .attr("x", 10)
                    .attr("y", 20)
                    .attr("font-family", "Calibri")
                    .attr("font-size", "20px")
                    .attr("font-weight", "bold")
                    .attr("fill", "black");
    text.on("click", parse);
    text.on("mouseover", function(){text.attr("fill", "blue"); });
    text.on("mouseout", function(){text.attr("fill", "black");});
    generateTri();
  }
  else if(status == "move"){
    status = "square";
    text.text("Square each leg");
    example();
    nextTransition(one_length, two_length, hyp_length);
  }
  else if(status == "square"){
    aSup = container.append("text")
            .text("2")
            .attr("x", 5)
            .attr("y", 200)
            .attr("baseline-shift", "super")
            .attr("font-family", "Calibri")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .attr("fill", "blue");
    bSup = container.append("text")
            .text("2")
            .attr("x", 5)
            .attr("y", 220)
            .attr("baseline-shift", "super")
            .attr("font-family", "Calibri")
            .attr("font-size", "10px")
            .attr("font-weight", "bold")
            .attr("fill", "green");
    cSup = container.append("text")
            .text("2")
            .attr("x", 5)
            .attr("y", 240)
            .attr("baseline-shift", "super")
            .attr("font-family", "Calibri")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .attr("fill", "red");
    text.text("Generate another example");
    denom = Math.pow(hyp_length,.7);
    one_length = one_length*one_length/denom;
    two_length = two_length*two_length/denom;
    hyp_length = hyp_length*hyp_length/denom;
    nextTransition(one_length, two_length, hyp_length);
    status = "draw";
    setTimeout(function(){
      legTwo.transition().delay(400).duration(2000)
        .attr("d", drawLines([{"x": 40 + one_length, "y": 200}, 
                              {"x": 40 + one_length + two_length, "y": 200}]))
        .attr("stroke", "green")
        .attr("stroke-width", 3);
      /*aText.transition().delay(400).duration(2000)
        .attr("x", 10);*/
      bText.transition().delay(400).duration(2000)
        .attr("x", 22)
        .attr("y", 200);
      /*aSup.transition().delay(400).duration(2000)
        .attr("x", 15);*/
      bSup.transition().delay(400).duration(2000)
        .attr("x", 27)
        .attr("y", 200);
      container.append("text")
              .text("+")
              .attr("x", 12)
              .attr("y", 200)
              .attr("font-family", "Calibri")
              .attr("font-size", "12px")
              .attr("font-weight", "bold")
              .attr("fill", "black");
    }, 2000);
  }
}

function generateTri(){
  randOne = Math.round(Math.random()*150);
  randTwo = Math.round(Math.random()*150);
  randThree = Math.round(Math.random()*150);
  //console.log(randOne);
  //console.log(randTwo);
  //console.log(randThree);
  A = [10, 25 + randOne];
  B = [10 + randOne, 25 + randTwo];
  C = [10 + randTwo, 25];
  var triPoints = [{"x": A[0], "y": A[1]}, {"x": B[0], "y": B[1]}, 
                   {"x": B[0], "y": B[1]}, {"x": C[0], "y": C[1]},
                   {"x": C[0], "y": C[1]}, {"x": A[0], "y": A[1]}];
  triangle = container.append("path").attr("d", drawLines(triPoints))
                          .attr("stroke", "black")
                          .attr("stroke-width", 2)
                          .attr("fill", "none");
}

function example(){
  var legs = findHyp(A, B, C);
  hypotenuse = container.append("path").attr("d", drawLines(legs.slice(0,2)))
                              .attr("stroke", "red")
                              .attr("stroke-width", 3);
  legOne = container.append("path").attr("d", drawLines(legs.slice(2,4)))
                        .attr("stroke", "blue")
                        .attr("stroke-width", 3);
  legTwo = container.append("path").attr("d", drawLines(legs.slice(4)))
                        .attr("stroke", "green")
                        .attr("stroke-width", 3);

  //console.log(legs.slice(4,5)[0].x)
  //console.log(dist([legs.slice(4,5)[0].x, legs.slice(4,5)[0].y], 
  //                [legs.slice(5)[0].x, legs.slice(5)[0].y]));
  //console.log(legTwo.x)
  hyp_length = Math.round(dist([legs.slice(0,1)[0].x, legs.slice(0,1)[0].y], 
                  [legs.slice(1,2)[0].x, legs.slice(1,2)[0].y]));
  one_length = Math.round(dist([legs.slice(2,3)[0].x, legs.slice(2,3)[0].y], 
                  [legs.slice(3,4)[0].x, legs.slice(3,4)[0].y]));
  two_length = Math.round(dist([legs.slice(4,5)[0].x, legs.slice(4,5)[0].y], 
                  [legs.slice(5)[0].x, legs.slice(5)[0].y]));

  // this piece of math deals with the inevitable rounding error
  if(Math.pow(one_length,2) + Math.pow(two_length,2) != Math.pow(hyp_length,2)){
    hyp_length = Math.sqrt(Math.pow(hyp_length,2) + ((Math.pow(one_length,2) + Math.pow(two_length,2))) - Math.pow(hyp_length,2));
  }

}

function nextTransition(one, two, three){
  legOne.transition().delay(400).duration(2000)
        .attr("d", drawLines([{"x": 40, "y": 200}, 
                              {"x": 40 + one, "y": 200}]))
        .attr("stroke", "blue")
        .attr("stroke-width", 3);
  if(!aText){
  aText = container.append("text")
            .text("a")
            .attr("x", 0)
            .attr("y", 200)
            .attr("font-family", "Calibri")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .attr("fill", "blue");
  }
  /*container.append("text")
            .text("2")
            .attr("x", 5)
            .attr("y", 200)
            .attr("baseline-shift", "super")
            .attr("font-family", "Calibri")
            .attr("font-size", "10px")
            .attr("fill", "blue");*/

  legTwo.transition().delay(400).duration(2000)
        .attr("d", drawLines([{"x": 40, "y": 220}, 
                              {"x": 40 + two, "y": 220}]))
        .attr("stroke", "green")
        .attr("stroke-width", 3);
  if(!bText){
  bText = container.append("text")
            .text("b")
            .attr("x", 0)
            .attr("y", 220)
            .attr("font-family", "Calibri")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .attr("fill", "green");
  }
  

  hypotenuse.transition().delay(400).duration(2000)
        .attr("d", drawLines([{"x": 40, "y": 240}, 
                              {"x": 40 + three, "y": 240}]))
        .attr("stroke", "red")
        .attr("stroke-width", 3);
  if(!cText){
    cText = container.append("text")
              .text("c")
              .attr("x", 0)
              .attr("y", 240)
              .attr("font-family", "Calibri")
              .attr("font-size", "12px")
              .attr("font-weight", "bold")
              .attr("fill", "red");
  }
  /*container.append("text")
            .text("2")
            .attr("x", 5)
            .attr("y", 240)
            .attr("baseline-shift", "super")
            .attr("font-family", "Calibri")
            .attr("font-size", "10px")
            .attr("fill", "red");*/

  if(status == "square"){
    
  }
}

function dist(pointOne, pointTwo){
  return Math.sqrt(Math.pow(pointOne[0] - pointTwo[0],2) + Math.pow(pointOne[1] - pointTwo[1],2));
}

function findHyp(pointOne, pointTwo, pointThree, returnLegs){
  curMax = dist(pointOne, pointTwo);
  start = pointOne;
  end = pointTwo;
  other = pointThree;
  if(dist(pointTwo, pointThree) > curMax){
    start = pointTwo;
    end = pointThree;
    other = pointOne;
  }
  if(dist(pointThree, pointOne) > curMax){
    start = pointThree;
    end = pointOne;
    other = pointTwo;
  }
  return [{"x": start[0], "y": start[1]}, {"x": end[0], "y": end[1]},
          {"x": end[0], "y": end[1]}, {"x": other[0], "y": other[1]},
          {"x": other[0], "y": other[1]}, {"x": start[0], "y": start[1]}];
}

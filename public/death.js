// Death Counter WIP
var scount;

fetch('http://localhost:8081/streamdeathscurrent')
  .then(function(response) {
    response.text().then(function(text) {
      scount = text;
      done();
    });
  });

function done() {
  let countStr = scount.toString().padStart(3,"0");
  console.log(countStr);
  document.getElementById("d-1").style.animation = `spin-wheel-${countStr[0]} 5.4s ease 0s 1 forwards`;
  document.getElementById("d-2").style.animation = `spin-wheel-0 2s ease-in 0s 1, spin-wheel-0 1s linear 2s 1, spin-wheel-${countStr[1]} 2.${countStr[1]}s ease-out 3s 1 forwards`;
  document.getElementById("d-3").style.animation = `spin-wheel-0 1.2s ease-in 0s 1, spin-wheel-0 0.8s linear 1.2s 4, spin-wheel-${countStr[2]} ${1.4 + countStr[2] / 10}s ease-out 4.4s 1 forwards`;
}
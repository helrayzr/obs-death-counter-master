// Death Counter WIP
let count = 0;
let refresh_delay = 1000;
let countertitle = "";

function load_config() {
  $.get(window.location.href + "config", function(data) {
    // Set the title.
    $(".title span").text(data.counter_title);
	countertitle = data.counter_title;
	//console.log(countertitle);
  });
	
  $.get(window.location.href + "current", function(data) {
	// Set the count.
	count = data;
	//console.log(count);
	//$("span#gamecount").text(data);
  });
}

function update_count() {
  $.get(window.location.href + "current", function(data) {
    // If the current step is changed, update list.
    if (data !== count) {
		count = data;
		//$(".count span").text(count);
	}
  });
  $.get(window.location.href + "title", function(data) {
    // If the current step is changed, update list.
    if (data !== countertitle) {
		countertitle = data;
		$(".title span").text(countertitle);
	}
  });
}

$(document).ready(function(e) {
  // Load configuration.
  load_config();

  // Set active step immediately, then update in loop.
  update_count();
  var interval = setInterval(update_count, refresh_delay);
});

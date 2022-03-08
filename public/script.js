// Death Counter WIP
let count = 0;
let refresh_delay = 1000;

function load_config() {
  $.get(window.location.href + "config", function(data) {
    // Set the title.
    $(".title span").text(data.counter_title);
	// Set the count.
	$(".count span").text(data.count);
    // Set up the item list.
  });
}

function update_count() {
  $.get(window.location.href + "current", function(data) {
    // If the current step is changed, update list.
    if (data !== count) {
		count = data;
		$(".count span").text(count);
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

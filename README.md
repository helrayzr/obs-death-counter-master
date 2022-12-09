# OBS Death Counter Overlay

An HTML and Node.js-based death counter overlay for OBS.

First off, credit where credit is due:

this project was made from a good starting point - Geerlingguy's [obs-task-list-overlay project](https://github.com/geerlingguy/obs-task-list-overlay-master). I liked the use of an http server as a means of making changes to the stream (and use it for my task-based streams), so I modified it to fit the new use case of incrementing and resetting a count - in this case, the number of times I die in a video game stream.

The JS rolling number effect was made from code posted by StackOverflow user [trincot](https://stackoverflow.com/users/5459839/trincot) as a resolution to (https://stackoverflow.com/questions/54438205/roll-counter-increment-by-1)

The Stream Deaths animation was generated via CodePen ([link](https://codepen.io/helrayzr/pen/dyKWpVr) forked from another CodePen CSS/HTML project by [josetxu](https://codepen.io/josetxu/)

Here are the components to this project:

  1. 2 HTML files (`index.html` and `streamdeaths.html`)
    1. `index.html` lays out a stream title, a current death count, and the number of minutes since the death count changed.
	1. `streamdeaths.html` displays the per-stream death count center screen as a 3D rotating dial.
  1. A Node.js HTTP server (`server.js`), which serves the HTML file to OBS, and allows you to control the incrementing and decrementing of the count.
  1. 2 config files (`config.json` and `counts.json`)
    1. `config.json` holds the settings for localhost port, title, and starting count for the stream.
	1. `counts.json` holds the persistent death count for each game.
  
## Customizing the overlay

All the styling for the overlay is embedded in the `index.html` file or in the `public\style.css` file. If you want to tweak the appearance, it should be easy enough if you know basic CSS + JS.

To set a title or change the port used by node.js, open the `config.json` file and edit the file to add in the settings you would like. Similarly, change per-game death counts using the `counts.json` file

## Node.js App setup

After you add your own task list and title, you need to get the Node.js server app running.

First, [install Node.js](https://nodejs.org/en/download/) on your computer.

Next, run the following command in this directory to install the app's dependencies:

```
npm install
```

Then start the local server:

```
node server.js
```

You can open the overlay in a regular web browser by visiting `http://localhost:8081/`, but note that the element sizes and spacing will differ from what is output in OBS.

Always use OBS as the final reference for how things will look during a stream!

## Adding the browser sources in OBS

  1. In an OBS Scene, add a new 'Browser' Source.
  1. For the URL, enter `http://localhost:8081/` (use the port you have configured in `config.json`).
  1. Set the width to `1920` and height to `1080`.
  1. Check the 'Refresh browser when scene becomes active' option.
  1. Click 'OK', and the overlay should appear.
  1. Repeat steps as a separate Browser source for URL `http://localhost:8081/streamdeaths` (note: play around with the width and height on this one to determine how big you want the stream count to display.)

## Adjusting the count

To control the count, there are two paths the Node.js app responds to:

```
/death - Increase the current count by 1
/reset - Decrease the current count by 1
/game/<game name> - Changes the game to <game name> and updates the count to the saved value (note: if it is the first time using the game title, it will automatically create a new persistent count for it)
```

You can also check what the current game count is by requesting `/current` or the current stream count by requesting `/streamdeathscurrent`.

When you have the browser source open, OBS will change the count (and reset the minute counter) within one second of you requesting `localhost:<port>/death` or `localhost:<port>/reset`.

The count can increase indefinitely, no worries there ;) But, the minute counter will stop indefinitely if it ever reaches 999 minutes (but let's face it, if you go that long in a game stream without dying, you're either playing it too safe, left it on for a few days accidentally, or died IRL.)

### Using an Elgato Stream Deck to advance steps

You can use a Stream Deck to help with live streaming by creating two buttons for this overlay, a 'death' (`/death`) and 'reset' (`/reset`) key. These are pretty self-explanatory in terms of their function.

To add a hotkey in the 'Configure Stream Deck' app, drag a 'Website' button from the 'System' section into one of the slots on your Stream Deck.

Then set the URL to `http://localhost/death` (or `/reset`), and check 'Access in background'.

Now, when you press that key, the appropriate URL is called silently and the count should advance or reset depending on the button you pressed.

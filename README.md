# OBS Death Counter Overlay

An HTML and Node.js-based death counter overlay for OBS.

First off, credit where credit is due:

this project was made from a good starting point - Geerlingguy's [obs-task-list-overlay project](https://github.com/geerlingguy/obs-task-list-overlay-master). I liked the use of an http server as a means of making changes to the stream (and use it for my task-based streams), so I modified it to fit the new use case of incrementing and resetting a count - in this case, the number of times I die in a video game stream.

The JS rolling number effect was made from code posted by StackOverflow user [trincot](https://stackoverflow.com/users/5459839/trincot) as a resolution to (https://stackoverflow.com/questions/54438205/roll-counter-increment-by-1)

There are three components to this project:

  1. An HTML file (`index.html`), which lays out a stream title, a current count, and the number of minutes since a change was made to the count.
  1. A Node.js HTTP server (`server.js`), which serves the HTML file to OBS, and allows you to control the incrementing and resetting of a count.
  1. A config file (`config.json`), which provides the localhost port, title, and starting count.
  
## Customizing the overlay

All the styling for the overlay is embedded in the `index.html` file. If you want to tweak the appearance, it should be easy enough if you know basic CSS + JS.

To set a title or change the port used by node.js, open the `config.json` file and edit the file to add in the settings you would like.

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

## Adding the browser source in OBS

  1. In an OBS Scene, add a new 'Browser' Source.
  2. For the URL, enter `http://localhost:8081/` (use the port you have configured in `config.json`).
  3. Set the width to `1920` and height to `1080`.
  4. Check the 'Refresh browser when scene becomes active' option.
  5. Click 'OK', and the overlay should appear.

## Adjusting the count

To control the count, there are two paths the Node.js app responds to:

```
/death - Increase the current count by 1
/reset - Resets the current count to 0
```

You can also check what the current step is by requesting `/current`.

When you have the browser source open, OBS will change the count (and reset the minute counter) within one second of you requesting `localhost/up` or `localhost/down`.

The count can increase indefinitely, no worries there ;) But, the minute counter will stop indefinitely if it ever reaches 999 minutes (but let's face it, if you go that long in a game stream without dying, you're either playing it too safe, left it on for a few days accidentally, or died IRL.)

### Using an Elgato Stream Deck to advance steps

You can use a Stream Deck to help with my live streaming by creating two buttons for this overlay, a 'death' (`/death`) and 'reset' (`/reset`) key. These are pretty self-explanatory in terms of their function.

To add a hotkey in the 'Configure Stream Deck' app, drag a 'Website' button from the 'System' section into one of the slots on your Stream Deck.

Then set the URL to `http://localhost/death` (or `/reset`), and check 'Access in background'.

Now, when you press that key, the appropriate URL is called silently and the count should advance or reset depending on the button you pressed.

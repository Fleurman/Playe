# Playe
An easily customizable javascript audio player

The 'playe' is made by parsing a text written with special markdown.
The text to parse can be in the content of a `<script type="text/playe">` tag or passed to the `Playe.new()` funtion.

[Example](https://gp.surlesinternets.ch/pages/delasoul/)

### HTML

##### Settings
Some settings can be declared between parenthesis.
 - `loop` : makes the player loop after the last track
 - `random` : plays the tracks randomly
 - `autoplay` : enable the autoplay of the audio element
 - `:ogg:` : specify the default audio format
 
##### Layout
The layout elements are declared between braces.
A optional parameter can be specified by typing `::` followed by the parameter value for each element.
 - `[text :: text to display]` : some text
 - `[image :: url]` : an image
 - `[html :: "html"]` : some custom html
 - `[play :: text]` : play button (default '►')
 - `[pause :: text]` : pause button (default '❙❙')
 - `[next :: text]` : next button (default '→')
 - `[previous :: text]` : previous button (default '←')
 - `[duration :: separator]` : the duration of the playing track. If a separator if specified, displays: `current time 'separator' duration`
 - `[volume :: base value]` : the volume
 - `[title]` : the title of the playing track
 - `[timeline]` : the timeline
The elements are arranged in a flex layout:
```
//Example of layout:
[title]
[play][pause][volume :: 0.8]
[timeline][duration]
[next][previous]
```

##### Playlist
The tracks are declared with an index followed by a title and one or more urls.
```
// '::' uses the default format specified in the settings or 'ogg' if none is given.
1. Title of the Song :: "tracks/song.ogg"
                     :mp3: "tracks/song.mp3"
```

### CSS
Each element of the 'playe' can be styled by their class:
 - `.playe` : the 'playe' object
 - `.playe-title`,`.playe-text`,`.playe-next`,`.playe-previous`,`.playe-play`,`.playe-pause`,`.playe-volume` : the correspondings playe elements
 - `.playe-button` : common to all the buttons
 - `.playe-timeline` : timeline element (the duration of the current track is accessible with the attribute `data-playe-duration`)
 - The slider elements a have special structure:
   - `.playe-slider-back` : the back of the slider bar
   - `.playe-slider-value` : the left part of the slider
   - `.playe-slider-cursor` : the cursor (the current position of the cursor is accessible with the attribute `data-playe-slider-value`)
   - `.playe-slider-loaded` : the loaded part of the track (only in timeline element)

### Javascript
The html element with the class `.playe` have some functions and properties:
 - `play() / pause()` : play or pauses the player.
 - `next() / previous()` : next or previous track
 - `goTrack(id)` : load the track `id` (begins at 0)
 - `playingTrack` : the id of the current track
 - `duration` : the duration of the current track

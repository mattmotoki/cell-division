# A Biology-Inspired Board Game with an AI Opponent

* <a href="https://mattmotoki.github.io/cell-division/"> Play the Game Here</a> 

* <a href="https://mattmotoki.github.io/cell-division.html"> My blog post on Cell Division</a> 


## How to Play
Player take turns placing their cells. A player’s cells divide when they connect with each other; vertical, horizontal and diagonal connections are allowed. Your score is equal to the total number of cells that you have on the board. The game ends when the board is full. The winner is the player with the most cells.

## Implementation

The game is written primarily in plain JavaScript, HTML5, and CSS3.  

The only external library used is [howler.js](https://howlerjs.com/),
which is used to add retro soundeffects.

The [scoring cell animation and statistics graphics](https://codepen.io/mmotoki/) were done using HTML canvases.  

The cell design was done using base R graphics. 

The AI opponent is greedy with respect to some scoring metric. 

## Known Bugs
~~Scoring gets messed up if moves are placed too quickly or if connection is bad.  A quick fix would be to make the score update instant rather than have the score incrementally update over a 0.5s period.~~

## TODO
Create a Deep Reinforcement Learning Agent


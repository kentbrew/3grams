# 3grams: a single-player puzzle game

### What's This?

3grams is just like that game we used to play with golf tees or Chinese checkers: jump one piece over another, and pick up the one you jumped. You're done when you have one piece left or can't make any more moves.

On the board during the game are black pieces, white pieces, primary-colored pieces, and secondary-colored pieces. 

If you're having trouble telling the colors apart, each piece carries a trigram with an arrangement of zero to three bars. It's pretty easy to tell how they combine after a bit of practice.

### Jumping Over

When a piece jumps over another piece, that piece turns black.

* Any single-bar piece (red, yellow, or blue) may jump over any other single-bar piece.
* In all other cases, the piece in the middle must contain the color of the piece that's doing the jumping.
* Blue may jump green, purple, or white.
* Red may jump purple, orange, or white.
* Yellow may jump green, orange, or white.
* A double-bar piece&mdash;green, purple, or orange&mdash;may only jump over its own color or a white piece.
* White pieces may only jump other white pieces.
* Black pieces may not jump.

### Landing Atop

When a piece lands, the two colors combine.

* Any piece may land on a black piece or a piece of its own color.
* A double-bar or triple-bar piece may only land on a black piece or a piece of its own color.
* A single-bar piece&mdash;red, yellow, or blue&mdash;may land on any other single-bar piece or any double-bar not containing its color, and will combine to form a two- or three-bar piece.

### Winning

The game ends when there are no more legal moves to be made.

### Scoring

Your score is the number of moves you made times the number of bars left on all the pieces on the board.  The lower your score the better. 

### Strategy

* Some moves are more productive than others.
* Jumping a single over a single and landing on an empty space subtracts only one bar from the game.
* Jumping a triple over a triple and landing on a triple subtracts six bars from the game in one move.
* Work on getting those doubles out of the corners first.  Diagonal jumps over freshly-created triples feel especially satisfying.
* Use your Undo sparingly; your score will go up, since each undo counts as a move.
* Stuck? Restart by reloading the page.
* Want to try a different board before tomorrow's game shows up? Click the Practice button, visible when Help is showing.

### History

Long-time gamers may recall [Tesserae, a 1990 puzzle game from Inline Design](http://en.wikipedia.org/wiki/Tesserae_(video_game)).  I invented Stained Glass&mdash;the shareware game upon which Tesserae is based&mdash;in 1987, and every few years feel compelled to re-implement it using the platform I like best.  

This time it's JavaScript, running on a flat GitHub page with a bit of Twitter integration for daily leaderboards.

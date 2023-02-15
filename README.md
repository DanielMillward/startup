# CoolPoker

Have you ever wanted to play a quick round of poker but didn't want to risk any money? Introducing the CoolPoker app! Here, you can quickly create a game of Heads Up No Limit Texas Hold'em to play with a friend online in real-time. The game settings are fully customizable, so you can play however you like whenever you like.  With the login feature, you can also save previous games and settings, so you can easily pick up where you left off!

![myimage](startUpSpec/pagemockup.png)

Key features

- Logging in and registering over HTTPS
- Game creation page to create a new game with a variety of settings
- Game states are saved persistently
- Game actions are displayed to the other player in real time
- Games can be saved to be played at a later date
- Previous games can be accessed through the user profile page
- User profile page has various statistics, such as games played and money won
- Games can be shared with a URL


## Simon HTML - Notes

I am once again impressed by how easiy it is to put files with a Caddy backend and have it deploy. Something I didn't notice before was that there is a specific element for superscript text, the \<sup\> tag. I also learned that you can put SVG's in buttons, which in retrospect makes sense since I knew that sputting regular images in a button was possible. Finally, I learned that you can put foreign characters directly into the HTML document without it breaking.

Notes for future me:
- IP address is http://18.216.28.197/
- remember to shut down both the instance AND the elastic IP address (they are separate)

## Class notes

Some CSS notes:

- em is multiples of the width of the letter m in the parent's font
- rem is the same, but for the root font
- you can put self-hosted fonts directly in css with @font-face, or impor tthem with @import url().

### Display options:
- none - not visibile
- block - parent width
- inline - content width
- flex - display children flexibly
	- display: flex;
	- flex-direction: row;
	- Then in children, put
	- `flex: 0 80px`
		- 0/1 means will grow/not grow, 80px is the starting growth. If put 1, gets 1fr.
- grid - display children in grid
	- display: grid;
	- grid-template-columns: 1fr 1fr;
- alternative grid:
	- grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		- make children 300 px minimum width, 1 fr(actional unit) max
	- grid-auto-rows: 300px;
	- grid-gap: 1em;
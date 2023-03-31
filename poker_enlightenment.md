Bet, Raise, and Call, and All In are the same thing!!!! All follow this formula:


min(max(0, oppPlayer.betamount - currplayer.betamount) + (0 OR max(BB, extra)), currplayer.stack)


- For bet, the first term is always 0 (since its the first)
- For raise, it's the same as bet, just the word for it played not first
- For call, it's where extra = 0


if someone bets 0, then unless it's the option or it was the first turn, then move to the next round.
if oppPlayer.betamount - currplayer.betamount is negative, that means that they did an all in and play moves immedietly to the showdown. I think.
showdown == reward pbs
you count the blinds as bets
if stack is chosen, that's because call (extra of 0) was greater than the stack, so the stack was chosen
if not stack was chosen, that means the stack is bigger than the desired bet which is normal


## def getActions(currPlayer.stacksize, oppPlayer.stacksize, isFirstTurn, currRound):

if currRound = showdown, return None
add fold
if both bet sizes are 0 and its first turn, or its the option (sizes are SB and BB, for preflop is not the first turn {the sb playing is the first turn}), then add check.
check if call is > stack. If so, do an all-in
check if currplayer - call - BB is negative. If so, add call & all-in
else, determine the extra sizes - linear sampling between BB and min(pot, (currplayer - call - BB)), and add enough to fill up the 8 slots

return array consisting of an arrangement of the following:
- (nothing)
- FOLD
- CHECK
- ALLIN
- EXTRA, 0/some amount
- EXTRA, some amount
- EXTRA, some amount
- EXTRA, some amount
- EXTRA, some amount
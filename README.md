# Discord Bot

Welcome to my Discord Bot! This repository was made in view of me learning how NodeJS and MongoDB work.

### Requirements
- The server Id is required, as are channel ids for Pets, Archives and an Archives Hall of Fame. These can be altered in `config.json`.
- The discord bot requires a Discord API key to use which is currently only disclosed to the developer. Other APIs are used also (such as the Blizzard API).

### Slash Commands
- `/card` Returns details of a Hearthstone card by name by inputting its sludge.
- `/dailycute` Posts a random pet photo to the designated Pet Channel.
- `/duel` Bet money against a user in the server and play a coin toss.
- `/forecast` Loose estimator of desired SoC increase based on Solcast estimates.
- `/gift` Gift currency to a member in the server.
- `/leaderboard` Returns an embed with which members in the server have the most money.
- `/ping` Returns the client ping.
- `/rankings` Returns an embed with which reactions have been used the most.
- `/selfreacts` Returns an embed with which members of the server react to their own messages the most.
- `/sentpets` Returns an embed with which members send the most pets to the designated Pet Channel.

### Context-Menu Commands
- `Add to Archives' sends an embed of the message chosen to a different channel and updates the hall of fame.
- `Context Ping` returns the client ping.

### Key Events
- If an image is posted into the designated Pet Channel, then details of the post are added to a database.
- Reactions are stored and removed in the database when reactions are added and removed respectively.
- Messages that are added to the archives channel are stored into the database. The entry in the database removed if the message is deleted, and the embed is deleted, and the hall of fame channel is updated.

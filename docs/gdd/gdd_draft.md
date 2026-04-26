# **Gambling Problem**

### DeathSignal Productions

## _Game Design Document_

---
Developed by: Nicolas Amaya and Pablo Paz \
&copy; 2026\
\
This is a project for the course of _Software Construction and Decision-Making_ available in GitHub base in the MIT License. 

##

## _Index_

---

* [**Gambling Problem**](#gambling-problem)
    * [DeathSignal Productions](#deathsignal-productions)
  * [_Game Design Document_](#_game-design-document_)

  * [_Index_](#_index_)
  * [_Game Design_](#_game-design_)
    * [**Summary**](#summary)
      * [Description](#description)
    * [**Atmosphere**](#atmosphere)
      * [References](#references)
    * [Glossary](#glossary)
    * [**Gameplay**](#gameplay)
      * [Texas Hold'em](#texas-holdem-)
  * [_Technical_](#_technical_)
    * [**Screens**](#screens)
      * [Title Screen](#title-screen)
      * [Pause](#pause)
      * [Analytics](#analytics)
      * [Account](#account)
      * [Main Game](#main-game)
      * [Terminal](#terminal)
      * [DMs](#dms)
      * [Bank](#bank)
      * [Hard Reset](#hard-reset)
      * [Soft Reset](#soft-reset)
    * [Game concepts and character](#game-concepts-and-character)
    * [Casino website](#casino-website)
    * [Terminal](#terminal-1)
    * [Main character](#main-character)
    * [Computer screen](#computer-screen)
    * [Backend Analytics](#backend-analytics)
    * [Event Driven Architecture](#event-driven-architecture-)
      * [Provisional events:](#provisional-events-)
    * [**Controls**](#controls)
    * [**Mechanics**](#mechanics)
      * [Provisional Thresholds](#provisional-thresholds)
    * [Exploit](#exploit)
  * [_Level Design_](#_level-design_)
    * [**Themes**](#themes)
      * [Tutorial](#tutorial)
      * [Game Loop](#game-loop)
        * [Poker loop](#poker-loop)
  * [_Development_](#_development_)
    * [Cache](#cache)
    * [Init](#init-)
    * [Game Instance](#game-instance)
    * [ExploitsEventManager](#exploitseventmanager)
    * [Player](#player)
      * [Inventory](#inventory-)
      * [Bank](#bank-)
      * [Mafia](#mafia-)
      * [Casino](#casino-)
    * [EventManager](#eventmanager-)
    * [Sessions](#sessions)
    * [DB Manager](#db-manager-)
    * [Cache](#cache-)
  * [_Graphics_](#_graphics_)
    * [**Style Attributes**](#style-attributes)
    * [**Graphics Needed**](#graphics-needed)
  * [_Sounds/Music_](#_soundsmusic_)
    * [**Style Attributes**](#style-attributes-1)
    * [**Sounds Needed**](#sounds-needed)
    * [**Music Needed**](#music-needed)
  * [_Schedule_](#_schedule_)
  * [Provisional Stack](#provisional-stack-)
    
## _Game Design_

---

### **Summary**

A high-stakes poker roguelike where your money is your life. Build a deck of illegal exploits that let you manipulate cards, cheat the table, and outplay both the casino and the mafia. Take risky missions, break the rules, and push your luck but , try not to get banned, but if you lose it all, you don’t just go broke, you die.

We are trying to make this an immersive experience. We achieve this being a meta game. You are the main character that it's playing online poker. The consequence of your desitions fell real to you. The game will be displayed as a typical desktop screen in where you can receive emails, DMs. You use a TUI (terminal user interface) and use your browser to play. 

#### Description

For some reason you get the contact of some guys that are infiltrated in an online casino. They way they operate is that they lend you money and give you access to P&oslash;KER_FACE. This TUI gives you many exploits (that are not cheap) that increase your chances of becoming a millionaire. 

As you play you need to keep your loans in check because this mafia guys are not messing around, and they will kill you. They also can give you access to higher bitting tables, but the only problem is that when you change tables you leave behind the exploits you already bought. Other way to earn more money is that they offer you to back your bet 2x, 3x, 4x, depending, but remember that in that same proportions you can lose.

The main antagonist is the casino that will be tracking how many exploits you are using. If you use them in a careless way you face the chance to be banned. In those cases you restart with the exploits you already unlock and the money you saved in the bank. The things you lose are your chips and exploit you had already bought exploits.

The idea is that you balance your cheats and maximize your earnings to be the richest before the mafia boss kills you. Making the game, in a way, a psychological horror, with a tense environment. Challenges your poker skills and desition making.    

### **Atmosphere**

You are in a very dangerous situation. You feel stress that all the money can disappear in an instance. You need to stay alert for noises in your house. Blurring the line between of what is the game and your real house. 

Experience the rush of energy and dopamine on every win. As your money keeps increasing. How much more money can make? What more are you able to get away with?   

#### References

**Balatro** 
> The poker roguelike. Balatro is a hypnotically satisfying deckbuilder where you play illegal poker hands, discover game-changing jokers, and trigger adrenaline-pumping, outrageous combos.
> [(Steam, 2026)](https://store.steampowered.com/app/2379780/Balatro/)

_Balatro_ is one of our biggest inspirations. Tested that the formula of a poker roguelike is possible and fun. The casino will be base in the design of this game. 
![cards](assets/balatro_cards.png)

**Welcome to the Game**

> "Welcome to the Game is a creepy horror/puzzle game that takes you into the world of the Deep Web. Explore the Deep Web with the sole purpose of trying to find a Red Room, an online service / website that allows you to see and participate in interactive torture and murder" 
> [(Steam,2026)](https://store.steampowered.com/app/485380/Welcome_to_the_Game/).

This is an inspiration for a game base in hackers. The formula for the atmosphere is from this game, how it makes an immersive scary run. You also work for hackers but be careful they are dangerous people. 

**KinitoPET**

> "KinitoPET is a psychological horror experience that takes place through Kinito, an early 2000s virtual assistant. Kinito is able to walk, talk, browse, adapt, and play games as Kinito is like no other with its adaptive technology!"
> [(Steam,2026)](https://store.steampowered.com/app/2075070/KinitoPET/)

This game is widows UI type game, we would like something like this for ours. 

**Unfriended Dark Web** 

> The movie follows a group of friends who find a laptop that has access to the dark web, only to realize they are being watched by the original owners, a group of cybercriminal hackers.
> [(Wikipedia, 2026)](https://en.wikipedia.org/wiki/Unfriended:_Dark_Web) \

[**Trailer**](https://youtu.be/XenTM_C9fxM?si=j-4xl5aWnMIcub2C)
\

These movies is an inspiration of how to build a scary experience with meta elements.   

### Glossary
Hand: current player cards

Round: the amount rounds to the complete game loop. It goes up one when a player is in the screens that ask if you want to continue.

Turn: every time the player is prompted to place a bet.

Run: defined as the moment the game instance is terminated.

Back bet: common practice in the gambling world in witch people outside the casino offer you to multiply in some amount your returns. For example, you place a bet for 10k and be offer 3x they will pay you 20k extras if you win. But you could also lose 30k.

Flop: initial face up of tree cards

Turn: is the moment there are 4 cards turn in the table

River: the last card is turn

Fold: the act of not paying the current bet and losing the money placed

Blind: the minimal bet to play, is pay before you can see your cards

### **Gameplay**

As previously mentioned the main objective is to make the most amount of money without dying while also being careful in how you use exploits. In practice, you have a limited number of turns that can be increased if you play your cards right. The way you play is in a casino website where you can play Texas hold'em poker. Before you start the round add money to the table to bet and pay the blind. After you can now buy exploits or use them in you after you got your cards. You play normally with the only limitation is that after this point in your turn you can't buy more exploits.  


Leveling is the act of changing tables that resets the exploits you have bought increase the blind and win more each round. And also, the exploits available changes base in the table and rank. You can make synergies with exploits for example if you are using the exploit to change the card, you should check the card that are coming so you don't change it to one already played thus being caught.

Every game must feel unique and there is no one strategies, is up to you how you manage your resources.

The indicators that you are making mad the mafia boss is that some exploits can start to fail, strange things happening in your game... and then you start hearing things at home, until suddenly they get to you and shut you. That is how you can end your round. 

For the casino it should be difficult for you to know if you are being caught thus the tension builds on every turn and before using exploits. 

For the TCG aspect, the exploits will work as _"cards"_. Better exploits are harder to find and have less probability of appearing when winning in a table. Some exploits can have a small chance of disappearing of your exploit deck after being used (usually specified in the exploit description). Each exploit card will have some icon representing what the exploit does.

The game is a roguelike experience, this meaning that losing doesn't restart your progress. In this game you have a casino account that can be banned, which means you lose the money/chips that were in the account. You don't lose the money outside the banned account. Then there is the "real" death of the run part, where the mafia gets mad at you, they get to your house and end you, which means you lose it all your progress. Being how far in the tables you've gone and all of your money. But the tun loss is not for nothing as the discovery of powerful exploits is not lost at all. The more you play the game the more exploits you find. The first time you play you have basic exploits like lets say change card and disconnect player, and as you advance you discover change suit. Now there is a chance that when restarting the game when killed by the mafia, you may start with change suit instead of disconnect.

#### Texas Hold'em 
This version is play by drawing 2 cards to each player then every player has a turn to place a bet. Then tree cards are turn (that's call the floop). After there is a second round of turn in witch players can raise, pay or fold: 
    If player raises the bet then other players have a turn again to raise it more, pay or fold.
    If the player fold it automatically loses the change to take the current pool of money. Wen the player pays it consider still in the game.
    If a player pay the cash pool increase and has a chance to win it. 
The cycle will be done for the _turn_ (4 cards in the table) and the _river_ (5 cards in the table). When all the turn are play and bets made the players show their cards and see who has the highest conviction between the table and their cards. The player who has the highest takes all the cash pool. 
![Poker Rank](assets/poker-rank.jpeg)

full rule book: [rules](https://bicyclecards.com/how-to-play/texas-holdem-poker) \
video version: [video](https://youtu.be/ep1riICX-KU?si=4E8vLbSnqE0Q2WxZ)

## _Technical_

---
### **Screens**

1. [Title Screen](#title-screen)
2. [Pause Screen](#pause)
3. [Analytics](#analytics)
4. [Account](#account)
5. Game
    1. [Main Game](#main-game)
    2. [Terminal](#terminal)
    3. [DMs](#dms)
    4. [Bank](#bank)
6. Lose Screens
   1. [Hard Reset](#hard-reset) 
   2. [Soft Reset](#soft-reset)

#### Title Screen
![title screen](assets/screen_title.png)
#### Pause
The pause page will be the content blur and a simple continue of leave button. 
#### Analytics
![analytics screen](assets/screen_analitics.png)
#### Account
![account screen](assets/screen_account.png)
#### Main Game
![main game screen](assets/screen_game.png)
#### Terminal
![terminal and the game](assets/screen_terminal.png)
#### DMs
![screen dms](assets/screen_dms.png)
#### Bank
![screen bank](assets/screen_bank.png)
#### Hard Reset
![screen lose hard reset](assets/screen_hard.png)
#### Soft Reset
![screen lose soft reset](assets/screen_soft.png)
### Game concepts and character
### Casino website
![casino website](assets/mesa-poker-pixilart-update.png)
### Terminal
![terminal with example](assets/Terminal_w_example.png)
### Main character
![Main character concept](assets/MainCharacterResized.png)
### Computer screen
![Computer screen](assets/Computer.png)

### Backend Analytics

For our game the most important aspect is the money earn at the end of the run. Also, how much time it took to do that. We time stamp the start of the run at the server level. The client send the end of run event to server. At that moment it takes the stamp and subtract to the previous one saved, we are aware that this fails to check for pauses or other edge cases, if a more robust implementation is needed can be added later. With the end of run event, the points are saved to the leader board table with the associated user, if logged in, if not it will simply not save the run. This table must be ordered by points in an efficient way. 

The idea is to trigger event that a DB controller is hearing as middleware, for the other analytics, as exploits bought and exploits use. It also works to be the source of truth of the inventory of the player's run. This makes it temper proof. 

We are considering using a cache for saving the state of the game in case of disconnections, or in general games not ended. From there build the game instance.  

In the long term database:  
- Time of the run
- Exploits bought 
- Exploits used 
- Money win in total 
- Money spend 
- Total earnings
- User id

Cache: 
- Playing games 

Views: 
- Best 50 players 

User cache:
- His record run 
- His time played in general
- His runs made
- His recent history (last 20 games in summary)
- Playing session

We add a trigger to check if new register is larger that the best 50 of the view and then reorder it. 

### Event Driven Architecture 

This is because we want a flexible system for constant change in its logic. Exploits are hearing all that is happening, also the bank and the database controller, and others. Exploits might change the deck or the player attributes. 

The bank instance in the Player is the one that check if the exploit can be bought and applied the changes at the server side level.

#### Provisional events: 
This can be extended if necessary. 

Game Event
- turn ended 
- hard reset 
- soft reset 
- withdraw chips
- player change 
- deck change
- time exceeded _(experimental)_
- buy exploit attempt 
- winner assigned 
- change of round
- prompt:continue 
- backed bet status change

Exploit Events 
- exploit trigger 
- exploit used
- exploit success bought
- exploit was kill

### **Controls**

Our game is base in click events the only need of a key press event (as this moment) is for the pause screen. 

### **Mechanics**

The key factor is that we are making the already fun game of Texas hold'em and adding some twists. The idea is for players constantly try new strategies and different routes to progress. They can compare their result with other players and change them accordingly.  

The game starts as normal poker with 2 random exploits unlocked. The way to progress is by winning rounds a get to certain threshold of money. If you get to them, you can level to higher betting tables in wish you win much more pear turn and unlock new exploits. 

The limitation is that you change table and only can take one exploit with you. This as it add the need to buy the exploits again. The casino instance keeps track of how much exploits and how much round have been played. When you use to many exploits in small amount of turn you will trigger a soft reset. If you trigger a soft reset you lose the chips and the exploits that you were using until that point. With the difference is that the money in the is safe so you could instantly buy them back and also use different kind of exploits in the beginning.  

But if the game was just to continue playing without purpose it would be boring. The other twist is the mafia; you need to keep in check your loans by withdrawing ang paying. The interest are really high so is a real challenge. The mafia also determines the amount of rounds you have to pay (might vary in some internal logic depending on the current level). If the loans are not paid in time the game ends because they go to you house and kill you.   

The meta part is that you actually feel like you are doing the complex gambling. You could evaluate your current strategies, compare them with other players, see what exploits are useful, check if you are behind. It feels not different to the real deal. 

#### Provisional Thresholds
Intermediary level are for only unlocking and exploit the blind only grows when the end of the level is reach. The price in here is how much it will cost through the level.  

Level 0 to Level 1\
from \$0 to \$1,000 -> no blind

Level 1 to Level 1.5\
from \$1,000 to \$5,000

Level 1.5 to Level 2 -> \$500 blind \
from \$5,000 to \$10,000

Level 2 to Level 2.25 \
from \$10,000 to \$30,000

Level 2.25 to Level 2.75 \
from \$30,000 to \$70,000

Level 2.75 to Level 3 -> \ $1000 blind \
from \$70,000 to \$250,000

Level 3 to 3.10 \
from \$250,000 to \$270,000

Level 3 to 3.5 \
from \$270,000 to \$300,000

Level 3.5 to 3.75 \
from \$300,000 to \$400,000 

Level 3.75 to 4 -> \$5,000 blind \
from \$400,000 to \$500,000

Level 4 to 4.10 \
from \$500,000 to \$550,000

Level 4.10 to 4.20 \
from \$600,000 to \$650,000

Level 4.20 to 4.30 \
from \$700,000 to \$750,000

Level 4.30 to 4.40 \
from \$750,000 to \$800,000

Level 4.40 to 4.50 \
from \$800,000 to \$850,000

Level 4.50 to 4.60 \
from \$850,000 to \$900,000

Level 5 to END -> blind $10,000
from \$1,000,000 to record

### Exploit

Interface required for every exploit:
- init(events[])
- kill()
- trigger()
- playerId: string
Exploits are divided in low, high and critical in that order.  

Provisional exploits:
- No reshuffle [ high ] \
  Disables that the card are shuffle on every round change.

- Count cards [ low ] \
  Like in blackjack. It is not useful without the no shuffle exploit.

- Change current hand random [ high ] \
  Player hand redraw.

- See coming card [ high ] \
  Peak the current deck cards array

- See card played history [ low ] \
  Save and stack of all the cards played.

- Save a card [ critical ] \
  Draws card to change current create exploit to use the card that was picked by user

- Remove player [ critical ] \
  Remove a player from the players array.

- Disconnect player [ high ] \
  Mark player as disconnected. Overwrite the _change turn_ method to skip player in the current round only.

- Change to random strong (A, K, Q, J) [ high ] \
  Pick random card in that range of high cards then update the deck to that

- Change to x card [ critical ] \
  Put that card in players hand and trigger event to check if card was already played.

- Change the coming card [ high ] \
  Change the deck card to x

- Change username [ critical ] \
  Reset the casino awareness

- Change suit [ high ] \
  Change the suit of the player card or the coming card

- See flop [ low ] \
  See the 3 card that will be placed at the beginning

- See a player's cards [ high ] \
  Pick a player and see their current hand

- Trigger full view [ critical ] \
  See all the players cards all the time.


## _Level Design_

In Gambling Problem the different poker tables function as the different levels. The starting table the Green Mat Table is the perfect place to learn how to play Texas Hold'em poker (if the player doesn't know how it works) and to get acquainted with the exploit cards they are dealt. 

### **Themes**
The game is simulating an online casino so the levels and themes are going to be casino themed, so there are going to be different tables, with chairs for and chips for decoration
1. Table 1 (green mat)
    1. Mood
        1. Calm and inviting (introduction table to poker)
        2. Still tense to not lose all your money
    2. Objects
        1. _Ambient_
            1. Other players
            2. Pristine green mat, standard issue for poker
            3. Poker Chair
            4. Poker Chips
            5. Other player's portraits (NPCs)
        2. _Interactive_
            1. Cards
            2. Exploits
            3. Buttons (raise, stay, fold, etc)
            4. Dms for missions
            5. Terminal
      3. Sound
         1. _Ambient_
            1. Chill house/edm
            2. player chatter (mumbling)
         2. _Interactive_sounds_
            1. Heartbeat
            2. Footsteps
           
2. Table 2 (blue mat)
    1. Mood
        1. Dangerous, tense
        2. Players are not friendly
    2. Objects
        1. _Ambient_
            1. Blue mat
            2. The mat is a bit used
            3. Poker Chair
            4. Poker Chips
            5. Other player's portraits (NPCs)
        2. _Interactive_
            1. Cards
            2. Exploits
            3. Buttons (raise, stay, fold, etc)
            4. Dms for missions
            5. Terminal
   3. Sound
         1. _Ambient_
             1. More active edm song, drops the house elements
             2. player chatter (mumbling)
         2. _Interactive_sounds_
             1. Heartbeat
             2. Footsteps
3. Table 3 (red mat)
    1. Mood
        1. Players are out for your head
        2. Gloomy players, they want your money
    2. Objects
        1. _Ambient_
            1. Red table poker mat
            2. Less illumination, for tense ambient
            3. Very used an weathered table and mat
            4. Poker Chair
            5. Poker Chips
            6. Other player's portraits (NPCs)
        2. _Interactive_
            1. Cards
            2. Exploits
            3. Buttons (raise, stay, fold, etc)
            4. Dms for missions
            5. Terminal
   3. Sound
      1. _Ambient_
            1. High tempo EDM Track
            2. Tense player silence (not technically a sound but used for unnerving the player)
      2. _Interactive_sounds_
            1. Heartbeat
            2. Footsteps
4. Table 4 (black mat: Mafia boss )
    1. Mood
        1. Eerie
        2. Last stand
        3. Your life is on the line
    2. Objects
        1. _Ambient_
            1. Black mat, with mafia decoration
            2. Money on the table
            3. Poker Chips
            4. Poker chair
            5. Other player's portraits (NPCs)
        2. _Interactive_
            1. Cards
            2. Exploits
            3. Buttons (raise, stay, fold, etc)
            4. Dms for missions
            5. Terminal
      3. Sound
         1. _Ambient_
            1. Combination of all tracks and motifs, signifying the end
            2. Boss evil laughs
         2. _Interactive_sounds_
            1. Heartbeat
            2. Footsteps
               

### **Game Flow**
#### Tutorial
1. Notification dm got 
2. Player is presented the main page 
3. Poker face use (how to see exploit description)
4. Display of money that must be paid
5. See the bank page (describe the main info of that page like who much money they have) 
6. First round

#### Game Loop

![Game Loop diagram ](assets/game-loop.png)
##### Poker loop
1. ¿Continue playing?
2. round + 1
3. flop and hand cards 
4. place bet (if turn)
5. { end turn event } 
6. change player { event trigger }  
7. repeat until all place bet / fold 
8. turn (use the Bet state machine)
9. river (use the Bet state machine)
10. determine winner 
11. give chips 
12. round end 
13. restart loop

![Poker loop diagram](assets/poker-loop.png)

## _Development_
---
### Cache

- Sessions
  - Attributes of the run
- 50 best runs 
- Exploits Meta Data info 
  - Prices and other info that could be necessary

### Init 

Route _start_ game is reach: 
- new Game(timestamp)
- addPlayer() _to game_
- send static assets
- add player id cookie
- game.addPlayer() _to session manager_

### Game Instance

We need to have game instances. Are created and associated to a player id. For the time being having only one, after we need to create this in a cache or _singleton_ parent of sessions. 

Is important to say that we need to implement a why to know if game instance must be terminated because is abandoned (no players in it, isPause for to long). So we save a refreshToken and a why to know if is pause. We add a session manager to see all of this. 

Elements: 
- Session: {isPaused: boolean, refreshToken:string} 
  - killSession() : void
- Deck:class
  - PokerMaster
- White list of exploits: string[]
- attachedExploits: Exploit[]
- currentLevel: number
- EventHandler:class(hardReset)
  - AttachEventHandlerClient(): never
- Players:class
  - private players: Payer[] 
  - addPlayer(playerId) : never
  - attachPlayerHook(playerSession): never
  - attachExploitsHook(exploitSession): never
- abstract hardReset(): void
- toJson(): JSONString
  * So that we can save the game state in db

### ExploitsEventManager
Encapsulates the event handling (producers and consumers), it has a set of event keywords with its consumers attach with a callback to react to it. 

Must have a method so that we can attach the event client facade that communicates the events to the client instance of the game. 

### Player
Encapsulates the player info in current session. Might change in the future for multiplayer's sessions. 

Description: 
- playerId
- Inventory
- Bank:class
- Mafia:class
- Casino:class

#### Inventory 
This class is encapsulation of the storage, manage of exploits, and history of them. 

#### Bank 
This class is encapsulation of the logic of validation of exploit bough and addition to inventory. Also, money and chips storage of player.

#### Mafia 
This class encapsulates the logic of tracking loan payment. It tracks rounds played and money paid. If the back bet is activated makes the changes needed. It must trigger the hard reset logic. 

#### Casino 
Tracks exploits used and cooldown of account. Basically if the conditions are meets trigger the soft reset. As we develop we tune the criteria for this to happen.  

### EventManager 
This is the way to propagate event between children. Thinking of making a factory for creation and mitigation of the parameter drilling. 

We create and EventManagerClient class that encapsulates the communication of client and server, acting as a facade for the webhook and session logic.

### Sessions
We are going to abstract the creation and attachment of hook to game session. As the hook may disconnect. For this we use a facade to make event manager communicate with the EventManager of the client.

As a connections are made or restore it wraps the EventClientManager to send the event through the hook. We need to have a _strategy_ base contract for this class so that we add the ExploitsHook and The PlayerHook.

This could be a service detached from the webserver, for independence in case of fault or potential server restarts. 

### DB Manager 
Singleton with the db connection attach, with the method for saving what's needed in the sql db. 

### Cache 
The cache needs to be tune but must be the model controller for redis connection for thing as best 50 runs, best run of current players, games instances (in memory), etc.

## _Graphics_

---

### **Style Attributes**

What kinds of colors will you be using? Do you have a limited palette to work with? A post-processed HSV map/image? Consistency is key for immersion.

What kind of graphic style are you going for? Cartoony? Pixel-y? Cute? How, specifically? Solid, thick outlines with flat hues? Non-black outlines with limited tints/shades? Emphasize smooth curvatures over sharp angles? Describe a set of general rules depicting your style here.

Well-designed feedback, both good (e.g. leveling up) and bad (e.g. being hit), are great for teaching the player how to play through trial and error, instead of scripting a lengthy tutorial. What kind of visual feedback are you going to use to let the player know they&#39;re interacting with something? That they \*can\* interact with something?

### **Graphics Needed**

1. Characters
    1. Human
        1. Main character
        2. Random online players (portraits, profile picture-like)
        3. Mafia boss
 
2. Poker Tables
    1. Red used and weathered table
    2. Green mat pristene table
    3. Blue mat almost new table
    4. Black mat Mafia table
3. Ambient
    1. Poker chips
    2. Poker chairs or normal chairs
    3. Loose money bills
    4. Stacked money bills
    5. Player Portrais (goes in hand with the character assets)
    6. Blood stains (matching Weathered Stone Bricks)
## _Sounds/Music_

---

### **Style Attributes**
The music that is going to be used is going to be in the Electronic genre, with subgenres such as house and EDM. As this is an online casino with hacker exploits, this fits the vibe. The instruments that are going to bu used are mostly drum machines, bass synths, and paino synths, to really get that dystopian/Hacker/Exciting vibe when needed. No specific key is going to be used, but it will be centered around one, so that in the final poker match, the motifs of previous levels can be heard, to get a throwback.

Effects as card shuffling, moving cards, electronic buzzes, chips stacking and many others are going to be used. The ones related to the casino aspect of the game are going to be used to immerse you in the world of online gambling, while the ones relating to the hecker world are more focused on electronic buzzes and notifications, things you mght hear in a computer. For the Immersive game part, we'll have footsteps play in the backround to make the tention rise as maybe the mafia is at your doorstep and heartbeats when you are close to losing.

### **Sounds Needed**

1. Effects
    1. Cards shuffling
    2. Cards dealt
    3. Player folds
    4. Player raises
    5. Cards turning
    6. Explit used (some electronic buzz)
    7. Player disconnect (Exploit based)
    8. Footsteps
2. Feedback
    1. Heartbeat (louder if about to lose); (Winning/Losing state)
    2. Coins dropped; (Gained money)
    3. Happy chime (extra life)
    4. Sad chime (died)

_(example)_

### **Music Needed**

1. Chill house/EDM track
2. Edm track 120 bpm major key 
3. EDM track 150 bpm other major key
4. EDM track 150 bpm minor relative key to the first track
5. House track for credits;

## _Schedule_

---

_(define the main activities and the expected dates when they should be finished. This is only a reference, and can change as the project is developed)_

1. develop base classes
    1. base entity
        1. base player
        2. base enemy
        3. base block
2. base app state
      1. game world
      2. menu world
3. develop player and basic block classes
    1. physics / collisions
4. find some smooth controls/physics
5. develop other derived classes
    1. blocks
        1. moving
        2. falling
        3. breaking
        4. cloud
    2. enemies
        1. soldier
        2. rat
        3. etc.
6. design levels
    1. introduce motion/jumping
    2. introduce throwing
    3. mind the pacing, let the player play between lessons
7. design sounds
8. design music

_(example)_

## Provisional Stack 
Our project is a monorepo manage by turbo repo, its primary language will be TypeScript in a node environment.

We are thinking of having a cache build with redis that is a key value database. It gave us flexibility to save JSON data as needed. 

Have a frontend build with an SPA React application. This allows us to have a state managed by zustand that will be connected to the backend via Webhook. The Webhook connection will be an event manager that the React components can ack upon. For necessary routing and server rendering will be using TankStackRouter. 

For long term database we have a mysql instance that will connect with drizzle orm to a express server that manage additional logic.

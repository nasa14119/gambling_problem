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
    * [**Gameplay**](#gameplay)
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
    * [Backend Analytics](#backend-analytics)
    * [Event Driven Architecture](#event-driven-architecture-)
  * [_*Progress end*_](#_progress-end_)
    * [**Controls**](#controls)
    * [**Mechanics**](#mechanics)
  * [_Level Design_](#_level-design_)
    * [**Themes**](#themes)
    * [**Game Flow**](#game-flow)
  * [_Development_](#_development_)
    * [**Abstract Classes / Components**](#abstract-classes--components)
    * [**Derived Classes / Component Compositions**](#derived-classes--component-compositions)
  * [_Graphics_](#_graphics_)
    * [**Style Attributes**](#style-attributes)
    * [**Graphics Needed**](#graphics-needed)
  * [_Sounds/Music_](#_soundsmusic_)
    * [**Style Attributes**](#style-attributes-1)
    * [**Sounds Needed**](#sounds-needed)
    * [**Music Needed**](#music-needed)
  * [_Schedule_](#_schedule_)

## _Game Design_

---

### **Summary**

A high-stakes poker roguelike where your money is your life. Build a deck of illegal exploits that let you manipulate cards, cheat the table, and outplay both the casino and the mafia. Take risky missions, break the rules, and push your luck but , try not to get banned, but if you lose it all, you don’t just go broke, you die.

We are trying to make this an immersive experience. We achieve this being a meta game. You are the main character that it's playing online poker. The consequence of your desitions fell real to you. The game will be a typical desktop screen in where you can receive emails, DMs. You use a TUI in your terminal and use your browser to play. 

#### Description

For some reason you get the contact of some guys that are infiltrated in an online casino. They way they operate is that they lend you money and give you access to P&oslash;KER_FACE. This TUI gives you many exploits (that are not cheap) that increase your chances of becoming a millionaire. 

As you play you need to keep your loans in check because this mafia guys are not messing around, and they will kill you. They also can give you access to higher bitting tables, but the only problem is that when you change tables you leave behind the exploits you already bought. Other way to earn more money is that they offer you to back your bet 2x, 3x, 4x, depending, but remember that in that same proportions you can lose.

You can't be too greedy and careless of how you cheat because the casino will ban your account. If it sees your account suspicious will make you lose your exploits and money that is in your casino account at the moment.

The idea is that you balance your cheats and money to be the richest before making the mafia boss mad and kill you. Making the game in a way a psychological horror with a tense environment, challenging your poker skills and desition making.    

### **Atmosphere**

You are in a very dangerous situation. You must feel kind of stress that all the money can disappear in an instance. You need to stay alert for noises in your house and call the police if necessary making you don't be at ease bluing the line between if they are at your real hose or in the game. 

Experience the rush of energy and dopamine on every win. As your money keeps increasing curiosity of how much more you can make? what more are you going to get away with?   

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

### **Gameplay**

As previously mentioned the main objective is to make the most amount of money without dying while also being careful in how you use exploits. In practice, you have a limited number of turns that can be increased if you play your cards right. 

Leveling is the act of changing tables that resets the exploits you have but increase the money you win in each turn. And the exploits available changes base in the table. You also need to make synergies for example if you are using the exploit to change the card, you should check the history of cards played so you don't change it to one already played thus being caught.  Or if you are counting cards is a good idea that when is high you can see the next flush of cards. 

Every game must feel unique and there is no one strategies is up to you how you manage your resources.

The indicators that you are making mad the mafia boss is that some exploits can start to fail, strange things happening in your game... and then you start hearing things at home until suddenly they get to you and shut you. That is how you can lose. 

For the casino it should be difficult to know if you are being caught thus the tension building tension on every turn you play and before using exploits. 

For the TCG aspect, the exploits will work as these cards. Better exploits are harder to find and have less probability of appearing when winning in a table. Some exploits can have a small chance of disappearing of your exploit deck after being used (usually specified in the exploit description). Each exploit card will have some art representing what the exploit does.

The game is a roguelike experience, this meaning that losing doesn't restart your progress. In this game you have a casino account that can be banned, which means you lose the money/chips that were in the account, you don't lose the money outside the banned account. Then there is the "real" death of the run part, where the mafia gets mad at you, they get to your house and end you, which means you lose it all your progress. Being how far in the tables you've gone and all of your money. But the tun loss is not for nothing as the discovery of powerful exploits is not lost at all. The more you play the game the more exploits you find. The first time you play you have basic exploits like lets say change card and disconnect player, and as you advance you discover change suit. Now there is a chance that when restarting the game when killed by the mafia, you may start with change suit instead of disconnect.

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

For our game the most important aspect is the money earn at the end of the run. Also, how much time it took to do that. We time stamp the start of the run at the server level. The client send the end of run event to server. At that moment it takes the stamp and subtract to the previous one saved, we are aware that this fails to check for pauses or other edge cases, if needed a more robust implementation can be added. With the end of run event then the points are saved to the leader board table with the associated user if logged in, if not it will simply not save the run. This table must be ordered by points in an efficient way. 

The idea is to trigger event that a DB controller is hearing as middleware, for the other analytics, as exploits bought and exploits use. It also works to be the source of truth of the inventory of the player's run. This makes it temper proof. 

In conclusion, we will save:  
- Time of the run
- Exploits bought 
- Exploits used 
- Money win in total 
- Money spend 
- Total earnings

We could cache some of the users data for the analytics page: 
- His record / id of best run 
- His time played 
- His game played 
- His recent history (last 20 games)

To see if leaderboard table must be reordered / updated in page we cache the top 50 players to only check if the current run is better that those. The other time we check for leaderboard position if that run was a personal record. 

### Event Driven Architecture 

This is because we want a flexible system for constant change in its logic. Exploits are hearing all that is happening, also the bank and the database controller. Exploits might change the deck or the player. The bank object is the one that check if the exploit can be bought and applied the changes. As the design of the system matures the consumers and reactors are going to be assigned. 

Provisional events: 
- turn ended 
- hard reset 
- soft reset 
- leave table 
- change player 
- deck change
- time exceeded _(experimental)_
- buying of exploit attempt
- exploit used 

## _*Progress end*_

---

### **Controls**

Our game is base in click events the only need of a key press event (as this moment) is for the pause screen. 

### **Mechanics**

Are there any interesting mechanics? If so, how are you going to accomplish them? Physics, algorithms, etc.

## _Level Design_

---

_(Note : These sections can safely be skipped if they&#39;re not relevant, or you&#39;d rather go about it another way. For most games, at least one of them should be useful. But I&#39;ll understand if you don&#39;t want to use them. It&#39;ll only hurt my feelings a little bit.)_

### **Themes**

1. Forest
    1. Mood
        1. Dark, calm, foreboding
    2. Objects
        1. _Ambient_
            1. Fireflies
            2. Beams of moonlight
            3. Tall grass
        2. _Interactive_
            1. Wolves
            2. Goblins
            3. Rocks
2. Castle
    1. Mood
        1. Dangerous, tense, active
    2. Objects
        1. _Ambient_
            1. Rodents
            2. Torches
            3. Suits of armor
        2. _Interactive_
            1. Guards
            2. Giant rats
            3. Chests

_(example)_

### **Game Flow**

1. Player starts in forest
2. Pond to the left, must move right
3. To the right is a hill, player jumps to traverse it (&quot;jump&quot; taught)
4. Player encounters castle - door&#39;s shut and locked
5. There&#39;s a window within jump height, and a rock on the ground
6. Player picks up rock and throws at glass (&quot;throw&quot; taught)
7. … etc.

_(example)_

## _Development_

---

### **Abstract Classes / Components**

1. BasePhysics
    1. BasePlayer
    2. BaseEnemy
    3. BaseObject
2. BaseObstacle
3. BaseInteractable

_(example)_

### **Derived Classes / Component Compositions**

1. BasePlayer
    1. PlayerMain
    2. PlayerUnlockable
2. BaseEnemy
    1. EnemyWolf
    2. EnemyGoblin
    3. EnemyGuard (may drop key)
    4. EnemyGiantRat
    5. EnemyPrisoner
3. BaseObject
    1. ObjectRock (pick-up-able, throwable)
    2. ObjectChest (pick-up-able, throwable, spits gold coins with key)
    3. ObjectGoldCoin (cha-ching!)
    4. ObjectKey (pick-up-able, throwable)
4. BaseObstacle
    1. ObstacleWindow (destroyed with rock)
    2. ObstacleWall
    3. ObstacleGate (watches to see if certain buttons are pressed)
5. BaseInteractable
    1. InteractableButton

_(example)_

## _Graphics_

---

### **Style Attributes**

What kinds of colors will you be using? Do you have a limited palette to work with? A post-processed HSV map/image? Consistency is key for immersion.

What kind of graphic style are you going for? Cartoony? Pixel-y? Cute? How, specifically? Solid, thick outlines with flat hues? Non-black outlines with limited tints/shades? Emphasize smooth curvatures over sharp angles? Describe a set of general rules depicting your style here.

Well-designed feedback, both good (e.g. leveling up) and bad (e.g. being hit), are great for teaching the player how to play through trial and error, instead of scripting a lengthy tutorial. What kind of visual feedback are you going to use to let the player know they&#39;re interacting with something? That they \*can\* interact with something?

### **Graphics Needed**

1. Characters
    1. Human-like
        1. Goblin (idle, walking, throwing)
        2. Guard (idle, walking, stabbing)
        3. Prisoner (walking, running)
    2. Other
        1. Wolf (idle, walking, running)
        2. Giant Rat (idle, scurrying)
2. Blocks
    1. Dirt
    2. Dirt/Grass
    3. Stone Block
    4. Stone Bricks
    5. Tiled Floor
    6. Weathered Stone Block
    7. Weathered Stone Bricks
3. Ambient
    1. Tall Grass
    2. Rodent (idle, scurrying)
    3. Torch
    4. Armored Suit
    5. Chains (matching Weathered Stone Bricks)
    6. Blood stains (matching Weathered Stone Bricks)
4. Other
    1. Chest
    2. Door (matching Stone Bricks)
    3. Gate
    4. Button (matching Weathered Stone Bricks)

_(example)_


## _Sounds/Music_

---

### **Style Attributes**

Again, consistency is key. Define that consistency here. What kind of instruments do you want to use in your music? Any particular tempo, key? Influences, genre? Mood?

Stylistically, what kind of sound effects are you looking for? Do you want to exaggerate actions with lengthy, cartoony sounds (e.g. mario&#39;s jump), or use just enough to let the player know something happened (e.g. mega man&#39;s landing)? Going for realism? You can use the music style as a bit of a reference too.

 Remember, auditory feedback should stand out from the music and other sound effects so the player hears it well. Volume, panning, and frequency/pitch are all important aspects to consider in both music _and_ sounds - so plan accordingly!

### **Sounds Needed**

1. Effects
    1. Soft Footsteps (dirt floor)
    2. Sharper Footsteps (stone floor)
    3. Soft Landing (low vertical velocity)
    4. Hard Landing (high vertical velocity)
    5. Glass Breaking
    6. Chest Opening
    7. Door Opening
2. Feedback
    1. Relieved &quot;Ahhhh!&quot; (health)
    2. Shocked &quot;Ooomph!&quot; (attacked)
    3. Happy chime (extra life)
    4. Sad chime (died)

_(example)_

### **Music Needed**

1. Slow-paced, nerve-racking &quot;forest&quot; track
2. Exciting &quot;castle&quot; track
3. Creepy, slow &quot;dungeon&quot; track
4. Happy ending credits track
5. Rick Astley&#39;s hit #1 single &quot;Never Gonna Give You Up&quot;

_(example)_


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

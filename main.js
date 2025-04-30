const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;


const offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = 1500;
offscreenCanvas.height = 900;
const offscreenCtx = offscreenCanvas.getContext('2d');

const images = {
    bg: new Image(),
    board: new Image(),
    slot: new Image(),
    sprites: new Image(),
    token: new Image(),
    noise: new Image(),
    gradientImage: new Image(),
    icons: new Image(),
    button: new Image(),
    box: new Image(),
    portrait: new Image(),
    rpg: new Image(),
    smoke: new Image(),
    npc: new Image(),
    lightning: new Image(),
};

class Vector2 {
  constructor(x, y) {
      this.x = x;
      this.y = y;
  }

  add(other) {
      return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
      return new Vector2(this.x - other.x, this.y - other.y);
  }

  multiply(scalar) {
      return new Vector2(this.x * scalar, this.y * scalar);
  }

  length() {
      return Math.hypot(this.x, this.y);
  }

  normalize() {
      const len = this.length();
      if (len === 0) return new Vector2(0, 0);
      return this.multiply(1 / len);
  }
}



let assets_ready = false;
let game_started = false;

images.lightning.src = 'images/lightning.png';
images.npc.src = 'images/npc.png';
images.smoke.src = 'images/smoke.png';
images.rpg.src = 'images/rpg.png';
images.portrait.src = 'images/portraits.png';
images.box.src = 'images/text_box.png';
images.button.src = 'images/button.png';
images.icons.src = 'images/icons.png';
images.gradientImage.src = 'images/gradient.png';
images.noise.src = 'images/noise_texture.png';
images.token.src = 'images/token.png';
images.sprites.src = 'images/spritesheet.png';
images.bg.src = 'images/bg1.png';
images.board.src = 'images/board.png';
images.slot.src = 'images/slot.png';
let bgm1 = new Audio('sounds/bgm1.wav');
let bgmrpg = new Audio('sounds/bgmrpg.wav')
bgm1.loop = true;
bgmrpg.loop = true;
let starting_grid = [];
let attackAnimations = [];
let textParticles = [];
let cursor = [];
let hand = [];
const num_attributes_token = 4;
let grid = [];
const num_attributes_tile = 23;
let animations = [];
const num_attributes_animation = 6;
let summons = [];
const num_attributes_summon = 6;
let summonIndices = [];
let foes = [1,1];
let starting_foes = [15];
let fight_mode = false;
let gradient_offset = 0;
let rawmouseX = 0;
let rawmouseY = 0;
let mouseX = 0;
let mouseY = 0;
let boardx = 120;
let boardy = 20;
let camerax = 0;
let cameray = 0;
let token_size = 92;
let player_input = new Vector2(0,0);
let player_click = false;
let hoveredTile = null;
let hoveredToken = null;
let last_hovered_token = null;
let last_hovered = null;
let global_animation_speed = 20;
let id_generator = 110;
let tile_selected = -1;
let target_tile = -1;
let remainingDistance = 0;
const tilewidth = 64;
const tileheight = 64;
let turn = 1; //turn 1 is player's turn
let over_button = false;
let deckIndex = 0;
let enemyDeckIndex = 0;
let in_attack_motion = false;
let fightTakingPlace = 0;
let turn_count = 0;
let dialog_trigger = false;
let sound_buffer = false;
let music_playing = [];
let mouse_click = false;
let spoils = [];
let battle_over = false;
let foes_visited_tiles = [];

//turn 0 is the enemy's turn




const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)');




function loadSounds(soundList) {
  const sounds = {};

  for (let key in soundList) {
    const audio = new Audio(soundList[key]);
    audio.preload = 'auto';
    audio.load();
    sounds[key] = audio;
  }

  return sounds;
}

const soundPaths = {
  tile_change_sfx: 'sounds/tile_change.wav',
  wave_sfx: 'sounds/wave.wav',
  slash_sfx: 'sounds/slash.wav',
  move_sfx: 'sounds/move.wav',
  death_sfx: 'sounds/death.wav',
  over_button_sfx: 'sounds/over_button.wav',
  turn_change_sfx: 'sounds/turn_change.wav',
  select_sfx: 'sounds/select.wav',
  explosion_sfx: 'sounds/explosion.wav',
  text1: 'sounds/text1.wav',
  text2: 'sounds/text2.wav',
  leaves: 'sounds/leaves.wav',
  battle_sound: 'sounds/battle_sound.wav',
  victory_sfx: 'sounds/victory.wav',
  freeze_sfx: 'sounds/freeze.wav',
  forest_sfx: 'sounds/forest.wav',
  labyrinth_sfx: 'sounds/labyrinth.wav',
  poison_sfx: 'sounds/poison.wav',
  splash_sfx: 'sounds/splash.wav',
  lightning_sfx: 'sounds/lightning.wav',
  spark_sfx: 'sounds/spark.wav',
  notification_sfx: 'sounds/notification.wav',
};


function play_sfx(sfx){
  let sound = sfx.cloneNode();
  playWhenLoaded(sound);
}

const gameSounds = loadSounds(soundPaths);


function playWhenLoaded(audio) {
  if (audio.readyState >= 4) {
    // Already loaded, just play
    audio.play();
  } else {
    // Wait for it to be ready
    audio.oncanplaythrough = () => {
      audio.play();
    };
    audio.load(); // Ensure loading starts
  };
  music_playing.push(audio);
};


let imagesLoaded = 0;
const totalImages = Object.keys(images).length;





for (let key in images) {
  images[key].onload = () => {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
      assets_ready = true;
      
    };
  };
};
//---------------detect click----------------------------------------------------------------
//---------------detect click----------------------------------------------------------------
//---------------detect click----------------------------------------------------------------






// press mous

document.addEventListener('mousedown', () => {
  mouse_click = true;
  board_mouse_down();
  rpg_mouse_down();
 
  


  

})

function board_mouse_down() {
  if (turn == 1) {
    if (hoveredTile == null) {} else if (target_tile == -1) {
      //you're over a tile
      if (grid[hoveredTile.i + 5] == false) {
        //there has no selection
        if (tile_selected == -1 && grid[hoveredTile.i +18] == -1) {
          //there is no other tile selected, select it
          play_sfx(gameSounds.select_sfx);
          tile_selected = hoveredTile.i; //asign it's index to the selected variable
          grid[hoveredTile.i + 5] = true; //set the tile to selected
        } else {
          //there is another tile selected, maybe change the selection if changes your mind about letting the player select another tile right after one seleciton
          //here you would check first if the selected tile has a summon, then what you have in the target tile.
          //if the selected tile has no summon don't do anything
          //however if it has a summon, you either move it to the target tile or check if it is too far away for a battle between the summons.
          if (grid[tile_selected + 6] > -1 && grid[tile_selected +18] == -1) {
            //the previously selected tile has a summon, and it's yours
            //unless there is no summon in the target tile, in which case you can select it

            if (grid[hoveredTile.i + 6] == -1) {
              //----------------- TRY MOVE -------------------
              //prev tile has summon, check if it's yours first, if not just select the target tile
              //the target tile is empty but as the previous has a summon it's here the player is trying to move the summon to the target tile
              //if the tile is too far away, just select it, maybe play a sound effect
              //now you don't nedd to get distance, you can just check in the grid if the target tile is avaiable grid[hoveredTile.i + 11]
              
              
  
              if (grid[hoveredTile.i + 11] == true) {
                //so it's avaiable according to the range of the summon
                //----------------- MOVE SUCCESS -------------------
                //code working perfectly until here :)
                //let's deselect it for now just in case
                grid[tile_selected+16] = true;
                target_tile = hoveredTile.i
                let startX = grid[tile_selected+1]*68 + boardx + 90;
                let startY = grid[tile_selected+2]*68 + boardy + 74;
                let targetX = grid[hoveredTile.i+1]*68 + boardx + 90;
                let targetY = grid[hoveredTile.i+2]*68 + boardy + 74;
                
  
                // startX = 0
                // startY = 0
                // targetX = 500
                // targetY = 500
                startSummonMovement(tile_selected, startX, startY,targetX, targetY)
                grid[tile_selected + 5] = false
                tile_selected = -1
  
  
              } else {
                //the target tile is not avaiable according to the range of the summon
                //so you can't move the summon to the target tile
                //so you can select the target tile
                play_sfx(gameSounds.select_sfx);
                grid[tile_selected + 5] = false; //find the selected tile and deselect it
                tile_selected = hoveredTile.i; //asign it's index to the selected variable
                grid[hoveredTile.i + 5] = true; //set the hovered tile to selected
              }
            } else {
              //target tile has a summon, so you check if it is yours and also if you can reach it, if it is yours you select it/do some special interaction idk
              //if it's a foe's we check if our summon can reach it
  
              const target_x = grid[hoveredTile.i +1];
              const target_y = grid[hoveredTile.i +2];
              const attacking_x = grid[tile_selected +1];
              const attacking_y = grid[tile_selected +2];
  
              distance = getDistance(target_x,target_y,attacking_x,attacking_y); 
  
              if (distance < 2 && grid[tile_selected +17] == false && grid[hoveredTile.i +18] >= 0) { //attack neutral enemies too
                //if you have not attacked and it's a foe, go ahead
                //so it's avaiable according to the range of the summon
                //----------------- BATTLE START -------------------
                
                grid[tile_selected +17] = true;
                
                target_tile = hoveredTile.i; //asign it's index the target tile so none of this code gets run again
                //now that we have a fixed target_tile we can do the battle animation
                attackStart();
  
                
  
  
  
              } else if (grid[hoveredTile.i +18] == -1){
                //the target tile is not avaiable according to the range of the summon
                //so you can't move the summon to the target tile
                //so you can select the target tile
                play_sfx(gameSounds.select_sfx);
                grid[tile_selected + 5] = false; //find the selected tile and deselect it
                tile_selected = hoveredTile.i; //asign it's index to the selected variable
                grid[hoveredTile.i + 5] = true; //set the tile to selected
              }
            }
  
          } else if (grid[hoveredTile.i +18] == -1) {
            //the previously selected tile does not have a summon, so you can select this tile
            //---------------------------------------------------------------this means there are no actions to do with an empty tile
            play_sfx(gameSounds.select_sfx);
            grid[tile_selected + 5] = false; //find the selected tile and deselect it
            tile_selected = hoveredTile.i; //asign it's index to the selected variable
            grid[hoveredTile.i + 5] = true; //set the tile to selected
          };
  
  
  
  
          //there is another tile selected, deselect it according to the variable selected
          
        }
      } else {
        //the tile has a selection so undo it
        grid[hoveredTile.i + 5] = false;
        tile_selected = -1;
      };
      check_closer_tiles(0,0,-1);
    };
    if (hoveredToken == null) {
      // player has no token
      if (over_button == true && turn == 1 && movingSummons.length == 0 && in_attack_motion == false) {
        //just for safety you check if the player isn't hovering any tiles, but you can take that away later
        turn = 0;
        play_sfx(gameSounds.turn_change_sfx);
      }
  
    } else if (cursor.length == 0) {
      // cursor empty when you press mouse over a token
      cursor.push(
        images.token,
        token_size,
        0, //this is the variable to make it smaller when you summon something
        0, //this is the variable to make it smaller when you summon something
        hand[hoveredToken.i + 2], //summon type
      );
      hand.splice(hoveredToken.i, num_attributes_token);
    } else {
      //just for safety
      hand.push( //this is so it resets the size when giving back to the hand
        images.token,
        token_size,
        cursor[4], // summon type
        0,
      );
      cursor = [];
  
  
    };
  }
}


// let go mous
document.addEventListener('mouseup', () => {
  mouse_click = false;
  board_mouse_up();
  rpg_mouse_up();


});

function board_mouse_up() { 
  if (cursor.length !== 0 && target_tile == -1) {
    // you're holding a token
    if (cursor[1]== token_size) {
      //cursor token size is bigger than the average token
      if (hoveredTile == null || player_king[5] == true) {
        //if you're anywhere in the screen there has no tiles, so they go back to the hand
        hand.push( //this is so it resets the size when giving back to the hand
          images.token,
          token_size,
          cursor[4], // summon type
          0,
        );
        cursor = [];
      } else {
        // you're over a tile
        const tile_cost = summonsData[(cursor[4]*num_attributes_data)+5];
        const hp = summonsData[(cursor[4]*num_attributes_data)+1]
        if (hp > 0) {
          let distance_to_king = getDistance(grid[hoveredTile.i +1],grid[hoveredTile.i +2],grid[player_king[3] +1], grid[player_king[3] +2])
          let range = 2;
          const domain = find_domain(player_king[3]);
          if (domain > 1) {
            distance_to_king = getDistanceNonEu(grid[hoveredTile.i +1],grid[hoveredTile.i +2],grid[player_king[3] +1], grid[player_king[3] +2])
            range += 1; //add 2 to the range if the summon is in its domain
          };
          if (grid[hoveredTile.i + 6] == -1 && player_king[1] >= tile_cost && distance_to_king < range && player_king[+5] == false) {
            //king is alive
            //there is no summon in this tile and the cost is less or equal to your king's sp
            //once you have spells, remember to check if you are holding a spell
            
            cursor[1] = token_size -1; //make it smaller than a token
            player_king[1] -= tile_cost; //reduce the sp by the cost of the summon
            
            id_generator += 1
            // setup the summon according to the token, once the token means something
            
            summon_thing(cursor[4],id_generator,hoveredTile.i,-1);
          } else {
            //this tile has a summon already can't have another, change it if you make a spell
            hand.push( //this is so it resets the size when giving back to the hand
              images.token,
              token_size,
              cursor[4], // summon type
              0,
            );
            cursor = [];
            //alright, there is a summon in it
            //are you holding a spell? i didn't make spells yet so gotta do this later '-'
          };
        } else if (player_king[1] >= tile_cost){
          //do the spells here once you have any
          cursor[1] = token_size -1;
          player_king[1] -= tile_cost;
          target_tile = hoveredTile.i
          grid[tile_selected+5] = false;
          tile_selected = -1;
          spell_cast(cursor[4]);
        } else {
          // give back to the hand
          hand.push( //this is so it resets the size when giving back to the hand
            images.token,
            token_size,
            cursor[4], // summon type
            0,
          );
          cursor = [];
        };

        
      };
    };
    
  };
}




//-----------------------------------------------------------------------------------------
//--------------------------------SUMMON DATA----------------------------------------------
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
//--------------------------------SUMMON DATA----------------------------------------------
//-----------------------------------------------------------------------------------------
const num_attributes_domain = 8;
const domains = [
  //stone 0
  1, //neutral tile [0]
  1.5,//forest        [1]
  1,//burned forest [2]
  2,//mountain      [3]
  1.5,//graveyard     [4]
  0.2,//blood         [5]
  0.5,//water         [6]
  0, //labirinth   [7]

  //tide 1
  1,
  1,
  0.5,
  0.5,
  0.5,
  1.5,
  2,
  0,

  //decay 2
  0.5,
  0.5,
  1.5,
  1,
  2,
  2,
  0.5,
  0,

  //nature 3
  1,
  2,
  0.5,
  1.2,
  0.5,
  0.2,
  1,
  0

];

//------------------------------------------------------------------------------ SUMMON DATA --------


const num_attributes_data = 14;
const summonsData = [
  //summon 0
  "Sack monster", // i name
  30,             // i+1 health
  10,              // i+2 attack
  1,              // i+3 range
  0,              // i+4 idle animation
  2,              // i+5 sc = summon cost
  "Just a sackboy doing sack things", // description i+6
  1,              // domain  //here is the tide one i+7
  4,              // attack animation
  10,              // chance of attaining the token i+9
  0,             // resistance to freeze i+10
  0,             // poison resistance i+21
  0,             // immune to push i+12
  0,             // immune to lightning

  //summon 1
  "Spider",
  20,
  10,
  1,
  5,
  1,
  "dat sure is a speeder",
  0,
  4,
  5,
  0,
  0,
  0,
  0,

  //summon 2
  "Zombot",
  60,
  20,
  1,
  6,
  2,
  "A zombie and a robot at the same time",
  2,
  4,
  5,
  0,
  0,
  0,
  0,

  //summon 3 - first spell
  "Explosion", // name
  0,           // 0 hp to identify as a spell [i+1]
  "target a tile 3x3",           // desciption [i+2]
  "the tile will explode",           // desciption [i+3]
  8,           // animation [i+4]
  1,           // sc = spell cost [i+5]
  "dealing 10 damage", // desciption [i+6]
  10,                     // damage [i+7]
  2,                      //range [i+8]
  5,                      // chance of attaining the token [i+9]
  0,                       // frostbite [i+10]
  0,                      // poison damage[i+11]
  0,                    // pushes away [i+12]
  0,                    // lightning

  //summon 4
  "Jestoom",
  20,
  20,
  1,
  9,
  2,
  "clown centipede",
  2,
  4,
  5,
  0,
  0,
  0,
  0,

  //summon 5 -- spell 2
  "Freeze boom", 
  0,        
  "target a tile 3x3",       
  "the tile will freeze",         
  10,        
  1,      
  "very cool",    
  0,              
  2,                    
  5,                   
  2,      
  0,
  0, 
  0,

  // 6
  "Forest",
  0,
  "Transform close tiles into forest",
  "the tile will turn into forest",
  -1,
  1,
  "birds and stuff",
  1, 
  2, 
  5, 
  0, 
  0, 
  0,
  0,


  //s 7
  "Wall",
  80,
  0,
  0,
  11,
  1,
  "A wall",
  0,
  11,
  2,
  10,
  0,
  0,
  0,

  // 8
  "Labirinth",
  0,
  "Transform close tiles into labirinth",
  "tiles will turn into labirinth",
  -1,
  1,
  "walls and stuff",
  7, //for field spells this is the domain to change to
  2, //how far will it reach
  2, //chance of getting it
  0, //frostbite, if that even makes any sense
  0,
  0,
  0,

  // 9
  "Poison",
  0,
  "Poison the targets 3x3",
  "the tile will poison",
  12,
  1,
  "very toxic",
  0, 
  2, 
  5, 
  0, 
  1, //poison damage
  0,
  0,

  // 10
  "Tide wave",
  0,
  "pushes things away",
  "the tile will push away",
  13,
  1,
  "so wet",
  0, 
  2, 
  4, 
  0, 
  0,
  3, // push
  0,

  // 11
  "Giant bunny",
  20,
  10,
  1,
  14,
  1,
  "Friend shaped monster",
  3,
  4,
  5,
  0,
  0,
  0,
  0,

  // 12
  "Giant racoon",
  30,
  10,
  1,
  15,
  2,
  "Friend shaped dancer",
  3,
  4,
  8,
  0,
  0,
  0,
  0,

  // 13
  "Lightning",
  0,
  "electrifies 3x3",
  "the tile will light up",
  16,
  1,
  "electric",
  0, 
  2, 
  5, 
  0, 
  0,
  0,
  10, //summons a lightning before the animation

  //summon 14
  "Chonky lion", 
  50,
  20,
  1,
  17,
  3,
  "don't let his appearance fool you",
  3,
  4,  
  5,
  0,
  0,
  0,
  0, 

  // 15
  "Void lizard",
  40,
  20,
  1,
  18,
  2,
  "careful, it be lizard",
  3,
  4,
  5,
  0,
  1,
  2,
  0,

];

//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  e: false,
  enter: false,
};

window.addEventListener('keydown', function(event) {
  if (event.key === 'w') keys.w = true;
  if (event.key === 'a') keys.a = true;
  if (event.key === 's') keys.s = true;
  if (event.key === 'd') keys.d = true;
  if (event.key === 'e') keys.e = true;
  if (event.key === 'l') keys.l = true;
  if (event.key === 'c') keys.c = true;
  if (event.key === 'v') keys.v = true;
  if (event.key === 'Enter') keys.enter = true;
  if (event.key === ' ') keys.space = true;
  if (event.key === 'q') keys.q = true;
  if (event.key === 'Tab') keys.tab = true;
  if (event.key === 'Escape') keys.esc = true;
  if (event.key === '1') keys.num1 = true;
  if (event.key === '2') keys.num2 = true;
  if (event.key === '3') keys.num3 = true;
  if (event.key === '4') keys.num4 = true;
  if (event.key === 'p') keys.p = true;


});

window.addEventListener('keyup', function(event) {
  if (event.key === 'w') keys.w = false;
  if (event.key === 'a') keys.a = false;
  if (event.key === 's') keys.s = false;
  if (event.key === 'd') keys.d = false;
  if (event.key === 'e') keys.e = false;
  if (event.key === 'l') keys.l = false;
  if (event.key === 'c') keys.c = false;
  if (event.key === 'v') keys.v = false;
  if (event.key === 'Enter') keys.enter = false;
  if (event.key === ' ') keys.space = false;
  if (event.key === 'q') keys.q = false;
  if (event.key === 'Tab') keys.tab = false;
  if (event.key === 'Escape') keys.esc = false;
  if (event.key === '1') keys.num1 = false;
  if (event.key === '2') keys.num2 = false;
  if (event.key === '3') keys.num3 = false;
  if (event.key === '4') keys.num4 = false;
  if (event.key === 'p') keys.p = false;

});


let enemy_deck = [0];
function enemyDeckUpdate() {
  enemyDeckIndex += 1;
  if ( enemyDeckIndex > enemy_deck.length-1) {
    enemyDeckIndex = 0;
  };
};


let deck = [0,15];
function deckUpdate() {
  console.log(deckIndex,"deck",deck,"decklength",deck.length-1);
  if (deck.length === 0) {
    console.warn("Deck is empty. Cannot update deckIndex.");
    return;
  }
  deckIndex += 1;
  if (deckIndex > deck.length-1) {
    deckIndex = 0;
  };
};

function buildHand() {
  for (let i = 0; i < player_king[8]; i++) {
    if (deck[deckIndex] === undefined || deck[deckIndex] < 0 || deck[deckIndex] >= summonsData.length / num_attributes_data) {
      console.warn(`Invalid card in deck at index ${deckIndex}:`, deck[deckIndex]);
      deckUpdate();
      continue; // Skip invalid cards
    }
    hand.push(
      images.token,
      token_size,
      deck[deckIndex], // Add valid card to the hand
      0
    );
    deckUpdate();
  }
};



function build_grid() {
  for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 11; x++) {
        let tile = starting_grid[x+y*11];
        if (tile === undefined) {
          tile = 0;
        }
          grid.push(
            images.slot,
            x,
            y,
            tilewidth,
            tileheight,
            false, //selected
            -1,  // summon grid[i+6]
            -1, // type
            0, // offset x
            0, // offset y
            0, // animation
            false, //available for the visual water effect
            0, // wave for the wave effect
            0, // wave trying to reach zero for the wave animation
            0, // summon hp
            0, // summon damage taken animation
            false,  // summon has moved?
            false, // summon has attacked?
            -1, // summon is foe?
            tile, // tile_type
            0, // frozen
            0, // poison
            0  // electrified
          );
      }
  }
};




let player_king = [

  100, //which summon is the king "111" is the first summon that appears in the board
  0, // sp = summon power
  4, // max sp
  104*num_attributes_tile, // tile located  king[3]
  1, // summon type king[4]
  false, //dead or not king[5]
  4, //sp gain per turn king[6]
  1, //cards drawn per turn king[7]
  2, //starting hand size [8]
  //later on add the upgrades here
];



let enemy_king = [

  101, //which summon is the king "111" is the first summon that appears in the board
  0, // sp = summon power
  4, // max sp
  5*num_attributes_tile, // tile located  king[3]
  0, // summon type king[4]
  false, //dead or not king[5]
  1, //sp gain per turn king[6]
  2, //cards drawn per turn king[7]
  4, //starting hand size [8]
  //later on add the upgrades here
];

function setupKing() {
  //summon kings
  summon_thing(player_king[4],player_king[0],player_king[3],-1);
  if(!enemy_king[5]) {
    //if enemy king is alive
    summon_thing(enemy_king[4],enemy_king[0],enemy_king[3],1);
  }
  
};


function summon_thing(type,id,index,foe) {
  // setup the summon according to the token, once the token means something
  let hp = summonsData[(type*num_attributes_data)+1];
  grid[index + 14] = hp; //setup hp according to token
  grid[index + 6] = id;
  grid[index + 7] = type;  //type, change it according to the token
  grid[index + 20] = 0; // frozen

  grid[index + 16] = true; // can't move first turn, change in case the token has a haste effect
  grid[index + 17] = true; // can't attack first turn, change if the token has a haste thingy


  if (type == 7) { //it's a wall?
    grid[index + 18] = 0; // walls are neutral
  } else {
    grid[index + 18] = foe; // if is a foe
  };
  
  //do the summon animation in here and let the animation code do the summon instead of here
  startSummoning(index,hp/10);
  play_sfx(gameSounds.wave_sfx);
}


let hovering_effect = 0;
let hover_up = 0;
let hover_angle = -2; // goes from 0 to 2π
const hover_speed = 0.05; // adjust to make hover faster/slower
const hover_amplitude = 1; // how far up/down the hover goes

function updateHovering() {
  hover_angle += hover_speed;
  if (hover_angle > Math.PI * 2) hover_angle -= Math.PI * 2;
  hovering_effect = Math.sin(hover_angle) * hover_amplitude;
}


let smokeParticles = [];  
function createSmokeParticles(x, y, amount = 20) {
  for (let i = 0; i < amount; i++) {
    let offsetX = (Math.random() - 0.5) * 60; // Random offset in X direction
    let offsetY = (Math.random() - 0.5) * 20; // Random offset in Y direction

    let angle = Math.PI * 1.5 + (Math.random() - 0.5) * 0.2; // Around 270° (upward)
    let speed = Math.random() * 0.5; // Small random speed
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;

    let size = Math.random() * 40 + 30; // Random size
    let life = Math.random() * 1000 + 50; // Lifespan
    let age = 0; // Start with age 0

    smokeParticles.push(x + offsetX, y + offsetY, vx, vy, size, life, age);
  }
}
function updateAndDrawSmokeParticles() {
  for (let i = smokeParticles.length - 7; i >= 0; i -= 7) {
    let x = smokeParticles[i];
    let y = smokeParticles[i + 1];
    let vx = smokeParticles[i + 2];
    let vy = smokeParticles[i + 3];
    let size = smokeParticles[i + 4];
    let life = smokeParticles[i + 5];
    let age = smokeParticles[i + 6];

    // Update
    age += 1; // Increase age
    x += vx;
    y += vy;
    life -= 1; // Gradually fade out
    size -= 0.1; // Gradually shrink

    // Draw
    ctx.globalAlpha = Math.max(life / 100, 0); // Fade out over time
    ctx.drawImage(images.smoke, (x - size / 2)-camerax, (y - size / 2)-cameray, size, size); // Use the smoke texture
    ctx.globalAlpha = 1; // Reset alpha

    // Save updated values
    smokeParticles[i] = x;
    smokeParticles[i + 1] = y;
    smokeParticles[i + 4] = size;
    smokeParticles[i + 5] = life;
    smokeParticles[i + 6] = age;

    // Remove if dead
    if (life <= 0 || size <= 0.5) {
      smokeParticles.splice(i, 7);
    }
  }
}


let deathParticles = [];




function createDeathParticles(x, y, color = "white") {
  for (let i = 0; i < 20; i++) {
    let angle = Math.random() * Math.PI * 2;
    let speed = Math.random() * 3.5 + 0.5;
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;
    deathParticles.push(x, y, vx, vy, 1, 20, color);
  }
}

function updateAndDrawDeathParticles() {
  for (let i = deathParticles.length - 7; i >= 0; i -= 7) {
    let x = deathParticles[i];
    let y = deathParticles[i + 1];
    let vx = deathParticles[i + 2];
    let vy = deathParticles[i + 3];
    let alpha = deathParticles[i + 4];
    let life = deathParticles[i + 5];
    let color = deathParticles[i + 6];

    // Update
    x += vx;
    y += vy;
    alpha -= 0.07;
    life--;

    // Draw
    ctx.globalAlpha = Math.max(alpha, 0);
    ctx.fillStyle = color;
    let size = Math.random() * 3 + 2;
    ctx.fillRect(x, y, size, size);
    ctx.globalAlpha = 1;

    // Save updated values
    deathParticles[i] = x;
    deathParticles[i + 1] = y;
    deathParticles[i + 4] = alpha;
    deathParticles[i + 5] = life;

    // Remove if dead
    if (life <= 0 || alpha <= 0) {
      deathParticles.splice(i, 7);
    }
  }
}

let movingSummons = []; // an array to hold summons that are currently moving
const summon_move_size = 15;

function startSummonMovement(index, startX, startY, targetX, targetY) {
  movingSummons.push(
    grid[index + 6],  // id
    grid[index + 7],  // type
    -1,               // animation
    grid[index + 14], // hp

    startX,           // current X
    startY,           // current Y
    targetX,          // target X
    targetY,          // target Y
    0,                // offset X
    0,                // offset Y
    0,                 // progress
    grid[index+16],   // has moved?
    grid[index+17],    // has attacked?
    grid[index+18],    // foe
    grid[index+21]     // poison
  );
  if (index == player_king[3]) {
    player_king[3] = target_tile;
  } else if (index == enemy_king[3]) {
    enemy_king[3] = target_tile;
  };

  for (let i = 0; i < 8; i++) {
    dustParticles.push(startX-camerax+(Math.random()-0.5)*4, startY+20-cameray+(Math.random()-0.5)*4, 3, (Math.random()-0.5)*3, -0.5, 0.5);
  }
  play_sfx(gameSounds.move_sfx);
  // Clear from grid
  delete_summon(index);
}

function updateAndDrawMovingSummons() {
  for (let i = movingSummons.length - summon_move_size; i >= 0; i -= summon_move_size) {
    let id        = movingSummons[i];
    let type      = movingSummons[i + 1];
    let anim      = movingSummons[i + 2];
    let hp        = movingSummons[i + 3];
    let startX = movingSummons[i + 4];
    let startY = movingSummons[i + 5];
    let targetX = movingSummons[i + 6];
    let targetY = movingSummons[i + 7];
    let offset_x = movingSummons[i + 8];
    let offset_y = movingSummons[i + 9];
    let t = movingSummons[i + 10];
    let has_moved = movingSummons[i+11]   // has moved?
    let has_attacked = movingSummons[i+12] // has attacked?
    let foe = movingSummons[i + 13]  // foe
    let poison = movingSummons[i + 14] // poison

    //got distance now
    let x = startX;
    let y = startY;
    
    if (t < 1) {
      movingSummons[i + 10] += 0.1;
      t = t * t * (3 - 2 * t);
      if (t > 1) t = 1;
  
      x = startX + (targetX - startX) * t;
      y = startY + (targetY - startY) * t;
    }
    dustParticles.push(x-camerax+(Math.random()-0.5)*4,y+20-cameray+(Math.random()-0.5)*10, 3, (Math.random()-0.5)*3, -0.5, 0.5);
    let dist = getDistance(x,y,targetX,targetY);

    let frame_location_x = 100*animations[find_animation(5,id,true,global_animation_speed,2)]
    let frame_location_y = 100*summonsData[(type*num_attributes_data)+4];
    // Draw the summon
    ctx.drawImage(images.sprites, frame_location_x, frame_location_y, 80, 80, x - 40-camerax, y-50-cameray, 80, 80);
    if (id == player_king[0]) {
      draw_king(x -camerax, y-cameray,0,id);
    }
    

    if (dist <= 2) {
      copy_tile(target_tile,id,type,hp,has_moved,has_attacked,foe,poison);

      target_tile = -1;
      movingSummons.splice(i, summon_move_size);
      // if (foe == true) {
      //   turn = -2;
      // }
    }
  }
}


function copy_tile(target_i,id,type,hp,has_moved,has_attacked,foe,poison) {
  grid[target_i + 6] = id;
  grid[target_i + 9] = 0;
  grid[target_i + 7] = type;
  grid[target_i + 10] = -1;
  grid[target_i + 14] = hp;
  grid[target_i + 16] = has_moved;
  grid[target_i + 17] = has_attacked;
  grid[target_i + 18] = foe;
  grid[target_i + 21] = poison;
};

function find_domain(i){
  const domainIndex = summonsData[grid[i+7]*num_attributes_data+7]; // that's how you find the domain index
  const domain = domains[domainIndex*num_attributes_domain+grid[i+19]]; // you add the grid which has the specific environment that each domain has affinity to
  return domain
}

function change_tile_domain(i,domain) {
  //change the domain of the summon
  grid[i+19] = domain;
  const domainIndex = summonsData[grid[i+7]*num_attributes_data+7]; // that's how you find the domain index
  const domain_value = domains[domainIndex*num_attributes_domain+domain]; // you add the grid which has the specific environment that each domain has affinity to
  grid[i+12] = -20; //change the wave according to the new domain
  grid[i+13] = 0.1; // start the wave
}

function field_spell(range,domain) {

  const target_x = grid[target_tile+1];
  const target_y = grid[target_tile+2];
  
  switch (domain) {
    case 1:
      play_sfx(gameSounds.forest_sfx);
      break;
    case 7:
      play_sfx(gameSounds.labyrinth_sfx);
      break;
  };

  for (let i = 0; i < grid.length; i += num_attributes_tile) {
    if (grid[i+19] !== 7) {
      const distance = getDistanceNonEu(grid[i+1],grid[i+2],target_x,target_y);
      if (distance < range) {
        //attackAnimations.push(my_x,my_y,2*80,id_generator);
        //only deal damage if summon exists.
        if (domain == 7) {
          if (player_king[3] !== i && enemy_king[3] !== i) {
            grid[i + 16] = true; //lose movement cuz labirinth
            grid[i + 17] = true; //lose attack cuz labirinth
            foes_visited_tiles = []; //reset the visited tiles because the board changed
            change_tile_domain(i,domain); //change the domain of the summon
          };
        } else {
          change_tile_domain(i,domain); //change the domain of the summon
        };
      };
    };
  };
  target_tile =-1;
};

function spell_cast(type) {
  attackAnimations = [];
  const target = target_tile;

  const fire_damage = summonsData[type*num_attributes_data+7];
  const frostbite = summonsData[type*num_attributes_data+10];
  const poison = summonsData[type*num_attributes_data+11];
  let range = summonsData[type*num_attributes_data+8]; //range of the spell
  const spell_animation = summonsData[type*num_attributes_data+4];
  const push = summonsData[type*num_attributes_data+12]; //push away
  const lightning = summonsData[type*num_attributes_data+13];

  if (spell_animation == -1) {
    field_spell(range,fire_damage); //this is a field spell, so damage is domain
  } else {
    const target_x = grid[target+1];
    const target_y = grid[target+2];
    let summon_found = false;

    if (frostbite > 0) {
      play_sfx(gameSounds.freeze_sfx);
    }
    if (fire_damage > 0) {
      play_sfx(gameSounds.explosion_sfx);
    }
    if (poison > 0) {
      play_sfx(gameSounds.poison_sfx);
    };
    if (push > 0) {
      play_sfx(gameSounds.splash_sfx);
    } if (lightning > 0) {
      play_sfx(gameSounds.lightning_sfx);
    }


    if (range > 1) {
      for (let i = 0; i < grid.length; i += num_attributes_tile) {
        const distance = getDistance(grid[i+1],grid[i+2],target_x,target_y);
        if (distance < range) {
          const my_x = grid[i+1]*(tilewidth + 4) + boardx + 40;
          const my_y = grid[i+2]*(tilewidth + 4) + boardy + 36;
          if (grid[i+6] !== -1  && player_king[3] !== i && enemy_king[3] !== i) {
            //spells don't affect kings
            //only deal damage if summon exists.
            if (lightning >0) {
              createLightning(my_x,my_y,lightning,i);
              
            }
            if (fire_damage > 0) {
              const multiplier = find_domain(i) //decrease the attacker's buff by the deffender's buff
              const damage = fire_damage/multiplier; //damage in the spell
              grid[i + 15] = damage;  
              createSmokeParticles(my_x+40, my_y+40);
              if (grid[i+20] > 0)  {  //remove frostbite
                grid[i + 20] = 0;
              };
            } else if (push > 0) {

              pushLogic(push,i);
            } else {
              target_tile = -1; //if the spell is a spell that doesn't deal damage, just desselect the tile
            };
            
            grid[i + 20] += frostbite; //give the summon more frostbite
            grid[i + 21] += poison; //give the summon more poison
            summon_found = true;
            
          };
          
          //spawn explosions
          
          if (spell_animation !== 16) {
            id_generator +=1;
            attackAnimations.push(my_x,my_y,spell_animation*100,id_generator);
            
          };
          
          if (grid[i+19] == 1 && spell_animation == 8) {
            grid[i+19] = 2
          }
    
          //wave
        };
        grid[i + 12] =-distance*10;
        grid[i + 13] = 0.1; // start the wave
      };
      if (summon_found == false || push > 0) {
        target_tile =-1;
      };
    }
  }
  
  
  

};

function pushLogic(push,i) {
  let best_score = -Infinity; // Start with the lowest possible score
  let new_tile = i; // Default to the current tile

  // Get the direction vector from target_tile to the current tile
  const target_x = grid[target_tile + 1];
  const target_y = grid[target_tile + 2];
  const current_x = grid[i + 1];
  const current_y = grid[i + 2];
  const direction_x = current_x - target_x;
  const direction_y = current_y - target_y;

  for (let j = 0; j < grid.length; j += num_attributes_tile) {
    const push_distance = getDistance(grid[target_tile + 1], grid[target_tile + 2], grid[j + 1], grid[j + 2]);
    const current_distance = getDistance(grid[i + 1], grid[i + 2], grid[j + 1], grid[j + 2]);

    // Check if the tile is within the push range, is empty, and is not the current tile
    if (push_distance < push && grid[j + 6] == -1 && j !== i) {
      // Calculate the direction vector from the current tile to the candidate tile
      const candidate_x = grid[j + 1];
      const candidate_y = grid[j + 2];
      const candidate_direction_x = candidate_x - current_x;
      const candidate_direction_y = candidate_y - current_y;

      // Normalize the direction vectors
      const magnitude = Math.sqrt(direction_x ** 2 + direction_y ** 2);
      const candidate_magnitude = Math.sqrt(candidate_direction_x ** 2 + candidate_direction_y ** 2);
      const normalized_direction_x = direction_x / magnitude || 0;
      const normalized_direction_y = direction_y / magnitude || 0;
      const normalized_candidate_x = candidate_direction_x / candidate_magnitude || 0;
      const normalized_candidate_y = candidate_direction_y / candidate_magnitude || 0;

      // Calculate the alignment score (dot product)
      const alignment_score = normalized_direction_x * normalized_candidate_x + normalized_direction_y * normalized_candidate_y;

      // Calculate a score for this tile
      let score = alignment_score * 10; // Prefer tiles aligned with the opposite direction
      score += push_distance; // Prefer tiles farther from the target_tile
      score += Math.random() * 2; // Add some randomness to make it less predictable
      score -= current_distance * 0.5; // Penalize tiles that are too close to the current position

      // Update the best tile if this one has a higher score
      if (score > best_score) {
        best_score = score;
        new_tile = j;
      }
    }
  }
  //create an array for each moving summon :)

  if (new_tile !== i) {
    //console.log(new_tile,grid[new_tile + 1],grid[new_tile + 2], "x", grid[i+1],"y", grid[i+2])
    copy_tile(new_tile,grid[i + 6],grid[i+ 7],grid[i + 14],grid[i+16], grid[i+17],grid[i+18],grid[i+21]);
    delete_summon(i);
  };
};

function attackStart() {

  //spawn an attack thingy i guess
  
  
  const my_x = grid[target_tile+1]*(tilewidth + 4) + boardx + 40;
  const my_y = grid[target_tile+2]*(tilewidth + 4) + boardy + 36;



  
  // add domain multiplier

  let my_s_type = grid[tile_selected + 7]; // summon type
  let target_s_type = grid[target_tile + 7]; // target type
  let my_freeze_r = summonsData[my_s_type*num_attributes_data+10];
  let target_freeze_r = summonsData[target_s_type*num_attributes_data+10];
  let my_poison_r = summonsData[my_s_type*num_attributes_data+11];
  let target_poison_r = summonsData[target_s_type*num_attributes_data+11];
  let my_push_r = summonsData[my_s_type*num_attributes_data+12];
  let target_push_r = summonsData[target_s_type*num_attributes_data+12];
  let my_lightning_r = summonsData[my_s_type*num_attributes_data+13];
  let target_lightning_r = summonsData[target_s_type*num_attributes_data+13];


  let target_multiplier = find_domain(target_tile); 
  let my_multiplier = find_domain(tile_selected);
  let target_poison = grid[target_tile + 21]; // poison
  let my_poison = grid[tile_selected + 21]; // poison
  let multiplier = 0;



  //apply poison, freeze and push here  minecraft
  const freeze_product = my_freeze_r - target_freeze_r
  if (freeze_product > 0) {
    grid[target_tile + 20] += freeze_product;
  };
  const poison_product = my_poison_r - target_poison_r
  if (poison_product > 0) {
    grid[target_tile + 21] += poison_product;
  };
  const push_product = my_push_r - target_push_r
  if (push_product > 0) {
    pushLogicAttack(push_product,target_tile);
  };
  const lightning_product = my_lightning_r - target_lightning_r
  if (lightning_product > 0) {
    grid[target_tile + 23] += lightning_product;
  };


  console.log(freeze_product, poison_product, push_product, lightning_product);




  // deal the damage if any
  if (target_multiplier !== 0 && my_multiplier !== 0 && my_multiplier !== 0) { // if you are not in a labirinth nor is your foe
    multiplier = my_multiplier / target_multiplier; //decrease the attacker's buff by the deffender's buff
  };

  let damage = summonsData[grid[tile_selected + 7]*num_attributes_data+2]*multiplier
  damage = damage + (target_poison - my_poison)*10; //damage in the attack
  if (damage < 1) {target_tile = -1} else {
    //if there is damage reduction apply here
    grid[target_tile + 15] = Math.floor(damage); //deal damage according to type, 
  };

  


  


  attackAnimations = [];
  id_generator +=1;
  const animation = summonsData[grid[tile_selected+7]*num_attributes_data+8]*100;
  attackAnimations.push(my_x,my_y,animation,id_generator);
  play_sfx(gameSounds.slash_sfx);
  
};


function pushLogicAttack(push) {
  let pushed_by_x = grid[tile_selected + 1];
  let pushed_by_y = grid[tile_selected + 2];
  let got_pushed_x = grid[target_tile + 1];
  let got_pushed_y = grid[target_tile + 2];
  
  let dx = pushed_by_x -got_pushed_x;
  let dy = pushed_by_y -got_pushed_y;

  let best_distance = 0;
  let new_tile = -1;  for (let i = 0; i < grid.length; i += num_attributes_tile) {
    distance = getDistance(pushed_by_x, pushed_by_y, grid[i+1], grid[i+2]);
    if (distance >= best_distance && grid[i+6] == -1 && distance < push) {
      best_distance = distance;
      new_tile = i;
    };
  };
  if (new_tile !== -1) {
    //minecraft2
    let startX = grid[target_tile+1]*68 + boardx + 90;
    let startY = grid[target_tile+2]*68 + boardy + 74;
    createDeathParticles(startX, startY, "grey");
    let i = target_tile;
    copy_tile(new_tile,grid[i + 6],grid[i+ 7],grid[i + 14],grid[i+16], grid[i+17],grid[i+18],grid[i+21]);
    delete_summon(i);
    target_tile = new_tile;
    
    
  };

};



function updateAttackAnimations() {
  
  const size = 80;
  for (let i = attackAnimations.length - 4; i >= 0; i -= 4) {
    const x = attackAnimations[i];
    const y = attackAnimations[i + 1];
    
    let frame_y = attackAnimations[i + 2];
    const id = attackAnimations[i + 3];
    let frame_x = 0;

    const animation_index = find_animation(5,id,false,global_animation_speed,4)
    frame_x += 100*animations[animation_index];

    ctx.drawImage(images.sprites, frame_x, frame_y, 100, 100, x-camerax+20, y-cameray+10, size, size);
    if (animations[animation_index+5] == 20) {
      attackAnimations.splice(i,4);
      //check if it's ice here and freeze the target >:)
    };
  };
};
dustParticles = [];
function updateAndDrawDustParticles() {
  for (let i = dustParticles.length - 6; i >= 0; i -= 6) {
    let x = dustParticles[i];
    let y = dustParticles[i + 1];
    let size = dustParticles[i + 2];
    let vx = dustParticles[i + 3];
    let vy = dustParticles[i + 4];
    let life = dustParticles[i + 5];


    x += vx;
    y += vy;


    vy += 0.05;
    size *= 0.96;
    life -= 0.02; 


    ctx.fillStyle = `rgba(200, 200, 200, ${life})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();


    dustParticles[i] = x;
    dustParticles[i + 1] = y;
    dustParticles[i + 2] = size;
    dustParticles[i + 3] = vx;
    dustParticles[i + 4] = vy;
    dustParticles[i + 5] = life;


    if (size < 0.5 || life <= 0) {
      dustParticles.splice(i, 6);
    }
  }
}

function updateAndDrawTextParticles() {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';

  for (let i = textParticles.length - 8; i >= 0; i -= 8) {
    let x = textParticles[i];
    let y = textParticles[i + 1];
    let size = textParticles[i + 2];
    let vx = textParticles[i + 3];
    let vy = textParticles[i + 4];
    let life = textParticles[i + 5];
    let text = textParticles[i + 6];
    let colorType = textParticles[i + 7]; 

    // Set color based on type
    if (colorType === 0) ctx.fillStyle = 'red';
    else if (colorType === 1) ctx.fillStyle = 'yellow';


    x += vx;
    y += vy;
    vy += 0.2;          // gravity
    size *= 0.98;       // shrink
    life -= 0.02;       // life drain


    ctx.font = `${size}px MyFont`;
    ctx.fillText(text, x, y);


    textParticles[i] = x;
    textParticles[i + 1] = y;
    textParticles[i + 2] = size;
    textParticles[i + 3] = vx;
    textParticles[i + 4] = vy;
    textParticles[i + 5] = life;


    if (size < 5 || life <= 0) {
      textParticles.splice(i, 8);
    }
  }
}


let lightnings = [];

function createLightning(x,y,lightning_power,grid_index) {
  lightnings.push({
    x: x, // Random horizontal position
    y: y-canvas.height, // Start at the top of the screen
    opacity: 0.5, // Start fully transparent
    state: "fadeIn", // Initial state
    timer: 0, // Timer to control transitions
    flashOpacity: 0, // Opacity for the white screen flash
    lightning_power: lightning_power,
    grid_index: grid_index,
  });
};

function updateAndDrawLightnings() {
  for (let i = lightnings.length - 1; i >= 0; i--) {
    const lightning = lightnings[i];

    // Update logic
    if (lightning.state === "fadeIn") {
      lightning.opacity += 0.1; // Increase opacity
      if (lightning.opacity >= 1) {
        
        lightning.opacity = 1;
        lightning.state = "flash"; // Transition to flash state
      }
    } else if (lightning.state === "flash") {
      lightning.flashOpacity += 0.4; // Increase screen flash opacity
      if (lightning.flashOpacity >= 1) {
        lightning.flashOpacity = 1;
        lightning.timer = 10; // Hold the flash for a short time
        lightning.state = "hold";
      }
    } else if (lightning.state === "hold") {
      lightning.timer -= 1;
      if (lightning.timer <= 0) {
        lightning.state = "fadeOut"; // Transition to fade-out state
        grid[lightning.grid_index +22] = lightning.lightning_power;
      }
    } else if (lightning.state === "fadeOut") {
      lightning.opacity -= 0.1; // Decrease opacity
      lightning.flashOpacity -= 0.1; // Decrease screen flash opacity
      if (lightning.opacity <= 0 && lightning.flashOpacity <= 0) {
        lightnings.splice(i, 1); // Remove lightning effect
        
        continue;
      }
    }
    // Draw logic
    ctx.globalAlpha = lightning.opacity;
    ctx.drawImage(images.lightning, lightning.x-camerax, lightning.y+90-cameray, 128, canvas.height);

    ctx.globalAlpha = lightning.flashOpacity;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 1; // Reset alpha
  }
};


function getDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

function getDistanceNonEu(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

function draw_summon_icon(x,y,distance,type,i) {
  x += 40 
  y -= 40

  let size = 30;
  let distance_b_icon = 30;
  if (distance > 0) {
    size = 48-distance/2;
  };
  //icon size = 24

  
  let data = grid[i+14]; //current hp
  let max_hp = summonsData[type*num_attributes_data+1]; // max hp
  data = data + "/" + max_hp; // cost over amount of sp left
  draw_icon_text(x,y,size,data,0);


  if (grid[i+16] == false) {
    data = "Can move"
  } else {
    data = "Cannot move"
    ctx.filter = `brightness(0.2)`
  }
  draw_icon_text(x,y+distance_b_icon,size,data,70);
  distance_b_icon +=30
  if (grid[i+17] == false) {
    data = "Can attack"
  } else {
    data = "Cannot attack"
    ctx.filter = `brightness(0.2)`
  }
  draw_icon_text(x,y+distance_b_icon,size,data,24);
  distance_b_icon +=30


  
  
  const domain = find_domain(i);
  if (domain !== 1) {
    data = "field modifier: " + domain;
    if (domain > 1) {
      ctx.filter = `brightness(2.0)`
      data = "terrain advantage"
    } else {
      ctx.filter = `brightness(0.5)`
      data = "terrain disadvantage"
    }

    
    draw_icon_text(x,y+distance_b_icon,size,data,144);
    distance_b_icon +=30;
  };
  

  const frostbite = grid[i+20];
  if (frostbite > 0) {
    data = "frostbite: " + frostbite;
    draw_icon_text(x,y+distance_b_icon,size,data,96);
    distance_b_icon +=30;
  };

  const poison = grid[i+21];
  if (poison > 0) {
    data = "poison: " + poison;
    draw_icon_text(x,y+distance_b_icon,size,data,120);
    distance_b_icon +=30;
  };






};




function draw_icon(x,y,distance,type) {
  x += 40 
  y -= 40

  let size = 30;
  if (distance > 0) {
    size = 50-distance/2;
  };
  //icon size = 24
  let data
  data = summonsData[type*num_attributes_data]; // name
  draw_icon_text(x-24,y-24,size,data,-24);

  const hp = summonsData[type*num_attributes_data+1];
  


  data = summonsData[type*num_attributes_data+5]; // sc = summon cost
  let current_sp = player_king[1];
  if (data > current_sp) {
    ctx.filter = `brightness(0.4)`;
  }
  data = data + "/" + current_sp; // cost over amount of sp left
  draw_icon_text(x,y,size,data,48);


  if (hp !== 0) {
    
    data = summonsData[type*num_attributes_data+1]; // hp
    draw_icon_text(x,y+24,size,data,0);
    data = summonsData[type*num_attributes_data+2]; // attack
    draw_icon_text(x,y+48,size,data,24);
    data = summonsData[type*num_attributes_data+3]; // range
    draw_icon_text(x,y+70,size,data,70);
    data = summonsData[type*num_attributes_data+6]; // description
    draw_icon_text(x,y+94,size,data,-24);
  } else {
    data = summonsData[type*num_attributes_data+2]; // attack
    draw_icon_text(x,y+48,size,data,-24);
    data = summonsData[type*num_attributes_data+3]; // range
    draw_icon_text(x,y+70,size,data,-24);
    data = summonsData[type*num_attributes_data+6]; // description
    draw_icon_text(x,y+94,size,data,-24);
  }

  


};

function draw_icon_text(x,y,size,data,icon) {
  ctx.drawImage(images.icons,icon,0, 24, 24, x-size/2, y-size/2, size, size);
  
  ctx.font = `${size * 0.5}px Myfont`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  ctx.lineWidth = 4;            // outline thickness
  ctx.strokeStyle = 'black';    // outline color
  ctx.strokeText(data, x + size / 2 + 4, y); // draw outline

  ctx.fillStyle = 'white';      // fill color
  ctx.fillText(data, x + size / 2 + 4, y);   // draw text

  ctx.filter = `none`;
};


function update_end_turn_button() {
  const x = 980-camerax;
  const y = 440-cameray;
  let size = 154;
  if (turn == 1) {
    const distance = getDistance(mouseX,mouseY,x,y);
    if (distance < 60) {
      size = 160 -distance/4;
      ctx.drawImage(images.button,154,0, 154, 154, x-size/2, y-size/2, size, size);
      if (over_button == false) {
        over_button =true;
        play_sfx(gameSounds.over_button_sfx);
      };
    }else {
      ctx.drawImage(images.button,0,0, 154, 154, x-size/2, y-size/2, size, size);
      if (over_button == true) {
        over_button =false;
      };
    };

    
  } else {
    ctx.drawImage(images.button,308,0, 154, 154, x-size/2, y-size/2, size, size);
  };
  
};

function draw_hand() {
  hoveredToken = null
  for (let i = 0; i < hand.length; i += num_attributes_token) {
      const image = images.token;
      const x = i;
      const y = 800;
      let size = hand[i + 1]*zoom;
      let type = hand[i + 2];
      let current_x_array_index = hand[i + 3];
      

      //make this an index in the array so you can change deppending on which token it is
      let frame_location_x = 96 + type*96; //set the token image according to summon data
      let frame_location_y = 0;




      let offsetx = 420 - 46*(hand.length/num_attributes_token-1)*zoom;
      let distance_between_tiles = 26*zoom;


      let current_x = hand[i + 3] ?? (x * distance_between_tiles + boardx + offsetx);
      current_x += ((x * distance_between_tiles + boardx + offsetx) - current_x) * 0.1;
      hand[i + 3] = current_x;
      let draw_x = current_x;
      let draw_y = y;

      let distance = getDistance(draw_x, draw_y, rawmouseX, rawmouseY);
      if (distance < 32) {
        hand[i + 1] = token_size +16 - distance/2;
        hoveredToken = { image, frame_location_x ,frame_location_y , draw_x, draw_y, size: hand[i + 1]*zoom, size: hand[i + 1]*zoom,i,distance};
        let current_tile = x+y;
        if (last_hovered_token !== current_tile) {
          play_sfx(gameSounds.tile_change_sfx);
          last_hovered_token = current_tile;
        };
        continue;
    } else {
        tile_brightness = 1;
        hand[i + 1] = token_size;
    };


    ctx.drawImage(image, frame_location_x, frame_location_y, 92, 92, draw_x - size / 2, draw_y - size / 2, size, size);


  }
  if (hoveredToken) {
    tile_brightness = 2
    const draw_x = hoveredToken.draw_x;
    const draw_y = hoveredToken.draw_y;
    ctx.filter = `brightness(${tile_brightness})`;
    let frame_size = 92;
    
    ctx.drawImage(
        hoveredToken.image,
        hoveredToken.frame_location_x,
        hoveredToken.frame_location_y,
        frame_size,
        frame_size,
        draw_x - hoveredToken.size / 2,
        draw_y - hoveredToken.size / 2,
        hoveredToken.size,
        hoveredToken.size
    );
    draw_icon(draw_x, draw_y, hoveredToken.distance,hand[hoveredToken.i+2]);
    ctx.filter = 'none';
  } else {
    last_hovered_token = null
  }  
};

function check_closer_tiles(selected_x, selected_y, range) {
  for (let i = 0; i < grid.length; i += num_attributes_tile) {
    let grid_x = grid[i + 1];
    let grid_y = grid[i + 2];
    let available = grid[i + 11];

    // Calculate Manhattan distance
    let distance = getDistanceNonEu(selected_x, selected_y, grid_x, grid_y);

    // Block tiles outside the range
    if (distance > range) {
      grid[i + 11] = false;
    } else if (grid[i + 6] == -1) {
      // Check for labyrinth tiles in the path
      let pathBlocked = false;

      // Determine the direction of movement
      let dx = Math.sign(grid_x - selected_x);
      let dy = Math.sign(grid_y - selected_y);

      // Traverse the path to the current tile
      let current_x = selected_x;
      let current_y = selected_y;

      while (current_x !== grid_x || current_y !== grid_y) {
        current_x += dx;
        current_y += dy;

        // Find the tile at the current position
        for (let j = 0; j < grid.length; j += num_attributes_tile) {
          if (grid[j + 1] === current_x && grid[j + 2] === current_y) {
            // Check if the tile is a labyrinth (domain = 7)
            if (grid[j + 19] === 7) {
              pathBlocked = true;
              break;
            }
          }
        }

        if (pathBlocked) break;
      }

      // Mark the tile as unavailable if the path is blocked
      if (pathBlocked) {
        grid[i + 11] = false;
      } else {
        grid[i + 11] = true;
      }
    }
  }
};


function startSummoning(tile,power) {


  for (let i = 0; i < grid.length; i += num_attributes_tile) {
    // wave = grid[i + 12];
    let this_x = grid[i +1];
    let this_y = grid[i +2];
    let tile_x = grid[tile +1];
    let tile_y = grid[tile +2];


    grid[i + 12] =-getDistance(this_x,this_y,tile_x,tile_y)*power;
    grid[i + 13] =0.1; // start the wave


  };
};



function draw_tiles() {
  hoveredTile = null
  in_attack_motion = false;
  for (let i = 0; i < grid.length; i += num_attributes_tile) {
    let image = grid[i];
    let x = grid[i + 1];
    let y = grid[i + 2];
    let width = 64;
    let height = 64;
    let selected = grid[i + 5];
    let summon_id = grid[i + 6];
    let summon_type = grid[i + 7];
    let summon_x_offset = grid[i + 8];
    let summon_y_offset = grid[i + 9];
    let summon_animation = grid[i + 10];
    let available = grid[i + 11];
    let wave = grid[i + 12];
    let wave_trying_to_reach_zero = grid[i + 13];
    let summon_hp = grid[i +14];
    let summon_taken_damage = grid[i +15];
    let tile_type = grid[i + 19];

    

    let frame_location_x = tile_type*64;
    let frame_location_y = 0;

    let offsetx = 100;
    let offsety = 84;
    let distance_between_tiles = 4;

    let draw_x = x * (tilewidth + distance_between_tiles) + boardx + offsetx-camerax;
    let draw_y = y * (tileheight + distance_between_tiles) + boardy + offsety-cameray;

    //do the wave effect
    const min_wave = 0; // has to be zero
    const max_wave = 20;
    let wave_speed = 0.2;


    if (wave_trying_to_reach_zero !== 0) {
      if (wave_trying_to_reach_zero > 0) {

        if (wave < max_wave) {
          grid[i + 13] += wave_speed //this is speed now
          grid[i+12] +=wave_trying_to_reach_zero;
        } else {
          grid[i + 13] = -wave_speed; //now it will try to reach zero and stop the wave
        }
      } else {
        if (wave > 0) {
          grid[i + 13] -= wave_speed //this is speed now
          grid[i+12] +=wave_trying_to_reach_zero;
        } else {
          grid[i + 13] = 0; //now it will try to reach zero and stop the wave
        }
      }
    };



    if (rawmouseY < 750 && target_tile == -1) {
      let distance = getDistance(draw_x, draw_y, mouseX, mouseY);

      if (distance < 32) {
        size = tilewidth +10 - distance/4;
        hoveredTile = {
          image,
          frame_location_x,
          frame_location_y, 
          draw_x, 
          draw_y, 
          width: size, 
          height: size,
          i,
          summon_animation,
          selected,
          distance,
          summon_id,
          summon_type,
          summon_x_offset,
          summon_y_offset};
        let current_tile = x+y;
        if (last_hovered !== current_tile) {
          play_sfx(gameSounds.tile_change_sfx);
          last_hovered = current_tile;
        }
        continue;
      };
    };

    if (cursor.length > 0 && summon_id == -1) {
      if (summonsData[cursor[4]*num_attributes_data+1] !==0 && player_king[5] == false) {
        let distance_to_king = getDistance(grid[i +1],grid[i +2],grid[player_king[3] +1], grid[player_king[3] +2])
        const domain = find_domain(player_king[3]);
        let range = 2;
        if (domain > 1) {
          distance_to_king = getDistanceNonEu(grid[i +1],grid[i +2],grid[player_king[3] +1], grid[player_king[3] +2])
          range += 1; //add 2 to the range if the summon is in its domain
        };
        if (distance_to_king < range) {
          wave = 8
        };
      }
    };

    tile_brightness = 1+ wave/8

    
    
    
    ctx.filter = `brightness(${tile_brightness}) hue-rotate(${tile_brightness*50-50}deg)`;
    //ctx.filter = `hue-rotate(90deg)`;
    ctx.drawImage(image,frame_location_x,frame_location_y,64,64, draw_x - (width+wave+hovering_effect) / 2, draw_y - (height+wave+hovering_effect) / 2, width+wave+hovering_effect, height+wave+hovering_effect);
    ctx.filter = `none`;
    if (selected) {

      let frame_location_x = 100*animations[find_animation(3, i, true, global_animation_speed, 6)];
      let frame_location_y = 0
      // ctx.drawImage(images.sprites, draw_x - width / 2, draw_y - height / 2, width, height);
      distance = 0
      ctx.drawImage(
        images.sprites,
        frame_location_x,
        frame_location_y+100,
        100,
        100,
        draw_x - 40 - distance / 2,
        draw_y - 44 - distance / 2,
        80 + distance,
        80 + distance
      );

      if (summon_id > -1) {
        //there is a summon and here you must show the player how far can it move in the grid
        //check_closer_tiles(x,y,2);
        grid[i + 11] = false; //check this off so the highlight doesn't appear on the tile
      };
    } else if (grid[i +11] == true) {
      draw_gradient(draw_x, draw_y);
    };
    if (summon_id > -1) {
      //red glow if foe
      
      draw_summonsv1(draw_x,draw_y,0,i);
    };

  }

    
};

function draw_hovertile() {
  if (hoveredTile) {
    tile_brightness = 2
    const draw_x = hoveredTile.draw_x;
    const draw_y = hoveredTile.draw_y;
    ctx.filter = `brightness(${tile_brightness})`;
    let frame_size = 64;
    let frozen = grid[hoveredTile.i+20];

    ctx.drawImage(
        hoveredTile.image,
        hoveredTile.frame_location_x,
        hoveredTile.frame_location_y,
        frame_size,
        frame_size,
        hoveredTile.draw_x - hoveredTile.width / 2,
        hoveredTile.draw_y - hoveredTile.height / 2,
        hoveredTile.width,
        hoveredTile.height
    );
    const distance = hoveredTile.distance/3- 20;
    if (hoveredTile.selected) {
      const frame_location_x = 100*animations[find_animation(3, hoveredTile.i, true, global_animation_speed, 6)];
      const frame_location_y = 0;
      // ctx.drawImage(images.sprites, draw_x - width / 2, draw_y - height / 2, width, height);
      ctx.drawImage(
        images.sprites,
        frame_location_x,
        frame_location_y+100,
        100,
        100,
        draw_x - 40 + distance / 2,
        draw_y - 44 + distance / 2,
        80 - distance,
        80 - distance
      );
      if (hoveredTile.summon_id > -1 && grid[hoveredTile.i +16] == false && frozen <= 0) {
        //checking if summon has already moved
        //there is a summon and here you must show the player how far can it move in the grid
        let summon_range = summonsData[grid[hoveredTile.i+7]*num_attributes_data+3];
        const domain = find_domain(hoveredTile.i);
        if (domain > 1) {
          summon_range = 2; //add 2 to the range if the summon is in its domain
        };

        check_closer_tiles(grid[hoveredTile.i + 1],grid[hoveredTile.i + 2],summon_range);
        grid[hoveredTile.i + 11] = false; //check this off so the highlight doesn't appear on the tile
      };
    };
    if (hoveredTile.summon_id > -1) {
      draw_summonsv1(draw_x, draw_y, distance, hoveredTile.i);

      draw_summon_icon(draw_x,draw_y,distance,grid[hoveredTile.i+7],hoveredTile.i)
    };



    


    ctx.filter = 'none';
  } else {
    last_hovered = null
  }
}

function animationTick() {
  
  for (let i = animations.length -num_attributes_animation; i >= 0; i-= num_attributes_animation) {
    const frame = animations[i];
    const duration = animations[i+1]; 
    const id = animations[i+2]; //i use this to identify what entity this animation belongs to
    const loop = animations[i+3];
    const tick = animations[i+4];
    const tick_speed = animations[i+5];


    if (tick < 1) {
      animations[i+4] = global_animation_speed
      if (frame < duration){
        animations[i] += 1
      } else if (loop == true) {
        animations[i] = 0
      } else {
        animations[i+5] = 20; //this means that the animation has ended, will keep setting the tick to a negative number, waiting for the code to delete it
        //make it so the owner of the animation splieces the animation instead
        //so even if there is frame-rate drops the code can catch the animation end
      }
      
    }
    animations[i+4] -= tick_speed;
  }
};

function check_if_animation_exists(animation_id) {
  
  for (let i = animations.length -num_attributes_animation; i >= 0; i-= num_attributes_animation) {
    const current_animation_id = animations[i+2]; 
    if (current_animation_id == animation_id) {
      return i;
    };
  };
  return null;
}

function find_animation(duration_of_animation,identifitcation,loop,tick,tick_speed) {
  const animation_index = check_if_animation_exists(identifitcation)
  if (animation_index == null) {
    animations.push(0,duration_of_animation,identifitcation,loop,tick,tick_speed)
    return animations.length - num_attributes_animation; //this is the index?
  } else {
    return animation_index
  }  
}


function make_summon(x, y, id, frame_location_x, frame_location_y,summon_type) {
  summons.push(x, y, id, frame_location_x, frame_location_y, summon_type);
  id_generator += 1;
  
  summonIndices = [];
  for (let i = 0; i < summons.length; i += num_attributes_summon) {
    summonIndices.push(i);
  }

  summonIndices.sort((a, b) => summons[a + 1] - summons[b + 1]);
}


for (let i = 0; i < summons.length; i += num_attributes_summon) {
  summonIndices.push(i);
}

summonIndices.sort((a, b) => {
  return summons[a + 1] - summons[b + 1];
});

function draw_cursor_token() {
  if (cursor.length > 0){
    const image = cursor[0];
    const x = 0;
    const y = 0;
    let size = cursor[1];
    let mouse_x_var = cursor[2];
    let mouse_y_var = cursor[3];
    let type = cursor[4];
    
    //make this an index in the array so you can change deppending on which token it is
    let frame_location_x = 96 + type*96; //set the token image according to summon data location
    let frame_location_y = 0;




    let offsetx = 420 - 46*(hand.length/num_attributes_token-1);
    let offsety = 800;
    let distance_between_tiles = 4;

    let draw_x = x * (token_size + distance_between_tiles) + boardx + offsetx;
    let draw_y = y * (token_size + distance_between_tiles) + boardy + offsety;

    size *=zoom

    if (cursor[1] < token_size){
      if (token_size -2 < cursor[1]) {
        cursor[2] = rawmouseX;
        cursor[3] = rawmouseY;
      }
      // if it's smaller than a token keep making it even smaller
      cursor[1] -= 6; // keep decreasing the size of the cursor token
      

      const old_mouse_x = cursor[2];
      const old_mouse_y = cursor[3];


      ctx.drawImage(image, frame_location_x, frame_location_y, 92, 92, old_mouse_x - size / 2, old_mouse_y - size / 2, size, size);
      if (cursor[1] < 10) {
        cursor = [];
      };
    } else {
      const draw_with_cursorx = rawmouseX;
      const draw_with_cursory = rawmouseY;

      ctx.drawImage(image, frame_location_x, frame_location_y, 92, 92, draw_with_cursorx - size / 2, draw_with_cursory - size / 2, size, size);
      draw_icon(draw_with_cursorx, draw_with_cursory, 0,type);
    }

    



    
    
  };

  

  
};

function updateMouseWorldPosition() {
  const rect = canvas.getBoundingClientRect();
  mouseX = (rawmouseX - rect.left) * (canvas.width / rect.width);
  mouseY = (rawmouseY - rect.top) * (canvas.height / rect.height);
};


function delete_summon(index) {
  grid[index + 6] = -1;
  grid[index + 7] = -1;
  grid[index + 8] = 0;
  grid[index + 9] = 0;
  grid[index + 10] = 0; // animation y
  grid[index + 14] = 0; // health
  grid[index + 15] = 0;  //damage animation
  grid[index +16] = true; //moved
  grid[index +17] = true; //attacked
  grid[index +18] = false; //foe
  grid[index +20] = 0; //frozen
  grid[index +21] = 0; //poison
}


function draw_summonsv1(x,y,distance,index) {
  let summon_x_offset = grid[index + 8];
  let summon_y_offset = grid[index + 9];
  let id = grid[index + 6];
  let summon_type = grid[index + 7];
  let summon_animation = grid[index + 10];
  let frame_location_x = 0;
  let frame_location_y = 0;
  let summon_hp = grid[index +14];
  let summon_taken_damage = grid[index +15];
  let summon_moved = grid[index +16];
  let summon_attacked = grid[index +17];
  let foe = grid[index +18];
  let frozen = grid[index +20];
  let poison = grid[index +21];
  let electrified = grid[index +22];
  



  frame_location_y = 100*summonsData[(summon_type*num_attributes_data)+4]; // set to the idle animation according to the summon type in summon data;
  frame_location_x += 100*animations[find_animation(5,id,true,global_animation_speed,2)]; 

  if (frozen) {
    grid[index + 16] = true; // set to moved
    grid[index + 17] = true; // set to attacked 
    frame_location_x = 0; // set to the frozen animation according to the summon type in summon data;
  }


  let this_hue = 1;
  if (summon_taken_damage >0) {
    in_attack_motion = true; // is battling
    if (summon_taken_damage == 1) {
      // if (grid[tile_selected+18] == true) {
      //   turn = -2
      // }; // if foe return to their turn
      target_tile = -1; // at the very end of this whole shbong, just return player input
      grid[tile_selected + 5] = false; //find the selected tile and deselect it
      tile_selected = -1;
      check_closer_tiles(0,0,-1); //undo the range visuals
    }
    //if any summon takes damage do the damage animation thingy that's not really an animation
    summon_x_offset += summon_taken_damage * (Math.random() * 2 - 1);
    summon_y_offset += summon_taken_damage * (Math.random() * 2 - 1);
    this_hue = 1+summon_taken_damage;
    textParticles.push( x+summon_x_offset, y+summon_x_offset, 30, (Math.random() - 0.5) * 4, -2, 1, -1, 0);

    grid[index +14] -=1 //decrease hp
    grid[index +15] -=1 //get the damage animation back to zero
    if (electrified > 1) {
      grid[index +22] -=1;
      //electrify everything else
      for (let l=0; l<grid.length; l+=num_attributes_tile) {
        const this_distance = getDistance(grid[index+1],grid[index+2],grid[l+1],grid[l+2]);
        if (this_distance < 2 && grid[l+22] <1 && grid[l+6] !== -1 && player_king[3] !== l && enemy_king[3] !== l) {
          grid[l+22] = electrified;
        }
      }
    }

    if (grid[index +14] < 1) {
      target_tile = -1;
      grid[index +14] = -11; // set health negative to start the death animation
      grid[index +15] = 0; // stop the damage animation
    }
  } else if (grid[index +14] < -10) {
    this_hue = -grid[index +14];
    summon_x_offset += grid[index +14] * (Math.random() * 2 - 1);
    summon_y_offset += grid[index +14] * (Math.random() * 2 - 1);
    createDeathParticles(x+summon_x_offset, y+summon_x_offset,color = "white");
    grid[index +14] -=1
    if (grid[index +14] < -20) {
      // if (grid[tile_selected+18] == true) {
      //   turn = -2
      // }; // if foe return to their turn
      if (index == player_king[3]) {
        player_king[5] = true; // king died
      }
      if (index == enemy_king[3]) {
        enemy_king[5] = true; // king died
      }
      play_sfx(gameSounds.death_sfx);
      //delete the summon here
      delete_summon(index);

    };
  };




  // idle animation
  // for the summon1 iddle animation is y=0
  // and arrival animation is y=2

  //make a function to store the if statements for the animation to each summon
  if (target_tile !== -1 && tile_selected == index) {
    //if there is a battle going on && this is battling something
    const difference_x = grid[target_tile+1]-grid[tile_selected+1]; //positive when attacking rightwards
    const difference_y = grid[target_tile+2]-grid[tile_selected+2]; //positive when attacking downwards
    let multiplier = grid[target_tile +15]
    if (multiplier > 10) {
      summon_x_offset += difference_x*10;
      summon_y_offset += difference_y*10;
    } else {
      summon_x_offset += difference_x*multiplier;
      summon_y_offset += difference_y*multiplier;
    }
    
  }



  

  



  let draw_x = x + summon_x_offset;
  let draw_y = y + summon_y_offset;


  //ctx.filter = `drop-shadow(0 0 10px red)`;

  //if ally set this to zero
  if (foe == 1) {
    this_hue *= find_domain(index);
    ctx.filter = `brightness(${this_hue}) drop-shadow(0 0 2px red)`;
  } else if (foe == -1) {
    this_hue *= find_domain(index);
    ctx.filter = `brightness(${this_hue}) drop-shadow(0 0 2px white)`;
  } else {
    ctx.filter = `brightness(${this_hue})`;
    this_hue *= find_domain(index);
    
  };
  
  //ctx.filter = `hue-rotate(${this_hue}deg)`;
  ctx.drawImage(
    images.sprites, 
    frame_location_x, 
    frame_location_y, 
    100, 
    100, 
    draw_x-40+distance/2, 
    draw_y-50+distance/2, 
    80-distance, 
    80-distance
  );
  ctx.filter = 'none';
  if (player_king[0] == id || enemy_king[0] == id) {
    draw_king(draw_x,draw_y,distance,id);
  };
  if (frozen > 0) {
    ctx.drawImage(images.sprites, 500, 1000, 100, 100, draw_x-40+distance/2, draw_y-40+distance/2, 80-distance, 80-distance); 
  }
  if (poison > 0) {
    ctx.drawImage(images.sprites, frame_location_x, 1200, 100, 100, draw_x-40+distance/2, draw_y-40+distance/2, 80-distance, 80-distance); 
  }
  if (electrified > 1) {
    if (summon_taken_damage < 1) {
      grid[index +15] = electrified;
      play_sfx(gameSounds.spark_sfx);
    };
    ctx.drawImage(images.sprites, frame_location_x, 1600, 100, 100, draw_x-40+distance/2, draw_y-40+distance/2, 80-distance, 80-distance); 
  }
  
  
}

function draw_king(draw_x,draw_y,distance,id) {
  //do the crown here
  const frame_x = 100*animations[find_animation(5,-2,true,global_animation_speed,6)];
  ctx.drawImage(
    images.sprites, 
    frame_x, 
    700, 
    100, 
    100, 
    draw_x-40+distance/2, 
    draw_y-70+distance/2, 
    80-distance, 
    80-distance
  ); 


  
}

let timer = 100   //set a limit of time for the bot to do it's thing in case it gets stuck :(

function fightSetup() {
  if (timer > 0) {
    timer -= 1;
  } else {
    timer = 100;
    let random_column = Math.floor(Math.random() * 41); // 0 to 40 inclusive
    const random_tile = random_column*num_attributes_tile;
    if (grid[random_tile+6] == -1) {
  
      id_generator += 1
      
      const type = starting_foes[0];
      if (summonsData[type*num_attributes_data+1] !== 0) {
        foes.push(random_tile);
        centerCameraOnTile(random_tile);
        summon_thing(type,id_generator,random_tile,1);       
      }
      starting_foes.splice(0,1);
    };
    if (starting_foes.length == 0) {
      turn = 1; //player's turn
      
    }
  }; // change turn if timer reaches 0
 
};


function runDialog() {
  if (turn_count == 2 && dialog_trigger == false) {
    dialogFetch();
    dialog_trigger = true;
  };
};


function run_enemy_turn () {
  
  if (turn == -9) {
    if (timer > 0) {
      timer -= 1;
    } else if (!in_attack_motion && movingSummons.length == 0){
      turn = -2;
      timer = 10;
    }; // change turn if timer reaches 0
  }
  

  if (turn == 0) {
    ResetAllThings();
    
  } 
  
  if (scene_index !== 0) {
    runDialog();
  }



  //now do the ai stuff
  if (turn > -9 && target_tile == -1) {
    runEnemyLogic();
  }
  







  if (turn == -10 || foes.length == 0 || turn == -2) {
    turn = 1; // give the turn bacc to the player once the bot is
    
  }
  if (foes.length == 0) {
    play_sfx(gameSounds.victory_sfx);
    // All enemies are defeated, end the battle
    battle_over = true;
  };
}


function centerCameraOnTile(tile) {
  const tileX = grid[tile + 1]; // Grid x-coordinate
  const tileY = grid[tile + 2]; // Grid y-coordinate

  // Convert to canvas coordinates (based on your movement logic)
  const targetX = tileX * 68 +boardx - 480; // Center of the tile
  const targetY = tileY * 68 +boardy - 340; // Center of the tile


  // Calculate camera position to center the tile on the canvas
  camerax = targetX
  cameray = targetY 

  // Optionally set a target zoom level for better visibility
  targetZoom = 2; 
  mouseX = targetX;
  mouseY = targetY;
  zoom = targetZoom;

  // Ensure camera stays within bounds
  applyCameraBounds();
}

function runEnemyLogic() {
  for (let i = 0; i < foes.length; i++){

    let foeIndex = foes[i];
    if (foeIndex== enemy_king[3] && enemy_king[5] == false) {grid[foeIndex+16] = true} //don't move the king in this ai version

    let target = player_king[3]; //target
    if (player_king[5] == true) {
      let distance = 100; // big number
      target = 0;
      for (let g = 0; g < grid.length; g += num_attributes_tile) {
        if (grid[g+6] !== -1) {
          if (g !== foeIndex && grid[g+18] >= 0) { // attack neutral enemies too
            //it's a player summon for sure
            const this_distance = getDistance(grid[g+1],grid[g+2],grid[foeIndex+1],grid[foeIndex+2])
            if (this_distance < distance) {
              target = g;
              distance = this_distance
            };
          };
        };
      };
    };


    //try attacking
    if (grid[foeIndex+17] == false) {
      target_tile =-1;
      let king_found = -1;
      for (let g = 0; g < grid.length; g += num_attributes_tile) {
        const distance = getDistance(grid[g+1],grid[g+2],grid[foeIndex+1],grid[foeIndex+2])
        if (distance < 2) {    
          if (grid[g+6] !== -1 && grid[g+18] <= 0) {
            target_tile = g;
            if (player_king[5] == false && player_king[3] == g) {
              king_found = g; // this is the king   
            };
          };
        };
      };
      if (king_found !== -1) {
        //it's a summon and it's from the player
        grid[tile_selected+5] = false;
        target_tile = king_found;
        tile_selected = foeIndex;
        grid[tile_selected+17] = true;
        grid[foeIndex+17] = true; // has attacked
        attackStart();
        turn = -9
        break;
      };
      if (target_tile !== -1) {
        //it's a summon and it's from the player
        grid[tile_selected+5] = false;
        tile_selected = foeIndex;
        grid[tile_selected+17] = true;
        grid[foeIndex+17] = true; // has attacked
        attackStart();
        turn = -9
        break;
      };
    };
    
    turn = -2; // means no summons can move
    if (grid[foeIndex+16] == false) {
      turn = -3; // this summon can move
      // can move
      //select it
      if (tile_selected !== -1) {
        //deselect previous tile
        grid[tile_selected+5] == false;
      }

      let distance = getDistance(grid[target+1],grid[target+2],grid[foeIndex+1],grid[foeIndex+2]);
      

      const summon_range = summonsData[grid[foeIndex+7]*num_attributes_data+3];
      check_closer_tiles(grid[foeIndex+1],grid[foeIndex+2],summon_range);




      
      //decide direction
      target_tile =-1;
      let best_tile_distance = 100; 
      for (let g = 0; g < grid.length; g += num_attributes_tile) {
        if (grid[g+6] == -1) {
          if (grid[g + 11] == true) {
            const this_distance = getDistance(grid[target+1],grid[target+2],grid[g+1],grid[g+2]);
            if (this_distance < best_tile_distance) {
              best_tile_distance = this_distance;
              target_tile = g;
            };
          };
        };

      };

      
      check_closer_tiles(0,0,-1); //disable range, no longer needed


      if (target_tile !== -1) {
        //foes_visited_tiles.push(target_tile); // add the tile to the visited tiles
        tile_selected = foeIndex
        grid[foeIndex+5] = true

        grid[tile_selected+16] = true; // can only move once
        let startX = grid[tile_selected+1]*68 + boardx + 80;
        let startY = grid[tile_selected+2]*68 + boardy + 84;
        let targetX = grid[target_tile+1]*68 + boardx + 80;
        let targetY = grid[target_tile+2]*68 + boardy + 84;


        foes[i] = target_tile;


        startSummonMovement(tile_selected, startX, startY,targetX, targetY)
        grid[tile_selected + 5] = false
        //after moving one enemy, wait for the movement to end
      
        turn = -9; // change this back to -2 to try some more
        break;
        //break because you got to wait for the movement to end
      } else {
        //try attacking the king if possible, if not just set moved to true
        grid[foeIndex+16] = true;
      }


    };
    
  };

}


function ResetAllThings() {
  turn_count++

  player_input.x = 0;
  player_input.y = 0;
  //restart the foe list just in case
  foes = [];
  for (let i = 0; i < grid.length; i += num_attributes_tile) {
    //turn things electrifyable again
    grid[i+22] = 0;

    if (grid[i+18] == 1){
      foes.push(i);
    };
    if (grid[i+20] > 0) {
      grid[i+20] -= 1;
    } else if (grid[i+7] !== 7 && grid[i+19] !== 7) { //if it's not a wall, recover movement
      grid[i+16] = false; //can move again
      grid[i+17] = false; //can attack again
    } else {
      grid[i+16] = true; //walls can't move
      grid[i+17] = true; //walls can't attack
    };
    
  };

  grid[tile_selected + 5] = false;
  tile_selected = -1;
  target_tile = -1;

  

  // draw a card
  // ------------------- CARD DRAW HERE -----------------------------
  for (let i = 0; i < player_king[7]; i++) {
    //draw the amount of cards that the king allows
    if (hand.length < 4*num_attributes_token) {
      //there will be a king thing about this
      hand.push(images.token,token_size,deck[deckIndex],0);
      deckUpdate();
    }
  }
  
  


  //at the start of the enemy's turn only
  grid[tile_selected+5] = false
  tile_selected = -1 //setup before starting
  check_closer_tiles(0,0,-1)




  player_king[1] += player_king[6] //sp gain per turn
  if (player_king[1] > player_king[2]) {
    // if it got more than the max reduce to MAX
    player_king[1] = player_king[2]; // set the player's summon power to max
  }
  enemy_king[1] += enemy_king[6] //sp gain per turn
  if (enemy_king[1] > enemy_king[2]) {
    // if it got more than the max reduce to MAX
    enemy_king[1] = enemy_king[2]; // set the player's summon power to max
  }
  animations = []; //reset the animation queue so there isn't any unused animation left.
  
  
  //deck stuff to draw an summon stuff
  if (foes.length < 10 && enemy_king[5] == false && summonsData[enemy_deck[enemyDeckIndex]*num_attributes_data+5] <= enemy_king[1]) {
    let distance_to_player = 200;
    let summon_tile = -1;
    for (let i = 0; i < grid.length; i += num_attributes_tile) {
      if (grid[i+6] == -1 && grid[i+19] !== 7) {
        //check if there is a summon in it already
        let distance = getDistance(grid[enemy_king[3]+1],grid[enemy_king[3]+2],grid[i+1],grid[i+2]);
        if (distance < 2) {
          //check if it's in range
          player_distance = getDistance(grid[player_king[3]+1],grid[player_king[3]+2],grid[i+1],grid[i+2]);
          if (player_distance < distance_to_player) {
            //check if this tile is closer tothe player than the previous
            distance_to_player = player_distance;
            summon_tile = i;
          };
        };
      };
    };
    if (summon_tile !== -1) {
      //summon a summon for the enemy
      // if there is no summon in the chosen tile, proceed
      id_generator += 1
      const type = enemy_deck[enemyDeckIndex];
      enemy_king[1] -= summonsData[enemyDeckIndex*num_attributes_data+5]
      
      if (summonsData[type*num_attributes_data+1] !== 0) {
        foes.push(summon_tile);
        summon_thing(type,id_generator,summon_tile,1);
        turn = -9.
      } else {
        //do some magic
        // find the best target of all time :D
        enemyCastSpell(type);
        if (turn !== -9) {
          //if couldn't cast the spell just update the deck
          console.log("couldn't cast the spell bruv")
          enemyDeckUpdate();
        }

      };

      enemyDeckUpdate(type);
    };
    
  };
}

function enemyCastSpell(type) {
  let spell_animation = summonsData[type * num_attributes_data+4];  
  let spell_range = summonsData[type * num_attributes_data+8]; // Spell range
  let best_target = -1;
  let best_target_damage = 0;
  for (let t = 0; t < grid.length; t += num_attributes_tile) {
    let total_damage = 0;
    for (let i = 0; i < grid.length; i += num_attributes_tile) {
      const distance = getDistanceNonEu(grid[i+1],grid[i+2],grid[t+1],grid[t+2]);

      if (distance < spell_range) {
        if (grid[i+6] !== -1) { //can't be a foe
          //only deal damage if summon exists.
          let damage = 0; // Spell damage
          let frostbite = summonsData[type * num_attributes_data + 10]; // Spell frostbite
          let poison = summonsData[type * num_attributes_data + 11]; // Spell poison
          let domain_multiplier = 0;
          let lightning_damage = summonsData[type * num_attributes_data + 13];

          if (spell_animation !== -1) {
            const multiplier = find_domain(i) //decrease the attacker's buff by the deffender's buff
            if (multiplier !== 0) {
              damage = summonsData[type * num_attributes_data + 7] / multiplier;
            };
          } else {
            const spell_domain = summonsData[type * num_attributes_data+7];
            const domainIndex = summonsData[grid[i+7]*num_attributes_data+7];
            let previous_domain = find_domain(i);
            domain_multiplier += previous_domain -domains[domainIndex*num_attributes_domain+spell_domain];
          };
         
          if (grid[i+18] == -1) {
            //if it's the player's summon
            total_damage += damage + frostbite*10 + poison*10 +domain_multiplier + lightning_damage;
          } else {
            //if it's this enemy's summon
            total_damage -= damage + frostbite*10 + poison*10 +domain_multiplier + lightning_damage;
          }
          
        };
      };
    }; 
    if (total_damage > best_target_damage) {
      best_target_damage = total_damage;
      best_target = t;
    };
  };

  if (best_target_damage > 0) {
    grid[tile_selected+5] = false;
    tile_selected = -1;
    target_tile = best_target;
    turn = -9.
    spell_cast(type);
  };
}



function battle_end() {

  // Display the spoils frame
  const frameX = 200; // Centered horizontally
  const frameY = 200; // Centered vertically
  const frameWidth = 800;
  const frameHeight = 600;

  // Draw the frame
  ctx.drawImage(images.box, 0, 0, 586, 600, frameX, frameY, frameWidth, frameHeight);

  // Display the title
  ctx.font = "30px Myfont";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.fillText("Spoils of Battle", frameX + frameWidth / 2, frameY + 50);

  // Display the defeated enemies
  const itemSize = 96;
  const padding = 20;
  const startX = frameX + padding;
  const startY = frameY + 100;
  const itemsPerRow = Math.floor((frameWidth - 2 * padding) / (itemSize + padding));

  for (let i = 0; i < spoils.length && i < 5; i++) {
    const type = spoils[i];
    const row = Math.floor(i / itemsPerRow);
    const col = i % itemsPerRow;

    const x = startX + col * (itemSize + padding);
    const y = startY + row * (itemSize + padding);

    // Draw the enemy icon
    ctx.drawImage(images.token, 96 + type * 96, 0, 96, 96, x+100, y+120, itemSize, itemSize);
  }

  // Display a message to continue
  ctx.font = "20px Myfont";
  ctx.fillText("Press Enter to continue", frameX + frameWidth / 2, frameY + frameHeight - 30);

  // Wait for the player to press Enter to close the spoils screen
  if (keys.enter) {
    for (let i = 0; i < spoils.length; i++) {
      luggage.push(spoils[i]);
      luggage.push(0);
    };
    spoils = []; // Clear the spoils
    keys.enter = false;
    // Start the fade transition
    fading = true;
    fade_direction = 1; // Start fading out
    fade_callback = () => {
      fight_mode = false; // Exit fight mode
      clearBoard();
      music_change(bgmrpg);
    };
  };
};

let fade_alpha = 0; // Opacity of the black overlay
let fading = false; // Whether the fade transition is active
let fade_direction = 1; // 1 for fade-out, -1 for fade-in
let fade_callback = null; // Function to call after fade-out

function fade_to_black() {
  if (!fading) return;

  // Draw the black overlay
  ctx.fillStyle = `rgba(0, 0, 0, ${fade_alpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update the fade alpha
  fade_alpha += 0.05 * fade_direction;

  if (fade_alpha >= 1 && fade_direction === 1) {
    // Fully faded to black, execute the callback
    if (fade_callback) fade_callback();
    fade_direction = -1; // Start fading back in
  } else if (fade_alpha <= 0 && fade_direction === -1) {
    // Fully faded back in, end the transition
    fading = false;
    fade_alpha = 0;
  }
}


function draw_gradient(x,y) {

  let draw_x = x-40;
  let draw_y = y-40;

  offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
  offscreenCtx.drawImage(images.noise,draw_x-160+gradient_offset ,draw_y-160+gradient_offset , 320, 320);
  // Apply mask
  offscreenCtx.globalCompositeOperation = 'destination-in';
  offscreenCtx.drawImage(images.gradientImage, draw_x, draw_y, 80, 80);
  offscreenCtx.globalCompositeOperation = 'source-over';
  ctx.drawImage(offscreenCanvas, 0, 0);
};


canvas.addEventListener('mousemove', function(event) {
  const rect = canvas.getBoundingClientRect();
  rawmouseX = event.clientX - rect.left;
  rawmouseY = event.clientY - rect.top;

  mouseX = (rawmouseX - canvas.width / 2) / zoom + canvas.width / 2;
  mouseY = (rawmouseY - canvas.height / 2) / zoom + canvas.height / 2;
});



let zoomDelta = 0
window.addEventListener('wheel', function(event) {
  //scrollOffsetX -= event.deltaY; // Invert direction if needed
  const zoomFactor = 0.001;
  targetZoom += -event.deltaY * zoomFactor;

  targetZoom = Math.max(1, Math.min(targetZoom, 2));
  event.preventDefault();
}, { passive: false });



let zoom = 1;
let targetZoom = 1;

function boardDraw() {



  ctx.drawImage(images.bg, -150-(camerax/4), -150-(cameray/4), 1500, 1500);

  ctx.save();
  
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(zoom, zoom);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);
  
  
  ctx.drawImage(images.board, boardx-camerax, boardy-cameray);
  draw_tiles();


  
  
  draw_hovertile();

  updateAndDrawSmokeParticles();
  updateAttackAnimations();
  updateAndDrawTextParticles();
  updateAndDrawDustParticles();
  updateAndDrawMovingSummons();
  updateAndDrawDeathParticles();
  update_end_turn_button();
  updateAndDrawLightnings();

  ctx.restore(); // restore state to normal
  draw_hand();
  draw_cursor_token();
  
  //drawMovementRangeTile(rawmouseX, rawmouseY, 64);



  



}


function applyCameraBounds() {
  const halfCanvasWidth = (canvas.width / 2) / zoom;
  const halfCanvasHeight = (canvas.height / 2) / zoom;

  const minX = -600 +halfCanvasWidth;
  const maxX = 600 - halfCanvasWidth;
  const minY = -550 +halfCanvasHeight;
  const maxY = 550 - halfCanvasHeight;

  const strength = 0.1;

  if (camerax < minX) {
    camerax += (minX - camerax) * strength;
  } else if (camerax > maxX) {
    camerax -= (camerax - maxX) * strength;
  }

  if (cameray < minY) {
    cameray += (minY - cameray) * strength;
  } else if (cameray > maxY) {
    cameray -= (cameray - maxY) * strength;
  }
}

function boardLogic() {
  const previousZoom = zoom;
  const zoomSpeed = 0.1;
  zoom += (targetZoom - zoom) * zoomSpeed;

  camerax += (mouseX-550 + camerax) * (zoom - previousZoom) +player_input.x/ zoom ;
  cameray += (mouseY-500 + cameray) * (zoom - previousZoom) +player_input.y/ zoom ;
  

  if (turn > 0) {
    if (keys.a) {
      player_input.x = -10;
    } else if (keys.d) {
      player_input.x = 10;
    } else if (player_input.x !== 0) {
      player_input.x *= 0.9;
    };
    if (keys.s) {
      player_input.y = 10;
    } else if (keys.w) {
      player_input.y = -10;
    } else if (player_input.y !== 0) {
      player_input.y *= 0.9;
    };
  }
  




  //just increase the gradient offset here for now
  if (gradient_offset > 160) {
    gradient_offset = 0;
  } else {
    gradient_offset += 1;
  };


  if (leaves.length > 0) {
    leaves.splice(0,1);
  } else {
    transitioning = 0
  }



  applyCameraBounds();
  


  if (turn < 1) {
    if (starting_foes.length == 0) {
      run_enemy_turn();
      
    } else {
      fightSetup();
    }
  }

  

  if (keys.enter || keys.space) {
    if (turn == 1 && movingSummons.length == 0 && in_attack_motion == false) {
      keys.enter = false;
      keys.space = false;
      turn = 0; //change turn
      play_sfx(gameSounds.turn_change_sfx);
      // grid.push(images.slot,-1,-1,64,64,false)
    };
  };

  
}



function debug_stuff() {
  if (keys.tab && fight_mode == false) {
    //hand.push(images.token,token_size,0,0);
    startFight();
    keys.tab =false;
    music_change(bgm1);

  } else if(keys.tab) {
    clearBoard();
    keys.tab =false;
    music_change(bgmrpg);
  }
}




//======================================================================================================
//======================================================================================================
//======================================================================================================
//======================================================================================================
//======================================================================================================

const sprites = [
  0, 0, 0,
  32, 0, 0,
  64, 0, 0,
  96, 0, 0,
  128, 0, 0,
  160, 0, 0,
  192, 0, 0, 
  224, 0, 0, 
  256, 0, 3,
  288, 0, 3,
  320, 0, 3,
  352, 0, 0,
  384, 0, 0,
  416, 0, 0,
  448, 0, 0,
  0, 32, 0,
  32, 32, 0,
  64, 32, 0,
  96, 32, 0,
  128, 32, 0,
  160, 32, 0,
  192, 32, 0, 
  224, 32, 0, 
  256, 32, 0,
  288, 32, 0,
  320, 32, 0,
  352, 32, 0,
  384, 32, 0,
  416, 32, 0,
  448, 32, 0,
  0, 64, 0,
  32, 64, 0,
  64, 64, 0,
  96, 64, 0, 
  128, 64, 0, 
  160, 64, 0, 
  192, 64, 0, 
  224, 64, 0, 
  256, 64, 3,
  288, 64, 3,
  320, 64, 3,
  352, 64, 3,
  384, 64, 0,
  416, 64, 0,
  448, 64, 0,
  0, 96, 0, 
  32, 96, 1, //grass
  64, 96, 0, 
  96, 96, 0, 
  128, 96, 0, //wall
  160, 96, 0, 
  192, 96, 0, 
  224, 96, 0, 
  256, 96, 3,
  288, 96, 3,
  320, 96, 3,
  352, 96, 3,
  384, 96, 0,
  416, 96, 0,
  448, 96, 0,
  0, 128, 0, 
  32, 128, 0, 
  64, 128, 0, 
  96, 128, 0, 
  128, 128, 0, 
  160, 128, 0, 
  192, 128, 0, 
  224, 128, 0, 
  256, 128, 3,
  288, 128, 3,
  320, 128, 3,
  352, 128, 3,
  384, 128, 0,
  416, 128, 0,
  448, 128, 0,
  0, 160, 0, 
  32, 160, 0, 
  64, 160, 0, 
  96, 160, 0, 
  128, 160, 0, 
  160, 160, 0, 
  192, 160, 0, 
  224, 160, 1,
  256, 160, 0,
  288, 160, 0,
  320, 160, 0,
  352, 160, 0,
  384, 160, 0,
  416, 160, 0,
  448, 160, 0,
  0, 4, 2, //npc
  0, 5, 2, //instant event
];



const num_things_sprites = 3;
let s_size = 100;
let s_size_half = 64;
let map = [];
let npcs = [];
const num_things_npc = 3;

let debug_bar = false;


const num_things_map = 3;

let map_w = 50;
let map_h = 50;

let coor_x = 1;
let coor_y = 1;

let player_x = 800;
let player_y = 800;

let chosen_tile = 1;

let player_flipped = 0;
let player_walking = 0;

let fullText = 0;

let text_index = 0;
let talking_npc = false;
let npc_portrait = -1;
let starting_fight = 0;

let charIndex = 0;       // Current character being displayed
let charTimer = 0;       // Timer for delay
let charDelay = 2;       // Frames to wait before showing next char (adjust this to speed up/down)

npcs.push(-1, player_x, player_y); // Add player as if it were an NPC

let baseX = 0;
let baseY = 0;

let transitioning = 0;
let transition_tick = 0;

let inventory_open = 0;
let luggage = [];

for (let l = 0; l < 16; l++) {
  luggage.push(l);
  luggage.push(0);
};

let luggage_open = false;

let hovered_card = -1;

let random_encounters = false;
let encounter_steps = 200;

let debug_layer_2 = false;
let debug_mode = false;



function build_map() {
  for (y=0;y<map_h;y++) {
    for (x=0;x<map_w;x++) {
      
      if (x == 0 || x == map_w-1 || y == 0 || y == map_w-1) {
        map.push(49); //wall
        
      } else {
        map.push(46); //grass
      }
      map.push(-1); //second layer
    };
  };
};

function copyTile(sourceX, sourceY, targetX, targetY, multiplier = 1) {
  for (let offsetY = 0; offsetY < multiplier; offsetY++) {
    for (let offsetX = 0; offsetX < multiplier; offsetX++) {
      const sourceIndex = ((sourceX + offsetX) + (sourceY + offsetY) * map_w) * 2;
      const targetIndex = ((targetX + offsetX) + (targetY + offsetY) * map_w) * 2;

      if (
        sourceX + offsetX < 0 || sourceX + offsetX >= map_w ||
        sourceY + offsetY < 0 || sourceY + offsetY >= map_h ||
        targetX + offsetX < 0 || targetX + offsetX >= map_w ||
        targetY + offsetY < 0 || targetY + offsetY >= map_h
      ) {
        continue; // Skip out-of-bounds tiles
      }

      map[targetIndex] = map[sourceIndex]; // Copy first layer
      map[targetIndex + 1] = map[sourceIndex + 1]; // Copy second layer
    }
  }
}


function changeTile(multiplier = 1) {
  const x = Math.floor((rawmouseX + camerax + s_size_half) / s_size) + coor_x;
  const y = Math.floor((rawmouseY + cameray + s_size_half) / s_size) + coor_y;



  for (let offsetY = 0; offsetY < multiplier; offsetY++) {
    for (let offsetX = 0; offsetX < multiplier; offsetX++) {
      const targetX = x + offsetX;
      const targetY = y + offsetY;

      if (targetX < 0 || targetX >= map_w || targetY < 0 || targetY >= map_h) {
        continue; // Skip out-of-bounds tiles
      }

      const baseIndex = (targetX + targetY * map_w) * 2;

      if (debug_layer_2) {
        if (chosen_tile / num_things_sprites == 46) {
          map[baseIndex + 1] = -1; // Clear the second layer
        } else {
          map[baseIndex + 1] = chosen_tile / num_things_sprites; // Set the second layer
        }
      } else {
        map[baseIndex] = chosen_tile / num_things_sprites; // Set the first layer
      }
    }
  }
}

let leaves = [];

function createLeaf() {
  id_generator += 1
  return {
    x: Math.random() * canvas.width,
    y: -100,
    vx: (Math.random() - 0.5) * 10, 
    vy: (Math.random() +0.8) *10,  
    size: 400 + Math.random() * 180,
    img: images.rpg,
    id: id_generator
  };
}


function updateLeaves() {
  for (let leaf of leaves) {
    leaf.x += leaf.vx - (Math.random() - 0.5)*10; 
    leaf.y += leaf.vy + (Math.random() -0.2)*transitioning;


    if (leaf.y > canvas.height && !fight_mode) {
      leaf.y = -leaf.size;
      leaf.x = Math.random() * canvas.width;
    }

    id_generator += 1
    let frame_x = 64*animations[find_animation(7,leaf.id,true,global_animation_speed,4)];

    ctx.drawImage(leaf.img,frame_x,512,64,64, leaf.x-leaf.size / 2, leaf.y-leaf.size / 2, leaf.size, leaf.size);
    ctx.restore();
  }
}

function transition_shit() {

  if (transition_tick < 1) {
    
    transitioning++
    transition_tick = 20 - transitioning;
    
    if (transitioning > 60) {
      fight_mode = true;
      if (transitioning == 70) {
        startFight();
      }
      
    } else {
      leaves.push(createLeaf())
      leaves.push(createLeaf())
      leaves.push(createLeaf())
    }
  } else {
    transition_tick -=10
  };
}

function drawDebugTile() {

  let frame_x = sprites[chosen_tile]
  let frame_y = sprites[chosen_tile+1]


  ctx.filter = `opacity(0.8)`
  ctx.drawImage(images.rpg,frame_x,frame_y,32,32,rawmouseX-s_size/2,rawmouseY-s_size/2,s_size,s_size);
  ctx.filter = `none`
};




function drawMap() {
  s_size_half = s_size/2


  if (camerax> s_size) {
    camerax = 0;
    coor_x +=1
  } else if (camerax < 0) {
    camerax = s_size;
    coor_x -=1
  }
  if (cameray> s_size) {
    cameray = 0;
    coor_y +=1
  } else if (cameray < 0) {
    cameray = s_size;
    coor_y -=1
  }

  for (y=0;y<16;y++) {
    for (x=0;x<21;x++) {

      let base_index = (x + coor_x + (y + coor_y) * map_w) * 2; // Multiply by 2 for two layers
      let sprite = map[base_index]; // First layer
      let second_layer_sprite = map[base_index + 1]; // Second layer



      //let sprite = map[x+coor_x+(y+coor_y)*map_w];



      let frame_x = sprites[sprite*num_things_sprites]
      let frame_y = sprites[sprite*num_things_sprites+1]

      let frame_x_2 = sprites[second_layer_sprite*num_things_sprites]
      let frame_y_2 = sprites[second_layer_sprite*num_things_sprites+1]


      let draw_x =(x)*s_size;
      let draw_y =(y)*s_size;
      let tile_type = sprites[sprite*num_things_sprites+2]
      let tile_type2 = sprites[second_layer_sprite*num_things_sprites+2]

      if (tile_type2 == 2|| tile_type2 == 5) {
        let create_npc = true;
        if (!debug_mode) {
          for (let npc =0; npc < npcs.length; npc += num_things_npc) {
            //change this
            if (second_layer_sprite == npcs[npc]) {
              create_npc = false;
              
            };
          };
          if (create_npc) {
            // 90 is the first npc
            npcs.push(second_layer_sprite,x+coor_x,y+coor_y);
          }
        }
        
        
        second_layer_sprite = 6;  // nog 46 but an invisble tile
        frame_x_2 = sprites[second_layer_sprite*num_things_sprites]
        frame_y_2 = sprites[second_layer_sprite*num_things_sprites+1]
        // sprite = 86;  // nog 46 but an invisble tile
        // frame_x = sprites[sprite*num_things_sprites];
        // frame_y = sprites[sprite*num_things_sprites+1];
      } else if (tile_type == 3) {
        sprite = 46;
        frame_x = sprites[sprite*num_things_sprites];
        frame_y = sprites[sprite*num_things_sprites+1];
      };
      
      ctx.drawImage(images.rpg,frame_x,frame_y,32,32,draw_x-camerax-s_size_half,draw_y-cameray-s_size_half,s_size,s_size);
      ctx.drawImage(images.rpg,frame_x_2,frame_y_2,32,32,draw_x-camerax-s_size_half,draw_y-cameray-s_size_half,s_size,s_size);     
    };
  };
  
};

function drawMapAbove() {
  for (y=0;y<16;y++) {
    for (x=0;x<21;x++) {
      let base_index = (x + coor_x + (y + coor_y) * map_w) * 2; // Multiply by 2 for two layers
      let sprite = map[base_index]; // First layer
      let second_layer_sprite = map[base_index + 1]; // Second layer


      let frame_x = sprites[sprite*num_things_sprites]
      let frame_y = sprites[sprite*num_things_sprites+1]

      let frame_x_2 = sprites[second_layer_sprite*num_things_sprites]
      let frame_y_2 = sprites[second_layer_sprite*num_things_sprites+1]



      let draw_x =(x)*s_size;
      let draw_y =(y)*s_size;
      let tile_type = sprites[sprite*num_things_sprites+2];
      let tile_type_2 = sprites[second_layer_sprite*num_things_sprites+2];

      if (tile_type == 3) {
        ctx.drawImage(images.rpg,frame_x,frame_y,32,32,draw_x-camerax-s_size_half,draw_y-cameray-s_size_half,s_size,s_size);
      };
      if (tile_type_2 == 3) {
        ctx.drawImage(images.rpg,frame_x_2,frame_y_2,32,32,draw_x-camerax-s_size_half,draw_y-cameray-s_size_half,s_size,s_size);
      };
    };
  };
};



function drawNpc() {
  for (let npc =0; npc < npcs.length; npc += num_things_npc) {
    
    const sprite = npcs[npc]
    const x = npcs[npc+1]
    const y = npcs[npc+2]
    
    let draw_x =(x-coor_x)*s_size;
    let draw_y =(y-coor_y)*s_size;

    frame_x = sprites[sprite*num_things_sprites]
    frame_y = sprites[sprite*num_things_sprites+1]



    frame_x += 64*animations[find_animation(7,1,true,global_animation_speed,2)];
    //draw npc
    ctx.drawImage(images.rpg,frame_x,frame_y,64,64,draw_x-camerax-s_size_half,draw_y-cameray-s_size_half,s_size,s_size);
  };


}


function draw_debug_bar() {
  const tilesPerRow = 15;
  const tileSpacing = 64;
  const rowHeight = 64;
  const offsetX = 64;
  const offsetY = 200;

  for (let i = 0; i < sprites.length; i += num_things_sprites) {
    let index = i / num_things_sprites;

    let col = index % tilesPerRow;
    let row = Math.floor(index / tilesPerRow);

    let draw_x = col * tileSpacing + offsetX;
    let draw_y = row * rowHeight + offsetY;

    let frame_x = sprites[i];
    let frame_y = sprites[i + 1];

    let size = 64;
    const distance = getDistance(rawmouseX, rawmouseY, draw_x, draw_y);
    if (distance < 30) {
      chosen_tile = i;
      size = 80 - distance / 4;
      ctx.filter = `brightness(${2 - distance / 20})`;
    } else {
      ctx.filter = `brightness(1)`;
    }

    ctx.drawImage(
      images.rpg,
      frame_x,
      frame_y,
      32,
      32,
      draw_x - size / 2,
      draw_y - size / 2,
      size,
      size
    );
    ctx.filter = `none`;
  }
}







const dialog = [];

let box_text = [
  //max============================================
  "It appears you have done something wrong pal",
  "when this text appears, it means you forgot to",
  "put the new text into the box array, which is",
  "very human of you, but still very uncool you know",
  "that means you will need to get bacc to work ASAP",
  "finish the game this month broski, you aint got time",
  "to waste on this, you got a game to finish",
  "and a life to live, so get bacc to work",
  "and stop wasting time on this text box",
];


let area_summons = [0,1];
function random_type() {
  let randomType;
  do {
    const randomIndex = Math.floor(Math.random() * area_summons.length); // Pick a random index from area_summons
    randomType = area_summons[randomIndex]; // Get the summon type from area_summons
  } while (summonsData[randomType * num_attributes_data + 1] === 0); // Check if health is 0 (spell)
  return randomType;
};


function updateSteps() {
  if (random_encounters) {
    encounter_steps--;

    if (encounter_steps <= 0 && transitioning === 0) {

      
      let randomType = random_type(); // Get a random summon type from area_summons
      // Set up the battle with the random summon
      clearBoard();
      starting_grid = Array(110).fill(0); // Empty grid
      starting_foes = [randomType]; // Single random summon
      enemy_king = [101, 0, 4, 5 * num_attributes_tile, 0, true, 1, 2, 4]; // Default enemy king
      foes = [randomType]; // Add the random summon to the foes list

      const chance = summonsData[randomType * num_attributes_data + 9]; // Fetch the chance value from summon data
      const random = Math.floor(Math.random() * 10); // Generate a random number between 0 and 9
      if (random + chance >= 10) {
        spoils.push(randomType); // Add the defeated enemy to the spoils list
        console.log("Added to spoils:", randomType);
      };

      // Trigger transition
      play_sfx(gameSounds.battle_sound);
      transitioning = 10;

      // Reset encounter steps
      encounter_steps = Math.floor(Math.random() * 600) + 100; // Random steps between 100 and 600
      player_input.x = 0;
      player_input.y = 0;
      player_walking = 0;
    }

    // Start the battle after the transition
    if (transitioning === 70 && fight_mode === false) {
      fight_mode = true;
      build_grid();
      setupKing();
      buildHand();
    }
  }
}


function updateTextBox() {
  let x = 0;
  let y = 425;


  let portrait_1 = dialog_data[scene_index][scene_inner_index+1];
  let portrait_2 = dialog_data[scene_index][scene_inner_index+2];
  ctx.filter = `opacity(${charIndex / 10})`;
  ctx.drawImage(images.portrait,portrait_1*512,0,512,512, x+80, y-300-charIndex/10, 512, 512);
  ctx.drawImage(images.portrait,portrait_2*512,0,512,512, x+600, y-300-charIndex/10, 512, 512);
  ctx.filter = `none`;
  ctx.drawImage(images.box,0,0,586,600, x, y-60, 1200, 800);
  

  // Join all lines together as a single string to manage charIndex easily
  
  if (charIndex !== -1) {
    fullText = box_text.slice(0, 5).join('\n');
    // Increment charIndex with delay
    if (charTimer <= 0 && charIndex < fullText.length) {
      charIndex++;
      charTimer = charDelay;

      if (sound_buffer) {
        play_sfx(gameSounds.text1)
        sound_buffer = false
      } else {
        play_sfx(gameSounds.text2)
        sound_buffer = true
      }
    } else {
      charTimer--;
    }

    // Get only the visible portion of the text
    let visibleText = fullText.slice(0, charIndex);
    let visibleLines = visibleText.split('\n');

    

    for (let i = 0; i < visibleLines.length; i++) {
      let text_x = x + 180;
      let text_y = y + 240 + i * 30;

      ctx.font = `40px Myfont`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      ctx.lineWidth = 4;
      ctx.strokeStyle = 'black';
      ctx.strokeText(visibleLines[i], text_x, text_y);

      ctx.fillStyle = 'white';
      ctx.fillText(visibleLines[i], text_x, text_y);
    }



    if (box_text.length < 1) {
      let next_index = dialog_data[scene_index][scene_inner_index+3];
      if (next_index == 0) {
        // if next index is 0, then we are done with the dialog
        talking_npc = false;
        scene_inner_index = 0;
      } else {
        scene_inner_index += 3;
        dialogFetch(next_index);
      }
    }



    



  };

  
  

  if (keys.space || keys.enter) {
    skipDialog();
  }

}

function skipDialog() {
  if (charIndex == fullText.length) {
    box_text.splice(0,5);
    charIndex = 0;
  } else {
    charIndex =fullText.length
    //charIndex += 1;
  };
  keys.space = false;
  keys.enter = false;
}

function inputLogic() {
  
  if (debug_mode) {
    if (keys.q) {
      debug_bar = true;
      keys.q = false;
    };
  };
  if (keys.p) {
    keys.p = false;
    if (debug_mode) {
      debug_mode = false;
    } else {
      debug_mode= true;
    };
  };
  
  
  

  if (keys.a) { 
    player_input.x = -6;
    player_flipped = 0;
  } else if (keys.d) { 
    player_input.x = 6;
    player_flipped = 128;
  } else {
    player_input.x = 0;
  }
  
  if (keys.w) { 
    player_input.y = -6;
  } else if (keys.s) { 
    player_input.y = 6;
  } else {
    player_input.y = 0;
  }


  if (keys.l) {
    keys.l = false;
    if (!debug_layer_2) {
      debug_layer_2 = true;
    } else {
      debug_layer_2 = false;
    };
  } else if (keys.c) {
    copy_this_tile_x = Math.floor((rawmouseX + camerax + s_size_half) / s_size) + coor_x;
    copy_this_tile_y = Math.floor((rawmouseY + cameray + s_size_half) / s_size) + coor_y;

    chosen_tile = map[(copy_this_tile_x + copy_this_tile_y * map_w) * 2]*num_things_sprites; // Copy first layer
    keys.c = false;
  } else if (keys.v) {
    let x = Math.floor((rawmouseX + camerax + s_size_half) / s_size) + coor_x;
    let y = Math.floor((rawmouseY + cameray + s_size_half) / s_size) + coor_y;
    copyTile(copy_this_tile_x, copy_this_tile_y, x, y, num_of_tiles_to_change);
    keys.v = false;
  };


  if (keys.num1) {
    num_of_tiles_to_change = 1;
  } else if (keys.num2) {
    num_of_tiles_to_change = 2;
  } else if (keys.num3) {
    num_of_tiles_to_change = 3;
  } else if (keys.num4) {
    num_of_tiles_to_change = 4;
  }
  


  //tryMove();
}

num_of_tiles_to_change = 1;
copy_this_tile_x = 0;
copy_this_tile_y = 0;

function npcStuff() {
  let npcIndices = [];
  for (let i = 0; i < npcs.length; i += num_things_npc) {
    npcIndices.push(i);
  }
  npcIndices.sort((a, b) => npcs[a + 2] - npcs[b + 2]);

  for (let idx of npcIndices) {
    const sprite = npcs[idx];
    const x = npcs[idx + 1];
    const y = npcs[idx + 2];
    const draw_x = (x - coor_x) * s_size;
    const draw_y = (y - coor_y) * s_size;

    if (sprite === -1) {
      tryMove(idx+1,idx+2);
      // This is the player
      let frame_x = 64 * animations[find_animation(7, 0, true, global_animation_speed, 3)];
      if (Math.abs(player_input.x) + Math.abs(player_input.y) == 0) {
        player_walking = 0;
      } else {
        updateSteps();
        player_walking = 64;
      }
      ctx.drawImage(
        images.npc,
        frame_x,
        player_flipped + player_walking,
        64,
        64,
        player_x-camerax -s_size*coor_x  -s_size/2,
        player_y-cameray -s_size*coor_y  -s_size+10,
        s_size,
        s_size
      );
    } else {
      // This is an NPC
      let frame_x = sprites[sprite * num_things_sprites];
      let frame_y = sprites[sprite * num_things_sprites + 1];
      let type = sprites[sprite * num_things_sprites + 2];

      //draw the little not icon
      let ignore_player_frame = 4;
      if (dialog_data[frame_y-ignore_player_frame][0] > 0) {
        if (!talking_npc && transitioning == 0 && scene_inner_index == 0) {
          ctx.drawImage(
            images.icons,
            172,
            0,
            24,
            24,
            draw_x - camerax - 12,
            draw_y - cameray - 64 +hovering_effect,
            24+hovering_effect,
            24+hovering_effect
          );

          if (type == 2) {
            const distance = getDistance(x,y,baseX,baseY);
            if (distance < 2 && keys.space ) {
              keys.space = false
              scene_inner_index = 0;
              scene_index = frame_y-ignore_player_frame;
              dialogFetch();
            }
          } else {
            const distance = getDistance(x,y,baseX,baseY);
            if (distance < 5) {
              scene_inner_index = 0;
              scene_index = frame_y-ignore_player_frame;
              dialogFetch();
            }
          };


          
        }
        
        
      }


      if (who_to_change == frame_y-ignore_player_frame) {
        let animation_index = find_animation(7, 2, false, global_animation_speed, 2);
        frame_x += 64 * animations[animation_index]+512;
        frame_y = change_animation;

        if (animations[animation_index+5] == 20) {
          let next_index = dialog_data[scene_index][scene_inner_index+2];

          animations.splice(animation_index,num_attributes_animation);
          change_animation = -1;
          who_to_change = -1;
          if (next_index == 0) {
            // if next index is 0, then we are done with the dialog
            talking_npc = false;
            scene_index = 0;
            scene_inner_index = 0;
          } else {
            scene_inner_index += 2;
            dialogFetch();
          };
        }
      } else if (who_to_change_loop == frame_y-ignore_player_frame) {
        animation_timer -=1

        let animation_index = find_animation(7, 3, true, global_animation_speed, 3);
        frame_x += 64 * animations[animation_index]+512;
        frame_y = change_animation;

        let speed = dialog_data[scene_index][scene_inner_index+5];

        npcs[idx + 1] += dialog_data[scene_index][scene_inner_index+3]*speed;
        npcs[idx + 2] += dialog_data[scene_index][scene_inner_index+4]*speed;

        if (animation_timer < 1) {
          let next_index = dialog_data[scene_index][scene_inner_index+6];

          animations.splice(animation_index,num_attributes_animation);
          change_animation = -1;
          who_to_change_loop = -1;
          if (next_index == 0) {
            // if next index is 0, then we are done with the dialog
            talking_npc = false;
            scene_index = 0;
            scene_inner_index = 0;
          } else {
            scene_inner_index += 6;
            dialogFetch();
          };
        }

      } else {
        frame_x += 64 * animations[find_animation(7, 1, true, global_animation_speed, 2)];
      }

      ctx.drawImage(
        images.npc,
        frame_x,
        frame_y*64,
        64,
        64,
        draw_x - camerax  -s_size/2,
        draw_y - cameray - s_size+64,
        s_size,
        s_size
      );
    }
  }
}

function npcBattleFetchv1() {
  clearBoard();
  //fetch the fight
  
  fetch("dialog.json")
  .then(res => res.json())
  .then(data => {
    starting_grid = data[starting_fight+10100]; // load the grid
    starting_foes = data[starting_fight+10101]; // then the starting enemies
    enemy_king = data[starting_fight+10102]; // then the enemy king
    enemy_deck = data[starting_fight+10103];
    //while (!Array.isArray(enemy_king)) {}; //wait until this is true
    enemy_king[3] *= num_attributes_tile;
    fightTakingPlace = starting_fight;
    starting_fight = 0;
    play_sfx(gameSounds.battle_sound);
    transitioning = 10;
    
  });
};

function initiateDialog() {
  charIndex = 0;
  player_input.x = 0;
  player_input.y = 0;
  talking_npc = true;
  scene_inner_index += 1;
  box_text = [...dialog_data[scene_index][scene_inner_index]];

};




function createNotification() {
  player_input.x = 0;
  player_input.y = 0;
  scene_inner_index += 1;
  // find the npc in the npc array and push it in here
  for (let npc =0; npc < npcs.length; npc += num_things_npc) {
    let frame_y = sprites[npcs[npc] * num_things_sprites + 1]-4
    if (dialog_data[scene_index][scene_inner_index] == frame_y) {
      const x = npcs[npc + 1];
      const y = npcs[npc + 2];
      const draw_x = (x - coor_x) * s_size;
      const draw_y = (y - coor_y) * s_size;
      play_sfx(gameSounds.notification_sfx);
      notification_animation.push(draw_x-20+s_size*coor_x,draw_y-64+s_size*coor_y,0,1);
    };
  };
  let next_index = dialog_data[scene_index][scene_inner_index+1];
  // listen for the following command here
  if (next_index == 0) {
    // if next index is 0, then we are done with the dialog
    talking_npc = false;
    scene_index = 0;
    scene_inner_index = 0;
  } else {
    scene_inner_index += 1;
    dialogFetch();
  };
}

let wait_timer = 0;
function waitForNextIndex() {
  talking_npc = false;
  scene_inner_index += 1;
  wait_timer = dialog_data[scene_index][scene_inner_index]; // Duration in frames or milliseconds
};

function npcBattleFetch() {
  clearBoard();
  //fetch the fight
  starting_grid = [...dialog_data[scene_index][scene_inner_index+1]]; // load the grid
  starting_foes = [...dialog_data[scene_index][scene_inner_index+2]]; // then the starting enemies
  enemy_king = [...dialog_data[scene_index][scene_inner_index+3]]; // then the enemy king
  enemy_deck = [...dialog_data[scene_index][scene_inner_index+4]];
  enemy_king[3] = enemy_king[3] * num_attributes_tile;

  //proceed with the scene
  let next_index = dialog_data[scene_index][scene_inner_index+5];
  if (next_index == 0) {
    // if next index is 0, then we are done with the dialog
    talking_npc = false;
    scene_index = 0;
    scene_inner_index = 0;
  } else {
    scene_inner_index += 5;
  };
  talking_npc = false;
  starting_fight = 0;
  play_sfx(gameSounds.battle_sound);
  transitioning = 10;
};

let who_to_change = -1;
let change_animation = -1;
function changeAnimationOS() {
  talking_npc = false;
  scene_inner_index += 1;
  change_animation = dialog_data[scene_index][scene_inner_index];
  who_to_change = dialog_data[scene_index][scene_inner_index+1];
};



let scene_index = 0;
let scene_inner_index = 0;


let who_to_change_loop = -1;
let animation_timer = 0;
function moveNpc() {
  talking_npc = false;
  player_input.x = 0;
  player_input.y = 0;
  scene_inner_index += 1;
  // find the npc in the npc array and push it in here
  change_animation = dialog_data[scene_index][scene_inner_index];
  who_to_change_loop = dialog_data[scene_index][scene_inner_index +1];
  animation_timer = dialog_data[scene_index][scene_inner_index +2];
  // who
  // what animation
  // a timer
  // x
  // y
  // speed
}



function dialogFetch() {
  if (dialog_data[scene_index] == undefined) {
    box_text = ["..."];
    console.warn(`Invalid dialog data for scene index ${scene_index}`);
  } else {
    let next_index = dialog_data[scene_index][scene_inner_index];
    switch (next_index) {
      case 1:
        initiateDialog();
        break
      case 2:
        npcBattleFetch();
        break
      case 3:
        createNotification();
        break
      case 4:
        waitForNextIndex();
        break
      case 5:
        changeAnimationOS();
        break
      case 6:
        moveNpc();
        break
    }
  };
};


let notification_animation = [];
function updateNotificationAnimationAndWaitTimer() {
  if (wait_timer > 0) {
    wait_timer -= 1
    if (wait_timer == 0){
      let next_index = dialog_data[scene_index][scene_inner_index+1];
      if (next_index == 0) {
        // if next index is 0, then we are done with the dialog
        talking_npc = false;
        scene_index = 0;
        scene_inner_index = 0;
      } else {
        scene_inner_index += 1;
        dialogFetch();
      };
    }
  }


  if (notification_animation.length > 0) {
    let x = notification_animation[0];
    let y = notification_animation[1];
    let timer = notification_animation[2];
    let gear = notification_animation[3]; 
    if (gear > 0) {
      notification_animation[2] += gear
      notification_animation[3] += 1
      if (gear == 10) {
        notification_animation[3] = -1
      }
    } else if (gear > -10) {
      notification_animation[2] += gear
      notification_animation[3] -= 1
    } else {
      notification_animation[3] -= 1
      ctx.filter = `opacity(${(1+(gear+10)/10)})`
      if (gear == -20) {
        notification_animation = [];
        //return player's input here
      }
    }


    //draw notification
    
    ctx.drawImage(images.icons,168,0,24,24,x-camerax-s_size*coor_x,y-cameray-timer/2-s_size*coor_y,24,24);
    ctx.filter = `none`

  }
};



function dialogFetchv1(dialog) {
  box_text = ["..."];
  charIndex = -1;
  player_input.x = 0;
  player_input.y = 0;
  talking_npc = true;
  fetch("dialog.json")
  .then(res => res.json())
  .then(data => {
    box_text = data[dialog];
    charIndex = 0;
  });

  //make a switch that checks the number of the dialog and starts a fight according to that
};

let cursor_card = [];
let this_is_luggage = false;



let targetScrollX = 100;
let scrollOffsetX = 0;
let targetScrollY = -140;
let scrollOffsetY = 0;



function isMouseInBox(x, y, w, h) {
  return rawmouseX >= x && rawmouseX <= x + w && rawmouseY >= y && rawmouseY <= y + h;
}



document.addEventListener("wheel", (e) => {
  if (isMouseInBox(330, 120, 497, 170)) {
    targetScrollX -= e.deltaY; // Adjust direction if needed
    if (targetScrollX > 100) {
      targetScrollX = 100;
    } else if (targetScrollX < 200-deck_view.length*48) {
      targetScrollX = 200-deck_view.length*48;
    }
  }

  if (isMouseInBox(330, 300, 497, 650)) {
    targetScrollY -= e.deltaY; // Adjust direction if needed
    if (targetScrollY > -140) {
      targetScrollY = -140
    } else if (targetScrollY < 50-(luggage.length/4)*48) {
      targetScrollY = 50-(luggage.length/4)*48;
    }
  }
});

let deck_view = [1,0]


function rpg_mouse_up() {
  if (cursor_card.length !== 0) {
    const newType = cursor_card[0];
    if (newType === undefined || newType < 0 || newType >= summonsData.length / num_attributes_data) {
      console.warn(`Invalid card type in cursor_card:`, newType);
      cursor_card = []; // Clear invalid card
      return;
    }
    if (mouseY < 300) {
      const newX = rawmouseX - 380;

      // Find insertion index based on current_x positions
      let insertIndex = deck_view.length; // default to end
      for (let i = 0; i < deck_view.length; i += 2) {
        const current_x = deck_view[i + 1];
        if (newX < current_x) {
          insertIndex = i;
          break;
        }
      }

      deck_view.splice(insertIndex, 0, newType, newX);
      cursor_card.splice(0, 1); 
      update_deck_from_deck_view()
    } else {
      const newType = cursor_card[0];
      const newX = rawmouseX - 380;

      // Find insertion index based on current_x positions
      let insertIndex = luggage.length; // default to end
      for (let i = 0; i < luggage.length; i += 2) {
        const current_x = luggage[i + 1];
        if (newX < current_x) {
          insertIndex = i;
          break;
        }
      }

      luggage.splice(insertIndex, 0, newType, newX);
      cursor_card.splice(0, 1); 
      update_deck_from_deck_view()


    };
    
  };
};

function rpg_mouse_down() {
  if (hovered_card !== -1 && cursor_card.length == 0) {
    if (this_is_luggage == false) {
      cursor_card.push(deck_view[hovered_card]);
      deck_view.splice(hovered_card,2);  
    } else {
      cursor_card.push(luggage[hovered_card]);
      luggage.splice(hovered_card,2); 
    };
  };
  
  if (!debug_bar && debug_mode && !inventory_open) {
    changeTile(num_of_tiles_to_change);
  } else {
    debug_bar = false;
  };

}

function update_deck_view_from_deck() {
  deck_view = [];
  for (let i = 0; i < deck.length; i++) {
    let type = deck[i];
    if (type === undefined || type < 0 || type >= summonsData.length / num_attributes_data) {
      console.warn(`Invalid card type in deck at index ${i}:`, type);
      continue; // Skip invalid cards
    }
    let initial_x = i * 96; // Or any default position you want
    deck_view.push(type, initial_x);
  }
}

function update_deck_from_deck_view() {
  deck = [];
  for (let i = 0; i < deck_view.length; i += 2) {
    let type = deck_view[i];
    if (type === undefined || type < 0 || type >= summonsData.length / num_attributes_data) {
      console.warn(`Invalid card type in deck_view at index ${i}:`, type);
      continue; // Skip invalid cards
    }
    deck.push(type);
  }
}


function draw_luggage(x, y) {

  hovered_card = -1;
  scrollOffsetX += (targetScrollX - scrollOffsetX) * 0.1;
  scrollOffsetY += (targetScrollY - scrollOffsetY) * 0.1;

  let draw_x = x - 350;
  const boxWidth = 497;
  const boxHeight = 900;

  ctx.drawImage(images.box, 962, 0, boxWidth, 600, draw_x, y, boxWidth, boxHeight);

  ctx.save();
  ctx.beginPath();
  ctx.rect(draw_x + 50, y, boxWidth, boxHeight);
  ctx.clip();
  

  for (let card = 0; card < deck_view.length; card += 2) {
    let type = deck_view[card];
    let current_x = deck_view[card + 1];
    let targetX = (card / 2) * 96 +scrollOffsetX;
  
    // Smooth transition for X
    deck_view[card + 1] += (targetX - current_x) * 0.1;
  
    let card_x = deck_view[card + 1] + draw_x;
    let card_y = 220;
    let size = 96;
    let hover_offset = 1;
  
    const distance = getDistance(card_x, card_y, rawmouseX, rawmouseY);
    if (distance < 40) {
      size = 120 - distance / 2;
      hover_offset = 2 - distance / 40;
      hovered_card = card;
      this_is_luggage = false;
    }
  
    ctx.filter = `brightness(${hover_offset})`;
    ctx.drawImage(images.token, 96 + type * 96, 0, 96, 96, card_x - size / 2, card_y - size / 2, size, size);
    ctx.filter = `none`;
  }
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.rect(draw_x + 50, y +308, boxWidth, 438);
  ctx.clip();


  const cardsPerRow = 4;
  const tileSize = 96;
  const spacingX = tileSize;
  const spacingY = tileSize;
  const offsetY = 520;

  for (let card = 0; card < luggage.length; card += 2) {
    let type = luggage[card];
    let current_x = luggage[card + 1];

    let index = card / 2;
    let col = index % cardsPerRow;
    let row = Math.floor(index / cardsPerRow);

    let targetX = col * spacingX;
    let targetY = row * spacingY;

    // Smooth transition for X (you can add Y smoothing if needed)
    luggage[card + 1] += (targetX - current_x) * 0.1;

    let card_x = luggage[card + 1] + draw_x+100;
    let card_y = offsetY + targetY + scrollOffsetY;
    let size = 96;
    let hover_offset = 1;

    const distance = getDistance(card_x, card_y, rawmouseX, rawmouseY);
    if (distance < 40) {
      size = 120 - distance / 2;
      hover_offset = 2 - distance / 40;
      hovered_card = card;
      this_is_luggage = true;
    }

    ctx.filter = `brightness(${hover_offset})`;
    ctx.drawImage(images.token, 96 + type * 96, 0, 96, 96, card_x - size / 2, card_y - size / 2, size, size);
    ctx.filter = `none`;
  }
  ctx.restore();


  if (cursor_card.length) {
    ctx.drawImage(images.token, 96 + cursor_card[0] * 96, 0, 96, 96, rawmouseX - 48, rawmouseY - 48, 96, 96);
  }
  
  
}

function save_map() {
  try {
      // Convert the map array to a JSON string
      const mapData = JSON.stringify(map);
      // Save to localStorage with a unique key
      localStorage.setItem('gameMap', mapData);
  } catch (error) {
      console.error('Error saving map:', error);
  }
}

// Function to load the map array from localStorage
function load_map() {
  let temp_map = [];
  try {
      // Retrieve the JSON string from localStorage
      const mapData = localStorage.getItem('gameMap');
      if (mapData) {
          // Parse the JSON string back into an array
          temp_map = JSON.parse(mapData);
          return temp_map; // Return the loaded map for use in the game
      } else {
          console.warn('No saved map found. Starting with empty map.');
          temp_map = []; // Reset to empty array if no data exists
          return temp_map;
      }
  } catch (error) {
      console.error('Error loading map:', error);
      temp_map = []; // Fallback to empty array on error
      return temp_map;
  }
}


function save_game() {
  try {
      // Create a game state object with all variables
      const gameState = {
          map: map,
          luggage: luggage,
          deck: deck
      };
      // Convert to JSON string
      const stateData = JSON.stringify(gameState);
      // Save to localStorage with a unique key
      localStorage.setItem('Game_state', stateData);
  } catch (error) {
      console.error('Error saving game state:', error);
      alert('Failed to save game. Try exporting your save data manually.');
  }
}

function load_game() {
  try {
      // Retrieve the JSON string from localStorage
      const stateData = localStorage.getItem('Game_state');
      if (stateData) {
          // Parse JSON string back to object
          const gameState = JSON.parse(stateData);
          // Validate and assign to global variables
          if (gameState && typeof gameState === 'object') {
              map = Array.isArray(gameState.map) ? gameState.map : [];
              luggage = Array.isArray(gameState.luggage) ? gameState.luggage : [];
              deck = Array.isArray(gameState.deck) ? gameState.deck : [];
          } else {
              console.warn('Invalid game state format. Resetting to defaults.');
              reset_to_defaults();
          }
          update_deck_view_from_deck();
      } else {
          console.warn('No saved game state found. Resetting to defaults.');
          reset_to_defaults();
      }
  } catch (error) {
      console.error('Error loading game state:', error);
      alert('Failed to load game state. Try importing a saved file.');
      reset_to_defaults();
  }
  // Return the current state for game logic
  //return { map, luggage, playerStats, gameProgress };
}



function saveArrayToFile(array, filename) {
  // Convert the array to a JSON string
  const data = JSON.stringify(array, null, 2);

  // Create a Blob object
  const blob = new Blob([data], { type: 'application/json' });

  // Create a temporary anchor element
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;

  // Trigger the download
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
}
//------------------------------------file save function----------------------------------//

function saveMapToFile(key, mapData) {
  // Fetch the existing maps.json file
  fetch('maps.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch maps.json');
      }
      return response.json();
    })
    .catch(() => {
      // If the file is missing or invalid, initialize an empty object
      console.warn('maps.json is missing or invalid. Initializing a new file.');
      return {};
    })
    .then(maps => {
      // Add or update the map
      maps[key] = mapData;

      // Convert the updated maps to a JSON string
      const data = JSON.stringify(maps, null, 2);

      // Create a Blob and trigger a download
      const blob = new Blob([data], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'maps.json';
      a.click();
    })
    .catch(error => console.error('Error saving map:', error));
}
function getMapFromFile(key) {
  return fetch('maps.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch maps.json');
      }
      return response.json();
    })
    .then(maps => {
      if (maps[key]) {
        return maps[key];
      } else {
        console.warn(`Map with key "${key}" not found.`);
        return null;
      }
    })
    .catch(error => {
      console.error('Error fetching map:', error);
      return null;
    });
}



function updateInventory() {

  if (inventory_open) {

    let x = 680;
    let y = 0;
    if (luggage_open) {
      draw_luggage(x,y);
    };
    ctx.drawImage(images.box,586,0,376,600,x,y,564,900);


    for (let i = 0; i < 5; i++) {
      let size = 260;
      draw_x = x + 285;
      draw_y = y + i*160 + 270;
      
      let hover_offset = 1;


      const distance = getDistance(draw_x,draw_y,rawmouseX,rawmouseY);
      if (distance < 80) {
        hover_offset = 2-distance/100;
        if (mouse_click && i == 0) {
          mouse_click = false;
          if (luggage_open) {
            luggage_open = false;
          } else {
            luggage_open = true;
          }
        };
        if (mouse_click && i == 2) {
          mouse_click = false;
          // save_map();
          save_game();
        };
        if (mouse_click && i == 3) {
          mouse_click = false;
          // let temp_map = load_map();
          // if (temp_map.length > 0) {
          //   map = temp_map;
          // };
          load_game();
        };
        if (mouse_click && i == 4) {
          mouse_click = false;

          // saveMapToFile("1",map);
          getMapFromFile("1").then(temp_map => {
            if (temp_map && temp_map.length > 0) {
              map = temp_map;
            } else {
              console.warn("Failed to load map or map is empty.");
            }
          });
        };
      };
      ctx.filter = `brightness(${hover_offset})`

      //draw buttons
      ctx.drawImage(images.button,462,0,154,154,draw_x-size/2,draw_y-size/2,size,size);
      //draw text
      let text = "Inventory";
      switch(i) {
        case 0:
          text = "Deck";
          break
        case 1:
          text = "Crown";
          break
        case 2:
          text = "Save Game";
          break
        case 3:
          text = "Load Game";
          break
        case 4:
          text = "Load Map";
          break

      };
      ctx.font = `80px Myfont`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'black';
      ctx.strokeText(text, draw_x, draw_y);
      ctx.fillStyle = 'red';
      ctx.fillText(text, draw_x, draw_y);

      //ctx.drawImage(images.button,616,38*i,154,36,draw_x-size/2,draw_y-size/8,size,size/4);
      ctx.filter = `none`
    };
  };



  if (keys.enter || keys.e || keys.esc) {
    if (inventory_open) {
      player_input.x = 0;
      player_input.y = 0;
      inventory_open = false;
      luggage_open = false;
      keys.enter = false;
      keys.e = false;
      keys.esc = false;
    } else {
      update_deck_view_from_deck()
      player_input.x = 0;
      player_input.y = 0;
      inventory_open = true;
      luggage_open = false;
      keys.enter = false;
      keys.e = false;
      keys.esc = false;
    };
    
  };
};


function rpgloop() {
  drawMap();
  //drawPlayer();
  //drawNpc();
  npcStuff();
  drawMapAbove();
  updateInventory();
  updateNotificationAnimationAndWaitTimer();

  camera_follow()


  if (talking_npc) {
    updateTextBox();
    
  } else if (transitioning == 0 && !inventory_open && scene_inner_index == 0) {
    inputLogic();
    
  } 


  if (debug_mode) {
    if(debug_layer_2) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // black with 20% opacity
      ctx.fillRect(0, 0, 1200, 900);
    }
    if (debug_bar) {
      draw_debug_bar();
    };
    drawDebugTile();
  };

  
};


function tryMove(x,y) {
  const newPlayerX = player_x + player_input.x;
  const newPlayerY = player_y + player_input.y;

  baseX = Math.floor((player_x + s_size_half) / s_size);
  baseY = Math.floor((player_y + s_size_half) / s_size);


  let canMoveX = true;
  if (player_input.x !== 0) {
    const x = Math.floor((newPlayerX + s_size_half) / s_size);
    const y = baseY;
    const base_index = (x + y * map_w) * 2; // Adjust for two layers
    const map_id = map[base_index];
    const sprite = sprites[map_id*num_things_sprites+2]
    if (sprite == 0) {
      canMoveX = false; // Block movement in x-axis if not grass
    };
  };

  let canMoveY = true;
  if (player_input.y !== 0) {
    const x = baseX;
    const y = Math.floor((newPlayerY + s_size_half) / s_size);
    const base_index = (x + y * map_w) * 2; // Adjust for two layers
    const map_id = map[base_index];
    const sprite = sprites[map_id*num_things_sprites+2]
    if (sprite == 0) {
      canMoveY = false; // Block movement in y-axis if not grass
    }
  }

  if (canMoveX) {
    player_x += player_input.x;
    npcs[x] = baseX;
  }
  if (canMoveY) {
    player_y += player_input.y;
    npcs[y] = baseY;
  }


  
};




function camera_follow() {
  const screenX = player_x - camerax - s_size * coor_x - s_size;
  const screenY = player_y - cameray - s_size * coor_y - s_size;

  const deadZoneLeft = 500 - 50;
  const deadZoneRight = 500 + 50;
  const deadZoneTop = 450 - 120;
  const deadZoneBottom = 450 + 0;

  let targetCamerax = camerax;
  let targetCameray = cameray;

  if (screenX < deadZoneLeft) {
    targetCamerax = player_x - s_size * coor_x - s_size - deadZoneLeft;
  } else if (screenX > deadZoneRight) {
    targetCamerax = player_x - s_size * coor_x - s_size - deadZoneRight;
  }

  if (screenY < deadZoneTop) {
    targetCameray = player_y - s_size * coor_y - s_size - deadZoneTop;
  } else if (screenY > deadZoneBottom) {
    targetCameray = player_y - s_size * coor_y - s_size - deadZoneBottom;
  }

  // Smooth step with whole number movement
  const diffX = targetCamerax - camerax;
  const diffY = targetCameray - cameray;
  const speedX = Math[diffX > 0 ? "ceil" : "floor"](diffX * 0.1);
  const speedY = Math[diffY > 0 ? "ceil" : "floor"](diffY * 0.1);

  camerax += speedX;
  cameray += speedY;

  // === Clamp camera to map bounds ===

  const totalMapWidth = (map_w-coor_x) * s_size;
  const totalMapHeight = (map_h-coor_y) * s_size;

  const screenWidth = 1300;
  const screenHeight = 1000;

  // Clamp so camera doesn't scroll past map edges
  camerax = Math.max(0-coor_x, Math.min(camerax, totalMapWidth - screenWidth));
  cameray = Math.max(0-coor_y, Math.min(cameray, totalMapHeight - screenHeight));
}



document.addEventListener('click', () => {
  if (game_started == false) {
    if (assets_ready == true) {
      playWhenLoaded(bgmrpg);
      game_started = true;
      startGame();
      
    };
  } else {


    //leaves.push(createLeaf());
    //createLightning(rawmouseX,rawmouseY);


    
  };
  
},);








function startGame() {
  console.log('All images loaded! Starting game...');


  build_map();


  requestAnimationFrame(gameLoop);

}


dialog_data = [
  //first define the action, if dialog the next item is the dialog and then the portraits of the characters
  [3,0,4,30,1,
    [
      "Testing dialog box, see, it is working :D", 
      "the fact i got this far cannot be understated",
      "just the fact people keep thinking this is RPG maker",
      "makes it all worthwhile, just to image my raw js game",
      "is being compared to some company size reworked",
      "to the limit piece of sotware is amazing."
    ]
    ,0,3,
    1,
    [
      "just think about it, the impressive amount of time", 
      "and effort the went into this is still nothing comparing",
      "to the resources it probably took for PRG maker to come",
      "into reality",
      "and more text",
      "that's it"
    ]
    ,-1,2,3,0,4,90,1,["i alone conquered the RPG genre"],0,1,0
  ], //0 to end scene, 


  [1,
    [
      "this is a test, and i'm going to make it longer just in case", 
      "so it can be tested properly",
      "and then i'm going to add more text",
      "and more text",
      "and more text",
      "that's it"
    ]
    ,0,1,
    1,
    [
      "this is a test2, and i'm going to make it longer just in case", 
      "so it can be tested properly",
      "and then i'm going to add more text",
      "and more text",
      "and more text",
      "that's it"
    ]
    ,1,0,3,1,5,0,1,1,["worked?"],0,1,6,1,1,120,-1,0,0.02,0
  ], //0 to end scene, 


  [1,["this is a test for a battle"],0,5,2,
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ], //map
    [], //starting foes
    [100,0,2,5,0,false,1,1,1], //enemy king
    [0,11,13], //deck
    1,
    [
      "guy on the right:",
      "Lemme try talking to ya during battle",
      "this is a test, and i'm going to make it longer just in case",
      "so it can be tested properly",
      "and then i'm going to add more text",
      "and more text",
      "you got the point",
    ], //dialog
    0, //dialog portrait
    5, //dialog portrait
    0 // to end scene
  ]


];






















function gameLoop() {
  updateHovering();
  animationTick();
  debug_stuff();
  

  // ctx.fillStyle = "#87CEEB";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(images.bg, -150-(camerax/4), -150-(cameray/4), 1500, 1500); // background

  if (transitioning > 0) {
    transition_shit();
  }

  if (fight_mode) {
    ctx.imageSmoothingEnabled = true;
    boardDraw();

    if (talking_npc) {
      updateTextBox();
    } else if (!battle_over) {
      boardLogic();
    } else {
      battle_end();
    }
    
    
  } else {
    ctx.imageSmoothingEnabled = false;
    rpgloop();
  }
  fade_to_black();
  //draw blackness
  updateLeaves();
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  requestAnimationFrame(gameLoop);
}


function clearBoard() {
  turn_count = 0;
  starting_grid = [];
  fight_mode = false;
  attackAnimations = [];
  textParticles = [];
  movingSummons = [];
  cursor = [];
  hand = [];
  grid = [];
  animations = [];
  summons = [];
  summonIndices = [];
  foes = [];
  camerax = 0;
  cameray = 0;
  player_click = false;
  hoveredTile = null;
  hoveredToken = null;
  last_hovered_token = null;
  last_hovered = null;
  id_generator = 110;
  tile_selected = -1;
  target_tile = -1;
  hoveredTile = null;
  over_button = false;
  deckIndex = 0;
  enemyDeckIndex = 0;
  in_attack_motion = false;
  dialog_trigger = false;
  player_input.x = 0;
  player_input.y = 0;
  player_walking = 0;
  player_king[3] = 104*num_attributes_tile;
  player_king[1] = 0; //player king starting sp
  player_king[5] = false
  battle_over = false;
  spoils = [];
  turn = 1;
}

function music_change(music) {
  for (let a = music_playing.length - 1; a >= 0; a--) {
    //music_playing[a].currentTime = 0;
    music_playing[a].pause();
    
    music_playing.splice(a, 1); // remove the paused music from array
  }
  playWhenLoaded(music);
}



function startFight() {

  music_change(bgm1);
  fight_mode = true;
  build_grid();
  setupKing();
  buildHand();
}
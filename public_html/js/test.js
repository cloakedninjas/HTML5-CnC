var defn = {
	faction: {
		nod: {},
		gdi: {},
		any: {}
	},

	armour: {
		level1: {},
		level2: {},
		level3: {}
	},

	weapon: {
		machine_gun: {
			dmg: 3,
			inf_mod: 1,
			veh_mod: 0.7,
			struc_mod: 0.4
		},
		high_v_machine_gun: {},
		cannon120mm: {
			dmg: 45
		}
	}
};

defn.unit = {
	buggy: {
		ref: "buggy",
		name: "Buggy",
		hp: 140,
		armour: defn.armour.level2,
		cost: 300,
		speed: 30,
		sight: 2,
		tech: 2,
		weapon_1: defn.weapon.machine_gun,
		faction: [defn.faction.nod]
	},
	mcv: {
		ref: "mcv",
		name: "MCV",
		hp: 600,
		armour: defn.armour.level2,
		cost: 5000,
		speed: 12,
		sight: 2,
		tech: 7,
		weapon_1: null,
		faction: [defn.faction.any]
	}
};

defn.structure = {
	guard_tower: {
		ref: "guard_tower",
		name: "Guard Tower",
		cost: 500,
		tech: 2,
		hp: 200,
		tib_store: 0,
		armour: defn.armour.leve1,
		weapon_1: defn.weapon.high_v_machine_gun,
		power_req: 10,
		power_made: 0
	},
	airfield: {
		ref: "airfield",
		name: "Airfield",
		cost: 2000,
		sight: 5,
		tech: 2,
		hp: 500,
		tib_store: 0,
		armour: defn.armour.leve3,
		weapon_1: null,
		power_req: 30,
		power_made: 0,
		sprite: {
			frames: {width: 96, height: 48, regX: 48, regY: 24},
			animations: {
				idle_green: [0, 15, "idle_green", 6],
				idle_yellow: [16, 31, "idle_yellow", 4],
				build: [33, 46, "idle_green", 6]
			}
		}
	}
};

defn.mission = {
	gdi: [
		{
			map: {
				width: 320,
				height: 320
			},
			init: function() {
				Game.moveCamera(100, 200);
			},
			winCondition: {
				type: "enemy-all-destroyed",
				player: 0
			},
			objects: [{defn: defn.unit.buggy, player: 0, x: 20, y: 20},
			          {defn: defn.unit.mcv, player: 1, x: 200, y: 120}]
		}, {}
	],

	nod: [
		{}, {}
	]
};

Game = {
	stage: null,
	assets: {},
	viewport: {x: 0, y: 0, width: 0, height: 0, gridsize: 24},
	selection: [],
	objects: [],

	init: function() {
		var canvas = document.getElementById("canvas");
		this.stage = new Stage(canvas);
		this.stage.snapToPixelEnabled = true;
		this.viewport.width = canvas.width;
		this.viewport.height = canvas.height;

		this.preloadAssets();
	},

	log: function(msg) {
		console.log(msg);
	},

	preloadAssets: function() {
		// single asset for time being
		this.assets.airfield = new Image();

		this.assets.airfield.onload = this.assetLoadComplete;
		this.assets.airfield.onerror = this.assetLoadError;
		this.assets.airfield.src = "/images/airfield.png";
	},

	assetLoadComplete: function() {
		// force load
		Game.start();
	},

	assetLoadError: function(e) {
		this.log("Error Loading asset : " + e.target.src);
	},

	start: function() {
		this.loadMission("gdi", 0);
	},

	loadMission: function(faction, level) {
		// could preload mission assets here, pass in custom callback to begin mission
		var mission = defn.mission[faction][level];
		this.log("loading " + faction + ":" + level);

		for(i = 0; i < mission.objects.length; i++) {
			var o = new GameObject(mission.objects[i].defn);
			o.player = mission.objects[i].player;
			o.x = mission.objects[i].x;
			o.y = mission.objects[i].y;

			this.addObject(o);
		}
		mission.init();
	},

	/**
	 * Add a game object into the game collection
	 * @return null
	 */
	addObject: function(o) {
		this.objects.push(o);
	},

	/**
	 * Adjust viewport to a new position of the map
	 * @param x
	 * @param y
	 */
	moveCamera: function(x, y) {

	},

	userCommand: function() {

	},

	tick: function() {
		for (i = 0; i < this.objects.length; i++) {
			this.objects[i].draw();
		}
		this.stage.update();
	}
};

function GameObject(d) {
	this.x = 0;
	this.y = 0;
	this.defn = d;
	//Game.log(this.defn);

	var spriteSheet = new SpriteSheet({
		images: [Game.assets[d.ref]],
		frames: d.sprite.frames,
		animations: d.sprite.animations
	});

	this.bmpAnim = new BitmapAnimation(spriteSheet);

	//bmpAnimation.name = "airfield";
	//bmpAnimation.x = this.x;
	//bmpAnimation.y = this.y;

	// erm
	//stage.addChild(bmpAnimation);
}

GameObject.prototype.isVisible = function() {
	return true;
};

GameObject.prototype.draw = function() {
	if (this.isVisible()) {
		// get viewport coords
		this.bmpAnim.x = 30;
		this.bmpAnim.y = 90;
		//bmpAnimation.gotoAndPlay("build");
		Game.stage.addChild(this.bmpAnim);
	}
};

GameObject.prototype.changeAnimation = function(anim) {
	this.bmpAnim.gotoAndPlay(anim);
};


//Game.userCommand({cmd: "build", what: "airfield"});

// if cmd == "build" && what.type == "structure"
// do stuff...




/*
var airfield = new Image();

function init() {
	airfield.onload = handleImageLoad;
	airfield.onerror = handleImageError;
	airfield.src = "/images/airfield.png";
}

function reset() {
	stage.removeAllChildren();
	Ticker.removeAllListeners();
	//stage.update();
}

function handleImageLoad(e) {
	startGame();
}

function handleImageError(e) {
	console.log("Error Loading Image : " + e.target.src);
}

function startGame() {
	canvas = document.getElementById("canvas");

	// create a new stage and point it at our canvas:
	stage = new Stage(canvas);

	// grab canvas width and height for later calculations:
	screen_width = canvas.width;
	screen_height = canvas.height;

	var spriteSheet = new SpriteSheet({
		images: [airfield],
		frames: {width: 96, height: 48, regX: 48, regY: 24},
		animations: {
			idle1: [0, 15, "idle1", 6],
			idle2: [16, 31, "idle2", 4],
			build: [33, 46, "idle1", 6]
		}
	});

	bmpAnimation = new BitmapAnimation(spriteSheet);

	// start playing the first sequence:
	//bmpAnimation.gotoAndPlay("build");

	bmpAnimation.name = "airfield";
	bmpAnimation.x = 200;
	bmpAnimation.y = 200;

	// have each monster start at a specific frame
//	bmpAnimation.currentFrame = 0;
	stage.addChild(bmpAnimation);

	// we want to do some work before we update the canvas,
    // otherwise we could use Ticker.addListener(stage);
    Ticker.addListener(window);
    Ticker.useRAF = true;
    // Best Framerate targeted (60 FPS)
    Ticker.setFPS(60);

}

function tick() {
    stage.update();
}

function build() {
	bmpAnimation.gotoAndPlay("build");
}
*/
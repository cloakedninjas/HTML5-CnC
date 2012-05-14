faction = {
	nod: {},
	gdi: {}
};

armour = {
	level1: {},
	level2: {}
};

weapons = {
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
};

units = {
	buggy: {
		ref: "buggy",
		name: "Buggy",
		hp: 140,
		armour: armour.level2,
		cost: 300,
		speed: 30,
		sight: 2,
		tech: 2,
		weapon_1: weapons.machine_gun,
		faction: [faction.nod]
	}
};

structures = {
	guard_tower: {
		ref: "guard_tower",
		name: "Guard Tower",
		cost: 500,
		tech: 2,
		hp: 200,
		tib_store: 0,
		armour: armour.leve1,
		weapon_1: weapons.high_v_machine_gun,
		power_req: 10,
		power_made: 0
	}
};


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
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
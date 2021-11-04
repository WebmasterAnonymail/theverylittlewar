module.exports.atomes=[
	"carbone",
	"oxygene",
	"azote",
	"iode",
	"brome",
	"hydrogene",
	"soufre",
	"chlore"
];
module.exports.medailles=[
	"def",
	"atk",
	"mol",
	"tps",
	"prt",
	"des",
	"pil",
	"cmb"
];
module.exports.batiment_augmentateurs=[
	"forteresse",
	"ionisateur",
	"lieur",
	"stabilisateur",
	"champdeforce",
	"usinedexplosif",
	"condenseur",
	"booster"
];
module.exports.seuils_medailes=[1,2,5,10,20,50,100,200,500,1000];
module.exports.multiplacateur_medailles=[1000,1000,100,50,50,1000,1000,1];
module.exports.points_medailles=[
	"defense",
	"attaque",
	"molecules_crees",
	"pertes_temps",
	"pertes_combat",
	"destruction",
	"pillage",
	"combats"
];
module.exports.points_batiments={
	"generateur":1,
	"producteur":1,
	"stockage":1,
	"forteresse":3,
	"ionisateur":3,
	"lieur":3,
	"stabilisateur":3,
	"champdeforce":3,
	"usinedexplosif":3,
	"condenseur":3,
	"booster":3,
	"protecteur":2
};
module.exports.power_atome=function(utilisateur,molecule,atome){
	let result=Math.max(1,Math.asin(utilisateur.molecules[molecule][this.atomes[atome]]/200)/Math.PI*2000);
	result*=1+(utilisateur.batiments[this.batiment_augmentateurs[atome]]/100);
	if(this.medailles[atome]>=0){
		result*=1+(utilisateur.medailles[this.medailles[atome]]/10);
	}
	//dupli
	return result;
}
module.exports.has_team_permission=function(username,permission){
	let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
	let teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
	let user=users[username];
	let team=teams[user.alliance]
	let res=false;
	if(team.chef==username){
		res=true;
	}
	//permissions : guerre pacte finance grades membres description
	for(let grade in team.grades){
		if(team.grades[grade].posseseur==username){
			res=res||team.grades[grade][permission];
		}
	}
	return res
}
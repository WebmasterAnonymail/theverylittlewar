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
module.exports.ressources=[
	"carbone",
	"oxygene",
	"azote",
	"iode",
	"brome",
	"hydrogene",
	"soufre",
	"chlore",
	"energie"
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
module.exports.batiments=[
	"generateur",
	"producteur",
	"stockage",
	"forteresse",
	"ionisateur",
	"lieur",
	"stabilisateur",
	"champdeforce",
	"usinedexplosif",
	"condenseur",
	"booster",
	"protecteur"
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
module.exports.batiment_pveurs=[
	"generateur",
	"producteur",
	"stockage",
	"protecteur"
];
module.exports.seuils_medailes=[1,2,5,10,20,50,100,200,500,1000];
module.exports.multiplacateur_medailles=[10000,10000,100,50,50,10000,10000,10];
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
module.exports.team_permissions=[
	"guerre",
	"pacte",
	"strategie",
	"finance",
	"grades",
	"inviter",
	"expulser",
	"description"
]
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
	"protecteur":5
};
module.exports.map_posX=[0,1,0,2,1,0,3,2,1,0,4,3,2,1,0,4,3,2,1,4,3,2,4,3,4];
module.exports.map_posY=[0,0,1,0,1,2,0,1,2,3,0,1,2,3,4,1,2,3,4,2,3,4,3,4,4];
module.exports.images_mime_types={
	"image/svg+xml":"svg",
	"image/png":"png",
	"image/jpeg":"jpg",
	"image/gif":"gif",
	"image/bmp":"bmp",
	"image/webp":"webp"
}
module.exports.power_atome=function(utilisateur,molecule,atome){
	let result=Math.max(1,Math.asin(utilisateur.molecules[molecule][this.atomes[atome]]/200)/Math.PI*2000);
	result*=1+(utilisateur.batiments[this.batiment_augmentateurs[atome]]/100);
	if(utilisateur.medailles[this.medailles[atome]]!=-1){
		result*=1+((utilisateur.medailles[this.medailles[atome]]+1)/10);
	}
	//dupli
	return result;
}
module.exports.has_team_permission=function(username,permission){
	let user=dbs.users[username];
	let team=dbs.teams[user.alliance]
	let res=false;
	if(team.chef==username){
		res=true;
	}
	//permissions : guerre pacte strategie finance grades inviter expulser description
	for(let grade in team.grades){
		if(team.grades[grade].posseseur==username){
			res=res||team.grades[grade][permission];
		}
	}
	return res;
}
module.exports.copydepth=function(src){
	if(src instanceof Array){
		let dest=[];
		for(let elem of src){
			if(typeof elem=="object"){
				dest.push(module.exports.copydepth(elem));
			}else{
				dest.push(elem);
			}
		}
		return dest
	}else if(src instanceof Object){
		let dest={};
		for(let elem in src){
			if(typeof src[elem]=="object"){
				dest[elem]=module.exports.copydepth(src[elem]);
			}else{
				dest[elem]=src[elem];
			}
		}
		return dest
	}
	return src
}

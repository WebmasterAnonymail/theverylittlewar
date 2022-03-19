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
	//permissions : guerre pacte finance grades inviter expulser description
	for(let grade in team.grades){
		if(team.grades[grade].posseseur==username){
			res=res||team.grades[grade][permission];
		}
	}
	return res;
}
module.exports.bb_code=function(texte){
	let res=texte;
	res=res.replaceAll("&","&amp;");
	res=res.replaceAll("<","&lt;");
	res=res.replaceAll(">","&gt;");
	res=res.replaceAll("\n","<br>");
	let unibalises=/\[([biuspq]|sup|sub|big|small|rainbow|ec|eo|en|ei|ebr|eh|es|ecl|h[1-6])\](.*?)\[\/\1\]/;
	let oldres="";
	do{
		oldres=res;
		res=res.replace(unibalises,"<$1>$2</$1>");
	}while(oldres!=res);
	let lienbalise=/\[url=((https?:\/\/)?[-a-z0-9A-Z._](:[0-9]+)?([-a-z0-9A-Z._/#?&+%]+)?)\](.*?)\[\/url\]/;
	do{
		oldres=res;
		res=res.replace(lienbalise,"<a href='$1'>$5</a>");
	}while(oldres!=res);
	let imgbalise=/\[img=((https?:\/\/)?[-a-z0-9A-Z._](:[0-9]+)?([-a-z0-9A-Z._/#?&+%]+)?)\]/;
	do{
		oldres=res;
		res=res.replace(imgbalise,"<img src='$1'>");
	}while(oldres!=res);
	let colorbalise=/\[color=(#[0-9A-F]{6}|black|grey|silver|white|maroon|olive|green|teal|navy|purple|red|yellow|lime|aqua|blue|fuchsia)\](.*?)\[\/color\]/;
	do{
		oldres=res;
		res=res.replace(colorbalise,"<span style='color: $1;'>$2</span>");
	}while(oldres!=res);
	return res;
}
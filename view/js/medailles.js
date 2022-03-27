var medailles_txt=[
"argent",
"or",
"platine",
"rubis",
"topaze",
"émeraude",
"turquoise",
"saphir",
"améthyste",
"DIAMANT"];
var medailles_color=[
"var(--argent-color)",
"var(--or-color)",
"var(--platine-color)",
"#c00000",
"#c0c000",
"#00c000",
"#00c0c0",
"#0000c0",
"#c000c0",
"DIAMANT"];
var couleurs=[
];
function post_getuser_action(){
	for(let a in medailles){
		if(user.medailles[medailles[a]]<0){
			document.getElementById(medailles[a]+"_img").style.visibility="hidden";
			document.getElementById(medailles[a]+"_txt").innerText="";
		}else{
			document.getElementById(medailles[a]+"_img").src="../image/medailles/"+user.medailles[medailles[a]]+".png";
			document.getElementById(medailles[a]+"_img").style.visibility="visible";
			document.getElementById(medailles[a]+"_txt").innerText=medailles_txt[user.medailles[medailles[a]]];
			if(user.medailles[medailles[a]]==9){
				document.getElementById(medailles[a]+"_txt").classList.add("rainbow");
			}else{
				document.getElementById(medailles[a]+"_txt").style.color=medailles_color[user.medailles[medailles[a]]];
			}
		}
		document.getElementById(medailles[a]+"_actual").innerText=(user.medailles[medailles[a]]+1)*10+"%";
		if(user.medailles[medailles[a]]<9){
			document.getElementById(medailles[a]+"_points").innerText=affichageRessources(user.points[points_medailles[a]])+"/"+affichageRessources(seuils_medailes[user.medailles[medailles[a]]+1]*multiplacateur_medailles[a])
		}else{
			document.getElementById(medailles[a]+"_points").innerText="Médaille maximum !"
		}
	}
}
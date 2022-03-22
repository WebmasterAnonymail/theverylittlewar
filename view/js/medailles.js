function post_getuser_action(){
	for(let a in medailles){
		if(user.medailles[medailles[a]]<0){
			document.getElementById(medailles[a]+"_img").style.visibility="hidden";
			document.getElementById(medailles[a]+"_txt").innerText="";
		}else{
			document.getElementById(medailles[a]+"_img").src="../image/medailles/"+user.medailles[medailles[a]]+".png";
			document.getElementById(medailles[a]+"_img").style.visibility="visible";
			document.getElementById(medailles[a]+"_txt").innerText="";
		}
		document.getElementById(medailles[a]+"_actual").innerText=(user.medailles[medailles[a]]+1)*10+"%";
		if(user.medailles[medailles[a]]<9){
			document.getElementById(medailles[a]+"_points").innerText=affichageRessources(user.points[points_medailles[a]])+"/"+affichageRessources(seuils_medailes[user.medailles[medailles[a]]+1]*multiplacateur_medailles[a])
		}else{
			document.getElementById(medailles[a]+"_points").innerText="Médaille maximum !"
		}
	}
}
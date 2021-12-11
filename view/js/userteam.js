var bodys=["preview_user","preview_team","attaquer"];
var selectedUser=null;
var selectedTeam=null;
function select_body(body=null){
	for(a of bodys){
		document.getElementById(a).removeAttribute("used");
	}
	if(body){
		document.getElementById(body).setAttribute("used","yes");
	}
}
var attaquerQuoi=null;
function view_user(user){
	use_api("GET","users",{"mode":"one","user":user},false,function(xhr){
		if(xhr.status==200){
			document.getElementById("user_name").innerText=user;
			if(xhr.response.alliance){
				document.getElementById("user_team").innerText=xhr.response.alliance;
				document.getElementById("team_link").onclick=function(){
					view_team(xhr.response.alliance);
				}
			}else{
				document.getElementById("user_team").innerText="Aucune";
				document.getElementById("team_link").onclick=null;
			}
			document.getElementById("user_points").innerText=Math.floor(xhr.response.points.total);
			document.getElementById("user_victory").innerText=xhr.response.victoires;
			document.getElementById("user_position").innerText=xhr.response.positionX+";"+xhr.response.positionY;
			document.getElementById("user_last_connexion").innerText="Il y a "+affichageTemps(Date.now()-xhr.response.lastUserCheck);
			if(xhr.response.description){
				document.getElementById("user_description").innerHTML=bb_code(xhr.response.description);
			}else{
				document.getElementById("user_description").innerHTML="";
			}
			selectedUser=user;
			select_body("preview_user");
		}else{
			alert("ERROR in getting user : code "+xhr.status);
		}
	});
}
function view_team(team){
	use_api("GET","teams",{"mode":"one","team":team},false,function(xhr){
		if(xhr.status==200){
			document.getElementById("team_name").innerText=team;
			document.getElementById("team_points").innerText=Math.floor(xhr.response.moyenne);
			document.getElementById("team_somme").innerText=Math.floor(xhr.response.somme);
			document.getElementById("team_victory").innerText=xhr.response.victoires;
			document.getElementById("team_chief").innerText=xhr.response.chef;
			document.getElementById("chief_link").onclick=function(){
				view_user(xhr.response.chef);
			}
			document.getElementById("team_name_outer").style.backgroundColor=xhr.response.color;
			if(xhr.response.description){
				document.getElementById("team_description").innerHTML=bb_code(xhr.response.description);
			}else{
				document.getElementById("team_description").innerHTML="";
			}
			let team_members_list=document.getElementById("team_members_list");
			team_members_list.innerHTML="";
			for(let membre of xhr.response.membres){
				let line=document.createElement("tr");
				let cell1=document.createElement("td");
				cell1.innerText=membre;
				line.appendChild(cell1);
				let cell2=document.createElement("td");
				for(let grade in xhr.response.grades){
					if(xhr.response.grades[grade].posseseur==membre){
						cell2.appendChild(document.createTextNode(grade));
						cell2.appendChild(document.createElement("br"));
					}
				}
				line.appendChild(cell2);
				team_members_list.appendChild(line);
			}
			selectedTeam=team;
			select_body("preview_team");
		}else{
			alert("ERROR in getting team : code "+xhr.status);
		}
	});
}
function post_getuser_action(){
	for(let a=0;a<5;a++){
		let mol=user.molecules[a];
		if(mol){
			let formule="";
			for(b in atomes){
				if(user.molecules[a][atomes[b]]){
					formule+="<e"+initiales[b].toLowerCase()+">";
					formule+=initiales[b];
					if(user.molecules[a][atomes[b]]!=1){
						formule+="<sub>"+user.molecules[a][atomes[b]]+"</sub>";
					}
					formule+="</e"+initiales[b].toLowerCase()+">";
				}
			}
			document.getElementById("attaquer_formule"+a).innerHTML=formule;
			document.getElementById("attaquer_mol"+a).setAttribute("max",Math.floor(user.molecules[a].number));
			document.getElementById("attaquer_mol"+a).style.removeProperty("display");
		}else{
			document.getElementById("attaquer_formule"+a).innerHTML="Vide";
			document.getElementById("attaquer_mol"+a).style.display="none";
			document.getElementById("attaquer_mol"+a).value="";
		}
	}
}
window.onload=()=>{
	document.getElementById("user_button_attaquer").addEventListener("click",function(){
		select_body("attaquer");
		document.getElementById("attaquer_what").value="user"
		document.getElementById("attaquer_what").onchange();
		document.getElementById("attaquer_target").value=selectedUser;
	});
	document.getElementById("team_button_attaquer").addEventListener("click",function(){
		select_body("attaquer");
		document.getElementById("attaquer_what").value="team"
		document.getElementById("attaquer_what").onchange();
		document.getElementById("attaquer_target").value=selectedTeam;
	});
	for(let a=0;a<5;a++){
		document.getElementById("attaquer_mol"+a+"_max").addEventListener("click",function(){
			document.getElementById("attaquer_mol"+a).value=document.getElementById("attaquer_mol"+a).getAttribute("max");
		});
	}
	document.getElementById("attaquer_what").onchange=function(){
		attaquerQuoi=document.getElementById("attaquer_what").value;
		document.getElementById("attaquer_target").setAttribute("list",attaquerQuoi+"_autocomplete_list");
	}
	document.getElementById("attaquer_button").addEventListener("click",function(){
		datas={
			"action":"attaquer_"+attaquerQuoi,
			"mol0":document.getElementById("attaquer_mol0").valueAsNumber,
			"mol1":document.getElementById("attaquer_mol1").valueAsNumber,
			"mol2":document.getElementById("attaquer_mol2").valueAsNumber,
			"mol3":document.getElementById("attaquer_mol3").valueAsNumber,
			"mol4":document.getElementById("attaquer_mol4").valueAsNumber,
			"target":document.getElementById("attaquer_target").value
		}
		use_api("PUT","actions",datas,true,function(xhr){
			if(xhr.status==200){
				document.getElementById("attaquer_mol0").value="";
				document.getElementById("attaquer_mol1").value="";
				document.getElementById("attaquer_mol2").value="";
				document.getElementById("attaquer_mol3").value="";
				document.getElementById("attaquer_mol4").value="";
				window.parent.popup_open_close();
			}else if(xhr.status==409){
				alert("L'alliance doit être en guerre avec la votre, et vous devez avoir une alliance");
			}else if(xhr.status==404){
				alert("L'utilisateur ou l'alliance n'existe pas");
			}else if(xhr.status==403){
				alert("L'utilisateur ou l'alliance ne peut pas être attaqué");
			}else if(xhr.status==402){
				alert("Vous n'avez pas assez de molécule");
			}else{
				alert("ERROR in attaquing : code "+xhr.status);
			}
		})
	});
}

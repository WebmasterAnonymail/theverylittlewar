var bodys=["preview_user","preview_team","user_attaquer","team_attaquer"];
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
			document.getElementById("user_points").innerText=xhr.response.points.total;
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
			document.getElementById("team_points").innerText=xhr.response.moyenne;
			document.getElementById("team_somme").innerText=xhr.response.somme;
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
window.onload=()=>{
	document.getElementById("user_button_attaquer").addEventListener("click",function(){
		select_body("user_attaquer");
		document.getElementById("user_attaquer_target").value=selectedUser;
	});
	document.getElementById("team_button_attaquer").addEventListener("click",function(){
		select_body("team_attaquer");
		document.getElementById("team_attaquer_target").value=selectedTeam;
	});
}

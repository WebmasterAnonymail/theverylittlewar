var popups=["actionframe"];
var classements=["actual","teams"];
var selected_classement="actual";
function popup_open_close(at_open=null){
	document.getElementById("popup_mask").style.display="none";
	for(a of popups){
		document.getElementById("popup_"+a).style.display="none";
	}
	if(at_open){
		document.getElementById("popup_"+at_open).style.display="block";
		document.getElementById("popup_mask").style.display="block";
	}
}
function select_classement(at_open){
	for(a of classements){
		document.getElementById(a+"_table").style.display="none";
	}
	document.getElementById(at_open+"_table").style.display="table";
	selected_classement=at_open;
}
function post_getuser_action(){
	if(selected_classement=="actual"){
		use_api("OPTIONS","generalplay",{classement:"actual"},false,function(xhr){
			if(xhr.status==200){
				document.getElementById("actual_classement").innerHTML="";
				for(let rank in xhr.response){
					let data=xhr.response[rank];
					let line=document.createElement("tr");
					if(data.user==username){
						line.style.borderColor="#0000ff";
					}
					let Eclassement=document.createElement("td");
					Eclassement.innerText=Number(rank)+1;
					switch(rank){
						case "0":
							Eclassement.style.backgroundColor="var(--platine-color)";
							break;
						case "1":
							Eclassement.style.backgroundColor="var(--or-color)";
							break;
						case "2":
							Eclassement.style.backgroundColor="var(--argent-color)";
							break;
					}
					line.appendChild(Eclassement);
					let Euser=document.createElement("td");
					Euser.innerText=data.user;
					Euser.addEventListener("click",function(){
						popup_open_close("actionframe");
						frames[0].view_user(data.user);
					});
					line.appendChild(Euser);
					let Epoints=document.createElement("td");
					Epoints.innerText=Math.floor(data.points.total);
					line.appendChild(Epoints);
					let Eteam=document.createElement("td");
					Eteam.innerText=data.team;
					if(data.team){
						Eteam.addEventListener("click",function(){
							popup_open_close("actionframe");
							frames[0].view_team(data.team);
						});
					}
					line.appendChild(Eteam);
					let Epoints_bat=document.createElement("td");
					Epoints_bat.innerText=Math.floor(data.points.batiments);
					line.appendChild(Epoints_bat);
					for(let a of points_medailles){
						Epoints_spe=document.createElement("td");
						Epoints_spe.innerText=affichageRessources(data.points[a]);
						line.appendChild(Epoints_spe);
					}
					let Evictoires=document.createElement("td");
					Evictoires.innerText=Math.floor(data.victoires);
					line.appendChild(Evictoires);
					document.getElementById("actual_classement").appendChild(line);
				}
			}else{
				console.error("ERROR in getting classement : code "+xhr.status);
			}
		});
	}else if(selected_classement=="teams"){
		use_api("OPTIONS","generalplay",{classement:"teams"},false,function(xhr){
			if(xhr.status==200){
				document.getElementById("teams_classement").innerHTML="";
				for(let rank in xhr.response){
					let data=xhr.response[rank];
					let line=document.createElement("tr");
					if(data.team==user.alliance){
						line.style.borderColor="#0000ff";
					}
					let Eclassement=document.createElement("td");
					Eclassement.innerText=Number(rank)+1;
					switch(rank){
						case "0":
							Eclassement.style.backgroundColor="var(--platine-color)";
							break;
						case "1":
							Eclassement.style.backgroundColor="var(--or-color)";
							break;
						case "2":
							Eclassement.style.backgroundColor="var(--argent-color)";
							break;
					}
					line.appendChild(Eclassement);
					let Eteam=document.createElement("td");
					Eteam.innerText=data.team;
					Eteam.addEventListener("click",function(){
						popup_open_close("actionframe");
						frames[0].view_user(data.team);
					});
					line.appendChild(Eteam);
					let Emembres=document.createElement("td");
					Emembres.innerText=data.membres;
					line.appendChild(Emembres);
					let Esomme=document.createElement("td");
					Esomme.innerText=Math.floor(data.somme);
					line.appendChild(Esomme);
					let Epoints=document.createElement("td");
					Epoints.innerText=Math.floor(data.moyenne);
					line.appendChild(Epoints);
					let Evictoires=document.createElement("td");
					Evictoires.innerText=Math.floor(data.victoires);
					line.appendChild(Evictoires);
					document.getElementById("teams_classement").appendChild(line);
				}
			}else{
				console.error("ERROR in getting classement : code "+xhr.status);
			}
		});
	}
}
window.onload=()=>{
	document.getElementById("popup_mask").addEventListener("click",function(){
		popup_open_close();
	});
	document.getElementById("actual_button").addEventListener("click",function(){
		select_classement("actual");
	});
	document.getElementById("teams_button").addEventListener("click",function(){
		select_classement("teams");
	});
}
var team=null;
var popups=["membres","change_description"];
var block_description_geting=false;
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
function bb_code(texte){
	let res=texte;
	res=res.replaceAll("&","&amp;");
	res=res.replaceAll("<","&lt;");
	res=res.replaceAll(">","&gt;");
	res=res.replaceAll("\n","<br>");
	let unibalises=/\[([biuspq]|sup|sub|big|small)\](.*)\[\/\1\]/;
	let oldres="";
	do{
		oldres=res;
		res=res.replace(unibalises,"<$1>$2</$1>");
	}while(oldres!=res);
	let lienbalise=/\[url=((https?:\/\/)?[-a-z0-9A-Z._](:[0-9]+)?([-a-z0-9A-Z._/#?&+%]+)?)\](.*)\[\/url\]/;
	do{
		oldres=res;
		res=res.replace(lienbalise,"<a href='$1'>$5</a>");
	}while(oldres!=res);
	let imgbalise=/\[img=((https?:\/\/)?[-a-z0-9A-Z._](:[0-9]+)?([-a-z0-9A-Z._/#?&+%]+)?)\](.*)\[\/img\]/;
	do{
		oldres=res;
		res=res.replace(imgbalise,"<img src='$1'>$5</a>");
	}while(oldres!=res);
	return res;
}
function has_team_permission(permission){
	let res=false;
	if(team.chef==username){
		res=true;
	}
	//permissions : guerre pacte finance description inviter expulser grades
	for(let grade in team.grades){
		if(team.grades[grade].posseseur==username){
			res=res||team.grades[grade][permission];
		}
	}
	return res
}
function post_getuser_action(){
	if(user.alliance){
		document.getElementById("alliance").setAttribute("used","yes");
		document.getElementById("no_alliance").removeAttribute("used");
		document.getElementById("nom").innerText=user.alliance;
		use_api("GET","teams",{"mode":"detailed"},false,function(xhr){
			if(xhr.status==200){
				team=xhr.response;
				if(team.description){
					document.getElementById("description").innerHTML=bb_code(team.description);
					if(!block_description_geting){
						document.getElementById("new_description").value=team.description;
					}
				}
				document.getElementById("actions").innerText="";
				if(has_team_permission("grades")){
					let action_button=document.createElement("div");
					action_button.classList.add("button_labeled");
					let button_image=document.createElement("img");
					button_image.src="../image/equipe/grade.png";
					button_image.classList.add("button_labeled_image");
					action_button.appendChild(button_image);
					let button_text=document.createElement("span");
					button_text.innerText="Grades";
					button_text.classList.add("button_labeled_label");
					action_button.appendChild(button_text);
					document.getElementById("actions").appendChild(action_button);
				}
				if(has_team_permission("description")){
					let action_button=document.createElement("div");
					action_button.classList.add("button_labeled");
					let button_image=document.createElement("img");
					button_image.src="../image/equipe/description.png";
					button_image.classList.add("button_labeled_image");
					action_button.appendChild(button_image);
					let button_text=document.createElement("span");
					button_text.innerText="Changer la description";
					button_text.classList.add("button_labeled_label");
					action_button.appendChild(button_text);
					action_button.addEventListener("click",function(){
						popup_open_close("change_description");
						block_description_geting=true;
					});
					document.getElementById("actions").appendChild(action_button);
				}
				if(has_team_permission("guerre")){
					let action_button=document.createElement("div");
					action_button.classList.add("button_labeled");
					let button_image=document.createElement("img");
					button_image.src="../image/equipe/guerre.png";
					button_image.classList.add("button_labeled_image");
					action_button.appendChild(button_image);
					let button_text=document.createElement("span");
					button_text.innerText="Guerres";
					button_text.classList.add("button_labeled_label");
					action_button.appendChild(button_text);
					document.getElementById("actions").appendChild(action_button);
				}
				if(has_team_permission("pacte")){
					let action_button=document.createElement("div");
					action_button.classList.add("button_labeled");
					let button_image=document.createElement("img");
					button_image.src="../image/equipe/pacte.png";
					button_image.classList.add("button_labeled_image");
					action_button.appendChild(button_image);
					let button_text=document.createElement("span");
					button_text.innerText="Pactes";
					button_text.classList.add("button_labeled_label");
					action_button.appendChild(button_text);
					document.getElementById("actions").appendChild(action_button);
				}
				let membres_button=document.createElement("div");
				membres_button.classList.add("button_labeled");
				let membres_image=document.createElement("img");
				membres_image.src="../image/equipe/membres.png";
				membres_image.classList.add("button_labeled_image");
				membres_button.appendChild(membres_image);
				let membres_text=document.createElement("span");
				membres_text.innerText="Membres";
				membres_text.classList.add("button_labeled_label");
				membres_button.appendChild(membres_text);
				membres_button.addEventListener("click",function(){
					popup_open_close("membres");
				});
				document.getElementById("actions").appendChild(membres_button);
				let finance_button=document.createElement("div");
				finance_button.classList.add("button_labeled");
				let finance_image=document.createElement("img");
				finance_image.src="../image/equipe/finance.png";
				finance_image.classList.add("button_labeled_image");
				finance_button.appendChild(finance_image);
				let finance_text=document.createElement("span");
				finance_text.innerText="Finances";
				finance_text.classList.add("button_labeled_label");
				finance_button.appendChild(finance_text);
				document.getElementById("actions").appendChild(finance_button);
				if(team.chef==username){
					let delete_button=document.createElement("div");
					delete_button.classList.add("button_labeled");
					let delete_image=document.createElement("img");
					delete_image.src="../image/equipe/supprimer.png";
					delete_image.classList.add("button_labeled_image");
					delete_button.appendChild(delete_image);
					let delete_text=document.createElement("span");
					delete_text.innerText="Supprimer l'alliance";
					delete_text.classList.add("button_labeled_label");
					delete_button.appendChild(delete_text);
					document.getElementById("actions").appendChild(delete_button);
					document.getElementById("transferer").style.display="block";
				}else{
					let leave_button=document.createElement("div");
					leave_button.classList.add("button_labeled");
					let leave_image=document.createElement("img");
					leave_image.src="../image/equipe/quitter.png";
					leave_image.classList.add("button_labeled_image");
					leave_button.appendChild(leave_image);
					let leave_text=document.createElement("span");
					leave_text.innerText="Quitter";
					leave_text.classList.add("button_labeled_label");
					leave_button.appendChild(leave_text);
					leave_button.addEventListener("click",function(){
						use_api("PATCH","users",{"action":"leave_team"},true,function(xhr){
							if(xhr.status==200){
								act_user();
							}else{
								alert("ERROR in leaving team : code "+xhr.status);
							}
						});
					});
					document.getElementById("actions").appendChild(leave_button);
					document.getElementById("transferer").style.display="none";
				}
				if(has_team_permission("inviter")){
					document.getElementById("inviter").style.display="block";
				}else{
					document.getElementById("inviter").style.display="none";
				}
				if(has_team_permission("expulser")){
					document.getElementById("expulser").style.display="block";
				}else{
					document.getElementById("expulser").style.display="none";
				}
				let members_autocomplete_list=document.getElementById("members_autocomplete_list");
				members_autocomplete_list.innerText="";
				members_list=document.getElementById("members_list");
				members_list.innerHTML="";
				for(membre of team.membres){
					let member_element=document.createElement("option");
					member_element.innerHTML=membre;
					members_autocomplete_list.appendChild(member_element);
					let line=document.createElement("tr");
					let cell1=document.createElement("td");
					cell1.innerText=membre;
					line.appendChild(cell1);
					let cell2=document.createElement("td");
					if(membre==team.chef){
						let img=document.createElement("img");
						img.classList.add("icon");
						img.src="../image/equipe/chef.png";
						cell2.appendChild(img);
					}
					
					line.appendChild(cell2);
					members_list.appendChild(line);
				}
			}else if(xhr.status==410){
				alert("L'alliance a ete supprimee");
				act_user();
			}else{
				alert("ERROR in getting team : code "+xhr.status);
			}
		});
	}else{
		document.getElementById("alliance").removeAttribute("used");
		document.getElementById("no_alliance").setAttribute("used","yes");
		document.getElementById("invitations").innerText="";
		for(invit of user.invitations){
			let inv_elem=document.createElement("div");
			inv_elem.classList.add("invitation");
			inv_elem.innerText=invit;
			let accept_button=document.createElement("img");
			accept_button.src="../image/boutons/valider.png";
			accept_button.classList.add("button");
			accept_button.addEventListener("click",function(){
				use_api("PATCH","users",{"action":"accept_invit","invit":invit},true,function(xhr){
					if(xhr.status==200){
						act_user();
					}else if(xhr.status==507){
						alert("Equipe complete (limite a 25 membres)");
					}else if(xhr.status==410){
						alert("L'equipe n'existe plus");
						act_user();
					}else{
						alert("ERROR in accepting invit : code "+xhr.status);
					}
				});
			});
			inv_elem.appendChild(accept_button);
			let decline_button=document.createElement("img");
			decline_button.src="../image/boutons/annuler.png";
			decline_button.classList.add("button");
			decline_button.addEventListener("click",function(){
				use_api("PATCH","users",{"action":"decline_invit","invit":invit},true,function(xhr){
					if(xhr.status==200){
						act_user();
					}else{
						alert("ERROR in declining invit : code "+xhr.status);
					}
				});
			});
			inv_elem.appendChild(decline_button);
			document.getElementById("invitations").appendChild(inv_elem);
		}
	}
}
window.onload=()=>{
	let members_autocomplete_list=document.createElement("datalist");
	members_autocomplete_list.id="members_autocomplete_list";
	document.body.appendChild(members_autocomplete_list);
	document.getElementById("create_team").addEventListener("click",function(){
		let data={
			"name_team":document.getElementById("name_team").value
		}
		use_api("PUT","teams",data,true,function(xhr){
			if(xhr.status==204){
				act_user()
			}else if(xhr.status==402){
				alert("Pas assez de ressoources");
			}else if(xhr.status==400){
				alert("Veuillez entrer un nom");
			}else{
				alert("ERROR in creating team : code "+xhr.status);
			}
		});
	});
	document.getElementById("popup_mask").addEventListener("click",function(){
		popup_open_close();
		block_description_geting=false;
		act_user();
	});
	document.getElementById("bouton_inviter").addEventListener("click",function(){
		let datas={
			"action":"add_invit",
			"target":document.getElementById("joueur_a_inviter").value
		}
		use_api("PATCH","users",datas,true,function(xhr){
			if(xhr.status==200){
				document.getElementById("joueur_a_inviter").value="";
			}else if(xhr.status==409){
				alert("Ce joueur a deja ete invite");
			}else if(xhr.status==404){
				alert("Ce joueur n'existe pas");
			}else{
				alert("ERROR in inviting user : code "+xhr.status);
			}
		});
	});
	document.getElementById("bouton_expulser").addEventListener("click",function(){
		let datas={
			"action":"expel_user",
			"target":document.getElementById("joueur_a_expulser").value
		}
		use_api("PATCH","users",datas,true,function(xhr){
			if(xhr.status==200){
				document.getElementById("joueur_a_expulser").value="";
				act_user();
			}else if(xhr.status==404){
				alert("Ce joueur n'est pas dans l'alliance ou n'existe pas");
			}else{
				alert("ERROR in expeling user : code "+xhr.status);
			}
		});
	});
	document.getElementById("bouton_transferer").addEventListener("click",function(){
		let datas={
			"action":"transfer_team",
			"target":document.getElementById("joueur_a_transferer").value
		}
		use_api("PATCH","users",datas,true,function(xhr){
			if(xhr.status==200){
				document.getElementById("joueur_a_transferer").value="";
				act_user();
			}else if(xhr.status==404){
				alert("Ce joueur n'est pas dans l'alliance ou n'existe pas");
			}else{
				alert("ERROR in transfering team : code "+xhr.status);
			}
		});
	});
	document.getElementById("new_description").addEventListener("change",function(){
		datas={
			"action":"change_description",
			"description":document.getElementById("new_description").value
		}
		use_api("PATCH","teams",datas,true,function(xhr){
			if(xhr.status!=200){
				alert("ERROR in editing description : code "+xhr.status);
			}
		});
	});
}

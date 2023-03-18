var team=null;
var popups=["membres","change_description","finances","grades","pactes","guerres"];
var block_description_geting=false;
var ressources=[
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
var permissions=[
	"guerre",
	"pacte",
	"strategie",
	"finance",
	"grades",
	"inviter",
	"expulser",
	"description"
]
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
function has_team_permission(permission){
	let res=false;
	if(team.chef==username){
		res=true;
	}
	//permissions : guerre pacte strategie finance description inviter expulser grades
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
				document.getElementById("preview_energie").innerText=affichageRessources(team.ressources.energie);
				for(let a of atomes){
					document.getElementById("preview_"+a).innerText=affichageRessources(team.ressources[a]);
				}
				if(team.description){
					document.getElementById("description").innerHTML=bb_code(team.description);
					if(!block_description_geting){
						document.getElementById("new_description").value=team.description;
						document.getElementById("new_color").value=team.color;
					}
				}
				let pourcent=Math.round(team.pv/team.pv_max*1000)/10;
				document.getElementById("team_pv").style.backgroundImage="linear-gradient(90deg, green "+pourcent+"%,#ffffff "+(pourcent+1)+"%)";
				document.getElementById("team_pv").innerText=affichageRessources(team.pv)+"/"+affichageRessources(team.pv_max)+" ("+pourcent+"%)";
				//Actions
				document.getElementById("actions").innerText="";
				//Grades
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
					action_button.addEventListener("click",function(){
						popup_open_close("grades");
					});
					document.getElementById("actions").appendChild(action_button);
				}
				//Description
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
				//Guerres
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
					action_button.addEventListener("click",function(){
						popup_open_close("guerres");
					});
					document.getElementById("actions").appendChild(action_button);
				}
				//Pactes
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
					action_button.addEventListener("click",function(){
						popup_open_close("pactes");
					});
					document.getElementById("actions").appendChild(action_button);
				}
				//Membres
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
				//Finances
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
				finance_button.addEventListener("click",function(){
					popup_open_close("finances");
				});
				document.getElementById("actions").appendChild(finance_button);
				//Quitter / Supprimer
				if(team.chef==username){
					let delete_button=document.createElement("div");
					delete_button.classList.add("button_labeled");
					let delete_image=document.createElement("img");
					delete_image.src="../image/autre/supprimer.png";
					delete_image.classList.add("button_labeled_image");
					delete_button.appendChild(delete_image);
					let delete_text=document.createElement("span");
					delete_text.innerText="Supprimer l'alliance";
					delete_text.classList.add("button_labeled_label");
					delete_button.appendChild(delete_text);
					delete_button.addEventListener("click",function(){
						
					})
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
								window.top.act_preview();
							}else{
								console.error("ERROR in leaving team : code "+xhr.status);
							}
						});
					});
					document.getElementById("actions").appendChild(leave_button);
					document.getElementById("transferer").style.display="none";
				}
				//Membres (interne)
				//Inviter
				if(has_team_permission("inviter")){
					document.getElementById("inviter").style.display="block";
				}else{
					document.getElementById("inviter").style.display="none";
				}
				//Expulser
				if(has_team_permission("expulser")){
					document.getElementById("expulser").style.display="block";
				}else{
					document.getElementById("expulser").style.display="none";
				}
				//Actualisation des listes
				//Utilisateurs
				let members_autocomplete_list=document.getElementById("members_autocomplete_list");
				members_autocomplete_list.innerText="";
				members_list=document.getElementById("members_list");
				members_list.innerHTML="";
				for(let membre of team.membres){
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
				//Grades
				let list_grades=document.getElementById("list_grades");
				list_grades.innerHTML="";
				for(let grade in team.grades){
					let line=document.createElement("tr");
					let cellG=document.createElement("td");
					cellG.innerText=grade;
					line.appendChild(cellG);
					let cellJ=document.createElement("td");
					cellJ.innerText=team.grades[grade].posseseur;
					line.appendChild(cellJ);
					for(perm of permissions){
						let cellP=document.createElement("td");
						let permimage=document.createElement("img");
						permimage.classList.add("icon");
						if(team.grades[grade][perm]){
							permimage.src="../image/boutons/valider.png";
						}else{
							permimage.src="../image/boutons/annuler.png";
						}
						cellP.appendChild(permimage);
						line.appendChild(cellP);
					}
					let cellA=document.createElement("td");
					let button_action=document.createElement("img");
					button_action.classList.add("button");
					button_action.src="../image/autre/supprimer.png";
					button_action.addEventListener("click",function(){
						let datas={
							"action":"delete_grade",
							"grade":grade,
						};
						use_api("PATCH","teams",datas,true,function(xhr){
							if(xhr.status==200){
								window.top.act_preview();
							}else{
								console.error("ERROR in deleting grade : code "+xhr.status);
							}
						});
					});
					cellA.appendChild(button_action);
					line.appendChild(cellA);
					list_grades.appendChild(line);
				}
				//Demandes de ressources
				if(has_team_permission("finance")){
					let list_donnation_ask=document.getElementById("list_donnation_ask");
					list_donnation_ask.innerHTML="";
					for(let requete in team.requetes_ressources){
						let line=document.createElement("tr");
						let cellJ=document.createElement("td");
						cellJ.innerText=team.requetes_ressources[requete].who;
						line.appendChild(cellJ);
						for(let a of ressources){
							let cellR=document.createElement("td");
							cellR.innerText=affichageRessources(team.requetes_ressources[requete][a]);
							line.appendChild(cellR);
						}
						let cellA1=document.createElement("td");
						let button_action1=document.createElement("img");
						button_action1.classList.add("button");
						button_action1.src="../image/boutons/valider.png";
						button_action1.addEventListener("click",function(){
							use_api("POST","teams",{"action":"accept_donnation","donnation_id":requete},true,function(xhr){
								if(xhr.status==200){
									window.top.act_preview();
								}else if(xhr.status==402){
									alert("L'alliance n'a pas assez de ressources");
								}else if(xhr.status==410){
									alert("Le joueur n'est plus dans l'alliance");
								}else{
									console.error("ERROR in accepting donnation : code "+xhr.status);
								}
							});
						});
						cellA1.appendChild(button_action1);
						line.appendChild(cellA1);
						let cellA2=document.createElement("td");
						let button_action2=document.createElement("img");
						button_action2.classList.add("button");
						button_action2.src="../image/boutons/annuler.png";
						button_action2.addEventListener("click",function(){
							use_api("POST","teams",{"action":"reject_donnation","donnation_id":requete},true,function(xhr){
								if(xhr.status==200){
									window.top.act_preview();
								}else{
									console.error("ERROR in rejecting donnation : code "+xhr.status);
								}
							});
						});
						cellA2.appendChild(button_action2);
						line.appendChild(cellA2);
						list_donnation_ask.appendChild(line);
					}
					document.getElementById("demandes").style.display="table";
					document.getElementById("transferer_ressources").style.display="inline-block";
				}else{
					document.getElementById("demandes").style.display="none";
					document.getElementById("transferer_ressources").style.display="none";
				}
				//Pactes
				let pactes_list=document.getElementById("pactes_list");
				pactes_list.innerHTML="";
				for(pacte of team.diplomatie.pactes){
					let line=document.createElement("tr");
					let cellP=document.createElement("td");
					cellP.innerText=pacte;
					line.appendChild(cellP);
					let cellA=document.createElement("td");
					let button_action=document.createElement("img");
					button_action.classList.add("button");
					button_action.src="../image/autre/supprimer.png";
					button_action.addEventListener("click",function(){
						datas={
							"action":"delete_pacte",
							"pacte":pacte
						}
						use_api("POST","teams",datas,true,function(xhr){
							if(xhr.status==200){
								window.top.act_preview();
							}else{
								console.error("ERROR in deleting pact : code "+xhr.status);
							}
						});
					});
					cellA.appendChild(button_action);
					line.appendChild(cellA);
					pactes_list.appendChild(line)
				}
				//Guerres
				let guerres_list=document.getElementById("guerres_list");
				guerres_list.innerHTML="";
				for(guerre of team.diplomatie.guerres){
					let line=document.createElement("tr");
					let cellP=document.createElement("td");
					cellP.innerText=guerre;
					line.appendChild(cellP);
					let cellA=document.createElement("td");
					let button_action=document.createElement("img");
					button_action.classList.add("button");
					button_action.src="../image/autre/supprimer.png";
					button_action.addEventListener("click",function(){
						datas={
							"action":"delete_guerre",
							"guerre":guerre
						}
						use_api("POST","teams",datas,true,function(xhr){
							if(xhr.status==200){
								window.top.act_preview();
							}else{
								console.error("ERROR in deleting war : code "+xhr.status);
							}
						});
					});
					cellA.appendChild(button_action);
					line.appendChild(cellA);
					guerres_list.appendChild(line)
				}
			}else if(xhr.status==410){
				alert("L'alliance a ete supprimee");
				window.top.act_preview();
			}else{
				console.error("ERROR in getting team : code "+xhr.status);
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
						window.top.act_preview();
					}else if(xhr.status==507){
						alert("Equipe complete (limite a 25 membres)");
					}else if(xhr.status==410){
						alert("L'equipe n'existe plus");
						window.top.act_preview();
					}else{
						console.error("ERROR in accepting invit : code "+xhr.status);
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
						window.top.act_preview();
					}else{
						console.error("ERROR in declining invit : code "+xhr.status);
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
			if(xhr.status==201){
				window.top.act_preview()
			}else if(xhr.status==402){
				alert("Pas assez de ressources");
			}else if(xhr.status==400){
				alert("Veuillez entrer un nom");
			}else{
				console.error("ERROR in creating team : code "+xhr.status);
			}
		});
	});
	document.getElementById("popup_mask").addEventListener("click",function(){
		popup_open_close();
		block_description_geting=false;
		window.top.act_preview();
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
				console.error("ERROR in inviting user : code "+xhr.status);
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
				window.top.act_preview();
			}else if(xhr.status==403){
				alert("Ce joueur est le chef : vous ne pouvez pas l'expulser");
			}else if(xhr.status==404){
				alert("Ce joueur n'est pas dans l'alliance ou n'existe pas");
			}else{
				console.error("ERROR in expeling user : code "+xhr.status);
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
				window.top.act_preview();
			}else if(xhr.status==404){
				alert("Ce joueur n'est pas dans l'alliance ou n'existe pas");
			}else{
				console.error("ERROR in transfering team : code "+xhr.status);
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
				console.error("ERROR in editing description : code "+xhr.status);
			}
		});
	});
	document.getElementById("new_color").addEventListener("change",function(){
		datas={
			"action":"change_color",
			"color":document.getElementById("new_color").value
		}
		use_api("PATCH","teams",datas,true,function(xhr){
			if(xhr.status!=200){
				console.error("ERROR in editing color : code "+xhr.status);
			}
		});
	});
	document.getElementById("donner").addEventListener("click",function(){
		let datas={"action":"give"};
		for(let a of ressources){
			datas[a]=document.getElementById("finances_"+a).valueAsNumber;
		}
		use_api("POST","teams",datas,true,function(xhr){
			if(xhr.status==200){
				for(let a of ressources){
					document.getElementById("finances_"+a).value="";
				}
				window.top.act_preview();
			}else if(xhr.status==402){
				alert("Vous n'avez pas assez de ressources");
			}else{
				console.error("ERROR in giving at team : code "+xhr.status);
			}
		});
	});
	document.getElementById("demander").addEventListener("click",function(){
		let datas={"action":"ask_donnation"};
		for(let a of ressources){
			datas[a]=document.getElementById("finances_"+a).valueAsNumber;
		}
		use_api("POST","teams",datas,true,function(xhr){
			if(xhr.status==200){
				for(let a of ressources){
					document.getElementById("finances_"+a).value="";
				}
				window.top.act_preview();
			}else{
				console.error("ERROR in asking donnation at team : code "+xhr.status);
			}
		});
	});
	document.getElementById("transferer_ressources").addEventListener("click",function(){
		let datas={
			"action":"transfer",
			"target":document.getElementById("finances_alliance").value
		};
		for(let a of ressources){
			datas[a]=document.getElementById("finances_"+a).valueAsNumber;
		}
		use_api("POST","teams",datas,true,function(xhr){
			if(xhr.status==200){
				for(let a of ressources){
					document.getElementById("finances_"+a).value="";
				}
				document.getElementById("finances_alliance").value="";
				window.top.act_preview();
			}else if(xhr.status==402){
				alert("L'alliance n'a pas assez de ressources");
			}else if(xhr.status==404){
				alert("L'alliance n'existe pas");
			}else if(xhr.status==409){
				alert("Vous devez avoir un pacte avec l'alliance cible");
			}else{
				console.error("ERROR in transfering : code "+xhr.status);
			}
		});
	});
	document.getElementById("valider_grade").addEventListener("click",function(){
		let datas={
			"action":"add_grade",
			"grade":document.getElementById("nom_grade").value,
			"posseseur":document.getElementById("posseseur_grade").value
		};
		for(let a of permissions){
			datas[a]=document.getElementById("perm_"+a+"_grade").checked;
		}
		use_api("PATCH","teams",datas,true,function(xhr){
			if(xhr.status==200){
				for(let a of permissions){
					document.getElementById("nom_grade").value="";
					document.getElementById("posseseur_grade").value="";
					document.getElementById("perm_"+a+"_grade").checked=false;
				}
				window.top.act_preview();
			}else if(xhr.status==400){
				alert("Entrez un nom de grade");
			}else if(xhr.status==404){
				alert("Le joueur n'est pas dans l'alliance");
			}else if(xhr.status==409){
				alert("Le grade existe deja");
			}else{
				console.error("ERROR in adding grade : code "+xhr.status);
			}
		});
	});
	document.getElementById("new_pacte_bouton").addEventListener("click",function(){
		datas={
			"action":"new_pacte",
			"pacte":document.getElementById("new_pacte_alliance").value
		}
		use_api("POST","teams",datas,true,function(xhr){
			if(xhr.status==200){
				document.getElementById("new_pacte_alliance").value="";
				window.top.act_preview();
			}else if(xhr.status==404){
				alert("L'alliance n'existe pas");
			}else if(xhr.status==409){
				alert("Le pacte existe deja");
			}else{
				console.error("ERROR in adding pact : code "+xhr.status);
			}
		});
	});
	document.getElementById("max_pvs").addEventListener("input",function(){
		document.getElementById("cout_max_pvs").innerText=affichageRessources(document.getElementById("max_pvs").valueAsNumber*2);
	});
	document.getElementById("add_max_pvs").addEventListener("click",function(){
		datas={
			"action":"add_max_pvs",
			"pvs":document.getElementById("max_pvs").valueAsNumber
		}
		use_api("POST","teams",datas,true,function(xhr){
			if(xhr.status==200){
				document.getElementById("max_pvs").value="";
				window.top.act_preview();
			}else if(xhr.status==402){
				alert("Pas assez de ressources");
			}else if(xhr.status==406){
				alert("Veuillez entrer un nombre");
			}else{
				console.error("ERROR in adding max HPs : code "+xhr.status);
			}
		});
	});
	document.getElementById("pvs").addEventListener("input",function(){
		document.getElementById("cout_pvs").innerText=affichageRessources(document.getElementById("pvs").valueAsNumber);
	});
	document.getElementById("add_pvs").addEventListener("click",function(){
		datas={
			"action":"add_pvs",
			"pvs":document.getElementById("pvs").valueAsNumber
		}
		use_api("POST","teams",datas,true,function(xhr){
			if(xhr.status==200){
				document.getElementById("pvs").value="";
				window.top.act_preview();
			}else if(xhr.status==402){
				alert("Pas assez de ressources");
			}else if(xhr.status==409){
				alert("Trop de PVs ajoutés");
			}else if(xhr.status==406){
				alert("Veuillez entrer un nombre");
			}else{
				console.error("ERROR in adding HPs : code "+xhr.status);
			}
		});
	});
	document.getElementById("new_guerre_bouton").addEventListener("click",function(){
		datas={
			"action":"new_guerre",
			"guerre":document.getElementById("new_guerre_alliance").value
		}
		use_api("POST","teams",datas,true,function(xhr){
			if(xhr.status==200){
				document.getElementById("new_guerre_alliance").value="";
				window.top.act_preview();
			}else if(xhr.status==404){
				alert("L'alliance n'existe pas");
			}else if(xhr.status==409){
				alert("La guerre existe deja");
			}else{
				console.error("ERROR in adding war : code "+xhr.status);
			}
		});
	});
}

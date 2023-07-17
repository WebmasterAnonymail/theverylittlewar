const max_transfer_rate=0.2;
const semi_transfer_value=1000;
var team=null;
var popups=["membres","change_description","finances","grades","strategie","pactes","guerres","diplomatical_status"];
var block_description_geting=false;
var in_reorganization=false;
var id_reorganization=null;
var target_indemnity=null;
var self_indemnity=null;
var max_indemnity=0;
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
	"diplomatie",
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
	//permissions : guerre pacte diplomatie strategie finance description inviter expulser grades
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
					action_button.appendChild(button_image);
					let button_text=document.createElement("span");
					button_text.innerText="Grades";
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
					action_button.appendChild(button_image);
					let button_text=document.createElement("span");
					button_text.innerText="Changer la description";
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
					action_button.appendChild(button_image);
					let button_text=document.createElement("span");
					button_text.innerText="Guerres";
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
					action_button.appendChild(button_image);
					let button_text=document.createElement("span");
					button_text.innerText="Pactes";
					action_button.appendChild(button_text);
					action_button.addEventListener("click",function(){
						popup_open_close("pactes");
					});
					document.getElementById("actions").appendChild(action_button);
				}
				//Strategie
				if(has_team_permission("strategie")){
					let action_button=document.createElement("div");
					action_button.classList.add("button_labeled");
					let button_image=document.createElement("img");
					button_image.src="../image/equipe/strategie.png";
					action_button.appendChild(button_image);
					let button_text=document.createElement("span");
					button_text.innerText="Stratégie de défense";
					action_button.appendChild(button_text);
					action_button.addEventListener("click",function(){
						popup_open_close("strategie");
					});
					document.getElementById("actions").appendChild(action_button);
				}
				//Membres
				let membres_button=document.createElement("div");
				membres_button.classList.add("button_labeled");
				let membres_image=document.createElement("img");
				membres_image.src="../image/equipe/membres.png";
				membres_button.appendChild(membres_image);
				let membres_text=document.createElement("span");
				membres_text.innerText="Membres";
				membres_button.appendChild(membres_text);
				membres_button.addEventListener("click",function(){
					popup_open_close("membres");
				});
				document.getElementById("actions").appendChild(membres_button);
				//Statut diplomatique
				let diplomatical_status_button=document.createElement("div");
				diplomatical_status_button.classList.add("button_labeled");
				let diplomatical_status_image=document.createElement("img");
				diplomatical_status_image.src="../image/equipe/traite.png";
				diplomatical_status_button.appendChild(diplomatical_status_image);
				let diplomatical_status_text=document.createElement("span");
				diplomatical_status_text.innerText="Statut diplomatique";
				diplomatical_status_button.appendChild(diplomatical_status_text);
				diplomatical_status_button.addEventListener("click",function(){
					popup_open_close("diplomatical_status");
					document.getElementById("new_treaty_alliance").value="";
					target_indemnity=null;
					self_indemnity=null;
					document.getElementById("create_treaty").disabled=true;
					document.getElementById("select_winer_treaty").value="draw";
					document.getElementById("indemnity_treaty").disabled=true;
					document.getElementById("indemnity_icon").style.filter="grayscale(1)";
					document.getElementById("impose_treaty").disabled=true;
					document.getElementById("impose_treaty").checked=false;
					
				});
				if(has_team_permission("diplomatie")){
					document.getElementById("create_treaty").style.display="block";
				}else{
					document.getElementById("create_treaty").style.display="none";
				}
				document.getElementById("actions").appendChild(diplomatical_status_button);
				//Finances
				let finance_button=document.createElement("div");
				finance_button.classList.add("button_labeled");
				let finance_image=document.createElement("img");
				finance_image.src="../image/equipe/finance.png";
				finance_button.appendChild(finance_image);
				let finance_text=document.createElement("span");
				finance_text.innerText="Finances";
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
					delete_button.appendChild(delete_image);
					let delete_text=document.createElement("span");
					delete_text.innerText="Supprimer l'alliance";
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
					leave_button.appendChild(leave_image);
					let leave_text=document.createElement("span");
					leave_text.innerText="Quitter";
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
				for(let pacte of team.diplomatie.pactes){
					let line=document.createElement("tr");
					let cellP=document.createElement("td");
					cellP.innerText=pacte;
					line.appendChild(cellP);
					let cellA=document.createElement("td");
					let button_action=document.createElement("img");
					button_action.classList.add("button");
					button_action.src="../image/autre/supprimer.png";
					button_action.addEventListener("click",function(){
						let datas={
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
				for(let guerre of team.diplomatie.guerres){
					let line=document.createElement("tr");
					let cellP=document.createElement("td");
					cellP.innerText=guerre;
					line.appendChild(cellP);
					let cellA=document.createElement("td");
					let button_action=document.createElement("img");
					button_action.classList.add("button");
					button_action.src="../image/autre/supprimer.png";
					button_action.addEventListener("click",function(){
						let datas={
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
				//Strategie
				let strategie_table=document.getElementById("strategie_reorganizer");
				strategie_table.innerHTML="";
				for(let id=0;id<team.diplomatie.strategie.length;id++){
					let name=team.diplomatie.strategie[id];
					let line=document.createElement("tr");
					let cellName=document.createElement("td");
					cellName.innerText=name;
					cellName.draggable=true;
					cellName.addEventListener('dragstart',function(ev){
						ev.dataTransfer.setData('text/plain',id); //données a envoyer
						// création de l'apparence du drag
						ev.dataTransfer.setDragImage(line,line.offsetWidth/2,line.offsetHeight/2);
						line.setAttribute("dragged","true");
						id_reorganization=id;
						in_reorganization=true;
						ev.dataTransfer.effectAllowed="move";
					});
					cellName.addEventListener('dragend',function(ev){
						line.removeAttribute("dragged");
						id_reorganization=null;
						in_reorganization=false;
					});
					cellName.addEventListener('dragenter',function(ev){
						if(id_reorganization>id){
							line.setAttribute("targeted","before");
						}
						if(id_reorganization<id){
							line.setAttribute("targeted","after");
						}
					});
					cellName.addEventListener('dragover',function(ev){
						ev.preventDefault();
					});
					cellName.addEventListener('dragleave',function(ev){
						line.removeAttribute("targeted");
					});
					line.addEventListener('drop',function(ev){
						line.removeAttribute("targeted");
						if(id_reorganization>id){
							team.diplomatie.strategie.splice(id,id_reorganization-id+1,team.diplomatie.strategie[id_reorganization],...team.diplomatie.strategie.slice(id,id_reorganization));
						}
						if(id_reorganization<id){
							team.diplomatie.strategie.splice(id_reorganization,id-id_reorganization+1,...team.diplomatie.strategie.slice(id_reorganization+1,id+1),team.diplomatie.strategie[id_reorganization]);
						}
						console.log(team.diplomatie.strategie);
						use_api("PATCH","teams",{"action":"change_strategie","strategie":team.diplomatie.strategie},true,function(xhr){
							if(xhr.status=200){
								window.top.act_preview();
							}else{
								console.error("ERROR in getting team : code "+xhr.status);
							}
						});
						ev.preventDefault();
					});
					line.appendChild(cellName);
					strategie_table.appendChild(line)
				}
				//Diplomatie
				let traites_div=document.getElementById("traites_list");
				traites_div.innerHTML="";
				for(let concerned_team in team.diplomatie.war_status){
					let traite=document.createElement("fieldset");
					let legende=document.createElement("legend");
					legende.innerText="Situation avec "+concerned_team;
					traite.appendChild(legende);
					
					
					traites_div.appendChild(traite);
				}
				if(has_team_permission("diplomatie")){
					let treaty_propositions_list=document.getElementById("treaty_propositions_list");
					treaty_propositions_list.innerHTML="";
					for(let concerned_team in team.diplomatie.war_status){
						let offensive=team.diplomatie.war_status[concerned_team].offensive;
						if(team.diplomatie.war_status[concerned_team].revenged){
							offensive=team.diplomatie.war_status[concerned_team].revenge;
						}
						if(offensive.peace_treatys_proposed.length>0){
							for(a=0;a<offensive.peace_treatys_proposed.length;a++){
								let line=document.createElement("tr");
								if(a==0){
									let cellTitle=document.createElement("th");
									cellTitle.innerText=concerned_team;
									cellTitle.setAttribute("rowspan",offensive.peace_treatys_proposed.length);
									line.appendChild(cellTitle);
								}
								let cellStat=document.createElement("td");
								cellStat.innerText="Aucun";
								if(offensive.peace_treatys_proposed[a].won===true){
									cellStat.innerText="Vainqueur";
								}
								if(offensive.peace_treatys_proposed[a].won===false){
									cellStat.innerText="Perdant";
								}
								line.appendChild(cellStat);
								let cellIndemn=document.createElement("td");
								if(offensive.peace_treatys_proposed[a].won!==null){
									cellIndemn.innerText=Math.floor(offensive.peace_treatys_proposed[a].indemnites);
								}
								if(offensive.peace_treatys_proposed[a].won===true){
									cellIndemn.classList.add("positive");
								}
								if(offensive.peace_treatys_proposed[a].won===false){
									cellIndemn.classList.add("negative");
								}
								line.appendChild(cellIndemn);
								let cellAc=document.createElement("td");
								let button_action1=document.createElement("img");
								button_action1.classList.add("button");
								button_action1.src="../image/boutons/valider.png";
								button_action1.addEventListener("click",function(){
									use_api("POST","teams",{"action":"accept_treaty","treaty_id":a,"treaty_team":concerned_team},true,function(xhr){
										if(xhr.status==200){
											window.top.act_preview();
										}else{
											console.error("ERROR in accepting treaty : code "+xhr.status);
										}
									});
								});
								cellAc.appendChild(button_action1);
								let button_action2=document.createElement("img");
								button_action2.classList.add("button");
								button_action2.src="../image/boutons/annuler.png";
								button_action2.addEventListener("click",function(){
									use_api("POST","teams",{"action":"reject_treaty","treaty_id":a,"treaty_team":concerned_team},true,function(xhr){
										if(xhr.status==200){
											window.top.act_preview();
										}else{
											console.error("ERROR in rejecting treaty : code "+xhr.status);
										}
									});
								});
								cellAc.appendChild(button_action2);
								line.appendChild(cellAc);
								treaty_propositions_list.appendChild(line);
							}
						}
					}
					document.getElementById("treaty_propositions").style.display="table";
				}else{
					document.getElementById("treaty_propositions").style.display="none";
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
		let datas={
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
		let datas={
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
		let datas={
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
	document.getElementById("new_treaty_alliance").addEventListener("change",function(){
		if(document.getElementById("new_treaty_alliance").value in team.diplomatie.war_status){
			let datas={
				"mode":"one",
				"team":document.getElementById("new_treaty_alliance").value
			}
			let team_war_status=team.diplomatie.war_status[document.getElementById("new_treaty_alliance").value];
			let role="offended";
			let unrole="offender";
			if(team_war_status.assailant){
				role="offender";
				unrole="offended";
			}
			let offensive=team_war_status.offensive;
			if(team_war_status.revenged){
				offensive=team_war_status.revenge;
			}
			if(!offensive.ended){
				use_api("GET","teams",datas,false,function(xhr){
					if(xhr.status==200){
						target_indemnity=xhr.response;
						use_api("GET","teams",{"mode":"one","team":user.alliance},false,function(xhr2){
							if(xhr2.status==200){
								self_indemnity=xhr2.response;
								document.getElementById("create_treaty").disabled=false;
								if(!document.getElementById("indemnity_treaty").disabled){
									document.getElementById("indemnity_icon").style.filter="grayscale(0)";
								}
								
								let winer=offensive[unrole+"_defeated"];
								winer&&=!offensive[role+"_defeated"];
								winer&&=offensive.first_defeat+(2*60*60*1000)<Date.now();
								if(winer){
									document.getElementById("impose_treaty").disabled=false;
								}else{
									document.getElementById("impose_treaty").disabled=true;
									document.getElementById("impose_treaty").checked=false;
								}
							}else{
								console.error("ERROR in getting self team : code "+xhr2.status);
							}
						});
					}else{
						console.error("ERROR in getting treaty target team : code "+xhr.status);
					}
				});
			}else{
				document.getElementById("create_treaty").disabled=true;
				document.getElementById("indemnity_icon").style.filter="grayscale(1)";
			}
		}else{
			document.getElementById("create_treaty").disabled=true;
			document.getElementById("indemnity_icon").style.filter="grayscale(1)";
		}
	});
	document.getElementById("select_winer_treaty").addEventListener("change",function(){
		if(document.getElementById("select_winer_treaty").value=="draw"){
			document.getElementById("indemnity_treaty").disabled=true;
			document.getElementById("indemnity_icon").style.filter="grayscale(1)";
		}else{
			document.getElementById("indemnity_treaty").disabled=false;
			document.getElementById("indemnity_icon").style.filter="grayscale(0)";
			let point_diff=target_indemnity.somme-self_indemnity.somme;
			let basepts=self_indemnity.somme
			if(document.getElementById("select_winer_treaty").value=="win"){
				point_diff=-point_diff;
				basepts=target_indemnity.somme;
			}
			let rate=max_transfer_rate/(1+Math.exp(point_diff*Math.log(3)/semi_transfer_value))
			max_indemnity=rate*basepts;
			document.getElementById("indemnity_treaty_value").innerText=Math.floor(max_indemnity*document.getElementById("indemnity_treaty").valueAsNumber);
		}
	});
	document.getElementById("indemnity_treaty").addEventListener("input",function(){
		document.getElementById("indemnity_treaty_value").innerText=Math.floor(max_indemnity*document.getElementById("indemnity_treaty").valueAsNumber);
	});
	document.getElementById("submit_treaty").addEventListener("click",function(){
		let datas={
			"action":"create_treaty",
			"target":document.getElementById("new_treaty_alliance").value,
			"type":document.getElementById("select_winer_treaty").value,
			"indemnity":Math.floor(max_indemnity*document.getElementById("indemnity_treaty").valueAsNumber),
			"impose":document.getElementById("impose_treaty").checked
		}
		use_api("POST","teams",datas,true,function(xhr){
			if(xhr.status==200){
				document.getElementById("new_treaty_alliance").value="";
				target_indemnity=null;
				self_indemnity=null;
				document.getElementById("create_treaty").disabled=true;
				document.getElementById("select_winer_treaty").value="draw";
				document.getElementById("indemnity_treaty").disabled=true;
				document.getElementById("indemnity_icon").style.filter="grayscale(1)";
				document.getElementById("impose_treaty").disabled=true;
				document.getElementById("impose_treaty").checked=false;
				window.top.act_preview();
			}else{
				console.error("ERROR in submiting treaty : code "+xhr.status);
			}
		});
	});
	document.getElementById("max_pvs").addEventListener("input",function(){
		document.getElementById("cout_max_pvs").innerText=affichageRessources(document.getElementById("max_pvs").valueAsNumber*2);
	});
	document.getElementById("add_max_pvs").addEventListener("click",function(){
		let datas={
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
		let datas={
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
		let datas={
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
			}else if(xhr.status==406){
				alert("Vous ne pouvez pas redeclarer une guerre si vous WIP");
			}else{
				console.error("ERROR in adding war : code "+xhr.status);
			}
		});
	});
}

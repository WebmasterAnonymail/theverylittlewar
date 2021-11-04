var team=null;
function has_team_permission(permission){
	let res=false;
	if(team.chef==username){
		res=true;
	}
	//permissions : guerre pacte finance description membres grades
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
				document.getElementById("description").innerText=team.description;
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
				if(has_team_permission("membres")){
					let action_button=document.createElement("div");
					action_button.classList.add("button_labeled");
					let button_image=document.createElement("img");
					button_image.src="../image/equipe/membres.png";
					button_image.classList.add("button_labeled_image");
					action_button.appendChild(button_image);
					let button_text=document.createElement("span");
					button_text.innerText="Gestion des membres";
					button_text.classList.add("button_labeled_label");
					action_button.appendChild(button_text);
					document.getElementById("actions").appendChild(action_button);
				}
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
				document.getElementById("actions").appendChild(leave_button);
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
}

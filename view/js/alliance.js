function post_getuser_action(){
	if(user.alliance){
		document.getElementById("alliance").setAttribute("used","yes");
		document.getElementById("no_alliance").removeAttribute("used");
		document.getElementById("nom_alliance").innerText=user.alliance;
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

window.onload=function(ev){
	document.forms.connexion.submit.addEventListener("click",function(ev){
		let api_xhr=new XMLHttpRequest();
		api_xhr.open("PUT","/api/v1/connect");
		let at_send={}
		at_send.username=document.forms.connexion.username.value;
		at_send.password=document.forms.connexion.password.value;
		api_xhr.responseType="json";
		api_xhr.send(JSON.stringify(at_send));
		api_xhr.addEventListener("readystatechange",function(ev){
			if(api_xhr.readyState==api_xhr.DONE){
				if(api_xhr.status==200){
					localStorage.setItem("token",api_xhr.response.token)
					document.getElementById("preview_username").innerText=at_send.username;
					document.getElementById("connected").style.display="block";
					document.getElementById("unconnected").style.display="none";
				}else if(api_xhr.status==401){
					alert("Mauvais pseudo/mot de passe");
				}else{
					alert("ERROR in connecting : code "+api_xhr.status+"\n Erreur : "+api_xhr.response.error);
				}
			}
		});
	});
	document.getElementById("deconexion_button").addEventListener("click",function(ev){
		let api_xhr=new XMLHttpRequest();
		let at_send=new URLSearchParams();
		at_send.append("token",localStorage.getItem("token"))
		api_xhr.open("DELETE","/api/v1/connect?"+at_send.toString());
		api_xhr.responseType="json";
		api_xhr.send();
		api_xhr.addEventListener("readystatechange",function(ev){
			if(api_xhr.readyState==api_xhr.DONE){
				localStorage.removeItem("token")
				document.getElementById("connected").style.display="none";
				document.getElementById("unconnected").style.display="block";
			}
		});
	});
	document.forms.inscription.submit.addEventListener("click",function(ev){
		let api_xhr=new XMLHttpRequest();
		api_xhr.open("PUT","/api/v1/users");
		let at_send={}
		at_send.username=document.forms.inscription.username.value;
		at_send.password=document.forms.inscription.password.value;
		api_xhr.responseType="json";
		api_xhr.send(JSON.stringify(at_send));
		api_xhr.addEventListener("readystatechange",function(ev){
			if(api_xhr.readyState==api_xhr.DONE){
				if(api_xhr.status==204){
					alert("Compte créé. Vous pouvez vous y connecter.");
				}else if(api_xhr.status==409){
					alert("Ce pseudo est deja utilise, choisissez en un autre");
				}else if(api_xhr.status==401){
					alert("Veuillez entrer un nom d'utuilateur et un mot de passe");
				}else{
					alert("ERROR in creating account : code "+api_xhr.status+"\n Erreur : "+api_xhr.response.error)
				}
			}
		});
	});
	let api_xhr=new XMLHttpRequest();
	let at_send=new URLSearchParams();
	at_send.append("token",localStorage.getItem("token"))
	api_xhr.open("GET","/api/v1/connect?"+at_send.toString());
	api_xhr.responseType="json";
	api_xhr.send();
	api_xhr.addEventListener("readystatechange",function(ev){
		if(api_xhr.readyState==api_xhr.DONE){
			if(api_xhr.response.connected){
				document.getElementById("preview_username").innerText=api_xhr.response.username;
				document.getElementById("connected").style.display="block";
				document.getElementById("unconnected").style.display="none";
			}else{
				document.getElementById("connected").style.display="none";
				document.getElementById("unconnected").style.display="block";
			}
		}
	});
}
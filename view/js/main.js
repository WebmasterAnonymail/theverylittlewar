var opened_popup_id="";
var username=null;
var user=null;
var atomes=[
	"carbone",
	"oxygene",
	"azote",
	"iode",
	"brome",
	"hydrogene",
	"soufre",
	"chlore"
];
function affichageTemps(time){
	var jours=Math.floor(time/86400000);
	if(jours==0){
		jours="";
	}else if(jours<10){
		jours="0"+String(jours)+"j ";
	}else{
		jours=String(jours)+"j ";
	}
	var heures=Math.floor((time%86400000)/3600000);
	if(heures==0){
		heures="";
	}else if(heures<10){
		heures="0"+String(heures)+"h ";
	}else{
		heures=String(heures)+"h ";
	}
	var minutes=Math.floor((time%3600000)/60000);
	if(minutes==0){
		minutes="";
	}else if(minutes<10){
		minutes="0"+String(minutes)+"m ";
	}else{
		minutes=String(minutes)+"m ";
	}
	secondes=Math.floor((time%60000)/1000);
	if(secondes==0){
		secondes="";
	}else if(secondes<10){
		secondes="0"+String(secondes)+"s ";
	}else{
		secondes=String(secondes)+"s ";
	}
	return jours+heures+minutes+secondes;
}
function affichageRessources(num){
	var si=[
	{value:1E24,symbol:"Y"},
	{value:1E21,symbol:"Z"},
	{value:1E18,symbol:"E"},
	{value:1E15,symbol:"P"},
	{value:1E12,symbol:"T"},
	{value:1E9 ,symbol:"G"},
	{value:1E6 ,symbol:"M"},
	{value:1E3 ,symbol:"K"}
	];
	for(let i=0;i<si.length;i++){
		if(num>=si[i].value){
			return Math.floor((num/si[i].value)*100)/100+si[i].symbol;
		}
	}
	return Math.floor(num);
}
function act_preview(){
	use_api("GET","users",{"mode":"detailed"},false,function(xhr){
		if(xhr.status==200){
			document.getElementById("preview_energie").innerText=affichageRessources(xhr.response.ressources.energie);
			document.getElementById("preview_energie").title=Math.floor(xhr.response.ressources.energie);
			for(let a of atomes){
				document.getElementById("preview_"+a).innerText=affichageRessources(xhr.response.ressources[a]);
				document.getElementById("preview_"+a).title=Math.floor(xhr.response.ressources[a]);
			}
			document.getElementById("preview_points").innerText=xhr.response.points.batmients;
		}else{
			alert("ERROR in getting user : code "+xhr.status);
		}
	});
	use_api("GET","users",{"mode":"events"},false,function(xhr){
		if(xhr.status==200){
			let notifbar=document.getElementById("notifbar");
			notifbar.innerText="";
			for(let event of xhr.response){
				notif=document.createElement("div");
				notif.classList.add("notif");
				switch(event.type){
					case "amelioration":
						let icon1=document.createElement("img");
						icon1.classList.add("icon");
						icon1.src="image/actions/upgrade.png";
						notif.appendChild(icon1);
						let batiment=document.createElement("span");
						batiment.style.marginLeft="10px";
						batiment.innerText=event.batiment;
						notif.appendChild(batiment);
						break;
					case "molecule":
						let icon2=document.createElement("img");
						icon2.classList.add("icon");
						icon2.src="image/actions/molecule.png";
						notif.appendChild(icon2);
						let molecule=document.createElement("span");
						molecule.style.marginLeft="10px";
						molecule.innerHTML="Mol&eacute;cule "+(event.molecule+1)+" : "+event.number+" restantes";
						notif.appendChild(molecule);
						break;
				}
				time=document.createElement("span");
				time.classList.add("notif_time");
				time.innerText=affichageTemps(event.time-Date.now());
				notif.appendChild(time);
				notifbar.appendChild(notif);
			}
		}else{
			alert("ERROR in getting user's events : code "+xhr.status);
		}
	});
	setTimeout(act_preview,2500)
}
function act_user(){
	let api_xhr=new XMLHttpRequest();
	let at_send=new URLSearchParams();
	at_send.append("mode","detailed");
	at_send.append("token",localStorage.getItem("token"));
	at_send.append("username",username);
	api_xhr.open("GET","/api/v1/users?"+at_send.toString());
	api_xhr.responseType="json";
	api_xhr.send();
	api_xhr.addEventListener("readystatechange",function(ev){
		if(api_xhr.readyState==api_xhr.DONE){
			if(api_xhr.status==200){
				user=api_xhr.response;
				if(window.post_getuser_action){
					post_getuser_action();
				}
			}else{
				alert("ERROR in getting user : code "+api_xhr.status);
			}
		}
	});
}
function use_api(method,api,data,in_body,callback){
	let api_xhr=new XMLHttpRequest();
	if(in_body){
		api_xhr.open(method,"/api/v1/"+api);
	}else{
		let at_send=new URLSearchParams();
		at_send.append("token",localStorage.getItem("token"));
		at_send.append("username",username);
		for(let b in data){
			at_send.append(b,data[b]);
		}
		api_xhr.open(method,"/api/v1/"+api+"?"+at_send.toString());
	}
	api_xhr.responseType="json";
	if(in_body){
		let at_send=data;
		at_send.token=localStorage.getItem("token");
		at_send.username=username;
		api_xhr.send(JSON.stringify(at_send));
	}else{
		api_xhr.send();
	}
	api_xhr.addEventListener("readystatechange",function(ev){
		if(api_xhr.readyState==api_xhr.DONE){
			callback(api_xhr);
		}
	});
}
window.addEventListener("load",function(ev){
	let check_connect_xhr=new XMLHttpRequest();
	let at_send=new URLSearchParams();
	at_send.append("token",localStorage.getItem("token"));
	check_connect_xhr.open("GET","/api/v1/connect?"+at_send.toString());
	check_connect_xhr.responseType="json";
	check_connect_xhr.send();
	check_connect_xhr.addEventListener("readystatechange",function(ev){
		if(check_connect_xhr.readyState==check_connect_xhr.DONE){
			if(check_connect_xhr.response.connected){
				username=check_connect_xhr.response.username;
				if(/(^\/$)|(main.html$)/.test(document.location.pathname)){
					document.getElementById("popup_mask").addEventListener("click",(ev)=>{
						document.getElementById("popup_mask").style.display="none";
						document.getElementById(opened_popup_id).setAttribute("open","no");
					});
					document.getElementById("notifbar").addEventListener("click",(ev)=>{
						document.getElementById("notifbar").setAttribute("open","yes");
						document.getElementById("popup_mask").style.display="block";
						opened_popup_id="notifbar";
					});
					
					act_preview();
				}else{
					act_user();
					setInterval(act_user,10000)
				}
			}else{
				if(/(^\/$)|(main.html$)/.test(document.location.pathname)){
					document.location.replace("html/accueil.html");
				}
			}
		}
	});
	let list_users_xhr=new XMLHttpRequest();
	let at_send2=new URLSearchParams();
	at_send2.append("mode","list");
	list_users_xhr.open("GET","/api/v1/users?"+at_send2.toString());
	list_users_xhr.responseType="json";
	list_users_xhr.send();
	list_users_xhr.addEventListener("readystatechange",function(ev){
		if(list_users_xhr.readyState==list_users_xhr.DONE){
			let user_autocomplete_list=document.createElement("datalist");
			user_autocomplete_list.id="user_autocomplete_list";
			for(let a of list_users_xhr.response){
				let user_element=document.createElement("option");
				user_element.innerHTML=a;
				user_autocomplete_list.appendChild(user_element);
			}
			document.body.appendChild(user_autocomplete_list);
		}
	});
	let list_teams_xhr=new XMLHttpRequest();
	let at_send3=new URLSearchParams();
	at_send3.append("mode","list");
	list_teams_xhr.open("GET","/api/v1/teams?"+at_send3.toString());
	list_teams_xhr.responseType="json";
	list_teams_xhr.send();
	list_teams_xhr.addEventListener("readystatechange",function(ev){
		if(list_teams_xhr.readyState==list_teams_xhr.DONE){
			let team_autocomplete_list=document.createElement("datalist");
			team_autocomplete_list.id="team_autocomplete_list";
			for(let a of list_teams_xhr.response){
				let team_element=document.createElement("option");
				team_element.innerHTML=a;
				team_autocomplete_list.appendChild(team_element);
			}
			document.body.appendChild(team_autocomplete_list);
		}
	});
})
function open_iframe(iframeid){
	let iframe=document.getElementById("iframe"+iframeid);
	iframe.setAttribute("open","yes");
	document.getElementById("popup_mask").style.display="block";
	opened_popup_id="iframe"+iframeid;
}
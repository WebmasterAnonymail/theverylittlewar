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
var batiments=[
	"generateur",
	"producteur",
	"stockage",
	"forteresse",
	"ionisateur",
	"champdeforce",
	"booster",
	"usinedexplosif",
	"condenseur",
	"lieur",
	"stabilisateur",
	"protecteur"
];
var batiment_augmentateurs=[
	"forteresse",
	"ionisateur",
	"lieur",
	"stabilisateur",
	"champdeforce",
	"usinedexplosif",
	"condenseur",
	"booster"
];
var batiment_pveurs=[
	"generateur",
	"producteur",
	"stockage",
	"protecteur"
];
var medailles=[
	"def",
	"atk",
	"mol",
	"tps",
	"prt",
	"des",
	"pil",
	"cmb"
];
var points_medailles=[
	"defense",
	"attaque",
	"molecules_crees",
	"pertes_temps",
	"pertes_combat",
	"destruction",
	"pillage",
	"combats"
];
var initiales=["C","O","N","I","Br","H","S","Cl"];
function bb_code(texte){
	let res=texte;
	res=res.replaceAll("&","&amp;");
	res=res.replaceAll("<","&lt;");
	res=res.replaceAll(">","&gt;");
	res=res.replaceAll("\n","<br>");
	let unibalises=/\[([biuspq]|sup|sub|big|small|rainbow|ec|eo|en|ei|ebr|eh|es|ecl)\](.*?)\[\/\1\]/;
	let oldres="";
	do{
		oldres=res;
		res=res.replace(unibalises,"<$1>$2</$1>");
	}while(oldres!=res);
	let lienbalise=/\[url=((https?:\/\/)?[-a-z0-9A-Z._](:[0-9]+)?([-a-z0-9A-Z._/#?&+%]+)?)\](.*?)\[\/url\]/;
	do{
		oldres=res;
		res=res.replace(lienbalise,"<a href='$1'>$5</a>");
	}while(oldres!=res);
	let imgbalise=/\[img=((https?:\/\/)?[-a-z0-9A-Z._](:[0-9]+)?([-a-z0-9A-Z._/#?&+%]+)?)\]/;
	do{
		oldres=res;
		res=res.replace(imgbalise,"<img src='$1'>");
	}while(oldres!=res);
	let colorbalise=/\[color=(#[0-9A-F]{6}|black|grey|silver|white|maroon|olive|green|teal|navy|purple|red|yellow|lime|aqua|blue|fuchsia)\](.*?)\[\/color\]/;
	do{
		oldres=res;
		res=res.replace(colorbalise,"<span style='color: $1;'>$2</span>");
	}while(oldres!=res);
	return res;
}
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
	if(time<1000){
		return "maintenant";
	}else{
		return jours+heures+minutes+secondes;
	}
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
			document.getElementById("preview_points").innerText=Math.floor(xhr.response.points.total);
			for(a=0;a<9;a++){
				frames[a].user=xhr.response;
				if(frames[a].post_getuser_action){
					frames[a].post_getuser_action();
				}
				if(frames[a][0]){
					frames[a][0].user=xhr.response;
					if(frames[a][0].post_getuser_action){
						frames[a][0].post_getuser_action();
					}
				}
			}
		}else{
			console.error("ERROR in getting user : code "+xhr.status);
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
					case "combat":
						let icon3=document.createElement("img");
						icon3.classList.add("icon");
						icon3.src="image/actions/combat.png";
						notif.appendChild(icon3);
						let beligerants=document.createElement("span");
						beligerants.style.marginLeft="10px";
						beligerants.innerText=event.atk+" vs "+event.def;
						notif.appendChild(beligerants);
						break;
					case "return":
						let icon4=document.createElement("img");
						icon4.classList.add("icon");
						icon4.src="image/actions/retour.png";
						notif.appendChild(icon4);
						let txt=document.createElement("span");
						txt.style.marginLeft="10px";
						txt.innerText="Retour d'attaque";
						notif.appendChild(txt);
						break;
				}
				time=document.createElement("span");
				time.classList.add("notif_time");
				time.innerText=affichageTemps(event.time-Date.now());
				notif.appendChild(time);
				notifbar.appendChild(notif);
			}
		}else{
			console.error("ERROR in getting user's events : code "+xhr.status);
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
	if(/(^\/$)|(\/main.html$)/.test(document.location.pathname)){
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
					for(a=0;a<9;a++){
						frames[a].username=check_connect_xhr.response.username;
						if(frames[a][0]){
							frames[a][0].username=check_connect_xhr.response.username;
						}
					}
					if(/(^\/$)|(\/main.html$)/.test(document.location.pathname)){
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
						setInterval(act_preview,1250)
					}
				}else{
					document.location.replace("html/accueil.html");
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
				for(b=0;b<9;b++){
					let user_autocomplete_list=frames[b].document.createElement("datalist");
					user_autocomplete_list.id="user_autocomplete_list";
					for(let a of list_users_xhr.response){
						let user_element=frames[b].document.createElement("option");
						user_element.innerHTML=a;
						user_autocomplete_list.appendChild(user_element);
					}
					frames[b].document.body.appendChild(user_autocomplete_list);
					if(frames[b][0]){
						let user_autocomplete_list=frames[b][0].document.createElement("datalist");
						user_autocomplete_list.id="user_autocomplete_list";
						for(let a of list_users_xhr.response){
							let user_element=frames[b][0].document.createElement("option");
							user_element.innerHTML=a;
							user_autocomplete_list.appendChild(user_element);
						}
						frames[b][0].document.body.appendChild(user_autocomplete_list);
					}
				}
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
				for(b=0;b<9;b++){
					let team_autocomplete_list=frames[b].document.createElement("datalist");
					team_autocomplete_list.id="team_autocomplete_list";
					for(let a of list_teams_xhr.response){
						let team_element=frames[b].document.createElement("option");
						team_element.innerHTML=a;
						team_autocomplete_list.appendChild(team_element);
					}
					frames[b].document.body.appendChild(team_autocomplete_list);
					if(frames[b][0]){
						let team_autocomplete_list=frames[b][0].document.createElement("datalist");
						team_autocomplete_list.id="team_autocomplete_list";
						for(let a of list_teams_xhr.response){
							let team_element=frames[b][0].document.createElement("option");
							team_element.innerHTML=a;
							team_autocomplete_list.appendChild(team_element);
						}
						frames[b][0].document.body.appendChild(team_autocomplete_list);
					}
				}
			}
		});
	}
})
function open_iframe(iframeid){
	let iframe=document.getElementById("iframe"+iframeid);
	iframe.setAttribute("open","yes");
	document.getElementById("popup_mask").style.display="block";
	opened_popup_id="iframe"+iframeid;
}
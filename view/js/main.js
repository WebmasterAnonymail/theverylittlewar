var opened_iframe_id="";
var username=null;
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
				document.getElementById("preview_energie").innerText=affichageRessources(api_xhr.response.ressources.energie);
				for(let a of atomes){
					document.getElementById("preview_"+a).innerText=affichageRessources(api_xhr.response.ressources[a]);
				}
			}else{
				alert("ERROR in getting user : code "+api_xhr.status+"\n Erreur : "+api_xhr.response.error)
			}
		}
	});
	setTimeout(act_preview,1000*60)
}
window.onload=function(ev){
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
						document.getElementById(opened_iframe_id).setAttribute("open","no");
					});
					act_preview();
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
}
function open_iframe(iframeid){
	let iframe=document.getElementById("iframe"+iframeid);
	iframe.setAttribute("open","yes");
	document.getElementById("popup_mask").style.display="block";
	opened_iframe_id="iframe"+iframeid;
}
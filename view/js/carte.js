//scrollTo = scroll = met le point sélectioné en haut a gauche
//scrollBy = défile des valeurs indiqués
var popups=["user"];
var selectedPreviewX=null;
var selectedPreviewY=null;
var selectedPreview=false;
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
function post_getuser_action(){
	use_api("GET","map",{},false,function(xhr){
		if(xhr.status==200){
			document.getElementById("map_ground").innerHTML="";
			for(let data of xhr.response){
				let elem=document.createElement("img");
				elem.classList.add("case");
				elem.id="c"+data.x+","+data.y;
				elem.style.top=(64*data.y)+"px";
				elem.style.left=(64*data.x)+"px";
				elem.src="../image/carte/"+data.size+".png";
				elem.style.backgroundColor=data.color+"40";
				if(data.user==username){
					elem.style.borderColor="#0000ff";
				}
				elem.addEventListener("mouseenter",function(){
					document.getElementById("preview_user").innerText=data.user;
					if(data.team=="NONETEAM"){
						document.getElementById("preview_team").innerText="Aucune";
					}else{
						document.getElementById("preview_team").innerText=data.team;
					}
					document.getElementById("preview_points").innerText=data.points;
					if(selectedPreview){
						document.getElementById("c"+selectedPreviewX+","+selectedPreviewY).classList.remove("selected");
					}
					document.getElementById("c"+data.x+","+data.y).classList.add("selected");
					selectedPreview=true;
					selectedPreviewX=data.x;
					selectedPreviewY=data.y;
				});
				elem.addEventListener("click",function(){
					use_api("GET","users",{"mode":"one","user":data.user},false,function(xhr){
						if(xhr.status==200){
							document.getElementById("user_name").innerText=data.user;
							if(xhr.response.alliance){
								document.getElementById("user_team").innerText=xhr.response.alliance;
							}else{
								document.getElementById("user_team").innerText="Aucune";
								document.getElementById("team_link").onclick=function(){
									
								}
							}
							document.getElementById("user_points").innerText=xhr.response.points.total;
							document.getElementById("user_victory").innerText=xhr.response.victoires;
							document.getElementById("user_position").innerText=data.x+";"+data.y;
							document.getElementById("postion_link").onclick=function(){
								document.getElementById("map_ground").scrollTo(64*data.x,64*data.y);
								popup_open_close();
							}
							document.getElementById("user_last_connexion").innerText="Il y a "+affichageTemps(Date.now()-xhr.response.lastUserCheck);
							popup_open_close("user");
						}else{
							alert("ERROR in getting user : code "+api_xhr.status);
						}
					});
				});
				document.getElementById("map_ground").appendChild(elem);
			}
		}else{
			alert("ERROR in getting map : code "+api_xhr.status);
		}
	});
}
window.onload=()=>{
	document.getElementById("popup_mask").addEventListener("click",function(){
		popup_open_close();
	});
}
var username=null;
var user=null;
var selected_image=null;
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
	let colorbalise=/\[color=(#[0-9A-Fa-f]{6}|black|grey|silver|white|maroon|olive|green|teal|navy|purple|red|yellow|lime|aqua|blue|fuchsia)\](.*?)\[\/color\]/;
	do{
		oldres=res;
		res=res.replace(colorbalise,"<span style='color: $1;'>$2</span>");
	}while(oldres!=res);
	return res;
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
				use_api("GET","users",{mode:"detailed"},false,function(xhr){
					if(xhr.status==200){
						user=xhr.response;
						document.getElementById("preview_image").src="../image/users/"+user.image_profil;
						document.getElementById("new_description").value=user.description;
					}else{
						console.error("ERROR in getting user : code "+xhr.status);
					}
				});
			}else{
				document.location.replace("html/accueil.html");
			}
		}
	});
	document.getElementById("new_image").addEventListener("input",function(ev){
		let file=document.getElementById("new_image").files[0];
		if(file){
			reader=new FileReader();
			reader.readAsDataURL(file);
			reader.onload=function(){
				document.getElementById("preview_image").src=reader.result;
				selected_image=reader.result.split(",");
			}
		}
	});
	document.getElementById("valid_image").addEventListener("click",function(ev){
		if(selected_image){
			let mime_type=selected_image[0].split(":")[1].split(";")[0];
			use_api("POST","users",{"action":"change_image","mime_type":mime_type,"data":selected_image[1]},true,function(xhr){
				if(xhr.status==200){
					document.getElementById("preview_image").src="../image/users/"+xhr.response.url;
				}else if(xhr.status==406){
					alert("Format non accepté");
				}else{
					console.error("ERROR in changing image : code "+xhr.status);
				}
			});
		}
	});
	document.getElementById("valid_password").addEventListener("click",function(ev){
		if(document.getElementById("confirm_new_password").value==document.getElementById("new_password").value){
			let datas={
				"action":"change_password",
				"password":document.getElementById("new_password").value
			}
			use_api("POST","users",datas,true,function(xhr){
				if(xhr.status==200){
					document.getElementById("new_password").value="";
					document.getElementById("confirm_new_password").value="";
				}else if(xhr.status==401){
					alert("Merci de rentrer un nouveau mot de passe");
				}else{
					console.error("ERROR in changing password : code "+xhr.status);
				}
			});
		}else{
			alert("Erreur : les deux mot de passe ne sont pas identiques");
		}
	});
	document.getElementById("new_description").addEventListener("change",function(ev){
		let datas={
			"action":"change_description",
			"description":document.getElementById("new_description").value
		}
		use_api("POST","users",datas,true,function(xhr){
			if(xhr.status==200){
				//do nothing
			}else{
				console.error("ERROR in changing description : code "+xhr.status);
			}
		});
	});
}
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
					}else{
						console.error("ERROR in getting user : code "+xhr.status);
					}
				});
			}else{
				document.location.replace("html/accueil.html");
			}
		}
	});
	document.getElementById("new_descrition").addEventListener("change",function(ev){
		
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
				}else if(xhr.status==405){
					alert("Format non accepté");
				}else{
					console.error("ERROR in changing image : code "+xhr.status);
				}
			});
		}
	});
}
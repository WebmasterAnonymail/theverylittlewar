var opened_iframe_id="";
var username=null;
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
								
							}else{
								alert("ERROR in getting user : code "+api_xhr.status)
							}
						}
					});
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
	list_users_xhr.addEventListener("readystatechange",function(ev){
		if(list_users_xhr.readyState==list_users_xhr.DONE){
			let user_autocomplete_list=document.createElement("datalist");
			user_autocomplete_list.id="user_autocomplete_list";
			for(let a of list_users_xhr.response){
				let user_element=document.createElement("option");
				user_element.innerHTML=a;
				user_autocomplete_list.appendChild(user_element);
			}
		}
	});
}
function open_iframe(iframeid){
	let iframe=document.getElementById("iframe"+iframeid);
	iframe.setAttribute("open","yes");
	document.getElementById("popup_mask").style.display="block";
	opened_iframe_id="iframe"+iframeid;
}
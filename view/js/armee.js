act_creat_mol=null;
window.onload=function(event){
	let users_xhr=new XMLHttpRequest();
	let at_send=new URLSearchParams();
	at_send.append("mode","detailed");
	at_send.append("token",localStorage.getItem("token"));
	at_send.append("username",localStorage.getItem("username"));
	users_xhr.open("GET","/api/v1/users?"+at_send.toString());
	users_xhr.responseType="json";
	users_xhr.addEventListener("readystatechange",function(ev){
		if(users_xhr.readyState==users_xhr.DONE){
			if(users_xhr.status==200){
				for(let a=0;a<5;a++){
					let mol=users_xhr.response.molecules[aLinkcolor]
				}
			}
		}
	});
}
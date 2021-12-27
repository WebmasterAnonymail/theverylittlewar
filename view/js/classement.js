var popups=["actionframe"];
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
	use_api("OPTIONS","generalplay",{},false,function(xhr){
		if(xhr.status==200){
			document.getElementById("classement").innerHTML="";
			for(let rank in xhr.response){
				let data=xhr.response[rank];
				let line=document.createElement("tr");
				if(data.user==username){
					line.style.borderColor="#0000ff";
				}
				let Eclassement=document.createElement("td");
				Eclassement.innerText=Number(rank)+1;
				switch(rank){
					case "0":
						Eclassement.style.backgroundColor="var(--platine-color)";
						break;
					case "1":
						Eclassement.style.backgroundColor="var(--or-color)";
						break;
					case "2":
						Eclassement.style.backgroundColor="var(--argent-color)";
						break;
				}
				line.appendChild(Eclassement);
				let Euser=document.createElement("td");
				Euser.innerText=data.user;
				Euser.addEventListener("click",function(){
					popup_open_close("actionframe");
					frames[0].view_user(data.user);
				});
				line.appendChild(Euser);
				let Epoints=document.createElement("td");
				Epoints.innerText=Math.floor(data.points.total);
				line.appendChild(Epoints);
				let Eteam=document.createElement("td");
				Eteam.innerText=data.team;
				line.appendChild(Eteam);
				document.getElementById("classement").appendChild(line);
			}
		}else{
			alert("ERROR in getting classemnt : code "+xhr.status);
		}
	});
}
window.onload=()=>{
	document.getElementById("popup_mask").addEventListener("click",function(){
		popup_open_close();
	});
}
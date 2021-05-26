window.onload=function(event){
	document.getElementById("ok").addEventListener("click",function(event){
		let xhr=new XMLHttpRequest();
		let at_send=document.getElementById("com").value.split(";");
		xhr.open("PATCH","/api/v1/console");
		xhr.responseType="json";
		xhr.send(JSON.stringify(at_send));
		xhr.addEventListener("readystatechange",function(ev){
			if(xhr.readyState==xhr.DONE){
				document.getElementById("res").value=xhr.response.join("\n");
			}
		});
	});
}
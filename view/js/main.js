var opened_iframe_id="";
window.onload=function(ev){
    if(/(^\/$)|(main.html$)/.test(document.location.pathname)){
        document.getElementById("popup_mask").addEventListener("click",(ev)=>{
            document.getElementById("popup_mask").style.display="none";
            document.getElementById(opened_iframe_id).setAttribute("open","no");
        });
    }
	let api_xhr=new XMLHttpRequest();
	let at_send=new URLSearchParams();
	at_send.append("token",localStorage.getItem("token"))
	api_xhr.open("GET","/api/v1/connect?"+at_send.toString());
	api_xhr.responseType="json";
	api_xhr.send();
	api_xhr.addEventListener("readystatechange",function(ev){
		if(api_xhr.readyState==api_xhr.DONE){
			if(!api_xhr.response.connected){
				document.location.replace("html/accueil.html");
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
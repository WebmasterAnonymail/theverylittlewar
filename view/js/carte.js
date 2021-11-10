//scrollTo = scroll = met le point s�lection� en haut a gauche
//scrollBy = d�file des valeurs indiqu�s
function post_getuser_action(){
	use_api("GET","map",{},false,function(xhr){
		if(xhr.status==200){
			document.getElementById("map_ground").innerHTML="";
			for(data of xhr.response){
				let elem=document.createElement("img");
				elem.classList.add("case");
				elem.id="c"+data.x+","+data.y;
				elem.style.top=(64*data.y)+"px";
				elem.style.left=(64*data.x)+"px";
				elem.src="../image/carte/"+data.size+".png";
				document.getElementById("map_ground").appendChild(elem);
			}
		}else{
			alert("ERROR in getting map : code "+api_xhr.status);
		}
	});
}
window.onload=()=>{

}
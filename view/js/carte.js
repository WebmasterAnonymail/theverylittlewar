//scrollTo = scroll = met le point sélectioné en haut a gauche
//scrollBy = défile des valeurs indiqués
window.onload=()=>{
	for(y=0;y<25;y++){
		for(x=0;x<25;x++){
			let case_elem=document.createElement("img");
			case_elem.classList.add("case");
			case_elem.id="c"+x+","+y;
			case_elem.style.top=(64*y)+"px";
			case_elem.style.left=(64*x)+"px";
			case_elem.src="../image/carte/1.png";
			document.getElementById("map_ground").appendChild(case_elem);
		}
	}
}
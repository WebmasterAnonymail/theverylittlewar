var production_QG=new Array(8)
var production_QG_rest=0
var pillage_QG=new Array(8)
var pillage_QG_rest=0
var destruction_QG=new Array(3)
var destruction_QG_rest=0
function act_QG(patch=true){
	for(let a=0;a<8;a++){
		document.getElementById("QG_production_"+atomes[a]).innerHTML=production_QG[a]*25+"%";
		document.getElementById("QG_production_rest").innerHTML=production_QG_rest;
		document.getElementById("QG_pillage_"+atomes[a]).innerHTML=pillage_QG[a]*25+"%";
		document.getElementById("QG_pillage_rest").innerHTML=pillage_QG_rest;
	}
	for(let a=0;a<3;a++){
		document.getElementById("QG_destruction_"+batiments[a]).innerHTML=destruction_QG[a]*25+"%";
		document.getElementById("QG_destruction_rest").innerHTML=destruction_QG_rest;
	}
	if(patch){
		use_api("PATCH","batiments",{
			production:production_QG,
			pillage:pillage_QG,
			destruction:destruction_QG
		},true,function(xhr){
			if(xhr.status==200){
				
			}else{
				console.error("ERROR in setting HQ params : code "+xhr.status);
			}
		});
	}
}
window.onload=()=>{
	for(let a=0;a<8;a++){
		document.getElementById("QG_button_moins_production_"+atomes[a]).addEventListener("click",()=>{
			if(production_QG[a]>1){
				production_QG[a]-=1
				production_QG_rest+=1
			}
			act_QG();
		})
	}
	for(let a=0;a<8;a++){
		document.getElementById("QG_button_plus_production_"+atomes[a]).addEventListener("click",()=>{
			if(production_QG_rest>0){
				production_QG[a]+=1
				production_QG_rest-=1
			}
			act_QG();
		})
	}
	for(let a=0;a<8;a++){
		document.getElementById("QG_button_moins_pillage_"+atomes[a]).addEventListener("click",()=>{
			if(pillage_QG[a]>1){
				pillage_QG[a]-=1
				pillage_QG_rest+=1
			}
			act_QG();
		})
	}
	for(let a=0;a<8;a++){
		document.getElementById("QG_button_plus_pillage_"+atomes[a]).addEventListener("click",()=>{
			if(pillage_QG_rest>0){
				pillage_QG[a]+=1
				pillage_QG_rest-=1
			}
			act_QG();
		})
	}
	for(let a=0;a<3;a++){
		document.getElementById("QG_button_moins_destruction_"+batiments[a]).addEventListener("click",()=>{
			if(destruction_QG[a]>1){
				destruction_QG[a]-=1
				destruction_QG_rest+=1
			}
			act_QG();
		})
	}
	for(let a=0;a<3;a++){
		document.getElementById("QG_button_plus_destruction_"+batiments[a]).addEventListener("click",()=>{
			if(destruction_QG_rest>0){
				destruction_QG[a]+=1
				destruction_QG_rest-=1
			}
			act_QG();
		})
	}
	for(let a in batiments){
		document.getElementById(batiments[a]+"_bouton").addEventListener("click",function(event){
			use_api("POST","batiments",{"batiment":batiments[a]},true,function(xhr){
				if(xhr.status==200){
					window.top.act_preview();
				}else if(xhr.status==402){
					alert("Pas assez de ressources")
				}else if(xhr.status==409){
					alert("Deja en ameliration")
				}else{
					console.error("ERROR in upgrading batiment : code "+xhr.status);
				}
			});
		})
	}
}
function post_getuser_action(){
	production_QG=user.QG.production;
	pillage_QG=user.QG.pillage;
	destruction_QG=user.QG.destruction;
	production_QG_rest=0;
	pillage_QG_rest=0;
	for(let a=0;a<8;a++){
		production_QG_rest+=4-production_QG[a];
		pillage_QG_rest+=4-pillage_QG[a];
	}
	destruction_QG_rest=0;
	for(let a=0;a<3;a++){
		destruction_QG_rest+=4-destruction_QG[a];
	}
	for(let a of batiments){
		document.getElementById(a+"_niveau").innerText=user.batiments[a];
		if(a=="protecteur"){
			document.getElementById(a+"_effet").innerText=user.batiments[a]+"%";
			document.getElementById(a+"_temps").innerText=affichageTemps(Math.sin(Math.PI*(user.batiments.protecteur+1)/200)*5*(60*60*1000));
		}else if(a=="stockage"){
			document.getElementById(a+"_effet").innerText=affichageRessources(10**(user.batiments.stockage/15)*1000);
			document.getElementById(a+"_ressources").innerText=affichageRessources(10**(user.batiments.stockage/15)*10);
			document.getElementById(a+"_ressource").innerText=affichageRessources(10**(user.batiments.stockage/15)*100);
			document.getElementById(a+"_temps").innerText=affichageTemps(Math.log2(user.batiments.stockage+1)*10*(60*1000));
			document.getElementById(a+"_amelioration").innerText=affichageRessources((10**((user.batiments.stockage+1)/15)-10**(user.batiments.stockage/15))*1000);
		}else if(a=="generateur"){
			document.getElementById(a+"_effet").innerText=affichageRessources(10**(user.batiments.generateur/15)*100)+"/h";
			document.getElementById(a+"_ressources").innerText=affichageRessources(10**(user.batiments.generateur/15)*100);
			document.getElementById(a+"_temps").innerText=affichageTemps(Math.log2(user.batiments.generateur+1)*10*(60*1000));
			document.getElementById(a+"_amelioration").innerText=affichageRessources((10**((user.batiments.generateur+1)/15)-10**(user.batiments.generateur/15))*100)+"/h";
		}else if(a=="producteur"){
			document.getElementById(a+"_effet").innerText=affichageRessources(10**(user.batiments.producteur/15)*10)+"/h";
			document.getElementById(a+"_ressources").innerText=affichageRessources(10**(user.batiments.producteur/15)*10);
			document.getElementById(a+"_temps").innerText=affichageTemps(Math.log2(user.batiments.producteur+1)*10*(60*1000));
			document.getElementById(a+"_amelioration").innerText=affichageRessources((10**((user.batiments.producteur+1)/15)-10**(user.batiments.producteur/15))*10)+"/h";
		}else{
			document.getElementById(a+"_effet").innerText=user.batiments[a]+"%";
			document.getElementById(a+"_ressources").innerText=affichageRessources((user.batiments[a]+1)**3);
			document.getElementById(a+"_temps").innerText=affichageTemps(Math.sqrt(user.batiments[a]+1)*10*(60*1000));
		}
		if(user.batiment_en_amelioration.indexOf(a)<0){
			document.getElementById(a+"_bouton").value="Ameliorer au niveau "+(user.batiments[a]+1);
			document.getElementById(a+"_bouton").disabled=false;
		}else{
			document.getElementById(a+"_bouton").value="En amelioration au niveau "+(user.batiments[a]+1);
			document.getElementById(a+"_bouton").disabled=true;
		}
	}
	for(a of batiment_pveurs){
		let total_pv=0;
		if(a=="protecteur"){
			total_pv=10**(user.batiments.protecteur/20)*10*user.batiments.protecteur;
		}else{
			total_pv=10**(user.batiments[a]/20)*1000;
		}
		let pourcent=Math.round(user.PV_batiments[a]/total_pv*1000)/10;
		document.getElementById(a+"_pv").style.backgroundImage="linear-gradient(90deg, green "+pourcent+"%,#ffffff "+(pourcent+1)+"%)";
		document.getElementById(a+"_pv").innerText=affichageRessources(user.PV_batiments[a])+"/"+affichageRessources(total_pv)+" ("+pourcent+"%)";
	}
	act_QG(false);
}
atomes=[
	"carbone",
	"oxygene",
	"azote",
	"iode",
	"brome",
	"hydrogene",
	"soufre",
	"chlore"
]
batiments_list=[
	"generateur",
	"producteur",
	"stockage",
	"forteresse",
	"ionisateur",
	"champdeforce",
	"booster",
	"usinedexplosif",
	"condenseur",
	"lieur",
	"stabilisateur",
	"protecteur"
]
var production_QG=new Array(8)
var production_QG_rest=0
var pillage_QG=new Array(8)
var pillage_QG_rest=0
var destruction_QG=new Array(3)
var destruction_QG_rest=0
function act_QG(){
	for(let a=0;a<8;a++){
		document.getElementById("QG_production_"+atomes[a]).innerHTML=production_QG[a]*25+"%";
		document.getElementById("QG_production_rest").innerHTML=production_QG_rest;
		document.getElementById("QG_pillage_"+atomes[a]).innerHTML=pillage_QG[a]*25+"%";
		document.getElementById("QG_pillage_rest").innerHTML=pillage_QG_rest;
	}
	for(let a=0;a<3;a++){
		document.getElementById("QG_destruction_"+batiments_list[a]).innerHTML=destruction_QG[a]*25+"%";
		document.getElementById("QG_destruction_rest").innerHTML=destruction_QG_rest;
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
		document.getElementById("QG_button_moins_destruction_"+batiments_list[a]).addEventListener("click",()=>{
			if(destruction_QG[a]>1){
				destruction_QG[a]-=1
				destruction_QG_rest+=1
			}
			act_QG();
		})
	}
	for(let a=0;a<3;a++){
		document.getElementById("QG_button_plus_destruction_"+batiments_list[a]).addEventListener("click",()=>{
			if(destruction_QG_rest>0){
				destruction_QG[a]+=1
				destruction_QG_rest-=1
			}
			act_QG();
		})
	}
	for(let a in batiments_list){
		document.getElementById(batiments_list[a]+"_bouton").addEventListener("click",function(event){
			let api_xhr=new XMLHttpRequest()
			let at_send={
				"username":localStorage.getItem("username"),
				"token":localStorage.getItem("token"),
				"batiment":batiments_list[a]
			}
			api_xhr.open("POST","/api/v1/batiments")
			api_xhr.responseType="json"
			api_xhr.send(JSON.stringify(at_send))
		})
	}
}
var post_getuser_action=function(){
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
	act_QG();
}
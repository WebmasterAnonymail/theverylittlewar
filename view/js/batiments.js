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
window.onload=()=>{
	production_QG=[100,100,100,100, 100,100,100,100]
	production_QG_rest=0
	for(let a=0;a<8;a++){
		document.getElementById("QG_button_moins_production_"+atomes[a]).addEventListener("click",()=>{
			if(production_QG[a]>25){
				production_QG[a]-=25
				production_QG_rest+=1
			}
			document.getElementById("QG_production_"+atomes[a]).innerHTML=production_QG[a]+"%"
			document.getElementById("QG_production_rest").innerHTML=production_QG_rest
		})
	}
	for(let a=0;a<8;a++){
		document.getElementById("QG_button_plus_production_"+atomes[a]).addEventListener("click",()=>{
			if(production_QG_rest>0){
				production_QG[a]+=25
				production_QG_rest-=1
			}
			document.getElementById("QG_production_"+atomes[a]).innerHTML=production_QG[a]+"%"
			document.getElementById("QG_production_rest").innerHTML=production_QG_rest
		})
	}
	pillage_QG=[100,100,100,100, 100,100,100,100]
	pillage_QG_rest=0
	for(let a=0;a<8;a++){
		document.getElementById("QG_button_moins_pillage_"+atomes[a]).addEventListener("click",()=>{
			if(pillage_QG[a]>25){
				pillage_QG[a]-=25
				pillage_QG_rest+=1
			}
			document.getElementById("QG_pillage_"+atomes[a]).innerHTML=pillage_QG[a]+"%"
			document.getElementById("QG_pillage_rest").innerHTML=pillage_QG_rest
		})
	}
	for(let a=0;a<8;a++){
		document.getElementById("QG_button_plus_pillage_"+atomes[a]).addEventListener("click",()=>{
			if(pillage_QG_rest>0){
				pillage_QG[a]+=25
				pillage_QG_rest-=1
			}
			document.getElementById("QG_pillage_"+atomes[a]).innerHTML=pillage_QG[a]+"%"
			document.getElementById("QG_pillage_rest").innerHTML=pillage_QG_rest
		})
	}
	destruction_QG=[100,100,100,100, 100,100,100,100]
	destruction_QG_rest=0
	for(let a=0;a<3;a++){
		document.getElementById("QG_button_moins_destruction_"+batiments_list[a]).addEventListener("click",()=>{
			if(destruction_QG[a]>25){
				destruction_QG[a]-=25
				destruction_QG_rest+=1
			}
			document.getElementById("QG_destruction_"+batiments_list[a]).innerHTML=destruction_QG[a]+"%"
			document.getElementById("QG_destruction_rest").innerHTML=destruction_QG_rest
		})
	}
	for(let a=0;a<3;a++){
		document.getElementById("QG_button_plus_destruction_"+batiments_list[a]).addEventListener("click",()=>{
			if(destruction_QG_rest>0){
				destruction_QG[a]+=25
				destruction_QG_rest-=1
			}
			document.getElementById("QG_destruction_"+batiments_list[a]).innerHTML=destruction_QG[a]+"%"
			document.getElementById("QG_destruction_rest").innerHTML=destruction_QG_rest
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
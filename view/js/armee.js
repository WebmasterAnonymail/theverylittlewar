var atomes=[
	"carbone",
	"oxygene",
	"azote",
	"iode",
	"brome",
	"hydrogene",
	"soufre",
	"chlore"
];
var create_mol_id=null;
var initiales=["C","O","N","I","Br","H","S","Cl"];
function post_getuser_action(){
	for(let a=0;a<5;a++){
		let mol=user.molecules[a];
		if(mol){
			let formule="";
			for(b in atomes){
				if(user.molecules[a][atomes[b]]){
					formule+="<e"+initiales[b].toLowerCase()+">";
					formule+=initiales[b];
					if(user.molecules[a][atomes[b]]!=1){
						formule+="<sub>"+user.molecules[a][atomes[b]]+"</sub>";
					}
					formule+="</e"+initiales[b].toLowerCase()+">";
				}
			}
			document.getElementById("formule"+a).innerHTML=formule;
			document.getElementById("number_mol"+a).innerText=user.molecules[a].number;
			document.getElementById("prix_mol"+a).style.display="none";
			document.getElementById("create_mol"+a).style.display="none";
			document.getElementById("delete_mol"+a).style.display="inline-block";
			document.getElementById("new_mol"+a).style.display="inline-block";
			document.getElementById("new_mol"+a+"_number").style.display="inline-block";
		}else{
			document.getElementById("formule"+a).innerHTML="Vide";
			document.getElementById("number_mol"+a).innerText="0";
			document.getElementById("prix_mol"+a).style.display="inline-block";
			document.getElementById("create_mol"+a).style.display="inline-block";
			document.getElementById("delete_mol"+a).style.display="none";
			document.getElementById("new_mol"+a).style.display="none";
			document.getElementById("new_mol"+a+"_number").style.display="none";
		}
	}
}
window.onload=function(event){
	document.getElementById("create_mol_valider").addEventListener("click",function(event){
		let mol_composition={}
		for(let a of atomes){
			mol_composition[a]=document.forms.create_mol_form[a].valueAsNumber;
		}
		mol_composition.mol_id=create_mol_id;
		use_api("PUT","molecules",mol_composition,true,function(xhr){
			if(xhr.status==200){
				act_user();
			}else if(xhr.status==402){
				alert("Pas assez d'énergie");
			}else{
				alert("ERROR in creating molecule : code "+xhr.status+"\n Erreur : "+api_xhr.response.error);
			}
		});
		document.forms.create_mol_form.reset();
		create_mol_id=null;
		document.getElementById("create_mol_popup").style.display="none";
	});
	document.getElementById("create_mol_annuler").addEventListener("click",function(event){
		document.forms.create_mol_form.reset();
		create_mol_id=null;
		document.getElementById("create_mol_popup").style.display="none";
	});
	for(let a=0;a<5;a++){
		document.getElementById("create_mol"+a).addEventListener("click",function(event){
			document.getElementById("create_mol_popup").style.display="block";
			create_mol_id=a;
		});
		document.getElementById("delete_mol"+a).addEventListener("click",function(event){
			use_api("DELETE","molecules",{"mol_id":a},false,function(xhr){
				if(xhr.status==200){
					act_user();
				}else{
					alert("ERROR in deleting molecule : code "+xhr.status+"\n Erreur : "+api_xhr.response.error);
				}
			});
		});
	}
}

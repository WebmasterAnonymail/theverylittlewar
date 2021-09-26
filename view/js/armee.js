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
		let mol=users_xhr.response.molecules[a];
		if(mol){
			let formule="";
			for(b in atomes){
				if(users_xhr.response.molecules[a][atomes[b]]){
					formule+="<e"+initiales[b].toLowerCase()+">";
					formule+=initiales[b];
					if(users_xhr.response.molecules[a][atomes[b]]!=1){
						formule+="<sub>"+users_xhr.response.molecules[a][atomes[b]]+"</sub>";
					}
					formule+="</e"+initiales[b].toLowerCase()+">";
				}
			}
			document.getElementById("formule"+a).innerHTML=formule;
			document.getElementById("number_mol"+a).innerHTML=users_xhr.response.molecules[a].number;
			document.getElementById("creat_mol"+a).style.display="none";
			document.getElementById("delete_mol"+a).style.display="inline-block";
			document.getElementById("new_mol"+a).style.display="inline-block";
			document.getElementById("new_mol"+a+"_number").style.display="inline-block";
		}else{
			document.getElementById("formule"+a).innerHTML="Vide";
			document.getElementById("number_mol"+a).innerHTML="0";
			document.getElementById("creat_mol"+a).style.display="inline-block";
			document.getElementById("delete_mol"+a).style.display="none";
			document.getElementById("new_mol"+a).style.display="none";
			document.getElementById("new_mol"+a+"_number").style.display="none";
		}
	}
}
window.onload=function(event){
	document.getElementById("create_mol_valider").addEventListener("click",function(event){
		mol_composition={}
		for(let a of atomes){
			mol_composition[a]=document.forms.create_mol_form[a].valueAsNumber;
		}
		use_api("PUT","molecules",mol_composition,true,function(xhr){
			if(xhr.status==200){
				act_all();
			}else if(xhr.status==401){
				alert("Vous n'êtes pas connecté");
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
		document.getElementById("creat_mol"+a).addEventListener("click",function(event){
			document.getElementById("create_mol_popup").style.display="block";
			create_mol_id=a;
		});
		document.getElementById("delete_mol"+a).addEventListener("click",function(event){
			use_api("PUT","molecules",{"mol_id":a},true,function(xhr){
				if(xhr.status==200){
					act_all();
				}else if(xhr.status==401){
					alert("Vous n'êtes pas connecté");
				}else{
					alert("ERROR in deleting molecule : code "+xhr.status+"\n Erreur : "+api_xhr.response.error);
				}
			});
		});
	}
	act_all();
}

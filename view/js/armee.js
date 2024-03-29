var create_mol_id=null;
function post_getuser_action(){
	for(let a=0;a<5;a++){
		let mol=user.molecules[a];
		if(mol){
			let formule="";
			let prix_mol=0;
			let maxmol=+Infinity;
			for(b in atomes){
				if(user.molecules[a][atomes[b]]){
					formule+="<e"+initiales[b].toLowerCase()+">";
					formule+=initiales[b];
					if(user.molecules[a][atomes[b]]!=1){
						formule+="<sub>"+user.molecules[a][atomes[b]]+"</sub>";
					}
					formule+="</e"+initiales[b].toLowerCase()+">";
					maxmol=Math.min(maxmol,user.ressources[atomes[b]]/user.molecules[a][atomes[b]]);
					prix_mol+=user.molecules[a][atomes[b]];
				}
			}
			prix_mol**=1.5;
			prix_mol/=10;
			maxmol=Math.min(maxmol,user.ressources.energie/prix_mol);
			document.getElementById("formule"+a).innerHTML=formule;
			document.getElementById("number_mol"+a).innerText=affichageRessources(user.molecules[a].number);
			document.getElementById("new_mol"+a+"_number").setAttribute("max",maxmol);
			document.getElementById("prix_mol"+a).style.display="none";
			document.getElementById("create_mol"+a).style.display="none";
			document.getElementById("delete_mol"+a).style.display="inline-block";
			document.getElementById("new_mol"+a).style.display="inline-block";
			document.getElementById("new_mol"+a+"_number").style.display="inline-block";
			document.getElementById("max_mol"+a+"_button").style.display="inline-block";
			document.getElementById("prix_new_mol"+a).style.display="inline-block";
		}else{
			document.getElementById("formule"+a).innerHTML="Vide";
			document.getElementById("number_mol"+a).innerText="0";
			document.getElementById("prix_mol"+a).style.display="inline-block";
			document.getElementById("create_mol"+a).style.display="inline-block";
			document.getElementById("delete_mol"+a).style.display="none";
			document.getElementById("new_mol"+a).style.display="none";
			document.getElementById("new_mol"+a+"_number").style.display="none";
			document.getElementById("max_mol"+a+"_button").style.display="none";
			document.getElementById("prix_new_mol"+a).style.display="none";
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
				window.top.act_preview();
			}else if(xhr.status==402){
				alert("Pas assez d'énergie");
			}else{
				console.error("ERROR in creating molecule : code "+xhr.status);
			}
		});
		document.forms.create_mol_form.reset();
		for(let a of atomes){
			let res="1";
			if(a=="azote"){
				res+=" mol/h"
			}
			if(a=="iode"){
				res="1min (demi vie)"
			}
			if(a=="chlore"){
				res+=" case/h"
			}
			document.getElementById(a+"_effet").innerText=res;
		}
		create_mol_id=null;
		document.getElementById("create_mol_popup").style.display="none";
	});
	document.getElementById("create_mol_annuler").addEventListener("click",function(event){
		document.forms.create_mol_form.reset();
		create_mol_id=null;
		document.getElementById("create_mol_popup").style.display="none";
	});
	for(let a of atomes){
		document.forms.create_mol_form[a].addEventListener("input",function(){
			let res=affichageRessources(Math.max(1,Math.asin((create_mol_form[a].valueAsNumber||0)/200)/Math.PI*2000));
			if(a=="azote"){
				res+=" mol/h"
			}
			if(a=="iode"){
				res=affichageTemps(Math.max(1,Math.asin((create_mol_form[a].valueAsNumber||0)/200)/Math.PI*2000)*60000)+"(demi vie)"
			}
			if(a=="chlore"){
				res+=" case/h"
			}
			document.getElementById(a+"_effet").innerText=res;
		});
	}
	for(let a=0;a<5;a++){
		document.getElementById("create_mol"+a).addEventListener("click",function(event){
			document.getElementById("create_mol_popup").style.display="block";
			create_mol_id=a;
		});
		document.getElementById("new_mol"+a).addEventListener("click",function(event){
			let datas={
				mol_id:a,
				mol_number:document.getElementById("new_mol"+a+"_number").valueAsNumber
			}
			use_api("POST","molecules",datas,true,function(xhr){
				if(xhr.status==200){
					window.top.act_preview();
				}else if(xhr.status==406){
					alert("Veuillez preciser une valeur");
				}else if(xhr.status==402){
					alert("Pas assez de ressources");
				}else{
					console.error("ERROR in producting molecule : code "+xhr.status);
				}
			});
		});
		document.getElementById("delete_mol"+a).addEventListener("click",function(event){
			use_api("DELETE","molecules",{"mol_id":a},false,function(xhr){
				if(xhr.status==200){
					window.top.act_preview();
				}else if(xhr.status==403){
					alert("Vous ne pouvez pas supprimer une molécule en combat");
				}else{
					console.error("ERROR in deleting molecule : code "+xhr.status);
				}
			});
		});
		document.getElementById("new_mol"+a+"_number").addEventListener("input",function(event){
			let prix_mol=0;
			for(let b of atomes){
				prix_mol+=user.molecules[a][b];
			}
			prix_mol**=1.5;
			prix_mol/=10;
			document.getElementById("prix_new_mol"+a).innerText=affichageRessources(prix_mol*(document.getElementById("new_mol"+a+"_number").valueAsNumber||0));
		});
		document.getElementById("max_mol"+a+"_button").addEventListener("click",function(event){
			document.getElementById("new_mol"+a+"_number").valueAsNumber=Math.floor(Number(document.getElementById("new_mol"+a+"_number").max)*200)/200;
		});
	}
}

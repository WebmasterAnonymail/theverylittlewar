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
function act_all(){
	let users_xhr=new XMLHttpRequest();
	let at_send=new URLSearchParams();
	at_send.append("mode","detailed");
	at_send.append("token",localStorage.getItem("token"));
	at_send.append("username",localStorage.getItem("username"));
	users_xhr.open("GET","/api/v1/users?"+at_send.toString());
	users_xhr.responseType="json";
	users_xhr.send();
	users_xhr.addEventListener("readystatechange",function(ev){
		if(users_xhr.readyState==users_xhr.DONE){
			if(users_xhr.status==200){
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
			}else{
				alert("ERROR in getting user : code "+users_xhr.status);
			}
		}
	});
}
window.onload=function(event){
	let users_xhr=new XMLHttpRequest();
	let at_send=new URLSearchParams();
	document.getElementById("create_mol_valider").addEventListener("click",function(event){
		let create_xhr=new XMLHttpRequest();
		let at_send={};
		at_send.mol_id=create_mol_id;
		at_send.token=localStorage.getItem("token");
		at_send.username=localStorage.getItem("username");
		for(let a of atomes){
			at_send[a]=document.forms.create_mol_form[a].valueAsNumber;
		}
		create_xhr.open("PUT","/api/v1/molecules");
		create_xhr.responseType="json";
		create_xhr.send(JSON.stringify(at_send));
		create_xhr.addEventListener("readystatechange",function(ev){
			if(create_xhr.readyState==create_xhr.DONE){
				if(create_xhr.status==200){
					act_all();
				}else if(create_xhr.status==401){
					alert("Vous n'êtes pas connecté");
				}else{
					alert("ERROR in creating molecule : code "+create_xhr.status);
				}
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
			let delete_xhr=new XMLHttpRequest();
			let at_send=new URLSearchParams();
			at_send.append("mol_id",a);
			at_send.append("token",localStorage.getItem("token"));
			at_send.append("username",localStorage.getItem("username"));
			delete_xhr.open("DELETE","/api/v1/molecules?"+at_send.toString());
			delete_xhr.responseType="json";
			delete_xhr.send(JSON.stringify(at_send));
			delete_xhr.addEventListener("readystatechange",function(ev){
				if(delete_xhr.readyState==delete_xhr.DONE){
					if(delete_xhr.status==200){
						act_all();
					}else if(delete_xhr.status==401){
						alert("Vous n'êtes pas connecté");
					}else{
						alert("ERROR in deleting molecule : code "+delete_xhr.status);
					}
				}
			});
		});
	}
	act_all();
}

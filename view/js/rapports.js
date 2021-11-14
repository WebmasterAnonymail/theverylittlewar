var checkbox_list=[];
var selected_reports=[];
var popups=["combat"];
function popup_open_close(at_open=null){
	document.getElementById("popup_mask").style.display="none";
	for(a of popups){
		document.getElementById("popup_"+a).style.display="none";
	}
	if(at_open){
		document.getElementById("popup_"+at_open).style.display="block";
		document.getElementById("popup_mask").style.display="block";
	}
}
function actualize_checkbox_list(){
	let checked_number=0;
	selected_reports=[];
	for(let a of checkbox_list){
		if(a.checked){
			checked_number++;
			let id=a.id.substring(8);
			id=id.replaceAll("_","");
			selected_reports.push(parseInt(id,36));
		}
	}
	if(checked_number==0){
		document.getElementById("general_checkbox").checked=false;
		document.getElementById("general_checkbox").indeterminate=false;
	}else if(checked_number==checkbox_list.length){
		document.getElementById("general_checkbox").checked=true;
		document.getElementById("general_checkbox").indeterminate=false;
	}else{
		document.getElementById("general_checkbox").indeterminate=true;
	}
}
function encodeIdInId(at_encode){
	let id=Number(at_encode).toString(36);
	while(id.length<3){
		id="_"+id;
	}
	return("checkbox"+id);
}
function post_getuser_action(){
	list=document.getElementById("reports_list");
	list.innerHTML="";
	for(let a in user.raports){
		let line=document.createElement("tr");
		let cellCheck=document.createElement("td");
		let selectBox=document.createElement("input");
		selectBox.type="checkbox";
		selectBox.id=encodeIdInId(a);
		selectBox.checked=selected_reports.indexOf(Number(a))>=0;
		checkbox_list[a]=selectBox;
		selectBox.onchange=actualize_checkbox_list;
		cellCheck.appendChild(selectBox);
		line.appendChild(cellCheck);
		switch(user.raports[a].type){
			case "combat":
				let cellType=document.createElement("td");
				cellType.innerText=user.raports[a].result;
				line.appendChild(cellType);
				break;
		}
		let cellDate=document.createElement("td");
		let date=new Date(user.raports[a].time);
		cellDate.innerText=date.toLocaleString();
		line.appendChild(cellDate);
		let cellDelete=document.createElement("td");
		let imgDelete=document.createElement("img");
		imgDelete.src="../image/autre/supprimer.png";
		imgDelete.classList.add("button");
		imgDelete.addEventListener("click",function(ev){
			let datas={
				"action":"delete_report",
				"reports":[Number(a)]
			}
			use_api("PATCH","users",datas,true,function(xhr){
				if(xhr.status==200){
					act_user();
				}else{
					alert("ERROR in deleting reports : code "+xhr.status);
				}
			});
			ev.stopPropagation();
		});
		if(!user.raports[a].readed){
			line.style.fontWeight="bold";
		}
		cellDelete.appendChild(imgDelete);
		line.addEventListener("click",function(){
			let datas={
				"action":"read_report",
				"report":Number(a)
			}
			use_api("PATCH","users",datas,true,function(xhr){
				if(xhr.status==200){
					act_user();
				}else{
					alert("ERROR in reading report : code "+xhr.status);
				}
			});
			alert("IN DEV")
			let title_cmb=document.getElementById("title_cmb");
			title_cmb.innerText="";
			let cmbimg=document.createElement("img");
			cmbimg.src="../image/actions/combat.png";
			cmbimg.classList.add("icon");
			title_cmb.appendChild(cmbimg);
			let atkspan=document.createElement("span");
			atkspan.innerText=user.raports[a].atkant;
			cmbimg.insertAdjacentElement("beforebegin",atkspan);
			let defspan=document.createElement("span");
			defspan.innerText=user.raports[a].defant;
			cmbimg.insertAdjacentElement("afterend",defspan);
			let winimg=document.createElement("img");
			winimg.src="../image/ressources/victoires.png";
			winimg.classList.add("icon");
			if(user.raports[a].win=="atk"){
				atkspan.insertAdjacentElement("beforebegin",winimg);
			}
			if(user.raports[a].win=="def"){
				defspan.insertAdjacentElement("afterend",winimg);
			}
			popup_open_close("combat");
		});
		line.appendChild(cellDelete);
		list.appendChild(line);
	}
	if(checkbox_list.length>user.raports.length){
		checkbox_list.splice(user.raports.length,checkbox_list.length-user.raports.length);
	}
}
window.onload=()=>{
	document.getElementById("general_checkbox").onchange=function(){
		if(!document.getElementById("general_checkbox").indeterminate){
			if(document.getElementById("general_checkbox").checked){
				for(let a of checkbox_list){
					a.checked=true;
				}
			}else{
				for(let a of checkbox_list){
					a.checked=false;
				}
			}
			actualize_checkbox_list();
		}
	}
	document.getElementById("delete_selected").addEventListener("click",function(){
		let datas={
			"action":"delete_report",
			"reports":selected_reports
		}
		use_api("PATCH","users",datas,true,function(xhr){
			if(xhr.status==200){
				act_user();
			}else{
				alert("ERROR in deleting reports : code "+xhr.status);
			}
		});
	});
	document.getElementById("popup_mask").addEventListener("click",function(){
		popup_open_close();
	});
}
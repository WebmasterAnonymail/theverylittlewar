var fs_mode=null;
function HTMLString(obj,also_whitespaces=false){
	let result=String(obj);
	result=result.replaceAll(/&/g,"&amp;");
	result=result.replaceAll(/</g,"&lt;");
	result=result.replaceAll(/>/g,"&gt;");
	if(also_whitespaces){
		result=result.replaceAll(/\n/g,"<br>");
	}
	return result;
}
//Stringeur
function ConvertToHTMLForPre(obj){
	let result="";
	switch(typeof(obj)){
		case "boolean":
			result="<font color='#0000ff'>"+HTMLString(obj)+"</font>";
			break;
		case "number":
			result="<font color='#00ff00'>"+HTMLString(obj)+"</font>";
			break;
		case "string":
			result="<font color='#ff0000'>"+HTMLString(obj)+"</font>";
			break;
		case "bigint":
			result="<font color='#ffff00'>"+HTMLString(obj)+"</font>";
			break;
		case "symbol":
			result="<font color='#ff00ff'>"+HTMLString(obj)+"</font>";
			break;
		case "function":
			result="<font color='#00ffff'>"+HTMLString(obj)+"</font>";
			break;
		default:
			if((obj instanceof Array)||(obj instanceof ArrayBuffer)/*||(obj instanceof TypedArray)*/||(obj instanceof Set)||(obj instanceof Map)){
				result="[\n";
				for(val of obj){
					result=result+"<tab>"+ConvertToHTMLForPre(val)+"</tab>"+"\n";
				}
				result=result+"]";
			}else if(obj instanceof Boolean){
				result="<font color='#0000ff'>"+HTMLString(obj)+"</font>";
			}else if(obj instanceof Number){
				result="<font color='#00ff00'>"+HTMLString(obj)+"</font>";
			}else if(obj instanceof String){
				result="<font color='#ff0000'>"+HTMLString(obj)+"</font>";
			}else if(obj instanceof Date){
				result="<font color='#008000'>"+obj.toLocaleDateString()+"-"+obj.toLocaleTimeString()+"</font>";
			}else if(obj instanceof RegExp){
				result="<font color='#800000'>"+HTMLString(obj.source)+"\t"+obj.flags+"</font>";
			}else if(obj instanceof Error){
				result="<font color='#808000'>"+HTMLString(obj.name)+":\n"+HTMLString(obj.message)+"</font>";
			}else if(obj===undefined){
				result="<font color='#808080'>undefined</font>";
			}else if(obj===null){
				result="<font color='#808080'>null</font>";
			}else if(obj instanceof Node){//protection contre les sur-devlopements
				result="<font color='#000000'>Node</font>";
			}else if(obj instanceof Window){//protection contre les sur-devlopements
				result="<font color='#000000'>Window</font>";
			}else{
				result="{\n";
				for(prop in obj){
					result=result+"<tab>"+HTMLString(prop)+":"+ConvertToHTMLForPre(obj[prop])+"</tab>"+"\n";
				}
				result=result+"}";
			}
	}
	return result;
}
window.onload=function(event){
	document.getElementById("ok_commande").addEventListener("click",function(event){
		let xhr=new XMLHttpRequest();
		let at_send=document.getElementById("com").value.split(";");
		xhr.open("PATCH","/api/v1/console");
		xhr.responseType="json";
		xhr.send(JSON.stringify(at_send));
		xhr.addEventListener("readystatechange",function(ev){
			if(xhr.readyState==xhr.DONE){
				document.getElementById("res_commande").innerHTML=ConvertToHTMLForPre(xhr.response);
			}
		});
	});
	document.getElementById("ok_fs").addEventListener("click",function(event){
		let xhr=new XMLHttpRequest();
		let at_send=new URLSearchParams();
		at_send.append("path",document.getElementById("path").value);
		xhr.open(document.forms.fs.action.value,"/api/v1/console?"+at_send.toString());
		fs_mode=document.forms.fs.action.value;
		if(fs_mode=="OPTIONS"){
			xhr.responseType="json";
		}else{
			xhr.responseType="text";
		}
		xhr.send(JSON.stringify({content:document.getElementById("content_fs").value}));
		xhr.addEventListener("readystatechange",function(ev){
			if(xhr.readyState==xhr.DONE){
				if(xhr.status==200){
					if(fs_mode=="OPTIONS"){
						document.getElementById("res_file_fs").style.display="none";
						document.getElementById("res_dir_fs").style.display="block";
						while(document.getElementById("res_dir_fs").childElementCount>0){
							document.getElementById("res_dir_fs").removeChild(document.getElementById("res_dir_fs").firstElementChild);
						}
						for(let filename of xhr.response){
							let line=document.createElement("div");
							line.classList.add("fileline");
							let namecell=document.createElement("div");
							namecell.classList.add("namecell");
							namecell.innerText=filename
							line.appendChild(namecell);
							let pathbutton=document.createElement("input");
							pathbutton.value="Y aller";
							pathbutton.type="button";
							pathbutton.addEventListener("click",function(ev){
								if(!document.getElementById("path").value.endsWith("/")){
									document.getElementById("path").value+="/"
								}
								document.getElementById("path").value+=filename
							});
							line.appendChild(pathbutton);
							document.getElementById("res_dir_fs").appendChild(line)
						}
					}else if(fs_mode=="GET"){
						document.getElementById("res_dir_fs").style.display="none";
						document.getElementById("res_file_fs").style.display="block";
						document.getElementById("res_file_fs").innerText=xhr.response;
					}else{
						document.getElementById("res_dir_fs").style.display="none";
						document.getElementById("res_file_fs").style.display="none";
					}
				}else{
					alert("ERROR "+xhr.status)
				}
			}
		});
	});
}
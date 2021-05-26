function HTMLString(obj,also_whitespaces=false){
	let result=String(obj);
	result=result.replace(/&/,"&amp;");
	result=result.replace(/>/,"&gt;");
	result=result.replace(/</,"&lt;");
	if(also_whitespaces){
		result=result.replace(/\n/,"<br>");
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
	document.getElementById("ok").addEventListener("click",function(event){
		let xhr=new XMLHttpRequest();
		let at_send=document.getElementById("com").value.split(";");
		xhr.open("PATCH","/api/v1/console");
		xhr.responseType="json";
		xhr.send(JSON.stringify(at_send));
		xhr.addEventListener("readystatechange",function(ev){
			if(xhr.readyState==xhr.DONE){
				document.getElementById("res").innerHTML=ConvertToHTMLForPre(xhr.response);
			}
		});
	});
}
var position=0; //0:forum;1:sujets;2:messages;
var forum_id=0;
var subject_id=0;
var message_id=0;
var is_edit=false;
var list_subjects=[];
var list_subject_elements=[];
var list_messages=[];
var list_message_elements=[];
class subject{
	constructor(_id,_name,_read=false,_own=false){
		this.id=_id;
		this.name=_name;
		this.read=_read;
		this.own=_own;
	}
}
class message{
	constructor(_id,_title,_author,_author_avatar,_date,_content,_own){
		this.id=_id;
		this.title=_title;
		this.author=_author;
		this.author_avatar=_author_avatar;
		this.date=_date;
		this.content=_content;
		this.own=_own;
	}
}
function act_forum(){
	if(position==0){
		document.getElementById("forums_list").style.display="flex";
		document.getElementById("subjects_list").style.display="none";
		document.getElementById("messages_list").style.display="none";
		document.getElementById("new_forum").style.display="flex";
		document.getElementById("new_subject").style.display="none";
		document.getElementById("new_message").style.display="none";
		document.getElementById("edit_message").style.display="none";
	}else if(position==1){
		//ici, on récupère la liste des sujets
		for(z=0;z<50;z++){
			list_subjects[z]=new subject(z+1,"Sujet "+z,(z%2)==0,(z%3)==0)
		}
		//précédament : un test
		if(list_subject_elements.length<list_subjects.length){
			for(let b=list_subject_elements.length;b<list_subjects.length;b++){
				list_subject_elements[b]=document.createElement("div");
				list_subject_elements[b].classList.add("forum");
				list_subject_elements[b].onclick=function(){
					position=2;
					subject_id=0;
					act_forum();
				}
				let _status=document.createElement("img");
				_status.src="../image/forum/vide.png";
				_status.classList.add("status");
				list_subject_elements[b].appendChild(_status);
				let _name=document.createElement("span");
				_name.innerText="";
				_name.classList.add("forum_name");
				list_subject_elements[b].appendChild(_name)
				document.getElementById("subjects_list").appendChild(list_subject_elements[b]);
			}
		}
		for(let a=0;a<list_subject_elements.length;a++){
			list_subject_elements[a].onclick=function(){
				position=2;
				subject_id=list_subjects[a].id;
				act_forum();
			}
			list_subject_elements[a].children[1].innerText=list_subjects[a].name;
			if(list_subjects[a].read){
				if(list_subjects[a].own){
					list_subject_elements[a].children[0].src="../image/forum/exclamation.png";
				}else{
					list_subject_elements[a].children[0].src="../image/forum/question.png";
				}
			}else{
				list_subject_elements[a].children[0].src="../image/forum/vide.png";
			}
			list_subject_elements[a].scrollIntoView()
		}
		document.getElementById("forums_list").style.display="none";
		document.getElementById("subjects_list").style.display="flex";
		document.getElementById("messages_list").style.display="none";
		document.getElementById("new_forum").style.display="none";
		document.getElementById("new_subject").style.display="flex";
		document.getElementById("new_message").style.display="none";
		document.getElementById("edit_message").style.display="none";
	}else{
		//ici, on récupère la liste des messages
		for(y=0;y<50;y++){
			list_messages[y]=new message(y+1,"Message "+y,"Testeur","background.png","2020/06/13 18:20:10","Forum:"+forum_id+";Sujet:"+subject_id+";",(y%5)==0)
		}
		//précédament : un test
		if(list_message_elements.length<list_messages.length){
			for(let d=list_message_elements.length;d<list_messages.length;d++){
				list_message_elements[d]=document.createElement("div");
				list_message_elements[d].classList.add("forum");
				let _infos=document.createElement("div");
				let _avatar=document.createElement("img");
				_avatar.src="../image/users/icone.png";
				_avatar.classList.add("message_avatar");
				_infos.appendChild(_avatar);
				let _textinfo=document.createElement("div");
				_textinfo.classList.add("message_textinfo");
				let _title=document.createElement("span");
				_title.classList.add("message_title")
				_title.innerText="";
				_textinfo.appendChild(_title);
				_textinfo.appendChild(document.createElement("br"));
				let _username=document.createElement("span");
				_username.classList.add("message_username")
				_username.innerText="";
				_textinfo.appendChild(_username);
				_textinfo.appendChild(document.createElement("br"));
				let _datetime=document.createElement("span");
				_datetime.classList.add("message_datetime");
				_datetime.innerText="";
				_textinfo.appendChild(_datetime);
				_infos.appendChild(_textinfo);
				let _edit_button=document.createElement("img");
				_edit_button.setAttribute("src","../image/forum/editer.png");
				_edit_button.classList.add("message_edit_button");
				_edit_button.setAttribute("onclick","is_edit=true;message_id=0;act_forum();");
				_infos.appendChild(_edit_button);
				list_message_elements[d].appendChild(_infos);
				list_message_elements[d].appendChild(document.createElement("div"));
				document.getElementById("messages_list").appendChild(list_message_elements[d]);
			}
		}else if(list_message_elements.length>list_messages.length){
			for(let e=list_message_elements.length-1;e>list_messages.length-1;e--){
				document.getElementById("messages_list").removeChild(list_message_elements[e]);
				list_message_elements.splice(e,1)
			}
		}
		for(let f=0;f<list_message_elements.length;f++){
			list_message_elements[f].children[0].children[0].src="../image/users/"+list_messages[f].author_avatar;
			list_message_elements[f].children[0].children[1].children[0].innerText=list_messages[f].title;
			list_message_elements[f].children[0].children[1].children[2].innerText=list_messages[f].author;
			list_message_elements[f].children[0].children[1].children[4].innerText=list_messages[f].date;
			if(list_messages[f].own){
				list_message_elements[f].children[0].children[2].style.display="inline";
				list_message_elements[f].children[0].children[2].setAttribute("onclick","is_edit=true;message_id="+list_messages[f].id+";act_forum();")
			}else{
				list_message_elements[f].children[0].children[2].style.display="none";
			}
			list_message_elements[f].children[1].innerText=list_messages[f].content;
			if(is_edit){
				if(list_message_elements[f].id==message_id){
					list_message_elements[f].scrollIntoView()
				}
			}else{
				list_message_elements[f].scrollIntoView()
			}
		}
		document.getElementById("forums_list").style.display="none";
		document.getElementById("subjects_list").style.display="none";
		document.getElementById("messages_list").style.display="flex";
		document.getElementById("new_forum").style.display="none";
		document.getElementById("new_subject").style.display="none";
		if(is_edit){
			document.getElementById("new_message").style.display="none";
			document.getElementById("edit_message").style.display="flex";  
		}else{
			document.getElementById("new_message").style.display="flex";
			document.getElementById("edit_message").style.display="none";  
		}
		
	}	
}
window.onload=(ev)=>{
	document.getElementById("to_top_return").addEventListener("click",function(){
		document.getElementById("messages_list").scrollTo({
			top:0,
			left:0,
			behavior:'smooth'
		});
	});
	document.getElementById("to_bottom_return").addEventListener("click",function(){
		document.getElementById("messages_list").scrollTo({
			top:document.getElementById("messages_list").scrollHeight,
			left:0,
			behavior:'smooth'
		});
	});
}
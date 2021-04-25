window.onload=function(ev){
    document.forms.connexion.submit.addEventListener("click",function(ev){
        let api_xhr=new XMLHttpRequest();
        api_xhr.open("POST","/api/v1/connect");
        let at_send={}
        at_send.username=document.forms.connexion.username.value;
        at_send.password=document.forms.connexion.password.value;
        api_xhr.send(JSON.stringify(at_send));
        api_xhr.addEventListener("readystatechange",function(ev){
            if(api_xhr.readyState==api_xhr.DONE){
                if(api_xhr.status==200){
                    //connecté
                }else if(api_xhr.status==401){
                    alert("Mauvais pseudo/mot de passe");
                }else{
                    alert("ERROR : code "+api_xhr.status)
                }
            }
        })
    });
    document.forms.inscription.submit.addEventListener("click",function(ev){
        let api_xhr=new XMLHttpRequest();
        api_xhr.open("PUT","/api/v1/users");
        let at_send={}
        at_send.username=document.forms.inscription.username.value;
        at_send.password=document.forms.inscription.password.value;
        api_xhr.send(JSON.stringify(at_send));
        api_xhr.addEventListener("readystatechange",function(ev){
            if(api_xhr.readyState==api_xhr.DONE){
                if(api_xhr.status==200){
                    console.log(api_xhr.reponseText)
                }else if(api_xhr.status==409){
                    alert("Ce pseudo est deja utilise, choisissez en un autre");
                }else{
                    alert("ERROR : code "+api_xhr.status)
                }
            }
        })
    });
}
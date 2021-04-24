var opened_iframe_id="";
window.onload=function(ev){
    if(/(^\/$)|(main.html$)/.test(document.location.pathname)){
        document.getElementById("popup_mask").addEventListener("click",(ev)=>{
            document.getElementById("popup_mask").style.display="none";
            document.getElementById(opened_iframe_id).setAttribute("open","no");
        })
    }
}
function open_iframe(iframeid){
    let iframe=document.getElementById("iframe"+iframeid);
    iframe.setAttribute("open","yes");
    document.getElementById("popup_mask").style.display="block";
    opened_iframe_id="iframe"+iframeid;
}
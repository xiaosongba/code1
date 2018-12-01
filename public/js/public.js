
window.onload=function(){
    var hidden=document.getElementById("hidden");

var lan=document.getElementById("lan");
// console.log(hidden);
var a=document.cookie;
var name=a.split(";")[2].split("=")[1];

var flag=a.split(";")[1].split("=")[1];
console.log(name);
// console.log( typeof flag);
// console.log(hidden);
// console.log(lan);


console.log(flag);

if(flag=="false"){
    console.log("影藏")
    hidden.style.display="none";
    // {document.getElementById("hello").innerHTML = "<iframe src= height=400 width=300></iframe>";}
    lan.innerHTML=name;
}else{
    console.log("显示")
    hidden.style.display="block";
    lan.innerHTML=name+"   "+"<h1>管理员</h1>"
}

}
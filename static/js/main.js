function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function setCookie(cname, cvalue, exminutes) {
    let d = new Date();
    d.setTime(d.getTime() + (exminutes*60*1000));
    let expires = "expires="+ d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function applyDicts(target, from){
    return Object.assign({}, target, from);
}

var dataAPI = {};
var marks = [];

function marksGen(cab_id, grp_id) {
    let t = String(cab_id).charAt(0) + String(cab_id).charAt(2) + String(cab_id).charAt(4),
        n = parseInt(t);
    var marks = Array(n);
    let r = parseInt(String(grp_id).charAt(1) + String(grp_id).charAt(2) + String(grp_id).charAt(3));
    for (let l = 0; l < n; l++) {
        let e = r - 100 + Math.floor(200 * Math.random());
        marks[l] = l == Math.round(n / 3) || l == Math.round(n / 2) ? r : e;
    }
    return marks;
}

function LoginAPI(login, pass){
    return $.ajax({
        type: "POST",
        url: "https://cabinet.kpi.kharkov.ua/servlets/servlet_kab_stud.php",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            email: login,
            fio_student: "快是慢，慢是快",
            page: 1,
            pass: pass,
        }),
        success: function(data){
            dataAPI["General"] = data;
            pageModules["General"].updatefn(dataAPI);
            marks = marksGen(dataAPI["General"]["st_cod"], dataAPI["General"]["gid"]);
        }
    });
}

function getPage(page){
    pageNum = {
        "Gradebook":2,
        "Rating":5,
        "Curriculum":4
    }
    return $.ajax({
        type: "POST",
        url: "https://cabinet.kpi.kharkov.ua/servlets/servlet_kab_stud.php",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            email: login,
            fio_student: "快是慢，慢是快",
            page: pageNum[page],
            marks: marks,
            semester: selected_smr.split("_")[1],
            pass: passw,
        }),
        success: function(data){
            if (dataAPI[page] == undefined){
                dataAPI[page] = {};
            }
            dataAPI[page][selected_smr] = data;
            pageModules[page].updatefn(dataAPI);
            
        }
    });
}

const log_win      = document.getElementById("login_div");
const side_panel   = document.getElementById("side_panel");
const main_panel   = document.getElementById("main_panel");
const eula_accept  = document.getElementById("accept");

var current_page = getCookie("current_page"); if(current_page == ""){current_page="General";}
var selected_smr = getCookie("selected_smr"); if(selected_smr == ""){selected_smr="sem_1";}
var login        = getCookie("user");
var passw        = getCookie("pass");

function changePage(){
    for(let pg in pageModules){
        try {
            pageModules[pg].hide();
        } catch {}
    }
    try{
        pageModules[current_page].show();
    } catch {}
}

function showContent(){
    main_panel.style.right  = "0";
}

function hideContent(){
    main_panel.style.right  = "-90vw";
}

function showMain(){
    document.getElementById(current_page).attributes.class.value = "menu_button, current_page";
    main_panel.style.right  = "0";
    log_win.style.top       = "150%";
    side_panel.style.left   = "calc(-30vw + 0.5em)";
}

function hideMain(){
    main_panel.style.right  = "-90vw";
    log_win.style.top       = "33%";
    side_panel.style.left   = "-60vw";
}

$(document).ready(function () {

    var content      = {};
    var ret          = NaN;

    function getData(page){
        return $.ajax({
            type: "POST",
            url: "/",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                type: "get_data",
                login: login,
                passw: passw,
                page: page
            }),
            success: function(data){
                content = applyDicts(content, data.content);
                for(let fn in pageModules){
                    pageModules[fn].update(content);
                }
                ret = data.status;
            }
        });
    }

    function loginfn(lg) {
        login = lg[0];
        passw = lg[1];
        $.when(LoginAPI(login, passw)).done(function(a){
            console.log(dataAPI);
            console.log(current_page);
            if(current_page != "General") {
                getPage(current_page);

            }
            changePage(current_page);
            showMain();
        });
    }

    if(current_page == ""){ current_page = "General"; }

    // Авто-логин  

    /*if(login != "" && passw != ""){
        loginfn([login, passw]);
    }*/

    // Костыль. Изначально скорость анимации = 0, чтобы после
    // автологина showMain() мгновенно заканчивал анимацию
    setTimeout(function(){document.querySelector(':root').style.setProperty("--anim_speed", "1s")}, 500);

    // Логин

    $("#done").click( function(){
        loginfn([$("#login").val(), $("#pass").val()]);
    });

    $("#accept").click( () => {
        document.getElementById("about_site").style.setProperty("top", "-100%")
    })

    // Смена страниц
    
    $(".menu_button").on("click", function(){
        event.stopPropagation();
        event.stopImmediatePropagation();
        if(current_page == null) {current_page = this.attributes.id.value;}
        if(this.attributes.id.value != current_page){
            let prev_butt = document.getElementById(current_page);
            prev_butt.attributes.class.value = "menu_button";
            this.attributes.class.value = "menu_button, current_page";
            current_page = this.attributes.id.value;
            if(dataAPI[current_page] == undefined || (dataAPI[current_page][selected_smr] == undefined && current_page != "General")){ 
                getPage(current_page);
            }
            setCookie("current_page", current_page, 360*24*60);
            hideContent();
            setTimeout(changePage, 950);
            setTimeout(showContent, 1000);
        } 
    });    

    // Логаут

    $("#logout").click( function() {
        deleteAllCookies();
        hideMain();
    });
});
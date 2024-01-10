const page = {
    name: "",
    page: "",
    semChoise: true,
    update: function(cont){},
    hide: function(){
        this.page.style.display = "none";
    },
    show: function(){
        this.page.style.display = "block";
        const semplace = document.getElementById("semplace");
        if (this.semChoise == true) {
            semplace.style.display = "block";
        } else {
            semplace.style.display = "none";
        }
    },
    new: function(name, updatefn){
        const newPage = {...page};
        newPage.name = name;
        newPage.page = document.getElementById("page_" + name);
        newPage.updatefn = updatefn;
        delete newPage.new;
        return newPage;
    },
}

var pageModules = {};
const semChoise = document.createElement('div');
semChoise.innerHTML = `
<table style="width: min-content; margin-left: auto; margin-right: auto;" id="selectsmr">
    <tr>
        <th>
            <input type="button"   value="1"      class="sem_button",     name="sem_1"          id="sem_1">
        </th>
        <th>
            <input type="button"   value="2"      class="sem_button",     name="sem_2"          id="sem_2">
        </th>
        <th>
            <input type="button"   value="3"      class="sem_button",     name="sem_3"          id="sem_3">
        </th>
        <th>
            <input type="button"   value="4"      class="sem_button",     name="sem_4"          id="sem_4">
        </th>
        <th>
            <input type="button"   value="5"      class="sem_button",     name="sem_5"          id="sem_5">
        </th>
        <th>
            <input type="button"   value="6"      class="sem_button",     name="sem_6"          id="sem_6">
        </th>
        <th>
            <input type="button"   value="7"      class="sem_button",     name="sem_7"          id="sem_7">
        </th>
        <th>
            <input type="button"   value="8"      class="sem_button",     name="sem_8"          id="sem_8">
        </th>
        <th>
            <input type="button"   value="9"      class="sem_button",     name="sem_9"          id="sem_9">
        </th>
        <th>
            <input type="button"   value="10"     class="sem_button",     name="sem_10"         id="sem_10">
        </th>
        <th>
            <input type="button"   value="11"     class="sem_button",     name="sem_11"         id="sem_11">
        </th>
        <th>
            <input type="button"   value="12"     class="sem_button",     name="sem_12"         id="sem_12">
        </th>
    </tr>
</table>`

// Нужно передёрнуть после каждой смены родителя
// UPD: Уже не нужно, но пускай останеться

function reFapSemselect() {
    $(".sem_button").on("click", function(){
        event.stopPropagation();
        event.stopImmediatePropagation();
        if(selected_smr == null || selected_smr == ""){
            selected_smr = this.attributes.id.value;
        }
        if(this.attributes.id.value != selected_smr){
            let prev_butt = document.getElementById(selected_smr);
            prev_butt.attributes.class.value = "sem_button";
            this.attributes.class.value = "sem_button, current_page";
            selected_smr = this.attributes.id.value;
            console.log(current_page, selected_smr);
            if(dataAPI[current_page] == undefined || dataAPI[current_page][selected_smr] == undefined){
                getPage(current_page);
            }
            pageModules[current_page].updatefn(dataAPI);
            setCookie("selected_smr", selected_smr, 360*24*60);
        }
    });
    const asds = document.getElementsByClassName("sem_button");
    for(var i = 0; i < asds.length; ++i){if(asds[i].id == selected_smr) { asds[i].attributes.class.value = "sem_button, current_page";} else { asds[i].attributes.class.value = "sem_button"; }}
}
const CNF_DATA_DIR = "media/conf_data/";
const CNF_BASE_FILE_NAME = "base_cnf_list.json";

/*
1. Alle JSON Files (Namen) einlesen
2. Nach Auswahl das entsprechende JSON File einlesen
3. StepByStep durchloopen und inhalten laden+anzeigen
 */
let nextStepBtn = document.body.querySelector("#Fortschritt");
let resetBtn = document.body.querySelector("#reset-button");
let htmlIDContent = document.body.querySelector("#step-content");
let baseCnfData = undefined;
let stepData = undefined;
let currentStep = 0;

/**
 * Laden der Basisinformationen, welche die Übersicht über alle Konfigurationsdateien beinhaltet.
 */
function loadBaseConfigData(){
    fetch(CNF_DATA_DIR + CNF_BASE_FILE_NAME)
        .then(res => res.json())
        .then(json => {
            baseCnfData = json;
            loadConfigChooser();
        });
}

/**
 * Interface zur Auswahl der Konfiguration manipulieren.
 * (Anwendung der Informationen aus der BaseCnfList Json)
 */
function loadConfigChooser(){
    let html = "<div id='cnfChooser'>" +
        "<h2>Konfiguration</h2>" +
        "<span>Wählen Sie das zu konfigurierende Level</span>" +
        "<form>" +
        "<select id='selectedCnfFile'>";
    for (const id in baseCnfData) {
        html += "<option value='"+baseCnfData[id]["cnfJsonPath"]+"'>"+baseCnfData[id]["name"]+"</option>";
    }
    html +=
        "</select>" +
        "</form> </div>"
    htmlIDContent.innerHTML = html;
}

/**
 * Spezifische Informationen zu einer Konfiguration laden
 * @param fileName Name der KonfigurationsJson
 */
function loadConfigurationData(fileName) {
    fetch(CNF_DATA_DIR + fileName)
        .then(res => res.json())
        .then(json => {
            stepData = json;
            currentStep = 0;
            loadStep( stepData[currentStep]["title"], stepData[currentStep]["imgPath"], stepData[currentStep]["htmlPath"]);
        });
}

/**
 * Laden der Informationen zu einem einzelnen Step
 */
function loadStep(title, imgPath, htmlPath) {
    fetch(CNF_DATA_DIR + htmlPath)
        .then(result => result.text())
        .then(html => {
            let bastelbude = "";
            bastelbude += "<span id='innerTitle'>" + title + "</span>"
            bastelbude += "<span id='innerImg'><img src='" + CNF_DATA_DIR + imgPath + "'></span>"
            bastelbude += "<span id='innerHtml'>" + html + "</span>"
            htmlIDContent.innerHTML = bastelbude;
        });
}

nextStepBtn.addEventListener("click", evt => {
    if(stepData === undefined){
        let e = htmlIDContent.querySelector("#selectedCnfFile");
        loadConfigurationData(e.options[e.selectedIndex].value);
    } else {
        if(stepData.length-1 <= currentStep){
            loadStep("Konfiguration abgeschlossen", "cnf_done/cnf_done.png", "cnf_done/cnf_done.html");
        } else {
            currentStep ++;
            loadStep( stepData[currentStep]["title"], stepData[currentStep]["imgPath"], stepData[currentStep]["htmlPath"]);
        }
    }
});

resetBtn.addEventListener("click",evt => {
    stepData = undefined;
    loadConfigChooser();
});

loadBaseConfigData();


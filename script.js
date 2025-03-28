this.onload = async function () {
    let collection = await fetch("./luoghiInteresse.geojson").then(response => response.json());

    //Map inizialization Castelluccio dei Sauri
    const map = L.map('map', { center: [41.304745, 15.477774], minZoom: 1, zoom: 8 });
    let brightMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

     //Single Markers Castelluccio dei Sauri 
     var myIcon = L.icon({
        iconUrl: './img/logo.png',
        iconSize: [65, 65],
        });
    
        var singleMarker = L.marker([41.304745, 15.477774], { icon: myIcon, draggable:true});
        var popup = singleMarker.bindPopup('<div> <h1>Castelluccio dei Sauri</h1> <img src="./img/Castelluccio.jpg"></div>', {
            maxWidth: "auto"}).openPopup();
        popup.addTo(map);

    let darkMap = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });

    var acquerelliMap = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'jpg' 
    });

    var wms = L.tileLayer.wms("http://localhost:8080/geoserver/wms", {
    layers: 'cite:UCP_rilevanza naturalistica',
    format: 'image/png',
    transparent: true,
    attribution: "wms test"
    });

    heatPoints = collection["features"].map(feature => [feature["geometry"]["coordinates"][1], feature["geometry"]["coordinates"][0]]);
    let heatLayer = L.heatLayer(heatPoints).addTo(map);

    let markerClusters = L.markerClusterGroup();
    const features = collection.features;

    let corrispondenze = {
        "Castelli, torri e architetture di pregio": "storia.png",
        "Musei, gallerie, biblioteche e teatri storici": "arte.png",
        "Luoghi sacri": "religioso.png",
        "Aree archeologiche": "archaeological.png",
        "Borghi storici": "village.png",
        "Siti rupestri": "cave-painting.png",
        "Siti Unesco e Bandiere Arancioni" : "unesco.png",
        "Trulli, masserie e frantoi": "trullo.png",
        "Luoghi della fede" : "church.png",
        "Aree naturali protette" : "area.png",
        "Gravine, canyon e paesaggio rurale" : "canyon.png",
        "Localita termali" : "spa.png",
        "Localita sportive" : "sport.png",
        "Citta dell'olio e del vino" : "wine.png",
        "Citta dei riti e delle tradizioni" : "tradizioni.png",
        "Masserie didattiche e agrimusei" : "masseria.png",
        "Spiagge, calette e grotte marine" : "beach.png",
        "Localita costiere" : "coast.png",
        "Bandiere Blu" : "flag.png",
        "Porti e approdi turistici" : "ancora.png"
    }


    const DIRECTORY = "./icons/";
    for (let feature of features) {

        var placeIcon = L.icon({
            iconUrl: DIRECTORY + corrispondenze[feature.properties["area"]],
            iconRetinaUrl: DIRECTORY + corrispondenze[feature.properties["area"]],
            iconSize: [48, 48]
            // iconAnchor: [9, 21],
            // popupAnchor: [0, -14]
        });

           

        let popup = `<strong>${feature.properties.area}</strong><br/><i><h2>${feature.properties.nomeLuogo}</h2></i><br/><a>https://www.viaggiareinpuglia.it</a><p><i>${feature.properties.descrizioneBreve}</i></p><p>${feature.properties.descrizione}</p><br><img src='${feature.properties.urlImage}'/>`;
        let marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], { icon: placeIcon }).bindPopup(popup, {maxWidth: "auto"}).openPopup();
        markerClusters.addLayer(marker);
    }
    map.addLayer(markerClusters);


 /*=======================================================================
                                LAYER CONTROL
    =======================================================================*/


    let baseLayers = {
        "Light mode": brightMap,
        "Dark mode": darkMap,
        "Dipinto mode": acquerelliMap
    }

    let overLayers = {
        "First Marker": singleMarker,
        "HeatMap": heatLayer,
        "Marker clusters": markerClusters,
        "Web Map Service" : wms
    }

    L.control.layers(baseLayers, overLayers).addTo(map);
}






 
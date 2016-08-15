var capabilitiesconfig = {
	host: window.location.hostname,
	prefix: "/",
	port: 443,
    identity: config.identity,
	isSecure: true
};
require.config({
	baseUrl: "https://localhost/resources"
});

require( ['js/qlik', 'jquery'], function ( qlik, $ ) {

    QlikUseActive = true;
    var app = qlik.openApp('engineData', capabilitiesconfig);

    app.clearAll();

    app.getObject(objectid[1]).then(model => {
 
        var template = '<select><option value="default">Filter by month</option>' + model.layout.qListObject.qDataPages[0].qMatrix.map(d => {
            return '<option value="' + d[0].qElemNumber + '">' + d[0].qText + '</option>'
        }).join('\n') + '</select>'

        $('#filters').append(template);
        $('select').on('change', function(ev) {
            if (this.value !== 'default') {
                model.enigmaModel.selectListObjectValues('/qListObjectDef', [+this.value], true);
            } else {
                app.clearAll();
            }
        })

    });

    app.visualization.create('barchart', [
        'StartWeekDay',
        '=Sum(calories)'
    ])
    .then(model => {
        console.log(model)
        model.show('calories')
    });

    app.visualization.create('linechart', [
        'StartMonth',
        '=Sum(calories)'
    ])
    .then(model => {
        console.log(model)
        model.show('calories2')
    });    

    $('<button> Get new data </button>').on('click', () => {
    app.doReload().then(() => $('select').val('default'));
    }).appendTo($('#reload'));

    $('<button> Clear Selections </button>').on('click', () => {
    app.clearAll().then(() => $('select').val('default'));
    }).appendTo($('#reload'));

});
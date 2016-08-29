var capabilitiesconfig = {
	host: window.location.hostname,
	prefix: config.prefix,
	port: config.isSecure ? 443 : 80,
    identity: config.identity,
	isSecure: config.isSecure
};
require.config({
	baseUrl: (capabilitiesconfig.isSecure ? 'https://' : 'http://') + window.location.hostname + "/ondemand/resources"
});

require( ['js/qlik', 'jquery'], function ( qlik, $ ) {

    QlikUseActive = true;
    var isReloading = false;
    var app = qlik.openApp('8e6da2eb-c72d-44da-a4b0-ac0e905b6487', capabilitiesconfig);

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
        model.show('calories')
    });

    app.visualization.create('linechart', [
        'StartMonth',
        '=Sum(calories)'
    ])
    .then(model => {
        model.show('calories2')
    });    

    $('<button> Get new data </button>').on('click', () => {
        if (isReloading) return;
        isReloading = true;
        app.doReload().then(() => {
            isReloading = false;
            $('select').val('default')
        });
    }).appendTo($('#reload'));

    $('<button> Clear Selections </button>').on('click', () => {
    app.clearAll().then(() => $('select').val('default'));
    }).appendTo($('#reload'));

});
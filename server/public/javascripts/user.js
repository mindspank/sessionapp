console.log(config);

qsocks.Connect(config)
.then(global => global.getActiveDoc())
.then(doc => console.log(doc))
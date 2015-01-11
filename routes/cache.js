/* jshint node:true */

/*
 * Cache related operation
 */
var WXS = require('../wxs');
var wxsclient;
var stub = {
    cache: new Object(),

    put: function(key, val, cb) {
        this.cache[key] = val;
        cb();
    },

    get: function(key, cb) {
        cb(this.cache[key]);
    },

    remove: function(key, cb) {
        delete this.cache[key];
        cb();
    }
};

// either use the real DataCache service if available or fall back onto a local in-memory stub
if(process.env.hasOwnProperty("VCAP_SERVICES")) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var wxsprops = getEnv(env);

    // validate that not only are we within bluemix, but we have a bound DataCache service
    if(typeof wxsprops != "undefined") {
    	if(wxsprops.hasOwnProperty("gridName")) wxsclient = new WXS(wxsprops);
    } else {
    	console.log("WARNING: using non-persistent in memory storage instead of DataCache.");
	wxsclient = stub;
    }
} else {
    console.log("WARNING: using non-persistent in memory storage instead of DataCache.");
    wxsclient = stub;
}

exports.getCache = function(req, res) {
	var key = req.params.key;
	console.log("get key:" + key);
	wxsclient.get(key, function(wxsres) {
		res.json({
			value : wxsres
		});
	});
};

exports.putCache = function(req, res) {
	var key = req.query.key;
	var value = req.query.value;
	wxsclient.put(key, value, function() {
		res.json({
			value : "Put successfully."
		});
	});
};

exports.removeCache = function(req, res) {
	var key = req.params.key;
	wxsclient.remove(key, function() {
		res.json({
			value : "Remove successfully."
		});
		console.log('finished remove');
	});
};

/**
 * Need to ignore the version number of DataCache when getting the credentials.
 */
function getEnv(vcapEnv) {
   for (var serviceOfferingName in vcapEnv) {
   	    if (vcapEnv.hasOwnProperty(serviceOfferingName) &&
   	    		serviceOfferingName.indexOf("DataCache-") === 0) {
   	    	var serviceBindingData = vcapEnv[serviceOfferingName][0];
   	    	return serviceBindingData.credentials;
   	    }
   }
}
#!/usr/bin/env node

if (process.argv.length != 3) {
    console.error('Usage: node ' + process.argv[1] + ' on_time.csv')
    return
}

var fs = require('fs'),
    Transform = require('stream').Transform,
    util = require('util'),
    got = require('got'),
    omit = require('lodash.omit'),
    csv = require('csv-parser'),
    through = require('through2'),
    geojsonStream = require('geojson-stream');


// Transform sctreamer to remove first line
function RemoveFirstLine(args) {
    if (!(this instanceof RemoveFirstLine)) {
        return new RemoveFirstLine(args);
    }
    Transform.call(this, args);
    this._buff = '';
    this._removed = false;
}
util.inherits(RemoveFirstLine, Transform);

RemoveFirstLine.prototype._transform = function (chunk, encoding, done) {
    if (this._removed) { // if already removed
        this.push(chunk); // just push through buffer
    } else {
        // collect string into buffer
        this._buff += chunk.toString();

        // check if string has newline symbol
        if (this._buff.indexOf('\n') !== -1) {
            // push to stream skipping first line
            this.push(this._buff.slice(this._buff.indexOf('\n') + 2));
            // clear string buffer
            this._buff = null;
            // mark as removed
            this._removed = true;
        }
    }
    done();
};

var usAirports = {}

fs.createReadStream(process.argv[2])
    .pipe(RemoveFirstLine())
    .pipe(csv())
    .on('data', function (data) {
        usAirports[data['EST']] = data;
    });

/**
 * Download and output airport database
 *
 * http://openflights.org/data.html#airport
 */
got('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat')
    .pipe(csv({
        headers: [
            'id',
            'name',
            'city',
            'country',
            'faa',
            'icao',
            'lat',
            'lng',
            'alt',
            'tz-offset',
            'dst',
            'tz'
        ]
    }))
    .pipe(through.obj(function (row, enc, cb) {
        if (row.faa in usAirports) {
            row.on_time = parseFloat(usAirports[row.faa]["N/A(PCT_ONTIME_ARR)"]);
            row.description = usAirports[row.faa]["Description"];
            this.push({
                type: 'Feature',
                properties: omit(row, ['lat', 'lng']),
                geometry: {
                    type: 'Point',
                    coordinates: [
                        parseFloat(row.lng),
                        parseFloat(row.lat)
                    ]
                }
            });
        }
        cb();
    }))
    .pipe(geojsonStream.stringify())
    .pipe(process.stdout);
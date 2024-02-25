
const { app } = require('electron');
const fs = require('fs');
var fse = require('fs-extra');

const path = require('path');
const sqlite3 = require('sqlite3').verbose();
let db;
let allSongs;
let bookMarkedSongs;

exports.inititateDB = async () => {
    let dbPath = path.join(app.getPath('documents'), 'StreamPro');
    this.createFileIfNotExists(dbPath, "database.sqlite", '');
    dbPath = path.join(app.getPath('documents'), 'StreamPro/database.sqlite');
    db = new sqlite3.Database(dbPath);


    db.run(("CREATE TABLE IF NOT EXISTS songs (id INTEGER PRIMARY KEY,uuid TEXT, title TEXT, body TEXT,  created TIMESTAMP, updated TIMESTAMP default current_timestamp )"));

    db.run(("CREATE TABLE IF NOT EXISTS local_connections (id INTEGER PRIMARY KEY,uuid TEXT, url TEXT, passcode TEXT,  created TIMESTAMP, updated TIMESTAMP default current_timestamp )"));

    db.run(("CREATE TABLE IF NOT EXISTS registration_info (id INTEGER PRIMARY KEY,uuid TEXT, license_key TEXT, license_owner TEXT, license_owner_email TEXT,ngrok_key TEXT,ngrok_bearertoken TEXT,device_id TEXT,device_name TEXT,firestore_apikey TEXT TEXT,firestore_projectid TEXT,firestore_appid TEXT,last_sync_date timestamp, documentid TEXT,auto_sync TEXT default 0, created TIMESTAMP, updated TIMESTAMP  default current_timestamp)"));

    var exec = require('child_process').exec;

    // exec("runas /noprofile /user:Administrator chmod -R 777 'C:/Program Files (x86)/vMix/titles'",
    //     function (error, stdout, stderr) {
    //         console.log('stdout: ' + stdout);
    //         console.log('stderr: ' + stderr);
    //         if (error !== null) {
    //             console.log('exec error: ' + error);
    //         }
    //     });
    // exec("cp src/helpers/handlers.js 'C:/Program Files (x86)/vMix/titles'",
    //     function (error, stdout, stderr) {
    //         console.log('stdout: ' + stdout);
    //         console.log('stderr: ' + stderr);
    //         if (error !== null) {
    //             console.log('exec error: ' + error);
    //         }
    //     });

    var sourceDir = '/tmp/mydir';
    var destDir = 'C:/Program Files (x86)/vMix/titles';


    // if folder doesn't exists create it
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    fse.copy('resources/vmix-assets', destDir, (err) => {
        if (err) throw err;
        console.log('File was copied to destination');
    });


    destDir = path.join(app.getPath('documents'), 'StreamPro/virtual_monitor_installer');
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        fse.copy('resources/virtual_monitor_installer', destDir, (err) => {
            if (err) throw err;
            console.log('File was copied to destination');
        });
    }

    setTimeout(() => {
        db.run(("CREATE UNIQUE INDEX IF NOT EXISTS idx_songs_uuid ON songs(uuid)"));
    }, 1000);


    return db

};

exports.createFileIfNotExists = (directoryPath, fileName, content) => {
    const filePath = path.join(directoryPath, fileName);

    fs.mkdir(directoryPath, { recursive: true }, (mkdirErr) => {
        if (mkdirErr) {
            console.error('Error creating directory:', mkdirErr);
            return;
        }

        fs.access(filePath, fs.constants.F_OK, (accessErr) => {
            if (!accessErr) {
                console.log('File already existss.');
                return;
            }

            fs.writeFile(filePath, content, (writeErr) => {
                if (writeErr) {
                    console.error('Error creating file:', writeErr);
                    return;
                }

                console.log('File created successfully!');
            });
        });
    });
}

exports.loadInitialData = () => {
    allSongs = new Promise((resolve, reject) => {
        db.all('SELECT * FROM songs', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
    return allSongs

}
exports.loadInitialBookMarkedData = () => {
    // Perform data loading logic
    // Return the loaded data
    bookMarkedSongs = new Promise((resolve, reject) => {
        db.all('SELECT * FROM songs where bookmarked = 1', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });

    return bookMarkedSongs
    // console.log('here')
    // return { message: 'Hello from the main process!' };

}

exports.db = db;
exports.allSongs = allSongs;
exports.bookMarkedSongs = bookMarkedSongs;


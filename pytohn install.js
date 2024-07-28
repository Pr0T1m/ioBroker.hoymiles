const { exec } = require('child_process');
const os = require('os');

if (os.platform() === 'win32') {
    exec('install.bat', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing install.bat: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
} else {
    exec('bash install.sh', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing install.sh: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
}
const { app, BrowserWindow,ipcMain } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on('btnclick', (event,username,password,version,forge) => {
	const fs=require("fs");
	const settings=require("./settings.json");
	settings["username"]=username;
	settings["password"]=password;
	fs.writeFile("./settings.json",JSON.stringify(settings),(err)=>{console.log(err)})
    const { Client, Authenticator } = require('minecraft-launcher-core');
    const launcher = new Client();

    let opts = {
        clientPackage: null,
        // For production launchers, I recommend not passing 
        // the getAuth function through the authorization field and instead
        // handling authentication outside before you initialize
        // MCLC so you can handle auth based errors and validation!
        authorization: Authenticator.getAuth(username, password),
        root: "./minecraft",
        version: {
            number: version,
            type: "release"
        },
        memory: {
            max: "6G",
            min: "4G"
        },
        forge:forge
    }
    
    launcher.launch(opts);
    
    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));
  })
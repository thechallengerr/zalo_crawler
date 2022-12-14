# Crawler app : Craw data from facebook and zalo using Selenium ![Selenium](/src/img/selenium-seeklogo.com.svg)

## **How to use**

### **1. Install NodeJS**
- Download `NodeJs` from [NodeJS Website]( https://nodejs.org/en/download/) 
- Install **NodeJS**
  - Once the installer finishes downloading, launch it. Open the **downloads** link in your browser and click the file. Or, browse to the location where you have saved the file and double-click it to launch.
  -  The system will ask if you want to run the software – click **Run**.
  -  You will be welcomed to the Node.js Setup Wizard – click **Next**.
  -  On the next screen, review the license agreement. Click **Next** if you agree to the terms and install the software.
  -  The installer will prompt you for the installation location. Leave the default location, unless you have a specific need to install it somewhere else – then click **Next**.
  -   The wizard will let you select components to include or remove from the installation. Again, unless you have a specific need, accept the defaults by clicking **Next**.
  -   Finally, click the **Install** button to run the installer. When it finishes, click **Finish**.
- Verify installation of `NodeJS` and `npm`

```javascript
node -v
```
```javascript
npm -v
```
### **2. Install Selenium**
  - Install Selenium library using `npm`:
  ```javascript
  npm i selenium-webdriver
  ```
  - Download browser driver (Chromium/Chrome, IE, Firefox,Microsoft Edge, ...). In this case, we use Chrome driver
    - Go to [Chrome Driver download page](https://chromedriver.chromium.org/downloads) and download the version which is the same as your chrome browser version. Chrome browser version can be found at `chrome://settings/help`
    - Extract it into `path/to/VSS_bot_emotion`
### **3. Start using the app**
- Clone repo from git 
```javascript
git clone <repo_link>
```

- Go to folder VSS_bot_emotion

- Open terminal/cmd here and run the command to install `node_modules`:

```javascript 
npm install
```

- Start server using node 
```javascript 
npm start
```

- Open browser and go to `https://localhost:8888`


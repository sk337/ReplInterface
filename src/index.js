import fetch from "node-fetch";
import { spawnSync } from "child_process";


/**
 * Module for interacting with Replit services.
 * @class Replit
 */
export default class Replit {
  /**
   * Creates an instance of Replit.
   * @throws {Error} Throws an error if the hostname is not found in the output of replit-git-askpass.
   */
  constructor() {
    /**
     * The hostname for Replit services.
     * @type {string}
     */
    this.hostname=""
    let fileCont = spawnSync("sh", ["-c", "cat $(which replit-git-askpass)"]);

    if (!(fileCont.output + "").includes("localhost")) {
      throw Error("Hostname Not found");
    }
    
    this.hostname =
      "http://" + (fileCont.output + "").match(/localhost:\d{1,6}/i);
  }

  /**
   * Gets the GitHub token from the Replit services.
   * @returns {Promise<string>} A promise that resolves with the GitHub token.
   * @rejects {string} Rejects with an error message if there is an issue fetching the token.
   */
  getGithubToken() {
    return new Promise((resolve, reject) => {
      let request = fetch(`${this.hostname}/github/token`).then((res) => {
        res.json().then((json) => {
          if (json.status != "ok") {
            reject("Error: " + json.message);
          } else {
            resolve(json.token);
          }
        });
      });
    });
  }
  /**
   * Opens a file on the Replit platform.
   * @param {string} filename - The name of the file to open.
   * @returns {Promise<boolean>} A promise that resolves with a boolean indicating success.
   * @rejects {string} Rejects with an error message if there is an issue opening the file.
   */
  openFile(filename){
    return new Promise((resolve, reject)=>{
      fetch(`${this.hostname}/files/open`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          filename: filename,
          waitForClose: false
        })
      }).then(req=>{
        req.json().then(json=>{
          if (json.status != "ok"){
            reject("Error: " + json.message);
          } else {
            resolve(true);
          }
        })
      })
    })
  }
}

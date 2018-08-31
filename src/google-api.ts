import fs from "fs";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import readline from "readline";

// tslint:disable:no-console

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const TOKEN_PATH = "token.json";

interface ICredentials {
    installed: {
        client_secret: string;
        client_id: string;
        redirect_uris: string;
    };
}

type AuthCallback = (client: OAuth2Client) => void;

// Load client secrets from a local file.
export function getObjectives() {
    return new Promise((resolve, reject) => {
        fs.readFile("credentials.json", "utf8", (err, content) => {
            if (err) {
                return console.log("Error loading client secret file:", err);
            }
            // Authorize a client with credentials, then call the Google Sheets API.
            authorize(JSON.parse(content), (client) => {
                getContent(client, transformOKR(resolve));
            });
        });
    });
}

const transformOKR = (callback: (objectives: any) => void) => (okrs: [any]) => {
    const objectives = okrs.reduce((accumulator: [any], okr) => {
        const kr = transformKeyResult(okr);
        if (okr[0]) {
            return accumulator.concat({
                keyResults: [kr],
                title: okr[0],
            });
        } else {
            accumulator[accumulator.length - 1].keyResults.push(kr);
            return accumulator;
        }
    }, []);
    callback(objectives);
};

const transformKeyResult = (kr: [string]) => ({
    "Key Result": kr[1],
    "Priority": kr[2],
    "Score": kr[5],
    "Status": kr[3],

});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials: ICredentials, callback: AuthCallback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, "utf8", (err, token) => {
        if (err) {
            return getNewToken(oAuth2Client, callback);
        }
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client: OAuth2Client, callback: AuthCallback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken({code}, (err, token) => {
      if (err) {
          return console.error("Error while trying to retrieve access token", err);
      }
      if (token) {
          oAuth2Client.setCredentials(token);
          // Store the token to disk for later program executions
          fs.writeFile(TOKEN_PATH, JSON.stringify(token), (tokenErr) => {
            if (tokenErr) {
                console.error(tokenErr);
            }
            console.log("Token stored to", TOKEN_PATH);
          });
          callback(oAuth2Client);
      }
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function getContent(auth: OAuth2Client, callback: (values: [string]) => void) {
  const sheets = google.sheets({version: "v4", auth});
  sheets.spreadsheets.values.get({
    range: "Sheet1!A2:F7",
    spreadsheetId: "1-EVPk_bBwUKkQlnkuFoslFi2OLiqgd9lFoKbRZ3tjZE",
  }, (err: any, res: {data: {values: [string]}}) => {
    if (err) {
        return console.log("The API returned an error: " + err);
    }
    const rows = res.data.values;
    if (rows.length) {
      callback(rows);
    } else {
      console.log("No data found.");
    }
  });
}

const { google } = require('googleapis');

const serviceAccountKeyFile = "./googlesheets/thinking-star-437802-c8-da6b7e4e0b77.json";
const sheetId = '1PwR_3KFmWSKPFIB7OiBARpTORwQoQOFX35cM1X3bkBc'
const tabName = 'Invites'
const range = 'A:G'
const sheets = google.sheets('v4');

  
exports.getInviteInfo = async (req, res) => {
    const { familyCode } = req.query;
    //aqui poner google sheets
    const auth = new google.auth.GoogleAuth({
        keyFile: serviceAccountKeyFile, // Your service account key file path
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });
  
      // Get auth client
    const authClient = await auth.getClient();
    const response = await sheets.spreadsheets.values.get({
        auth: authClient,
        spreadsheetId: sheetId,
        range: tabName+"!"+range,
    });

    const rows = response.data.values;
    let invite = null
    let sheetLine = 1
    if (rows.length) {
      console.log('Data retrieved from Google Sheets:');
      rows.forEach((row) => {
        if(row[2] == familyCode){
            invite = { familyName: row[4], numPersons: row[3], sheetLine: sheetLine, accept: row[5], confirmNumber: row[6] }
        }
        sheetLine++
      });
    }
    
    if (invite) {
      res.json(invite);
    } else {
      res.status(404).json({ message: 'Invite not found' });
    }
};
  
exports.updateRSVP = async (req, res) => {
    const { familyCode, confirm, numAttending, sheetLine} = req.body;
    
    if (!familyCode) {
      return res.status(404).json({ message: 'Invite not found' });
    }
    
    if (confirm !== 'accept' && confirm !== 'decline') {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    if (confirm === 'accept' && (numAttending < 1)) {
      return res.status(400).json({ message: 'Invalid number of attendees' });
    }
    
    // In a real application, you'd update the database here
    const values = [
        [confirm, numAttending],
    ];
    const resource = {
        values,
    };

    // Create a JWT client for authentication
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
    const credentials = require("../googlesheets/thinking-star-437802-c8-da6b7e4e0b77.json");
    const auth = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        SCOPES
    );
    let lineToUpdate = "F"+sheetLine+":G"+sheetLine

    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: tabName+"!"+lineToUpdate,
        valueInputOption: 'USER_ENTERED', // USER_ENTERED to let Google Sheets process it like user input
        resource,
      }, (err, result) => {
        if (err) {
          console.error('Error updating data:', err);
        } else {
          console.log(`${result.data.updatedCells} cells updated.`);
        }
    });
    res.json({ message: 'RSVP updated successfully' });
};
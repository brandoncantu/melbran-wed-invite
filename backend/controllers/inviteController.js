const { google } = require('googleapis');

// Function to get credentials from environment variable
function getCredentials() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    return JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  }
  throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set');
}

const sheetId = '1PwR_3KFmWSKPFIB7OiBARpTORwQoQOFX35cM1X3bkBc'
const tabName = 'Invites'
const range = 'A:G'
const sheets = google.sheets('v4');

exports.getInviteInfo = async (req, res) => {
    const { familyCode } = req.query;
    
    try {
        const credentials = getCredentials();
        const auth = new google.auth.GoogleAuth({
            credentials,
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
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
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
    
    try {
        const values = [
            [confirm, numAttending],
        ];
        const resource = {
            values,
        };

        const credentials = getCredentials();
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        let lineToUpdate = "F"+sheetLine+":G"+sheetLine

        const sheets = google.sheets({ version: 'v4', auth });
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: tabName+"!"+lineToUpdate,
            valueInputOption: 'USER_ENTERED',
            resource,
        });

        res.json({ message: 'RSVP updated successfully' });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
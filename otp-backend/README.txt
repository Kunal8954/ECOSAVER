# OTP Backend Setup (Node.js + Twilio)

1. Install dependencies:
   npm install express twilio dotenv cors

2. Copy .env.example to .env and fill in your Twilio credentials.

3. Start the server:
   node server.js

4. The server will run on http://localhost:3000
   - POST /send-otp { mobile }
   - POST /verify-otp { mobile, otp }

5. Connect your frontend to these endpoints for real OTP sending and verification.

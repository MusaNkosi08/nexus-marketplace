
## NEXUS local development runbook

Open the repository root in VS Code. Use one terminal for the shared backend and a second terminal for the mobile client. From the repository root, run `npm install` and then `npm run dev`. The backend now listens on `0.0.0.0`, which allows a phone on the same Wi-Fi network to reach it at port `3000`.

For the Expo client, open a second terminal and run `cd mobile`, then `npm install`. For a phone on the same network, set the API URL to the computer's LAN address, for example `EXPO_PUBLIC_API_URL=http://192.168.1.20:3000/api`, and run `npm run start:lan`. Scan the QR code from Expo Go. On Windows PowerShell, set the variable with `$env:EXPO_PUBLIC_API_URL='http://192.168.1.20:3000/api'`; on macOS/Linux, use `export EXPO_PUBLIC_API_URL=http://192.168.1.20:3000/api`. If the phone cannot reach the LAN, use `npm run start:tunnel`; tunnel mode may require signing into Expo and is slower but avoids router isolation. Do not use `localhost` in the phone API URL.

The Angular companion is independent: run `cd frontend-angular`, `npm install`, and `npm start`. It calls the backend using the browser host and port 3000, while the Expo app uses the explicit `EXPO_PUBLIC_API_URL` because a phone's `localhost` is not the computer.

### Administrator access

The React administrator workspace is available at `/admin` on the React storefront. Sign in through the NEXUS identity flow first; the page allows access only when the signed-in account has role `admin`. The Angular administrator page is `/admin`; sign in there with a local JWT account whose database role is `admin`. The Expo administrator controls are in the **Profile** tab and appear after local JWT sign-in when the account role is `admin`.

New local registrations intentionally receive role `user`. To promote an existing account in MySQL Workbench, run the following targeted statement after replacing the email with the account you created:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

Then sign out and sign in again so a fresh JWT/session contains the admin role. Never store passwords or JWT values in source control.

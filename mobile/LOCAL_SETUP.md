# NEXUS Mobile local setup

## Expo Go on a physical phone

1. Open a terminal in this `mobile/` folder and run `npm install`.
2. Start the backend from the project root with `npm run dev`. The backend binds to `0.0.0.0` so phones on the same Wi-Fi network can reach it.
3. Find the computer's LAN IPv4 address. On Windows, use `ipconfig`; on macOS/Linux, use `ipconfig`, `ifconfig`, or `ip addr`.
4. Set `EXPO_PUBLIC_API_URL` in the terminal before starting Expo. On Windows PowerShell: `$env:EXPO_PUBLIC_API_URL='http://192.168.1.20:3000/api'`. On macOS/Linux: `export EXPO_PUBLIC_API_URL=http://192.168.1.20:3000/api`.
5. Run `npm run start:lan`. Keep the phone and computer on the same Wi-Fi network, then scan the QR code with Expo Go.

If the QR code cannot be reached because the network blocks local devices, run `npm run start:tunnel` instead. Tunnel mode may require an Expo account and is slower, but it avoids local-router isolation. Do not use `localhost` in `EXPO_PUBLIC_API_URL` on a physical phone because it points back to the phone itself.

## VS Code

Open the repository root as the workspace, use separate terminals for the backend and mobile app, and run the commands from the correct folder. The root terminal runs `npm run dev`; the mobile terminal runs `npm run start:lan` or `npm run start:tunnel`.

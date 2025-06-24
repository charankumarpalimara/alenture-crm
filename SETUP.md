# Setup Instructions

## Configuration Files

This project requires environment variables and configuration files that are not included in the repository for security reasons.

### Environment Variables

1. Copy `.env.template` to `.env`
2. Update the values in `.env` with your actual configuration:
   - `REACT_APP_API_URL`: Your backend API URL
   - `REACT_APP_SOCKET_URL`: Your Socket.IO server URL  
   - `REACT_APP_WS_URL`: Your WebSocket server URL

### Configuration File

1. Copy `src/config.js.template` to `src/config.js`
2. Update the `apiUrl` variable with your actual API URL

### Security Note

Never commit the actual `.env` or `src/config.js` files to version control as they contain sensitive information like API URLs and server configurations.


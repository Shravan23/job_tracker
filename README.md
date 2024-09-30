# Job Application Tracker Chrome Extension

This Chrome extension helps you track your job applications by reading job-related emails from your Gmail account and determining their status. The extension identifies emails related to job applications, such as interview requests, rejections, and offers, and provides an organized view of your applications, so you can easily stay updated without manually tracking each status change.

---

## Features

- **OAuth 2.0 Authentication**: Secure sign-in using your Google account.
- **Email Parsing**: Automatically identifies and extracts job application-related emails.
- **Application Status Tracking**: Organizes and tracks the status of your job applications (e.g., applied, interview, rejected).
- **User-Friendly Interface**: Provides a simple interface to view the current status of all job applications.

---

## Setup Instructions

### Prerequisites

Ensure you have the following installed before setting up the project:

- **Node.js** (with npm)
- **Git** for version control
- A **Google Cloud Project** with the **Gmail API** enabled and OAuth credentials set up
- **Chrome** or any Chromium-based browser

### Steps to Install

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/job-application-tracker.git
   cd job-application-tracker
   ```

2. **Install Dependencies**:
   (If you are using external libraries)

   ```bash
   npm install
   ```

3. **Set Up OAuth Credentials**:

   - Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new project.
   - Enable the **Gmail API** for your project.
   - Create OAuth 2.0 credentials and add your **Chrome Extension ID** to the list of authorized redirect URIs:
     ```
     https://<YOUR_EXTENSION_ID>.chromiumapp.org/
     ```
   - Add your client ID and client secret to the environment variables.

4. **Environment Variables**:
   Create a `.env` file in the root of your project and add your OAuth credentials:

   ```bash
   touch .env
   ```

   Add the following content:

   ```plaintext
   CLIENT_ID=your-client-id
   CLIENT_SECRET=your-client-secret
   ```

5. **Load the Extension into Chrome**:

   - Open `chrome://extensions/` in your Chrome browser.
   - Enable **Developer Mode**.
   - Click **Load unpacked** and select the project folder to load the extension.

6. **Run the Extension**:
   - After loading the extension, click on the extension icon in your Chrome toolbar and sign in using your Google account to start tracking job applications.

---

## Usage

1. **Authenticate**: Once you click on the extension, it will prompt you to authenticate using your Google account.
2. **Track Job Applications**: The extension automatically fetches job-related emails (e.g., application confirmations, interview invitations, rejections) from your inbox.
3. **View Application Status**: The extension will display the current status of all identified job applications in an organized list, making it easy to monitor progress.

---

## Development

### Running the Extension Locally

1. **Make Code Changes**: Modify the code in the `src/` directory to add new functionality or customize existing features.
2. **Reload the Extension**: After making changes, go to `chrome://extensions/` and click the **reload** button next to your extension to test updates.
3. **Check DevTools for Debugging**: Open Chrome DevTools (F12) to inspect logs or debug the extension as needed.

### Recommended Tools

- **Visual Studio Code**: A highly recommended text editor for development.
- **Prettier** and **ESLint**: Consider installing Prettier for consistent code formatting and ESLint for linting JavaScript code.
- **GitHub Actions**: Set up CI/CD to automate testing and deployment.

---

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature XYZ"
   ```
4. Push the changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Submit a pull request on GitHub.

---

## Future Roadmap

- **Email Parsing Improvements**: Improve the accuracy of email parsing using Natural Language Processing (NLP) to identify job-related terms and contexts more effectively.
- **Notifications**: Implement browser notifications to alert users when there is an update in job application statuses.
- **Multi-Provider Support**: Extend support to email providers other than Gmail, such as Outlook and Yahoo.

---

## Technologies Used

- **JavaScript**: For core functionality.
- **HTML5** and **CSS3**: For the user interface.
- **Chrome Extensions API**: For interaction with the browser.
- **OAuth 2.0**: For secure authentication with Google.
- **Gmail API**: For fetching and analyzing job-related emails.

---

## Known Issues

- **Gmail-Only**: The extension currently only supports Gmail accounts. Future versions will support other email providers.
- **API Rate Limits**: The Gmail API enforces limits on the number of requests that can be made. If the limit is exceeded, some features may be temporarily

# Privacy Policy for RapidFill Browser Extension

Last updated: 2026-03-16

## Overview

RapidFill is a browser extension designed to help users autofill job application forms. To work properly, the extension allows users to enter profile information such as name, email address, phone number, links, address details, education details, and other job application related information.

This document explains what data RapidFill handles, how that data is stored, and how users can control it.

## What Data RapidFill Processes

RapidFill may process the following categories of information when entered by the user:

- Name and contact details
- Resume or profile related links such as LinkedIn, GitHub, and portfolio URL
- Address and location details
- Employment related details such as company and job title
- Education related details such as school, major, graduation city, and graduation year
- Optional personal details such as gender and birth date
- Language preference used inside the extension interface

RapidFill only processes information that the user manually enters into the extension. The extension does not automatically collect personal data from websites.

RapidFill also reads form fields on pages where the extension is active in order to match saved profile data to the correct input fields.

RapidFill does not continuously run on all websites by default. It injects its form-filling script into the active tab only when the user explicitly triggers autofill.

## How Data Is Stored

RapidFill stores user-entered profile data and language preference locally in the browser using the extension storage API (`chrome.storage.local`).

- Data is stored on the user's device
- Data is not stored in a remote RapidFill server
- Data remains in local extension storage until the user changes or deletes it

## Network Use

Based on the current implementation of RapidFill at the time of this policy, the extension does not send user profile data to a remote backend operated by RapidFill.

If the extension adds cloud sync, analytics, remote APIs, or any external data transfer in the future, this policy should be updated before release.

## Browser Permissions

RapidFill currently requests the following permissions:

- `storage`: to save profile data and language preference locally
- `activeTab`: to access only the currently active tab after a user action
- `scripting`: to inject the form-filling script into the active tab when the user requests autofill

RapidFill does not currently request persistent `<all_urls>` host permissions and does not register always-on content scripts for every page.

These permissions are used only for the extension's autofill functionality.

## How Data Is Used

RapidFill uses stored profile data only to:

- Populate form fields on websites at the user's request
- Inject the autofill script into the active tab only after the user initiates the action
- Display the saved profile inside the extension popup
- Let the user edit, save, or clear their data
- Remember the selected interface language

## User Control

Users can control their data directly in the extension:

- Edit saved profile data in the popup
- Save updated profile data
- Clear all saved profile data using the delete action in the edit screen
- Remove the extension to delete extension-managed local data according to browser behavior

## Data Sharing

RapidFill does not sell user data.

RapidFill does not share user profile data with third parties as part of the current implementation.

RapidFill does not use analytics tools, tracking scripts, advertising SDKs, or third-party data collection services.

RapidFill does not transfer user data outside the user's browser environment.

## Security

RapidFill stores data locally in the browser extension storage area. While reasonable effort is made to minimize unnecessary data access, users should understand that any data stored in a browser environment depends on the security of the user's device, browser profile, and installed extensions.

## Children's Privacy

RapidFill is not intended for children under 13 and is not designed to knowingly collect information from children.

## Changes to This Policy

This policy may be updated if RapidFill changes how it stores, processes, or transfers data. The latest version should be published together with new releases.

## Contact

If you have questions about this privacy policy or RapidFill, you can contact the developer at:

furkanuysal91@gmail.com

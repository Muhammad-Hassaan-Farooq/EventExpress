# Event Express Backend
This repository contains the backend apis for event express. The event management system for organizations to simplify access to creating and viewing events for both organisers and the users. It even contains a built in CMS to allow organisers to 
cusotmize their event pages to their hearts content. This app has three roles: user, organiser and admin with role based access for apis. It uses jwt tokens for authentication.

## Technologies used
<img height=50 src="https://user-images.githubusercontent.com/25181517/183859966-a3462d8d-1bc7-4880-b353-e2cbed900ed6.png"><img height=50 src="https://user-images.githubusercontent.com/25181517/183568594-85e280a7-0d7e-4d1a-9028-c8c2209e073c.png">

## Installation
Clone the repo
```bash
git clone https://github.com/Muhammad-Hassaan-Farooq/EventExpress.git
cd EventExpress
```
Install dependencies
```bash
npm install
```

## Project Structure

```
 |--controllers\    # Controllers
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models
 |--routes\         # Routes
 |--index.js        # App entry point
```
### API Endpoints

List of available routes:

**Auth Routes:**\
`POST /auth/login` - Login\
`POST /auth/signup` - Signup\
`POST /auth/forgetPassword` - Send reset email for password

**Event Page Routes:**\
`GET /eventPage/getEventPage/:eventid` - Get the json for the cms generated page\
`POST /eventPage/setEventPage/:eventid` - Set the json for the cms generated page

**Event Route:**\

User Routes\
`GET /event/getEvents` - Get all events\
`POST /event/attendingEvent` - Mark attendance for an event\
`GET /event/getEvent` - Get a specific event\
`POST /event/getByDate` - Search events by date\
`POST /event/getByLocation` - Search events by location\
`POST /event/getByOrganizer` - Search events by organizer\
`POST /event/getByPrice` - Search events by price\
`POST /event/getByName` - Search events by name\
`POST /event/getById` - Search events by ID\
`POST /event/getOrganizerByName` - Get organizer by name\
`POST /event/getOldEvents` - Get old events\
`GET /event/myCurrentEvents` - Get current events for a user

Organiser Routes\
`POST /event/createEvent` - Create a new event\
`POST /event/deleteEvent` - Delete an event\
`GET /event/myEvents` - Get organisers's events\
`POST /event/changeEventDetails` - Change event details

**Profile Routes**\
`POST /profile/viewProfile` - View profile\
`POST /profile/changePassword` - Change password\
`POST /profile/deleteMyAccount` - Delete account

**Ticketing Route**\
`POST /ticketing/markAttending` - Mark user attending\
`POST /ticketing/markNotAttending` - Remove user attending

**Account Management Route**\
`GET /accountManagement/getOrganizers` - Get all organizers\
`POST /accountManagement/getOrganizerByName` - Get organizer by name\
`GET /accountManagement/getUsers` - Get all users\
`POST /accountManagement/getUserByName` - Get user by name\
`POST /accountManagement/deleteAccount` - Delete account\
`POST /accountManagement/changeRole` - Change user role\
`GET /accountManagement/countOrganizers` - Count organizers\
`GET /accountManagement/countUsers` - Count users



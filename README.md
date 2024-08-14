# OpenMusicV2 - Back-End API

![logo](openmusic-logo.jpg)

A project submission from Dicoding's Back End Intermediate class: an API for a streaming music application.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Introduction

OpenMusicV2 is a back-end API developed for a streaming music application. This API allows users to view albums and songs that have been added. In version 2, users can create private playlists where they can add or remove songs (login required). Playlist activity is also stored as a history, enabling users to see what changes have been made to their playlists. Users can also add collaborators to their playlists, granting the collaborators the same access as the users, except for the ability to delete the playlist.

## Features

- **View Albums**: Browse the collection of available albums.
- **View All Songs**: Explore the complete list of songs.
- **Add New Albums**: Create and add new albums to the collection.
- **Add New Songs**: Create and add new songs to the catalog.
- **Update Album Details**: Modify existing album information.
- **Update Song Details**: Modify existing song information.
- **Delete Albums**: Remove albums from the collection.
- **Delete Songs**: Remove songs from the catalog.
- **Add Login & Logout Feature**: Securely authenticate and deauthenticate users.
- **Add New Playlist**: Create new playlists for personal or shared use.
- **Add Songs to Playlist**: Include songs in your playlists.
- **Add Other Users as Collaborators**: Invite other users to collaborate on your playlists.
- **Delete Songs from Playlist**: Remove songs from your playlists.
- **Delete Users from Collaborators**: Remove collaborators from your playlists.
- **Delete Playlist**: Delete entire playlists from your account.

## Technologies Used

- Node.js
- Hapi.js
- PostgreSQL

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/AxelSeanCP/OpenMusic-API.git

   cd OpenMusic-API
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   - Create a new PostgreSQL database.
   - Run the database migrations (if any).

   ```bash
   npm run migrate up
   ```

4. Configure environment variables:

   - Create a `.env` file in the root directory.
   - Add the necessary environment variables (HOST, PORT, PGUSER, PGHOST, PGPASSWORD, PGDATABASE, PGPORT, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, ACCESS_TOKEN_AGE).

5. Start the server:
   ```bash
   npm run start:prod
   ```
   > for development
   ```bash
   npm run start:dev
   ```

## Usage

Once the server is running, you can interact with the API using tools like Postman or cURL. Refer to the [API Endpoints](#api-endpoints) section for details on available routes.

## API Endpoints

### Albums

- **Get all albums**

  - `GET /albums`

- **Get album by ID**

  - `GET /albums/{id}`

- **Add a new album**

  - `POST /albums`
  - Request body:
    ```json
    {
      "name": "Album Name",
      "year": 2023
    }
    ```

- **Update an album**

  - `PUT /albums/{id}`
  - Request body:
    ```json
    {
      "name": "Updated Album Name",
      "year": 2024
    }
    ```

- **Delete an album**
  - `DELETE /albums/{id}`

### Songs

- **Get all songs**

  - `GET /songs`

- **Get song by ID**

  - `GET /songs/{id}`

- **Add a new song**

  - `POST /songs`
  - Request body:
    ```json
    {
      "title": "Song Title",
      "year": 2023,
      "genre": "Genre",
      "performer": "Performer Name",
      "duration": 240,
      "albumId": "albumId"
    }
    ```

- **Update a song**

  - `PUT /songs/{id}`
  - Request body:
    ```json
    {
      "title": "Updated Song Title",
      "year": 2024,
      "genre": "Updated Genre",
      "performer": "Updated Performer Name",
      "duration": 250,
      "albumId": "updatedAlbumId"
    }
    ```

- **Delete a song**
  - `DELETE /songs/{id}`

### Users

- **Add a user**
  - `POST /users`
  - Request body:
    ```json
    {
      "username": "Your username",
      "password": "SuperSecretPassword",
      "fullname": "Your fullname"
    }
    ```

### Authentications

- **Authenticate user**

  - `POST /authentications`
  - Request body:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```

- **Update access token**

  - `PUT /authentications`
  - Request body:
    ```json
    {
      "refreshToken": "string"
    }
    ```

- **Delete authentication**

  - `DELETE /authentications`
  - Request body:

    ```json
    {
      "refreshToken": "string"
    }
    ```

    ```

    ```

### Playlists

- **Add a new playlist**

  - `POST /playlists`
  - Request body:
    ```json
    {
      "name": "string"
    }
    ```

- **Get all playlists**

  - `GET /playlists`

- **Delete a playlist**

  - `DELETE /playlists/{id}`

- **Add a song to playlist**

  - `POST /playlists/{id}/songs`
  - Request body:
    ```json
    {
      "songId": "string"
    }
    ```

- **Get songs from a playlist**

  - `GET /playlists/{id}/songs`

- **Delete a song from playlist**
  - `DELETE /playlists/{id}/songs`
  - Request body:
    ```json
    {
      "songId": "string"
    }
    ```

### Activities

- **Get playlist activities**
  - `GET /playlists/{id}/activities`

### Collaborations

- **Add a collaboration**

  - `POST /collaborations`
  - Request body:
    ```json
    {
      "playlistId": "string",
      "userId": "string"
    }
    ```

- **Delete a collaboration**
  - `DELETE /collaborations`
  - Request body:
    ```json
    {
      "playlistId": "string",
      "userId": "string"
    }
    ```

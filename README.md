# OpenMusicV1 - Back-End API

A project submission from Dicoding's Back End Intermediate class: an API for a streaming music application that can view added albums and songs.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Introduction

OpenMusicV1 is a back-end API developed for a streaming music application. This API allows users to view albums and songs that have been added.

## Features

- View albums
- View all songs
- Add new albums
- Add new songs
- Update album details
- Update song details
- Delete albums
- Delete songs

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
   - Add the necessary environment variables (HOST, PORT, PGUSER, PGHOST, PGPASSWORD, PGDATABASE, PGPORT).

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

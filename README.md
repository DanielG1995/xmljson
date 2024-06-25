# XML to JSON Project

## Installation

```bash
$ npm install
```

Make sure to configure the `.env` file to connect to your MongoDB database.

## Run Locally

```bash
$ npm run start:dev
```

## Run with Docker

Ensure Docker is installed and running, then build the Docker container:

```bash
$ docker-compose up --build
```

## Usage

### Uploading XML File

Endpoint to upload an XML file:

- **URL:** `/api/upload`
- **Method:** `POST`
- **Parameters:** No additional parameters
- **Payload:** Upload a file using form-data with key `file`
- **Parameters:**
  - `skip`: Optional, number of items to skip (default: 0)
  - `limit`: Optional, maximum number of items to retrieve (default: 0)

### Loading Data from URL

Endpoint to load data directly from a URL:

- **URL:** `/api/load-data`
- **Method:** `GET`
- **Parameters:**
  - `skip`: Optional, number of items to skip (default: 0)
  - `limit`: Optional, maximum number of items to retrieve (default: 0)

## GraphQL Endpoint

- **URL:** `http://localhost:3000/graphql`

## Testing

To run unit tests, use the following command:

```bash
$ npm run test
```
# API Documentation

This README serves as documentation for the API endpoints listed in the provided JSON payload. The API is structured into several categories, including Users, Profiles, Authentication, Posts, and Messages.

---

## Project Overview

This project consists of two main components:

1. **Backend**: The backend API (this repository) handles all server-side logic, database interactions, and API endpoints.
2. **Frontend**: The frontend for this project is hosted on [TrustLink](https://github.com/hawkaii/TrustLink). It provides the user interface for interacting with the API.

---

## Hosting and Resources

- **Backend Hosting**: The backend server is hosted on [DigitalOcean](https://www.digitalocean.com).
- **Frontend Repository**: [TrustLink](https://github.com/hawkaii/TrustLink)
- **Base URL**: The base URL for API requests is `https://tienext.inceptionsoftech.com/v1`.

---

## Endpoints

### 1. Users

#### a. Get Users

- **Method:** GET
- **Endpoint:** `/users`
- **Description:** Retrieves a list of all users.

#### b. Edit Users

- **Method:** PUT
- **Endpoint:** `/users`
- **Payload:**
  ```json
  {
    "mobileNumber": "1273283789"
  }
  ```
- **Description:** Updates the mobile number of a user.

#### c. Delete Users

- **Method:** DELETE
- **Endpoint:** `/users`
- **Description:** Deletes a user.

### 2. Profiles

#### a. Get Profiles

- **Method:** GET
- **Endpoint:** `/profiles`
- **Description:** Retrieves a list of all profiles.

#### b. Fetch Profile

- **Method:** GET
- **Endpoint:** `/profiles/50`
- **Description:** Fetches the profile with ID `50`.

#### c. Edit Profile

- **Method:** PUT
- **Endpoint:** `/profiles`
- **Payload:**
  ```json
  {
    "username": "johnsmith",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "city": "San Francisco"
  }
  ```
- **Description:** Updates profile details.

#### d. Follow Create

- **Method:** POST
- **Endpoint:** `/profiles/follows`
- **Payload:**
  ```json
  {
    "username": "yourboy"
  }
  ```
- **Description:** Allows a user to follow another profile.

#### e. Get Follow Status

- **Method:** GET
- **Endpoint:** `/profiles/follows`
- **Payload:**
  ```json
  {
    "username": "yourboy"
  }
  ```
- **Description:** Checks the follow status for a username.

#### f. Unfollow

- **Method:** DELETE
- **Endpoint:** `/profiles/follows`
- **Payload:**
  ```json
  {
    "username": "hawkaii"
  }
  ```
- **Description:** Unfollows a user.

#### g. Get Current Profile

- **Method:** GET
- **Endpoint:** `/profiles/current`
- **Description:** Retrieves the current user's profile.

#### h. Username Existence Check

- **Method:** GET
- **Endpoint:** `/profiles/user-exists/username`
- **Description:** Checks if a username exists.

### 3. Authentication

#### a. Sign In

- **Method:** POST
- **Endpoint:** `/auth/signin`
- **Payload:**
  ```json
  {
    "password": "anothersecurepassword456",
    "identifier": "johnsmith@example.com"
  }
  ```
- **Description:** Authenticates a user.

#### b. Sign Out

- **Method:** POST
- **Endpoint:** `/auth/signout`
- **Description:** Logs out the current user.

#### c. Signup

- **Method:** POST
- **Endpoint:** `/auth/signup`
- **Payload:**
  ```json
  {
    "username": "johnsmith",
    "password": "anothersecurepassword456",
    "email": "johnsmith@example.com",
    "fullName": "John Smith",
    "mobileNumber": "1273283789",
    "profession": "Graphic Designer",
    "birthday": "1988-07-22",
    "latitude": 40.7128,
    "longitude": -74.006,
    "city": "New York"
  }
  ```
- **Description:** Creates a new user.

#### d. Auth Status

- **Method:** GET
- **Endpoint:** `/auth/status`
- **Description:** Checks the authentication status of the current user.

### 4. Posts

#### a. Create Activity Post

- **Method:** POST
- **Endpoint:** `/posts`
- **Payload:**
  ```json
  {
    "type": "activity",
    "imageURL": "http://example.com/image.jpg",
    "publicId": "image123",
    "caption": "Had a great time at the event!",
    "data": {
      "activityDetails": "Details about the activity",
      "mentions": ["60d0fe4f5311236168a109ca"],
      "comments": ["60d0fe4f5311236168a109cb"],
      "likes": ["60d0fe4f5311236168a109cc"]
    }
  }
  ```
- **Description:** Creates a new activity post.

#### b. Create Requirement Post

- **Method:** POST
- **Endpoint:** `/posts`
- **Payload:**
  ```json
  {
    "type": "requirement",
    "imageURL": "http://example.com/image.jpg",
    "publicId": "image123",
    "caption": "Looking for a graphic designer",
    "data": {
      "title": "Graphic Designer Needed",
      "description": "We need a graphic designer for a project.",
      "location": "New York",
      "profession": "Graphic Designer"
    }
  }
  ```
- **Description:** Creates a new requirement post.

#### c. Create Moment Post

- **Method:** POST
- **Endpoint:** `/posts`
- **Payload:**
  ```json
  {
    "type": "moment",
    "imageURL": "http://example.com/image.jpg",
    "publicId": "image123",
    "caption": "Captured a beautiful sunset",
    "data": {
      "momentDetails": "Details about the moment"
    }
  }
  ```
- **Description:** Creates a new moment post.

#### d. Get Posts

- **Method:** GET
- **Endpoint:** `/profiles/18/posts`
- **Description:** Retrieves posts of the profile with ID `18`.

#### e. Get Activity Posts

- **Method:** GET
- **Endpoint:** `/profiles/18/activity-posts`
- **Description:** Retrieves activity posts of the profile with ID `18`.

#### f. Get Moment Posts

- **Method:** GET
- **Endpoint:** `/profiles/18/moment-posts`
- **Description:** Retrieves moment posts of the profile with ID `18`.

#### g. Get Requirement Posts

- **Method:** GET
- **Endpoint:** `/profiles/18/requirement-posts`
- **Description:** Retrieves requirement posts of the profile with ID `18`.

### 5. Messages

(No endpoints defined for this category in the provided JSON.)

---

## Variables

- `baseURL`: Base URL for the API requests. Default: `https://tienext.inceptionsoftech.com/v1`

---

For more details, refer to the API schema or contact the development team.

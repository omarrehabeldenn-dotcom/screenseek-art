# CineVerse Discovery

Build a simple full-stack movie discovery website called CineVerse.

The goal is to create a small but beautiful project that demonstrates both frontend and backend development.

Tech Stack

React + TypeScript

Tailwind CSS

Framer Motion

Node.js + Express

MongoDB

JWT Authentication

Design

Create a modern cinematic dark UI.

Use:

Dark background

One main accent color

Clean typography

Large movie posters

Rounded cards

Subtle gradients

Smooth animations

Fully responsive design

Keep the design clean and minimal. Do not overcomplicate the UI.

Pages

Only create these pages:

Home

Hero section with one featured movie

Trending movies section

Simple movie cards

Search button/input

Movie Details

Movie poster

Title

Description

Rating

Genre

Release year

"Watch Trailer" button

"Add to Favorites" button

Login / Register

Simple authentication forms

Clean animated design

Favorites

Show the user's favorite movies

Allow removing movies from favorites

Backend

Create a simple Express REST API.

Endpoints:

GET /api/movies
GET /api/movies/:id

POST /api/auth/register
POST /api/auth/login

GET /api/favorites
POST /api/favorites/:movieId
DELETE /api/favorites/:movieId

Use JWT authentication for protected routes.

Database

Use only three models:

User:

name

email

password

Movie:

title

description

poster

genre

year

rating

trailerUrl

Favorite:

userId

movieId

Animations

Use Framer Motion for:

Hero entrance

Movie cards appearing on scroll

Hover effects

Page transitions

Buttons

Favorite button animation

Keep animations smooth and subtle.

Important

Do not create a complicated admin dashboard, payment system, comments, reviews, or unnecessary features.

Focus on making a small, polished, beautiful full-stack project with real authentication, API requests, MongoDB, and a few impressive animations.

The final project should be easy to understand, easy to run locally, and suitable for showcasing on GitHub and a developer portfolio.



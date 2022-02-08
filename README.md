# NC-Board-Games review site api

## Summary

This is my backend project I completed at Northcoders bootcamp. This api is for a board game review website where uses can submit reviews about board games and comment on each other's reviews. There is also a vote feature which allows users to up or down vote reviews and comments. Data for this api was already given to us in the form of categories, comments, reviews and users. This is the first api I have built and I've learned so much while completing it.

---

## Setup

- Clone the repository with this link: https://github.com/jamesgrannan/nc_board_games.git
- Running this in your terminal should install all the necessary packages:

```json
  npm install
```

- You wil need to create two .env files. A '.env.test' containing this:

```json
  PGDATABASE=nc_games_test
```

- Also create a '.env.development' containing:

```json
PGDATABASE=nc_games
```
Both of these will link you to the databases that have been provided to me. But feel free to link them to your own.


- Running this will initialise the database ready for seeding:

```json
  npm run setup-dbs
```

- Running this will seed the database:

```json
  npm run seed
```

- To run the test file (I use Jest), run:

```json
  npm test
```

- Now to use this in conjucntion with an api client like Insomnia we need to set up listening. Run:

```json
  npm run start
```

---

### Requirements

Minimum version requirements for Node.js: 16.1 & Postgres: 12.9

---

### View the website

The hosted version can be found here: https://meeple-cafe.herokuapp.com/api

---

### Available Endpoints

The list of endpoints that can be used as well as other information on them can be found here: https://meeple-cafe.herokuapp.com/api

---

### Front-end counterpart

The front-end github page for this api that I also built at Northcoders can be found here: https://github.com/jamesgrannan/Board-Game-Review-Site

---

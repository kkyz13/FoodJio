
![makantogether](https://github.com/kkyz13/FoodJio/assets/155720573/0bbe29f5-123d-4ddd-b23e-e02727b022ab)
# MakanTogether 
<sup> (Production Codename: FoodJio) </sup><br />

_Find people with the same taste as you_

## FOR GA SEI-49 
![Screenshot 2024-05-01 110134](https://github.com/kkyz13/FoodJio/assets/155720573/d82d18aa-0019-4973-a1a8-79df9c4bdcd3)

<a href="https://trello.com/b/dQwxGiy0/sei-project-4-proposal-board-foodjio">Public Board </a>

## Technologies Used ##

 **Frontend**
- React
- - react-responsive-carousel
  - react-routers
- JavaScript
- HTML
- CSS
- Bootstrap

**Backend**
- Django
- Python
- Postgres

#### APIs

- [Picture API](https://cloudinary.com)

## Getting Started

For **Foodjio_Front**, run ```npm i``` and create this to an .env file.
#### env values (FrontEnd)
| Values      | Description |
| ----------- | ----------- |
| VITE_SERVER      | IP to FrontEnd     |

For **Foodjio_Django**, ensure you have installed django before initiating the project. As this project uses postgres, you may have to also install postgres (and not the default SQLite)

## How to Use

<img width="384" alt="Screenshot 2024-05-01 105906" src="https://github.com/kkyz13/FoodJio/assets/155720573/bc3d5e2b-1463-43a2-b6a4-22f21a4d9509">

Before you are able to interact with the site, you are required to register an account.

![Screenshot 2024-05-01 111141](https://github.com/kkyz13/FoodJio/assets/155720573/5fe15ee5-21c7-44fd-b42a-6a2f70fdd6a4)

Upon sign in, you are greeted by a list of "jios", centralized around food.

```
Jio: A Malaysian-Singaporean Hokkien Slang to woo a girl, but now commonly used to ask someone out
```

![image](https://github.com/kkyz13/FoodJio/assets/155720573/77eeb01a-a24a-47d9-97d8-087435bcc92f)

You are able to filter the search results. These are the default settings (90 days, only active meets).

![image](https://github.com/kkyz13/FoodJio/assets/155720573/09ca914a-beab-4fc1-83a8-9ad07f2a0c0b)

Viewing any jio would give you the option to choose to go. Your infomation would not be revealed to the author until it reachs capacity.

![image](https://github.com/kkyz13/FoodJio/assets/155720573/17885c4d-65db-47e2-8b5e-1f3ac68ba03b)

Creating a jio is simple. If you don't have a picture to go with it there are 18 preset pictures to go with your cuisine of choice.
Ensure you give a suitable title, address (that you can test with the Google Maps button) and date/time. The number of people as well. Optionally you can provide a website/menu. 

![image](https://github.com/kkyz13/FoodJio/assets/155720573/9b631631-9883-435f-b0c8-625207c2833d)

Your own jios are colored green to differentiate from the other jios.

![image](https://github.com/kkyz13/FoodJio/assets/155720573/bc0f839e-1514-4966-bcab-c5e22f781c55)

As the organizer/author, you are not able to back out of your own meet, but you can edit or delete your own meets. (Delete would archive the event and not appear in search unless someone tries really hard to get it)

<img width="408" alt="image" src="https://github.com/kkyz13/FoodJio/assets/155720573/5be80464-7234-4119-a58b-bf306f3683df">

When it reaches capacity, the author can click on the Let's Makan button to see information of people who registered their interest. It's (currently) up to the organizer to then contact and make proper arrangement with the participants and restaurant.

![image](https://github.com/kkyz13/FoodJio/assets/155720573/02d46484-4815-41d0-b8e7-b340435ac3b2)

Flagging an event would mark the event for an admin to check and ultimately delete the event or even outright ban the user.

<img width="115" alt="image" src="https://github.com/kkyz13/FoodJio/assets/155720573/d42fff83-c885-4f8c-bb93-453b2644f8fe">

There's a Jio History function to see all events you interacted with, and all events you authored.

<img width="535" alt="image" src="https://github.com/kkyz13/FoodJio/assets/155720573/00cf63f6-e062-44f7-8317-844acaaf1916">

The profile page is barebones. But you can upload a profile pic, and change your name and mobile number (but not e-mail).

<img width="392" alt="image" src="https://github.com/kkyz13/FoodJio/assets/155720573/b1fcfbb3-8f98-4cf3-80f4-52d3a679b8a4">

Updating any field will require the password from the user, and presents a modal to allow the user to understand there's a logout if the update goes through.

### Administration Function

The frontend has some basic controls for administrating the site.

<img width="822" alt="image" src="https://github.com/kkyz13/FoodJio/assets/155720573/df0e26ae-5ca2-4562-9bf4-a1ae94a76341">

Banner Color and font would change to reflect admin privileges. Admin can see user info (including id), ban the user and delete/restore the event. 

![image](https://github.com/kkyz13/FoodJio/assets/155720573/27d611cf-65ca-474b-95ec-94e7b2ec718e)

A flagged event turns deep red only to the admin.

## Next Steps:
- Ability to change password (code is there, but it's probably wrong somewhere)
- Fuzzy Search
- Restaurant Reservation Integration
- Direct Messaging
- Whatsapp Integration

## Resources:
- <a href="https://docs.djangoproject.com/en/5.0/"> Django Documentation</a>
- <a href="https://getbootstrap.com/docs/5.3/getting-started/introduction/">Bootstrap Documentation</a>
- <a href="https://reactrouter.com/en/main">React Routers Documentation</a>
- <a href="https://www.blackbox.ai">Blackbox AI for tons of syntax help</a>

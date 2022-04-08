# Dr.handyman

## Project URL

**Task:** Provide the link to your deployed application. Please make sure the link works. 
https://www.drhandyman.me/

## Project Video URL 

**Task:** Provide the link to your youtube video. Please make sure the link works. 
https://youtu.be/jUkU5v62RiY
## Project Description

**Task:** Provide a detailed description of your app
As the name of our project suggests, we built an online platform where individuals can hire skilled trade workers or handy men for a variety of tasks such as snow shoveling or mowing lawns. Individuals can also become workers (the identification feature was not inplemented) and make posts to grab attentions of people who are looking for help. 
A search bar was implemented to allow users to search for posts or workers. They can also search for posts or works based on distance by selecting on different option when performing a search. Users can chat with each other through the website, and if they choose to, they can also video chat. The tipping of workers feature through Paypal was abandoned because the need of a business account to have it fully functional. 
Non-authenticated users can only use the search bar to view posts and workers. 
Users can also make appointments with other users, check appointment history and check their upcoming appointments. Users can also leave comments with ratings on other user's profile page, and accept posts posted by other users.

## Development

**Task:** Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries and third-party api that you have used. 
The backend uses MongoDB Atlas to store all data, and utilizes Apollo Server with Express Framework. We did not use REST API but chose GraphQL. We used Passport Graphql-Shield framework for user authentication.(To be Continued...)

For frontend UI we employed Material UI and
## Deployment

**Task:** Explain how you have deployed your application. 

Our application is deployed on a Digitalocean Droplet. We are using the backbone introduced in lab10, which is the jwilder Nginx reverse-proxy and letsencrtypt to manage ssl certificates. We have made modifications on the docker-compose and our code to allow a development environment hence CICD and automatic clean up on older images. Since frontend uses next/react routing, we also created a modified version of nginx.conf to make sure the routing is as expected.

Our application has frontend, backend, socket.io server as the three core services. For microservices, we have Redis inside the server's docker network to ensure a closed environment from the outside. Our server connect to Mongodb atlas in ssl for database management, as this allows us to easily visualize and modify our data during development. Due to time constraints, we have not been able to move it to the server as a microservice.  

As for domain names, we used Namecheap to get a free domain name "drhandyman.me". We now have wwww, api, and cache as subdomains,  where www is the frontend, api is the backend, and cache is the socket.io connection.

## Maintenance

**Task:** Explain how you monitor your deployed app to make sure that everything is working as expected.

For project maintenance and monitoring, we are using Sentry for backend Express, Graphql, and Mongodb monitoring.
Locust.io is used for load testing.

## Challenges

**Task:** What is the top 3 most challenging things that you have learned/developed for you app? Please restrict your answer to only three items. 

1. Deploying a secure application with multiple microservices and managing domains.
2. Using caching (Redis) to manage Websocket communication between users for video chat.
3. Managing user subscriptions with graphql, for example chat.

# Contributions

**Task:** Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number). 

- Shaopeng Lin: Backend design and development and Deployment.
- Siying Xu: Frontend design and development
- Yuming Liu: API development and Innovation.

# One more thing? 

**Task:** Any additional comment you want to share with the course staff? 

1. Yuming does not appear as a contributer on Github for this project however he does contribute as part of the team. The issue has been made known to Thierry.
2. Chrome browser seem to use polling instead of websockets and can cause the user video feature to become very slow to respond to socket emits. Firefox does everything in an instant. 
3. Due to time constraints, some displays might disappear when screen zoom or size is not large enough. Tunning the sizes can often help.
4. Authorize to be worker can be buggy. Refresh usually solves the problem.

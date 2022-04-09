# Dr.handyman

## Project URL

**Task:** Provide the link to your deployed application. Please make sure the link works. 
https://www.drhandyman.me/

## Project Video URL 

**Task:** Provide the link to your youtube video. Please make sure the link works. 
https://youtu.be/jUkU5v62RiY
## Project Description

**Task:** Provide a detailed description of your app
As the name of our project suggests, we built an online platform where individuals can hire skilled trade workers or handymen for a variety of tasks such as snow shoveling or mowing lawns. Individuals can also become workers (the identification feature was not implemented) and make posts to grab the attention of people who are looking for help. 
A search bar was implemented to allow users to search for posts or workers. They can also search for posts or works based on the distance by selecting the different options when performing a search. Users can chat with each other through the website, and if they choose to, they can also video chat. The tipping of workers feature through Paypal was abandoned because of the need for a business account to have it fully functional. 
Non-authenticated users can only use the search bar to view posts and workers. 
Users can also make appointments with other users, check appointment history and check their upcoming appointments. Users can also leave comments with ratings on other users' profile pages, and accept posts posted by other users.

## Development

**Task:** Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries, and third-party API that you have used. 
The backend uses Javascript as the programming language, MongoDB Atlas to store all data, and utilizes Apollo Server with Express Framework. We did not use REST API but chose GraphQL. We used Passport with Graphql-local strategy and Graphql-Shield framework for user authentication, and validator to sanitize user input. 

For data schemas, we used Mongoose for an easy schema construction that looks very similar to what you will define in a graphql schema. The user and post schema are incorporated with text and geospatial indexes for distance calculation and queries. We have user, post, appointment, comment, and chat five schemas. Users uniquely identify themselves with either id or email and are related to all other schemas. Since user email does not change, we decided that other schemas for the most part should only store the email of the users and query the needed user information separately to ensure consistency. Appointments and comments are interrelated in that a comment can only be made on finished appointments, therefore we would need to store the appointment.  

As for authentication, we use express sessions combined with Passport middleware to create session ids. On signup, the passwords are hashed and salted with bcrypt to ensure maximum security. We store the user email in the session and use it to extract a user object from the database, then store it in the Apollo server context for global usage.

To manage Authorization, we use Graphql-Shield to filter user requests. This framework automatically applies the authorization rules to requests coming to the Apollo server and has an easy-to-use API with great documentation. Each schema has defined its own set of rules and please check out the backend code for specifications.

To ensure a real-time chatting experience, we use Redis pubsub with Apollo subscription engine WebSocket. Users in the frontend will subscribe to a chatting channel id and message feeds will be published whenever there is a new message. The Apollo Client allowed easy integration of this in the frontend.

To sanitize user input, we use the XSS and validator library to prevent any code injections and reject invalid inputs such as weak passwords and invalid emails.

We also use the graphql upload feature to manage user profile picture upload. The images are stored in the server and image information is passed to the database for future querying. We then serve the pictures with a get endpoint as we did in labs.

For the frontend, this project uses Nextjs as the basic framework for development and provides a series of out-of-the-box features based on React. Files are routed, and conventional strategies are used to help us manage and control the routing level, etc. In terms of UI library selection, we use the third-party UI library MUI for page construction. It provides some excellent components and ready-made layout capabilities. It cooperates with Formik to provide excellent form verification capabilities, which greatly improves the efficiency of our development. 

At the same time, the front and back ends use Apollo to wrap various operations on GraphQL. It provides a series of excellent features such as caching capabilities, error management, paging capabilities, etc., which effectively improves the efficiency of front-end and back-end interactions. In terms of persistent connections, we adopted a Websocket-based GraphQL subscription scheme to provide a guarantee for real-time chat. At the front-end implementation level, redux is used as global state management for multi-component data sharing, such as logged-in user data and at the cross-component communication level, the EventBus solution is used for an event interaction, making the entire project more flexible and scalable. 

As for the video feature, we incorporated socket.io and webRTC framework simplepeer to stream videos between two users. The users are connected to the cache.drhandyman.me sock.io server upon login. Each endpoint will communicate with the socket server using a unique id and the server will provide sufficient information to each end-point on request so that they can establish a webRTC connection through simplepeer. This is also the connection to signal to mute, turning off cameras, canceling calls, and so on.
## Deployment

**Task:** Explain how you have deployed your application. 

Our application is deployed on a Digitalocean Droplet. We are using the backbone introduced in lab10, which is the jwilder Nginx reverse-proxy and lets encrypt to manage SSL certificates. We have made modifications to the docker-compose and our code to allow a development environment hence CICD and automatic clean up on older images. Since the frontend uses next/react routing, we also created a modified version of nginx.conf to make sure the routing is as expected.

Our application has frontend, backend, and socket.io server as the three core services. For microservices, we have Redis inside the server's docker network to ensure a closed environment from the outside. Our server connects to MongoDB atlas in SSL for database management, as this allows us to easily visualize and modify our data during development. Due to time constraints, we have not been able to move it to the server as a microservice.  

As for domain names, we used Namecheap to get a free domain name "drhandyman.me". We now have www, api, and cache as subdomains,  where www is the frontend, api is the backend, and cache is the socket.io connection.

## Maintenance

**Task:** Explain how you monitor your deployed app to make sure that everything is working as expected.

For project maintenance and monitoring, we are using Sentry for backend Express, Graphql, and MongoDB monitoring.


## Challenges

**Task:** What is the top 3 most challenging things that you have learned/developed for you app? Please restrict your answer to only three items. 

1. Deploying a secure application with multiple microservices and managing domains.
2. Using caching (Redis) to manage Websocket communication between users for video chat.
3. Managing user subscriptions with graphql, for example, chat.

# Contributions

**Task:** Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number). 

- Shaopeng Lin: Backend design and development and Deployment.
- Siying Xu: Frontend design and development
- Yuming Liu: API development and Innovation.

# One more thing? 

**Task:** Any additional comment you want to share with the course staff? 

1. Yuming does not appear as a contributor on Github for this project however he does contribute as part of the team. The issue has been made known to Thierry.
2. Chrome browser seems to use polling instead of WebSockets and can cause the user video feature to become very slow to respond to socket emits. Firefox does everything in an instant. 
3. Due to time constraints, some displays might disappear when the screen zoom or size is not large enough. Tunning the sizes can often help.
4. Authorize to be a worker can be buggy. Refresh usually solves the problem.
5. Please test video features on different computers. Multiple browsers might try to race for the camera feed and cause errors. If on the same browser, you must be at /chat in user1 before you login on the other tab as browsers logs user1 off once you login as another user.

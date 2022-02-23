# Dr. Handyman 

**Team Member:** Siying Xu, Yuming Liu, Shaopeng Lin

## Description of this application:
We are going to implement a web application called xx, in which users can find workers for home maintenance projects and skilled trade workers. At the same time, workers can find employment opportunities through help wanted advertisements posted by homeowners.

## Description of the key features that will be completed by the Beta version
### User
**Non authenticated Users**
- Can search for workers and other people’s postings
- Can login or sign up to be a client or worker
**Client**
- Can search for workers and other people’s postings
- Users have a profile, including username, profile picture, phone, etc.
- Users can change profile information.
- Users can make/edit posts.
- Have a message box of chat history with workers.
- Can make posts asking for workers (Details reference Post section)
- Can accept posts asking for work from workers.
**Worker**
- Have all privileges as authenticated.
- Can ask for work with a post
- Can accept posts that ask for help
- Workers have a scheduled calendar.
### Post
- Posts will include the description of the posts and have 2 types: recruitment and employment
- Authenticated user can see their own posting history
- Authenticated user can delete their own posts
- Non authenticated users can only view posts

### Search
- Select Type of Posts: 
- Looking for Help
- Looking for Work
- Search for wanted Workers

## Description of the additional features that will be complete by the Final version
- Distance Filter for searching
- Administrator user in charge of content regulation. 
- Workers are authenticated by the Administrator.
- Workers can post comments to users about previous uncancelled appointments.
- Users can post comments to workers about previous uncancelled appointments.
- Apply for being a worker.
- Workers have a scheduled calendar.
- Non Authenticated now can message workers as anonymous users, but have no history after leaving the page
- Non Authenticated now can book appointment using emails
- Non Authenticated now can cancel appointments using email and appointment number
- Non Authenticated now can view history using email

## Description of the technology stack that you will use to build and deploy it：
- Frontend: HTML, CSS, and Javascript with React
- Backend: node.js, express.js with GraphQL + mongoDB


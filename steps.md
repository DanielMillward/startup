In general:

1. Make a graph of the different webpages, with arrows from buttons pointing to other (or the same) webpage with labels of what functions are called to get there.

- For example, going from the profile page to index with the logoutubutton means a logout() function is called, and then the index.html page is fetched.

2. Start with a page that doesn't have any functions attached to incoming arrows, or at least functions that are easy to mock up.

3. Make a list of all API calls it could make. This could be createUser(), checkAlreadyLoggedIn(), etc. Do your best to have 0 client-side logic, with the only JS for displaying stuff based on server response. In general, hide dynamic things until the server says to display them.

4. Implement those.

5. Make the webpage.

6. Once that's done, move on to the next good webpage. Repeat until done.

For this:

### Signup page
- addUser -> calls check if not all are present
- checkifalreadyloggedin -> redirect to profile if so
- client -> update error messages

- new game?
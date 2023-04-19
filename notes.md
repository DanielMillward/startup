What I learned using React. These are notes from a previous time I tried learning React, since the quality of my notes this time around are not as high (although that's not exactly the highest bar):

To add to the style tag:
	- ehter double curly braces {{color: 'red', backgroundColor:'black'}}
	- or have a const headingStyle {color....} and then reference with {headingStyle}
//here for flashcards
- for hot reloading on react, add chokidar_usepolling in dockercompose or params 
- for hot reloading on nodejs, you need to use nodemon (not necessary for react since it doesnt really use that)
			- 
		RUN npm install -g nodemon
		RUN npm install
		ENTRYPOINT \["nodemon", "/usr/src/app/server.js"]

- For passing in props, either do (props) or do ({valOne, valTwo})
	- the second one relates nicely to when you call \<MyComponent valOne=1 valTwo=2 />
- For button functions, onClick={functionName}, have a const functionName = (e) => {} either above the return in that component or a parent component, pass as prop
	- e is optional, just the event of the click
- If you have a list of dictionaries, to display all of them, do 
	- lists.map((listItem) => (
		- \<h3 key={listItem.uniqueValue}>listItem.value\</h3>))
- States: immutable, you can't change it from inside the return function.
	- import { useState } from 'react'
	- const \[stateName, updateStateFunction] = useState(\[{default: values}])
		- the updateStateFunction is kinda weird, you use it where you would write stateName = newVal + 2; e.g.
			- const deleteTask = (id) => {
				- updateStateFunction(id + 1)
			- }
		- often you'll do updateStateFunction(stateName.map OR .filter((element) => conditional statement))
	- You can pass parent states down through props, but not other way around (?)
- for classes do className instead of class= (to relate it to CSS)
- all the css stuff can be put into a single index.css file?
- For fonts, either connect them in the index.html file or npm install react-icons (to allow multiple fonts from places)
- To edit parent states, pass down a function as a prop, then use that function as onClick or whatever
	- to pass parameters of the function, you need (?) to call it like onDelete={() => myDelete(param)}
- Stuff that depends on states change when the state is updated
- backticks string = template literals, where you can replace stuff thats in a ${} thing
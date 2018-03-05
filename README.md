# PfDK files for inclusion in Canvas.


To include new javascript/css files, edit the modules/modules.js and/or modules7modules.css files and add your files as shown below:

## JS files inclusion

At the bottom of the modules.js file you will find the code below. Add a $.getScript line for your javascript file. Make sure it resides on a secure (https) server.

```
$.getScript("https://pfdk.github.io/frontend/youtube.js");
//$.getScript("https://pfdk.github.io/frontend/yourfile.js");
```
## CSS files inclusion
Add your css file with a new @import statement to the modules.css file. Make sure it resides on a secure (https) server.
```
@import "https://pfdk.github.io/modules/youtube.css";
/*
@import "https://pfdk.github.io/modules/yourfile.css";
*/
```

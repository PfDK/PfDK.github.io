# PfDK files for inclusion in Canvas.


To include new javascript/css files, edit the pfdk.js and/or pfdk.css files and add your files as shown below:

## JS files inclusion

At the bottom of the PfDK.js file you will find this code. Add a $.getScript line for your javascript file. Make sure it resides on a secure (https) server.

```

 jQuery( document ).ready(function( $ ) {
    $.getScript("https://pfdk.github.io/frontend/mmooc-min.js");
    $.getScript("https://yourfile.js");
});

```
## CSS files inclusion
Add your css file with a new @import statement to the PfDK.css file. Make sure it resides on a secure (https) server.
```
@import "https://pfdk.github.io/frontend/mmooc-min.css";
@import "https://yourfile.css";

```

# Wordcloud + google spreadsheet

[Live example](https://pfdk.github.io/modules/wordcloud/wordcloud.html?scriptUrl=https://script.google.com/macros/s/AKfycbx1PUclOqxfO_Ac10Vs2E9MtI8DbCosiAm8a5nPy9Q1wzcpyiQ_/exec)

Follow these steps to create your own wordcloud:

## Make a Google spreadsheet which can store the words in your wordcloud:

1. In a web browser, login with the google account which should own the spreadsheet. You could create a separate google account for your project if you do not want to mix your personal google account into this.
2. Make a copy of [this spreadsheet template](https://docs.google.com/spreadsheets/d/1r9KzJnUbArV5OFP2uB-KVUmgDMg0BMtbEU8at_KL6cc/edit#gid=1547094774) by opening it and selecting "File->Make a copy...".
3. You can remove the words already present in the column when you like, but you might want to leave them to see that things work.

## Connect a Google web app to the spreadsheet

1. In the spreadsheet, select "Tools->Script editor"
2. In the tab where the script is displayed, have a look on the code. You will have the trust it in a later step. If you do not know anything about code, you could have someone else look at it. All it does is writing and reading words to/from the spreadsheet.
3. Still in the script tab, select "Publish->Deploy as web app".
4. In the dialog that opens, check that the google account above is selected under "Execute the app as". In "Who has access to the app", select "Anyone, even anonymous". Finally, press "Deploy".
5. You are now told that you need to give permissions to the script. Press "Review permissions" and log in with the same google account as above. A message tells you that you should only allow this script to run if you trust the developer. Click on "Advanced" and click on the link at the bootom. Click allow.
6. In the new dialog that appears, copy the address of the "Current web app url".

## Display your Wordcloud

1. In a web browser, concatenate  ```https://pfdk.github.io/modules/wordcloud/wordcloud.html?scriptUrl=``` with the "Current web app url " you created above. This should give you an address like
https://pfdk.github.io/modules/wordcloud/wordcloud.html?scriptUrl=https://script.google.com/macros/s/AKfycbx1PUclOqxfO_Ac10Vs2E9MtI8DbCosiAm8a5nPy9Q1wzcpyiQ_/exec
2. Your wordcloud should now be displayed, and you can enter new words in the textbox above the wordcloud.
3. If you do now want the wordcloud to display before you have entered a word, add ```&hide``` as parameter at the of the url, like this: https://pfdk.github.io/modules/wordcloud/wordcloud.html?scriptUrl=https://script.google.com/macros/s/AKfycbx1PUclOqxfO_Ac10Vs2E9MtI8DbCosiAm8a5nPy9Q1wzcpyiQ_/exec&hide

## Embed your Wordcloud in a web page

1. In the page where you want your wordcloud, replace the url in the code below with the url you created above.
```
<iframe
src="https://pfdk.github.io/modules/wordcloud/wordcloud.html?scriptUrl=https://script.google.com/macros/s/AKfycbx1PUclOqxfO_Ac10Vs2E9MtI8DbCosiAm8a5nPy9Q1wzcpyiQ_/exec"  
width="100%"
height="100%">
</iframe>
```

To make the iframe responsive, you need to add some [javascript](https://github.com/PfDK/PfDK.github.io/blob/master/modules/wordcloud/pfdkautoresize.js).

If you use the Canvas learning platform, you must ask your administrator to add the javascript above. If you cannot do that, you should set the ```height```parameter in the iframe to a number of pixels that is large enough to display the wordcloud.
2. [testWordcloud.html](https://pfdk.github.io/modules/wordcloud/testWordcloud.html) shows a responsive html file with a wordcloud embedded using the javascript above.

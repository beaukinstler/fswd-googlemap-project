Neighborhood map Udacity Project
============================

Intro
-----

This little demo app shows the power of the Google Maps API. It uses the javascript developer tools, jQuery, KnockoutJS, Google Maps APIs, and the New York Times APIs.

Here's what it does:
* Displays a list of pre-configured places based on the LAT and LNG coordinates.
* Allows the user to filter the markers, based on the Name field of the Google Marker.
* It provides to built in filter groups, to allow the user to filter the markers in two different ways, for easy comparison between to groups.
    - The number of filters can be easily adapted to have more, or even add a form for adding more Filter Groups (referred to as Saved Searches in the javascript app.js file)


Running the app
======

Installing
----------
Simply download the git repo, either with git or as a zip folder (and unzip it), then open the index.html file in a web browser.

        $ git clone xxx

Or use this [link for the zip file](https://github.com/beaukinstler/fswd-googlemap-project/archive/master.zip)

Key Functions
-------------

### Using the Filter Groups
By default, "Filter List 1" is selected.  Any filter you apply while it's selected will be save only for the duration of your time using the app.  It's not stored in a database, cookies, or any other browser based storage.  It's just part of the javascript, so a page reload will reset it all.

To use another filter, just click the "Filter List" link, and apply a filter, or use the "Reset" button to see all the markers 

### Using the Filter
q
Add an item to the form field, click the "Add to Filter" button.  To apply the filter, click the "Apply filter" button. It filters based on an "OR" logic.  So if any filter in the list is found to match a name, the item is displayed.  It doesn't have to match all filters.

To remove search terms, click the button that represents it, then click the "Apply filter" button again to see the changes on the map.

### NY Times API

The markers, and the sidebar menu items that are linked to them, each will show a list of New York Times articles, based on a search using the API to look for the name of the marker.




References - Sites I used to recall syntax and methods
=================
* Udacity course materials for Full Stack Web Developer Nano degree
* https://www.w3schools.com/css/css_rwd_grid.asp
    * CSS and responsiveness
    * JS and Google Maps


*   Stack Overflow
    * Too many times to count but I'm pretty sure I didn't take any code verbatim, or even copy and paste.  Mostly used to see how other people resolved similar problems.  For instance...
    * https://stackoverflow.com/questions/16628712/knockout-clearing-field-in-view-model-after-submission 
        * Dealing with clearing form values

* Google Maps API Documentation
    * https://developers.google.com/maps/documentation/javascript
    

* KnockoutJS Documentation
    * http://knockoutjs.com/documentation/introduction.html

    
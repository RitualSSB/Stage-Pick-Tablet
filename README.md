# Stage-Pick-Tablet
  By: Ritual and FlatMochi

## Overview:
A Stage Select Tablet built in Node JS

### Installation: 
  1. Download Code Directory, Unzip to Desired Location.
  2. Install node.js from here: https://nodejs.org/en/download
  3. Open The Folder Stage-Pick-Tablet in your Desired Terminal (On Windows, Right Click within the folder, open in terminal) 
      3.1. Note: This is the folder where server.js is located.
  4. run the command node server.js

### Configuration: 
  Stages are located in Starters and Counterpicks Respectively. 
  to change the stagelist Change the images in each folder.
  To add to obs select the link in your terminal, and add it to obs as a browser source.
  to change the background, add a filter, chromakey, custom, turn the tolerance all the way down, and use this hex code: #e4d7f1 (Background currently designed for easy chroma keying) 
  To Connect on other devices, simply go to the link. (Note, you may have to port forward the available port utilizing UPnP for devices outside your local wifi network. 
  Optional: If you'd like, create a QR code for the link and add it to your stream setup station!

  #### For Images I sourced from: https://www.ssbwiki.com/

## To Do:

#### I taught myself how to code for this project, so ANY AND ALL pull requests to support these features, cleanup code, fix bugs etc. would be much appreciated.

* Add UPNP Support or proper self hosting: 
  * This would allow easier access/setup for non-network devices, either for events without a dedicated device (qr code or link share), or remote events ala EGFC/EGFH
* Package into App:
  * One Click Launch, just needs to still be able to access seperate starter and counterpick folders (FOR NOW)
* Longer Term:
  * Add Application GUI with the following features:
    * GUI to Import/Select/Remove Starter and Counterpicks
    * GUI to Select Default Background Color
    * One Click QR Code Generation for Locals without dedicated device
    * Toggle UPNP or proper selfhosting. 
##

##### For Any Confusion please contact @ritualcasts on twitter.


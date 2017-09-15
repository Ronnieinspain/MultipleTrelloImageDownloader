
/* global TrelloPowerUp */

/*

Trello Data Access

The following methods show all allowed fields, you only need to include those you want
They all return promises that resolve to an object with the requested fields

Get information about the current board
t.board('id', 'name', 'url', 'shortLink', 'members')

Get information about the current list (only available when a specific list is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.list('id', 'name', 'cards')

Get information about all open lists on the current board
t.lists('id', 'name', 'cards')

Get information about the current card (only available when a specific card is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.card('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about all open cards on the current board
t.cards('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about the current active Trello member
t.member('id', 'fullName', 'username')

*/

/*

Storing/Retrieving Your Own Data

Your Power-Up is afforded 4096 chars of space per scope/visibility
The following methods return Promises.

Storing data follows the format: t.set('scope', 'visibility', 'key', 'value')
With the scopes, you can only store data at the 'card' scope when a card is in scope
So for example in the context of 'card-badges' or 'attachment-sections', but not 'board-badges' or 'show-settings'
Also keep in mind storing at the 'organization' scope will only work if the active user is a member of the team

Information that is private to the current user, such as tokens should be stored using 'private'

t.set('organization', 'private', 'key', 'value');
t.set('board', 'private', 'key', 'value');
t.set('card', 'private', 'key', 'value');

Information that should be available to all users of the Power-Up should be stored as 'shared'

t.set('organization', 'shared', 'key', 'value');
t.set('board', 'shared', 'key', 'value');
t.set('card', 'shared', 'key', 'value');

If you want to set multiple keys at once you can do that like so

t.set('board', 'shared', { key: value, extra: extraValue });

Reading back your data is as simple as

t.get('organization', 'shared', 'key');

Or want all in scope data at once?

t.getAll();

*/

var Promise = TrelloPowerUp.Promise;

var MAIN_APP_ICON = 'https://cdn.glitch.com/36bbf899-fba2-4426-a1c5-2a898e7008d9%2Fdownload_icon.png?1504165646959';


window.TrelloPowerUp.initialize({
  'card-buttons': function(t, options){
    return [{
      icon: MAIN_APP_ICON,
      text: 'Card Buttons',
      callback: function (t, opts) { 
      
      }
    }];
  },
  'card-detail-badges': function(t, options){
    return [{
      icon: MAIN_APP_ICON,
      text: 'Card Detail Badges',
      callback: function (t, opts) { 
      
      }
    }];
  },
  /*
  'show-settings': function(t, options){
    return [{
      icon: MAIN_APP_ICON,
      text: 'PowerUp Options',
      callback: function (t, opts) { 
      
      }
    }];
  }, */
  'show-settings': function(t, options){
    // when a user clicks the gear icon by your Power-Up in the Power-Ups menu
    // what should Trello show. We highly recommend the popup in this case as
    // it is the least disruptive, and fits in well with the rest of Trello's UX
    return t.popup({
      title: 'Settings',
      text: 'This is the settings page text.',
      url: './settings.html',
      height: 200 // we can always resize later, but if we know the size in advance, its good to tell Trello
    });
  },
  
  // NEW STUFF BELOW
  
  'attachment-sections': function(t, options){
    return [{
      icon: MAIN_APP_ICON,
      text: 'Attachment Sections',
      callback: function (t, opts) { 
      
      }
    }];
  }, 
  'attachment-thumbnail': function(t, options){
    return [{
      icon: MAIN_APP_ICON,
      text: 'attachment Thumbnail',
      callback: function (t, opts) { 
      
      }
    }];
  }, 
  'board-buttons': function(t, options){
    return [{
      icon: MAIN_APP_ICON,
      text: 'Multi-Download',
      callback: multiDownloadBoardButtonCallback(t)
    }];
  }, 
  'card-badges': function(t, options){
    return [{
      icon: MAIN_APP_ICON,
      text: cardBadgesAttachmentsText(t),
      callback: listAttachmentsAsBadgeCallback(t)
    }];
  },
  
  'card-from-url': function(t, options){
    return [{
      icon: MAIN_APP_ICON,
      text: 'Card from URL',
      callback: function (t, opts) { 
      
      }
    }];
  },
  'format-url': function(t, options){
    return [{
      icon: MAIN_APP_ICON,
      text: 'Format URL',
      callback: function (t, opts) { 
      
      }
    }];
  },
  'show-authorization': function(t, options){
    return t.popup({
      title: 'Authorize Account',
      url: './auth.html',
      height: 140,
    });
  },
  'authorization-status': function(t, options){
    return [{
      icon: MAIN_APP_ICON,
      text: 'Authorization Status',
      callback: function (t, opts) { 
      
      }
    }];
  },
});


//
//
//   FUNCTIONS CALLED BY THE CAPABILITIES CALLED DEFINED ABOVE AND CALLED IN MANIFEST
//
//




var multiDownloadBoardButtonCallback = function(t){
  
  /* Clicking this button, the following should happen:
     
     1. It should be checked if a card with the name "LIST NAME" + MULTIPLE DOWNLOAD already exists
     2. If this exists, it should list the total amount of files attached to any of the cards in that list has
     3. If this card does not exist, it should be created and then step 2 should be fullfilled.
     
  
  */

  
   return t.lists('all')
           .then(function (lists) {
     /*
              console.log('step 1');
              console.log(JSON.stringify(lists[0].name, null, 2));
     
     */         
      // check if card with listname + "multi-download" already exists

     // console.log(JSON.stringify(lists, null, 2));
     var hasMultiDownloadCard = false;
     var NewCardName = '';

     console.log('Number of lists: ' + lists.length); 

     
     

     for ( var i = 0; i < lists.length; i++ ){
        
       // Name given to the new card created
       NewCardName = lists[i].name + ' Multi Download';
       
       // console.log('List "' + lists[i].name + '" has ' + lists[i].cards.length + ' cards.');

        if ( lists[i].cards.length > 0  ){
        
          console.log('List: "' + lists[i].name + '" has ' + lists[i].cards.length + ' cards.');
          
          for (var x = 0; x < lists[i].cards.length; x++ ){
            
            if ( lists[i].cards[x].name == NewCardName ){
            
              // card already exists, do not create
              hasMultiDownloadCard = true;
              // exit the for loop if found
              break;
                
            }
            
          }
          
          if( hasMultiDownloadCard ){
            
             console.log('This list already has a card named "' + NewCardName + '"');
            
          } else {
          
          // card does not exist in current list create it and set its position to top
     
          var newCard = {
            name: NewCardName,
            desc: '',
            position: 'top',
            idList: lists[0].id,
          };
          
          // below creates an infinite loop !?
          // t.set('board', 'shared', newCard);  
          
          console.log(JSON.stringify(newCard, null, 2));
          
          }
            
        } 

     }






      // console.log(JSON.stringify(newCard, null, 2));

    });
  
   /* 
   // working example
   return t.lists('all')
    .then(function (lists) {
      console.log(JSON.stringify(lists, null, 2));
    });
   
   */
  
    
  /*
  //Get information about the current board
  //t.board('id', 'name', 'url', 'shortLink', 'members')
  return t.board('all')
    .then(function (board) {
      console.log(JSON.stringify(board, null, 2));
  }); */
  
  
};


var cardBadgesAttachmentsText = function(t){

  // t.card('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')
  
  /*
   return t.card('name')
           .then(function (card) {
     
           var cardName = JSON.stringify(card.attachments, null, 2);
     
           console.log(cardName);
           return cardName;
   });
   */
  
  
  
  return t.card('attachments')
          .then(function(attachments){
                  
                  var cardAttachments = t.attachments;
  
                  return cardAttachments + ' attachments.';
  
                  console.log(JSON.stringify(cardAttachments, null, 2));
          });
  

  
};

              
              
              
var listAttachmentsAsBadgeCallback = function(t){
  
}
  
  
  

console.log('Loaded by: ' + document.referrer);
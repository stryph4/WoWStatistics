function getElementFromTemplate(id) {
  let domNode = document.importNode(document.getElementById(id).content, true).firstElementChild;

  return domNode;
}

document.addEventListener('DOMContentLoaded', () => {
var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://us.api.battle.net/wow/character/Illidan/Stryph?fields=statistics&locale=en_US&apikey=e6v3m4vwqxgdyqwybfvkrdvk8j69h2cu",
    "method": "GET",
    "headers": {
      "Cache-Control": "no-cache",
      "Postman-Token": "473bbd2f-591b-40d1-9db7-59db78dbae10"
    }
  }
  
  $.ajax(settings).done(function (character) {
    const name = character.name;
    const realm = character.realm;
    const achievementPoints = character.achievementPoints;
    const charpic = "http://render-us.worldofwarcraft.com/character/" + character.thumbnail;

    document.querySelector("#charactername").innerText = name;
    document.querySelector("#realm").innerText = realm;
    document.querySelector("#achievementpts").innerText = 'Achievement Pts: ' + achievementPoints;
    document.querySelector("#charpic").src = charpic;

    console.log(character);

    //Access the base of subcategories
    const categoriesbase = character.statistics.subCategories;

    //Use the template for an accordion to store the data, 
    //and loop through the layers to populate them with data
    for (let base = 0; base < categoriesbase.length; base++){
      let temp = getElementFromTemplate('statbase');
      let panel = getElementFromTemplate('statbase').nextElementSibling;
      document.querySelector('div.maindiv').insertAdjacentElement('beforeend', temp);
      document.querySelector('div.maindiv').insertAdjacentElement('beforeend', panel);
      temp.innerText = categoriesbase[base].name;

      //Access the second layer of subcategories
      let categoriessecond = categoriesbase[base].subCategories;

      //Check to see if the second layer of categories is undefined
      if (categoriessecond === undefined){

        //If it is undefined, access the statistics for that category from the base layer
        categoriessecond = categoriesbase[base].statistics;

        //Loop through the second layer of statistics
        for(let second = 0; second < categoriessecond.length; second++){

          //If 'highest' exists, add the string to the panel
          if ('highest' in categoriessecond[second]){

            panel.innerHTML += "<ul><li>" + categoriessecond[second].name + ": " + categoriessecond[second].highest + "</li></ul>";

          }

          //If not, use the quantity instead
          else {
            panel.innerHTML += "<ul><li>" + categoriessecond[second].name + ": " + categoriessecond[second].quantity + "</li></ul>";
          }
        }
      }

      //If the second layer of categories is not undefined
      else {
        //add the name of each statistic to the list
        for(let second = 0; second < categoriessecond.length; second++){
          panel.innerHTML += "<ul><li>" + categoriessecond[second].name + "</li>";

          //Access the third layer of statistics
          let categoriesthird = categoriessecond[second].statistics;

            //Loop through the third layer of statistics
            for(let third = 0; third < categoriesthird.length; third++){
              
              //Make sure the name is not undefined
              if(categoriesthird[third].name !== undefined){

                  //Check to see if 'highest' exists in the third layer of statistics
                  if ('highest' in categoriesthird[third]){

                    //If so, get the string attached to it
                    panel.innerHTML += "<ul><li>&emsp; - " + categoriesthird[third].name + ": " + categoriesthird[third].highest + "</li>"
                  }

                  //If not, get the quantity instead
                  else {
                    panel.innerHTML += "<ul><li>&emsp; - " + categoriesthird[third].name + ": " + categoriesthird[third].quantity + "</li>"
                  }
                    
                  
              }
            }
          }
      }

      //Close the list
      panel.innerHTML += "</ul>";
  }

    activateAccordions();

      
    });

  });


  /**
   * Activates all of the accordions on the page.
   * Used to assure that this function
   * is only run once all of the data
   * has been retrieved.
   */
  function activateAccordions(){
    var acc = document.getElementsByClassName("accordion");
    var i;
    
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
    
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }
  }

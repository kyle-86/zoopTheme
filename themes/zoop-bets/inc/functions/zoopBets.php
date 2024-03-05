<?php
// create custom plugin settings menu
add_action('admin_menu', 'zoopBets_create_menu');

function zoopBets_create_menu()
{

  //create new top-level menu
  add_menu_page('Zoop Bet Settings', 'Zoop BETS', 'administrator', __FILE__, 'zoopBets_settings_page');

  //call register settings function
  // add_action('admin_init', 'register_zoopBets_settings');
}


function zoopBets_settings_page()
{
?>
  <div class="wrap">
    <h1>Zoop BETS</h1>

    <h2>Get Results</h2>
    <button id="zoop-results">Run</button>

  </div>

<!-- Add this script tag in your WordPress site's front-end template (e.g., header.php or footer.php) -->
<!-- Add this script tag in your WordPress site's front-end template (e.g., header.php or footer.php) -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Run script when button is clicked
    var button = document.getElementById('zoop-results');
    button.addEventListener('click', function() {
      // const jsonUrl = 'http://3.26.144.172/';
      const jsonUrl = 'http://127.0.0.1:8000/';
      fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
          // Loop through each entry in the JSON data
          data.forEach(entry => {
            // Check if 'betResult' exists in the entry
            if (entry.hasOwnProperty('betResult') && entry.betResult.trim() !== '') {
              const referenceId = entry.refrenceId; // Corrected parameter name
              const betResult = entry.betResult; // Corrected parameter name

              // Make API request for the entry with 'betResult'
              const requestData = {
                refrenceId: referenceId,
                betResult: betResult
              };

              // console.log(betResult);

              fetch('/zoop/wp-json/zoop/v1/update_bet_results/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(requestData)
                })
                .then(response => response.json())
                .then(result => {
                  console.log(`Request completed for entry with referenceId: ${referenceId}, betResult: ${betResult}`);
                })
                .catch(error => {
                  console.error('Error:', error);
                });

                console.log('Completed all Results');
            }
          });
        })
        .catch(error => {
          console.error('Error fetching JSON data:', error);
        });
    });
  });
</script>


<?php } ?>
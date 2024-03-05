<?php
// Place this code at the beginning of the template file where you want to check if the user is logged in.

// Check if the user is not logged in
if (!is_user_logged_in()) {
  // Get the login page URL
  $login_url = wp_login_url();

  // Redirect the user to the login page
  wp_redirect($login_url);

  // Exit to prevent further execution
  exit;
}
?>

<section class="<?php echo $cleaned_layout_name; ?>__block">
  <div class="container">
    <div class="row">

      <?php if ($content = get_sub_field('content')) { ?>
        <div class="col-lg-12">
          <div class="content_area">
            <?php echo $content; ?>
          </div>
        </div>
      <?php } ?>

      <div class="col-xl-12">
        <div class="box-container">

          <div class="time-period-toggle">
            <!-- <div class="eachPeriod">
              <input type="radio" id="today" name="time-period" value="today">
              <label for="today">Today</label>
            </div> -->

            <div class="eachPeriod">
              <input type="radio" id="lastWeek" name="time-period" value="lastWeek" checked>
              <label for="lastWeek">Week</label>
            </div>

            <div class="eachPeriod">
              <input type="radio" id="lastMonth" name="time-period" value="lastMonth">
              <label for="lastMonth">Month</label>
            </div>

            <div class="eachPeriod">
              <input type="radio" id="lastYear" name="time-period" value="lastYear">
              <label for="lastYear">Year</label>
            </div>

            <div class="eachPeriod">
              <input type="radio" id="allTime" name="time-period" value="allTime">
              <label for="allTime">All Time</label>
            </div>
          </div>

        </div>
      </div>

      <div class="col-xl-9 order-2 order-xl-1">
        <div class="box-container">
          <div class="theChart hidden">
            <canvas id="winningLineChart"></canvas>
          </div>
          <div class="loader">
          </div>
        </div>
      </div>
      <div class="col-xl-3 align-self-center results-sidebar order-1 order-xl-2">

        <div class="box-container totalWiningsBlock">
          <div class="bodymeium-16-regular text-center">
            <strong> Total Profits </strong>
          </div>
          <div class="totalWinings text-center displaysmall-32-bold">

          </div>
        </div>

        <div class="box-container totalStakedBlock">
          <div class="bodymeium-16-regular text-center">
            <strong> Total staked </strong>
          </div>
          <div class="totalStaked text-center displaysmall-32-bold">

          </div>
        </div>

        <div class="box-container totalBetsBlock">
          <div class="bodymeium-16-regular text-center">
            <strong> Total Bets </strong>
          </div>
          <div class="totalBets text-center displaysmall-32-bold">

          </div>
        </div>

        <div class="box-container avgBetsBlock">
          <div class="bodymeium-16-regular text-center">
            <strong>Average Bet</strong>
          </div>
          <div class="avgBet text-center displaysmall-32-bold">

          </div>
        </div>

        <!-- COMING SOON!!! <div class="box-container">
          <div class="bodymeium-16-regular text-center">
            Win Rate 
          </div>
          <div class="totalBets text-center displaysmall-32-bold">

          </div>
        </div> -->
      </div>

    </div>
    <div class="row m-t-30">
      <div class="col-12">
        <table id="completedBets" class="display" style="width:100%">
          <thead>
            <tr>
              <th>Completed</th>
              <th>Bet</th>
              <th>Line</th>
              <th>Agency</th>
              <th>Waged</th>
              <th>Odds</th>
              <th>Profit</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            <!-- Data will be dynamically added here -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>
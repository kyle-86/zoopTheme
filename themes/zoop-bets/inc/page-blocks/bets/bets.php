<section class="<?php echo $cleaned_layout_name; ?>__block">

  <?php if ($content = get_sub_field('content')) : ?>
    <div class="page_content m-b-40">
      <?php echo $content; ?>
    </div>
  <?php endif; ?>

  <table id="valueBets" class="display" style="width:100%">
    <thead>
      <tr>
        <th>Event Time</th>
        <th>Event</th>
        <th>Sport</th>
        <th>Prediction</th>
        <th>Line</th>
        <th>Agency</th>
        <th><input type="text" id="minValueSearch" name="minValueSearch" placeholder="Min Value"></th>
        <th><input type="text" id="maxOddsSearch" name="maxOddsSearch" placeholder="Max Odds"></th>
      </tr>
    </thead>
    <tbody>
      <!-- Data will be dynamically added here -->
    </tbody>
  </table>

  <!-- Bootstrap Modal -->
  <div class="modal fade" id="betsModal" tabindex="-1" role="dialog" aria-labelledby="valueBetModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
      <div class="modal-content">
        <div class="modal-header justify-content-center">
          <h5 class="modal-title text-center" id="valueBetModal">Bet Details</h5>
        </div>

        <div class="modal-body small">
          <!-- Content for modal body goes here -->
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-secondary save-bet-button">Save</button>
        </div>
      </div>
    </div>
  </div>


</section>
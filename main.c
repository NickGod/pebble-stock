#include <pebble.h>

static Window *s_main_window;
static TextLayer *s_time_layer;
static TextLayer *s_stock_layer;
static TextLayer *s_percentage_layer;

static void update_time() {
  // Get a tm structure
  time_t temp = time(NULL); 
  struct tm *tick_time = localtime(&temp);

  // Create a long-lived buffer
  static char buffer[] = "00:00";

  // Write the current hours and minutes into the buffer
  if(clock_is_24h_style() == true) {
    // Use 24 hour format
    strftime(buffer, sizeof("00:00"), "%H:%M", tick_time);
  } else {
    // Use 12 hour format
    strftime(buffer, sizeof("00:00"), "%I:%M", tick_time);
  }

  // Display this time on the TextLayer
  text_layer_set_text(s_time_layer, buffer);
}

static void tick_handler(struct tm *tick_time, TimeUnits units_changed) {
  update_time();
}

static void main_window_load(Window *window) {
  // Create time TextLayer
  s_time_layer = text_layer_create(GRect(0, 10, 144, 50));
  text_layer_set_background_color(s_time_layer, GColorClear);
  text_layer_set_text_color(s_time_layer, GColorBlack);


  // Improve the layout to be more like a watchface
  text_layer_set_font(s_time_layer, fonts_get_system_font(FONT_KEY_BITHAM_42_BOLD));
  text_layer_set_text_alignment(s_time_layer, GTextAlignmentCenter);

  // Add it as a child layer to the Window's root layer
  layer_add_child(window_get_root_layer(window), text_layer_get_layer(s_time_layer));

  // Create StockLayer
  s_stock_layer = text_layer_create(GRect(0, 70, 144, 25));
  text_layer_set_background_color(s_stock_layer, GColorClear);
  text_layer_set_text_color(s_stock_layer, GColorBlack);
  text_layer_set_text_alignment(s_stock_layer, GTextAlignmentCenter);
  text_layer_set_text(s_stock_layer, "GOOG");

  // Setting the custom font for stock display
  text_layer_set_font(s_stock_layer, fonts_get_system_font(FONT_KEY_ROBOTO_CONDENSED_21));
  layer_add_child(window_get_root_layer(window), text_layer_get_layer(s_stock_layer));

  // Create PercentageLayer
  s_percentage_layer = text_layer_create(GRect(0, 100, 144, 25));
  text_layer_set_background_color(s_percentage_layer, GColorClear);
  text_layer_set_text_color(s_percentage_layer, GColorBlack);
  text_layer_set_text_alignment(s_percentage_layer, GTextAlignmentCenter);
  text_layer_set_text(s_percentage_layer, "$10000000");

  text_layer_set_font(s_percentage_layer, fonts_get_system_font(FONT_KEY_ROBOTO_CONDENSED_21));
  layer_add_child(window_get_root_layer(window), text_layer_get_layer(s_percentage_layer));



  // Make sure the time is displayed from the beginning
  update_time();
}

static void main_window_unload(Window *window) {
    // Destroy time element
    text_layer_destroy(s_time_layer);

    // Destroy stock elements
  text_layer_destroy(s_stock_layer);
  text_layer_destroy(s_percentage_layer);


}

static void init() {
  s_main_window = window_create();
  
  
  window_set_window_handlers(s_main_window, (WindowHandlers) {
    .load = main_window_load,
    .unload = main_window_unload
  });
  
  window_stack_push(s_main_window, true);
  
  tick_timer_service_subscribe(MINUTE_UNIT, tick_handler);
}

static void deinit() {
  window_destroy(s_main_window);
}

int main(void) {
  init();
  app_event_loop();
  deinit();
}
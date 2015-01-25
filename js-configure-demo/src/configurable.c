#include <pebble.h>

static char symbol[6];
static char price[10];

static Window *s_main_window;
static TextLayer *s_stock_layer, * s_time_layer, *s_percentage_layer;
static GFont s_time_font;
static GFont s_stock_font;
static GFont s_percentage_font;


enum {
  QUOTE_KEY_INIT = 0x0,
  QUOTE_KEY_FETCH = 0x1,
  QUOTE_KEY_SYMBOL = 0x2,
  QUOTE_KEY_PRICE = 0x03,
};

static void in_received_handler(DictionaryIterator *iter, void *context) {
  
  Tuple *symbol_tuple = dict_find(iter, QUOTE_KEY_SYMBOL);
  Tuple *price_tuple = dict_find(iter, QUOTE_KEY_PRICE);

		if (symbol_tuple) {
			strncpy(symbol, symbol_tuple->value->cstring, 6);
			text_layer_set_text(s_stock_layer, symbol);
		} else {
			strncpy(symbol, "N/A", 5);
			text_layer_set_text(s_stock_layer, symbol);
		}

		if (price_tuple) {
			strncpy(price, price_tuple->value->cstring, 10);
			text_layer_set_text(s_percentage_layer, price);
			vibes_double_pulse();
		} else {
			strncpy(price, "Error 3", 10);
			text_layer_set_text(s_percentage_layer, price);
		}

}

static void in_dropped_handler(AppMessageResult reason, void *context) {

//     strncpy(symbol, "N/A", 5);
//     text_layer_set_text(symbol_layer, symbol);
// 
//     strncpy(price, "Error 2", 10);
//     text_layer_set_text(price_layer, price);

}

static void out_failed_handler(DictionaryIterator *failed, AppMessageResult reason, void *context) {
  
   
//     strncpy(symbol, "N/A", 5);
//     text_layer_set_text(symbol_layer, symbol);
//  
//     strncpy(price, "Error 1", 10);
//     text_layer_set_text(price_layer, price);

}

static void app_message_init(void) {
  // Register message handlers
  app_message_register_inbox_received(in_received_handler);
  app_message_register_inbox_dropped(in_dropped_handler);
  app_message_register_outbox_failed(out_failed_handler);
  // Init buffers
  app_message_open(64, 64);
}

// static void select_click_handler(ClickRecognizerRef recognizer, void *context) {
//   // refresh
//   text_layer_set_text(price_layer, "Loading...");
//   send_to_phone(QUOTE_KEY_FETCH);
// }
// 
// static void select_long_click_handler(ClickRecognizerRef recognizer, void *context) {
//   // refresh
//   text_layer_set_text(symbol_layer, symbol);
//   text_layer_set_text(price_layer, "Loading...");
// }




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

  //Set Gfont
  //s_time_font = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_PERFECT_DOS_48));

  // Improve the layout to be more like a watchface
  //text_layer_set_font(s_time_layer, s_time_font);
  text_layer_set_font(s_time_layer,fonts_get_system_font(FONT_KEY_BITHAM_30_BLACK));
  text_layer_set_text_alignment(s_time_layer, GTextAlignmentCenter);

  // Add it as a child layer to the Window's root layer
  layer_add_child(window_get_root_layer(window), text_layer_get_layer(s_time_layer));

  // Create StockLayer
  s_stock_layer = text_layer_create(GRect(0, 50, 144, 35));
  text_layer_set_background_color(s_stock_layer, GColorClear);
  text_layer_set_text_color(s_stock_layer, GColorBlack);
  text_layer_set_text_alignment(s_stock_layer, GTextAlignmentCenter);
  text_layer_set_text(s_stock_layer, "BRCM");

  // Setting the custom font for stock display
  //s_stock_font = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_PERFECT_DOS_20));
  //text_layer_set_font(s_stock_layer, s_stock_font);
  text_layer_set_font(s_stock_layer, fonts_get_system_font(FONT_KEY_BITHAM_30_BLACK));
  layer_add_child(window_get_root_layer(window), text_layer_get_layer(s_stock_layer));

  // Create PercentageLayer
  s_percentage_layer = text_layer_create(GRect(0, 100, 144, 25));
  text_layer_set_background_color(s_percentage_layer, GColorClear);
  text_layer_set_text_color(s_percentage_layer, GColorBlack);
  text_layer_set_text_alignment(s_percentage_layer, GTextAlignmentCenter);
  text_layer_set_text(s_percentage_layer, "%5.5");

//   s_percentage_font = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_PERFECT_DOS_20));
//   text_layer_set_font(s_percentage_layer, s_percentage_font);
  text_layer_set_font(s_stock_layer, fonts_get_system_font(FONT_KEY_GOTHIC_28));
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

  fonts_unload_custom_font(s_stock_font);
  fonts_unload_custom_font(s_time_font);
  fonts_unload_custom_font(s_percentage_font);
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
  app_message_init();

  app_event_loop();
  deinit();
}

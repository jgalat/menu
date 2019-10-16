export function DISHES(menu) {
  const dishes = {};
  
  dishes['DAY_MENU1'] = menu.menu1;
  dishes['DAY_MENU2'] = menu.menu2;
  dishes['DAY_MENU3'] = menu.menu3;
  dishes['DAY_SALAD'] = menu.daySalad;
  dishes['DAY_PIE'] = menu.dayPie;
  dishes['DAY_VEGGIE'] = menu.dayVeggie;

  return dishes;
}

export const DRINKS = {
  NO_DRINK: 'NO DRINK'
};

export const DESSERTS = {
  NO_DESSERT: 'NO DESSERT'
};


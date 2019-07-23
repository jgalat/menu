const _DISHES = {
  SUPREMA_PURE: 'Suprema con puré',
  SUPREMA_ENSALADA: 'Suprema con ensalada',
  OMELETTE_ENSALADA: 'Omelette con ensalada',
  OMELETTE_ARROZ: 'Omelette con arroz',
  TALLARINES_FILETO: 'Tallarines con fileto',
  TALLARINES_ALFREDO: 'Tallarines con alfredo',
  TALLARINES_MIXTA: 'Tallarines con mixta',
  MILANGA_PURE: 'Milanga con puré',
  MILANGA_ENSALADA: 'Milanga con ensalada',
  ENSALDA_BG: 'Ensalada Be Green',
  ENSALADA_BG_NO_POLLO: 'Ensalada Be Green sin pollo',
  PECHUGA_GRILLADA: 'Pechuga grillada',
};

export function DISHES(menu) {
  const dishes = {};
  dishes['DAY_MENU'] = menu.dayMenu;

  if (menu.pie1) {
    dishes['PIE_1_ENSALADA'] = `Tarta ${menu.pie1} con ensalada`;
    dishes['PIE_1_PAPA'] = `Tarta ${menu.pie1} con papas`;
  }

  if (menu.pie2) {
    dishes['PIE_2_ENSALADA'] = `Tarta ${menu.pie2} con ensalada`;
    dishes['PIE_2_PAPA'] = `Tarta ${menu.pie2} con papas`;
  }

  if (menu.pie3) {
    dishes['PIE_3_ENSALADA'] = `Tarta ${menu.pie3} con ensalada`;
    dishes['PIE_3_PAPA'] = `Tarta ${menu.pie3} con papas`;
  }

  Object.assign(dishes, _DISHES);
  return dishes;
}

export const DRINKS = {
  AGUA: 'Agua',
  SODA: 'Soda',
  POMELO: 'Pomelo',
  PERA: 'Pera',
  MANZANA: 'Manzana',
};

export const DESSERTS = {
  FLAN: 'Flan',
  FRUTAS: 'Ensalada de frutas',
};

export const BE_GREEN_PHONE = '5493413042263';

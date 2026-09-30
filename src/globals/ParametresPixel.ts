// src/globals/ParametresPixel.ts
import type { GlobalConfig } from 'payload'

export const ParametresPixel: GlobalConfig = {
  slug: 'parametres-pixel',
  label: 'Canvas participatif — paramètres',
  access: { read: () => true },
  fields: [
    {
      name: 'rechargeMinutes',
      type: 'number',
      label: 'Recharge : 1 pixel toutes les X minutes',
      defaultValue: 1,
      required: true,
    },
    {
      name: 'reserveMax',
      type: 'number',
      label: 'Réserve maximale de pixels',
      defaultValue: 10,
      required: true,
    },
  ],
}
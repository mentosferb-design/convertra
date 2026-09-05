require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const CURRENCY_META = {
  AED: { name: 'UAE Dirham', flag: '\u{1F1E6}\u{1F1EA}' }, AFN: { name: 'Afghan Afghani', flag: '\u{1F1E6}\u{1F1EB}' },
  ALL: { name: 'Albanian Lek', flag: '\u{1F1E6}\u{1F1F1}' }, AMD: { name: 'Armenian Dram', flag: '\u{1F1E6}\u{1F1F2}' },
  ANG: { name: 'Netherlands Antillean Guilder', flag: '\u{1F1E8}\u{1F1FC}' }, AOA: { name: 'Angolan Kwanza', flag: '\u{1F1E6}\u{1F1F4}' },
  ARS: { name: 'Argentine Peso', flag: '\u{1F1E6}\u{1F1F7}' }, AUD: { name: 'Australian Dollar', flag: '\u{1F1E6}\u{1F1FA}' },
  AWG: { name: 'Aruban Florin', flag: '\u{1F1E6}\u{1F1FC}' }, AZN: { name: 'Azerbaijani Manat', flag: '\u{1F1E6}\u{1F1FF}' },
  BAM: { name: 'Bosnia-Herzegovina Mark', flag: '\u{1F1E7}\u{1F1E6}' }, BBD: { name: 'Barbadian Dollar', flag: '\u{1F1E7}\u{1F1E7}' },
  BDT: { name: 'Bangladeshi Taka', flag: '\u{1F1E7}\u{1F1E9}' }, BGN: { name: 'Bulgarian Lev', flag: '\u{1F1E7}\u{1F1EC}' },
  BHD: { name: 'Bahraini Dinar', flag: '\u{1F1E7}\u{1F1ED}' }, BIF: { name: 'Burundian Franc', flag: '\u{1F1E7}\u{1F1EE}' },
  BMD: { name: 'Bermudian Dollar', flag: '\u{1F1E7}\u{1F1F2}' }, BND: { name: 'Brunei Dollar', flag: '\u{1F1E7}\u{1F1F3}' },
  BOB: { name: 'Bolivian Boliviano', flag: '\u{1F1E7}\u{1F1F4}' }, BRL: { name: 'Brazilian Real', flag: '\u{1F1E7}\u{1F1F7}' },
  BSD: { name: 'Bahamian Dollar', flag: '\u{1F1E7}\u{1F1F8}' }, BTN: { name: 'Bhutanese Ngultrum', flag: '\u{1F1E7}\u{1F1F9}' },
  BWP: { name: 'Botswana Pula', flag: '\u{1F1E7}\u{1F1FC}' }, BYN: { name: 'Belarusian Ruble', flag: '\u{1F1E7}\u{1F1FE}' },
  BZD: { name: 'Belize Dollar', flag: '\u{1F1E7}\u{1F1FF}' }, CAD: { name: 'Canadian Dollar', flag: '\u{1F1E8}\u{1F1E6}' },
  CDF: { name: 'Congolese Franc', flag: '\u{1F1E8}\u{1F1E9}' }, CHF: { name: 'Swiss Franc', flag: '\u{1F1E8}\u{1F1ED}' },
  CLP: { name: 'Chilean Peso', flag: '\u{1F1E8}\u{1F1F1}' }, CNY: { name: 'Chinese Yuan', flag: '\u{1F1E8}\u{1F1F3}' },
  COP: { name: 'Colombian Peso', flag: '\u{1F1E8}\u{1F1F4}' }, CRC: { name: 'Costa Rican Colón', flag: '\u{1F1E8}\u{1F1F7}' },
  CVE: { name: 'Cape Verdean Escudo', flag: '\u{1F1E8}\u{1F1FB}' }, CZK: { name: 'Czech Koruna', flag: '\u{1F1E8}\u{1F1FF}' },
  DJF: { name: 'Djiboutian Franc', flag: '\u{1F1E9}\u{1F1EF}' }, DKK: { name: 'Danish Krone', flag: '\u{1F1E9}\u{1F1F0}' },
  DOP: { name: 'Dominican Peso', flag: '\u{1F1E9}\u{1F1F4}' }, DZD: { name: 'Algerian Dinar', flag: '\u{1F1E9}\u{1F1FF}' },
  EGP: { name: 'Egyptian Pound', flag: '\u{1F1EA}\u{1F1EC}' }, ERN: { name: 'Eritrean Nakfa', flag: '\u{1F1EA}\u{1F1F7}' },
  ETB: { name: 'Ethiopian Birr', flag: '\u{1F1EA}\u{1F1F9}' }, EUR: { name: 'Euro', flag: '\u{1F1EA}\u{1F1FA}' },
  FJD: { name: 'Fijian Dollar', flag: '\u{1F1EB}\u{1F1EF}' }, GBP: { name: 'British Pound', flag: '\u{1F1EC}\u{1F1E7}' },
  GEL: { name: 'Georgian Lari', flag: '\u{1F1EC}\u{1F1EA}' }, GHS: { name: 'Ghanaian Cedi', flag: '\u{1F1EC}\u{1F1ED}' },
  GMD: { name: 'Gambian Dalasi', flag: '\u{1F1EC}\u{1F1F2}' }, GNF: { name: 'Guinean Franc', flag: '\u{1F1EC}\u{1F1F3}' },
  GTQ: { name: 'Guatemalan Quetzal', flag: '\u{1F1EC}\u{1F1F9}' }, GYD: { name: 'Guyanese Dollar', flag: '\u{1F1EC}\u{1F1FE}' },
  HKD: { name: 'Hong Kong Dollar', flag: '\u{1F1ED}\u{1F1F0}' }, HNL: { name: 'Honduran Lempira', flag: '\u{1F1ED}\u{1F1F3}' },
  HRK: { name: 'Croatian Kuna', flag: '\u{1F1ED}\u{1F1F7}' }, HTG: { name: 'Haitian Gourde', flag: '\u{1F1ED}\u{1F1F9}' },
  HUF: { name: 'Hungarian Forint', flag: '\u{1F1ED}\u{1F1FA}' }, IDR: { name: 'Indonesian Rupiah', flag: '\u{1F1EE}\u{1F1E9}' },
  ILS: { name: 'Israeli New Shekel', flag: '\u{1F1EE}\u{1F1F1}' }, INR: { name: 'Indian Rupee', flag: '\u{1F1EE}\u{1F1F3}' },
  IQD: { name: 'Iraqi Dinar', flag: '\u{1F1EE}\u{1F1F6}' }, IRR: { name: 'Iranian Rial', flag: '\u{1F1EE}\u{1F1F7}' },
  ISK: { name: 'Icelandic Króna', flag: '\u{1F1EE}\u{1F1F8}' }, JMD: { name: 'Jamaican Dollar', flag: '\u{1F1EF}\u{1F1F2}' },
  JOD: { name: 'Jordanian Dinar', flag: '\u{1F1EF}\u{1F1F4}' }, JPY: { name: 'Japanese Yen', flag: '\u{1F1EF}\u{1F1F5}' },
  KES: { name: 'Kenyan Shilling', flag: '\u{1F1F0}\u{1F1EA}' }, KGS: { name: 'Kyrgyzstani Som', flag: '\u{1F1F0}\u{1F1EC}' },
  KHR: { name: 'Cambodian Riel', flag: '\u{1F1F0}\u{1F1ED}' }, KMF: { name: 'Comorian Franc', flag: '\u{1F1F0}\u{1F1F2}' },
  KRW: { name: 'South Korean Won', flag: '\u{1F1F0}\u{1F1F7}' }, KWD: { name: 'Kuwaiti Dinar', flag: '\u{1F1F0}\u{1F1FC}' },
  KYD: { name: 'Cayman Islands Dollar', flag: '\u{1F1F0}\u{1F1FE}' }, KZT: { name: 'Kazakhstani Tenge', flag: '\u{1F1F0}\u{1F1FF}' },
  LAK: { name: 'Lao Kip', flag: '\u{1F1F1}\u{1F1E6}' }, LBP: { name: 'Lebanese Pound', flag: '\u{1F1F1}\u{1F1E7}' },
  LKR: { name: 'Sri Lankan Rupee', flag: '\u{1F1F1}\u{1F1F0}' }, LRD: { name: 'Liberian Dollar', flag: '\u{1F1F1}\u{1F1F7}' },
  LSL: { name: 'Lesotho Loti', flag: '\u{1F1F1}\u{1F1F8}' }, LYD: { name: 'Libyan Dinar', flag: '\u{1F1F1}\u{1F1FE}' },
  MAD: { name: 'Moroccan Dirham', flag: '\u{1F1F2}\u{1F1E6}' }, MDL: { name: 'Moldovan Leu', flag: '\u{1F1F2}\u{1F1E9}' },
  MGA: { name: 'Malagasy Ariary', flag: '\u{1F1F2}\u{1F1EC}' }, MKD: { name: 'Macedonian Denar', flag: '\u{1F1F2}\u{1F1F0}' },
  MMK: { name: 'Myanmar Kyat', flag: '\u{1F1F2}\u{1F1F2}' }, MNT: { name: 'Mongolian Tugrik', flag: '\u{1F1F2}\u{1F1F3}' },
  MOP: { name: 'Macanese Pataca', flag: '\u{1F1F2}\u{1F1F4}' }, MRU: { name: 'Mauritanian Ouguiya', flag: '\u{1F1F2}\u{1F1F7}' },
  MUR: { name: 'Mauritian Rupee', flag: '\u{1F1F2}\u{1F1FA}' }, MVR: { name: 'Maldivian Rufiyaa', flag: '\u{1F1F2}\u{1F1FB}' },
  MWK: { name: 'Malawian Kwacha', flag: '\u{1F1F2}\u{1F1FC}' }, MXN: { name: 'Mexican Peso', flag: '\u{1F1F2}\u{1F1FD}' },
  MYR: { name: 'Malaysian Ringgit', flag: '\u{1F1F2}\u{1F1FE}' }, MZN: { name: 'Mozambican Metical', flag: '\u{1F1F2}\u{1F1FF}' },
  NAD: { name: 'Namibian Dollar', flag: '\u{1F1F3}\u{1F1E6}' }, NGN: { name: 'Nigerian Naira', flag: '\u{1F1F3}\u{1F1EC}' },
  NIO: { name: 'Nicaraguan Córdoba', flag: '\u{1F1F3}\u{1F1EE}' }, NOK: { name: 'Norwegian Krone', flag: '\u{1F1F3}\u{1F1F4}' },
  NPR: { name: 'Nepalese Rupee', flag: '\u{1F1F3}\u{1F1F5}' }, NZD: { name: 'New Zealand Dollar', flag: '\u{1F1F3}\u{1F1FF}' },
  OMR: { name: 'Omani Rial', flag: '\u{1F1F4}\u{1F1F2}' }, PAB: { name: 'Panamanian Balboa', flag: '\u{1F1F5}\u{1F1E6}' },
  PEN: { name: 'Peruvian Sol', flag: '\u{1F1F5}\u{1F1EA}' }, PGK: { name: 'Papua New Guinean Kina', flag: '\u{1F1F5}\u{1F1EC}' },
  PHP: { name: 'Philippine Peso', flag: '\u{1F1F5}\u{1F1ED}' }, PKR: { name: 'Pakistani Rupee', flag: '\u{1F1F5}\u{1F1F0}' },
  PLN: { name: 'Polish Zloty', flag: '\u{1F1F5}\u{1F1F1}' }, PYG: { name: 'Paraguayan Guarani', flag: '\u{1F1F5}\u{1F1FE}' },
  QAR: { name: 'Qatari Riyal', flag: '\u{1F1F6}\u{1F1E6}' }, RON: { name: 'Romanian Leu', flag: '\u{1F1F7}\u{1F1F4}' },
  RSD: { name: 'Serbian Dinar', flag: '\u{1F1F7}\u{1F1F8}' }, RUB: { name: 'Russian Ruble', flag: '\u{1F1F7}\u{1F1FA}' },
  RWF: { name: 'Rwandan Franc', flag: '\u{1F1F7}\u{1F1FC}' }, SAR: { name: 'Saudi Riyal', flag: '\u{1F1F8}\u{1F1E6}' },
  SBD: { name: 'Solomon Islands Dollar', flag: '\u{1F1F8}\u{1F1E7}' }, SCR: { name: 'Seychellois Rupee', flag: '\u{1F1F8}\u{1F1E8}' },
  SDG: { name: 'Sudanese Pound', flag: '\u{1F1F8}\u{1F1E9}' }, SEK: { name: 'Swedish Krona', flag: '\u{1F1F8}\u{1F1EA}' },
  SGD: { name: 'Singapore Dollar', flag: '\u{1F1F8}\u{1F1EC}' }, SLE: { name: 'Sierra Leonean Leone', flag: '\u{1F1F8}\u{1F1F1}' },
  SOS: { name: 'Somali Shilling', flag: '\u{1F1F8}\u{1F1F4}' }, SRD: { name: 'Surinamese Dollar', flag: '\u{1F1F8}\u{1F1F7}' },
  SSP: { name: 'South Sudanese Pound', flag: '\u{1F1F8}\u{1F1F8}' }, SYP: { name: 'Syrian Pound', flag: '\u{1F1F8}\u{1F1FE}' },
  SZL: { name: 'Swazi Lilangeni', flag: '\u{1F1F8}\u{1F1FF}' }, THB: { name: 'Thai Baht', flag: '\u{1F1F9}\u{1F1ED}' },
  TJS: { name: 'Tajikistani Somoni', flag: '\u{1F1F9}\u{1F1EF}' }, TMT: { name: 'Turkmenistani Manat', flag: '\u{1F1F9}\u{1F1F2}' },
  TND: { name: 'Tunisian Dinar', flag: '\u{1F1F9}\u{1F1F3}' }, TOP: { name: 'Tongan Pa\u02BBanga', flag: '\u{1F1F9}\u{1F1F4}' },
  TRY: { name: 'Turkish Lira', flag: '\u{1F1F9}\u{1F1F7}' }, TTD: { name: 'Trinidad & Tobago Dollar', flag: '\u{1F1F9}\u{1F1F9}' },
  TWD: { name: 'New Taiwan Dollar', flag: '\u{1F1F9}\u{1F1FC}' }, TZS: { name: 'Tanzanian Shilling', flag: '\u{1F1F9}\u{1F1FF}' },
  UAH: { name: 'Ukrainian Hryvnia', flag: '\u{1F1FA}\u{1F1E6}' }, UGX: { name: 'Ugandan Shilling', flag: '\u{1F1FA}\u{1F1EC}' },
  USD: { name: 'US Dollar', flag: '\u{1F1FA}\u{1F1F8}' }, UYU: { name: 'Uruguayan Peso', flag: '\u{1F1FA}\u{1F1FE}' },
  UZS: { name: 'Uzbekistani Som', flag: '\u{1F1FA}\u{1F1FF}' }, VES: { name: 'Venezuelan Bolívar', flag: '\u{1F1FB}\u{1F1EA}' },
  VND: { name: 'Vietnamese Dong', flag: '\u{1F1FB}\u{1F1F3}' }, VUV: { name: 'Vanuatu Vatu', flag: '\u{1F1FB}\u{1F1FA}' },
  WST: { name: 'Samoan Tala', flag: '\u{1F1FC}\u{1F1F8}' }, XAF: { name: 'Central African CFA Franc', flag: '\u{1F1E8}\u{1F1EB}' },
  XCD: { name: 'East Caribbean Dollar', flag: '\u{1F1E6}\u{1F1E8}' }, XOF: { name: 'West African CFA Franc', flag: '\u{1F1F8}\u{1F1EB}' },
  XPF: { name: 'CFP Franc', flag: '\u{1F1F5}\u{1F1EB}' }, YER: { name: 'Yemeni Rial', flag: '\u{1F1FE}\u{1F1EA}' },
  ZAR: { name: 'South African Rand', flag: '\u{1F1FF}\u{1F1E6}' }, ZMW: { name: 'Zambian Kwacha', flag: '\u{1F1FF}\u{1F1F2}' },
  ZWL: { name: 'Zimbabwean Dollar', flag: '\u{1F1FF}\u{1F1FC}' }
};

async function seed() {
  const rows = Object.entries(CURRENCY_META).map(([code, { name, flag }]) => ({
    code, name, flag
  }));

  const BATCH = 50;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { data, error } = await supabase
      .from('exchange_rates')
      .upsert(batch, { onConflict: 'code' });
    if (error) {
      console.error(`Batch ${i} error:`, error.message);
    } else {
      console.log(`Inserted batch ${i}–${i + batch.length}`);
    }
  }
  console.log('Done seeding', rows.length, 'currencies.');
}

seed();

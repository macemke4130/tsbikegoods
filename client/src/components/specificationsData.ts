import { SubcategoryObject } from "./Specifications";

export const specQuery = (subcategoryId: number, state: any, productId: number) => {
  switch (Number(subcategoryId)) {
    case 17: // Crankset
      return `mutation { newCrankset(
        productId: ${productId},
        crankLength: ${state.crankLength || null},
        ringType: ${state.ringType || null},
        spindleType: ${state.spindleType || null},
        spindleLength: ${state.spindleLength || null},
        pedalThreadSize: ${state.pedalThreadSize ? `"${state.pedalThreadSize}"` : null},
        bcd: ${state.bcd || null},
        speed: ${state.speed || null},
        )
      { insertId } }`;

    default:
      return "";
  }
};

export const subcategories: Array<SubcategoryObject> = [
  {
    subcategoryId: 13,
    subcategoryName: "Bar Tape / Grips",
    specs: [
      {
        name: "Style",
        specType: "select",
        values: [
          {
            name: "Bar Tape",
            value: 1,
          },
          {
            name: "Grips",
            value: 2,
          },
        ],
      },
    ],
  },
  {
    subcategoryId: 20,
    subcategoryName: "Cassette",
    specs: [
      {
        name: "Speeds",
        specType: "input",
        options: {
          inputType: "number",
        },
      },
      {
        name: "Gear Range",
        specType: "input",
      },
      {
        name: "Freehub Style",
        specType: "select",
        values: [
          {
            name: "Shimano Road HyperGlide 8/9/10",
            value: 1,
          },
          {
            name: "Shimano Road HyperGlide 11",
            value: 2,
          },
          {
            name: "Shimano Mountain HyperGlide 8/9/10/11",
            value: 3,
          },
          {
            name: "Shimano MicroSpline",
            value: 4,
          },
          {
            name: "Shimano HyperGlide 7",
            value: 8,
          },
          {
            name: "Sram XD",
            value: 5,
          },
          {
            name: "Sram XDR",
            value: 6,
          },
          {
            name: "Campagnolo N3W",
            value: 7,
          },
          {
            name: "Campagnolo 10/11/12",
            value: 8,
          },
          {
            name: "Campagnolo 9",
            value: 9,
          },
        ],
      },
    ],
  },
  {
    subcategoryId: 9,
    subcategoryName: "Rear Derailleur",
    specs: [
      {
        name: "Speeds",
        specType: "input",
        options: {
          inputType: "number",
        },
      },
      {
        name: "Mechanical or Electronic",
        specType: "select",
        values: [
          {
            name: "Mechanical",
            value: 1,
          },
          {
            name: "Electronic",
            value: 2,
          },
        ],
      },
      {
        name: "Actuation",
        specType: "select",
        values: [
          {
            name: "Shimano 12 Road",
            value: 1,
          },
          {
            name: "Shimano 11 Road",
            value: 2,
          },
          {
            name: "Shimano 10 Road - 4700 and Newer",
            value: 3,
          },
          {
            name: "Shimano 10 Road - 4600 and Older",
            value: 4,
          },
          {
            name: "Shimano 9",
            value: 5,
          },
          {
            name: "Shimano 7/8",
            value: 6,
          },
          {
            name: "Sram X Actuation",
            value: 6,
          },
          {
            name: "Sram 1:1 Actuation",
            value: 6,
          },
          {
            name: "MicroShift Advent X / Sword",
            value: 7,
          },
          {
            name: "MicroShift Advent",
            value: 8,
          },
          {
            name: "MicroShift Acolyte",
            value: 9,
          },
        ],
      },
      {
        name: "Cage Length",
        specType: "select",
        values: [
          {
            name: "Short",
            value: 1,
          },
          {
            name: "Medium",
            value: 2,
          },
          {
            name: "Long",
            value: 3,
          },
        ],
      },
      {
        name: "Chain Wrap Capacity",
        specType: "input",
        options: {
          inputType: "number",
        },
      },
    ],
  },
  {
    subcategoryId: 17,
    subcategoryName: "Crankset",
    specs: [
      {
        name: "Crank Length",
        specType: "input",
        options: {
          inputType: "number",
        },
      },
      {
        name: "Spindle Type",
        specType: "select",
        values: [
          {
            name: "Square Taper - JIS",
            value: 1,
          },
          {
            name: "Square Taper - ISO",
            value: 2,
          },
          {
            name: "Sram - GXP",
            value: 3,
          },
          {
            name: "Sram - DUB",
            value: 4,
          },
          {
            name: "Sram - PowerSpline",
            value: 5,
          },
          {
            name: "ISIS",
            value: 6,
          },
          {
            name: "FSA - MegaExo 24mm",
            value: 7,
          },
          {
            name: "FSA - MegaExo 19mm",
            value: 8,
          },
          {
            name: "Shimano - Octalink V1",
            value: 9,
          },
          {
            name: "Shimano - Octalink V2",
            value: 10,
          },
          {
            name: "Shimano - Hollowtech 2",
            value: 11,
          },
          {
            name: "PF41 BB86/92",
            value: 12,
          },
          {
            name: "BB386/392 EVO",
            value: 13,
          },
          {
            name: "BB30 / PF30",
            value: 14,
          },
        ],
      },
      {
        name: "Ring Type",
        specType: "select",
        values: [
          {
            name: "None",
            value: 1,
          },
          {
            name: "Single - 3/32",
            value: 2,
          },
          {
            name: "Single - 1/8",
            value: 3,
          },
          {
            name: "Single - Chain Retaining Ring",
            value: 4,
          },
          {
            name: "Double",
            value: 5,
          },
          {
            name: "Triple",
            value: 6,
          },
        ],
      },
      {
        name: "Pedal Thread Size",
        specType: "select",
        values: [
          {
            name: "9/16 in",
            value: "9/16",
          },
          {
            name: "1/2 in",
            value: "1/2",
          },
        ],
      },
    ],
  },
];

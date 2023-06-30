export const obtainCategory = (rotation, antiquity, km) => {
  switch (rotation) {
    case "A":
      switch (true) {
        case antiquity <= 4:
          switch (true) {
            case km <= 60000:
              return "A";
            case km >= 60001 && km <= 120000:
              return "B";
            case km >= 120001 && km <= 200000:
              return "D";
            case km >= 200001:
              return "E";
          }
          break;
        case antiquity >= 5 && antiquity <= 6:
          switch (true) {
            case km <= 100000:
              return "B";
            case km >= 100001 && km <= 200000:
              return "D";
            case km >= 200001:
              return "E";
          }
          break;
        case antiquity >= 7 && antiquity <= 10:
          switch (true) {
            case km <= 120000:
              return "C";

            case km >= 120001 && km <= 200000:
              return "D";

            case km >= 200001:
              return "E";
          }
          break;
        case antiquity >= 11:
          return "E";
      }
      break;
    case "M":
      switch (true) {
        case antiquity <= 10:
          switch (true) {
            case km <= 100000:
              return "C";

            case km >= 100001 && km <= 200000:
              return "D";

            case km >= 200001:
              return "E";
          }
          break;
        case antiquity >= 11:
          return "E";
      }
      break;
    case "B":
      return "E";
  }
};

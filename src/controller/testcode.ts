// const data = [
//     {
//       countryCode: "KR",
//       bizRegNo: "12",
//       dunsNo: "1",
//       taxId: "213142",
//       createData: "2023-09-24",
//     },
//     {
//       countryCode: "KR",
//       bizRegNo: "13",
//       dunsNo: "1",
//       taxId: "213142",
//       createData: "2023-09-23",
//     },
//     {
//       countryCode: "",
//       bizRegNo: "14",
//       dunsNo: "1",
//       taxId: "",
//       createData: "2023-09-23",
//     },
//   ];
  
//   // Group the data by 'dunsNo' value
//   const groupedData = data.reduce((acc, item) => {
//     if (item.dunsNo in acc) {
//       acc[item.dunsNo].push(item);
//     } else {
//       acc[item.dunsNo] = [item];
//     }
//     return acc;
//   }, {});
  
//   // Find the item with the highest count of non-empty keys, and in case of a tie, select the item with the latest 'createData' and 'bizRegNo'
//   const result = Object.values(groupedData).map((group) => {
//     let maxCount = 0;
//     let selectedItem = null;
  
//     for (const item of group) {
//       const nonEmptyKeys = Object.keys(item).filter((key) => item[key] !== "");
//       if (nonEmptyKeys.length > maxCount || (nonEmptyKeys.length === maxCount && item.createData > selectedItem.createData)) {
//         maxCount = nonEmptyKeys.length;
//         selectedItem = item;
//       }
//     }
  
//     return selectedItem.bizRegNo;
//   });
  
//   console.log(result); // Output: ['12']
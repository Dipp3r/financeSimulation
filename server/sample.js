let arr = ["<b>PVC Creations</b> partners California-based Martian Watches.",
"Not too many people eating cone pizzas today: <b>Block Party Delicacy</b>, The license of a Cone Pizza outlet at Gajraula area on NH-24 here has been revoked by the authorities after its sauce was found to be 'below standard'.",
"<b>B.O Thai International</b> exits parent company, sells 3.2% stake to Chivas Regal.",
"Top Indian bank launches prepaid medical card with <b>Rip Aide hospitals</b>."];
let list = [];
let mainList = [];
let count = 3;
arr.forEach((element, index) => {
  console.log(index % count == 0  ,index >= count)
  if (index % count == 0 && index >= count) {
    mainList.push(list);
    list = [];
  }
  list.push(element);
});
mainList.push(list)
console.log(mainList)
mainList.map(element => {
  element.map(news => {
    console.log(news)
  })
})
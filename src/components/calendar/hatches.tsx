import "firebase/database";
import styled from "styled-components";
import Title from "../../styles/title";
import React, { useState, useEffect } from "react";

import colorFinder from "../../lib/kalendar/colorFinder";
import firebase from "../../lib/firebase/firebase";
import months from "../../lib/time/months";
import monthCheck from "../../lib/kalendar/monthCheck";
import pluralCheck from "../../lib/time/pluralCheck";
import monthsLenght from "../../lib/time/monthsLenght";
import mainTime from "../../lib/time/mainTime";
import weekDays from '../../lib/time/weekDay';

const Hatch = styled.div`
  box-shadow: 1px 1px 8px 6px rgba(58, 58, 58, 0.096);
  border-radius: 1rem;
  width: 8vw;
  height: auto;
  text-align: center;
  background-color: rgba(${(props) => props.color});

  @media only screen and (max-height: 768px) {
    width: 10vw;
    }

`;




const Text = styled(Title)`
  font-size: ${props => props.size};
  padding-top: 0vh;

  @media only screen and (max-height: 768px) {
    font-size: 0.6rem;
    }

`;

const Alert = styled(Text)`
  font-size: 1rem;

  @media only screen and (max-height: 768px) {
    font-size: 0.85rem;
    }
`;

// stuff

const currentMonth = mainTime().getMonth();
const database = firebase.firestore();
const calendarStart: number = 24;
const calendarEnd: number = 0;
let day: number = mainTime().getDate()  
const monday: number = (mainTime().getDay() -1)
day -= monday

function daysLeft(i) {
  if (day + i - day === 0) {
    return pluralCheck(day + i - day, "", "", "")[0];
  } else {
    return (
      day + i - day  +" " + pluralCheck(day + i - day, "", "", "")[0] + " " + "kvar"
    );
  }
}



function multiTest(data, language, ugg, weekIndex, i, state) {
  let target = new Array();
  let emoji: string = "";
  const date = monthCheck(i + day, currentMonth);
  let count: number = 0


  
  

  let weekDay = weekDays[weekIndex] 




  if (i === monday) {
    emoji += "📍";
  }

  let filterData: number[] = []

  for (const item in data) {

    if (i + day == data[item][2]) {
      
      if (data[item][6] === "MO" && data[item][4] === language) {
        count += 1
        filterData.push(data[item])
        target = data[item];
      } 
      
      if (data[item][6] === ugg || data[item][6] === "alla" ) {
        count += 1
        filterData.push(data[item])
        target = data[item];
      }
    } 
    
    if (data[item][2] < day + calendarEnd ) {

      if ( currentMonth - data[item][1] === currentMonth || Math.abs(currentMonth - data[item][1]) != currentMonth) {
        data[item][2] = data[item][2] + monthsLenght[currentMonth]
      }
      
    }
  }

  function dup(time) {
    let output = []
    for (const item in filterData) {
      if (filterData[item][2] === time) {
        output.push( <Hatch color={colorFinder(filterData[item][4], "1")} > <Text size="1em"> {date[0]} {months[date[1]]}  {filterData[item][4]}   </Text> <Alert>{filterData[item][5]}  </Alert> <Text size="0.7em">  {filterData[item][3].start[0]}:{filterData[item][3].start[1]} - {filterData[item][3].end[0]}:{filterData[item][3].end[1]} <p> {daysLeft(i)} <br></br> {weekDay} </p>  </Text> </Hatch>)
      }
    }

    return output
  }

  

  if (target[0] === undefined) {
    return (
      <>
      <Hatch   key={i}>
        {date[0]} {months[date[1]]} {emoji} <br></br>{weekDay}
      </Hatch>
      </>

    );
  } else {
    if (day > i + day) {
      return (
        <Hatch  color={colorFinder(target[4], "0.1")} key={i}>{date[0]} {months[date[1]]} {emoji} {target[4]} <Alert>{target[5]} ✔ </Alert> klart  </Hatch>
      );
    } 
    
    
    if (day <= i + day){
      if (count >= 2) {
        return (
          <>
          
          <Hatch onClick={() => state(dup(i + day))} color={colorFinder(target[4], "0.5")} key={i}>  <Text size="1em"> {date[0]} {months[date[1]]}  {emoji} {target[4]} ❗️ </Text> <Alert>{target[5]}  </Alert> <Text size="0.7em">  {target[3].start[0]}:{target[3].start[1]} - {target[3].end[0]}:{target[3].end[1]} <p> {daysLeft(i)} <br></br> {weekDay}</p> </Text> </Hatch>        </>
        ); 
      } 
        return (
          <>
          
          <Hatch  color={colorFinder(target[4], "0.5")} key={i}>  <Text size="1em"> {date[0]} {months[date[1]]}  {emoji} {target[4]}  </Text> <Alert>{target[5]}  </Alert> <Text size="0.7em">  {target[3].start[0]}:{target[3].start[1]} - {target[3].end[0]}:{target[3].end[1]} <p> {daysLeft(i)} <br></br> {weekDay}</p> </Text> </Hatch>        </>
        ); 
      
// fix error later
    }
  }      
}

function calendarGen(ugg, language, totalData, state) {
  let output: any[] = [];
  let weekDay: number = mainTime().getDay() -1 - monday

  

  for (let i = calendarEnd; i < calendarStart; i++) {
    weekDay += 1
    if (weekDay >= 7) {
      weekDay -= 7
    }

    let bruh = ""

    if (i === monday) {
      bruh += "📍";

    }

    if (weekDay === 6 || weekDay === 0) {
      output.push(<Hatch key={i} color={colorFinder("en", "0.4")}> {monthCheck(i + day, currentMonth)[0]}  {months[monthCheck(i + day, currentMonth)[1]]}   {bruh}  <Alert>Helg🌴</Alert> {weekDays[weekDay]} </Hatch>)
    } else {
        output.push(multiTest(totalData, language, ugg, weekDay, i, state));
        
      }
    
  }




  return output;
}


export default function Hatches(props) {
  let array = new Array();

  const [totalData, setTotalData] = useState(new Array());

  useEffect(() => {
    database
      .collection("prov")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          array.push(doc.data().prov);
        });

        setTotalData(array);

      });
  }, []);
  
  return <>
  

  

  {calendarGen(props.ugg, props.language, totalData, props.state)} </>;
}
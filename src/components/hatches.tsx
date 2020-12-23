import "firebase/database";
import styled from "styled-components";
import Title from '../styles/title'
import React, { useState, useEffect } from 'react';

import colorFinder from '../lib/kalendar/colorFinder'
import firebase from '../lib/firebase/firebase'
import months from '../lib/time/findMonth'
import monthCheck from '../lib/time/monthUpdate'

const Hatch = styled.div `
box-shadow: 1px 1px 8px 6px rgba(58, 58, 58, 0.096);
border-radius: 10px;
width: 10vw;
text-align: center;
background-color: ${props => props.color} ;
`

const HatchClose = styled(Hatch) `

background-image: linear-gradient(120deg, rgba(214, 22, 8, 0.658) , rgba(187, 6, 30, 0.616));
color: rgba(43, 43, 43, 0.836);

`

const Text = styled(Title) `
  font-size: 1.6vw;
  padding-top: 0vh;
`

const Alert = styled(Text) `
font-size: 1.2vw;
`


// stuff
const day = new Date().getDate()
const currentMonth = new Date().getMonth()
const database = firebase.firestore();
let graphLength: number = 24




function multiTest(data, i, date) {
  let target = new Array()
g
  for (const meme in data) {
    if (i + day == data[meme][2] ) {
      target[0] = data[meme]
      return <Hatch color={colorFinder(target[0][4])} key={i}>{date[0]} {months[date[1]]} {target[0][4]} <Alert>{target[0][5]} </Alert></Hatch>
    } else {console.log("daws")}
  }

  if (target[0] === undefined) {
    return <Hatch key={i}>{date[0]} {months[date[1]]} </Hatch>
  }

}



function calendarGen(props, totalData) {
  let array: any[] = []
  

  for (let i = 0; i < graphLength; i++) {
    const date = monthCheck(i + day, currentMonth)
  
    switch (props) {
      case "091":
        array.push(multiTest(totalData[0], i, date))
        break;
      case "092":
        array.push(multiTest(totalData[1], i, date))
        break;
      case "093":
        array.push(multiTest(totalData[2], i, date))
        break;
    }
  
  }
  return array
}

export default function Hatches(props) {
  let array = new Array()


  // states
const [Data, setData] = useState(new Array(new Array(), new Array(), new Array()))
const [totalData, setTotalData] = useState(new Array())

useEffect(() => {
  database.collection('prov').get().then((snapshot) =>{
    snapshot.docs.forEach(doc => {
        array.push(doc.data().prov)

    })

  for (let i = 0; i < graphLength; i++) {
    for (const c in array) {
      if (i + day === array[c][2]) {

        switch(array[c][6]) {
          case "091":
            Data[0].push(array[c])
            break;
          case "092":
            Data[1].push(array[c])
            break;
          case "093":
            Data[2].push(array[c])
            break;
        }

      } 
    }
  }

setTotalData(Data)

})
}, []);


return calendarGen(props, totalData)
}



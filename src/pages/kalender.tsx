import React, { useState, useEffect }from "react";
import Hatches from "../components/calendar/calendarMaker"; 
import Header from '../components/header'
import styled from "styled-components";
import Title from '../styles/title'
import stressPT from '../lib/calendar/stressPT'
import GlobalStyle from "../theme/GlobalStyles"
import Select from 'react-select'
import ClassChart from '../components/calendar/classChart'
import LineChart from '../components/calendar/lineChart'
import Btn from '../styles/btn'
import testData from '../lib/calendar/testData'
import NewsPad from '../styles/newsPad'
const uggarOption = [
  { value: 'O91', label: 'O91' },
  { value: 'O92', label: 'O92' },
  { value: 'O93', label: 'O93' }
]

const languageOption = [
  { value: 'TY', label: 'Tyska' },
  { value: 'FR', label: 'Franska' },
  { value: 'SP', label: 'Spanska (AAV)' },
  { value: 'SP', label: 'Spanska (CTH)' },
  { value: 'ASVEN', label: 'ASVEN' }
]
const Calendar = styled.div `
padding-top: 3vh;
display: grid;
justify-self: auto;
justify-content: center;
        
grid-template-columns: repeat(7, 17vh);
grid-row-gap: 3vh;

`

const Popup = styled.div `
  display: ${(props) => props.display};
  
  position: fixed;
  left: 50%;
  transform: translate(-50%);
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 1px 1px 8px 6px rgba(39, 39, 39, 0.096);
  padding: 1rem;

  
`;

const Selection = styled(Select) `
    position: static;
    width: 20vh;

    margin-left: 1rem ;


`
const Bar = styled.ul `
    padding-top: 1vh;
    display: flex;
    margin-left: 20vw;
    overflow: visible;

    @media only screen and (max-height: 768px) {
      margin-left: 15vw;
    }
    
`

const PadButton = styled(Btn) `
margin-top: 1vh;
padding: 1.5vh 1vw;
font-size: 0.75em;
`

const Array = styled.div `
display: flex;
justify-self: auto;
grid-column-gap: 2vh; 
`

function labelFind(lan) {
  const list = [languageOption[0].value, languageOption[1].value, languageOption[2].value, languageOption[3].value, languageOption[4].value]
  return list.indexOf(lan)
}
export default function Kalender() {

  const [multiTest, setMultiTest] = useState("none")
  
  const [ugg, setUgg] = useState("O91")
  const [language, setLanguage] = useState("TY")

  //Json! (localStorage)
  let temp_Json = {"studentValues": {
    "ugg": ugg,
    "language": language
  }}
  
  useEffect(() => {
    if (localStorage.getItem('StudentData') !== null) {
      let student_deserialized = JSON.parse(localStorage.getItem('StudentData')).studentValues
      setLanguage(student_deserialized.language)
      setUgg(student_deserialized.ugg)
    } 

  }, [])

  
  useEffect(() => {
    localStorage.setItem('StudentData', JSON.stringify(temp_Json))
  }, [ugg, language])
  
  let importTestData = testData()


  let stress = stressPT(ugg, language, importTestData, new Date().getDate())[1]





  function defcon(stress, base, incr) {

    const emojiArray = ['😎', '🙂', '😕', '😬', '😟', '😡', '🤬']

    for (let i = 0; i <= emojiArray.length ; i+=1) {
      if (stress <= (incr * i) + base) {
        return emojiArray[i]
      } else if (stress > (incr * emojiArray.length) + base) {
        return emojiArray[emojiArray.length - 1]
      }
    }

  }

  return (
    <>
    <GlobalStyle/>

    <Header title="Provschema"/>
    

    
        <Title top="0vh">
        Provschema 
        </Title> 
        <Title sub top="0vh">
        Här kan du snabbt kolla kommande prov {defcon(stress, 125, 75)} ({stress}) <small>beta*🧪</small>                           
        </Title>
        
      <Bar> 

      <Selection isSearchable={ false } options={uggarOption} value={{label: ugg}} onChange={(prop) =>  setUgg(prop.value) } />
      <Selection isSearchable={ false } options={languageOption} value={{label: languageOption[labelFind(language)].label}}  onChange={(prop) =>  setLanguage(prop.value) } />
      </Bar>

    

      <Popup display={multiTest}>  <Array> {multiTest}</Array><PadButton onClick={() => setMultiTest("none")}>Stäng</PadButton></Popup>


      
        <Calendar><Hatches len={24} state={setMultiTest} data={importTestData} ugg={ugg} language={language} /></Calendar>



      <ClassChart data={importTestData} ugg={ugg} language={language}/>
      <LineChart  data={importTestData} len={24} ugg={ugg} language={language}/>
 
    </>
  );
}

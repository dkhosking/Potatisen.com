import stressPT from '../../lib/calendar/stressPT'
import { Line } from 'react-chartjs-2'
import 'react-chartjs-2'

import months from '../../lib/time/months'
import monthCheck from '../../lib/calendar/monthUpdate'
export default function classChart(props) {
    let day: number = new Date().getDate()
    let data = new Array()
    let time = new Array()
    let currentMonth = new Date().getMonth()
  


    for (let i: number = 0; i < props.len; i++) {
            data.push(stressPT(props.ugg, props.language, props.data, day + i)[1])
            time.push(monthCheck(i + day, currentMonth)[0] + " " + months[monthCheck(i + day, currentMonth)[1]])
             
    }


    return <Line
    height={200} 
    width={600}
    options={{
        matainAspectRatio: true,
        responsive: true,
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true
                    }
                }
            ]
        },
        legend: {
            labels: {
                fontSize: 20,
                fontColor: 'black',

            }
        },
        layout: {
            padding: {
                width: '50%'
            }
        }
    }} 
    data={{
        labels: time,
        datasets: [{
            lineTension: 0,
            label: `Kommande arbets nivå (${props.ugg}, ${props.language})`,
            data: data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1

        }]
    }}
    />
}
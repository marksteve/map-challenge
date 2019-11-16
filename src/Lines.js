import React, { useState, useEffect } from 'react'
import DeckGL from '@deck.gl/react'
import Papa from 'papaparse'
import groupBy from 'lodash/groupBy'
import { ArcLayer, ScatterplotLayer } from '@deck.gl/layers'
import { StaticMap, HTMLOverlay } from 'react-map-gl'

// Initial viewport settings
const initialViewState = {
  longitude: 121.05,
  latitude: 14.605,
  zoom: 13
  // pitch: 60,
  // bearing: 90
}

const colors = {
  TS: [254, 235, 226],
  Centro: [251, 180, 185],
  ROX: [247, 104, 161],
  CCM: [174, 1, 126],
  Insync: [161, 218, 180],
  MyTown: [65, 182, 196],
  Trion: [34, 94, 168]
}

const hexColors = {
  TS: '#feebe2',
  Centro: '#fbb4b9',
  ROX: '#f768a1',
  CCM: '#ae017e',
  Insync: '#a1dab4',
  MyTown: '#41b6c4',
  Trion: '#225ea8'
}

const gyms = [
  { name: 'TS', coordinates: [121.0699803, 14.6638848] },
  { name: 'Centro', coordinates: [121.050104, 14.613009] },
  { name: 'ROX', coordinates: [121.0496649, 14.5507369] },
  { name: 'CCM', coordinates: [121.0539248, 14.5785396] }
]

const home = [
  { name: 'Insync', coordinates: [121.065045, 14.636169] },
  { name: 'MyTown', coordinates: [121.046528, 14.55767] },
  { name: 'Trion', coordinates: [121.049765, 14.545863] }
  // { name: 'BHive', coordinates: [121.01895, 14.575236] },
]

function drawOverlay (width, height, project, unproject) {
  return (
    <div className='overlay'>
      <h1>Climb is Life</h1>
      <p>
        This map shows my daily trips to and fro climbing gyms and home.
        <br />
        Data is from my Google Location History from May 2015 to June 2019.
      </p>
      <div className='legend'>
        <div className='column'>
          <h2>Gym</h2>
          {gyms.map((loc, i) => (
            <div key={i} style={{ color: hexColors[loc.name] }}>
              <span>{loc.name}</span>
            </div>
          ))}
        </div>
        <div className='column'>
          <h2>Home</h2>
          {home.map((loc, i) => (
            <div key={i} style={{ color: hexColors[loc.name] }}>
              <span>{loc.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Lines (props) {
  const [data, setData] = useState([])
  useEffect(() => {
    Papa.parse('/data/points.csv', {
      download: true,
      header: true,
      complete: res => {
        let t = 0
        const data = Object.entries(groupBy(res.data, 'date')).reduce((
          data,
          [date, locations]
        ) => {
          const dayLoc = []
          for (let i = 0; i < locations.length - 1; i++) {
            const from = locations[i]
            const to = locations[i + 1]
            dayLoc.push({ t, from, to })
            t += 1
          }
          return [...data, ...dayLoc]
        }, [])
        setData(data)
      }
    })
  }, [])
  return (
    <DeckGL width='2048px' height='2048px' initialViewState={initialViewState}>
      <StaticMap
        mapboxApiAccessToken={window.MAPBOX_ACCESS_TOKEN}
        mapStyle='mapbox://styles/marksteve/ck2uljtgc3f311cnywnhayzq3/draft'
        {...props}
      >
        <HTMLOverlay redraw={drawOverlay} />
      </StaticMap>
      <ArcLayer
        data={data}
        getWidth={1}
        getTilt={d => (90 * d.t) / data.length}
        getSourcePosition={d => [d.from.lng, d.from.lat]}
        getTargetPosition={d => [d.to.lng, d.to.lat]}
        getSourceColor={d => colors[d.from.name]}
        getTargetColor={d => colors[d.to.name]}
      />
      <ScatterplotLayer
        data={[...gyms, ...home]}
        opacity={0.1}
        stroked={false}
        radiusScale={6}
        radiusMinPixels={1}
        radiusMaxPixels={100}
        getPosition={d => d.coordinates}
        getRadius={d => 15}
        getFillColor={d => colors[d.name]}
        filled
      />
    </DeckGL>
  )
}

export default Lines

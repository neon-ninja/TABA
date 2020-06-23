import React, {Component} from 'react'
import {StaticMap} from 'react-map-gl'
import { DeckGL } from 'deck.gl';
import FlowMapLayer from '@flowmap.gl/core'
import geoViewport from '@mapbox/geo-viewport'
import Papa from "papaparse"
import ClusteringExample from "./ClusteringExample";

import './App.css'

const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;

const INITIAL_VIEW_STATE = {
  latitude: -41.235726,
  longitude: 172.5118422,
  zoom: 5,
  bearing: 0,
  pitch: 0
};

const colors = {
  flows: {
    scheme: [
      // Teal scheme from https://carto.com/carto-colors/
      '#d1eeea','#a8dbd9','#85c4c9','#68abb8','#4f90a6','#3b738f','#2a5674'
    ],
  },
  locationAreas: {
    outline: 'rgba(92,112,128,0.5)',
    normal: 'rgba(187,187,187,0.5)',
    selected: 'rgba(217,130,43,0.5)',
  },
}


Papa.parsePromise = function(file) {
  return new Promise(function(complete, error) {
    Papa.parse(file, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete,
      error
    });
  });
};

export default class App extends Component {
  state = {
    locations: null,
    flows: null,
    time: 0
  }

  componentDidMount() {
    
    Promise.all([
      Papa.parsePromise("https://neon-ninja.github.io/TABA/travel.csv"),
      Papa.parsePromise("https://neon-ninja.github.io/TABA/sa2_centroids.csv")
    ]).then(([travel, sa2_centroids]) => {
      console.log(travel, sa2_centroids, this.state)
      this.setState({
        flows: travel.data,
        locations: sa2_centroids.data
      })
    })
  }

  render() {
    const { locations, flows } = this.state
    const layers = []
    if (locations && flows) {
      return (
        <ClusteringExample
          locations={locations}
          flows={flows}
          getLocationId={(loc) => loc.code}
          getLocationCentroid={(loc) => [loc.longitude, loc.latitude]}
          getFlowOriginId={(flow) => flow.home_SA2}
          getFlowDestId={(flow) => flow.work_SA2}
          getFlowMagnitude={(flow) => flow.Total}
        />
      )
    }
    return null

  }
}

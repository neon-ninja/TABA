import React, {Component} from 'react'
import Papa from "papaparse"
import ClusteringExample from "./ClusteringExample";

import './App.css'

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

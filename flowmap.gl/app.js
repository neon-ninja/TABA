import {Deck} from '@deck.gl/core';
import FlowMapLayer from '@flowmap.gl/core';
import mapboxgl from 'mapbox-gl';
import Papa from "papaparse";

const INITIAL_VIEW_STATE = {
  latitude: -41.235726,
  longitude: 172.5118422,
  zoom: 5,
  bearing: 0,
  pitch: 0
};

// Set your mapbox token here
mapboxgl.accessToken = process.env.MapboxAccessToken; // eslint-disable-line

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

Promise.all([
  Papa.parsePromise("https://neon-ninja.github.io/TABA/travel.csv"),
  Papa.parsePromise("https://neon-ninja.github.io/TABA/sa2_centroids.csv")
]).then(([travel, sa2_centroids]) => {
    console.log(travel.data, sa2_centroids.data);

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      // Note: deck.gl will be in charge of interaction and event handling
      interactive: false,
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
      bearing: INITIAL_VIEW_STATE.bearing,
      pitch: INITIAL_VIEW_STATE.pitch
    });

    new Deck({
      canvas: 'deck-canvas',
      width: '100%',
      height: '100%',
      initialViewState: INITIAL_VIEW_STATE,
      controller: true,
      onViewStateChange: ({viewState}) => {
        map.jumpTo({
          center: [viewState.longitude, viewState.latitude],
          zoom: viewState.zoom,
          bearing: viewState.bearing,
          pitch: viewState.pitch
        });
      },
      layers: [
        new FlowMapLayer({
          id: 'TABA',
          locations: sa2_centroids.data,
          darkMode: true,
          flows: travel.data,
          //animate: true,
          getFlowMagnitude: f => f.Total || 1,
          getFlowOriginId: f => f.home_SA2,
          getFlowDestId: f => f.work_SA2,
          getLocationId: sa2 => sa2.code,
          getLocationCentroid: sa2 => [sa2.longitude, sa2.latitude],
          pickable: true
        })
      ]
    });


  });

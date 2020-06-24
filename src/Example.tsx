/*
 * Copyright 2019 Teralytics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { Flow, FlowAccessors, FlowLayerPickingInfo, Location, LocationAccessors } from '@flowmap.gl/core';
import FlowMap, { Highlight, LegendBox, LocationTotalsLegend } from '@flowmap.gl/react';
import React from 'react';
import { ViewState } from '@flowmap.gl/core';
import * as d3scaleChromatic from 'd3-scale-chromatic';

export const mapboxAccessToken = process.env.REACT_APP_MapboxAccessToken;

export interface Props extends FlowAccessors, LocationAccessors {
  locations: Location[];
  flows: Flow[];
  onViewStateChange?: (viewState: ViewState) => void;
}

interface State {
  tooltip: FlowLayerPickingInfo | undefined;
}

const tooltipStyle: React.CSSProperties = {
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: 1,
  background: '#125',
  color: '#fff',
  fontSize: 9,
  borderRadius: 4,
  padding: 5,
  maxWidth: 300,
  maxHeight: 300,
  overflow: 'hidden',
  boxShadow: '2px 2px 4px #ccc',
};

const DARK_COLORS = {
  //darkMode: true,
  flows: {
    scheme: (d3scaleChromatic.schemeSpectral[d3scaleChromatic.schemeSpectral.length - 1] as string[]).slice().reverse(),
  },
  /*
  locationAreas: {
    normal: '#334',
  },
  outlineColor: '#000',
  */
};

export default class Example extends React.Component<Props, State> {
  state: State = {
    tooltip: undefined,
  };
  private readonly initialViewState: ViewState;

  constructor(props: Props) {
    super(props);
    this.initialViewState = {
      latitude: -41.235726,
      longitude: 172.5118422,
      zoom: 5,
      bearing: 0,
      pitch: 0
    };
  }

  handleViewStateChange = (viewState: ViewState) => {
    const { onViewStateChange } = this.props;
    if (onViewStateChange) {
      onViewStateChange(viewState);
    }
    const { tooltip } = this.state;
    if (tooltip) {
      this.setState({ tooltip: undefined });
    }
  };

  handleHighlight = (highlight: Highlight | undefined, info: FlowLayerPickingInfo | undefined) => {
    if (!info) {
      this.setState({ tooltip: undefined });
    }
    this.setState({
      //tooltip: info,
    });
  };

  renderTooltip() {
    const { tooltip } = this.state;
    if (!tooltip) {
      return null;
    }
    const { object, x, y } = tooltip;
    if (!object) {
      return null;
    }
    return (
      <pre
        style={{
          ...tooltipStyle,
          left: x,
          top: y,
        }}
      >
        {JSON.stringify(object, null, 2)}
      </pre>
    );
  }

  render() {
    const { flows, locations, getLocationId, getLocationCentroid, getFlowMagnitude } = this.props;
    return (
      <>
        <FlowMap
          pickable={true}
          initialViewState={this.initialViewState}
          showTotals={true}
          //showLocationAreas={false}
          colors={DARK_COLORS}
          flows={flows}
          locations={locations}
          mapStyle="mapbox://styles/mapbox/dark-v10"
          animate={true}
          opacity={1}
          mixBlendMode="screen"
          mapboxAccessToken={mapboxAccessToken}
          getLocationId={getLocationId}
          getLocationCentroid={getLocationCentroid}
          getFlowMagnitude={getFlowMagnitude}
          onViewStateChange={this.handleViewStateChange}
          onHighlighted={this.handleHighlight}
        />
        <LegendBox bottom={35} right={10}>
          <LocationTotalsLegend colors={DARK_COLORS} />
        </LegendBox>
        {this.renderTooltip()}
      </>
    );
  }
}

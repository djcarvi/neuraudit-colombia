import { Fragment } from 'react'
import { MapContainer, TileLayer, CircleMarker , Popup, Polyline, Rectangle, Polygon, Circle }  from "react-leaflet";
import "leaflet/dist/leaflet.css";
const SpkLeaflet = ({ position,
  Circlepostion, Zoom, scrollWheel, Customclass, Id, CirclepathOptions, MarkerpathOptions, PolylinepathOptions,
  Polyllinepositions, PolygonpathOptions, Polygonposition, ReactanglepathOptions, Bounds, MUltipolygonposition, Multipolyineposition
}: any) => {
  return (
    <Fragment>
      <MapContainer center={position} zoom={Zoom} scrollWheelZoom={scrollWheel} className={Customclass} id={Id} style={{ height: "300px" }}>

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Id === "leaflet3" ?
          <Circle center={Circlepostion} pathOptions={CirclepathOptions} radius={200} />
          : ''
        }
        {(Id === "leaflet3" || Id === "leaflet2") ?
          <CircleMarker
            center={[51.51, -0.12]}
            pathOptions={MarkerpathOptions}
            radius={20}
          >
            <Popup>Popup in CircleMarker</Popup>
          </CircleMarker>
          : ''
        }

        {Id === "leaflet3" ?
          <>
            <Polyline pathOptions={PolylinepathOptions} positions={Polyllinepositions} />
            <Polyline pathOptions={PolylinepathOptions} positions={Multipolyineposition} />
            <Polygon pathOptions={PolygonpathOptions} positions={Polygonposition} />
            <Polygon pathOptions={PolygonpathOptions} positions={MUltipolygonposition} />
            <Rectangle bounds={Bounds} pathOptions={ReactanglepathOptions} />
          </>
          : ''
        }

      </MapContainer>
    </Fragment>
  )
}

export default SpkLeaflet